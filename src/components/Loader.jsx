import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const Loader = ({ onComplete }) => {
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    const duration = 2800; // total ms
    const interval = 30;
    const steps = duration / interval;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      // Ease-out curve: fast start, slow finish
      const progress = 1 - Math.pow(1 - step / steps, 3);
      const value = Math.min(Math.round(progress * 100), 100);
      setPercent(value);

      if (step >= steps) {
        clearInterval(timer);
        setTimeout(onComplete, 300);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
      style={{ backgroundColor: 'var(--bg-primary)' }}
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Subtle radial glow behind logo */}
      <div
        className="absolute w-[300px] h-[300px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, var(--accent-glow) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />

      {/* Logo Container */}
      <motion.div
        className="relative z-10 flex flex-col items-center gap-6"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Emblem */}
        <motion.img
          src="/favicon.svg"
          alt="Tamil Nadu Emblem"
          className="w-20 h-20 object-contain drop-shadow-[0_0_20px_rgba(0,86,0,0.3)]"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        />

        {/* Text */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <h1
            className="text-lg font-outfit font-bold tracking-wider uppercase"
            style={{ color: 'var(--text-primary)' }}
          >
            தமிழ்நாடு அரசு
          </h1>
          <p
            className="text-xs font-medium tracking-widest uppercase mt-1"
            style={{ color: 'var(--accent-primary)' }}
          >
            Government of Tamil Nadu
          </p>
        </motion.div>

        {/* Progress section */}
        <motion.div
          className="flex flex-col items-center gap-3 mt-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {/* Progress bar */}
          <div
            className="w-40 h-[2px] rounded-full overflow-hidden"
            style={{ backgroundColor: 'var(--border-color)' }}
          >
            <div
              className="h-full rounded-full transition-all duration-75"
              style={{
                width: `${percent}%`,
                background: 'linear-gradient(90deg, var(--accent-primary), var(--accent-secondary))',
              }}
            />
          </div>

          {/* Percentage */}
          <span
            className="text-[11px] font-mono font-semibold tracking-widest tabular-nums"
            style={{ color: 'var(--text-tertiary)' }}
          >
            {percent}%
          </span>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Loader;
