import { useState, useEffect, useMemo } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { Scale, TrendingDown, Target, Plus, Ruler, Edit3, Trash2 } from 'lucide-react';
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
      // Smart default: pull the most recent logged height
      db.bodyLogs
        .orderBy('date')
        .reverse()
        .filter((x) => !!x.height_cm)
        .first()
        .then((lastLog) => {
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
      const existing = await db.bodyLogs.get(dateStr);
      if (existing) {
        await db.bodyLogs.update(dateStr, entry);
      } else {
        await db.bodyLogs.add(entry);
      }
      setWeight('');
      setWaist('');
      setHeight('');
      onClose();
    } catch (err) {
      console.error('Failed to save body log:', err);
    }
  }

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-black/60 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="glass-card rounded-t-3xl w-full max-w-lg p-6 space-y-5"
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 400 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-10 h-1 bg-zinc-600 rounded-full mx-auto" />
        <h2 className="text-lg font-bold text-white text-glow">
          {editingEntry ? `Edit Stats (${editingEntry.date})` : 'Log Body Stats'}
        </h2>

        <div>
          <label className="text-xs text-zinc-400 uppercase tracking-wider mb-1 block">
            Weight (kg) *
          </label>
          <input
            type="number"
            step="0.1"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="e.g. 72.5"
            className="w-full bg-zinc-800/60 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500 transition-colors"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-zinc-400 uppercase tracking-wider mb-1 block">
              Waist (cm) — optional
            </label>
            <input
              type="number"
              step="0.1"
              value={waist}
              onChange={(e) => setWaist(e.target.value)}
              placeholder="e.g. 82.0"
              className="w-full bg-zinc-800/60 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          <div>
            <label className="text-xs text-zinc-400 uppercase tracking-wider mb-1 block">
              Height (cm) — optional
            </label>
            <input
              type="number"
              step="0.1"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              placeholder="e.g. 175.0"
              className="w-full bg-zinc-800/60 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={!weight}
          className="w-full py-3.5 rounded-2xl font-semibold text-sm transition-all disabled:opacity-30 disabled:cursor-not-allowed active:scale-[0.98] cursor-pointer"
          style={{
            background: 'linear-gradient(135deg, #10b981, #059669)',
            color: 'white',
          }}
        >
          Save Entry
        </button>
      </motion.div>
    </motion.div>
  );
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card rounded-xl px-3 py-2 text-xs">
        <p className="text-zinc-400">{label}</p>
        <p className="text-cyan-400 font-bold">{payload[0].value} kg</p>
        {payload[1] && payload[1].value && (
          <p className="text-purple-400 font-bold">{payload[1].value} cm</p>
        )}
      </div>
    );
  }
  return null;
};

export default function BodyTracker() {
  const [showModal, setShowModal] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [confirmDeleteDate, setConfirmDeleteDate] = useState(null);

  const bodyLogs = useLiveQuery(
    () => db.bodyLogs.orderBy('date').toArray(),
    []
  );

  async function deleteEntry(date) {
    setConfirmDeleteDate(date);
  }

  async function confirmDeleteEntry() {
    if (!confirmDeleteDate) return;
    try {
      await db.bodyLogs.delete(confirmDeleteDate);
    } catch (err) {
      console.error('Failed to delete body log:', err);
    } finally {
      setConfirmDeleteDate(null);
    }
  }

  const chartData = useMemo(() => {
    if (!bodyLogs || bodyLogs.length === 0) return [];
    return bodyLogs.map((entry) => ({
      date: format(new Date(entry.date + 'T00:00:00'), 'MMM d'),
      weight: entry.weight_kg,
      waist: entry.waist_cm,
    }));
  }, [bodyLogs]);

  const stats = useMemo(() => {
    if (!bodyLogs || bodyLogs.length === 0)
      return { current: null, start: null, change: null, bmi: null };
    const sorted = [...bodyLogs].sort((a, b) => a.date.localeCompare(b.date));
    const start = sorted[0].weight_kg;
    const current = sorted[sorted.length - 1].weight_kg;
    // Find the most recent height entry
    const withHeight = sorted.filter((e) => e.height_cm);
    const heightCm = withHeight.length > 0 ? withHeight[withHeight.length - 1].height_cm : null;
    const bmi = heightCm ? (current / ((heightCm / 100) ** 2)).toFixed(1) : null;
    return {
      current,
      start,
      change: (current - start).toFixed(1),
      bmi,
      heightCm,
    };
  }, [bodyLogs]);

  const bmiCategory = useMemo(() => {
    if (!stats.bmi) return null;
    const v = parseFloat(stats.bmi);
    if (v < 18.5) return { label: 'Underweight', color: 'text-yellow-400' };
    if (v < 25) return { label: 'Normal', color: 'text-emerald-400' };
    if (v < 30) return { label: 'Overweight', color: 'text-orange-400' };
    return { label: 'Obese', color: 'text-red-400' };
  }, [stats.bmi]);

  return (
    <div className="max-w-lg mx-auto pb-4 space-y-5">
      <motion.div
        className="flex items-center justify-between"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
            Body Tracker
          </h1>
          <p className="text-zinc-500 text-sm mt-1">Weight, height & measurements</p>
        </div>
        <button
          onClick={() => {
            setEditingEntry(null);
            setShowModal(true);
          }}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl text-sm font-semibold transition-all active:scale-95 cursor-pointer"
          style={{
            background: 'linear-gradient(135deg, #10b981, #059669)',
            color: 'white',
          }}
        >
          <Plus size={16} />
          Log
        </button>
      </motion.div>

      {/* Stats Cards */}
      {stats.current && (
        <motion.div
          className={`grid ${stats.bmi ? 'grid-cols-2 md:grid-cols-4' : 'grid-cols-3'} gap-3`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="glass-card rounded-2xl p-4 text-center">
            <Scale size={16} className="text-cyan-400 mx-auto mb-1" />
            <p className="text-xl font-bold text-white">{stats.current}</p>
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest">
              Current kg
            </p>
          </div>
          <div className="glass-card rounded-2xl p-4 text-center">
            <Target size={16} className="text-purple-400 mx-auto mb-1" />
            <p className="text-xl font-bold text-white">{stats.start}</p>
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest">
              Starting kg
            </p>
          </div>
          <div className="glass-card rounded-2xl p-4 text-center">
            <TrendingDown size={16} className={`mx-auto mb-1 ${
              parseFloat(stats.change) <= 0 ? 'text-emerald-400' : 'text-red-400'
            }`} />
            <p className={`text-xl font-bold ${
              parseFloat(stats.change) <= 0 ? 'text-emerald-400' : 'text-red-400'
            }`}>
              {parseFloat(stats.change) > 0 ? '+' : ''}{stats.change}
            </p>
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest">
              Change kg
            </p>
          </div>
          {stats.bmi && bmiCategory && (
            <div className="glass-card rounded-2xl p-4 text-center">
              <Ruler size={16} className="text-amber-400 mx-auto mb-1" />
              <p className={`text-xl font-bold ${bmiCategory.color}`}>{stats.bmi}</p>
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest">
                BMI · {bmiCategory.label}
              </p>
            </div>
          )}
        </motion.div>
      )}

      {/* Weight Chart */}
      <motion.div
        className="glass-card rounded-2xl p-5"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h3 className="text-sm font-semibold text-zinc-300 mb-4 flex items-center gap-2">
          <Scale size={16} className="text-cyan-400" />
          Weight Trend
        </h3>
        {chartData.length > 1 ? (
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="weightGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#22d3ee" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis
                dataKey="date"
                tick={{ fill: '#71717a', fontSize: 10 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: '#71717a', fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                width={35}
                domain={['dataMin - 1', 'dataMax + 1']}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="weight"
                stroke="#22d3ee"
                fill="url(#weightGrad)"
                strokeWidth={2}
                dot={{ r: 3, fill: '#22d3ee' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-zinc-600 text-sm text-center py-10">
            {chartData.length === 1
              ? 'Log one more entry to see your trend'
              : 'Log your weight to start tracking'}
          </p>
        )}
      </motion.div>

      {/* Recent Entries */}
      {bodyLogs && bodyLogs.length > 0 && (
        <motion.div
          className="glass-card rounded-2xl p-5"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-sm font-semibold text-zinc-300 mb-4">
            Recent Entries
          </h3>
          <div className="space-y-2">
            {[...bodyLogs]
              .sort((a, b) => b.date.localeCompare(a.date))
              .slice(0, 7)
              .map((entry) => (
                <div
                  key={entry.date}
                  className="flex items-center justify-between py-2.5 px-3 rounded-xl bg-zinc-800/40 group hover:bg-zinc-805 transition-colors"
                >
                  <span className="text-sm text-zinc-400">
                    {format(new Date(entry.date + 'T00:00:00'), 'EEE, MMM d')}
                  </span>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold text-white">
                        {entry.weight_kg} kg
                      </span>
                      {entry.waist_cm && (
                        <span className="text-xs text-purple-400 flex items-center gap-1">
                          <Ruler size={12} />
                          {entry.waist_cm} cm
                        </span>
                      )}
                    </div>
                    {/* Actions */}
                    <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => {
                          setEditingEntry(entry);
                          setShowModal(true);
                        }}
                        className="p-1.5 rounded-lg hover:bg-zinc-700/50 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                        title="Edit Entry"
                      >
                        <Edit3 size={13} />
                      </button>
                      <button
                        onClick={() => deleteEntry(entry.date)}
                        className="p-1.5 rounded-lg hover:bg-red-500/10 text-red-400/60 hover:text-red-400 transition-colors cursor-pointer"
                        title="Delete Entry"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </motion.div>
      )}

      {/* Confirm Delete Modal */}
      <AnimatePresence>
        {confirmDeleteDate && (
          <motion.div
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setConfirmDeleteDate(null)}
          >
            <motion.div
              className="glass-card rounded-2xl p-5 mx-4 max-w-xs w-full border border-zinc-700 shadow-2xl"
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <p className="text-sm font-semibold text-white mb-1">Delete Entry?</p>
              <p className="text-xs text-zinc-400 mb-4">Remove the body log entry for <span className="text-white font-medium">{confirmDeleteDate}</span>?</p>
              <div className="flex gap-2">
                <button onClick={() => setConfirmDeleteDate(null)} className="flex-1 py-2 rounded-xl bg-zinc-800 border border-zinc-700 text-zinc-300 text-xs font-semibold cursor-pointer">Cancel</button>
                <button onClick={confirmDeleteEntry} className="flex-1 py-2 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 text-xs font-semibold cursor-pointer">Delete</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showModal && (
          <LogWeightModal
            isOpen={showModal}
            onClose={() => {
              setShowModal(false);
              setEditingEntry(null);
            }}
            editingEntry={editingEntry}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
