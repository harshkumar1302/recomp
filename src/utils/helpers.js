import { format, startOfDay, subDays, eachDayOfInterval } from 'date-fns';

export function getToday() {
  return format(new Date(), 'yyyy-MM-dd');
}

export function getDayOfWeek() {
  return new Date().getDay(); // 0=Sun, 1=Mon...6=Sat
}

export function getTimeOfDay() {
  const hour = new Date().getHours();
  if (hour < 12) return 'morning';
  if (hour < 17) return 'afternoon';
  if (hour < 20) return 'evening';
  return 'night';
}

export function getTimeSlots() {
  return ['morning', 'afternoon', 'evening', 'night'];
}

export function getTimeSlotLabel(slot) {
  const labels = {
    morning: '🌅 Morning',
    afternoon: '☀️ Afternoon',
    evening: '🌆 Evening',
    night: '🌙 Night',
  };
  return labels[slot] || slot;
}

export function getCategoryColor(category) {
  const colors = {
    body: { bg: 'rgba(59, 130, 246, 0.15)', border: 'rgba(59, 130, 246, 0.3)', text: '#60a5fa', accent: '#3b82f6' },
    hair: { bg: 'rgba(168, 85, 247, 0.15)', border: 'rgba(168, 85, 247, 0.3)', text: '#c084fc', accent: '#a855f7' },
    skin: { bg: 'rgba(236, 72, 153, 0.15)', border: 'rgba(236, 72, 153, 0.3)', text: '#f472b6', accent: '#ec4899' },
    diet: { bg: 'rgba(245, 158, 11, 0.15)', border: 'rgba(245, 158, 11, 0.3)', text: '#fbbf24', accent: '#f59e0b' },
    supplement: { bg: 'rgba(16, 185, 129, 0.15)', border: 'rgba(16, 185, 129, 0.3)', text: '#34d399', accent: '#10b981' },
  };
  return colors[category] || colors.body;
}

export function getCategoryIcon(category) {
  const icons = {
    body: '💪',
    hair: '💇',
    skin: '✨',
    diet: '🥗',
    supplement: '💊',
  };
  return icons[category] || '📋';
}

export function getLast7Days() {
  const today = startOfDay(new Date());
  return eachDayOfInterval({
    start: subDays(today, 6),
    end: today,
  }).map(d => format(d, 'yyyy-MM-dd'));
}

export function getLast30Days() {
  const today = startOfDay(new Date());
  return eachDayOfInterval({
    start: subDays(today, 29),
    end: today,
  }).map(d => format(d, 'yyyy-MM-dd'));
}

export function calculateStreak(logs) {
  if (!logs || logs.length === 0) return 0;
  
  const today = startOfDay(new Date());
  let streak = 0;
  let currentDate = today;
  
  const completedDates = new Set(
    logs.filter(l => l.completed).map(l => l.date)
  );
  
  while (true) {
    const dateStr = format(currentDate, 'yyyy-MM-dd');
    if (completedDates.has(dateStr)) {
      streak++;
      currentDate = subDays(currentDate, 1);
    } else {
      break;
    }
  }
  
  return streak;
}

export function getDayLabel(dayNum) {
  const labels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return labels[dayNum];
}
