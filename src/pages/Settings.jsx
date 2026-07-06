import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Trash2,
  Edit3,
  X,
  Check,
  Download,
  Upload,
  Moon,
  Sun,
  Key,
  Settings as SettingsIcon,
  Database,
  ListTodo,
} from 'lucide-react';
import { db } from '../db/db';
import { seedDatabase } from '../db/seed';
import {
  getCategoryColor,
  getDayLabel,
  getTimeSlotLabel,
} from '../utils/helpers';
import HabitCard from '../components/HabitCard';

const ALL_DAYS = [1, 2, 3, 4, 5, 6, 0]; // Mon-Sun
const CATEGORIES = ['body', 'hair', 'skin', 'diet', 'supplement'];
const TIME_SLOTS = ['morning', 'afternoon', 'evening', 'night'];
const TYPES = ['fitness', 'wellness'];
const FREQUENCIES = ['daily', 'gap'];

/* ── Habit Editor Modal ──────────────────────────────────────── */

function HabitEditor({ habit, onClose }) {
  const isNew = !habit;
  const [name, setName] = useState(habit?.name || '');
  const [category, setCategory] = useState(habit?.category || 'body');
  const [timeOfDay, setTimeOfDay] = useState(habit?.timeOfDay || 'morning');
  const [schedule, setSchedule] = useState(habit?.schedule || [...ALL_DAYS]);
  const [type, setType] = useState(habit?.type || 'wellness');
  const [frequency, setFrequency] = useState(habit?.frequency || 'daily');

  function toggleDay(day) {
    setSchedule((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  }

  async function handleSave() {
    if (!name.trim()) return;
    const data = {
      name: name.trim(),
      category,
      timeOfDay,
      schedule,
      type,
      frequency,
    };
    try {
      if (isNew) await db.habits.add(data);
      else await db.habits.update(habit.id, data);
      onClose();
    } catch (err) {
      console.error('Failed to save habit:', err);
    }
  }

  const categoryColor = getCategoryColor(category);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="rounded-3xl w-full max-w-lg p-6 space-y-6 shadow-2xl border max-h-[90vh] overflow-y-auto custom-scrollbar"
        style={{ background: 'linear-gradient(145deg, rgba(30,30,36,0.95), rgba(18,18,22,0.95))', borderColor: 'rgba(255,255,255,0.08)' }}
        initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-white/5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-500/15 flex items-center justify-center border border-purple-500/30">
              <Edit3 size={14} className="text-purple-400" />
            </div>
            <h2 className="text-sm font-bold text-white tracking-wide">
              {isNew ? 'Create Routine' : 'Edit Routine'}
            </h2>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-xl flex items-center justify-center text-zinc-500 hover:text-white bg-white/5 cursor-pointer">
            <X size={15} />
          </button>
        </div>

        <div className="space-y-5">
          {/* Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] text-purple-400 font-bold uppercase tracking-wider pl-1">Habit Name *</label>
            <input
              type="text" value={name} onChange={(e) => setName(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500 transition-colors"
              placeholder="e.g., Morning Run" autoFocus
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Type */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider pl-1">Tracker Type</label>
              <div className="flex bg-black/40 rounded-xl p-1 border border-white/10">
                {TYPES.map(t => (
                  <button
                    key={t} onClick={() => setType(t)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${type === t ? 'bg-zinc-800 text-white shadow' : 'text-zinc-500 hover:text-zinc-300'}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            {/* Frequency */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider pl-1">Frequency</label>
              <div className="flex bg-black/40 rounded-xl p-1 border border-white/10">
                {FREQUENCIES.map(f => (
                  <button
                    key={f} onClick={() => setFrequency(f)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${frequency === f ? 'bg-zinc-800 text-white shadow' : 'text-zinc-500 hover:text-zinc-300'}`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Category */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider pl-1">Category</label>
              <select
                value={category} onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500 transition-colors appearance-none cursor-pointer"
              >
                {CATEGORIES.map(c => <option key={c} value={c} className="bg-zinc-900">{c.toUpperCase()}</option>)}
              </select>
            </div>
            {/* Time */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider pl-1">Time of Day</label>
              <select
                value={timeOfDay} onChange={(e) => setTimeOfDay(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500 transition-colors appearance-none cursor-pointer"
              >
                {TIME_SLOTS.map(t => <option key={t} value={t} className="bg-zinc-900">{getTimeSlotLabel(t)}</option>)}
              </select>
            </div>
          </div>

          {/* Schedule */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider pl-1">Active Days</label>
            <div className="flex justify-between gap-1">
              {ALL_DAYS.map((day) => {
                const isActive = schedule.includes(day);
                return (
                  <button
                    key={day} onClick={() => toggleDay(day)}
                    className="flex-1 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer"
                    style={{
                      background: isActive ? categoryColor.accent : 'rgba(0,0,0,0.4)',
                      color: isActive ? '#fff' : '#71717a',
                      borderColor: isActive ? categoryColor.accent : 'rgba(255,255,255,0.1)'
                    }}
                  >
                    {getDayLabel(day).charAt(0)}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <button
          onClick={handleSave} disabled={!name.trim()}
          className="w-full py-3.5 rounded-xl text-sm font-black text-white shadow-lg transition-all active:scale-95 disabled:opacity-50 mt-4 cursor-pointer"
          style={{ background: 'linear-gradient(135deg, #a855f7, #8b5cf6)' }}
        >
          {isNew ? 'Create Habit' : 'Save Changes'}
        </button>
      </motion.div>
    </motion.div>
  );
}

/* ── Main Settings Component ─────────────────────────────────── */

export default function Settings() {
  const habits = useLiveQuery(() => db.habits.toArray(), []);
  
  const [editingHabit, setEditingHabit] = useState(null);
  const [showHabitModal, setShowHabitModal] = useState(false);
  const [apiKey, setApiKey] = useState(localStorage.getItem('gemini_api_key') || '');
  const [showKeySaved, setShowKeySaved] = useState(false);
  const [toast, setToast] = useState(null);

  function saveApiKey() {
    localStorage.setItem('gemini_api_key', apiKey);
    setShowKeySaved(true);
    setTimeout(() => setShowKeySaved(false), 2000);
  }

  function showToast(msg, type = 'success') {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }

  async function handleResetData() {
    if (window.confirm('⚠️ WARNING: This will delete ALL data (habits, logs, body stats) and seed defaults. Proceed?')) {
      try {
        await seedDatabase();
        showToast('Database reset to defaults.', 'success');
      } catch (err) {
        showToast('Failed to reset database.', 'error');
      }
    }
  }

  async function handleExport() {
    try {
      const allHabits = await db.habits.toArray();
      const allDailyLogs = await db.dailyLogs.toArray();
      const allBodyLogs = await db.bodyLogs.toArray();
      
      const data = {
        version: 2,
        habits: allHabits,
        dailyLogs: allDailyLogs,
        bodyLogs: allBodyLogs,
        exportDate: new Date().toISOString(),
      };
      
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `recomp-backup-${format(new Date(), 'yyyy-MM-dd')}.json`;
      a.click();
      URL.revokeObjectURL(url);
      showToast('Backup downloaded successfully.', 'success');
    } catch (err) {
      console.error(err);
      showToast('Failed to export data.', 'error');
    }
  }

  async function handleImport(e) {
    const file = e.target.files[0];
    if (!file) return;

    if (!window.confirm('⚠️ WARNING: Importing will overwrite ALL current data. Continue?')) {
      e.target.value = '';
      return;
    }

    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const data = JSON.parse(event.target.result);
          if (!data.habits || !data.dailyLogs || !data.bodyLogs) {
            throw new Error('Invalid backup file format');
          }
          await db.transaction('rw', db.habits, db.dailyLogs, db.bodyLogs, async () => {
            await db.habits.clear();
            await db.dailyLogs.clear();
            await db.bodyLogs.clear();
            await db.habits.bulkAdd(data.habits);
            await db.dailyLogs.bulkAdd(data.dailyLogs);
            await db.bodyLogs.bulkAdd(data.bodyLogs);
          });
          showToast('Data imported successfully!', 'success');
        } catch (err) {
          console.error(err);
          showToast('Invalid backup file.', 'error');
        }
      };
      reader.readAsText(file);
    } catch (err) {
      showToast('Failed to read file.', 'error');
    }
    e.target.value = '';
  }

  async function deleteHabit(id) {
    if (window.confirm('Delete this habit? All history will remain but it won\'t appear anymore.')) {
      await db.habits.delete(id);
    }
  }

  function openEditModal(h = null) {
    setEditingHabit(h);
    setShowHabitModal(true);
  }

  return (
    <div className="max-w-7xl mx-auto px-1 pb-10 space-y-6">
      
      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Settings
          </h1>
          <p className="text-zinc-500 text-xs mt-1 font-medium">Manage preferences and routines</p>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.2)]">
          <SettingsIcon className="text-purple-400" />
        </div>
      </div>

      {/* ── 2-Column Desktop Layout ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN (Data & API) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* AI Settings */}
          <motion.div
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
            className="rounded-3xl p-6 border"
            style={{ background: 'rgba(24,24,27,0.6)', backdropFilter: 'blur(16px)', borderColor: 'rgba(255,255,255,0.05)' }}
          >
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/5">
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
                <Key size={14} className="text-amber-400" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white tracking-wide">Gemini API Key</h3>
                <p className="text-[10px] text-zinc-500">For food label OCR scanning</p>
              </div>
            </div>
            
            <div className="flex gap-2">
              <input
                type="password" value={apiKey} onChange={(e) => setApiKey(e.target.value)}
                placeholder="AIzaSy..."
                className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500 transition-colors"
              />
              <button
                onClick={saveApiKey}
                className="px-5 py-3 rounded-xl text-sm font-bold text-white transition-all active:scale-95 cursor-pointer relative overflow-hidden flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}
              >
                <AnimatePresence mode="wait">
                  {showKeySaved ? (
                    <motion.div key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                      <Check size={18} />
                    </motion.div>
                  ) : (
                    <motion.span key="text" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      Save
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </motion.div>

          {/* Data Management */}
          <motion.div
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
            className="rounded-3xl p-6 border relative overflow-hidden"
            style={{ background: 'linear-gradient(145deg, rgba(30,30,36,0.7), rgba(18,18,22,0.9))', borderColor: 'rgba(255,255,255,0.05)' }}
          >
            <div className="flex items-center gap-2 mb-6 pb-3 border-b border-white/5">
              <div className="w-8 h-8 rounded-xl bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20">
                <Database size={14} className="text-cyan-400" />
              </div>
              <h3 className="text-sm font-bold text-white tracking-wide">Data & Storage</h3>
            </div>
            
            <div className="space-y-3">
              <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                Your data is stored locally in this browser. Export it regularly to keep a backup.
              </p>
              
              <div className="flex gap-3">
                <button
                  onClick={handleExport}
                  className="flex-1 flex items-center justify-center gap-2 bg-zinc-800/80 hover:bg-zinc-800 border border-white/10 px-4 py-3 rounded-xl text-xs font-bold text-white transition-all cursor-pointer active:scale-95"
                >
                  <Download size={14} /> Export Backup
                </button>
                <label className="flex-1 flex items-center justify-center gap-2 bg-zinc-800/80 hover:bg-zinc-800 border border-white/10 px-4 py-3 rounded-xl text-xs font-bold text-white transition-all cursor-pointer active:scale-95">
                  <Upload size={14} /> Import Backup
                  <input type="file" accept=".json" onChange={handleImport} className="hidden" />
                </label>
              </div>

              <div className="pt-4 mt-2 border-t border-white/5">
                <button
                  onClick={handleResetData}
                  className="w-full py-3 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20 text-xs font-bold transition-all cursor-pointer"
                >
                  Reset App (Wipe Data & Seed)
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* RIGHT COLUMN (Habits) */}
        <div className="lg:col-span-7">
          <motion.div
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}
            className="rounded-3xl border overflow-hidden flex flex-col h-full"
            style={{ background: 'rgba(24,24,27,0.6)', backdropFilter: 'blur(16px)', borderColor: 'rgba(255,255,255,0.05)' }}
          >
            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-black/20">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
                  <ListTodo size={14} className="text-purple-400" />
                </div>
                <h3 className="text-sm font-bold text-white tracking-wide">Routine Manager</h3>
              </div>
              <button
                onClick={() => openEditModal()}
                className="flex items-center gap-2 bg-purple-500 hover:bg-purple-400 text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-[0_0_15px_rgba(168,85,247,0.3)] transition-all active:scale-95 cursor-pointer"
              >
                <Plus size={14} /> New Habit
              </button>
            </div>

            <div className="p-4 space-y-2 max-h-[600px] overflow-y-auto custom-scrollbar">
              {habits?.length > 0 ? (
                habits.map((habit) => {
                  const colors = getCategoryColor(habit.category);
                  return (
                    <div
                      key={habit.id}
                      className="group flex items-center justify-between p-4 rounded-2xl transition-all border border-white/5"
                      style={{ background: 'rgba(0,0,0,0.3)' }}
                    >
                      <div className="flex items-center gap-4">
                        {/* Category Badge Indicator */}
                        <div className="w-1.5 h-10 rounded-full" style={{ background: colors.accent }} />
                        <div>
                          <p className="text-sm font-bold text-white mb-1">{habit.name}</p>
                          <div className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest text-zinc-500">
                            <span className="bg-white/5 px-2 py-0.5 rounded-md">{habit.category}</span>
                            <span>•</span>
                            <span>{habit.type}</span>
                            <span>•</span>
                            <span>{habit.frequency}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => openEditModal(habit)}
                          className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white border border-white/5 cursor-pointer"
                        >
                          <Edit3 size={14} />
                        </button>
                        <button
                          onClick={() => deleteHabit(habit.id)}
                          className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center text-red-400 hover:text-red-300 hover:bg-red-500/20 border border-red-500/20 cursor-pointer"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="py-10 text-center text-zinc-500 text-sm">
                  No habits found. Add one or reset data.
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── Global Toast ── */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className={`fixed bottom-24 left-1/2 -translate-x-1/2 z-[200] px-6 py-3 rounded-full flex items-center gap-2 shadow-2xl border ${
              toast.type === 'error' ? 'bg-red-500/20 border-red-500/30 text-red-100' : 'bg-emerald-500/20 border-emerald-500/30 text-emerald-100'
            }`}
            style={{ backdropFilter: 'blur(12px)' }}
          >
            {toast.type === 'success' ? <Check size={16} className="text-emerald-400" /> : <X size={16} className="text-red-400" />}
            <span className="text-sm font-semibold">{toast.msg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showHabitModal && (
          <HabitEditor habit={editingHabit} onClose={() => setShowHabitModal(false)} />
        )}
      </AnimatePresence>

    </div>
  );
}
