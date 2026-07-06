import { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '../db/db';
import { getToday } from '../utils/helpers';
import { parseQuantity, formatNumber } from '../utils/numberFormatters';
import {
  Calculator, Trash2, Sparkles, Search, Plus, X,
  AlertTriangle, Camera, Loader2, ImageIcon, CheckCircle2,
} from 'lucide-react';
import Tesseract from 'tesseract.js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { FOOD_DB, FOOD_INDEX } from '../db/foodDatabase';

/* ─────────────────────────────────────────────────────────────── */
/* Confirm Dialog                                                  */
/* ─────────────────────────────────────────────────────────────── */
function ConfirmDialog({ message, onConfirm, onCancel }) {
  return (
    <motion.div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-sm"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onCancel}
    >
      <motion.div
        className="glass-card rounded-2xl p-5 mx-4 max-w-xs w-full border border-zinc-700 shadow-2xl"
        initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-3 mb-4">
          <div className="w-8 h-8 rounded-xl bg-red-500/15 flex items-center justify-center shrink-0 mt-0.5">
            <AlertTriangle size={16} className="text-red-400" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">Are you sure?</p>
            <p className="text-xs text-zinc-400 mt-1">{message}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={onCancel} className="flex-1 py-2 rounded-xl bg-zinc-800 border border-zinc-700 text-zinc-300 text-xs font-semibold hover:bg-zinc-700 transition-colors cursor-pointer">Cancel</button>
          <button onClick={onConfirm} className="flex-1 py-2 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 text-xs font-semibold hover:bg-red-500/30 transition-colors cursor-pointer">Delete</button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────── */
/* OCR Scan Modal                                                  */
/* ─────────────────────────────────────────────────────────────── */
function ScanModal({ imageUrl, isScanning, scanned, onConfirm, onClose }) {
  const [form, setForm] = useState({
    name: scanned.name || 'Scanned Item',
    kcal: scanned.kcal ?? '',
    protein: scanned.protein ?? '',
    carbs: scanned.carbs ?? '',
    fats: scanned.fats ?? '',
  });

  // Sync when OCR finishes (isScanning goes false)
  useEffect(() => {
    if (!isScanning) {
      setForm({
        name: scanned.name || 'Scanned Item',
        kcal: scanned.kcal ?? '',
        protein: scanned.protein ?? '',
        carbs: scanned.carbs ?? '',
        fats: scanned.fats ?? '',
      });
    }
  }, [isScanning, scanned]);

  function field(id, label, color) {
    return (
      <div className="flex flex-col gap-1">
        <label className={`text-[10px] font-bold uppercase tracking-wider ${color}`}>{label}</label>
        <input
          type="number"
          min="0"
          value={form[id]}
          onChange={(e) => setForm(p => ({ ...p, [id]: e.target.value }))}
          className="bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          placeholder="0"
        />
      </div>
    );
  }

  return (
    <motion.div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="glass-card rounded-3xl w-full max-w-sm border border-zinc-700 shadow-2xl overflow-hidden"
        initial={{ scale: 0.92, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.92, y: 20, opacity: 0 }}
        transition={{ type: 'spring', damping: 26, stiffness: 320 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image Preview */}
        <div className="relative w-full h-44 bg-zinc-900 overflow-hidden">
          <img src={imageUrl} alt="Scanned label" className="w-full h-full object-contain" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60" />
          <button onClick={onClose} className="absolute top-3 right-3 w-7 h-7 bg-black/60 rounded-full flex items-center justify-center text-zinc-300 hover:text-white cursor-pointer">
            <X size={14} />
          </button>
          {isScanning && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60">
              <Loader2 size={28} className="animate-spin text-emerald-400 mb-2" />
              <p className="text-xs text-zinc-300 font-medium">Reading nutrition label…</p>
            </div>
          )}
        </div>

        <div className="p-5 space-y-4">
          {/* Header */}
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-emerald-500/15 flex items-center justify-center">
              <ImageIcon size={14} className="text-emerald-400" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">
                {isScanning ? 'Scanning…' : 'Review Scanned Macros'}
              </p>
              <p className="text-[10px] text-zinc-500">Edit any value before adding</p>
            </div>
          </div>

          {/* Name */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Food Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm(p => ({ ...p, name: e.target.value }))}
              className="bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
              placeholder="Food name…"
            />
          </div>

          {/* Macro Fields */}
          <div className="grid grid-cols-2 gap-3">
            {field('kcal',    'Calories (kcal)', 'text-emerald-400')}
            {field('protein', 'Protein (g)',     'text-cyan-400')}
            {field('carbs',   'Carbs (g)',       'text-amber-400')}
            {field('fats',    'Fats (g)',        'text-purple-400')}
          </div>

          {/* Action buttons */}
          <div className="flex gap-2 pt-1">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl bg-zinc-800 border border-zinc-700 text-zinc-400 text-xs font-semibold hover:text-white transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              disabled={isScanning}
              onClick={() => onConfirm(form)}
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-xs font-bold flex items-center justify-center gap-1.5 disabled:opacity-40 cursor-pointer"
            >
              <CheckCircle2 size={13} />
              Add to Meal
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────── */
/* OCR Parsing Helper                                              */
/* ─────────────────────────────────────────────────────────────── */
function parseNutritionText(raw) {
  const lines = raw.split('\n').map(l => l.trim()).filter(Boolean);
  const text = lines.join(' ');
  const lower = text.toLowerCase();

  // Extract a number near a keyword
  function near(keywords, txt, rawTxt) {
    for (const kw of keywords) {
      // "24 g keyword", "24.5g keyword", "24 keyword"
      let m = rawTxt.match(new RegExp(`(\\d+\\.?\\d*)\\s*(?:g|mcg|mg|kcal|cal)?\\s*${kw}`, 'i'));
      if (m) return parseFloat(m[1]);
      // "keyword 24 g", "keyword: 24.5"
      m = rawTxt.match(new RegExp(`${kw}[\\s:]*([\\d.]+)`, 'i'));
      if (m) return parseFloat(m[1]);
    }
    return 0;
  }

  const kcal    = near(['calories', 'energy', 'kcal', 'cal'], lower, text);
  const protein = near(['protein'],                            lower, text);
  const carbs   = near(['carb', 'carbohydrate', 'carbohydrates'], lower, text);
  const fats    = near(['fat', 'fats'],                       lower, text);

  // Try to find the dish title
  let name = 'Scanned Item';
  for (const line of lines) {
    // Skip common Swiggy/Zomato category headers
    if (/best in|recommended|must try|bestseller|highly reordered/i.test(line)) continue;
    // Skip if it's just numbers or very short
    if (line.length < 4 || /^[\d\s]+$/.test(line)) continue;
    // Assume first valid line is the title
    name = line.slice(0, 50);
    break;
  }

  return { name, kcal, protein, carbs, fats };
}


/* ─────────────────────────────────────────────────────────────── */
/* Main Calculator                                                 */
/* ─────────────────────────────────────────────────────────────── */
export default function MacroCalculator() {
  const today = getToday();

  // Search
  const [query, setQuery]             = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef  = useRef(null);
  const fileInputRef = useRef(null);

  // Cart
  const [selectedItems, setSelectedItems] = useState([]);
  // Tracks the raw string the user is typing in each qty input (keyed by item id)
  const [qtyInputs, setQtyInputs] = useState({});

  // Logged macros
  const [loggedMacros, setLoggedMacros] = useState(null);

  // Confirm dialog
  const [confirmState, setConfirmState] = useState(null);

  // Image scan state
  const [scanModal, setScanModal] = useState(null);
  // { imageUrl, isScanning, scanned }

  // Gemini Key State
  const [geminiKey, setGeminiKey] = useState(() => localStorage.getItem('gemini_api_key') || '');
  const [showKeyInput, setShowKeyInput] = useState(false);

  function saveGeminiKey(key) {
    setGeminiKey(key);
    localStorage.setItem('gemini_api_key', key);
  }

  useEffect(() => {
    async function loadToday() {
      try {
        const log = await db.macroLogs.get(today);
        if (log) setLoggedMacros(log);
      } catch (err) {
        console.error('Failed to load today macros:', err);
      }
    }
    loadToday();
  }, [today]);

  // Close suggestions on outside click
  useEffect(() => {
    function handler(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Autocomplete
  useEffect(() => {
    if (!query.trim() || query.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    const q = query.toLowerCase();
    const seen = new Set();
    const matches = [];
    for (const [kw, key] of Object.entries(FOOD_INDEX)) {
      if (kw.includes(q) && !seen.has(key)) {
        seen.add(key);
        matches.push({ key, food: FOOD_DB[key] });
        if (matches.length >= 10) break;
      }
    }
    setSuggestions(matches);
    setShowSuggestions(matches.length > 0);
  }, [query]);

  /* ── Image Upload ───────────────────────────── */
  async function handleImageUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    const imageUrl = URL.createObjectURL(file);

    // Open modal immediately — show spinner while OCR runs
    setScanModal({ imageUrl, isScanning: true, scanned: {} });

    // 1. Try Gemini Vision if API key exists
    if (geminiKey) {
      try {
        const genAI = new GoogleGenerativeAI(geminiKey);
        const model = genAI.getGenerativeModel({ 
          model: "gemini-1.5-flash",
          generationConfig: { responseMimeType: "application/json" }
        });

        const base64Data = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result.split(',')[1]);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });

        const prompt = `Analyze this image. If it's a nutrition label or a screenshot of nutrition facts, extract the exact macros. If it's a photo of food, identify the dish and estimate the macros for a standard serving.
Return ONLY a raw JSON object with NO markdown formatting, NO backticks, and NO extra text. The JSON must have these exact keys:
{
  "name": "Food Name or Dish Name",
  "kcal": 0,
  "protein": 0,
  "carbs": 0,
  "fats": 0
}
Replace the 0s with the numeric values in grams/kcal.`;

        const imagePart = { inlineData: { data: base64Data, mimeType: file.type } };
        const result = await model.generateContent([prompt, imagePart]);
        const responseText = result.response.text();
        const cleaned = responseText.replace(/```json/gi, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(cleaned);

        setScanModal({ imageUrl, isScanning: false, scanned: parsed });
        if (fileInputRef.current) fileInputRef.current.value = '';
        return; // Success, skip Tesseract
      } catch (err) {
        console.error('Gemini Vision Error:', err);
        alert('Gemini AI failed to process the image: ' + err.message);
        setScanModal({ imageUrl, isScanning: false, scanned: {} });
        if (fileInputRef.current) fileInputRef.current.value = '';
        return; // Stop here, don't fall back to Tesseract if they explicitly provided a key
      }
    }

    // 2. Fallback to Local Tesseract OCR (Only if NO Gemini Key)
    let worker = null;
    try {
      worker = await Tesseract.createWorker('eng', 1, {
        logger: () => {},
      });
      // PSM 6: Assume a single uniform block of text. 
      // Prevents Tesseract from splitting horizontal rows into separate vertical columns.
      await worker.setParameters({
        tessedit_pageseg_mode: 6,
      });
      const result = await worker.recognize(file);
      const parsed = parseNutritionText(result.data.text);
      setScanModal({ imageUrl, isScanning: false, scanned: parsed });
    } catch (err) {
      console.error('OCR Error:', err);
      setScanModal({ imageUrl, isScanning: false, scanned: {} });
    } finally {
      if (worker) await worker.terminate();
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }

  function confirmScan(form) {
    const food = {
      name: form.name || 'Scanned Item',
      baseQty: 1,
      unit: 'serving',
      kcal: parseFloat(form.kcal) || 0,
      p:    parseFloat(form.protein) || 0,
      c:    parseFloat(form.carbs) || 0,
      f:    parseFloat(form.fats) || 0,
    };
    const newItem = { id: `scanned_${Date.now()}`, key: 'scanned', food, qty: 1, unit: 'serving' };
    setSelectedItems(prev => [...prev, newItem]);
    setQtyInputs(prev => ({ ...prev, [newItem.id]: '1' }));
    setScanModal(null);
  }

  /* ── Food selection ──────────────────────────── */
  function addFood({ key, food }) {
    const newItem = { id: `${key}_${Date.now()}`, key, food, qty: food.baseQty, unit: food.unit };
    setSelectedItems(prev => [...prev, newItem]);
    setQtyInputs(prev => ({ ...prev, [newItem.id]: String(food.baseQty) }));
    setQuery('');
    setShowSuggestions(false);
  }

  // Called on every keystroke — only updates the displayed string, not the real qty
  function handleQtyChange(id, raw) {
    setQtyInputs(prev => ({ ...prev, [id]: raw }));
  }

  // Called on blur or Enter — commits the numeric value (or resets to previous)
  function commitQty(id) {
    setQtyInputs(prev => {
      const raw = prev[id] ?? '';
      const num = parseQuantity(raw);
      if (!isNaN(num) && num >= 0) {
        setSelectedItems(items =>
          items.map(item => item.id === id ? { ...item, qty: num } : item)
        );
        return { ...prev, [id]: String(num) };
      } else {
        // revert display to the current committed qty
        const current = selectedItems.find(i => i.id === id)?.qty ?? 1;
        return { ...prev, [id]: String(current) };
      }
    });
  }

  function askDeleteItem(id) { setConfirmState({ type: 'item', id }); }
  function confirmDeleteItem() {
    if (!confirmState) return;
    setSelectedItems(prev => prev.filter(item => item.id !== confirmState.id));
    setQtyInputs(prev => { const n = { ...prev }; delete n[confirmState.id]; return n; });
    setConfirmState(null);
  }

  function askReset() { setConfirmState({ type: 'reset' }); }
  async function confirmReset() {
    try {
      await db.macroLogs.delete(today);
      setLoggedMacros(null);
      setSelectedItems([]);
      setQtyInputs({});
    } catch (err) {
      console.error('Failed to reset macros:', err);
      alert('Failed to reset macros. Please try again.');
    } finally {
      setConfirmState(null);
    }
  }

  /* ── Computed macros ─────────────────────────── */
  // Uses the LIVE qtyInputs string so the preview updates every keystroke,
  // not just after blur. Falls back to committed item.qty if the string is empty/invalid.
  const computedItems = useMemo(() =>
    selectedItems.map(item => {
      const liveStr = qtyInputs[item.id];
      const liveNum = liveStr !== undefined ? parseQuantity(liveStr) : NaN;
      const effectiveQty = (!isNaN(liveNum) && liveNum >= 0) ? liveNum : item.qty;
      const ratio = effectiveQty / item.food.baseQty;
      return {
        ...item,
        effectiveQty,
        protein: parseFloat((item.food.p * ratio).toFixed(1)),
        carbs:   parseFloat((item.food.c * ratio).toFixed(1)),
        fats:    parseFloat((item.food.f * ratio).toFixed(1)),
        kcal:    Math.round(item.food.kcal * ratio),
      };
    }),
  [selectedItems, qtyInputs]);

  const totals = useMemo(() => {
    let p = 0, c = 0, f = 0, cal = 0;
    computedItems.forEach(i => { p += i.protein; c += i.carbs; f += i.fats; cal += i.kcal; });
    return {
      protein:  parseFloat(p.toFixed(1)),
      carbs:    parseFloat(c.toFixed(1)),
      fats:     parseFloat(f.toFixed(1)),
      calories: cal,
    };
  }, [computedItems]);

  async function handleLog() {
    if (computedItems.length === 0) return;
    // First commit any still-focused qty inputs so nothing is missed
    const committedItems = selectedItems.map(item => {
      const liveStr = qtyInputs[item.id];
      const liveNum = liveStr !== undefined ? parseQuantity(liveStr) : NaN;
      const effectiveQty = (!isNaN(liveNum) && liveNum >= 0) ? liveNum : item.qty;
      return { ...item, qty: effectiveQty };
    });
    let p = 0, c = 0, f = 0, cal = 0;
    committedItems.forEach(item => {
      const ratio = item.qty / item.food.baseQty;
      p   += item.food.p    * ratio;
      c   += item.food.c    * ratio;
      f   += item.food.f    * ratio;
      cal += item.food.kcal * ratio;
    });
    const snap = {
      protein:  parseFloat(p.toFixed(1)),
      carbs:    parseFloat(c.toFixed(1)),
      fats:     parseFloat(f.toFixed(1)),
      calories: Math.round(cal),
    };
    try {
      const existing = await db.macroLogs.get(today);
      const entry = {
        date:     today,
        protein:  parseFloat((snap.protein  + (existing?.protein  || 0)).toFixed(1)),
        carbs:    parseFloat((snap.carbs    + (existing?.carbs    || 0)).toFixed(1)),
        fats:     parseFloat((snap.fats     + (existing?.fats     || 0)).toFixed(1)),
        calories: Math.round(snap.calories  + (existing?.calories || 0)),
      };
      await db.macroLogs.put(entry);
      setLoggedMacros(entry);
      setSelectedItems([]);
      setQtyInputs({});
    } catch (err) {
      console.error('Failed to log macros:', err);
      alert('Failed to log macros. Please try again.');
    }
  }

  const totalFoodsCount = Object.keys(FOOD_DB).length;

  return (
    <>
      {/* Confirm Dialog */}
      <AnimatePresence>
        {confirmState && (
          <ConfirmDialog
            message={confirmState.type === 'reset'
              ? "This will clear all of today's logged macros permanently."
              : "Remove this food item from your meal?"}
            onConfirm={confirmState.type === 'reset' ? confirmReset : confirmDeleteItem}
            onCancel={() => setConfirmState(null)}
          />
        )}
      </AnimatePresence>

      {/* Scan Modal */}
      <AnimatePresence>
        {scanModal && (
          <ScanModal
            imageUrl={scanModal.imageUrl}
            isScanning={scanModal.isScanning}
            scanned={scanModal.scanned}
            onConfirm={confirmScan}
            onClose={() => setScanModal(null)}
          />
        )}
      </AnimatePresence>

      <div className="space-y-4">
        {/* ── Calculator Card ── */}
        <div className="glass-card rounded-2xl p-4 space-y-3 relative z-20">

          {/* Header */}
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
              <Calculator size={14} className="text-emerald-400" />
              Hinglish Macro Calculator
            </h3>
            <span className="text-[10px] text-zinc-600 flex items-center gap-1">
              <Sparkles size={9} className="text-emerald-600" />
              {totalFoodsCount}+ foods
            </span>
          </div>

          {/* Search Box */}
          <div className="relative" ref={searchRef}>
            <div className="flex items-center gap-2 bg-zinc-900/60 border border-zinc-800 rounded-xl px-3 py-2.5 focus-within:border-emerald-500 transition-colors">
              <Search size={13} className="text-zinc-600 shrink-0" />
              <input
                type="text"
                value={query}
                onChange={(e) => { setQuery(e.target.value); setShowSuggestions(true); }}
                onFocus={() => query.length >= 2 && setShowSuggestions(true)}
                placeholder="Search any food item…"
                className="flex-1 bg-transparent text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none"
              />
              {query && (
                <button onClick={() => { setQuery(''); setShowSuggestions(false); }} className="text-zinc-600 hover:text-zinc-400 cursor-pointer">
                  <X size={13} />
                </button>
              )}

              <div className="w-px h-4 bg-zinc-800 mx-0.5" />

              {/* Camera / OCR Button */}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={fileInputRef}
                onChange={handleImageUpload}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="text-zinc-500 hover:text-emerald-400 cursor-pointer transition-colors"
                title="Scan Nutrition Label from image"
              >
                <Camera size={14} />
              </button>
            </div>

            {/* Dropdown — food names only */}
            <AnimatePresence>
              {showSuggestions && suggestions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -6, scaleY: 0.95 }}
                  animate={{ opacity: 1, y: 0, scaleY: 1 }}
                  exit={{ opacity: 0, y: -6, scaleY: 0.95 }}
                  style={{ transformOrigin: 'top', background: '#111113' }}
                  className="absolute top-full mt-1.5 left-0 right-0 z-50 rounded-xl overflow-hidden shadow-2xl border border-zinc-800"
                >
                  {suggestions.map(({ key, food }) => (
                    <button
                      key={key}
                      onMouseDown={(e) => { e.preventDefault(); addFood({ key, food }); }}
                      className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-left hover:bg-emerald-500/10 transition-colors border-b border-zinc-800/40 last:border-0 cursor-pointer"
                    >
                      <Plus size={12} className="text-emerald-500 shrink-0" />
                      <span className="text-zinc-100 font-medium">{food.name}</span>
                      <span className="text-zinc-600 text-[11px] ml-auto shrink-0">
                        per {food.baseQty}{food.unit}
                      </span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Selected Items */}
          <AnimatePresence>
            {selectedItems.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-2 overflow-hidden"
              >
                <p className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold">
                  Meal items — adjust quantities
                </p>

                <div className="space-y-2 max-h-64 overflow-y-auto pr-0.5">
                  {computedItems.map((item, idx) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 8 }}
                      transition={{ delay: idx * 0.03 }}
                      className="rounded-xl border border-zinc-800 bg-zinc-900/60 overflow-hidden"
                    >
                      <div className="flex items-center justify-between px-3 pt-2.5 pb-1">
                        <span className="text-sm font-semibold text-zinc-100">{item.food.name}</span>
                        <button
                          onClick={() => askDeleteItem(item.id)}
                          className="p-1 rounded-lg hover:bg-red-500/15 text-zinc-600 hover:text-red-400 transition-colors cursor-pointer"
                        >
                          <X size={13} />
                        </button>
                      </div>
                      <div className="flex items-center gap-2 px-3 pb-2">
                        <div className="flex items-center gap-1.5 flex-1 bg-zinc-800/60 border border-zinc-700/60 rounded-lg px-2.5 py-1.5 focus-within:border-emerald-500/60 transition-colors">
                          <input
                            type="text" inputMode="decimal"
                            value={qtyInputs[item.id] ?? String(item.qty)}
                            onChange={(e) => handleQtyChange(item.id, e.target.value)}
                            onBlur={() => commitQty(item.id)}
                            onKeyDown={(e) => { if (e.key === 'Enter') { e.target.blur(); } }}
                            className="w-16 bg-transparent text-sm text-white font-semibold focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          />
                          <span className="text-xs text-zinc-500">{item.food.unit}</span>
                        </div>
                        <div className="flex gap-1.5 text-[11px] shrink-0 min-w-0">
                          <span className="text-cyan-400 font-medium truncate flex gap-0.5"><span className="opacity-70">P:</span>{formatNumber(item.protein)}</span>
                          <span className="text-amber-400 font-medium truncate flex gap-0.5"><span className="opacity-70">C:</span>{formatNumber(item.carbs)}</span>
                          <span className="text-purple-400 font-medium truncate flex gap-0.5"><span className="opacity-70">F:</span>{formatNumber(item.fats)}</span>
                          <span className="text-emerald-400 font-bold truncate flex gap-0.5"><span className="opacity-70">🔥</span>{formatNumber(item.kcal)}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Totals */}
                <div className="grid grid-cols-4 gap-1.5 pt-0.5">
                  {[
                    { label: 'PROTEIN (g)', val: formatNumber(totals.protein), color: 'text-cyan-400' },
                    { label: 'CARBS (g)',   val: formatNumber(totals.carbs),   color: 'text-amber-400' },
                    { label: 'FATS (g)',    val: formatNumber(totals.fats),    color: 'text-purple-400' },
                    { label: 'KCAL',        val: formatNumber(totals.calories), color: 'text-emerald-400' },
                  ].map((t) => (
                    <div key={t.label} className="bg-zinc-900/70 rounded-xl p-2 text-center border border-zinc-800 min-w-0 overflow-hidden">
                      <p className={`text-xs font-bold ${t.color} truncate`}>{t.val}</p>
                      <p className="text-[9px] text-zinc-600 uppercase tracking-widest mt-0.5 truncate">{t.label}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {selectedItems.length === 0 && (
            <div className="py-2 space-y-1 text-center">
              <p className="text-xs text-zinc-700">Search & add food items above ↑</p>
              <p className="text-[10px] text-zinc-800 flex items-center justify-center gap-1">
                <Camera size={10} className="text-zinc-700" />
                or tap the camera to scan a nutrition label
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={handleLog}
              disabled={selectedItems.length === 0}
              className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold text-xs transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              Log to Today
            </button>
            <button
              onClick={() => { setSelectedItems([]); setQtyInputs({}); }}
              disabled={selectedItems.length === 0}
              className="py-2.5 px-3 rounded-xl bg-zinc-800 border border-zinc-700 text-zinc-400 hover:text-white font-semibold text-xs active:scale-95 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Today's Logged Macros */}
        <AnimatePresence>
          {loggedMacros && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="glass-card rounded-2xl p-4 bg-gradient-to-br from-emerald-950/20 to-zinc-900/60 border border-emerald-500/10"
            >
              <div className="flex items-center justify-between mb-3">
                <p className="text-[10px] uppercase tracking-wider text-emerald-400 font-bold">Today's Registered Macros</p>
                <button
                  onClick={askReset}
                  className="p-1.5 rounded-lg hover:bg-red-500/15 text-red-400/50 hover:text-red-400 transition-all cursor-pointer"
                  title="Reset today's macros"
                >
                  <Trash2 size={13} />
                </button>
              </div>
              <div className="grid grid-cols-4 gap-2 text-center">
                {[
                  { label: 'PROTEIN (g)', val: formatNumber(loggedMacros.protein), color: 'text-cyan-400' },
                  { label: 'CARBS (g)',   val: formatNumber(loggedMacros.carbs),   color: 'text-amber-400' },
                  { label: 'FATS (g)',    val: formatNumber(loggedMacros.fats),    color: 'text-purple-400' },
                  { label: 'KCAL',        val: formatNumber(loggedMacros.calories), color: 'text-emerald-400' },
                ].map((t) => (
                  <div key={t.label} className="bg-zinc-900/50 rounded-xl p-2 border border-zinc-800 min-w-0 overflow-hidden">
                    <p className={`text-[11px] font-bold ${t.color} truncate`}>{t.val}</p>
                    <p className="text-[9px] text-zinc-500 uppercase tracking-widest mt-0.5 truncate">{t.label}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
