const raw = "Best in No Onion No Garlic\nJain Forbidden Rice Bowl (paneer)\n583 kcal 24g protein 25g fat 66g carbs 8g fibre";
function parseNutritionText(raw) {
  const text = raw.replace(/\n/g, ' ').replace(/\s+/g, ' ');
  const lower = text.toLowerCase();

  // Extract a number near a keyword
  function near(keywords, txt, rawTxt) {
    for (const kw of keywords) {
      let m = rawTxt.match(new RegExp(`(\\d+\\.?\\d*)\\s*g?\\s*${kw}`, 'i'));
      if (m) return parseFloat(m[1]);
      m = rawTxt.match(new RegExp(`${kw}[\\s:]*([\\d.]+)`, 'i'));
      if (m) return parseFloat(m[1]);
    }
    return 0;
  }

  const kcal    = near(['calories', 'energy', 'kcal', 'cal'], lower, text);
  const protein = near(['protein'],                            lower, text);
  const carbs   = near(['carb', 'carbohydrate'],              lower, text);
  const fats    = near(['fat'],                               lower, text);
  
  const titleMatch = raw.match(/^([A-Z][A-Za-z (),&]+)/m);
  const name = titleMatch ? titleMatch[1].trim().slice(0, 50) : 'Scanned Item';

  return { name, kcal, protein, carbs, fats };
}
console.log(parseNutritionText(raw));
