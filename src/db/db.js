import Dexie from 'dexie';

export const db = new Dexie('recompDB');

db.version(2).stores({
  habits: '++id, name, category, timeOfDay, type, frequency', // type: 'fitness'|'wellness', frequency: 'daily'|'gap'
  dailyLogs: '[date+habitId], date, habitId, completed', // date formatted as YYYY-MM-DD
  bodyLogs: 'date, weight_kg, waist_cm, height_cm', // date formatted as YYYY-MM-DD
  macroLogs: 'date, protein, carbs, fats, calories', // date formatted as YYYY-MM-DD
});
