import { useMemo } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { motion } from 'framer-motion';
import { format, subDays, eachDayOfInterval, startOfDay } from 'date-fns';
import { Flame, TrendingUp, Calendar, Dumbbell, Heart, Utensils, Zap, Activity } from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
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
    <div className="flex flex-wrap gap-1.5 w-full">
      {days.map((day) => {
        const count = completionByDate[day] || 0;
        const intensity = count / maxCount;
        let bg = 'rgba(255,255,255,0.03)';
        let shadow = 'none';
        let border = 'rgba(255,255,255,0.02)';
        
        if (intensity > 0.75) { bg = 'rgba(16, 185, 129, 0.9)'; shadow = '0 0 8px rgba(16,185,129,0.4)'; border = 'rgba(16,185,129,1)'; }
        else if (intensity > 0.5) { bg = 'rgba(16, 185, 129, 0.5)'; border = 'rgba(16,185,129,0.7)'; }
        else if (intensity > 0.25) { bg = 'rgba(16, 185, 129, 0.25)'; border = 'rgba(16,185,129,0.4)'; }
        else if (intensity > 0) { bg = 'rgba(16, 185, 129, 0.1)'; border = 'rgba(16,185,129,0.2)'; }

        return (
          <div
            key={day}
            className="w-5 h-5 rounded-md transition-all hover:scale-110 cursor-pointer"
            style={{ background: bg, boxShadow: shadow, border: `1px solid ${border}` }}
            title={`${format(new Date(day + 'T00:00:00'), 'MMM d')}: ${count} tasks`}
          />
        );
      })}
    </div>
  );
}

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
        <p className="text-xs text-zinc-400 mb-1">{label}</p>
        {payload.map((entry, idx) => (
          <p key={idx} className="text-sm font-bold flex items-center gap-1.5" style={{ color: entry.color }}>
            <span className="w-2 h-2 rounded-full" style={{ background: entry.color }} />
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
}

/* ── Main Component ────────────────────────────────────────── */

export default function Dashboard() {
  const habits = useLiveQuery(() => db.habits.toArray(), []);
  const logs = useLiveQuery(() => db.dailyLogs.toArray(), []);
  const bodyLogs = useLiveQuery(() => db.bodyLogs.orderBy('date').toArray(), []);
  
  // Last 30 & 7 days
  const days30 = useMemo(() => getLast30Days(), []);
  const days7 = useMemo(() => days30.slice(-7), [days30]);

  // Overall Stats
  const overallStats = useMemo(() => {
    if (!logs || !habits) return { total: 0, streak: 0, completion: 0 };
    const completedLogs = logs.filter(l => l.completed);
    
    // Quick overall streak (longest of any daily habit)
    const dailyHabits = habits.filter(h => h.frequency === 'daily');
    let bestStreak = 0;
    dailyHabits.forEach(h => {
      const hLogs = logs.filter(l => l.habitId === h.id);
      const s = calculateStreak(hLogs);
      if (s > bestStreak) bestStreak = s;
    });

    return {
      total: completedLogs.length,
      streak: bestStreak,
      completion: habits.length * 30 > 0 ? Math.round((completedLogs.filter(l => days30.includes(l.date)).length / (habits.length * 30)) * 100) : 0
    };
  }, [logs, habits, days30]);

  // Chart Data (Body Weight)
  const chartData = useMemo(() => {
    if (!bodyLogs) return [];
    // Ensure we fill gaps if we want a smooth line, or just use existing logs
    // For a cleaner line chart, let's map the last 30 days
    return days30.map(date => {
      const entry = bodyLogs.find(b => b.date === date);
      return {
        date: format(new Date(date + 'T00:00:00'), 'MMM d'),
        weight: entry ? entry.weight_kg : null, // Null will cause Recharts to skip or interpolate
      };
    }).filter(d => d.weight !== null); // Drop nulls so the line connects seamlessly
  }, [bodyLogs, days30]);

  // Weekly Adherence
  const thisWeek = useMemo(() => {
    if (!logs || !habits) return { pct: 0, count: 0, total: 0 };
    const completedCount = logs.filter((l) => l.completed && days7.includes(l.date)).length;
    const totalPossible = habits.length * 7;
    return {
      pct: totalPossible > 0 ? Math.round((completedCount / totalPossible) * 100) : 0,
      count: completedCount,
      total: totalPossible,
    };
  }, [logs, habits, days7]);

  if (!habits || !logs) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-2 border-cyan-500 border-t-transparent animate-spin" />
          <p className="text-zinc-600 text-xs animate-pulse">Loading analytics…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-1 space-y-6">
      
      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-zinc-500 text-xs mt-1 font-medium">Your 30-day performance</p>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shadow-[0_0_15px_rgba(34,211,238,0.2)]">
          <Activity className="text-cyan-400" />
        </div>
      </div>

      {/* ── Top Metric Cards (Responsive Grid) ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1 */}
        <motion.div
          initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }}
          className="rounded-3xl p-5 border flex flex-col justify-between"
          style={{ background: 'linear-gradient(145deg, rgba(30,30,36,0.7), rgba(18,18,22,0.9))', borderColor: 'rgba(255,255,255,0.05)' }}
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg bg-amber-500/15 flex items-center justify-center border border-amber-500/30">
              <Flame size={14} className="text-amber-400" />
            </div>
            <p className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Best Streak</p>
          </div>
          <div className="flex items-baseline gap-1.5">
            <h2 className="text-3xl font-black text-white">{overallStats.streak}</h2>
            <span className="text-xs font-semibold text-amber-500">Days</span>
          </div>
        </motion.div>

        {/* Metric 2 */}
        <motion.div
          initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
          className="rounded-3xl p-5 border flex flex-col justify-between"
          style={{ background: 'linear-gradient(145deg, rgba(30,30,36,0.7), rgba(18,18,22,0.9))', borderColor: 'rgba(255,255,255,0.05)' }}
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg bg-cyan-500/15 flex items-center justify-center border border-cyan-500/30">
              <TrendingUp size={14} className="text-cyan-400" />
            </div>
            <p className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Completed</p>
          </div>
          <div className="flex items-baseline gap-1.5">
            <h2 className="text-3xl font-black text-white">{overallStats.total}</h2>
            <span className="text-xs font-semibold text-cyan-500">Tasks</span>
          </div>
        </motion.div>

        {/* Metric 3 (Weekly Recap) - Spans 2 cols on mobile, 2 on desktop */}
        <motion.div
          initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="col-span-2 rounded-3xl p-5 border flex flex-col justify-between relative overflow-hidden"
          style={{ background: 'linear-gradient(145deg, rgba(16,185,129,0.1), rgba(18,18,22,0.9))', borderColor: 'rgba(16,185,129,0.2)' }}
        >
          {/* Subtle glow bg */}
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-emerald-500/20 blur-3xl rounded-full pointer-events-none" />
          
          <div className="flex items-center gap-2 mb-2 relative z-10">
            <Calendar size={15} className="text-emerald-400" />
            <p className="text-[10px] uppercase font-bold text-emerald-500 tracking-wider">Weekly Adherence</p>
          </div>
          <div className="relative z-10 flex items-end gap-3 mb-3">
            <h2 className="text-4xl font-black text-white leading-none">{thisWeek.pct}%</h2>
            <span className="text-xs text-zinc-400 mb-1">({thisWeek.count}/{thisWeek.total} completed)</span>
          </div>
          <div className="relative z-10 w-full bg-black/40 rounded-full h-2.5 overflow-hidden border border-white/5">
            <motion.div
              className="h-full rounded-full"
              style={{ background: 'linear-gradient(90deg, #10b981, #34d399)' }}
              initial={{ width: 0 }}
              animate={{ width: `${thisWeek.pct}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </div>
        </motion.div>
      </div>

      {/* ── Main Charts Area (Grid) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Heatmap (Left / Full width on mobile) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="lg:col-span-5 rounded-3xl p-6 border"
          style={{ background: 'rgba(24,24,27,0.6)', backdropFilter: 'blur(16px)', borderColor: 'rgba(255,255,255,0.05)' }}
        >
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                <Zap size={14} className="text-emerald-400" />
              </div>
              <h3 className="text-sm font-bold text-white">30-Day Activity</h3>
            </div>
          </div>
          
          <div className="w-full">
            <HeatmapGrid logs={logs} days={days30} />
          </div>
          <div className="flex items-center justify-end gap-2 mt-4 text-[9px] text-zinc-500 uppercase font-bold">
            <span>Less</span>
            <div className="flex gap-1">
              <div className="w-3 h-3 rounded-[3px] bg-white/5" />
              <div className="w-3 h-3 rounded-[3px] bg-emerald-500/20" />
              <div className="w-3 h-3 rounded-[3px] bg-emerald-500/50" />
              <div className="w-3 h-3 rounded-[3px] bg-emerald-500" />
            </div>
            <span>More</span>
          </div>
        </motion.div>

        {/* Weight Trend Chart (Right) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="lg:col-span-7 rounded-3xl p-6 border flex flex-col"
          style={{ background: 'rgba(24,24,27,0.6)', backdropFilter: 'blur(16px)', borderColor: 'rgba(255,255,255,0.05)' }}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <Dumbbell size={14} className="text-blue-400" />
              </div>
              <h3 className="text-sm font-bold text-white">Weight Trend</h3>
            </div>
            {chartData.length > 0 && (
              <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest bg-blue-500/10 px-3 py-1.5 rounded-full border border-blue-500/20">
                Latest: {chartData[chartData.length - 1].weight} kg
              </span>
            )}
          </div>
          
          <div className="flex-1 min-h-[220px] w-full">
            {chartData.length > 1 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 5, right: 0, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis 
                    dataKey="date" 
                    stroke="rgba(255,255,255,0.3)" 
                    fontSize={10} 
                    tickMargin={10} 
                    axisLine={false} 
                    tickLine={false}
                  />
                  <YAxis 
                    stroke="rgba(255,255,255,0.3)" 
                    fontSize={10} 
                    axisLine={false} 
                    tickLine={false} 
                    domain={['dataMin - 1', 'dataMax + 1']} 
                    tickFormatter={(val) => val.toFixed(1)}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="weight"
                    name="Weight (kg)"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorWeight)"
                    activeDot={{ r: 6, fill: '#3b82f6', stroke: '#fff', strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-zinc-500 border border-dashed border-zinc-700/50 rounded-2xl bg-black/20">
                <Dumbbell size={24} className="opacity-20 mb-2" />
                <p className="text-xs">Log weight on the Body tab to see trends</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

    </div>
  );
}
