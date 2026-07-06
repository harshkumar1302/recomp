import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, CheckCircle, Activity, Scale, Settings as SettingsIcon,
  Calendar, Camera, Flame, Layers, ChevronRight, HelpCircle
} from 'lucide-react';

const SECTIONS = [
  {
    id: 'step1',
    title: 'Step 1: Setup & Settings',
    icon: SettingsIcon,
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
    content: (
      <div className="space-y-4 text-sm text-zinc-300 leading-relaxed">
        <p>Welcome to Recomp! The very first thing you should do is configure your routines.</p>
        <h3 className="text-white font-bold text-base mt-4 mb-2">How to build a routine:</h3>
        <ol className="list-decimal pl-5 space-y-2">
          <li>Navigate to the <strong>Settings</strong> tab using the bottom navigation bar.</li>
          <li>Click the <strong>New Habit</strong> button in the Routine Manager.</li>
          <li>Fill out the form. You can choose whether it is a <strong>Daily</strong> habit (e.g., Drink Water) or a <strong>Gap</strong> habit (e.g., Derma Rolling once a week).</li>
          <li>Select the Tracker Type: <strong>Fitness</strong> (workouts, diet) or <strong>Wellness</strong> (skin, hair, supplements).</li>
          <li>Assign it to a time of day (Morning, Afternoon, Evening, Night).</li>
        </ol>
        <p className="mt-4 p-3 bg-white/5 rounded-xl border border-white/10 text-xs">
          <strong>Pro Tip:</strong> Enter your Gemini API key in Settings to unlock the AI-powered nutrition label scanner!
        </p>
      </div>
    )
  },
  {
    id: 'step2',
    title: 'Step 2: The Today Cockpit',
    icon: CheckCircle,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    content: (
      <div className="space-y-4 text-sm text-zinc-300 leading-relaxed">
        <p>The <strong>Today</strong> tab is where you will spend 90% of your time. It acts as your daily command center.</p>
        <h3 className="text-white font-bold text-base mt-4 mb-2">Using the Cockpit:</h3>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Chronological Sorting:</strong> Your habits are automatically grouped into Morning, Afternoon, Evening, and Night blocks.</li>
          <li><strong>Hero Rings:</strong> At the top, you'll see glowing rings tracking your total progress for the day.</li>
          <li><strong>Filters:</strong> Tap the "Fitness" or "Wellness" pills under the hero card to isolate specific types of tasks. This is great for focusing just on your workout plan, or just your nighttime skincare routine.</li>
        </ul>
      </div>
    )
  },
  {
    id: 'step3',
    title: 'Step 3: Treatment Queue',
    icon: Layers,
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    content: (
      <div className="space-y-4 text-sm text-zinc-300 leading-relaxed">
        <p>Not everything happens every day. Recomp handles infrequent tasks using the <strong>Treatment Queue</strong>.</p>
        <h3 className="text-white font-bold text-base mt-4 mb-2">How it works:</h3>
        <ol className="list-decimal pl-5 space-y-2">
          <li>On the Today tab, tap the <strong>Clipboard icon</strong> (mobile) or look at the right sidebar (desktop).</li>
          <li>Here, you will see all habits marked as "Gap" frequency.</li>
          <li>Instead of a simple checkbox, the queue tells you <em>exactly how many days it has been</em> since you last did the task.</li>
          <li>Use this to know when it's time to do your weekly face mask, or your bi-weekly deep condition!</li>
        </ol>
      </div>
    )
  },
  {
    id: 'step4',
    title: 'Step 4: Macro Calculator',
    icon: Camera,
    color: 'text-pink-400',
    bg: 'bg-pink-500/10',
    content: (
      <div className="space-y-4 text-sm text-zinc-300 leading-relaxed">
        <p>Track your nutrition effortlessly using the built-in Macro Calculator.</p>
        <h3 className="text-white font-bold text-base mt-4 mb-2">Scanning Food:</h3>
        <ol className="list-decimal pl-5 space-y-2">
          <li>On the Today tab, tap the <strong>Menu icon</strong> (mobile) or look at the left sidebar (desktop).</li>
          <li>If you have your Gemini API key saved in Settings, tap the <strong>Camera icon</strong>.</li>
          <li>Take or upload a photo of any nutrition label.</li>
          <li>The AI will automatically extract the Protein, Carbs, Fat, and Calories and log them to your daily total!</li>
          <li>Alternatively, you can manually type your weight in kg to see your recommended macro targets.</li>
        </ol>
      </div>
    )
  },
  {
    id: 'step5',
    title: 'Step 5: The Calendar',
    icon: Calendar,
    color: 'text-indigo-400',
    bg: 'bg-indigo-500/10',
    content: (
      <div className="space-y-4 text-sm text-zinc-300 leading-relaxed">
        <p>Need to look back at yesterday, or check if you did your habits last week? Use the Calendar.</p>
        <h3 className="text-white font-bold text-base mt-4 mb-2">Time Traveling:</h3>
        <ol className="list-decimal pl-5 space-y-2">
          <li>Tap the <strong>Calendar icon</strong> in the top right of the Today tab.</li>
          <li>This opens a month view. Days with activity will have indicators.</li>
          <li>Tap any day to see exactly which habits you completed on that date.</li>
          <li>You can also read any daily journal notes you saved!</li>
        </ol>
      </div>
    )
  },
  {
    id: 'step6',
    title: 'Step 6: Stats & Body Tracking',
    icon: Activity,
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10',
    content: (
      <div className="space-y-4 text-sm text-zinc-300 leading-relaxed">
        <p>Once you've been using the app for a few days, the analytics come alive.</p>
        <h3 className="text-white font-bold text-base mt-4 mb-2">Dashboard Tab:</h3>
        <ul className="list-disc pl-5 space-y-2">
          <li>Watch your <strong>Current Streak</strong> grow as you complete all daily tasks.</li>
          <li>The <strong>Heatmap</strong> (the glowing grid) shows your consistency over the last 30 days. The brighter the green square, the more habits you did that day.</li>
        </ul>
        <h3 className="text-white font-bold text-base mt-4 mb-2">Body Tab:</h3>
        <ul className="list-disc pl-5 space-y-2">
          <li>Log your weight regularly.</li>
          <li>If you log your waist and height measurements, Recomp will automatically estimate your <strong>Body Fat %</strong> using the RFM formula.</li>
          <li>Watch your trends via the interactive Area Chart to ensure your recomp is working!</li>
        </ul>
      </div>
    )
  },
];

export default function AppGuide({ onClose }) {
  const [activeSection, setActiveSection] = useState(SECTIONS[0].id);

  const activeData = SECTIONS.find(s => s.id === activeSection);
  const ActiveIcon = activeData.icon;

  return (
    <motion.div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="rounded-3xl w-full max-w-4xl h-[80vh] flex flex-col lg:flex-row shadow-2xl border overflow-hidden"
        style={{
          background: 'linear-gradient(145deg, rgba(30,30,36,0.95), rgba(18,18,22,0.95))',
          borderColor: 'rgba(255,255,255,0.08)'
        }}
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b border-white/5">
          <div className="flex items-center gap-2">
            <HelpCircle size={18} className="text-zinc-400" />
            <h2 className="text-sm font-bold text-white tracking-wide">App Guide</h2>
          </div>
          <button onClick={onClose} className="p-2 bg-white/5 rounded-xl text-zinc-400">
            <X size={16} />
          </button>
        </div>

        {/* Sidebar (TOC) */}
        <div className="w-full lg:w-1/3 bg-black/30 border-r border-white/5 flex flex-col h-1/3 lg:h-full">
          <div className="hidden lg:flex items-center justify-between p-6 border-b border-white/5">
            <div className="flex items-center gap-2">
              <HelpCircle size={18} className="text-zinc-400" />
              <h2 className="text-sm font-bold text-white tracking-wide">Recomp Manual</h2>
            </div>
            <button onClick={onClose} className="p-2 bg-white/5 rounded-xl hover:bg-white/10 text-zinc-400 transition-colors cursor-pointer">
              <X size={16} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-3 custom-scrollbar flex lg:flex-col gap-2">
            {SECTIONS.map(s => {
              const isActive = activeSection === s.id;
              const Icon = s.icon;
              return (
                <button
                  key={s.id}
                  onClick={() => setActiveSection(s.id)}
                  className={`flex items-center gap-3 p-3 rounded-xl transition-all text-left whitespace-nowrap lg:whitespace-normal flex-shrink-0 lg:flex-shrink cursor-pointer border ${
                    isActive ? 'bg-white/10 border-white/10' : 'bg-transparent border-transparent hover:bg-white/5'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${s.bg}`}>
                    <Icon size={14} className={s.color} />
                  </div>
                  <span className={`text-sm font-bold ${isActive ? 'text-white' : 'text-zinc-400'}`}>
                    {s.title}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6 lg:p-10 overflow-y-auto custom-scrollbar relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeData.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 border ${activeData.bg} ${activeData.color.replace('text-', 'border-').replace('400', '500/30')}`}>
                <ActiveIcon size={28} className={activeData.color} />
              </div>
              <h1 className="text-2xl lg:text-3xl font-black text-white mb-6 tracking-tight">
                {activeData.title}
              </h1>
              
              <div className="prose prose-invert prose-zinc max-w-none">
                {activeData.content}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

      </motion.div>
    </motion.div>
  );
}
