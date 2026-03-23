'use client';

import React from 'react';
import { motion } from 'framer-motion';

// ── Brand Tokens (match LandingPage exactly) ──────────────────────────────────
export const BRAND = '#15803d';
export const BRAND_DARK = '#052e16';
export const BRAND_LIGHT = '#dcfce7';
export const CREAM = '#fffef0';

// ── Shared doodle primitives ────────────────────────────────────────────────
export function DoodleArrow({ color = BRAND, style = {} }: { color?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 80 40" style={{ display: 'block', ...style }}>
      <path d="M4,20 Q30,8 60,20" fill="none" stroke={color} strokeWidth="3.5" strokeLinecap="round" />
      <path d="M52,10 L64,20 L52,30" fill="none" stroke={color} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function DoodleWiggle({ color = BRAND, style = {} }: { color?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 120 24" style={{ display: 'block', ...style }}>
      <path d="M4,12 Q20,4 36,12 Q52,20 68,12 Q84,4 100,12 Q110,16 116,12" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export function DoodleCircle({ color = BRAND, style = {} }: { color?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 100 100" style={{ display: 'block', ...style }}>
      <ellipse cx="50" cy="50" rx="44" ry="42" fill="none" stroke={color} strokeWidth="3.5" strokeDasharray="6 4" strokeLinecap="round" />
    </svg>
  );
}

export function DoodleUnderline({ color = BRAND, style = {} }: { color?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 300 16" preserveAspectRatio="none"
      style={{ position: 'absolute', bottom: -6, left: 0, width: '100%', height: 12, pointerEvents: 'none', ...style }}>
      <path d="M4,10 Q75,4 150,8 Q225,12 296,6" fill="none" stroke={color} strokeWidth="5" strokeLinecap="round" opacity="0.25" />
      <path d="M4,8 Q75,2 150,6 Q225,10 296,4" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export function GridBg() {
  return (
    <div style={{
      position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
      backgroundImage: `linear-gradient(rgba(21,128,61,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(21,128,61,0.06) 1px, transparent 1px)`,
      backgroundSize: '40px 40px',
    }} />
  );
}

export function NotePaper({ children, rotate = 0, style = {} }: { children: React.ReactNode; rotate?: number; style?: React.CSSProperties }) {
  return (
    <div style={{
      background: CREAM, border: `3px solid ${BRAND_DARK}`,
      borderRadius: 6, boxShadow: `6px 6px 0 ${BRAND_DARK}`,
      transform: `rotate(${rotate}deg)`, position: 'relative', overflow: 'hidden', ...style,
    }}>
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <div key={i} style={{ position: 'absolute', left: 0, right: 0, top: 28 + i * 24, height: 1, background: `rgba(21,128,61,0.15)` }} />
      ))}
      <div style={{ position: 'absolute', left: 30, top: 0, bottom: 0, width: 2, background: `rgba(21,128,61,0.3)` }} />
      <div style={{ position: 'relative', paddingLeft: 38 }}>{children}</div>
    </div>
  );
}

export function GreenTag({ children, rotate = 0 }: { children: React.ReactNode; rotate?: number }) {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 9,
      background: BRAND_LIGHT, border: `3px solid ${BRAND_DARK}`,
      borderRadius: 4, padding: '7px 16px', boxShadow: `4px 4px 0 ${BRAND_DARK}`,
      transform: `rotate(${rotate}deg)`, width: 'fit-content',
      fontFamily: "'Permanent Marker', cursive", fontSize: 13, color: BRAND_DARK, letterSpacing: '0.1em',
    }}>
      <div style={{ width: 9, height: 9, borderRadius: '50%', background: BRAND, border: `2px solid ${BRAND_DARK}`, flexShrink: 0 }} />
      {children}
    </div>
  );
}

export function SectionStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Permanent+Marker&family=Kalam:wght@400;700&display=swap');
      .pf2-card {
        background: ${CREAM};
        border: 3.5px solid ${BRAND_DARK};
        border-radius: 8px;
        box-shadow: 6px 6px 0 ${BRAND_DARK};
        position: relative;
        overflow: hidden;
        transition: transform 0.2s, box-shadow 0.2s;
      }
      .pf2-card:hover {
        transform: translateY(-4px);
        box-shadow: 8px 8px 0 ${BRAND_DARK};
      }
      .pf2-card::before {
        content: '';
        position: absolute; left: 0; right: 0; top: 0; bottom: 0;
        background-image: repeating-linear-gradient(to bottom, transparent 0px, transparent 27px, rgba(21,128,61,0.1) 28px, rgba(21,128,61,0.1) 29px);
        pointer-events: none; z-index: 0;
      }
      .pf2-card::after {
        content: '';
        position: absolute; left: 30px; top: 0; bottom: 0; width: 2px;
        background: rgba(21,128,61,0.3);
        pointer-events: none; z-index: 0;
      }
      .pf2-card-inner { position: relative; z-index: 1; }
      .pf2-btn {
        font-family: 'Permanent Marker', cursive;
        display: inline-flex; align-items: center; gap: 12px;
        color: #fff; font-size: 18px; letter-spacing: 0.04em;
        padding: 16px 36px; border-radius: 6px;
        background: ${BRAND};
        border: 4px solid ${BRAND_DARK}; box-shadow: 7px 8px 0 ${BRAND_DARK};
        text-decoration: none; cursor: pointer;
        transition: transform 0.12s, box-shadow 0.12s;
      }
      .pf2-btn:hover { transform: translate(-3px,-3px) rotate(-1deg); box-shadow: 10px 11px 0 ${BRAND_DARK}; }
      .pf2-btn:active { transform: translate(3px,3px); box-shadow: 3px 4px 0 ${BRAND_DARK}; }
      .pf2-stamp {
        border: 4px solid ${BRAND};
        border-radius: 6px;
        box-shadow: 6px 6px 0 ${BRAND_DARK};
        font-family: 'Permanent Marker', cursive;
        color: ${BRAND_DARK};
        background: ${BRAND_LIGHT};
        display: inline-block;
        letter-spacing: 0.06em;
        transition: transform 0.2s;
      }
      .pf2-stamp:hover { transform: scale(1.06) rotate(-2deg); }
    `}</style>
  );
}

export const svgStroke = { stroke: BRAND_DARK, strokeWidth: 3, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, fill: 'none' };

// Shared animate-on-scroll wrapper
export function FadeUp({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
