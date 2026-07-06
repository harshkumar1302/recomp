import { useState, useMemo } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { Flame, ChevronDown, ChevronUp, Sparkles, Calendar, Menu, ClipboardList, X } from 'lucide-react';
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

const CHRONOLOGICAL_SLOTS = ['morning', 'afternoon', 'evening', 'night'];

export default function Today() {
  const today = getToday();
  const dayOfWeek = getDayOfWeek();

  const [activeTracker, setActiveTracker] = useState('both');
  const [collapsedSlots, setCollapsedSlots] = useState({});
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [showLeftDrawer, setShowLeftDrawer] = useState(false);
  const [showRightDrawer, setShowRightDrawer] = useState(false);

  // Load habits and daily logs
  const allHabits = useLiveQuery(() => db.habits.toArray(), []);
  const logs = useLiveQuery(
    () => db.dailyLogs.where('date').equals(today).toArray(),
    [today]
  );
  const allLogs = useLiveQuery(() => db.dailyLogs.toArray(), []);

  // Filter for only daily items scheduled for today
  const todaysDailyHabits = useMemo(() => {
    if (!allHabits) return [];
    return allHabits.filter(
      (h) => h.frequency === 'daily' && h.schedule && h.schedule.includes(dayOfWeek)
    );
  }, [allHabits, dayOfWeek]);

  const completionMap = useMemo(() => {
    const map = {};
    if (logs) {
      logs.forEach((l) => {
        map[l.habitId] = l.completed;
      });
    }
    return map;
  }, [logs]);

  // Split into Fitness vs Wellness checklists
  const fitnessHabits = useMemo(() => {
    return todaysDailyHabits.filter((h) => h.type === 'fitness');
  }, [todaysDailyHabits]);

  const wellnessHabits = useMemo(() => {
    return todaysDailyHabits.filter((h) => h.type === 'wellness');
  }, [todaysDailyHabits]);

  // Fitness stats
  const fitnessTotal = fitnessHabits.length;
  const fitnessCompleted = fitnessHabits.filter((h) => completionMap[h.id]).length;
  const fitnessProgress = fitnessTotal > 0 ? (fitnessCompleted / fitnessTotal) * 100 : 0;

  // Wellness stats
  const wellnessTotal = wellnessHabits.length;
  const wellnessCompleted = wellnessHabits.filter((h) => completionMap[h.id]).length;
  const wellnessProgress = wellnessTotal > 0 ? (wellnessCompleted / wellnessTotal) * 100 : 0;

  // Streak calculations
  const topStreak = useMemo(() => {
    if (!allLogs || !todaysDailyHabits || todaysDailyHabits.length === 0) return 0;
    let maxStreak = 0;
    todaysDailyHabits.forEach((habit) => {
      const habitLogs = allLogs.filter((l) => l.habitId === habit.id);
      const s = calculateStreak(habitLogs);
      if (s > maxStreak) maxStreak = s;
    });
    return maxStreak;
  }, [allLogs, todaysDailyHabits]);

  // Group habits by slot, sorted strictly chronologically
  const groupedHabits = useMemo(() => {
    const grouped = {
      morning: { fitness: [], wellness: [] },
      afternoon: { fitness: [], wellness: [] },
      evening: { fitness: [], wellness: [] },
      night: { fitness: [], wellness: [] },
    };

    CHRONOLOGICAL_SLOTS.forEach((slot) => {
      grouped[slot].fitness = fitnessHabits.filter((h) => h.timeOfDay === slot);
      grouped[slot].wellness = wellnessHabits.filter((h) => h.timeOfDay === slot);
    });

    return grouped;
  }, [fitnessHabits, wellnessHabits]);

  async function toggleHabit(habitId) {
    const key = [today, habitId];
    const existing = await db.dailyLogs.get(key);

    if (existing) {
      await db.dailyLogs.put({
        date: today,
        habitId,
        completed: !existing.completed,
        timestamp: new Date().toISOString(),
      });
    } else {
      await db.dailyLogs.add({
        date: today,
        habitId,
        completed: true,
        timestamp: new Date().toISOString(),
      });
    }
  }

  function toggleSlotCollapse(slot) {
    setCollapsedSlots((prev) => ({ ...prev, [slot]: !prev[slot] }));
  }

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    if (hour < 20) return 'Good Evening';
    return 'Good Night';
  }, []);

  if (!allHabits || !logs) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-1">
      {/* 3-Column Cockpit Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: Treatment Queue Sidebar (Desktop-only, Slide-out on Mobile) */}
        <div className="hidden lg:block lg:col-span-3 space-y-4">
          <div className="glass-card rounded-3xl p-5 border border-zinc-800/80 shadow-lg">
            <div className="flex items-center gap-2 pb-3 border-b border-zinc-800 mb-4">
              <span className="text-lg">🔬</span>
              <h2 className="text-xs font-bold text-white uppercase tracking-widest">
                Treatment Queue
              </h2>
            </div>
            <NonRegularSidebar toggleHabit={toggleHabit} completionMap={completionMap} />
          </div>
        </div>

        {/* CENTER COLUMN: Main Checklist & Progress Rings */}
        <div className="lg:col-span-6 col-span-1 space-y-6">
          
          {/* Header row with drawer buttons for mobile */}
          <div className="flex items-center justify-between">
            {/* Mobile Left Drawer Button */}
            <button
              onClick={() => setShowLeftDrawer(true)}
              className="lg:hidden w-10 h-10 rounded-xl bg-zinc-800/60 border border-zinc-700/50 flex items-center justify-center text-zinc-400 hover:text-white transition-all active:scale-95 cursor-pointer"
              title="Treatment Queue"
            >
              <Menu size={18} />
            </button>

            {/* Header Title */}
            <div className="text-center flex-1">
              <p className="text-zinc-500 text-xs">
                {format(new Date(), 'EEEE, MMMM d')}
              </p>
              <h1 className="text-xl font-bold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent mt-0.5">
                {greeting} ✨
              </h1>
            </div>

            <div className="flex items-center gap-2">
              {/* Calendar Toggle */}
              <button
                onClick={() => setShowCalendarModal(true)}
                className="w-10 h-10 rounded-xl bg-zinc-800/60 border border-zinc-700/50 flex items-center justify-center text-zinc-400 hover:text-white transition-colors active:scale-95 cursor-pointer"
                title="View Calendar History"
              >
                <Calendar size={18} />
              </button>

              {/* Mobile Right Drawer Button */}
              <button
                onClick={() => setShowRightDrawer(true)}
                className="lg:hidden w-10 h-10 rounded-xl bg-zinc-800/60 border border-zinc-700/50 flex items-center justify-center text-zinc-400 hover:text-white transition-all active:scale-95 cursor-pointer"
                title="Macro Calculator"
              >
                <ClipboardList size={18} />
              </button>
            </div>
          </div>

          {/* Double Completion Rings Card */}
          <motion.div
            className="glass-card rounded-3xl p-5 flex flex-col md:flex-row items-center justify-around gap-6"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            {/* Fitness Ring */}
            <div 
              className={`flex items-center gap-4 cursor-pointer transition-opacity ${activeTracker === 'wellness' ? 'opacity-40 grayscale' : 'opacity-100'}`}
              onClick={() => setActiveTracker(prev => prev === 'fitness' ? 'both' : 'fitness')}
            >
              <ProgressRing progress={fitnessProgress} size={90} strokeWidth={6} ringColor="#f43f5e" />
              <div>
                <p className="text-[10px] text-rose-500 uppercase font-bold tracking-wider">Fitness Tracker</p>
                <p className="text-lg font-bold text-white mt-0.5">
                  {fitnessCompleted} <span className="text-zinc-600 font-medium">/ {fitnessTotal}</span>
                </p>
              </div>
            </div>

            <div className="w-px h-10 bg-zinc-800 hidden md:block" />

            {/* Wellness Ring */}
            <div 
              className={`flex items-center gap-4 cursor-pointer transition-opacity ${activeTracker === 'fitness' ? 'opacity-40 grayscale' : 'opacity-100'}`}
              onClick={() => setActiveTracker(prev => prev === 'wellness' ? 'both' : 'wellness')}
            >
              <ProgressRing progress={wellnessProgress} size={90} strokeWidth={6} ringColor="#0ea5e9" />
              <div>
                <p className="text-[10px] text-sky-500 uppercase font-bold tracking-wider">Wellness & Hygiene</p>
                <p className="text-lg font-bold text-white mt-0.5">
                  {wellnessCompleted} <span className="text-zinc-600 font-medium">/ {wellnessTotal}</span>
                </p>
              </div>
            </div>
          </motion.div>

          {/* Chronological Daily Checklist */}
          <div className="space-y-6">
            {CHRONOLOGICAL_SLOTS.map((slot) => {
              const { fitness, wellness } = groupedHabits[slot];
              if (fitness.length === 0 && wellness.length === 0) return null;
              
              const isCollapsed = collapsedSlots[slot];
              
              let completedCount = 0;
              let totalCount = 0;
              
              if (activeTracker !== 'wellness') {
                completedCount += fitness.filter((h) => completionMap[h.id]).length;
                totalCount += fitness.length;
              }
              if (activeTracker !== 'fitness') {
                completedCount += wellness.filter((h) => completionMap[h.id]).length;
                totalCount += wellness.length;
              }
              
              if (totalCount === 0) return null;

              return (
                <div key={slot} className="space-y-3">
                  {/* Slot Bar */}
                  <button
                    onClick={() => toggleSlotCollapse(slot)}
                    className="w-full flex items-center justify-between px-2 text-left"
                  >
                    <div className="flex items-center gap-2">
                      <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
                        {getTimeSlotLabel(slot)}
                      </h2>
                      {completedCount === totalCount && (
                        <span className="text-[9px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-bold">
                          ✓ Complete
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-zinc-500">
                      <span>{completedCount} / {totalCount}</span>
                      {isCollapsed ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
                    </div>
                  </button>

                  <AnimatePresence>
                    {!isCollapsed && (
                      <motion.div
                        className="space-y-2"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                      >
                        {/* Fitness Sub-section */}
                        {fitness.length > 0 && activeTracker !== 'wellness' && (
                          <div className="space-y-2">
                            {fitness.map((habit, idx) => (
                              <HabitCard
                                key={habit.id}
                                habit={habit}
                                completed={!!completionMap[habit.id]}
                                onToggle={() => toggleHabit(habit.id)}
                                index={idx}
                              />
                            ))}
                          </div>
                        )}

                        {/* Wellness Sub-section */}
                        {wellness.length > 0 && activeTracker !== 'fitness' && (
                          <div className="space-y-2 mt-2">
                            {wellness.map((habit, idx) => (
                              <HabitCard
                                key={habit.id}
                                habit={habit}
                                completed={!!completionMap[habit.id]}
                                onToggle={() => toggleHabit(habit.id)}
                                index={idx}
                              />
                            ))}
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT COLUMN: Macro Calculator Sidebar (Desktop-only, Drawer on Mobile) */}
        <div className="hidden lg:block lg:col-span-3">
          <MacroCalculator />
        </div>
      </div>

      {/* MOBILE DRAWER: Left Treatment Drawer */}
      <AnimatePresence>
        {showLeftDrawer && (
          <NonRegularDrawer isOpen={showLeftDrawer} onClose={() => setShowLeftDrawer(false)} />
        )}
      </AnimatePresence>

      {/* MOBILE DRAWER: Right Macro Calculator Drawer */}
      <AnimatePresence>
        {showRightDrawer && (
          <motion.div
            className="fixed inset-0 z-[100] flex justify-end bg-black/60 backdrop-blur-sm lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowRightDrawer(false)}
          >
            <motion.div
              className="glass-card h-full w-80 max-w-[85vw] p-5 flex flex-col space-y-4 shadow-2xl overflow-y-auto"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">Nutrition Calc</h3>
                <button onClick={() => setShowRightDrawer(false)} className="text-zinc-400 hover:text-white cursor-pointer">
                  <X size={16} />
                </button>
              </div>
              <MacroCalculator />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Calendar History Modal */}
      <AnimatePresence>
        {showCalendarModal && (
          <CalendarModal isOpen={showCalendarModal} onClose={() => setShowCalendarModal(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}

// Inline Helper Component for Left Sidebar on Desktop
function NonRegularSidebar({ toggleHabit, completionMap }) {
  const dayOfWeek = getDayOfWeek();
  const gapHabits = useLiveQuery(() => db.habits.where('frequency').equals('gap').toArray(), []);

  const todayGaps = useMemo(() => {
    if (!gapHabits) return [];
    return gapHabits.filter((h) => h.schedule && h.schedule.includes(dayOfWeek));
  }, [gapHabits, dayOfWeek]);

  return (
    <div className="space-y-4">
      <div>
        <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold mb-2">Today's Treatment</p>
        {todayGaps.length > 0 ? (
          <div className="space-y-2">
            {todayGaps.map((habit) => (
              <HabitCard
                key={habit.id}
                habit={habit}
                completed={!!completionMap[habit.id]}
                onToggle={() => toggleHabit(habit.id)}
                index={0}
              />
            ))}
          </div>
        ) : (
          <p className="text-xs text-zinc-600 italic">No gap tasks scheduled today</p>
        )}
      </div>
    </div>
  );
}
