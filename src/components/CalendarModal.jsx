import { useState, useMemo } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { motion, AnimatePresence } from 'framer-motion';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  addMonths,
  subMonths,
  isToday,
  isSameMonth,
  isSameDay,
} from 'date-fns';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { db } from '../db/db';

function DoubleProgressRing({ fitnessProgress, wellnessProgress, size = 36, strokeWidth = 2.5 }) {
  const padding = 10;
  const svgSize = size + padding;
  const center = svgSize / 2;

  // Wellness (Outer ring, Blue/Cyan)
  const wellnessRadius = (size - strokeWidth) / 2;
  const wellnessCircumference = wellnessRadius * 2 * Math.PI;
  const wellnessOffset = wellnessCircumference - (Math.min(100, Math.max(0, wellnessProgress)) / 100) * wellnessCircumference;
  const wellnessTrackColor = '#062539'; // Dark slate blue
  const wellnessStrokeColor = '#0ea5e9'; // Bright sky blue

  // Fitness (Inner ring, Red)
  const fitnessRadius = wellnessRadius - strokeWidth - 2; // Gap of 2px
  const fitnessCircumference = fitnessRadius * 2 * Math.PI;
  const fitnessOffset = fitnessCircumference - (Math.min(100, Math.max(0, fitnessProgress)) / 100) * fitnessCircumference;
  const fitnessTrackColor = '#2e1018'; // Dark burgundy
  const fitnessStrokeColor = '#f43f5e'; // Bright rose

  return (
    <div className="relative flex items-center justify-center overflow-visible" style={{ width: size, height: size }}>
      <svg width={svgSize} height={svgSize} className="absolute transform -rotate-90 overflow-visible">
        {/* Wellness (Outer) Track */}
        <circle
          cx={center}
          cy={center}
          r={wellnessRadius}
          fill="none"
          stroke={wellnessTrackColor}
          strokeWidth={strokeWidth}
        />
        {/* Wellness Progress */}
        {wellnessProgress > 0 && (
          <motion.circle
            cx={center}
            cy={center}
            r={wellnessRadius}
            fill="none"
            stroke={wellnessStrokeColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={wellnessCircumference}
            initial={{ strokeDashoffset: wellnessCircumference }}
            animate={{ strokeDashoffset: wellnessOffset }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            style={{
              filter: wellnessProgress >= 100 ? `drop-shadow(0 0 3px ${wellnessStrokeColor})` : 'none',
            }}
          />
        )}
        <circle
          cx={center + wellnessRadius}
          cy={center}
          r={strokeWidth / 2}
          fill={wellnessStrokeColor}
        />

        {/* Fitness (Inner) Track */}
        <circle
          cx={center}
          cy={center}
          r={fitnessRadius}
          fill="none"
          stroke={fitnessTrackColor}
          strokeWidth={strokeWidth}
        />
        {/* Fitness Progress */}
        {fitnessProgress > 0 && (
          <motion.circle
            cx={center}
            cy={center}
            r={fitnessRadius}
            fill="none"
            stroke={fitnessStrokeColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={fitnessCircumference}
            initial={{ strokeDashoffset: fitnessCircumference }}
            animate={{ strokeDashoffset: fitnessOffset }}
            transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 }}
            style={{
              filter: fitnessProgress >= 100 ? `drop-shadow(0 0 3px ${fitnessStrokeColor})` : 'none',
            }}
          />
        )}
        <circle
          cx={center + fitnessRadius}
          cy={center}
          r={strokeWidth / 2}
          fill={fitnessStrokeColor}
        />
      </svg>
    </div>
  );
}

export default function CalendarModal({ isOpen, onClose }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const habits = useLiveQuery(() => db.habits.toArray(), []);
  
  // Calculate date range for the active month to fetch logs efficiently
  const startMonthStr = useMemo(() => format(startOfMonth(currentMonth), 'yyyy-MM-dd'), [currentMonth]);
  const endMonthStr = useMemo(() => format(endOfMonth(currentMonth), 'yyyy-MM-dd'), [currentMonth]);

  const monthLogs = useLiveQuery(
    () => db.dailyLogs.where('date').between(startMonthStr, endMonthStr, true, true).toArray(),
    [startMonthStr, endMonthStr]
  );

  const daysGrid = useMemo(() => {
    const firstDay = startOfMonth(currentMonth);
    // Convert to Mon-first index (Mon=0, Tue=1 ... Sun=6)
    const dow = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
    
    const days = eachDayOfInterval({
      start: startOfMonth(currentMonth),
      end: endOfMonth(currentMonth),
    });

    const grid = [];
    // Add placeholders for previous month days
    for (let i = 0; i < dow; i++) {
      grid.push(null);
    }
    // Add current month days
    days.forEach((day) => {
      grid.push(day);
    });

    return grid;
  }, [currentMonth]);

  // Calculate day completion percentages in-memory
  const dayProgressMap = useMemo(() => {
    if (!habits || !monthLogs) return {};
    
    const progressMap = {};
    const logsByDate = {};

    // Group logs by date
    monthLogs.forEach((log) => {
      if (!logsByDate[log.date]) {
        logsByDate[log.date] = [];
      }
      logsByDate[log.date].push(log);
    });

    // Generate progress for each day of interval
    const days = eachDayOfInterval({
      start: startOfMonth(currentMonth),
      end: endOfMonth(currentMonth),
    });

    days.forEach((day) => {
      const dateStr = format(day, 'yyyy-MM-dd');
      const dayOfWeek = day.getDay(); // 0=Sun, 1=Mon...

      // Habits scheduled for this day-of-week
      const scheduledHabits = habits.filter((h) => h.schedule && h.schedule.includes(dayOfWeek));
      const fitnessHabits = scheduledHabits.filter(h => h.type === 'fitness');
      const wellnessHabits = scheduledHabits.filter(h => h.type === 'wellness');
      
      if (scheduledHabits.length === 0) {
        progressMap[dateStr] = { fitness: 0, wellness: 0 };
        return;
      }

      // Check which scheduled habits were completed
      const dayLogs = logsByDate[dateStr] || [];
      
      const fitnessCompleted = fitnessHabits.filter((h) =>
        dayLogs.some((l) => l.habitId === h.id && l.completed)
      ).length;
      
      const wellnessCompleted = wellnessHabits.filter((h) =>
        dayLogs.some((l) => l.habitId === h.id && l.completed)
      ).length;

      progressMap[dateStr] = {
        fitness: fitnessHabits.length > 0 ? Math.round((fitnessCompleted / fitnessHabits.length) * 100) : 0,
        wellness: wellnessHabits.length > 0 ? Math.round((wellnessCompleted / wellnessHabits.length) * 100) : 0,
      };
    });

    return progressMap;
  }, [habits, monthLogs, currentMonth]);

  if (!isOpen) return null;

  const weekdayLabels = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 backdrop-blur-md p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="glass-card w-full max-w-sm rounded-3xl p-6 relative flex flex-col space-y-5"
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 350 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Title & Close Button Row */}
        <div className="flex items-center justify-between px-1">
          <h2 className="text-zinc-500 text-xs font-bold uppercase tracking-wider">
            Activity Calendar
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-zinc-850 border border-zinc-800 text-zinc-400 hover:text-white transition-all duration-200 active:scale-95 cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Month Header Selector Row */}
        <div className="flex flex-col gap-3 bg-zinc-900/40 border border-zinc-800/60 rounded-2xl p-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-white tracking-wide">
              {format(currentMonth, 'MMMM yyyy')}
            </span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCurrentMonth((prev) => subMonths(prev, 1))}
                className="p-1.5 rounded-lg bg-zinc-800/40 border border-zinc-700/30 text-zinc-400 hover:text-white transition-all active:scale-90 cursor-pointer"
              >
                <ChevronLeft size={14} />
              </button>
              <button
                onClick={() => setCurrentMonth((prev) => addMonths(prev, 1))}
                className="p-1.5 rounded-lg bg-zinc-800/40 border border-zinc-700/30 text-zinc-400 hover:text-white transition-all active:scale-90 cursor-pointer"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
          
          {/* Legend */}
          <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-wider">
            <div className="flex items-center gap-1.5 text-zinc-400">
              <div className="w-2.5 h-2.5 rounded-full bg-[#f43f5e] shadow-[0_0_4px_#f43f5e]"></div>
              Fitness
            </div>
            <div className="flex items-center gap-1.5 text-zinc-400">
              <div className="w-2.5 h-2.5 rounded-full bg-[#0ea5e9] shadow-[0_0_4px_#0ea5e9]"></div>
              Wellness
            </div>
          </div>
        </div>

        {/* Calendar Weekday Labels */}
        <div className="grid grid-cols-7 text-center">
          {weekdayLabels.map((lbl, idx) => (
            <span key={idx} className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest py-1">
              {lbl}
            </span>
          ))}
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 gap-y-5 gap-x-2 text-center">
          {daysGrid.map((day, idx) => {
            if (!day) {
              return <div key={`empty-${idx}`} className="h-16" />; // Spacer for offsets
            }

            const dateStr = format(day, 'yyyy-MM-dd');
            const progress = dayProgressMap[dateStr] || { fitness: 0, wellness: 0 };
            const currentIsToday = isToday(day);

            return (
              <div key={dateStr} className="flex flex-col items-center justify-center h-16 py-0.5 relative">
                {/* Day number/badge */}
                <div className="h-6 flex items-center justify-center mb-2 z-10 relative">
                  {currentIsToday ? (
                    <span className="w-6 h-6 bg-rose-500 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg shadow-rose-500/25">
                      {day.getDate()}
                    </span>
                  ) : (
                    <span className="text-xs font-medium text-zinc-400">
                      {day.getDate()}
                    </span>
                  )}
                </div>

                {/* Progress Ring */}
                <div className="absolute inset-0 flex items-center justify-center mt-6">
                  <DoubleProgressRing fitnessProgress={progress.fitness} wellnessProgress={progress.wellness} />
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
}
