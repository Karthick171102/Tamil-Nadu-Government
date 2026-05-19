import { motion } from 'framer-motion';

const LightLines = ({ children, className = "" }) => {
  const lines = Array.from({ length: 12 });

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Background Animated Lines */}
      <div className="absolute inset-0 pointer-events-none opacity-20 dark:opacity-30">
        {lines.map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-gradient-to-r from-transparent via-[#005600] dark:via-green-400 to-transparent"
            style={{
              height: '1px',
              width: '100%',
              top: `${(i * 10) + 5}%`,
              left: '-100%',
            }}
            animate={{
              left: ['-100%', '100%'],
            }}
            transition={{
              duration: 3 + Math.random() * 4,
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * 5,
            }}
          />
        ))}
        
        {/* Vertical lines for more complexity */}
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.div
            key={`v-${i}`}
            className="absolute bg-gradient-to-b from-transparent via-[#005600] dark:via-green-400 to-transparent"
            style={{
              width: '1px',
              height: '100%',
              left: `${(i * 15) + 5}%`,
              top: '-100%',
            }}
            animate={{
              top: ['-100%', '100%'],
            }}
            transition={{
              duration: 4 + Math.random() * 5,
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * 4,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default LightLines;
