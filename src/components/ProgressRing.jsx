import { motion } from 'framer-motion';

export default function ProgressRing({ progress, size = 120, strokeWidth = 8, ringColor }) {
  const padding = 24; // Extra spacing on all sides for drop shadow glow
  const svgSize = size + padding;
  const center = svgSize / 2;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  const getColor = (pct) => {
    if (pct >= 90) return '#10b981';
    if (pct >= 70) return '#22d3ee';
    if (pct >= 40) return '#f59e0b';
    return '#ef4444';
  };

  const color = ringColor || getColor(progress);

  return (
    <div className="relative flex items-center justify-center overflow-visible" style={{ width: size, height: size }}>
      {/* Glow effect behind */}
      <div
        className="absolute rounded-full blur-xl opacity-30 pointer-events-none"
        style={{
          width: size * 0.75,
          height: size * 0.75,
          background: color,
        }}
      />

      <svg width={svgSize} height={svgSize} className="absolute transform -rotate-90 overflow-visible pointer-events-none">
        {/* Background track */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={strokeWidth}
        />
        {/* Animated progress */}
        <motion.circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: 'easeOut' }}
          style={{
            filter: `drop-shadow(0 0 6px ${color})`,
          }}
        />
      </svg>

      {/* Center text */}
      <div className="absolute flex flex-col items-center justify-center">
        <motion.span
          className="text-2xl font-bold"
          style={{ color }}
          key={progress}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {Math.round(progress)}%
        </motion.span>
        <span className="text-[10px] text-zinc-500 uppercase tracking-widest mt-0.5">Done</span>
      </div>
    </div>
  );
}
