import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Trash2,
  Edit3,
  X,
  Check,
  GripVertical,
  Download,
  Upload,
  Moon,
  Sun,
  Key,
  Sparkles,
} from 'lucide-react';
import { db } from '../db/db';
import { seedDatabase } from '../db/seed';
import {
  getCategoryColor,
  getCategoryIcon,
  getDayLabel,
  getTimeSlotLabel,
} from '../utils/helpers';

const ALL_DAYS = [1, 2, 3, 4, 5, 6, 0]; // Mon-Sun
const CATEGORIES = ['body', 'hair', 'skin', 'diet', 'supplement'];
const TIME_SLOTS = ['morning', 'afternoon', 'evening', 'night'];

const TYPES = ['fitness', 'wellness'];
const FREQUENCIES = ['daily', 'gap'];

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
    if (isNew) {
      await db.habits.add(data);
    } else {
      await db.habits.update(habit.id, data);
    }
    onClose();
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
        className="glass-card rounded-t-3xl w-full max-w-lg p-6 space-y-5 max-h-[85vh] overflow-y-auto"
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 400 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-10 h-1 bg-zinc-600 rounded-full mx-auto" />
        <h2 className="text-lg font-bold text-white">
          {isNew ? 'Add New Habit' : 'Edit Habit'}
        </h2>

        {/* Name */}
        <div>
          <label className="text-xs text-zinc-400 uppercase tracking-wider mb-1 block">
            Habit Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Drink 2L water"
            className="w-full bg-zinc-800/60 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500 transition-colors"
          />
        </div>

        {/* Category */}
        <div>
          <label className="text-xs text-zinc-400 uppercase tracking-wider mb-2 block">
            Category
          </label>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => {
              const colors = getCategoryColor(cat);
              const isSelected = category === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className="px-3 py-2 rounded-xl text-xs font-semibold capitalize transition-all"
                  style={{
                    background: isSelected ? colors.bg : 'rgba(39,39,42,0.4)',
                    border: `1px solid ${isSelected ? colors.border : 'rgba(255,255,255,0.05)'}`,
                    color: isSelected ? colors.text : '#71717a',
                  }}
                >
                  {getCategoryIcon(cat)} {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Time of Day */}
        <div>
          <label className="text-xs text-zinc-400 uppercase tracking-wider mb-2 block">
            Time of Day
          </label>
          <div className="grid grid-cols-2 gap-2">
            {TIME_SLOTS.map((slot) => {
              const isSelected = timeOfDay === slot;
              return (
                <button
                  key={slot}
                  onClick={() => setTimeOfDay(slot)}
                  className={`px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isSelected
                      ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                      : 'bg-zinc-800/40 border-zinc-700/30 text-zinc-500'
                  }`}
                  style={{
                    border: `1px solid ${
                      isSelected
                        ? 'rgba(16, 185, 129, 0.3)'
                        : 'rgba(255,255,255,0.05)'
                    }`,
                  }}
                >
                  {getTimeSlotLabel(slot)}
                </button>
              );
            })}
          </div>
        </div>

        {/* Type (Fitness / Wellness) */}
        <div>
          <label className="text-xs text-zinc-400 uppercase tracking-wider mb-2 block">
            Tracker Type
          </label>
          <div className="grid grid-cols-2 gap-2">
            {TYPES.map((t) => {
              const isSelected = type === t;
              return (
                <button
                  key={t}
                  onClick={() => setType(t)}
                  className={`px-3 py-2.5 rounded-xl text-xs font-semibold capitalize transition-all ${
                    isSelected
                      ? t === 'fitness' ? 'bg-cyan-500/15 border-cyan-500/30 text-cyan-400' : 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                      : 'bg-zinc-800/40 border-zinc-700/30 text-zinc-500'
                  }`}
                  style={{
                    border: `1px solid ${
                      isSelected
                        ? t === 'fitness' ? 'rgba(34, 211, 238, 0.3)' : 'rgba(16, 185, 129, 0.3)'
                        : 'rgba(255,255,255,0.05)'
                    }`,
                  }}
                >
                  {t === 'fitness' ? '💪 Fitness' : '🧘 Wellness'}
                </button>
              );
            })}
          </div>
        </div>

        {/* Frequency */}
        <div>
          <label className="text-xs text-zinc-400 uppercase tracking-wider mb-2 block">
            Frequency
          </label>
          <div className="grid grid-cols-2 gap-2">
            {FREQUENCIES.map((fr) => {
              const isSelected = frequency === fr;
              return (
                <button
                  key={fr}
                  onClick={() => setFrequency(fr)}
                  className={`px-3 py-2.5 rounded-xl text-xs font-semibold capitalize transition-all ${
                    isSelected
                      ? 'bg-purple-500/15 border-purple-500/30 text-purple-400'
                      : 'bg-zinc-800/40 border-zinc-700/30 text-zinc-500'
                  }`}
                  style={{
                    border: `1px solid ${
                      isSelected
                        ? 'rgba(168, 85, 247, 0.3)'
                        : 'rgba(255,255,255,0.05)'
                    }`,
                  }}
                >
                  {fr === 'daily' ? '📅 Daily' : '🔁 Non-Regular / Gap'}
                </button>
              );
            })}
          </div>
        </div>

        {/* Schedule */}
        <div>
          <label className="text-xs text-zinc-400 uppercase tracking-wider mb-2 block">
            Schedule (days)
          </label>
          <div className="flex gap-2">
            {ALL_DAYS.map((day) => {
              const isSelected = schedule.includes(day);
              return (
                <button
                  key={day}
                  onClick={() => toggleDay(day)}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isSelected
                      ? 'bg-emerald-500/15 text-emerald-400'
                      : 'bg-zinc-800/40 text-zinc-600'
                  }`}
                  style={{
                    border: `1px solid ${
                      isSelected
                        ? 'rgba(16, 185, 129, 0.3)'
                        : 'rgba(255,255,255,0.05)'
                    }`,
                  }}
                >
                  {getDayLabel(day)}
                </button>
              );
            })}
          </div>
        </div>

        {/* Save button */}
        <button
          onClick={handleSave}
          disabled={!name.trim() || schedule.length === 0}
          className="w-full py-3.5 rounded-2xl font-semibold text-sm transition-all disabled:opacity-30 disabled:cursor-not-allowed active:scale-[0.98]"
          style={{
            background: 'linear-gradient(135deg, #10b981, #059669)',
            color: 'white',
          }}
        >
          {isNew ? 'Add Habit' : 'Save Changes'}
        </button>
      </motion.div>
    </motion.div>
  );
}

export default function Settings() {
  const habits = useLiveQuery(() => db.habits.toArray(), []);
  const [editingHabit, setEditingHabit] = useState(null);
  const [showEditor, setShowEditor] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null); // habitId
  const [toast, setToast] = useState('');
  const [geminiKey, setGeminiKey] = useState(localStorage.getItem('gemini_api_key') || '');

  function handleGeminiKeyChange(e) {
    const val = e.target.value;
    setGeminiKey(val);
    localStorage.setItem('gemini_api_key', val);
    showToast('🔑 API Key saved locally');
  }

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  }

  function askDeleteHabit(id) {
    setConfirmDelete(id);
  }

  async function confirmDeleteHabit() {
    if (!confirmDelete) return;
    await db.habits.delete(confirmDelete);
    await db.dailyLogs.where('habitId').equals(confirmDelete).delete();
    setConfirmDelete(null);
  }

  async function exportData() {
    const data = {
      habits: await db.habits.toArray(),
      dailyLogs: await db.dailyLogs.toArray(),
      bodyLogs: await db.bodyLogs.toArray(),
      macroLogs: await db.macroLogs.toArray(),
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `recomp-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function importData(event) {
    const file = event.target.files[0];
    if (!file) return;
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      if (data.habits) {
        await db.habits.clear();
        await db.habits.bulkAdd(data.habits);
      }
      if (data.dailyLogs) {
        await db.dailyLogs.clear();
        await db.dailyLogs.bulkAdd(data.dailyLogs);
      }
      if (data.bodyLogs) {
        await db.bodyLogs.clear();
        await db.bodyLogs.bulkAdd(data.bodyLogs);
      }
      if (data.macroLogs) {
        await db.macroLogs.clear();
        await db.macroLogs.bulkAdd(data.macroLogs);
      }
      showToast('✅ Data imported successfully!');
    } catch (e) {
      showToast('❌ Invalid file format');
    }
    event.target.value = '';
  }

  async function clearAllData() {
    if (window.confirm('Are you sure? This will delete ALL data including habits and logs. This cannot be undone.')) {
      await db.habits.clear();
      await db.dailyLogs.clear();
      await db.bodyLogs.clear();
      await db.macroLogs.clear();
      await seedDatabase();
    }
  }

  if (!habits) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  // Group by category
  const grouped = {};
  habits.forEach((h) => {
    if (!grouped[h.category]) grouped[h.category] = [];
    grouped[h.category].push(h);
  });

  return (
    <div className="max-w-lg mx-auto pb-4 space-y-5">
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-[300] px-4 py-2.5 rounded-2xl bg-zinc-800 border border-zinc-700 shadow-2xl text-sm text-white font-medium"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirm Delete Modal */}
      <AnimatePresence>
        {confirmDelete && (
          <motion.div
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setConfirmDelete(null)}
          >
            <motion.div
              className="glass-card rounded-2xl p-5 mx-4 max-w-xs w-full border border-zinc-700 shadow-2xl"
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <p className="text-sm font-semibold text-white mb-1">Delete Habit?</p>
              <p className="text-xs text-zinc-400 mb-4">This will also delete all log history for this habit. Cannot be undone.</p>
              <div className="flex gap-2">
                <button onClick={() => setConfirmDelete(null)} className="flex-1 py-2 rounded-xl bg-zinc-800 border border-zinc-700 text-zinc-300 text-xs font-semibold hover:bg-zinc-700 transition-colors cursor-pointer">Cancel</button>
                <button onClick={confirmDeleteHabit} className="flex-1 py-2 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 text-xs font-semibold hover:bg-red-500/30 transition-colors cursor-pointer">Delete</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.div
        className="flex items-center justify-between"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
            Settings
          </h1>
          <p className="text-zinc-500 text-sm mt-1">Manage your habits & data</p>
        </div>
        <button
          onClick={() => {
            setEditingHabit(null);
            setShowEditor(true);
          }}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl text-sm font-semibold transition-all active:scale-95"
          style={{
            background: 'linear-gradient(135deg, #10b981, #059669)',
            color: 'white',
          }}
        >
          <Plus size={16} />
          Add
        </button>
      </motion.div>

      {/* Habits by Category */}
      {Object.entries(grouped).map(([category, categoryHabits]) => {
        const colors = getCategoryColor(category);
        return (
          <motion.div
            key={category}
            className="glass-card rounded-2xl p-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h3
              className="text-xs font-bold uppercase tracking-widest mb-3 flex items-center gap-2"
              style={{ color: colors.text }}
            >
              {getCategoryIcon(category)} {category}
              <span className="text-zinc-600 font-normal">
                ({categoryHabits.length})
              </span>
            </h3>
            <div className="space-y-2">
              {categoryHabits.map((habit) => (
                <div
                  key={habit.id}
                  className="flex items-center justify-between py-2.5 px-3 rounded-xl bg-zinc-800/40 group"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-zinc-200 truncate">{habit.name}</p>
                    <p className="text-[10px] text-zinc-600 mt-0.5">
                      {getTimeSlotLabel(habit.timeOfDay)} ·{' '}
                      {habit.schedule
                        ? habit.schedule.map(getDayLabel).join(', ')
                        : 'Every day'}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => {
                        setEditingHabit(habit);
                        setShowEditor(true);
                      }}
                      className="p-2 rounded-lg hover:bg-zinc-700/50 transition-colors"
                    >
                      <Edit3 size={14} className="text-zinc-400" />
                    </button>
                    <button
                      onClick={() => askDeleteHabit(habit.id)}
                      className="p-2 rounded-lg hover:bg-red-500/10 transition-colors cursor-pointer"
                    >
                      <Trash2 size={14} className="text-red-400/60" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        );
      })}

      {/* AI Integrations */}
      <motion.div
        className="glass-card rounded-2xl p-5 space-y-3"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <h3 className="text-sm font-semibold text-zinc-300 mb-2 flex items-center gap-2">
          <Sparkles size={16} className="text-emerald-400" />
          AI Vision Integration
        </h3>
        <p className="text-[10px] text-zinc-500 mb-3">
          Enter a free Google Gemini API Key to enable scanning of physical food photos in the Macro Calculator. Stored locally.
        </p>
        <div className="flex items-center gap-2 bg-zinc-800/40 border border-zinc-700/60 rounded-xl px-3 py-2.5 focus-within:border-emerald-500/60 transition-colors">
          <Key size={14} className="text-zinc-500 shrink-0" />
          <input
            type="password"
            value={geminiKey}
            onChange={handleGeminiKeyChange}
            placeholder="Paste Gemini API Key..."
            className="flex-1 bg-transparent text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none"
          />
        </div>
      </motion.div>

      {/* Data Management */}
      <motion.div
        className="glass-card rounded-2xl p-5 space-y-3"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h3 className="text-sm font-semibold text-zinc-300 mb-2">Data Management</h3>
        <button
          onClick={exportData}
          className="w-full flex items-center gap-3 py-3 px-4 rounded-xl bg-zinc-800/40 hover:bg-zinc-800/60 transition-colors text-sm text-zinc-300"
        >
          <Download size={16} className="text-cyan-400" />
          Export All Data (JSON backup)
        </button>
        <label className="w-full flex items-center gap-3 py-3 px-4 rounded-xl bg-zinc-800/40 hover:bg-zinc-800/60 transition-colors text-sm text-zinc-300 cursor-pointer">
          <Upload size={16} className="text-purple-400" />
          Import Data
          <input
            type="file"
            accept=".json"
            onChange={importData}
            className="hidden"
          />
        </label>
        <button
          onClick={clearAllData}
          className="w-full flex items-center gap-3 py-3 px-4 rounded-xl bg-red-500/5 hover:bg-red-500/10 border border-red-500/10 transition-colors text-sm text-red-400"
        >
          <Trash2 size={16} />
          Reset All Data
        </button>
      </motion.div>

      {/* About */}
      <div className="text-center py-4">
        <p className="text-zinc-600 text-xs">
          Recomp v1.0 · All data stored locally on your device
        </p>
      </div>

      {/* Editor Modal */}
      <AnimatePresence>
        {showEditor && (
          <HabitEditor
            habit={editingHabit}
            onClose={() => setShowEditor(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
