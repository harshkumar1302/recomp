import { useMemo } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { motion } from 'framer-motion';
import { X, Sparkles, AlertCircle } from 'lucide-react';
import { db } from '../db/db';
import { getToday, getDayOfWeek } from '../utils/helpers';
import HabitCard from './HabitCard';

export default function NonRegularDrawer({ isOpen, onClose }) {
  const today = getToday();
  const dayOfWeek = getDayOfWeek();

  // Load only non-regular habits (frequency === 'gap')
  const gapHabits = useLiveQuery(
    () => db.habits.where('frequency').equals('gap').toArray(),
    []
  );

  // Load today's logs to check off items
  const logs = useLiveQuery(
    () => db.dailyLogs.where('date').equals(today).toArray(),
    [today]
  );

  const completionMap = useMemo(() => {
    const map = {};
    if (logs) {
      logs.forEach((l) => {
        map[l.habitId] = l.completed;
      });
    }
    return map;
  }, [logs]);

  // Separate habits scheduled for today vs other days of the week
  const { todayGaps, otherGaps } = useMemo(() => {
    if (!gapHabits) return { todayGaps: [], otherGaps: [] };
    const todayList = [];
    const otherList = [];
    
    gapHabits.forEach((habit) => {
      if (habit.schedule && habit.schedule.includes(dayOfWeek)) {
        todayList.push(habit);
      } else {
        otherList.push(habit);
      }
    });

    return { todayGaps: todayList, otherGaps: otherList };
  }, [gapHabits, dayOfWeek]);

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

  if (!isOpen) return null;

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex justify-start bg-black/60 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="glass-card h-full w-80 max-w-[85vw] p-5 flex flex-col space-y-5 shadow-2xl relative"
        initial={{ x: '-100%' }}
        animate={{ x: 0 }}
        exit={{ x: '-100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 250 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <span className="text-base">🔬</span>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Treatment Queue
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Info label */}
        <p className="text-[10px] text-zinc-500 leading-relaxed bg-zinc-900/50 p-2.5 rounded-xl border border-zinc-850 flex gap-2">
          <AlertCircle size={12} className="text-purple-400 shrink-0 mt-0.5" />
          These are non-regular routine gap items (e.g. specialized hair treatments) and are kept out of your main checklist.
        </p>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto space-y-5 pr-1">
          {/* Scheduled for today */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-purple-400 flex items-center gap-1.5 uppercase tracking-wider">
              <Sparkles size={11} /> Active Today
            </h3>
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
              <p className="text-xs text-zinc-600 italic pl-1">No treatments scheduled today</p>
            )}
          </div>

          {/* Scheduled for other days */}
          {otherGaps.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
                Rest of the Week
              </h3>
              <div className="space-y-2 opacity-50 hover:opacity-100 transition-opacity duration-300">
                {otherGaps.map((habit) => (
                  <HabitCard
                    key={habit.id}
                    habit={habit}
                    completed={!!completionMap[habit.id]}
                    onToggle={() => toggleHabit(habit.id)}
                    index={1}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
