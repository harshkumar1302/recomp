import { motion } from 'framer-motion';
import { Home, BarChart3, Settings, Dumbbell } from 'lucide-react';

const tabs = [
  { id: 'today', label: 'Today', icon: Home },
  { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
  { id: 'body', label: 'Body', icon: Dumbbell },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export default function BottomNav({ activeTab, onTabChange }) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-white/5">
      <div className="max-w-lg mx-auto flex items-center justify-around h-16 px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className="relative flex flex-col items-center justify-center w-16 h-14 rounded-xl transition-colors"
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 rounded-xl"
                  style={{
                    background: 'rgba(16, 185, 129, 0.1)',
                    border: '1px solid rgba(16, 185, 129, 0.15)',
                  }}
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                />
              )}
              <Icon
                size={20}
                className={`relative z-10 transition-colors duration-200 ${
                  isActive ? 'text-emerald-400' : 'text-zinc-500'
                }`}
              />
              <span
                className={`relative z-10 text-[10px] mt-0.5 font-medium tracking-wide transition-colors duration-200 ${
                  isActive ? 'text-emerald-400' : 'text-zinc-500'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
      {/* Safe area padding for notched phones */}
      <div className="h-[env(safe-area-inset-bottom)]" />
    </nav>
  );
}
