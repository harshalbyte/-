import React from 'react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

interface SakuraTreeProps {
  className?: string;
  onClick?: () => void;
}

export function SakuraTree({ className, onClick }: SakuraTreeProps) {
  // A minimalist stylized Sakura branch
  return (
    <motion.div
      className={cn("relative w-full h-full flex items-center justify-center cursor-pointer", className)}
      onClick={onClick}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8, filter: 'blur(10px)' }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-lg">
        {/* Branch / Trunk */}
        <motion.path
          d="M 100 200 C 100 150 110 120 90 80 C 80 60 60 50 40 40 M 90 80 C 110 60 130 50 160 40 M 110 120 C 130 110 140 90 150 70"
          stroke="#5D4037"
          strokeWidth="6"
          strokeLinecap="round"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
        
        {/* Petals */}
        {[
          { cx: 40, cy: 40, delay: 0.5 },
          { cx: 30, cy: 50, delay: 0.6 },
          { cx: 50, cy: 30, delay: 0.7 },
          { cx: 160, cy: 40, delay: 0.6 },
          { cx: 150, cy: 50, delay: 0.7 },
          { cx: 170, cy: 30, delay: 0.8 },
          { cx: 90, cy: 80, delay: 0.8 },
          { cx: 100, cy: 70, delay: 0.9 },
          { cx: 110, cy: 120, delay: 0.7 },
          { cx: 150, cy: 70, delay: 0.8 },
          { cx: 140, cy: 60, delay: 0.9 },
          { cx: 80, cy: 60, delay: 1.0 },
          { cx: 120, cy: 100, delay: 1.1 },
        ].map((petal, i) => (
          <motion.circle
            key={i}
            cx={petal.cx}
            cy={petal.cy}
            r="8"
            fill="#FFB7B2"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 1.2, 1], opacity: 0.9 }}
            transition={{ delay: petal.delay, duration: 0.8 }}
          />
        ))}

        {/* Falling Petals */}
        {[
          { x: 50, y: 150, delay: 1.5 },
          { x: 140, y: 180, delay: 1.8 },
          { x: 90, y: 190, delay: 2.1 },
        ].map((petal, i) => (
          <motion.path
            key={`falling-${i}`}
            d={`M ${petal.x} ${petal.y} Q ${petal.x + 10} ${petal.y - 10} ${petal.x + 20} ${petal.y} Q ${petal.x + 10} ${petal.y + 10} ${petal.x} ${petal.y}`}
            fill="#FFC0CB"
            initial={{ y: -100, opacity: 0, rotate: 0 }}
            animate={{ y: 0, opacity: [0, 0.8, 0], rotate: 360 }}
            transition={{
              delay: petal.delay,
              duration: 3,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        ))}
      </svg>
    </motion.div>
  );
}
