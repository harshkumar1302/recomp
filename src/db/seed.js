import { db } from './db';

const defaultHabits = [
  // MORNING
  { name: 'Hydration 1 (1L)', category: 'body', timeOfDay: 'morning', type: 'wellness', frequency: 'daily', schedule: [1,2,3,4,5,6,0] },
  { name: 'Satvik Breakfast', category: 'diet', timeOfDay: 'morning', type: 'wellness', frequency: 'daily', schedule: [1,2,3,4,5,6,0] },
  { name: '8 hrs Sleep (Previous Night)', category: 'body', timeOfDay: 'morning', type: 'wellness', frequency: 'daily', schedule: [1,2,3,4,5,6,0] },
  { name: 'AM Skincare: Cleanser', category: 'skin', timeOfDay: 'morning', type: 'wellness', frequency: 'daily', schedule: [1,2,3,4,5,6,0] },
  { name: 'AM Skincare: Moisturizer', category: 'skin', timeOfDay: 'morning', type: 'wellness', frequency: 'daily', schedule: [1,2,3,4,5,6,0] },
  { name: 'AM Skincare: Sunscreen', category: 'skin', timeOfDay: 'morning', type: 'wellness', frequency: 'daily', schedule: [1,2,3,4,5,6,0] },
  { name: 'B12 & Multivitamin Supplements', category: 'supplement', timeOfDay: 'morning', type: 'wellness', frequency: 'daily', schedule: [1,2,3,4,5,6,0] },
  
  // AFTERNOON (NOON)
  { name: 'Hydration 2 (1L)', category: 'body', timeOfDay: 'afternoon', type: 'wellness', frequency: 'daily', schedule: [1,2,3,4,5,6,0] },
  { name: 'Daily Bath', category: 'body', timeOfDay: 'afternoon', type: 'wellness', frequency: 'daily', schedule: [1,2,3,4,5,6,0] },
  { name: 'Steps (10k)', category: 'body', timeOfDay: 'afternoon', type: 'fitness', frequency: 'daily', schedule: [1,2,3,4,5,6,0] },
  
  // EVENING
  { name: 'Hydration 3 (1L)', category: 'body', timeOfDay: 'evening', type: 'wellness', frequency: 'daily', schedule: [1,2,3,4,5,6,0] },
  { name: 'Satvik Dinner', category: 'diet', timeOfDay: 'evening', type: 'wellness', frequency: 'daily', schedule: [1,2,3,4,5,6,0] },
  { name: 'Gym Workout', category: 'body', timeOfDay: 'evening', type: 'fitness', frequency: 'daily', schedule: [1,2,3,4,5,6,0] },
  { name: 'Post-workout meal', category: 'diet', timeOfDay: 'evening', type: 'fitness', frequency: 'daily', schedule: [1,2,3,4,5,6,0] },
  { name: 'Creatine Supplement', category: 'supplement', timeOfDay: 'evening', type: 'fitness', frequency: 'daily', schedule: [1,2,3,4,5,6,0] },
  
  // NIGHT
  { name: 'Hydration 4 (1L)', category: 'body', timeOfDay: 'night', type: 'wellness', frequency: 'daily', schedule: [1,2,3,4,5,6,0] },
  { name: 'PM Skincare: Cleanser', category: 'skin', timeOfDay: 'night', type: 'wellness', frequency: 'daily', schedule: [1,2,3,4,5,6,0] },
  { name: 'PM Skincare: Moisturizer', category: 'skin', timeOfDay: 'night', type: 'wellness', frequency: 'daily', schedule: [1,2,3,4,5,6,0] },
  { name: 'PM Skincare: Minoxidil', category: 'skin', timeOfDay: 'night', type: 'wellness', frequency: 'daily', schedule: [1,2,3,4,5,6,0] },
  { name: 'D3+K2, Magnesium, Omega-3 Supplements', category: 'supplement', timeOfDay: 'night', type: 'wellness', frequency: 'daily', schedule: [1,2,3,4,5,6,0] },
  
  // NON-REGULAR GAP ITEMS (Loaded in Left Treatment Queue)
  { name: 'Hair Wash (Ketoconazole)', category: 'hair', timeOfDay: 'night', type: 'wellness', frequency: 'gap', schedule: [1, 5] }, // Mon, Fri
  { name: "Hair Wash (L'Oréal)", category: 'hair', timeOfDay: 'night', type: 'wellness', frequency: 'gap', schedule: [3, 6] }, // Wed, Sat
];

export async function seedDatabase() {
  const habitsCount = await db.habits.count();
  const sample = await db.habits.toCollection().first();
  const needsReseed = sample && (!sample.type || !sample.frequency);
  
  if (habitsCount === 0 || needsReseed) {
    console.log('Seeding database with updated default habits...');
    await db.habits.clear();
    await db.habits.bulkAdd(defaultHabits);
  }
}
