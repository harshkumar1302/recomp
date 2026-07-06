import { useState, useMemo } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import {
  Flame, ChevronDown, ChevronUp, Sparkles,
  Calendar, Menu, ClipboardList, X, Zap,
  ChevronRight, HelpCircle,
  Sun, Moon, Sunset,
} from 'lucide-react';
import CalendarModal from '../components/CalendarModal';
import NonRegularDrawer from '../components/NonRegularDrawer';
import MacroCalculator from '../components/MacroCalculator';
import { db } from '../db/db';
import {
  getToday,
  getDayOfWeek,
  getTimeSlotLabel,
  calculateStreak,
} from '../utils/helpers';
import ProgressRing from '../components/ProgressRing';
import HabitCard from '../components/HabitCard';
import LiveClock from '../components/LiveClock';
import AppGuide from '../components/AppGuide';

const CHRONOLOGICAL_SLOTS = ['morning', 'afternoon', 'evening', 'night'];

const SLOT_META = {
  morning:   { label: 'Morning',   emoji: '🌅', Icon: Sun,    gradient: 'from-amber-500/15 to-transparent',    accent: '#f59e0b' },
  afternoon: { label: 'Afternoon', emoji: '☀️', Icon: Sunset, gradient: 'from-orange-500/10 to-transparent',   accent: '#f97316' },
  evening:   { label: 'Evening',   emoji: '🌆', Icon: Sunset, gradient: 'from-violet-500/10 to-transparent',   accent: '#8b5cf6' },
  night:     { label: 'Night',     emoji: '🌙', Icon: Moon,   gradient: 'from-indigo-500/10 to-transparent',   accent: '#6366f1' },
};

export default function Today({ navigate }) {
  const today     = getToday();
  const dayOfWeek = getDayOfWeek();

  const [activeTracker,    setActiveTracker]    = useState('both');
  const [collapsedSlots,   setCollapsedSlots]   = useState({});
  const [showCalendar, setShowCalendar]     = useState(false);
  const [showNonRegular, setShowNonRegular] = useState(false);
  const [showGuide, setShowGuide]           = useState(false);
  const [showCalendarModal,setShowCalendarModal] = useState(false);
  const [showLeftDrawer,   setShowLeftDrawer]   = useState(false);
  const [showRightDrawer,  setShowRightDrawer]  = useState(false);

  const allHabits = useLiveQuery(() => db.habits.toArray(), []);
  const logs      = useLiveQuery(() => db.dailyLogs.where('date').equals(today).toArray(), [today]);
  const allLogs   = useLiveQuery(() => db.dailyLogs.toArray(), []);

  const todaysDailyHabits = useMemo(() => {
    if (!allHabits) return [];
    return allHabits.filter(
      (h) => h.frequency === 'daily' && h.schedule && h.schedule.includes(dayOfWeek)
    );
  }, [allHabits, dayOfWeek]);

  const completionMap = useMemo(() => {
    const map = {};
    if (logs) logs.forEach((l) => { map[l.habitId] = l.completed; });
    return map;
  }, [logs]);

  const fitnessHabits  = useMemo(() => todaysDailyHabits.filter((h) => h.type === 'fitness'),  [todaysDailyHabits]);
  const wellnessHabits = useMemo(() => todaysDailyHabits.filter((h) => h.type === 'wellness'), [todaysDailyHabits]);

  const fitnessTotal     = fitnessHabits.length;
  const fitnessCompleted = fitnessHabits.filter((h) => completionMap[h.id]).length;
  const fitnessProgress  = fitnessTotal > 0 ? (fitnessCompleted / fitnessTotal) * 100 : 0;

  const wellnessTotal     = wellnessHabits.length;
  const wellnessCompleted = wellnessHabits.filter((h) => completionMap[h.id]).length;
  const wellnessProgress  = wellnessTotal > 0 ? (wellnessCompleted / wellnessTotal) * 100 : 0;

  const overallCompleted = fitnessCompleted + wellnessCompleted;
  const overallTotal     = fitnessTotal + wellnessTotal;
  const overallProgress  = overallTotal > 0 ? (overallCompleted / overallTotal) * 100 : 0;

  const topStreak = useMemo(() => {
    if (!allLogs || !todaysDailyHabits || todaysDailyHabits.length === 0) return 0;
    let max = 0;
    todaysDailyHabits.forEach((habit) => {
      const s = calculateStreak(allLogs.filter((l) => l.habitId === habit.id));
      if (s > max) max = s;
    });
    return max;
  }, [allLogs, todaysDailyHabits]);

  const groupedHabits = useMemo(() => {
    const g = { morning: { fitness: [], wellness: [] }, afternoon: { fitness: [], wellness: [] }, evening: { fitness: [], wellness: [] }, night: { fitness: [], wellness: [] } };
    CHRONOLOGICAL_SLOTS.forEach((slot) => {
      g[slot].fitness  = fitnessHabits.filter((h)  => h.timeOfDay === slot);
      g[slot].wellness = wellnessHabits.filter((h) => h.timeOfDay === slot);
    });
    return g;
  }, [fitnessHabits, wellnessHabits]);

  async function toggleHabit(habitId) {
    const key = [today, habitId];
    try {
      const existing = await db.dailyLogs.get(key);
      if (existing) {
        await db.dailyLogs.put({ date: today, habitId, completed: !existing.completed, timestamp: new Date().toISOString() });
      } else {
        await db.dailyLogs.add({ date: today, habitId, completed: true, timestamp: new Date().toISOString() });
      }
    } catch (err) {
      console.error('Failed to toggle habit:', err);
    }
  }

  function toggleSlotCollapse(slot) {
    setCollapsedSlots((prev) => ({ ...prev, [slot]: !prev[slot] }));
  }

  if (!allHabits || !logs) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
          <p className="text-zinc-600 text-xs animate-pulse">Loading your day…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* ═══════════════════════════════════════════════════════════
          3-COLUMN COCKPIT LAYOUT
      ═══════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">

        {/* ─────────────────────────────────────────────────────────
            LEFT COLUMN — Treatment Queue (Desktop sidebar)
        ───────────────────────────────────────────────────────── */}
        <div className="hidden lg:block lg:col-span-3">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="sticky top-6 space-y-4"
          >
            {/* Queue card */}
            <div
              className="rounded-3xl p-5 border border-zinc-800/60"
              style={{ background: 'linear-gradient(160deg, rgba(30,30,35,0.9), rgba(18,18,22,0.8))', backdropFilter: 'blur(16px)' }}
            >
              <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-white/5">
                <div className="w-8 h-8 rounded-xl bg-purple-500/15 flex items-center justify-center text-sm">🔬</div>
                <div>
                  <p className="text-xs font-bold text-white uppercase tracking-widest">Treatment Queue</p>
                  <p className="text-[10px] text-zinc-600 mt-0.5">Gap & non-regular tasks</p>
                </div>
              </div>
              <NonRegularSidebar toggleHabit={toggleHabit} completionMap={completionMap} />
            </div>

            {/* Today's date card */}
            <div
              className="rounded-3xl p-4 border border-zinc-800/40"
              style={{ background: 'rgba(18,18,22,0.7)', backdropFilter: 'blur(16px)' }}
            >
              <p className="text-[10px] text-zinc-600 uppercase tracking-widest font-bold mb-1">Today</p>
              <p className="text-sm font-bold text-zinc-200">{format(new Date(), 'EEEE, MMMM d')}</p>
              {topStreak > 0 && (
                <div className="flex items-center gap-1.5 mt-2 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 w-fit">
                  <Flame size={12} className="text-amber-400" />
                  <span className="text-[11px] font-bold text-amber-400">{topStreak} day streak</span>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* ─────────────────────────────────────────────────────────
            CENTER COLUMN — Main Checklist
        ───────────────────────────────────────────────────────── */}
        <div className="lg:col-span-6 col-span-1 space-y-5">

          {/* ── Mobile Top Bar ── */}
          <div className="flex items-center justify-between lg:hidden mb-2">
            <button
              onClick={() => setShowGuide(true)}
              className="w-10 h-10 rounded-2xl flex items-center justify-center text-zinc-400 hover:text-white transition-all active:scale-90 cursor-pointer bg-zinc-800/80 border border-white/10"
            >
              <HelpCircle size={17} />
            </button>

            <div className="flex-1">
              <LiveClock isMobile={true} />
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setShowCalendarModal(true)}
                className="w-10 h-10 rounded-2xl flex items-center justify-center text-zinc-400 hover:text-white transition-all active:scale-90 cursor-pointer"
                style={{ background: 'rgba(39,39,42,0.7)', border: '1px solid rgba(255,255,255,0.07)' }}
              >
                <Calendar size={17} />
              </button>
              <button
                onClick={() => setShowRightDrawer(true)}
                className="w-10 h-10 rounded-2xl flex items-center justify-center text-zinc-400 hover:text-white transition-all active:scale-90 cursor-pointer"
                style={{ background: 'rgba(39,39,42,0.7)', border: '1px solid rgba(255,255,255,0.07)' }}
              >
                <ClipboardList size={17} />
              </button>
            </div>
          </div>

          {/* ── Desktop Header ── */}
          <div className="hidden lg:flex items-center justify-between">
            <LiveClock isMobile={false} />
            <div className="flex gap-2">
              <button
                onClick={() => setShowGuide(true)}
                className="w-10 h-10 rounded-xl bg-zinc-800/80 hover:bg-zinc-700 flex items-center justify-center border border-white/5 transition-colors cursor-pointer"
              >
                <HelpCircle size={16} className="text-zinc-400" />
              </button>
              <button
                onClick={() => setShowCalendar(true)}
                className="w-10 h-10 rounded-xl bg-zinc-800/80 hover:bg-zinc-700 flex items-center justify-center border border-white/5 transition-colors cursor-pointer"
              >
                <Calendar size={16} className="text-zinc-400" />
              </button>
            </div>
          </div>

          {/* ── Hero Progress Card ── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="relative rounded-3xl overflow-hidden"
            style={{
              background: 'linear-gradient(145deg, rgba(30,30,36,0.95), rgba(18,18,22,0.85))',
              border: '1px solid rgba(255,255,255,0.06)',
              backdropFilter: 'blur(20px)',
            }}
          >
            {/* Subtle gradient glow top */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            <div className="p-5">
              {/* Top row: streak + filter tabs */}
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  {topStreak > 0 && (
                    <motion.div
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
                      style={{ background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.25)' }}
                    >
                      <Flame size={13} className="text-amber-400" />
                      <span className="text-[12px] font-bold text-amber-400">{topStreak}d</span>
                    </motion.div>
                  )}
                  <div
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
                    style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)' }}
                  >
                    <Zap size={12} className="text-emerald-400" />
                    <span className="text-[12px] font-bold text-emerald-400">{overallCompleted}/{overallTotal}</span>
                  </div>
                </div>

                {/* Filter toggle pills */}
                <div
                  className="flex items-center gap-0.5 p-1 rounded-2xl"
                  style={{ background: 'rgba(0,0,0,0.3)' }}
                >
                  {[
                    { id: 'both',     label: 'All' },
                    { id: 'fitness',  label: '💪' },
                    { id: 'wellness', label: '🌿' },
                  ].map(({ id, label }) => (
                    <button
                      key={id}
                      onClick={() => setActiveTracker(id)}
                      className="px-3 py-1 rounded-xl text-[11px] font-bold transition-all cursor-pointer"
                      style={{
                        background: activeTracker === id ? 'rgba(16,185,129,0.2)' : 'transparent',
                        color: activeTracker === id ? '#10b981' : '#71717a',
                        border: activeTracker === id ? '1px solid rgba(16,185,129,0.3)' : '1px solid transparent',
                      }}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Two rings side by side */}
              <div className="grid grid-cols-2 gap-4">
                {/* Fitness ring */}
                <motion.div
                  className="flex flex-col items-center gap-3 p-4 rounded-2xl cursor-pointer transition-all"
                  style={{
                    background: activeTracker === 'wellness'
                      ? 'rgba(0,0,0,0.2)'
                      : 'rgba(244,63,94,0.06)',
                    border: `1px solid ${activeTracker === 'wellness' ? 'rgba(255,255,255,0.04)' : 'rgba(244,63,94,0.15)'}`,
                    opacity: activeTracker === 'wellness' ? 0.35 : 1,
                  }}
                  onClick={() => setActiveTracker((p) => p === 'fitness' ? 'both' : 'fitness')}
                  whileTap={{ scale: 0.96 }}
                >
                  <ProgressRing
                    progress={fitnessProgress}
                    size={96}
                    strokeWidth={7}
                    ringColor="#f43f5e"
                    completed={fitnessCompleted}
                    total={fitnessTotal}
                  />
                  <div className="text-center">
                    <p className="text-[10px] font-black uppercase tracking-widest text-rose-500">Fitness</p>
                    <p className="text-xs text-zinc-500 mt-0.5">{fitnessCompleted} done</p>
                  </div>
                </motion.div>

                {/* Wellness ring */}
                <motion.div
                  className="flex flex-col items-center gap-3 p-4 rounded-2xl cursor-pointer transition-all"
                  style={{
                    background: activeTracker === 'fitness'
                      ? 'rgba(0,0,0,0.2)'
                      : 'rgba(14,165,233,0.06)',
                    border: `1px solid ${activeTracker === 'fitness' ? 'rgba(255,255,255,0.04)' : 'rgba(14,165,233,0.15)'}`,
                    opacity: activeTracker === 'fitness' ? 0.35 : 1,
                  }}
                  onClick={() => setActiveTracker((p) => p === 'wellness' ? 'both' : 'wellness')}
                  whileTap={{ scale: 0.96 }}
                >
                  <ProgressRing
                    progress={wellnessProgress}
                    size={96}
                    strokeWidth={7}
                    ringColor="#0ea5e9"
                    completed={wellnessCompleted}
                    total={wellnessTotal}
                  />
                  <div className="text-center">
                    <p className="text-[10px] font-black uppercase tracking-widest text-sky-500">Wellness</p>
                    <p className="text-xs text-zinc-500 mt-0.5">{wellnessCompleted} done</p>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* ── Slot-grouped Habit Checklist or Empty State ── */}
          {allHabits.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-3xl overflow-hidden p-8 text-center border"
              style={{
                background: 'linear-gradient(145deg, rgba(30,30,36,0.95), rgba(18,18,22,0.95))',
                borderColor: 'rgba(255,255,255,0.05)',
                backdropFilter: 'blur(12px)',
              }}
            >
              <div className="w-16 h-16 rounded-full bg-purple-500/10 flex items-center justify-center mx-auto mb-4 border border-purple-500/20 shadow-[0_0_20px_rgba(168,85,247,0.15)]">
                <Sparkles size={28} className="text-purple-400" />
              </div>
              <h2 className="text-xl font-black text-white mb-2 tracking-tight">Your Routine is Empty</h2>
              <p className="text-zinc-400 text-sm mb-6 max-w-[250px] mx-auto leading-relaxed">
                Start building your perfect day. Create your first habit in settings to get started.
              </p>
              <button
                onClick={() => navigate('settings')}
                className="mx-auto flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-black text-white transition-all active:scale-95 shadow-lg"
                style={{ background: 'linear-gradient(135deg, #a855f7, #8b5cf6)' }}
              >
                Create Habit <ChevronRight size={16} />
              </button>
            </motion.div>
          ) : (
            <div className="space-y-4">
              {CHRONOLOGICAL_SLOTS.map((slot) => {
                const { fitness, wellness } = groupedHabits[slot];
                if (fitness.length === 0 && wellness.length === 0) return null;

                const meta = SLOT_META[slot];
                let completedCount = 0;
                let totalCount = 0;

                if (activeTracker !== 'wellness') {
                  completedCount += fitness.filter((h)  => completionMap[h.id]).length;
                  totalCount     += fitness.length;
                }
                if (activeTracker !== 'fitness') {
                  completedCount += wellness.filter((h) => completionMap[h.id]).length;
                  totalCount     += wellness.length;
                }
                if (totalCount === 0) return null;

                const isCollapsed = collapsedSlots[slot];
                const isDone = completedCount === totalCount;

                return (
                  <motion.div
                    key={slot}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-3xl overflow-hidden"
                    style={{
                      border: `1px solid ${isDone ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.05)'}`,
                      background: 'rgba(18,18,22,0.7)',
                      backdropFilter: 'blur(12px)',
                    }}
                  >
                    {/* Slot header button */}
                    <button
                      onClick={() => toggleSlotCollapse(slot)}
                      className="w-full flex items-center justify-between px-4 py-3.5 cursor-pointer"
                      style={{
                        background: isDone
                          ? 'linear-gradient(135deg, rgba(16,185,129,0.08), transparent)'
                          : `linear-gradient(135deg, rgba(30,30,35,0.8), transparent)`,
                      }}
                    >
                      <div className="flex items-center gap-3">
                        {/* Time icon */}
                        <div
                          className="w-8 h-8 rounded-xl flex items-center justify-center text-sm"
                          style={{ background: `${meta.accent}18`, border: `1px solid ${meta.accent}30` }}
                        >
                          {meta.emoji}
                        </div>
                        <div className="text-left">
                          <p className="text-sm font-bold text-zinc-200 leading-tight">{meta.label}</p>
                          <p className="text-[10px] text-zinc-600 mt-0.5">{completedCount}/{totalCount} tasks</p>
                        </div>
                        {isDone && (
                          <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                            style={{ background: 'rgba(16,185,129,0.15)', color: '#10b981', border: '1px solid rgba(16,185,129,0.25)' }}
                          >
                            ✓ Done
                          </motion.span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Mini progress bar */}
                        <div className="w-16 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                          <motion.div
                            className="h-full rounded-full"
                            style={{ background: isDone ? '#10b981' : meta.accent }}
                            initial={{ width: '0%' }}
                            animate={{ width: `${(completedCount / totalCount) * 100}%` }}
                            transition={{ duration: 0.6, ease: 'easeOut' }}
                          />
                        </div>
                        <motion.div
                          animate={{ rotate: isCollapsed ? 0 : 180 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ChevronDown size={15} className="text-zinc-600" />
                        </motion.div>
                      </div>
                    </button>

                    {/* Habit list */}
                    <AnimatePresence>
                      {!isCollapsed && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25 }}
                          className="overflow-hidden"
                        >
                          <div className="px-3 pb-3 pt-1 space-y-2">
                            {activeTracker !== 'wellness' && fitness.map((habit, idx) => (
                              <HabitCard
                                key={habit.id}
                                habit={habit}
                                completed={!!completionMap[habit.id]}
                                onToggle={() => toggleHabit(habit.id)}
                                index={idx}
                              />
                            ))}
                            {activeTracker !== 'fitness' && wellness.map((habit, idx) => (
                              <HabitCard
                                key={habit.id}
                                habit={habit}
                                completed={!!completionMap[habit.id]}
                                onToggle={() => toggleHabit(habit.id)}
                                index={idx}
                              />
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* ─────────────────────────────────────────────────────────
            RIGHT COLUMN — Macro Calculator (Desktop sidebar)
        ───────────────────────────────────────────────────────── */}
        <div className="hidden lg:block lg:col-span-3">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
            className="sticky top-6"
          >
            <MacroCalculator />
          </motion.div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════
          MOBILE DRAWERS
      ═══════════════════════════════════════════════════ */}

      {/* Left — Treatment Queue */}
      <AnimatePresence>
        {showLeftDrawer && (
          <NonRegularDrawer isOpen={showLeftDrawer} onClose={() => setShowLeftDrawer(false)} />
        )}
      </AnimatePresence>

      {/* Right — Macro Calculator */}
      <AnimatePresence>
        {showRightDrawer && (
          <motion.div
            className="fixed inset-0 z-[100] flex justify-end lg:hidden"
            style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(8px)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowRightDrawer(false)}
          >
            <motion.div
              className="h-full w-[88vw] max-w-sm flex flex-col shadow-2xl overflow-y-auto"
              style={{
                background: 'linear-gradient(160deg, rgba(22,22,28,0.98), rgba(14,14,18,0.98))',
                borderLeft: '1px solid rgba(255,255,255,0.07)',
              }}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Drawer handle + header */}
              <div
                className="flex items-center justify-between px-5 py-4"
                style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-xl bg-emerald-500/15 flex items-center justify-center">
                    <ClipboardList size={14} className="text-emerald-400" />
                  </div>
                  <span className="text-sm font-bold text-white tracking-wide">Nutrition Calc</span>
                </div>
                <button
                  onClick={() => setShowRightDrawer(false)}
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-zinc-500 hover:text-white transition-colors cursor-pointer"
                  style={{ background: 'rgba(255,255,255,0.06)' }}
                >
                  <X size={15} />
                </button>
              </div>
              <div className="flex-1 p-4">
                <MacroCalculator />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Modals ── */}
      <AnimatePresence>
        {showCalendar && <CalendarModal onClose={() => setShowCalendar(false)} logs={logs} today={today} />}
        {showNonRegular && <NonRegularDrawer onClose={() => setShowNonRegular(false)} />}
        {showGuide && <AppGuide onClose={() => setShowGuide(false)} />}
      </AnimatePresence>
    </div>
  );
}

/* ─── Desktop-only sidebar component ────────────────────────── */
function NonRegularSidebar({ toggleHabit, completionMap }) {
  const dayOfWeek = getDayOfWeek();
  const gapHabits = useLiveQuery(() => db.habits.where('frequency').equals('gap').toArray(), []);

  const todayGaps = useMemo(() => {
    if (!gapHabits) return [];
    return gapHabits.filter((h) => h.schedule && h.schedule.includes(dayOfWeek));
  }, [gapHabits, dayOfWeek]);

  if (!gapHabits) return <div className="w-5 h-5 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin mx-auto" />;

  return (
    <div className="space-y-3">
      {todayGaps.length > 0 ? (
        todayGaps.map((habit) => (
          <HabitCard
            key={habit.id}
            habit={habit}
            completed={!!completionMap[habit.id]}
            onToggle={() => toggleHabit(habit.id)}
            index={0}
          />
        ))
      ) : (
        <div className="text-center py-6">
          <p className="text-2xl mb-2">😴</p>
          <p className="text-xs text-zinc-600 font-medium">No gap tasks today</p>
        </div>
      )}
    </div>
  );
}
