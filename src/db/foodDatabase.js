/**
 * WORLD FOOD DATABASE
 * ──────────────────────────────────────────────────────────────────
 * All macros are PER baseQty (default 100g/100ml).
 * p = protein (g), c = carbs (g), f = fat (g), kcal = calories
 * unit = display unit, baseQty = quantity unit refers to
 *
 * Keys are search keywords (lowercase). Multiple keys map to same food.
 * Categories: grains, legumes, dairy, protein, vegetables, fruits,
 *             nuts_seeds, oils_fats, spices, beverages,
 *             indian_dishes, world_dishes, snacks, sweets
 */

export const FOOD_DB = {

  // ═══════════════════════════════════════════════════════
  // GRAINS & CEREALS — RAW
  // ═══════════════════════════════════════════════════════

  // Rice
  rice_raw:         { name: 'Rice (Raw)', unit: 'g', p: 7.1, c: 78.2, f: 0.7, kcal: 365, baseQty: 100, keys: ['raw rice', 'kachha chawal'] },
  chawal_raw:       { name: 'Rice (Raw)', unit: 'g', p: 7.1, c: 78.2, f: 0.7, kcal: 365, baseQty: 100, keys: ['chawal kachha'] },
  rice_cooked:      { name: 'Rice (Cooked)', unit: 'g', p: 2.7, c: 28.2, f: 0.3, kcal: 130, baseQty: 100, keys: ['cooked rice', 'steamed rice', 'boiled rice', 'plain rice', 'white rice cooked'] },
  basmati_raw:      { name: 'Basmati Rice (Raw)', unit: 'g', p: 7.5, c: 77.4, f: 0.5, kcal: 349, baseQty: 100, keys: ['basmati raw'] },
  basmati_cooked:   { name: 'Basmati Rice (Cooked)', unit: 'g', p: 2.7, c: 25.2, f: 0.2, kcal: 121, baseQty: 100, keys: ['basmati cooked', 'basmati rice'] },
  brown_rice_raw:   { name: 'Brown Rice (Raw)', unit: 'g', p: 7.9, c: 76.2, f: 2.9, kcal: 362, baseQty: 100, keys: ['brown rice raw'] },
  brown_rice_cooked:{ name: 'Brown Rice (Cooked)', unit: 'g', p: 2.6, c: 23.0, f: 0.9, kcal: 111, baseQty: 100, keys: ['brown rice', 'brown rice cooked'] },
  red_rice:         { name: 'Red Rice (Cooked)', unit: 'g', p: 2.8, c: 24.5, f: 0.8, kcal: 111, baseQty: 100, keys: ['red rice', 'laal chawal'] },

  // Wheat & Flour
  atta:             { name: 'Atta / Whole Wheat Flour', unit: 'g', p: 11.8, c: 68.2, f: 1.5, kcal: 341, baseQty: 100, keys: ['atta', 'whole wheat flour', 'gehun ka atta'] },
  maida:            { name: 'Maida / All Purpose Flour', unit: 'g', p: 10.4, c: 73.9, f: 0.9, kcal: 348, baseQty: 100, keys: ['maida', 'all purpose flour', 'refined flour'] },
  wheat_raw:        { name: 'Wheat (Grain)', unit: 'g', p: 13.2, c: 71.2, f: 1.5, kcal: 339, baseQty: 100, keys: ['wheat grain', 'gehun'] },
  semolina:         { name: 'Semolina / Suji / Rava', unit: 'g', p: 12.7, c: 73.8, f: 1.1, kcal: 360, baseQty: 100, keys: ['suji', 'rava', 'semolina', 'sooji', 'rawa'] },
  bread_white:      { name: 'White Bread', unit: 'slice', p: 2.7, c: 14.5, f: 0.7, kcal: 75, baseQty: 1, keys: ['white bread slice', 'bread slice', 'white bread'] },
  bread_brown:      { name: 'Brown Bread', unit: 'slice', p: 3.5, c: 12.2, f: 1.1, kcal: 70, baseQty: 1, keys: ['brown bread', 'whole wheat bread', 'brown bread slice'] },
  roti:             { name: 'Roti / Chapati', unit: 'piece', p: 2.8, c: 15.1, f: 1.0, kcal: 80, baseQty: 1, keys: ['roti', 'chapati', 'chapatti', 'phulka', 'rotti'] },
  roti_ghee:        { name: 'Roti with Ghee', unit: 'piece', p: 2.8, c: 15.1, f: 5.5, kcal: 120, baseQty: 1, keys: ['roti ghee', 'chapati ghee', 'ghee roti', 'ghee chapati'] },
  paratha:          { name: 'Plain Paratha', unit: 'piece', p: 3.5, c: 25.0, f: 7.0, kcal: 175, baseQty: 1, keys: ['paratha', 'parantha', 'plain paratha'] },
  aloo_paratha:     { name: 'Aloo Paratha', unit: 'piece', p: 5.0, c: 35.0, f: 9.0, kcal: 240, baseQty: 1, keys: ['aloo paratha', 'potato paratha'] },
  paneer_paratha:   { name: 'Paneer Paratha', unit: 'piece', p: 9.0, c: 28.0, f: 11.0, kcal: 245, baseQty: 1, keys: ['paneer paratha'] },
  naan:             { name: 'Naan', unit: 'piece', p: 6.8, c: 45.0, f: 4.5, kcal: 262, baseQty: 1, keys: ['naan', 'butter naan'] },
  puri:             { name: 'Puri', unit: 'piece', p: 1.8, c: 12.0, f: 6.0, kcal: 108, baseQty: 1, keys: ['puri', 'poori'] },
  bhatura:          { name: 'Bhatura', unit: 'piece', p: 6.0, c: 50.0, f: 18.0, kcal: 390, baseQty: 1, keys: ['bhatura', 'bhattura'] },
  idli:             { name: 'Idli', unit: 'piece', p: 2.0, c: 15.0, f: 0.3, kcal: 70, baseQty: 1, keys: ['idli', 'idly'] },
  dosa:             { name: 'Plain Dosa', unit: 'piece', p: 3.5, c: 35.0, f: 3.5, kcal: 168, baseQty: 1, keys: ['dosa', 'plain dosa', 'sada dosa'] },
  masala_dosa:      { name: 'Masala Dosa', unit: 'piece', p: 5.0, c: 48.0, f: 8.0, kcal: 284, baseQty: 1, keys: ['masala dosa'] },
  uttapam:          { name: 'Uttapam', unit: 'piece', p: 5.0, c: 30.0, f: 4.0, kcal: 175, baseQty: 1, keys: ['uttapam', 'uttapam'] },

  // Oats & Cereals
  oats:             { name: 'Rolled Oats (Raw)', unit: 'g', p: 16.9, c: 66.3, f: 6.9, kcal: 389, baseQty: 100, keys: ['oats', 'rolled oats', 'oatmeal raw'] },
  oats_cooked:      { name: 'Oatmeal (Cooked)', unit: 'g', p: 2.5, c: 12.0, f: 1.5, kcal: 71, baseQty: 100, keys: ['oatmeal', 'cooked oats', 'porridge'] },
  millet:           { name: 'Bajra / Pearl Millet', unit: 'g', p: 11.6, c: 67.5, f: 5.0, kcal: 361, baseQty: 100, keys: ['bajra', 'pearl millet', 'millet'] },
  jowar:            { name: 'Jowar / Sorghum', unit: 'g', p: 10.4, c: 72.6, f: 1.9, kcal: 349, baseQty: 100, keys: ['jowar', 'sorghum'] },
  ragi:             { name: 'Ragi / Finger Millet', unit: 'g', p: 7.3, c: 72.0, f: 1.3, kcal: 328, baseQty: 100, keys: ['ragi', 'finger millet', 'nachni'] },
  corn:             { name: 'Corn / Maize', unit: 'g', p: 3.3, c: 19.0, f: 1.4, kcal: 86, baseQty: 100, keys: ['corn', 'maize', 'makka', 'makki', 'sweet corn'] },
  corn_flour:       { name: 'Corn Flour / Cornstarch', unit: 'g', p: 0.3, c: 88.1, f: 0.1, kcal: 354, baseQty: 100, keys: ['corn flour', 'cornstarch', 'cornflour'] },
  poha:             { name: 'Poha / Flattened Rice (Raw)', unit: 'g', p: 6.3, c: 76.9, f: 1.2, kcal: 346, baseQty: 100, keys: ['poha raw', 'chivda raw', 'flattened rice'] },
  poha_cooked:      { name: 'Poha (Cooked)', unit: 'g', p: 2.8, c: 28.0, f: 4.0, kcal: 158, baseQty: 100, keys: ['poha', 'poha dish', 'kanda poha', 'batata poha'] },
  quinoa_raw:       { name: 'Quinoa (Raw)', unit: 'g', p: 14.1, c: 64.2, f: 6.1, kcal: 368, baseQty: 100, keys: ['quinoa raw'] },
  quinoa_cooked:    { name: 'Quinoa (Cooked)', unit: 'g', p: 4.4, c: 21.3, f: 1.9, kcal: 120, baseQty: 100, keys: ['quinoa', 'cooked quinoa'] },
  buckwheat:        { name: 'Buckwheat / Kuttu', unit: 'g', p: 13.3, c: 71.5, f: 3.4, kcal: 343, baseQty: 100, keys: ['kuttu', 'buckwheat'] },
  vermicelli:       { name: 'Vermicelli / Sevai', unit: 'g', p: 11.5, c: 72.0, f: 0.8, kcal: 348, baseQty: 100, keys: ['sevai', 'vermicelli', 'seviyan'] },
  pasta_raw:        { name: 'Pasta (Raw)', unit: 'g', p: 13.0, c: 75.0, f: 1.5, kcal: 371, baseQty: 100, keys: ['pasta raw', 'macaroni raw', 'spaghetti raw', 'penne raw', 'fusilli raw'] },
  pasta_cooked:     { name: 'Pasta (Cooked)', unit: 'g', p: 4.9, c: 30.9, f: 0.9, kcal: 157, baseQty: 100, keys: ['pasta', 'cooked pasta', 'spaghetti', 'penne', 'macaroni cooked'] },
  noodles_raw:      { name: 'Noodles (Raw)', unit: 'g', p: 8.0, c: 72.0, f: 1.0, kcal: 350, baseQty: 100, keys: ['noodles raw'] },
  noodles_cooked:   { name: 'Noodles (Cooked)', unit: 'g', p: 3.0, c: 22.0, f: 0.5, kcal: 110, baseQty: 100, keys: ['noodles', 'cooked noodles', 'hakka noodles', 'egg noodles', 'rice noodles', 'instant noodles'] },
  bread_roll:       { name: 'Bread Roll / Bun', unit: 'piece', p: 5.0, c: 28.0, f: 3.0, kcal: 160, baseQty: 1, keys: ['bread roll', 'bun', 'dinner roll'] },
  pav:              { name: 'Pav', unit: 'piece', p: 3.5, c: 20.0, f: 1.5, kcal: 110, baseQty: 1, keys: ['pav', 'ladi pav'] },

  // ═══════════════════════════════════════════════════════
  // LEGUMES & PULSES — RAW & COOKED
  // ═══════════════════════════════════════════════════════

  moong_dal_raw:    { name: 'Moong Dal (Raw)', unit: 'g', p: 24.0, c: 59.9, f: 1.2, kcal: 347, baseQty: 100, keys: ['moong dal raw', 'green moong raw'] },
  moong_dal:        { name: 'Moong Dal (Cooked)', unit: 'g', p: 7.0, c: 20.6, f: 0.4, kcal: 104, baseQty: 100, keys: ['moong dal', 'yellow moong', 'moong daal', 'green moong cooked'] },
  masoor_dal_raw:   { name: 'Masoor Dal (Raw)', unit: 'g', p: 25.8, c: 60.1, f: 1.0, kcal: 353, baseQty: 100, keys: ['masoor dal raw', 'red lentil raw'] },
  masoor_dal:       { name: 'Masoor Dal (Cooked)', unit: 'g', p: 9.0, c: 20.1, f: 0.4, kcal: 116, baseQty: 100, keys: ['masoor dal', 'masoor daal', 'red lentils', 'lentils', 'dal masoor'] },
  toor_dal_raw:     { name: 'Toor / Arhar Dal (Raw)', unit: 'g', p: 22.3, c: 57.6, f: 1.7, kcal: 335, baseQty: 100, keys: ['toor dal raw', 'arhar dal raw'] },
  toor_dal:         { name: 'Toor Dal (Cooked)', unit: 'g', p: 7.2, c: 18.5, f: 0.5, kcal: 106, baseQty: 100, keys: ['toor dal', 'arhar dal', 'tuvar dal', 'dal tadka', 'dal fry'] },
  urad_dal:         { name: 'Urad Dal (Cooked)', unit: 'g', p: 8.5, c: 19.2, f: 0.5, kcal: 115, baseQty: 100, keys: ['urad dal', 'urad daal', 'black gram'] },
  chana_dal:        { name: 'Chana Dal (Cooked)', unit: 'g', p: 8.0, c: 27.2, f: 3.0, kcal: 164, baseQty: 100, keys: ['chana dal', 'chana daal', 'bengal gram dal'] },
  dal_makhani:      { name: 'Dal Makhani', unit: 'g', p: 6.5, c: 18.0, f: 7.0, kcal: 163, baseQty: 100, keys: ['dal makhani', 'daal makhani'] },
  rajma_raw:        { name: 'Rajma / Red Kidney Beans (Raw)', unit: 'g', p: 22.1, c: 62.9, f: 1.5, kcal: 337, baseQty: 100, keys: ['rajma raw'] },
  rajma:            { name: 'Rajma (Cooked)', unit: 'g', p: 8.7, c: 22.8, f: 0.5, kcal: 127, baseQty: 100, keys: ['rajma', 'kidney beans', 'red kidney beans'] },
  kabuli_chana_raw: { name: 'Kabuli Chana / Chickpeas (Raw)', unit: 'g', p: 19.3, c: 60.6, f: 6.0, kcal: 364, baseQty: 100, keys: ['chana raw', 'chickpeas raw', 'kabuli chana raw'] },
  kabuli_chana:     { name: 'Kabuli Chana (Cooked)', unit: 'g', p: 8.9, c: 27.4, f: 2.6, kcal: 164, baseQty: 100, keys: ['kabuli chana', 'chole', 'chhole', 'chickpeas', 'garbanzo'] },
  kala_chana:       { name: 'Kala Chana (Cooked)', unit: 'g', p: 9.0, c: 20.9, f: 2.0, kcal: 135, baseQty: 100, keys: ['kala chana', 'black chickpeas', 'brown chickpeas'] },
  black_beans:      { name: 'Black Beans (Cooked)', unit: 'g', p: 8.9, c: 23.7, f: 0.5, kcal: 132, baseQty: 100, keys: ['black beans', 'kali beans'] },
  soya_chunks:      { name: 'Soya Chunks (Raw)', unit: 'g', p: 52.0, c: 33.0, f: 0.5, kcal: 345, baseQty: 100, keys: ['soya chunks', 'soy chunks', 'meal maker raw', 'nutrela raw'] },
  soya_chunks_soaked:{ name: 'Soya Chunks (Soaked/Cooked)', unit: 'g', p: 15.0, c: 9.5, f: 0.2, kcal: 100, baseQty: 100, keys: ['soya chunks soaked', 'soy chunks cooked', 'meal maker'] },
  tofu_firm:        { name: 'Tofu (Firm)', unit: 'g', p: 9.0, c: 1.9, f: 4.8, kcal: 83, baseQty: 100, keys: ['tofu', 'firm tofu', 'soya tofu'] },
  edamame:          { name: 'Edamame', unit: 'g', p: 11.9, c: 8.9, f: 5.2, kcal: 121, baseQty: 100, keys: ['edamame'] },
  peas_raw:         { name: 'Green Peas (Raw)', unit: 'g', p: 5.4, c: 14.5, f: 0.4, kcal: 81, baseQty: 100, keys: ['green peas raw', 'matar raw', 'fresh peas'] },
  peas_frozen:      { name: 'Green Peas (Frozen)', unit: 'g', p: 5.4, c: 14.5, f: 0.4, kcal: 81, baseQty: 100, keys: ['frozen peas', 'matar frozen'] },
  lobia:            { name: 'Lobia / Black Eye Peas (Cooked)', unit: 'g', p: 7.7, c: 20.4, f: 0.5, kcal: 116, baseQty: 100, keys: ['lobia', 'black eye peas', 'cowpea'] },
  moth_beans:       { name: 'Moth Beans (Cooked)', unit: 'g', p: 9.0, c: 21.3, f: 0.5, kcal: 124, baseQty: 100, keys: ['moth beans', 'matki'] },
  peanuts:          { name: 'Peanuts / Groundnuts', unit: 'g', p: 25.8, c: 16.1, f: 49.2, kcal: 567, baseQty: 100, keys: ['peanuts', 'groundnuts', 'moongfali', 'groundnut'] },
  peanut_butter:    { name: 'Peanut Butter', unit: 'g', p: 25.1, c: 20.1, f: 50.4, kcal: 588, baseQty: 100, keys: ['peanut butter'] },

  // ═══════════════════════════════════════════════════════
  // DAIRY & EGGS
  // ═══════════════════════════════════════════════════════

  milk_full:        { name: 'Whole Milk', unit: 'ml', p: 3.2, c: 4.8, f: 3.5, kcal: 64, baseQty: 100, keys: ['whole milk', 'full fat milk', 'dudh'] },
  milk_toned:       { name: 'Toned Milk', unit: 'ml', p: 3.1, c: 4.8, f: 1.5, kcal: 44, baseQty: 100, keys: ['toned milk', 'low fat milk', 'skimmed milk', 'slim milk'] },
  milk_skim:        { name: 'Skimmed Milk', unit: 'ml', p: 3.4, c: 5.0, f: 0.2, kcal: 35, baseQty: 100, keys: ['skim milk', 'skimmed', 'fat free milk'] },
  milk:             { name: 'Milk', unit: 'ml', p: 3.2, c: 4.8, f: 3.2, kcal: 60, baseQty: 100, keys: ['milk', 'doodh'] },
  paneer:           { name: 'Paneer', unit: 'g', p: 18.3, c: 1.2, f: 20.8, kcal: 265, baseQty: 100, keys: ['paneer', 'cottage cheese indian'] },
  paneer_low_fat:   { name: 'Low-Fat Paneer', unit: 'g', p: 20.0, c: 1.5, f: 10.0, kcal: 180, baseQty: 100, keys: ['low fat paneer', 'skimmed paneer'] },
  curd:             { name: 'Curd / Dahi', unit: 'g', p: 3.1, c: 4.7, f: 3.4, kcal: 60, baseQty: 100, keys: ['curd', 'dahi', 'yogurt', 'plain yogurt', 'yoghurt'] },
  greek_yogurt:     { name: 'Greek Yogurt', unit: 'g', p: 10.0, c: 3.6, f: 0.4, kcal: 59, baseQty: 100, keys: ['greek yogurt', 'greek yoghurt'] },
  hung_curd:        { name: 'Hung Curd / Chakka', unit: 'g', p: 8.0, c: 3.5, f: 4.5, kcal: 85, baseQty: 100, keys: ['hung curd', 'chakka', 'hung yogurt'] },
  lassi:            { name: 'Lassi (Plain)', unit: 'ml', p: 3.0, c: 5.0, f: 2.0, kcal: 50, baseQty: 100, keys: ['lassi'] },
  buttermilk:       { name: 'Buttermilk / Chaas', unit: 'ml', p: 1.0, c: 2.5, f: 0.5, kcal: 20, baseQty: 100, keys: ['buttermilk', 'chaas', 'mattha'] },
  ghee:             { name: 'Ghee', unit: 'g', p: 0, c: 0, f: 99.5, kcal: 900, baseQty: 100, keys: ['ghee'] },
  ghee_tsp:         { name: 'Ghee (1 tsp)', unit: 'tsp', p: 0, c: 0, f: 4.7, kcal: 45, baseQty: 1, keys: ['ghee teaspoon', 'ghee tsp', '1 tsp ghee', 'one tsp ghee'] },
  butter:           { name: 'Butter', unit: 'g', p: 0.9, c: 0.1, f: 81.1, kcal: 717, baseQty: 100, keys: ['butter', 'makhan'] },
  cream:            { name: 'Fresh Cream', unit: 'g', p: 2.1, c: 2.8, f: 35.0, kcal: 340, baseQty: 100, keys: ['fresh cream', 'heavy cream', 'cream', 'malai', 'whipping cream'] },
  cheese:           { name: 'Processed Cheese', unit: 'g', p: 18.5, c: 5.0, f: 24.9, kcal: 321, baseQty: 100, keys: ['cheese', 'processed cheese', 'amul cheese'] },
  mozzarella:       { name: 'Mozzarella Cheese', unit: 'g', p: 22.2, c: 2.2, f: 17.1, kcal: 253, baseQty: 100, keys: ['mozzarella', 'mozzarella cheese'] },
  cheddar:          { name: 'Cheddar Cheese', unit: 'g', p: 24.9, c: 1.3, f: 33.1, kcal: 403, baseQty: 100, keys: ['cheddar', 'cheddar cheese'] },
  cottage_cheese:   { name: 'Cottage Cheese (Western)', unit: 'g', p: 11.1, c: 3.4, f: 4.3, kcal: 98, baseQty: 100, keys: ['cottage cheese', 'ricotta'] },
  egg_whole:        { name: 'Egg (Whole)', unit: 'piece', p: 6.3, c: 0.4, f: 4.8, kcal: 70, baseQty: 1, keys: ['egg', 'whole egg', 'anda'] },
  egg_white:        { name: 'Egg White', unit: 'piece', p: 3.6, c: 0.2, f: 0.0, kcal: 17, baseQty: 1, keys: ['egg white', 'anda safed'] },
  egg_yolk:         { name: 'Egg Yolk', unit: 'piece', p: 2.7, c: 0.6, f: 4.5, kcal: 55, baseQty: 1, keys: ['egg yolk', 'anda yolk', 'yolk'] },
  egg_boiled:       { name: 'Boiled Egg', unit: 'piece', p: 6.3, c: 0.6, f: 5.3, kcal: 78, baseQty: 1, keys: ['boiled egg', 'hard boiled egg', 'ubla anda'] },
  egg_scrambled:    { name: 'Scrambled Eggs', unit: 'piece', p: 5.5, c: 0.5, f: 5.5, kcal: 75, baseQty: 1, keys: ['scrambled egg', 'scrambled eggs'] },
  omelette:         { name: 'Omelette (2 eggs)', unit: 'piece', p: 13.0, c: 1.0, f: 12.0, kcal: 165, baseQty: 1, keys: ['omelette', 'omelet', 'masala omelette'] },
  whey_protein:     { name: 'Whey Protein', unit: 'scoop', p: 25.0, c: 3.0, f: 1.5, kcal: 120, baseQty: 1, keys: ['whey', 'whey protein', 'protein powder', 'whey isolate', 'protein shake'] },
  casein:           { name: 'Casein Protein', unit: 'scoop', p: 24.0, c: 4.0, f: 1.0, kcal: 120, baseQty: 1, keys: ['casein', 'casein protein', 'slow release protein'] },
  plant_protein:    { name: 'Plant Protein Powder', unit: 'scoop', p: 22.0, c: 5.0, f: 2.0, kcal: 125, baseQty: 1, keys: ['plant protein', 'pea protein', 'vegan protein'] },

  // ═══════════════════════════════════════════════════════
  // MEATS & SEAFOOD
  // ═══════════════════════════════════════════════════════

  chicken_breast_raw:{ name: 'Chicken Breast (Raw)', unit: 'g', p: 23.0, c: 0, f: 1.2, kcal: 110, baseQty: 100, keys: ['chicken breast raw', 'raw chicken breast'] },
  chicken_breast:   { name: 'Chicken Breast (Cooked)', unit: 'g', p: 31.0, c: 0, f: 3.6, kcal: 165, baseQty: 100, keys: ['chicken breast', 'grilled chicken', 'boiled chicken breast', 'steamed chicken'] },
  chicken_leg:      { name: 'Chicken Leg / Thigh', unit: 'g', p: 26.0, c: 0, f: 15.0, kcal: 240, baseQty: 100, keys: ['chicken leg', 'chicken thigh', 'chicken drumstick'] },
  chicken_whole:    { name: 'Whole Chicken (Cooked)', unit: 'g', p: 27.0, c: 0, f: 14.0, kcal: 239, baseQty: 100, keys: ['whole chicken', 'roasted chicken'] },
  chicken_mince:    { name: 'Chicken Mince (Cooked)', unit: 'g', p: 26.0, c: 0, f: 7.0, kcal: 165, baseQty: 100, keys: ['chicken mince', 'keema chicken', 'ground chicken'] },
  chicken_curry:    { name: 'Chicken Curry', unit: 'g', p: 14.0, c: 6.0, f: 10.0, kcal: 170, baseQty: 100, keys: ['chicken curry', 'murgh curry', 'chicken gravy'] },
  butter_chicken:   { name: 'Butter Chicken / Murgh Makhani', unit: 'g', p: 14.0, c: 7.0, f: 12.0, kcal: 190, baseQty: 100, keys: ['butter chicken', 'murgh makhani', 'makhani chicken'] },
  tandoori_chicken: { name: 'Tandoori Chicken', unit: 'g', p: 24.0, c: 3.0, f: 7.0, kcal: 170, baseQty: 100, keys: ['tandoori chicken'] },
  chicken_tikka:    { name: 'Chicken Tikka', unit: 'g', p: 22.0, c: 4.0, f: 8.0, kcal: 178, baseQty: 100, keys: ['chicken tikka', 'tikka'] },
  mutton:           { name: 'Mutton (Cooked)', unit: 'g', p: 25.6, c: 0, f: 21.3, kcal: 294, baseQty: 100, keys: ['mutton', 'lamb cooked', 'gosht'] },
  mutton_curry:     { name: 'Mutton Curry', unit: 'g', p: 15.0, c: 5.0, f: 18.0, kcal: 245, baseQty: 100, keys: ['mutton curry', 'lamb curry', 'gosht curry'] },
  mutton_mince:     { name: 'Mutton Keema', unit: 'g', p: 20.0, c: 4.0, f: 20.0, kcal: 270, baseQty: 100, keys: ['mutton keema', 'lamb mince', 'keema'] },
  fish_rohu:        { name: 'Rohu Fish (Cooked)', unit: 'g', p: 20.0, c: 0, f: 3.5, kcal: 111, baseQty: 100, keys: ['rohu', 'rohu fish'] },
  fish_catla:       { name: 'Catla Fish', unit: 'g', p: 19.0, c: 0, f: 4.0, kcal: 110, baseQty: 100, keys: ['catla', 'catla fish'] },
  salmon:           { name: 'Salmon (Cooked)', unit: 'g', p: 25.4, c: 0, f: 13.4, kcal: 208, baseQty: 100, keys: ['salmon', 'salmon fish'] },
  tuna:             { name: 'Tuna (Canned in Water)', unit: 'g', p: 25.5, c: 0, f: 0.9, kcal: 109, baseQty: 100, keys: ['tuna', 'tuna fish', 'canned tuna'] },
  prawns:           { name: 'Prawns / Shrimp (Cooked)', unit: 'g', p: 20.3, c: 1.1, f: 1.7, kcal: 99, baseQty: 100, keys: ['prawns', 'shrimp', 'jhinga'] },
  fish_tilapia:     { name: 'Tilapia (Cooked)', unit: 'g', p: 26.2, c: 0, f: 4.2, kcal: 128, baseQty: 100, keys: ['tilapia', 'tilapia fish'] },
  sardines:         { name: 'Sardines (Canned)', unit: 'g', p: 24.6, c: 0, f: 11.5, kcal: 208, baseQty: 100, keys: ['sardines', 'sardine'] },
  fish_pomfret:     { name: 'Pomfret Fish (Cooked)', unit: 'g', p: 21.0, c: 0, f: 5.0, kcal: 131, baseQty: 100, keys: ['pomfret', 'pomfret fish', 'paplet'] },

  // ═══════════════════════════════════════════════════════
  // VEGETABLES — RAW
  // ═══════════════════════════════════════════════════════

  potato:           { name: 'Potato (Raw)', unit: 'g', p: 2.0, c: 17.5, f: 0.1, kcal: 77, baseQty: 100, keys: ['potato', 'aloo', 'potatoes'] },
  sweet_potato:     { name: 'Sweet Potato', unit: 'g', p: 1.6, c: 20.1, f: 0.1, kcal: 86, baseQty: 100, keys: ['sweet potato', 'shakarkandi'] },
  tomato:           { name: 'Tomato', unit: 'g', p: 0.9, c: 3.9, f: 0.2, kcal: 18, baseQty: 100, keys: ['tomato', 'tamatar', 'tomatoes'] },
  onion:            { name: 'Onion', unit: 'g', p: 1.1, c: 9.3, f: 0.1, kcal: 40, baseQty: 100, keys: ['onion', 'pyaz', 'pyaaz', 'onions'] },
  garlic:           { name: 'Garlic', unit: 'g', p: 6.4, c: 33.1, f: 0.5, kcal: 149, baseQty: 100, keys: ['garlic', 'lahsun', 'lehsun'] },
  ginger:           { name: 'Ginger', unit: 'g', p: 1.8, c: 17.8, f: 0.8, kcal: 80, baseQty: 100, keys: ['ginger', 'adrak'] },
  broccoli:         { name: 'Broccoli', unit: 'g', p: 2.8, c: 6.6, f: 0.4, kcal: 34, baseQty: 100, keys: ['broccoli'] },
  cauliflower:      { name: 'Cauliflower / Phool Gobi', unit: 'g', p: 1.9, c: 4.9, f: 0.3, kcal: 25, baseQty: 100, keys: ['cauliflower', 'phool gobi', 'gobi', 'phool gobhi'] },
  cabbage:          { name: 'Cabbage / Patta Gobi', unit: 'g', p: 1.3, c: 5.8, f: 0.1, kcal: 25, baseQty: 100, keys: ['cabbage', 'patta gobi', 'band gobi', 'patta gobhi'] },
  spinach:          { name: 'Spinach / Palak', unit: 'g', p: 2.9, c: 3.6, f: 0.4, kcal: 23, baseQty: 100, keys: ['spinach', 'palak', 'saag'] },
  fenugreek:        { name: 'Fenugreek / Methi', unit: 'g', p: 4.4, c: 6.0, f: 0.9, kcal: 49, baseQty: 100, keys: ['methi', 'fenugreek', 'fenugreek leaves'] },
  beans_french:     { name: 'French Beans / Green Beans', unit: 'g', p: 1.8, c: 7.9, f: 0.1, kcal: 31, baseQty: 100, keys: ['french beans', 'green beans', 'beans', 'farasbi'] },
  lady_finger:      { name: 'Okra / Lady Finger / Bhindi', unit: 'g', p: 2.0, c: 7.5, f: 0.2, kcal: 33, baseQty: 100, keys: ['bhindi', 'ladyfinger', 'okra', 'lady finger'] },
  pumpkin:          { name: 'Pumpkin / Kaddu', unit: 'g', p: 1.0, c: 6.5, f: 0.1, kcal: 26, baseQty: 100, keys: ['pumpkin', 'kaddu', 'kadoo'] },
  bottle_gourd:     { name: 'Bottle Gourd / Lauki / Doodhi', unit: 'g', p: 0.6, c: 3.4, f: 0.1, kcal: 14, baseQty: 100, keys: ['lauki', 'doodhi', 'bottle gourd', 'dudhi', 'ghia'] },
  ridge_gourd:      { name: 'Ridge Gourd / Turai', unit: 'g', p: 0.5, c: 4.4, f: 0.1, kcal: 20, baseQty: 100, keys: ['turai', 'ridge gourd', 'torai'] },
  bitter_gourd:     { name: 'Bitter Gourd / Karela', unit: 'g', p: 1.0, c: 4.3, f: 0.2, kcal: 17, baseQty: 100, keys: ['karela', 'bitter gourd', 'bitter melon'] },
  ash_gourd:        { name: 'Ash Gourd / Petha', unit: 'g', p: 0.4, c: 3.0, f: 0.2, kcal: 14, baseQty: 100, keys: ['petha', 'ash gourd'] },
  eggplant:         { name: 'Eggplant / Brinjal / Baingan', unit: 'g', p: 1.0, c: 5.9, f: 0.2, kcal: 25, baseQty: 100, keys: ['baingan', 'brinjal', 'eggplant', 'aubergine'] },
  capsicum:         { name: 'Capsicum / Bell Pepper', unit: 'g', p: 1.0, c: 6.0, f: 0.3, kcal: 31, baseQty: 100, keys: ['capsicum', 'bell pepper', 'shimla mirch'] },
  carrot:           { name: 'Carrot', unit: 'g', p: 0.9, c: 9.6, f: 0.2, kcal: 41, baseQty: 100, keys: ['carrot', 'gajar', 'carrots'] },
  beetroot:         { name: 'Beetroot / Chukandar', unit: 'g', p: 1.6, c: 9.6, f: 0.2, kcal: 43, baseQty: 100, keys: ['beetroot', 'beet', 'chukandar'] },
  cucumber:         { name: 'Cucumber / Kheera', unit: 'g', p: 0.7, c: 3.6, f: 0.1, kcal: 16, baseQty: 100, keys: ['cucumber', 'kheera', 'kakdi', 'kakri'] },
  radish:           { name: 'Radish / Mooli', unit: 'g', p: 0.7, c: 3.4, f: 0.1, kcal: 16, baseQty: 100, keys: ['radish', 'mooli', 'muli'] },
  turnip:           { name: 'Turnip / Shalgam', unit: 'g', p: 0.9, c: 6.4, f: 0.1, kcal: 28, baseQty: 100, keys: ['turnip', 'shalgam'] },
  celery:           { name: 'Celery', unit: 'g', p: 0.7, c: 3.0, f: 0.2, kcal: 16, baseQty: 100, keys: ['celery', 'ajmod'] },
  lettuce:          { name: 'Lettuce', unit: 'g', p: 1.4, c: 2.9, f: 0.2, kcal: 15, baseQty: 100, keys: ['lettuce', 'salad patta'] },
  mushroom:         { name: 'Mushroom', unit: 'g', p: 3.1, c: 3.3, f: 0.3, kcal: 22, baseQty: 100, keys: ['mushroom', 'khumb', 'mushrooms'] },
  corn_kernel:      { name: 'Corn Kernels', unit: 'g', p: 3.3, c: 19.0, f: 1.4, kcal: 86, baseQty: 100, keys: ['corn kernels', 'makai'] },
  zucchini:         { name: 'Zucchini / Courgette', unit: 'g', p: 1.2, c: 3.1, f: 0.3, kcal: 17, baseQty: 100, keys: ['zucchini', 'courgette'] },
  asparagus:        { name: 'Asparagus', unit: 'g', p: 2.2, c: 3.9, f: 0.1, kcal: 20, baseQty: 100, keys: ['asparagus'] },
  kale:             { name: 'Kale', unit: 'g', p: 4.3, c: 8.8, f: 0.9, kcal: 49, baseQty: 100, keys: ['kale'] },
  arugula:          { name: 'Arugula / Rocket', unit: 'g', p: 2.6, c: 3.7, f: 0.7, kcal: 25, baseQty: 100, keys: ['arugula', 'rocket salad'] },

  // ═══════════════════════════════════════════════════════
  // FRUITS
  // ═══════════════════════════════════════════════════════

  banana:           { name: 'Banana', unit: 'piece', p: 1.1, c: 23.0, f: 0.3, kcal: 89, baseQty: 1, keys: ['banana', 'kela', 'kele'] },
  apple:            { name: 'Apple', unit: 'piece', p: 0.3, c: 14.0, f: 0.2, kcal: 52, baseQty: 1, keys: ['apple', 'seb'] },
  mango:            { name: 'Mango', unit: 'g', p: 0.8, c: 15.0, f: 0.4, kcal: 60, baseQty: 100, keys: ['mango', 'aam', 'mangoes'] },
  orange:           { name: 'Orange', unit: 'piece', p: 0.9, c: 12.0, f: 0.1, kcal: 47, baseQty: 1, keys: ['orange', 'santra', 'narangi'] },
  papaya:           { name: 'Papaya / Papita', unit: 'g', p: 0.5, c: 11.0, f: 0.3, kcal: 43, baseQty: 100, keys: ['papaya', 'papita'] },
  guava:            { name: 'Guava / Amrud', unit: 'piece', p: 2.6, c: 14.3, f: 1.0, kcal: 68, baseQty: 1, keys: ['guava', 'amrud'] },
  pineapple:        { name: 'Pineapple', unit: 'g', p: 0.5, c: 13.1, f: 0.1, kcal: 50, baseQty: 100, keys: ['pineapple', 'ananas'] },
  watermelon:       { name: 'Watermelon / Tarbuj', unit: 'g', p: 0.6, c: 7.6, f: 0.2, kcal: 30, baseQty: 100, keys: ['watermelon', 'tarbuj', 'tarbuz'] },
  grapes:           { name: 'Grapes', unit: 'g', p: 0.6, c: 17.2, f: 0.2, kcal: 69, baseQty: 100, keys: ['grapes', 'angur', 'angoor'] },
  strawberry:       { name: 'Strawberry', unit: 'g', p: 0.7, c: 7.7, f: 0.3, kcal: 32, baseQty: 100, keys: ['strawberry', 'strawberries'] },
  blueberry:        { name: 'Blueberry', unit: 'g', p: 0.7, c: 14.5, f: 0.3, kcal: 57, baseQty: 100, keys: ['blueberry', 'blueberries'] },
  pomegranate:      { name: 'Pomegranate / Anar', unit: 'g', p: 1.7, c: 18.7, f: 1.2, kcal: 83, baseQty: 100, keys: ['pomegranate', 'anar'] },
  coconut:          { name: 'Coconut (Fresh)', unit: 'g', p: 3.3, c: 15.2, f: 33.5, kcal: 354, baseQty: 100, keys: ['coconut', 'nariyal', 'fresh coconut'] },
  coconut_water:    { name: 'Coconut Water', unit: 'ml', p: 0.7, c: 3.7, f: 0.2, kcal: 19, baseQty: 100, keys: ['coconut water', 'nariyal pani', 'tender coconut'] },
  kiwi:             { name: 'Kiwi', unit: 'piece', p: 1.1, c: 15.0, f: 0.5, kcal: 61, baseQty: 1, keys: ['kiwi', 'kiwifruit'] },
  pear:             { name: 'Pear / Nashpati', unit: 'piece', p: 0.4, c: 15.5, f: 0.1, kcal: 57, baseQty: 1, keys: ['pear', 'nashpati'] },
  lemon:            { name: 'Lemon / Nimbu', unit: 'piece', p: 0.4, c: 3.5, f: 0.2, kcal: 15, baseQty: 1, keys: ['lemon', 'nimbu', 'lime'] },
  avocado:          { name: 'Avocado', unit: 'g', p: 2.0, c: 8.5, f: 14.7, kcal: 160, baseQty: 100, keys: ['avocado'] },
  dates:            { name: 'Dates / Khajoor', unit: 'piece', p: 0.5, c: 18.0, f: 0.1, kcal: 70, baseQty: 1, keys: ['dates', 'khajoor', 'khajur'] },
  fig:              { name: 'Fig / Anjeer', unit: 'piece', p: 0.8, c: 19.2, f: 0.3, kcal: 74, baseQty: 1, keys: ['fig', 'anjeer'] },
  plum:             { name: 'Plum / Aloo Bukhara', unit: 'piece', p: 0.7, c: 11.4, f: 0.3, kcal: 46, baseQty: 1, keys: ['plum', 'aloo bukhara'] },
  peach:            { name: 'Peach', unit: 'piece', p: 0.9, c: 9.5, f: 0.3, kcal: 39, baseQty: 1, keys: ['peach', 'aadoo'] },
  cherry:           { name: 'Cherry', unit: 'g', p: 1.1, c: 16.0, f: 0.2, kcal: 63, baseQty: 100, keys: ['cherry', 'cherries'] },
  jackfruit:        { name: 'Jackfruit / Kathal', unit: 'g', p: 1.7, c: 23.7, f: 0.6, kcal: 95, baseQty: 100, keys: ['jackfruit', 'kathal', 'kathal raw'] },
  litchi:           { name: 'Litchi / Lychee', unit: 'g', p: 0.8, c: 16.5, f: 0.4, kcal: 66, baseQty: 100, keys: ['litchi', 'lychee'] },

  // ═══════════════════════════════════════════════════════
  // NUTS & SEEDS
  // ═══════════════════════════════════════════════════════

  almonds:          { name: 'Almonds / Badam', unit: 'g', p: 21.2, c: 21.6, f: 49.9, kcal: 579, baseQty: 100, keys: ['almonds', 'badam'] },
  almonds_piece:    { name: 'Almonds', unit: 'piece', p: 0.7, c: 0.7, f: 1.7, kcal: 20, baseQty: 1, keys: ['almond piece', 'badam piece'] },
  walnuts:          { name: 'Walnuts / Akhrot', unit: 'g', p: 15.2, c: 13.7, f: 65.2, kcal: 654, baseQty: 100, keys: ['walnuts', 'akhrot', 'walnut'] },
  cashews:          { name: 'Cashews / Kaju', unit: 'g', p: 18.2, c: 30.2, f: 43.9, kcal: 553, baseQty: 100, keys: ['cashews', 'kaju', 'cashew'] },
  pistachios:       { name: 'Pistachios / Pista', unit: 'g', p: 20.2, c: 27.5, f: 45.4, kcal: 562, baseQty: 100, keys: ['pistachios', 'pista', 'pistachio'] },
  raisins:          { name: 'Raisins / Kishmish', unit: 'g', p: 3.1, c: 79.2, f: 0.5, kcal: 299, baseQty: 100, keys: ['raisins', 'kishmish', 'kismis'] },
  flaxseeds:        { name: 'Flaxseeds / Alsi', unit: 'g', p: 18.3, c: 28.9, f: 42.2, kcal: 534, baseQty: 100, keys: ['flaxseed', 'flaxseeds', 'alsi', 'linseed'] },
  chia_seeds:       { name: 'Chia Seeds', unit: 'g', p: 16.5, c: 42.1, f: 30.7, kcal: 486, baseQty: 100, keys: ['chia seeds', 'chia', 'sabja'] },
  sunflower_seeds:  { name: 'Sunflower Seeds', unit: 'g', p: 20.8, c: 20.0, f: 51.5, kcal: 584, baseQty: 100, keys: ['sunflower seeds', 'surajmukhi beej'] },
  pumpkin_seeds:    { name: 'Pumpkin Seeds', unit: 'g', p: 30.2, c: 10.7, f: 49.1, kcal: 559, baseQty: 100, keys: ['pumpkin seeds', 'kaddu beej'] },
  sesame:           { name: 'Sesame Seeds / Til', unit: 'g', p: 17.7, c: 23.4, f: 49.7, kcal: 573, baseQty: 100, keys: ['sesame', 'til', 'sesame seeds'] },
  hemp_seeds:       { name: 'Hemp Seeds', unit: 'g', p: 31.6, c: 8.7, f: 48.8, kcal: 553, baseQty: 100, keys: ['hemp seeds'] },

  // ═══════════════════════════════════════════════════════
  // OILS & FATS
  // ═══════════════════════════════════════════════════════

  oil:              { name: 'Cooking Oil', unit: 'ml', p: 0, c: 0, f: 100, kcal: 900, baseQty: 100, keys: ['oil', 'cooking oil'] },
  olive_oil:        { name: 'Olive Oil', unit: 'ml', p: 0, c: 0, f: 100, kcal: 884, baseQty: 100, keys: ['olive oil', 'jaitun ka tel'] },
  coconut_oil:      { name: 'Coconut Oil', unit: 'ml', p: 0, c: 0, f: 100, kcal: 892, baseQty: 100, keys: ['coconut oil', 'nariyal tel'] },
  mustard_oil:      { name: 'Mustard Oil / Sarson Tel', unit: 'ml', p: 0, c: 0, f: 100, kcal: 884, baseQty: 100, keys: ['mustard oil', 'sarson tel', 'sarson ka tel'] },
  sunflower_oil:    { name: 'Sunflower Oil', unit: 'ml', p: 0, c: 0, f: 100, kcal: 884, baseQty: 100, keys: ['sunflower oil'] },

  // ═══════════════════════════════════════════════════════
  // INDIAN COOKED DISHES
  // ═══════════════════════════════════════════════════════

  biryani_veg:      { name: 'Veg Biryani', unit: 'g', p: 4.0, c: 28.0, f: 5.0, kcal: 173, baseQty: 100, keys: ['veg biryani', 'vegetable biryani'] },
  biryani_chicken:  { name: 'Chicken Biryani', unit: 'g', p: 10.0, c: 26.0, f: 8.0, kcal: 218, baseQty: 100, keys: ['chicken biryani', 'biryani'] },
  biryani_mutton:   { name: 'Mutton Biryani', unit: 'g', p: 11.0, c: 25.0, f: 10.0, kcal: 235, baseQty: 100, keys: ['mutton biryani', 'gosht biryani'] },
  khichdi:          { name: 'Khichdi', unit: 'g', p: 4.5, c: 22.0, f: 2.5, kcal: 127, baseQty: 100, keys: ['khichdi', 'khichdi', 'khichadi'] },
  upma:             { name: 'Upma', unit: 'g', p: 4.0, c: 22.0, f: 6.0, kcal: 156, baseQty: 100, keys: ['upma'] },
  aloo_gobi:        { name: 'Aloo Gobi', unit: 'g', p: 2.0, c: 12.0, f: 4.5, kcal: 94, baseQty: 100, keys: ['aloo gobi', 'potato cauliflower'] },
  aloo_matar:       { name: 'Aloo Matar', unit: 'g', p: 3.0, c: 15.0, f: 4.0, kcal: 106, baseQty: 100, keys: ['aloo matar', 'potato peas'] },
  palak_paneer:     { name: 'Palak Paneer', unit: 'g', p: 9.0, c: 6.0, f: 13.0, kcal: 178, baseQty: 100, keys: ['palak paneer', 'spinach paneer'] },
  shahi_paneer:     { name: 'Shahi Paneer', unit: 'g', p: 8.0, c: 9.0, f: 18.0, kcal: 230, baseQty: 100, keys: ['shahi paneer'] },
  paneer_butter_masala: { name: 'Paneer Butter Masala', unit: 'g', p: 9.0, c: 10.0, f: 17.0, kcal: 225, baseQty: 100, keys: ['paneer butter masala', 'paneer makhani'] },
  kadai_paneer:     { name: 'Kadai Paneer', unit: 'g', p: 9.5, c: 7.0, f: 14.0, kcal: 193, baseQty: 100, keys: ['kadai paneer', 'karahi paneer'] },
  matar_paneer:     { name: 'Matar Paneer', unit: 'g', p: 8.0, c: 10.0, f: 10.0, kcal: 162, baseQty: 100, keys: ['matar paneer', 'peas paneer'] },
  aloo_curry:       { name: 'Aloo Curry / Dum Aloo', unit: 'g', p: 2.0, c: 14.0, f: 5.0, kcal: 106, baseQty: 100, keys: ['aloo curry', 'dum aloo', 'potato curry'] },
  chhole_masala:    { name: 'Chhole Masala', unit: 'g', p: 7.0, c: 18.0, f: 6.0, kcal: 154, baseQty: 100, keys: ['chhole masala', 'chole masala', 'chana masala', 'chhole bhature'] },
  rajma_chawal:     { name: 'Rajma Chawal', unit: 'g', p: 5.5, c: 23.0, f: 2.5, kcal: 134, baseQty: 100, keys: ['rajma chawal', 'rajma rice'] },
  kadhi_pakora:     { name: 'Kadhi Pakora', unit: 'g', p: 4.0, c: 12.0, f: 7.0, kcal: 127, baseQty: 100, keys: ['kadhi pakora', 'kadhi', 'kadi pakora'] },
  baingan_bharta:   { name: 'Baingan Bharta', unit: 'g', p: 2.0, c: 8.0, f: 5.0, kcal: 85, baseQty: 100, keys: ['baingan bharta', 'brinjal bharta'] },
  lauki_sabzi:      { name: 'Lauki Sabzi', unit: 'g', p: 1.0, c: 5.0, f: 3.0, kcal: 50, baseQty: 100, keys: ['lauki sabzi', 'doodhi sabzi', 'bottle gourd curry'] },
  bhindi_masala:    { name: 'Bhindi Masala', unit: 'g', p: 2.5, c: 9.0, f: 5.0, kcal: 90, baseQty: 100, keys: ['bhindi masala', 'okra masala', 'bhindi fry'] },
  pav_bhaji:        { name: 'Pav Bhaji', unit: 'g', p: 4.0, c: 20.0, f: 8.0, kcal: 163, baseQty: 100, keys: ['pav bhaji', 'pav bhaji bhaji'] },
  vada_pav:         { name: 'Vada Pav', unit: 'piece', p: 6.0, c: 38.0, f: 9.0, kcal: 255, baseQty: 1, keys: ['vada pav', 'wada pav'] },
  samosa:           { name: 'Samosa', unit: 'piece', p: 3.5, c: 22.0, f: 9.0, kcal: 185, baseQty: 1, keys: ['samosa', 'samosas'] },
  kachori:          { name: 'Kachori', unit: 'piece', p: 4.0, c: 25.0, f: 12.0, kcal: 220, baseQty: 1, keys: ['kachori', 'kachauri'] },
  dhokla:           { name: 'Dhokla', unit: 'piece', p: 3.5, c: 12.0, f: 2.0, kcal: 75, baseQty: 1, keys: ['dhokla'] },
  medu_vada:        { name: 'Medu Vada', unit: 'piece', p: 3.0, c: 13.0, f: 6.0, kcal: 116, baseQty: 1, keys: ['medu vada', 'medhu vada', 'vada'] },
  rasam:            { name: 'Rasam', unit: 'ml', p: 1.0, c: 3.5, f: 0.5, kcal: 22, baseQty: 100, keys: ['rasam'] },
  sambar:           { name: 'Sambar', unit: 'ml', p: 3.0, c: 8.0, f: 2.0, kcal: 62, baseQty: 100, keys: ['sambar', 'sambhar'] },
  halwa:            { name: 'Suji Halwa', unit: 'g', p: 3.0, c: 32.0, f: 9.0, kcal: 220, baseQty: 100, keys: ['halwa', 'suji halwa', 'sooji halwa', 'rava halwa'] },
  gajar_halwa:      { name: 'Gajar Ka Halwa', unit: 'g', p: 3.5, c: 28.0, f: 9.0, kcal: 205, baseQty: 100, keys: ['gajar halwa', 'carrot halwa', 'gajar ka halwa'] },
  kheer:            { name: 'Kheer / Rice Pudding', unit: 'g', p: 4.0, c: 20.0, f: 5.0, kcal: 140, baseQty: 100, keys: ['kheer', 'rice kheer', 'rice pudding'] },
  raita:            { name: 'Raita (Plain)', unit: 'g', p: 2.0, c: 3.5, f: 1.5, kcal: 36, baseQty: 100, keys: ['raita', 'boondi raita', 'mixed raita'] },
  chaat:            { name: 'Aloo Chaat', unit: 'g', p: 3.0, c: 20.0, f: 5.0, kcal: 133, baseQty: 100, keys: ['aloo chaat', 'chaat', 'papdi chaat', 'bhel puri'] },
  bhel_puri:        { name: 'Bhel Puri', unit: 'g', p: 4.0, c: 25.0, f: 5.0, kcal: 157, baseQty: 100, keys: ['bhel puri', 'bhel'] },
  pani_puri:        { name: 'Pani Puri / Golgappa', unit: 'piece', p: 0.5, c: 8.0, f: 1.5, kcal: 47, baseQty: 1, keys: ['pani puri', 'golgappa', 'puchka'] },
  dahi_puri:        { name: 'Dahi Puri', unit: 'piece', p: 1.0, c: 9.0, f: 1.5, kcal: 54, baseQty: 1, keys: ['dahi puri', 'dahi batata puri'] },
  thepla:           { name: 'Thepla', unit: 'piece', p: 3.5, c: 18.0, f: 4.5, kcal: 125, baseQty: 1, keys: ['thepla', 'methi thepla'] },
  makki_roti:       { name: 'Makki Roti', unit: 'piece', p: 2.0, c: 18.0, f: 1.0, kcal: 89, baseQty: 1, keys: ['makki roti', 'maize roti'] },
  sarson_saag:      { name: 'Sarson Ka Saag', unit: 'g', p: 3.0, c: 7.0, f: 3.0, kcal: 66, baseQty: 100, keys: ['sarson saag', 'sarson ka saag', 'mustard saag'] },
  pongal:           { name: 'Pongal', unit: 'g', p: 3.5, c: 20.0, f: 4.0, kcal: 128, baseQty: 100, keys: ['pongal', 'ven pongal'] },
  pulao:            { name: 'Veg Pulao', unit: 'g', p: 3.5, c: 22.0, f: 4.0, kcal: 138, baseQty: 100, keys: ['pulao', 'veg pulao', 'vegetable pulao', 'peas pulao'] },
  jeera_rice:       { name: 'Jeera Rice', unit: 'g', p: 3.0, c: 26.0, f: 3.5, kcal: 148, baseQty: 100, keys: ['jeera rice', 'cumin rice'] },
  fried_rice_veg:   { name: 'Vegetable Fried Rice', unit: 'g', p: 3.5, c: 22.0, f: 5.0, kcal: 148, baseQty: 100, keys: ['veg fried rice', 'vegetable fried rice'] },
  chicken_fried_rice: { name: 'Chicken Fried Rice', unit: 'g', p: 6.0, c: 22.0, f: 5.5, kcal: 162, baseQty: 100, keys: ['chicken fried rice', 'egg fried rice'] },

  // ═══════════════════════════════════════════════════════
  // WORLD DISHES — CONTINENTAL & ASIAN
  // ═══════════════════════════════════════════════════════

  pizza_slice:      { name: 'Pizza (Regular Slice)', unit: 'piece', p: 11.0, c: 33.0, f: 10.0, kcal: 266, baseQty: 1, keys: ['pizza slice', 'pizza'] },
  burger:           { name: 'Chicken Burger', unit: 'piece', p: 15.0, c: 40.0, f: 12.0, kcal: 330, baseQty: 1, keys: ['chicken burger', 'burger'] },
  veg_burger:       { name: 'Veg Burger', unit: 'piece', p: 7.0, c: 42.0, f: 8.0, kcal: 270, baseQty: 1, keys: ['veg burger', 'aloo burger'] },
  sandwich_chicken: { name: 'Chicken Sandwich', unit: 'piece', p: 14.0, c: 28.0, f: 8.0, kcal: 240, baseQty: 1, keys: ['chicken sandwich'] },
  sandwich_veg:     { name: 'Veg Sandwich', unit: 'piece', p: 6.0, c: 30.0, f: 6.0, kcal: 200, baseQty: 1, keys: ['veg sandwich', 'sandwich'] },
  wrap_chicken:     { name: 'Chicken Wrap', unit: 'piece', p: 18.0, c: 32.0, f: 9.0, kcal: 280, baseQty: 1, keys: ['chicken wrap', 'chicken roll', 'frankie'] },
  sushi:            { name: 'Sushi Roll (8 pcs)', unit: 'piece', p: 6.0, c: 30.0, f: 1.5, kcal: 157, baseQty: 1, keys: ['sushi', 'sushi roll'] },
  ramen:            { name: 'Ramen Bowl', unit: 'g', p: 7.0, c: 22.0, f: 5.0, kcal: 160, baseQty: 100, keys: ['ramen', 'ramen bowl'] },
  fried_chicken:    { name: 'Fried Chicken', unit: 'g', p: 23.0, c: 8.0, f: 14.0, kcal: 246, baseQty: 100, keys: ['fried chicken', 'crispy chicken', 'kfc style'] },
  pasta_tomato:     { name: 'Pasta in Tomato Sauce', unit: 'g', p: 4.5, c: 22.0, f: 3.5, kcal: 137, baseQty: 100, keys: ['pasta tomato', 'pasta arrabbiata', 'pasta marinara', 'pasta sauce'] },
  pasta_alfredo:    { name: 'Pasta Alfredo', unit: 'g', p: 7.0, c: 22.0, f: 11.0, kcal: 210, baseQty: 100, keys: ['pasta alfredo', 'white sauce pasta', 'cream sauce pasta'] },
  mac_cheese:       { name: 'Mac & Cheese', unit: 'g', p: 7.0, c: 24.0, f: 8.0, kcal: 195, baseQty: 100, keys: ['mac and cheese', 'mac cheese', 'macaroni cheese'] },
  fried_rice_chinese: { name: 'Chinese Fried Rice', unit: 'g', p: 4.0, c: 22.0, f: 5.5, kcal: 153, baseQty: 100, keys: ['chinese fried rice', 'schezwan fried rice', 'manchurian rice'] },
  spring_roll:      { name: 'Spring Roll', unit: 'piece', p: 3.0, c: 14.0, f: 5.0, kcal: 112, baseQty: 1, keys: ['spring roll', 'veg spring roll'] },
  momos:            { name: 'Momos (Veg, Steamed)', unit: 'piece', p: 2.5, c: 8.5, f: 1.0, kcal: 54, baseQty: 1, keys: ['momos', 'momo', 'veg momos', 'steamed momos'] },
  momos_chicken:    { name: 'Momos (Chicken, Steamed)', unit: 'piece', p: 4.0, c: 8.0, f: 1.5, kcal: 61, baseQty: 1, keys: ['chicken momos', 'non veg momos'] },
  manchurian:       { name: 'Veg Manchurian', unit: 'g', p: 3.5, c: 12.0, f: 6.0, kcal: 113, baseQty: 100, keys: ['manchurian', 'veg manchurian', 'gobi manchurian'] },
  dumplings:        { name: 'Dumplings', unit: 'piece', p: 3.5, c: 8.0, f: 1.5, kcal: 60, baseQty: 1, keys: ['dumplings', 'gyoza', 'potstickers'] },
  kebab:            { name: 'Seekh Kebab', unit: 'piece', p: 10.0, c: 3.0, f: 7.0, kcal: 113, baseQty: 1, keys: ['kebab', 'seekh kebab', 'shami kebab', 'mutton kebab', 'chicken kebab'] },
  falafel:          { name: 'Falafel', unit: 'piece', p: 3.5, c: 10.0, f: 5.0, kcal: 100, baseQty: 1, keys: ['falafel'] },
  hummus:           { name: 'Hummus', unit: 'g', p: 7.9, c: 14.3, f: 9.6, kcal: 177, baseQty: 100, keys: ['hummus'] },
  pita_bread:       { name: 'Pita Bread', unit: 'piece', p: 5.5, c: 33.4, f: 0.7, kcal: 165, baseQty: 1, keys: ['pita', 'pita bread'] },
  shawarma:         { name: 'Chicken Shawarma', unit: 'piece', p: 20.0, c: 30.0, f: 12.0, kcal: 308, baseQty: 1, keys: ['shawarma', 'chicken shawarma'] },
  pad_thai:         { name: 'Pad Thai', unit: 'g', p: 8.0, c: 27.0, f: 7.0, kcal: 203, baseQty: 100, keys: ['pad thai'] },
  fried_rice_thai:  { name: 'Thai Fried Rice', unit: 'g', p: 5.0, c: 24.0, f: 5.0, kcal: 160, baseQty: 100, keys: ['thai fried rice', 'thai rice'] },
  tacos:            { name: 'Taco (Chicken)', unit: 'piece', p: 12.0, c: 20.0, f: 8.0, kcal: 200, baseQty: 1, keys: ['taco', 'chicken taco'] },
  burrito:          { name: 'Burrito (Chicken)', unit: 'piece', p: 22.0, c: 50.0, f: 15.0, kcal: 420, baseQty: 1, keys: ['burrito', 'chicken burrito'] },
  lasagna:          { name: 'Lasagna (Meat)', unit: 'g', p: 8.0, c: 14.0, f: 8.0, kcal: 163, baseQty: 100, keys: ['lasagna', 'lasagne'] },
  pancake:          { name: 'Pancake', unit: 'piece', p: 3.0, c: 15.0, f: 4.0, kcal: 108, baseQty: 1, keys: ['pancake', 'pancakes'] },
  waffle:           { name: 'Waffle', unit: 'piece', p: 4.5, c: 25.0, f: 6.0, kcal: 168, baseQty: 1, keys: ['waffle', 'waffles'] },

  // ═══════════════════════════════════════════════════════
  // SNACKS & FAST FOOD
  // ═══════════════════════════════════════════════════════

  chips:            { name: 'Potato Chips', unit: 'g', p: 7.0, c: 52.0, f: 35.0, kcal: 547, baseQty: 100, keys: ['chips', 'potato chips', 'lays', 'crisps'] },
  biscuits:         { name: 'Marie Biscuits', unit: 'piece', p: 0.6, c: 6.0, f: 0.7, kcal: 33, baseQty: 1, keys: ['biscuits', 'marie biscuits', 'biscuit'] },
  glucose_biscuit:  { name: 'Glucose Biscuit', unit: 'piece', p: 0.5, c: 8.0, f: 1.0, kcal: 43, baseQty: 1, keys: ['glucose biscuit', 'glucose biscuits'] },
  bread_pakora:     { name: 'Bread Pakora', unit: 'piece', p: 4.5, c: 22.0, f: 10.0, kcal: 194, baseQty: 1, keys: ['bread pakora', 'bread pakoda'] },
  onion_pakora:     { name: 'Onion Pakora', unit: 'g', p: 5.0, c: 22.0, f: 12.0, kcal: 212, baseQty: 100, keys: ['onion pakora', 'kanda pakora', 'pakora', 'pakoda'] },
  french_fries:     { name: 'French Fries', unit: 'g', p: 3.4, c: 32.0, f: 12.0, kcal: 253, baseQty: 100, keys: ['french fries', 'fries', 'aloo fry'] },
  nachos:           { name: 'Nachos', unit: 'g', p: 7.0, c: 63.0, f: 22.0, kcal: 480, baseQty: 100, keys: ['nachos'] },
  popcorn:          { name: 'Popcorn (Plain)', unit: 'g', p: 11.0, c: 74.0, f: 4.0, kcal: 387, baseQty: 100, keys: ['popcorn'] },
  murukku:          { name: 'Murukku', unit: 'g', p: 7.5, c: 55.0, f: 22.0, kcal: 452, baseQty: 100, keys: ['murukku', 'chakli'] },
  mixture:          { name: 'Mixture / Namkeen', unit: 'g', p: 9.0, c: 50.0, f: 23.0, kcal: 440, baseQty: 100, keys: ['mixture', 'namkeen', 'chiwda', 'bombay mix'] },
  mathri:           { name: 'Mathri', unit: 'piece', p: 1.5, c: 10.0, f: 4.5, kcal: 88, baseQty: 1, keys: ['mathri', 'mathari'] },

  // ═══════════════════════════════════════════════════════
  // SWEETS & DESSERTS
  // ═══════════════════════════════════════════════════════

  gulab_jamun:      { name: 'Gulab Jamun', unit: 'piece', p: 3.0, c: 28.0, f: 7.0, kcal: 183, baseQty: 1, keys: ['gulab jamun', 'gulab jamun'] },
  jalebi:           { name: 'Jalebi', unit: 'g', p: 2.0, c: 48.0, f: 12.0, kcal: 300, baseQty: 100, keys: ['jalebi'] },
  rasgulla:         { name: 'Rasgulla', unit: 'piece', p: 3.5, c: 18.0, f: 2.0, kcal: 105, baseQty: 1, keys: ['rasgulla'] },
  barfi:            { name: 'Barfi / Burfi', unit: 'piece', p: 4.0, c: 28.0, f: 8.0, kcal: 198, baseQty: 1, keys: ['barfi', 'burfi', 'besan barfi', 'milk barfi'] },
  ladoo:            { name: 'Besan Ladoo', unit: 'piece', p: 5.0, c: 30.0, f: 10.0, kcal: 228, baseQty: 1, keys: ['ladoo', 'laddoo', 'besan ladoo', 'motichoor ladoo'] },
  chocolate:        { name: 'Milk Chocolate', unit: 'g', p: 7.7, c: 59.5, f: 30.0, kcal: 535, baseQty: 100, keys: ['chocolate', 'milk chocolate', 'dark chocolate'] },
  ice_cream:        { name: 'Ice Cream (Vanilla)', unit: 'g', p: 3.5, c: 23.6, f: 11.0, kcal: 207, baseQty: 100, keys: ['ice cream', 'vanilla ice cream', 'kulfi'] },
  cake_sponge:      { name: 'Sponge Cake', unit: 'g', p: 5.0, c: 45.0, f: 10.0, kcal: 290, baseQty: 100, keys: ['cake', 'sponge cake', 'birthday cake'] },
  brownie:          { name: 'Brownie', unit: 'piece', p: 4.0, c: 32.0, f: 12.0, kcal: 245, baseQty: 1, keys: ['brownie', 'brownies', 'chocolate brownie'] },
  cookie:           { name: 'Chocolate Chip Cookie', unit: 'piece', p: 2.0, c: 18.0, f: 7.0, kcal: 142, baseQty: 1, keys: ['cookie', 'cookies', 'biscuit cookies'] },
  mithai:           { name: 'Mixed Indian Sweets', unit: 'g', p: 4.5, c: 55.0, f: 15.0, kcal: 375, baseQty: 100, keys: ['mithai', 'sweets', 'indian sweets'] },
  payasam:          { name: 'Payasam / Kheer', unit: 'g', p: 4.0, c: 20.0, f: 5.0, kcal: 140, baseQty: 100, keys: ['payasam'] },

  // ═══════════════════════════════════════════════════════
  // BEVERAGES
  // ═══════════════════════════════════════════════════════

  tea_black:        { name: 'Black Tea (Unsweetened)', unit: 'ml', p: 0, c: 0.2, f: 0, kcal: 1, baseQty: 100, keys: ['black tea', 'tea without milk', 'chai without milk'] },
  tea_milk:         { name: 'Chai (With Milk & Sugar)', unit: 'ml', p: 0.9, c: 5.5, f: 1.0, kcal: 37, baseQty: 100, keys: ['chai', 'tea', 'milk tea', 'masala chai'] },
  coffee_black:     { name: 'Black Coffee', unit: 'ml', p: 0.3, c: 0, f: 0, kcal: 2, baseQty: 100, keys: ['black coffee', 'espresso', 'americano'] },
  coffee_latte:     { name: 'Latte (Full Milk)', unit: 'ml', p: 2.0, c: 4.0, f: 1.5, kcal: 50, baseQty: 100, keys: ['latte', 'cafe latte', 'coffee latte'] },
  coffee_cappuccino:{ name: 'Cappuccino', unit: 'ml', p: 1.5, c: 3.5, f: 1.5, kcal: 40, baseQty: 100, keys: ['cappuccino'] },
  orange_juice:     { name: 'Orange Juice (Fresh)', unit: 'ml', p: 0.7, c: 10.4, f: 0.2, kcal: 45, baseQty: 100, keys: ['orange juice', 'oj', 'mosambi juice', 'sweet lime juice'] },
  apple_juice:      { name: 'Apple Juice', unit: 'ml', p: 0.1, c: 11.3, f: 0.1, kcal: 46, baseQty: 100, keys: ['apple juice'] },
  mango_juice:      { name: 'Mango Juice / Aamras', unit: 'ml', p: 0.5, c: 15.0, f: 0.2, kcal: 60, baseQty: 100, keys: ['mango juice', 'aamras', 'mango shake'] },
  sugarcane_juice:  { name: 'Sugarcane Juice / Ganna Ras', unit: 'ml', p: 0.2, c: 13.0, f: 0.1, kcal: 54, baseQty: 100, keys: ['sugarcane juice', 'ganna', 'ganna ras', 'ganne ka ras'] },
  water:            { name: 'Water', unit: 'ml', p: 0, c: 0, f: 0, kcal: 0, baseQty: 100, keys: ['water', 'paani', 'pani'] },
  cola:             { name: 'Cola (Coke/Pepsi)', unit: 'ml', p: 0, c: 10.6, f: 0, kcal: 42, baseQty: 100, keys: ['coke', 'cola', 'pepsi', 'cold drink', 'soda'] },
  beer:             { name: 'Beer', unit: 'ml', p: 0.5, c: 3.6, f: 0, kcal: 43, baseQty: 100, keys: ['beer'] },
  protein_shake:    { name: 'Protein Shake (ready-made)', unit: 'ml', p: 20.0, c: 10.0, f: 2.5, kcal: 143, baseQty: 100, keys: ['protein shake', 'ready made protein'] },

  // ═══════════════════════════════════════════════════════
  // CONDIMENTS & SAUCES
  // ═══════════════════════════════════════════════════════

  sugar:            { name: 'Sugar', unit: 'g', p: 0, c: 100, f: 0, kcal: 387, baseQty: 100, keys: ['sugar', 'cheeni', 'chini'] },
  honey:            { name: 'Honey', unit: 'g', p: 0.3, c: 82.4, f: 0, kcal: 304, baseQty: 100, keys: ['honey', 'shahad', 'shehad'] },
  ketchup:          { name: 'Tomato Ketchup', unit: 'g', p: 1.0, c: 25.0, f: 0.1, kcal: 112, baseQty: 100, keys: ['ketchup', 'tomato ketchup', 'tomato sauce'] },
  mayonnaise:       { name: 'Mayonnaise', unit: 'g', p: 1.1, c: 0.6, f: 79.4, kcal: 680, baseQty: 100, keys: ['mayonnaise', 'mayo'] },
  chutney_mint:     { name: 'Mint Chutney', unit: 'g', p: 1.5, c: 5.0, f: 0.5, kcal: 31, baseQty: 100, keys: ['mint chutney', 'pudina chutney', 'green chutney'] },
  chutney_tamarind: { name: 'Tamarind Chutney', unit: 'g', p: 0.5, c: 18.0, f: 0.2, kcal: 74, baseQty: 100, keys: ['tamarind chutney', 'imli chutney', 'date chutney'] },
  soy_sauce:        { name: 'Soy Sauce', unit: 'ml', p: 8.1, c: 8.0, f: 0.1, kcal: 60, baseQty: 100, keys: ['soy sauce', 'soya sauce'] },
  coconut_milk:     { name: 'Coconut Milk', unit: 'ml', p: 2.3, c: 6.0, f: 24.0, kcal: 230, baseQty: 100, keys: ['coconut milk', 'nariyal doodh'] },
  besan:            { name: 'Besan / Chickpea Flour', unit: 'g', p: 22.0, c: 57.6, f: 5.6, kcal: 387, baseQty: 100, keys: ['besan', 'chickpea flour', 'gram flour'] },
  rice_flour:       { name: 'Rice Flour', unit: 'g', p: 6.0, c: 80.1, f: 1.4, kcal: 366, baseQty: 100, keys: ['rice flour', 'chawal ka atta'] },

  // ═══════════════════════════════════════════════════════
  // BREAKFAST ITEMS
  // ═══════════════════════════════════════════════════════

  cornflakes:       { name: 'Cornflakes (Cereal)', unit: 'g', p: 8.0, c: 84.0, f: 0.9, kcal: 357, baseQty: 100, keys: ['cornflakes', 'corn flakes'] },
  muesli:           { name: 'Muesli', unit: 'g', p: 10.0, c: 62.0, f: 6.0, kcal: 350, baseQty: 100, keys: ['muesli', 'granola'] },
  granola:          { name: 'Granola', unit: 'g', p: 8.0, c: 65.0, f: 7.0, kcal: 380, baseQty: 100, keys: ['granola bar'] },
  cereal:           { name: 'Mixed Cereal', unit: 'g', p: 8.0, c: 80.0, f: 1.5, kcal: 370, baseQty: 100, keys: ['cereal', 'breakfast cereal'] },
};

/**
 * Build search index: keyword → key in FOOD_DB
 * Multiple synonyms per food all map to the same entry.
 */
export const FOOD_INDEX = (() => {
  const index = {};
  for (const [key, food] of Object.entries(FOOD_DB)) {
    // primary key as keyword
    const primary = key.replace(/_/g, ' ');
    index[primary] = key;
    // named keywords from "keys" array
    if (food.keys) {
      food.keys.forEach((kw) => { index[kw.toLowerCase()] = key; });
    }
    // name itself
    index[food.name.toLowerCase()] = key;
  }
  return index;
})();

/**
 * Parse a free-form food string and return macro totals.
 * Handles: "100g paneer", "2 eggs", "50gm rice", "1 scoop whey",
 *          "2 cups oats", "1 katori dal", "300ml milk"
 */
export function parseNaturalInput(text) {
  if (!text || !text.trim()) return [];

  // Unit conversions to grams/ml
  const UNIT_MAP = {
    gm: 1, g: 1, gr: 1, gram: 1, grams: 1,
    ml: 1, milliliter: 1, millilitre: 1, milli: 1,
    kg: 1000, kilogram: 1,
    l: 1000, liter: 1, litre: 1,
    cup: 240, cups: 240,
    katori: 150, bowl: 250, bowls: 250,
    tbsp: 15, tsp: 5, tablespoon: 15, teaspoon: 5,
    piece: 1, pieces: 1, pcs: 1, pc: 1,
    slice: 1, slices: 1,
    scoop: 1, scoops: 1,
    stick: 1, sticks: 1,
    leaf: 1, leaves: 1,
    handful: 30,
    serving: 1,
  };

  // Foods where unit conversion makes sense (non-count)
  const WEIGHT_UNITS = ['gm','g','gr','gram','grams','ml','milliliter','millilitre','milli','kg','kilogram','l','liter','litre','cup','cups','katori','bowl','bowls','tbsp','tsp','tablespoon','teaspoon','handful'];

  const items = text.split(/[,\n;]+/).map(s => s.trim()).filter(Boolean);
  const results = [];

  items.forEach((rawItem) => {
    const item = rawItem.toLowerCase().trim();

    // Extract number + optional unit from the start or anywhere
    // Patterns: "100g paneer", "paneer 100g", "2 eggs", "1.5 scoop whey"
    const numUnitPattern = /(\d+(?:\.\d+)?)\s*(gm|grams?|gr|kg|ml|l(?:iter)?(?:re)?|millilitre?s?|cups?|katori|bowls?|tbsps?|tsps?|tablespoons?|teaspoons?|pieces?|pcs?|pc|scoops?|sticks?|leaves?|leaf|slices?|handful|servings?)?/gi;

    let quantity = null;
    let unit = null;
    let foodText = item;

    const matches = [...item.matchAll(numUnitPattern)];
    if (matches.length > 0) {
      const m = matches[0];
      quantity = parseFloat(m[1]);
      unit = (m[2] || '').toLowerCase().replace(/s$/, ''); // singularize
      // Remove the number+unit from the food text to isolate food name
      foodText = item.replace(m[0], '').trim().replace(/^(of|for|with)\s+/i, '').trim();
    }

    // Try to find the food in the index (longest match first)
    let matchedKey = null;

    // Try increasingly shorter substrings of foodText
    const foodWords = foodText.split(/\s+/);
    for (let len = foodWords.length; len >= 1; len--) {
      for (let start = 0; start <= foodWords.length - len; start++) {
        const candidate = foodWords.slice(start, start + len).join(' ');
        if (FOOD_INDEX[candidate]) {
          matchedKey = FOOD_INDEX[candidate];
          break;
        }
      }
      if (matchedKey) break;
    }

    // Also try full original item if still not found
    if (!matchedKey) {
      for (const [kw, key] of Object.entries(FOOD_INDEX)) {
        if (item.includes(kw)) {
          matchedKey = key;
          break;
        }
      }
    }

    if (!matchedKey) return; // unrecognized food, skip

    const food = FOOD_DB[matchedKey];

    // Determine effective quantity in base units
    let effectiveQty = quantity ?? food.baseQty;

    // Handle unit conversion
    if (unit && WEIGHT_UNITS.includes(unit)) {
      const multiplierToBase = UNIT_MAP[unit] || 1;
      // If food is per 100g and user gave cups/katori → convert
      effectiveQty = quantity * multiplierToBase;
    } else if (unit && UNIT_MAP[unit]) {
      effectiveQty = quantity * UNIT_MAP[unit];
    }

    const ratio = effectiveQty / food.baseQty;
    results.push({
      raw: rawItem,
      name: food.name,
      amount: effectiveQty,
      unit: food.unit,
      protein:  parseFloat((food.p  * ratio).toFixed(1)),
      carbs:    parseFloat((food.c  * ratio).toFixed(1)),
      fats:     parseFloat((food.f  * ratio).toFixed(1)),
      kcal:     Math.round(food.kcal * ratio),
    });
  });

  return results;
}
