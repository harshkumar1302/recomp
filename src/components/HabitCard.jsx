import { motion } from 'framer-motion';
import { getCategoryColor } from '../utils/helpers';

export default function HabitCard({ habit, completed, onToggle, index }) {
  const colors = getCategoryColor(habit.category);

  return (
    <motion.button
      onClick={onToggle}
      className="w-full text-left rounded-2xl p-4 flex items-center gap-4 transition-all duration-200 active:scale-[0.97]"
      style={{
        background: completed ? colors.bg : 'rgba(24, 24, 27, 0.5)',
        border: `1px solid ${completed ? colors.border : 'rgba(255,255,255,0.04)'}`,
      }}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.03 }}
      whileTap={{ scale: 0.97 }}
    >
      {/* Checkbox */}
      <div
        className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-all duration-300"
        style={{
          background: completed ? colors.accent : 'transparent',
          border: completed ? 'none' : '2px solid rgba(255,255,255,0.15)',
          boxShadow: completed ? `0 0 12px ${colors.accent}40` : 'none',
        }}
      >
        {completed && (
          <motion.svg
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            width="14" height="14" viewBox="0 0 14 14" fill="none"
          >
            <path d="M2.5 7L5.5 10L11.5 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </motion.svg>
        )}
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <p
          className={`text-[15px] font-medium transition-all duration-200 ${
            completed ? 'line-through opacity-50' : 'opacity-90'
          }`}
        >
          {habit.name}
        </p>
      </div>

      {/* Category pill */}
      <span
        className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full shrink-0"
        style={{
          color: colors.text,
          background: colors.bg,
          border: `1px solid ${colors.border}`,
        }}
      >
        {habit.category}
      </span>
    </motion.button>
  );
}
