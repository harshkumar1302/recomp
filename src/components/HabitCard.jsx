import { motion } from 'framer-motion';
import { getCategoryColor } from '../utils/helpers';

const CATEGORY_EMOJI = {
  body:       '💪',
  skin:       '✨',
  hair:       '💆',
  diet:       '🥗',
  supplement: '💊',
};

export default function HabitCard({ habit, completed, onToggle, index }) {
  const colors = getCategoryColor(habit.category);
  const emoji  = CATEGORY_EMOJI[habit.category] || '📌';

  return (
    <motion.button
      onClick={onToggle}
      className="w-full text-left group relative overflow-hidden"
      style={{
        borderRadius: '16px',
        background: completed
          ? `linear-gradient(135deg, ${colors.bg}, rgba(0,0,0,0.2))`
          : 'rgba(24, 24, 27, 0.55)',
        border: `1px solid ${completed ? colors.border : 'rgba(255,255,255,0.05)'}`,
        backdropFilter: 'blur(12px)',
      }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.04, ease: 'easeOut' }}
      whileTap={{ scale: 0.97 }}
    >
      {/* Shimmer stripe on complete */}
      {completed && (
        <motion.div
          className="absolute inset-y-0 left-0 w-0.5 rounded-full"
          style={{ background: `linear-gradient(to bottom, ${colors.accent}, transparent)` }}
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 0.4 }}
        />
      )}

      <div className="flex items-center gap-3 px-4 py-3.5">
        {/* Check orb */}
        <motion.div
          className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
          style={{
            background: completed ? colors.accent : 'rgba(255,255,255,0.06)',
            border: `1.5px solid ${completed ? 'transparent' : 'rgba(255,255,255,0.12)'}`,
            boxShadow: completed ? `0 0 16px ${colors.accent}50` : 'none',
          }}
          animate={{ scale: completed ? [1, 1.15, 1] : 1 }}
          transition={{ duration: 0.3 }}
        >
          <AnimatePresence mode="wait">
            {completed ? (
              <motion.svg
                key="check"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                width="14" height="14" viewBox="0 0 14 14" fill="none"
              >
                <path d="M2.5 7L5.5 10L11.5 4" stroke="white" strokeWidth="2.2"
                  strokeLinecap="round" strokeLinejoin="round" />
              </motion.svg>
            ) : (
              <motion.span
                key="emoji"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                className="text-xs select-none"
              >
                {emoji}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Name */}
        <div className="flex-1 min-w-0">
          <p
            className="text-sm font-medium leading-snug truncate transition-all duration-300"
            style={{
              color: completed ? 'rgba(255,255,255,0.45)' : 'rgba(255,255,255,0.9)',
              textDecoration: completed ? 'line-through' : 'none',
            }}
          >
            {habit.name}
          </p>
        </div>

        {/* Category badge */}
        <span
          className="shrink-0 text-[9px] uppercase tracking-widest font-bold px-2 py-1 rounded-full"
          style={{
            color: colors.text,
            background: colors.bg,
            border: `1px solid ${colors.border}`,
          }}
        >
          {habit.category}
        </span>
      </div>
    </motion.button>
  );
}

// Need AnimatePresence import
import { AnimatePresence } from 'framer-motion';
