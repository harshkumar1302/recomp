import { motion, AnimatePresence } from 'framer-motion';
import { Home, BarChart3, Settings, Dumbbell } from 'lucide-react';

const tabs = [
  { id: 'today',     label: 'Today',     icon: Home,      emoji: '🌟' },
  { id: 'dashboard', label: 'Stats',      icon: BarChart3, emoji: '📊' },
  { id: 'body',      label: 'Body',       icon: Dumbbell,  emoji: '💪' },
  { id: 'settings',  label: 'Settings',   icon: Settings,  emoji: '⚙️' },
];

export default function BottomNav({ activeTab, onTabChange }) {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50"
      style={{
        background: 'rgba(9, 9, 11, 0.85)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderTop: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <div className="max-w-lg mx-auto flex items-center justify-around px-2 pt-2 pb-[env(safe-area-inset-bottom,8px)]">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className="relative flex flex-col items-center justify-center gap-1 min-w-[64px] py-2 px-3 rounded-2xl cursor-pointer select-none"
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              {/* Active background pill */}
              {isActive && (
                <motion.div
                  layoutId="navPill"
                  className="absolute inset-0 rounded-2xl"
                  style={{
                    background: 'linear-gradient(135deg, rgba(16,185,129,0.18), rgba(16,185,129,0.06))',
                    border: '1px solid rgba(16,185,129,0.2)',
                  }}
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                />
              )}

              {/* Icon with micro-bounce */}
              <motion.div
                animate={isActive ? { y: -2, scale: 1.1 } : { y: 0, scale: 1 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                className="relative z-10"
              >
                <Icon
                  size={20}
                  strokeWidth={isActive ? 2.5 : 1.8}
                  style={{
                    color: isActive ? '#10b981' : '#52525b',
                    filter: isActive ? 'drop-shadow(0 0 8px rgba(16,185,129,0.5))' : 'none',
                    transition: 'color 0.2s, filter 0.2s',
                  }}
                />
              </motion.div>

              {/* Label */}
              <span
                className="relative z-10 text-[10px] font-semibold tracking-wide transition-all duration-200"
                style={{ color: isActive ? '#10b981' : '#52525b' }}
              >
                {tab.label}
              </span>

              {/* Active dot */}
              <AnimatePresence>
                {isActive && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -bottom-0.5 w-1 h-1 rounded-full bg-emerald-400"
                  />
                )}
              </AnimatePresence>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
