import { useState, useEffect } from 'react';
import { format } from 'date-fns';

export default function LiveClock({ isMobile }) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = time.getHours();
  
  let greeting = '';
  let sub = '';
  if (hours >= 5 && hours < 12) {
    greeting = 'Good Morning';
    sub = "Let's crush it today 💥";
  } else if (hours >= 12 && hours < 17) {
    greeting = 'Good Afternoon';
    sub = 'Keep the momentum 🚀';
  } else if (hours >= 17 && hours < 21) {
    greeting = 'Good Evening';
    sub = 'Almost there, stay strong 🌟';
  } else {
    greeting = 'Good Night';
    sub = 'Wind down & recover 🌙';
  }

  // Mobile layout
  if (isMobile) {
    return (
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 text-[11px] font-medium text-zinc-500 mb-0.5">
          <span>{format(time, 'EEEE, MMM d')}</span>
          <span className="w-1 h-1 rounded-full bg-zinc-700" />
          <span className="font-mono text-zinc-400">{format(time, 'HH:mm:ss')}</span>
        </div>
        <h1 className="text-lg font-black bg-gradient-to-r from-white via-zinc-200 to-zinc-500 bg-clip-text text-transparent leading-tight">
          {greeting} ✨
        </h1>
      </div>
    );
  }

  // Desktop layout
  return (
    <div>
      <div className="flex items-center gap-2 text-xs text-zinc-500 font-medium">
        <span>{format(time, 'EEEE, MMMM d, yyyy')}</span>
        <span className="w-1 h-1 rounded-full bg-zinc-700" />
        <span className="font-mono bg-white/5 px-1.5 py-0.5 rounded text-zinc-400">
          {format(time, 'HH:mm:ss')}
        </span>
      </div>
      <h1 className="text-2xl font-black bg-gradient-to-r from-white via-zinc-200 to-zinc-500 bg-clip-text text-transparent mt-0.5">
        {greeting} ✨
      </h1>
      <p className="text-xs text-zinc-500 mt-0.5">{sub}</p>
    </div>
  );
}
