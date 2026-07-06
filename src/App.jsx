import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import BottomNav from './components/BottomNav';
import Today from './pages/Today';
import Dashboard from './pages/Dashboard';
import BodyTracker from './pages/BodyTracker';
import Settings from './pages/Settings';
import { seedDatabase } from './db/seed';

const pageVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.25 } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.15 } },
};

export default function App() {
  const [activeTab, setActiveTab] = useState('today');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    seedDatabase().then(() => setReady(true));
  }, []);

  if (!ready) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#09090b]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
          <p className="text-zinc-500 text-sm animate-pulse">Loading Recomp…</p>
        </div>
      </div>
    );
  }

  function renderPage() {
    switch (activeTab) {
      case 'today':
        return <Today />;
      case 'dashboard':
        return <Dashboard />;
      case 'body':
        return <BodyTracker />;
      case 'settings':
        return <Settings />;
      default:
        return <Today />;
    }
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-white">
      {/* Top Status Bar area */}
      <div className="h-[env(safe-area-inset-top)]" />

      <main className="w-full px-4 pt-6 pb-24">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      </main>

      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
