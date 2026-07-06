import { useMemo } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { motion } from 'framer-motion';
import { format, subDays, eachDayOfInterval, startOfDay } from 'date-fns';
import { Flame, TrendingUp, Calendar, Dumbbell, Heart, Utensils } from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
} from 'recharts';
import { db } from '../db/db';
import { getLast30Days, calculateStreak, getCategoryColor, getCategoryIcon } from '../utils/helpers';

/* ── Shared Components ──────────────────────────────────────── */

function HeatmapGrid({ logs, days }) {
  const completionByDate = useMemo(() => {
    const map = {};
    if (logs) {
      logs.forEach((l) => {
        if (l.completed) {
          map[l.date] = (map[l.date] || 0) + 1;
        }
      });
    }
    return map;
  }, [logs]);

  const maxCount = useMemo(() => {
    return Math.max(1, ...Object.values(completionByDate));
  }, [completionByDate]);

  return (
    <div className="flex flex-wrap gap-[3px]">
      {days.map((day) => {
        const count = completionByDate[day] || 0;
        const intensity = count / maxCount;
        let bg = 'rgba(255,255,255,0.03)';
        if (intensity > 0.75) bg = 'rgba(16, 185, 129, 0.8)';
        else if (intensity > 0.5) bg = 'rgba(16, 185, 129, 0.5)';
        else if (intensity > 0.25) bg = 'rgba(16, 185, 129, 0.3)';
        else if (intensity > 0) bg = 'rgba(16, 185, 129, 0.15)';

        return (
          <div
            key={day}
            className="w-[18px] h-[18px] rounded-[4px] transition-colors"
            style={{ background: bg }}
            title={`${format(new Date(day + 'T00:00:00'), 'MMM d')}: ${count} tasks`}
          />
        );
      })}
    </div>
  );
}

function WeeklyRecap({ logs, habits, days7 }) {
  const thisWeek = useMemo(() => {
    if (!logs || !habits) return { pct: 0, count: 0, total: 0 };
    const completedCount = logs.filter(
      (l) => l.completed && days7.includes(l.date)
    ).length;
    const totalPossible = habits.length * 7;
    return {
      pct: totalPossible > 0 ? Math.round((completedCount / totalPossible) * 100) : 0,
      count: completedCount,
      total: totalPossible,
    };
  }, [logs, habits, days7]);

  return (
    <div className="glass-card rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-3">
        <Calendar size={16} className="text-emerald-400" />
        <h3 className="text-sm font-semibold text-zinc-300">Weekly Recap</h3>
      </div>
      <div className="flex items-end gap-3">
        <span className="text-4xl font-bold text-white">{thisWeek.pct}%</span>
        <span className="text-sm text-zinc-500 mb-1">adherence this week</span>
      </div>
      <div className="mt-3 w-full bg-zinc-800 rounded-full h-2 overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{
            background: 'linear-gradient(90deg, #10b981, #22d3ee)',
          }}
          initial={{ width: 0 }}
          animate={{ width: `${thisWeek.pct}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>
      <p className="text-xs text-zinc-600 mt-2">
        {thisWeek.count} of ~{thisWeek.total} tasks completed
      </p>
    </div>
  );
}

function HabitStreaks({ habits, logs }) {
  const streaks = useMemo(() => {
    if (!habits || !logs) return [];
    return habits
      .map((h) => {
        const habitLogs = logs.filter((l) => l.habitId === h.id);
        return { ...h, streak: calculateStreak(habitLogs) };
      })
      .filter((h) => h.streak > 0)
      .sort((a, b) => b.streak - a.streak)
      .slice(0, 6);
  }, [habits, logs]);

  if (streaks.length === 0) return null;

  return (
    <div className="glass-card rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <Flame size={16} className="text-orange-400" />
        <h3 className="text-sm font-semibold text-zinc-300">Active Streaks</h3>
      </div>
      <div className="space-y-3">
        {streaks.map((h) => {
          const colors = getCategoryColor(h.category);
          return (
            <div key={h.id} className="flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-sm">{getCategoryIcon(h.category)}</span>
                <span className="text-sm text-zinc-300 truncate">{h.name}</span>
              </div>
              <span
                className="text-xs font-bold px-2.5 py-1 rounded-full shrink-0"
                style={{ color: colors.text, background: colors.bg }}
              >
                {h.streak}d 🔥
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Chart Tooltips ─────────────────────────────────────────── */

const PctTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card rounded-xl px-3 py-2 text-xs">
        <p className="text-zinc-400">{label}</p>
        <p className="text-emerald-400 font-bold">{payload[0].value}%</p>
      </div>
    );
  }
  return null;
};

const MacroTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card rounded-xl px-3 py-2 text-xs space-y-1">
        <p className="text-zinc-400">{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color }} className="font-bold">
            {p.name}: {p.value}{p.name === 'Calories' ? ' kcal' : 'g'}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

/* ── Main Dashboard Component ───────────────────────────────── */

export default function Dashboard() {
  const habits = useLiveQuery(() => db.habits.toArray(), []);
  const allLogs = useLiveQuery(() => db.dailyLogs.toArray(), []);
  const macroLogs = useLiveQuery(() => db.macroLogs.toArray(), []);

  const days30 = useMemo(() => getLast30Days(), []);
  const days7 = useMemo(() => {
    const today = startOfDay(new Date());
    return eachDayOfInterval({
      start: subDays(today, 6),
      end: today,
    }).map((d) => format(d, 'yyyy-MM-dd'));
  }, []);

  // Split habits by type
  const fitnessHabits = useMemo(() => {
    if (!habits) return [];
    return habits.filter((h) => h.type === 'fitness');
  }, [habits]);

  const wellnessHabits = useMemo(() => {
    if (!habits) return [];
    return habits.filter((h) => h.type === 'wellness');
  }, [habits]);

  // Fitness adherence chart data (30 days)
  const fitnessChartData = useMemo(() => {
    if (!allLogs || fitnessHabits.length === 0) return [];
    const fitIds = new Set(fitnessHabits.map((h) => h.id));
    return days30.map((day) => {
      const dayLogs = allLogs.filter((l) => l.date === day && l.completed && fitIds.has(l.habitId));
      const pct = Math.round((dayLogs.length / Math.max(1, fitnessHabits.length)) * 100);
      return {
        date: format(new Date(day + 'T00:00:00'), 'MMM d'),
        adherence: Math.min(100, pct),
      };
    });
  }, [allLogs, fitnessHabits, days30]);

  // Wellness adherence chart data (30 days)
  const wellnessChartData = useMemo(() => {
    if (!allLogs || wellnessHabits.length === 0) return [];
    const wellIds = new Set(wellnessHabits.map((h) => h.id));
    return days30.map((day) => {
      const dayLogs = allLogs.filter((l) => l.date === day && l.completed && wellIds.has(l.habitId));
      const pct = Math.round((dayLogs.length / Math.max(1, wellnessHabits.length)) * 100);
      return {
        date: format(new Date(day + 'T00:00:00'), 'MMM d'),
        adherence: Math.min(100, pct),
      };
    });
  }, [allLogs, wellnessHabits, days30]);

  // Macro chart data (last 14 days)
  const macroChartData = useMemo(() => {
    if (!macroLogs || macroLogs.length === 0) return [];
    const today = startOfDay(new Date());
    const last14 = eachDayOfInterval({
      start: subDays(today, 13),
      end: today,
    }).map((d) => format(d, 'yyyy-MM-dd'));

    return last14.map((day) => {
      const entry = macroLogs.find((m) => m.date === day);
      return {
        date: format(new Date(day + 'T00:00:00'), 'MMM d'),
        Protein: entry ? entry.protein : 0,
        Carbs: entry ? entry.carbs : 0,
        Fats: entry ? entry.fats : 0,
        Calories: entry ? entry.calories : 0,
      };
    });
  }, [macroLogs]);

  if (!habits || !allLogs) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto pb-4 space-y-5">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
          Dashboard
        </h1>
        <p className="text-zinc-500 text-sm mt-1">Your progress at a glance</p>
      </motion.div>

      {/* Weekly Recap */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <WeeklyRecap logs={allLogs} habits={habits} days7={days7} />
      </motion.div>

      {/* ── Graph 1: Fitness Adherence ──────────────────────── */}
      <motion.div
        className="glass-card rounded-2xl p-5"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <h3 className="text-sm font-semibold text-zinc-300 mb-4 flex items-center gap-2">
          <Dumbbell size={16} className="text-cyan-400" />
          Fitness Adherence (30d)
        </h3>
        {fitnessChartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={fitnessChartData}>
              <defs>
                <linearGradient id="fitGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#22d3ee" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="date" tick={{ fill: '#71717a', fontSize: 10 }} axisLine={false} tickLine={false} interval={6} />
              <YAxis domain={[0, 100]} tick={{ fill: '#71717a', fontSize: 10 }} axisLine={false} tickLine={false} width={30} />
              <Tooltip content={<PctTooltip />} />
              <Area type="monotone" dataKey="adherence" stroke="#22d3ee" fill="url(#fitGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-zinc-600 text-sm text-center py-8">Start logging fitness tasks to see trends</p>
        )}
      </motion.div>

      {/* ── Graph 2: Wellness Adherence ─────────────────────── */}
      <motion.div
        className="glass-card rounded-2xl p-5"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h3 className="text-sm font-semibold text-zinc-300 mb-4 flex items-center gap-2">
          <Heart size={16} className="text-emerald-400" />
          Wellness & Hygiene Adherence (30d)
        </h3>
        {wellnessChartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={wellnessChartData}>
              <defs>
                <linearGradient id="wellGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="date" tick={{ fill: '#71717a', fontSize: 10 }} axisLine={false} tickLine={false} interval={6} />
              <YAxis domain={[0, 100]} tick={{ fill: '#71717a', fontSize: 10 }} axisLine={false} tickLine={false} width={30} />
              <Tooltip content={<PctTooltip />} />
              <Area type="monotone" dataKey="adherence" stroke="#10b981" fill="url(#wellGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-zinc-600 text-sm text-center py-8">Start logging wellness tasks to see trends</p>
        )}
      </motion.div>

      {/* ── Graph 3: Daily Nutrition & Macros (14d) ─────────── */}
      <motion.div
        className="glass-card rounded-2xl p-5"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
      >
        <h3 className="text-sm font-semibold text-zinc-300 mb-4 flex items-center gap-2">
          <Utensils size={16} className="text-amber-400" />
          Nutrition & Macros (14d)
        </h3>
        {macroChartData.length > 0 && macroChartData.some((d) => d.Protein > 0 || d.Carbs > 0) ? (
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={macroChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="date" tick={{ fill: '#71717a', fontSize: 10 }} axisLine={false} tickLine={false} interval={2} />
              <YAxis tick={{ fill: '#71717a', fontSize: 10 }} axisLine={false} tickLine={false} width={35} />
              <Tooltip content={<MacroTooltip />} />
              <Bar dataKey="Protein" fill="#22d3ee" radius={[4, 4, 0, 0]} barSize={8} />
              <Bar dataKey="Carbs" fill="#f59e0b" radius={[4, 4, 0, 0]} barSize={8} />
              <Bar dataKey="Fats" fill="#a78bfa" radius={[4, 4, 0, 0]} barSize={8} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-zinc-600 text-sm text-center py-8">
            Log meals in the Macro Calculator to see your nutrition trends
          </p>
        )}
      </motion.div>

      {/* Heatmap */}
      <motion.div
        className="glass-card rounded-2xl p-5"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h3 className="text-sm font-semibold text-zinc-300 mb-4 flex items-center gap-2">
          <Calendar size={16} className="text-purple-400" />
          30-Day Activity
        </h3>
        <HeatmapGrid logs={allLogs} days={days30} />
        <div className="flex items-center gap-2 mt-3 justify-end">
          <span className="text-[10px] text-zinc-600">Less</span>
          {[0.03, 0.15, 0.3, 0.5, 0.8].map((op, i) => (
            <div
              key={i}
              className="w-3 h-3 rounded-[2px]"
              style={{
                background:
                  op === 0.03
                    ? 'rgba(255,255,255,0.03)'
                    : `rgba(16, 185, 129, ${op})`,
              }}
            />
          ))}
          <span className="text-[10px] text-zinc-600">More</span>
        </div>
      </motion.div>

      {/* Streaks */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
      >
        <HabitStreaks habits={habits} logs={allLogs} />
      </motion.div>
    </div>
  );
}
