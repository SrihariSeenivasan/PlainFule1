'use client';
import React from 'react';
import { motion } from 'framer-motion';

const BRAND = '#15803d';
const BRAND_LIGHT = '#dcfce7';

const elements = [
  // Stars
  { type: 'star', x: '8%',  y: '12%', size: 18, delay: 0 },
  { type: 'star', x: '85%', y: '8%',  size: 14, delay: 1.2 },
  { type: 'star', x: '92%', y: '55%', size: 20, delay: 2.8 },
  { type: 'star', x: '5%',  y: '75%', size: 16, delay: 1.8 },
  { type: 'star', x: '50%', y: '4%',  size: 12, delay: 0.6 },
  { type: 'star', x: '70%', y: '88%', size: 15, delay: 3.1 },
  // Dots
  { type: 'dot', x: '20%', y: '25%', size: 7,  delay: 0.4 },
  { type: 'dot', x: '78%', y: '35%', size: 9,  delay: 1.5 },
  { type: 'dot', x: '35%', y: '80%', size: 6,  delay: 2.2 },
  { type: 'dot', x: '60%', y: '18%', size: 8,  delay: 0.9 },
  { type: 'dot', x: '15%', y: '60%', size: 10, delay: 3.4 },
  { type: 'dot', x: '88%', y: '72%', size: 7,  delay: 1.1 },
  // Circles
  { type: 'circle', x: '30%', y: '10%', size: 32, delay: 0.3 },
  { type: 'circle', x: '72%', y: '65%', size: 24, delay: 2.0 },
  { type: 'circle', x: '12%', y: '88%', size: 28, delay: 1.4 },
  { type: 'circle', x: '55%', y: '92%', size: 22, delay: 3.2 },
  // Wiggle lines
  { type: 'wiggle', x: '42%', y: '8%',  size: 60, delay: 0.7 },
  { type: 'wiggle', x: '80%', y: '20%', size: 50, delay: 2.4 },
  { type: 'wiggle', x: '3%',  y: '45%', size: 55, delay: 1.7 },
  { type: 'wiggle', x: '65%', y: '78%', size: 45, delay: 3.0 },
  // X marks
  { type: 'x', x: '25%', y: '70%', size: 18, delay: 1.3 },
  { type: 'x', x: '90%', y: '42%', size: 14, delay: 2.6 },
  { type: 'x', x: '48%', y: '55%', size: 16, delay: 0.5 },
];

function DoodleElement({ type, x, y, size, delay }: { type: string; x: string; y: string; size: number; delay: number }) {
  const common = { stroke: BRAND, strokeWidth: 2.5, fill: 'none', strokeLinecap: 'round' as const };
  return (
    <motion.div
      style={{ position: 'absolute', left: x, top: y, pointerEvents: 'none' }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 0.22, scale: 1 }}
      transition={{ delay, duration: 0.8, ease: 'easeOut' }}
    >
      <motion.div
        animate={
          type === 'star' ? { rotate: 360 } :
          type === 'circle' ? { scale: [1, 1.12, 1] } :
          { y: [0, -8, 0] }
        }
        transition={{
          duration: type === 'star' ? 18 : type === 'circle' ? 4 : 5,
          repeat: Infinity,
          ease: 'linear',
          delay: delay * 0.3,
          repeatType: type === 'star' ? 'loop' : 'mirror',
        }}
      >
        {type === 'star' && (
          <svg width={size} height={size} viewBox="0 0 24 24">
            <path d="M12,2 L13.8,8.4 L20.4,8.4 L15,12.8 L16.8,19.2 L12,15 L7.2,19.2 L9,12.8 L3.6,8.4 L10.2,8.4 Z" {...common} stroke={BRAND} fill={BRAND_LIGHT} strokeWidth={2} />
          </svg>
        )}
        {type === 'dot' && (
          <svg width={size} height={size} viewBox="0 0 10 10">
            <circle cx="5" cy="5" r="4" fill={BRAND} {...{ opacity: 1 }} />
          </svg>
        )}
        {type === 'circle' && (
          <svg width={size} height={size} viewBox="0 0 40 40">
            <circle cx="20" cy="20" r="16" {...common} strokeDasharray="5 3" />
          </svg>
        )}
        {type === 'wiggle' && (
          <svg width={size} height={size * 0.35} viewBox="0 0 80 28">
            <path d="M2,14 Q16,4 28,14 Q40,24 52,14 Q64,4 78,14" {...common} strokeWidth={2.5} />
          </svg>
        )}
        {type === 'x' && (
          <svg width={size} height={size} viewBox="0 0 24 24">
            <line x1="4" y1="4" x2="20" y2="20" {...common} />
            <line x1="20" y1="4" x2="4" y2="20" {...common} />
          </svg>
        )}
      </motion.div>
    </motion.div>
  );
}

export default function DoodleBackground() {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      {elements.map((el, i) => (
        <DoodleElement key={i} {...el} />
      ))}
    </div>
  );
}
