import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Camera, BarChart3, ArrowRight, Check } from 'lucide-react';

const SLIDES = [
  {
    id: 'welcome',
    icon: Sparkles,
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/20',
    title: 'Welcome to Recomp',
    desc: 'The all-in-one tracker designed for those serious about their transformation. Build habits, track nutrition, and monitor body metrics in one place.',
  },
  {
    id: 'nutrition',
    icon: Camera,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
    title: 'Smart Nutrition',
    desc: 'Use the built-in Macro Calculator to snap photos of nutrition labels. Recomp will automatically extract macros using OCR and AI.',
  },
  {
    id: 'habits',
    icon: BarChart3,
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/20',
    title: 'Data-Driven Routines',
    desc: 'Create flexible routines (Daily or Gap days) and watch your adherence heatmap glow as you build unbreakable streaks.',
  },
];

export default function Onboarding({ onComplete }) {
  const [step, setStep] = useState(0);

  const slide = SLIDES[step];
  const Icon = slide.icon;

  function handleNext() {
    if (step < SLIDES.length - 1) {
      setStep((p) => p + 1);
    } else {
      onComplete();
    }
  }

  return (
    <motion.div
      className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.5, ease: 'easeInOut' } }}
    >
      {/* Background ambient glow based on current slide */}
      <motion.div
        className="absolute inset-0 opacity-20 transition-colors duration-700"
        style={{
          background: `radial-gradient(circle at center, ${
            step === 0 ? '#a855f7' : step === 1 ? '#10b981' : '#06b6d4'
          }, transparent 70%)`
        }}
      />

      <div className="relative w-full max-w-sm flex flex-col items-center">
        
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -20, scale: 0.95 }}
            transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
            className="w-full flex flex-col items-center text-center"
          >
            {/* Icon Bubble */}
            <div className={`w-20 h-20 rounded-3xl ${slide.bg} ${slide.border} border-2 flex items-center justify-center mb-8 shadow-2xl relative`}>
              <Icon size={36} className={slide.color} />
              <div className="absolute inset-0 bg-white/5 rounded-3xl" />
            </div>

            <h1 className="text-3xl font-black text-white mb-4 tracking-tight">
              {slide.title}
            </h1>
            <p className="text-zinc-400 text-sm leading-relaxed px-2">
              {slide.desc}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Dots */}
        <div className="flex gap-2 mt-12 mb-8">
          {SLIDES.map((_, idx) => (
            <div
              key={idx}
              className="h-1.5 rounded-full transition-all duration-300"
              style={{
                width: step === idx ? '24px' : '8px',
                background: step === idx ? '#fff' : 'rgba(255,255,255,0.2)',
              }}
            />
          ))}
        </div>

        {/* Action Button */}
        <button
          onClick={handleNext}
          className="w-full py-4 rounded-2xl text-sm font-black text-white shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-2"
          style={{
            background: step === 2 
              ? 'linear-gradient(135deg, #06b6d4, #0ea5e9)'
              : 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
            border: step === 2 ? 'none' : '1px solid rgba(255,255,255,0.1)'
          }}
        >
          {step === 2 ? (
            <>
              Get Started <Check size={18} />
            </>
          ) : (
            <>
              Continue <ArrowRight size={18} />
            </>
          )}
        </button>

      </div>
    </motion.div>
  );
}
