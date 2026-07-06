import { useState, useEffect, useMemo } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { Scale, Target, Plus, Edit3, Trash2, Activity, ChevronRight } from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';
import { db } from '../db/db';

const MILESTONES = [
  { label: '18% BF Target', weight: null },
  { label: '15% BF Target', weight: null },
  { label: '12% BF Target', weight: null },
];

function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div
        className="px-3 py-2 rounded-xl border"
        style={{
          background: 'rgba(24,24,27,0.9)',
          backdropFilter: 'blur(12px)',
          borderColor: 'rgba(255,255,255,0.1)'
        }}
      >
        <p className="text-[10px] text-zinc-400 font-bold uppercase mb-1 tracking-wider">{label}</p>
        {payload.map((entry, idx) => (
          <p key={idx} className="text-sm font-bold flex items-center gap-1.5" style={{ color: entry.color }}>
            <span className="w-2 h-2 rounded-full" style={{ background: entry.color }} />
            {entry.name}: {entry.value} kg
          </p>
        ))}
      </div>
    );
  }
  return null;
}

function LogWeightModal({ isOpen, onClose, editingEntry }) {
  const [weight, setWeight] = useState('');
  const [waist, setWaist] = useState('');
  const [height, setHeight] = useState('');

  useEffect(() => {
    if (editingEntry) {
      setWeight(editingEntry.weight_kg.toString());
      setWaist(editingEntry.waist_cm ? editingEntry.waist_cm.toString() : '');
      setHeight(editingEntry.height_cm ? editingEntry.height_cm.toString() : '');
    } else {
      setWeight('');
      setWaist('');
      db.bodyLogs.orderBy('date').reverse().filter(x => !!x.height_cm).first().then((lastLog) => {
        if (lastLog) setHeight(lastLog.height_cm.toString());
      });
    }
  }, [editingEntry, isOpen]);

  if (!isOpen) return null;

  async function handleSave() {
    if (!weight) return;
    const dateStr = editingEntry ? editingEntry.date : format(new Date(), 'yyyy-MM-dd');
    const entry = {
      date: dateStr,
      weight_kg: parseFloat(weight),
      waist_cm: waist ? parseFloat(waist) : null,
      height_cm: height ? parseFloat(height) : null,
    };
    try {
      if (await db.bodyLogs.get(dateStr)) await db.bodyLogs.update(dateStr, entry);
      else await db.bodyLogs.add(entry);
      onClose();
    } catch (err) {
      console.error('Failed to save body log:', err);
    }
  }

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="rounded-3xl w-full max-w-sm p-6 space-y-5 shadow-2xl border"
        style={{ background: 'linear-gradient(145deg, rgba(30,30,36,0.95), rgba(18,18,22,0.95))', borderColor: 'rgba(255,255,255,0.08)' }}
        initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 pb-2 border-b border-white/5">
          <div className="w-8 h-8 rounded-xl bg-blue-500/15 flex items-center justify-center">
            <Scale size={14} className="text-blue-400" />
          </div>
          <h2 className="text-sm font-bold text-white tracking-wide">
            {editingEntry ? `Edit Stats (${editingEntry.date})` : 'Log Body Stats'}
          </h2>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] text-blue-400 font-bold uppercase tracking-wider pl-1">Weight (kg) *</label>
            <input
              type="number" step="0.1" value={weight} onChange={(e) => setWeight(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
              placeholder="e.g. 75.5" autoFocus
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider pl-1">Waist (cm)</label>
            <input
              type="number" step="0.1" value={waist} onChange={(e) => setWaist(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-zinc-500 transition-colors"
              placeholder="e.g. 82.0"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider pl-1">Height (cm)</label>
            <input
              type="number" step="1" value={height} onChange={(e) => setHeight(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-zinc-500 transition-colors"
              placeholder="e.g. 175"
            />
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button onClick={onClose} className="flex-1 py-3 rounded-xl bg-zinc-800 text-xs font-bold text-zinc-400 hover:text-white transition-colors">Cancel</button>
          <button onClick={handleSave} disabled={!weight} className="flex-1 py-3 rounded-xl bg-blue-500 text-xs font-bold text-white shadow-[0_0_15px_rgba(59,130,246,0.4)] disabled:opacity-50 transition-all active:scale-95 cursor-pointer">Save Log</button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function BodyTracker() {
  const allLogs = useLiveQuery(() => db.bodyLogs.orderBy('date').reverse().toArray(), []);
  
  const [showModal, setShowModal] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);

  const chartData = useMemo(() => {
    if (!allLogs) return [];
    return [...allLogs].reverse().map(l => ({ ...l, displayDate: format(new Date(l.date + 'T00:00:00'), 'MMM d') }));
  }, [allLogs]);

  const latestLog = allLogs?.[0];

  const derivedStats = useMemo(() => {
    if (!latestLog || !latestLog.height_cm) return null;
    const hMeters = latestLog.height_cm / 100;
    const bmi = (latestLog.weight_kg / (hMeters * hMeters)).toFixed(1);
    let bf = null;
    // RFM Formula for men
    if (latestLog.waist_cm) bf = (64 - (20 * (latestLog.height_cm / latestLog.waist_cm))).toFixed(1);
    return { bmi, bf };
  }, [latestLog]);

  async function handleDelete(date) {
    if (window.confirm('Delete this entry?')) await db.bodyLogs.delete(date);
  }

  function openEdit(entry) {
    setEditingEntry(entry);
    setShowModal(true);
  }

  function openNew() {
    setEditingEntry(null);
    setShowModal(true);
  }

  if (!allLogs) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-1 space-y-6">
      
      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
            Body Tracker
          </h1>
          <p className="text-zinc-500 text-xs mt-1 font-medium">Log and visualize your recomp</p>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-2 bg-blue-500 hover:bg-blue-400 text-white px-4 py-2.5 rounded-2xl text-xs font-bold shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all active:scale-95 cursor-pointer"
        >
          <Plus size={16} />
          <span>Log Stats</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ── Left Column: Current Stats & Milestones ── */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Hero Stat Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
            className="rounded-3xl p-6 border relative overflow-hidden"
            style={{ background: 'linear-gradient(145deg, rgba(30,30,36,0.8), rgba(18,18,22,0.9))', borderColor: 'rgba(255,255,255,0.06)' }}
          >
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-blue-500/20 blur-3xl rounded-full pointer-events-none" />
            
            <p className="text-[10px] uppercase tracking-widest font-bold text-blue-400 mb-2 relative z-10">Current Status</p>
            {latestLog ? (
              <div className="relative z-10 space-y-4">
                <div className="flex items-baseline gap-2">
                  <h2 className="text-5xl font-black text-white">{latestLog.weight_kg}</h2>
                  <span className="text-zinc-500 font-bold">kg</span>
                </div>
                
                {(derivedStats?.bf || derivedStats?.bmi) && (
                  <div className="flex gap-2 pt-2 border-t border-white/5">
                    {derivedStats.bf && (
                      <div className="flex-1 bg-black/30 rounded-xl p-3 border border-white/5">
                        <p className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold mb-1">Est. Body Fat</p>
                        <p className="text-lg font-bold text-white">{derivedStats.bf}%</p>
                      </div>
                    )}
                    {derivedStats.bmi && (
                      <div className="flex-1 bg-black/30 rounded-xl p-3 border border-white/5">
                        <p className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold mb-1">BMI</p>
                        <p className="text-lg font-bold text-white">{derivedStats.bmi}</p>
                      </div>
                    )}
                  </div>
                )}
                <p className="text-[10px] text-zinc-600 font-medium">Last logged: {format(new Date(latestLog.date + 'T00:00:00'), 'MMM d, yyyy')}</p>
              </div>
            ) : (
              <div className="relative z-10 py-6 text-center">
                <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center mx-auto mb-3 border border-blue-500/20">
                  <Scale size={20} className="text-blue-400" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">No Stats Logged</h3>
                <p className="text-xs text-zinc-400 mb-4 px-4">
                  Log your body weight to track your recomp progress and calculate body fat estimates.
                </p>
                <button
                  onClick={openNew}
                  className="bg-blue-500 hover:bg-blue-400 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all cursor-pointer"
                >
                  Log First Entry
                </button>
              </div>
            )}
          </motion.div>

          {/* Milestones Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
            className="rounded-3xl p-5 border"
            style={{ background: 'rgba(24,24,27,0.6)', backdropFilter: 'blur(16px)', borderColor: 'rgba(255,255,255,0.05)' }}
          >
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/5">
              <div className="w-7 h-7 rounded-lg bg-indigo-500/15 flex items-center justify-center">
                <Target size={14} className="text-indigo-400" />
              </div>
              <h3 className="text-xs font-bold text-white uppercase tracking-widest">Milestones</h3>
            </div>
            <div className="space-y-3">
              {MILESTONES.map((m, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-black/20 border border-white/5">
                  <span className="text-sm text-zinc-300 font-medium">{m.label}</span>
                  <span className="text-xs font-bold text-zinc-600 bg-zinc-900 px-2 py-1 rounded-md">Pending</span>
                </div>
              ))}
            </div>
          </motion.div>

        </div>

        {/* ── Right Column: Chart & History ── */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Main Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            className="rounded-3xl p-6 border h-[350px] flex flex-col"
            style={{ background: 'rgba(24,24,27,0.6)', backdropFilter: 'blur(16px)', borderColor: 'rgba(255,255,255,0.05)' }}
          >
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <Activity size={14} className="text-blue-400" />
              </div>
              <h3 className="text-sm font-bold text-white">Trend Analysis</h3>
            </div>
            <div className="flex-1 w-full">
              {chartData.length > 1 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 0, left: -25, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorWeightMain" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.6} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="displayDate" stroke="rgba(255,255,255,0.3)" fontSize={10} axisLine={false} tickLine={false} tickMargin={10} />
                    <YAxis stroke="rgba(255,255,255,0.3)" fontSize={10} axisLine={false} tickLine={false} domain={['dataMin - 1', 'dataMax + 1']} tickFormatter={(val) => val.toFixed(1)} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                      type="monotone" dataKey="weight_kg" name="Weight" stroke="#3b82f6" strokeWidth={4}
                      fill="url(#colorWeightMain)" activeDot={{ r: 6, fill: '#3b82f6', stroke: '#fff', strokeWidth: 2 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center border border-dashed border-zinc-700/50 rounded-2xl bg-black/20 p-6 text-center">
                  <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center mb-3">
                    <Activity size={18} className="text-zinc-500" />
                  </div>
                  <h3 className="text-sm font-bold text-zinc-300 mb-1">Chart Your Trends</h3>
                  <p className="text-xs text-zinc-500 max-w-[200px]">
                    Log at least 2 entries to see your weight trend visualized here.
                  </p>
                </div>
              )}
            </div>
          </motion.div>

          {/* History List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="rounded-3xl border overflow-hidden"
            style={{ background: 'rgba(24,24,27,0.6)', backdropFilter: 'blur(16px)', borderColor: 'rgba(255,255,255,0.05)' }}
          >
            <div className="px-5 py-4 border-b border-white/5 bg-black/20">
              <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">History Log</h3>
            </div>
            <div className="divide-y divide-white/5 max-h-[300px] overflow-y-auto custom-scrollbar">
              {allLogs.length === 0 ? (
                <p className="p-6 text-center text-xs text-zinc-500">No logs yet.</p>
              ) : (
                allLogs.map((log) => (
                  <div key={log.date} className="flex items-center justify-between px-5 py-3.5 hover:bg-white/[0.02] transition-colors group">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                        <Scale size={14} className="text-blue-400" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">{log.weight_kg} kg</p>
                        <p className="text-[10px] text-zinc-500">{format(new Date(log.date + 'T00:00:00'), 'MMM d, yyyy')}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => openEdit(log)} className="w-8 h-8 rounded-lg bg-zinc-800/80 flex items-center justify-center text-zinc-400 hover:text-white border border-white/5 cursor-pointer">
                        <Edit3 size={14} />
                      </button>
                      <button onClick={() => handleDelete(log.date)} className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center text-red-400 hover:text-red-300 hover:bg-red-500/20 border border-red-500/20 cursor-pointer">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>

        </div>
      </div>

      <AnimatePresence>
        {showModal && (
          <LogWeightModal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            editingEntry={editingEntry}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
