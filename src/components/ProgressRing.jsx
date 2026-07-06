import { motion, AnimatePresence, useSpring, useTransform } from 'framer-motion';
import { useEffect, useRef } from 'react';

// Animated counter number
function AnimatedCounter({ value, color, suffix = '' }) {
  const spring = useSpring(0, { damping: 30, stiffness: 120 });
  const display = useTransform(spring, (v) => Math.round(v) + suffix);

  useEffect(() => {
    spring.set(value);
  }, [value, spring]);

  return (
    <motion.span style={{ color }}>
      {display}
    </motion.span>
  );
}

export default function ProgressRing({
  progress = 0,
  size = 120,
  strokeWidth = 8,
  ringColor,
  label,
  completed,
  total,
  showPulse = true,
}) {
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (Math.min(100, Math.max(0, progress)) / 100) * circumference;

  const getColor = (pct) => {
    if (pct >= 100) return '#10b981';
    if (pct >= 70)  return '#22d3ee';
    if (pct >= 40)  return '#f59e0b';
    return '#ef4444';
  };

  const color = ringColor || getColor(progress);
  const isDone = progress >= 100;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      {/* Ambient glow */}
      <div
        className="absolute inset-0 rounded-full blur-2xl opacity-20 transition-opacity duration-700"
        style={{ background: color, transform: 'scale(0.7)' }}
      />

      {/* Pulse ring when 100% */}
      {isDone && showPulse && (
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{ border: `2px solid ${color}` }}
          animate={{ scale: [1, 1.15, 1], opacity: [0.6, 0, 0.6] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
        />
      )}

      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{ transform: 'rotate(-90deg)' }}
        className="absolute"
      >
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.05)"
          strokeWidth={strokeWidth}
        />
        {/* Progress arc */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: [0.34, 1.56, 0.64, 1] }}
          style={{ filter: `drop-shadow(0 0 8px ${color}80)` }}
        />
      </svg>

      {/* Center content */}
      <div className="absolute flex flex-col items-center justify-center select-none">
        {isDone ? (
          <motion.span
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            className="text-xl"
          >
            ✅
          </motion.span>
        ) : (
          <>
            <span className="text-xl font-black leading-none" style={{ color }}>
              {Math.round(progress)}
              <span className="text-sm font-bold opacity-70">%</span>
            </span>
            {completed !== undefined && (
              <span className="text-[9px] text-zinc-500 mt-0.5 font-medium">
                {completed}/{total}
              </span>
            )}
          </>
        )}
      </div>
    </div>
  );
}
