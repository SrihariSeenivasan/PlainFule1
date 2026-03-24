'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import Navbar from '@/components/Navbar';

const FD = "'Caveat', 'Playfair Display', Georgia, serif";
const FS = "'Nunito', 'DM Sans', 'Helvetica Neue', sans-serif";
const G = '#15803d';
const BG = '#fefdf7';

/* ─────────────────────────────────────────────
   SKETCH FILTER
───────────────────────────────────────────── */
const SketchFilter = () => (
  <svg width="0" height="0" style={{ position: 'absolute' }}>
    <defs>
      <filter id="skAbout">
        <feTurbulence type="turbulence" baseFrequency="0.018" numOctaves="3" seed="7" />
        <feDisplacementMap in="SourceGraphic" scale="2.2" />
      </filter>
      <filter id="skWobbleAbout">
        <feTurbulence type="fractalNoise" baseFrequency="0.022" numOctaves="2" seed="12" />
        <feDisplacementMap in="SourceGraphic" scale="2.8" />
      </filter>
    </defs>
  </svg>
);

/* ─────────────────────────────────────────────
   ANIMATED DOODLE CANVAS
───────────────────────────────────────────── */
const DoodleCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const t = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = document.body.scrollHeight || window.innerHeight * 4;
    };
    resize();
    window.addEventListener('resize', resize);

    // Randomized doodle elements
    const elements: any[] = [
      // Floating speech bubbles
      ...Array.from({ length: 5 }, (_, i) => ({
        type: 'bubble', x: 5 + Math.random() * 90, y: 5 + Math.random() * 90,
        w: 60 + Math.random() * 50, h: 36 + Math.random() * 20,
        speed: 0.1 + Math.random() * 0.18, phase: Math.random() * Math.PI * 2,
        opacity: 0.05 + Math.random() * 0.06,
      })),
      // Zigzag lines
      ...Array.from({ length: 6 }, (_, i) => ({
        type: 'zigzag', y: 10 + i * 15, speed: 0.06 + i * 0.015,
        phase: Math.random() * Math.PI * 2, opacity: 0.03 + Math.random() * 0.04,
        segments: 8 + Math.floor(Math.random() * 6),
      })),
      // Floating hearts
      ...Array.from({ length: 8 }, (_, i) => ({
        type: 'heart', x: Math.random() * 100, y: Math.random() * 100,
        size: 10 + Math.random() * 18, speed: 0.12 + Math.random() * 0.22,
        phase: Math.random() * Math.PI * 2, opacity: 0.05 + Math.random() * 0.07,
      })),
      // Stars
      ...Array.from({ length: 20 }, (_, i) => ({
        type: 'star', x: Math.random() * 100, y: Math.random() * 100,
        size: 8 + Math.random() * 18, speed: 0.08 + Math.random() * 0.2,
        phase: Math.random() * Math.PI * 2, opacity: 0.05 + Math.random() * 0.08,
      })),
      // Spirals
      ...Array.from({ length: 7 }, (_, i) => ({
        type: 'spiral', x: Math.random() * 100, y: Math.random() * 100,
        size: 18 + Math.random() * 28, speed: 0.07 + Math.random() * 0.15,
        phase: Math.random() * Math.PI * 2, opacity: 0.04 + Math.random() * 0.06,
      })),
      // Dashed ovals
      ...Array.from({ length: 10 }, (_, i) => ({
        type: 'oval', x: Math.random() * 100, y: Math.random() * 100,
        rx: 22 + Math.random() * 40, ry: 14 + Math.random() * 24,
        speed: 0.07 + Math.random() * 0.14, phase: Math.random() * Math.PI * 2,
        opacity: 0.03 + Math.random() * 0.05,
      })),
      // Dots cluster
      ...Array.from({ length: 35 }, (_, i) => ({
        type: 'dot', x: Math.random() * 100, y: Math.random() * 100,
        size: 2 + Math.random() * 4, speed: 0.04 + Math.random() * 0.12,
        phase: Math.random() * Math.PI * 2, opacity: 0.06 + Math.random() * 0.08,
      })),
      // Curly braces / brackets
      ...Array.from({ length: 4 }, (_, i) => ({
        type: 'brace', x: Math.random() * 100, y: Math.random() * 100,
        size: 30 + Math.random() * 30, speed: 0.08 + Math.random() * 0.16,
        phase: Math.random() * Math.PI * 2, opacity: 0.04 + Math.random() * 0.05,
        flip: i % 2 === 0,
      })),
      // Leaves
      ...Array.from({ length: 12 }, (_, i) => ({
        type: 'leaf', x: Math.random() * 100, y: Math.random() * 100,
        size: 14 + Math.random() * 22, speed: 0.09 + Math.random() * 0.18,
        phase: Math.random() * Math.PI * 2, opacity: 0.05 + Math.random() * 0.07,
        rotation: Math.random() * Math.PI * 2,
      })),
    ];

    const drawStar = (ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number) => {
      ctx.beginPath();
      for (let i = 0; i < 10; i++) {
        const angle = (i * Math.PI) / 5 - Math.PI / 2;
        const r = i % 2 === 0 ? size : size * 0.4;
        const x = cx + Math.cos(angle) * r;
        const y = cy + Math.sin(angle) * r;
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.closePath();
    };

    const drawHeart = (ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number) => {
      ctx.beginPath();
      ctx.moveTo(cx, cy + size * 0.3);
      ctx.bezierCurveTo(cx, cy - size * 0.1, cx - size, cy - size * 0.1, cx - size, cy + size * 0.3);
      ctx.bezierCurveTo(cx - size, cy + size * 0.8, cx, cy + size * 1.2, cx, cy + size * 1.5);
      ctx.bezierCurveTo(cx, cy + size * 1.2, cx + size, cy + size * 0.8, cx + size, cy + size * 0.3);
      ctx.bezierCurveTo(cx + size, cy - size * 0.1, cx, cy - size * 0.1, cx, cy + size * 0.3);
    };

    const drawSpiral = (ctx: CanvasRenderingContext2D, cx: number, cy: number, maxR: number) => {
      ctx.beginPath();
      for (let angle = 0; angle <= Math.PI * 4; angle += 0.15) {
        const r = (angle / (Math.PI * 4)) * maxR;
        const x = cx + Math.cos(angle) * r;
        const y = cy + Math.sin(angle) * r;
        angle === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
    };

    const drawBubble = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) => {
      const r = 8;
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.lineTo(x + w - r, y);
      ctx.quadraticCurveTo(x + w, y, x + w, y + r);
      ctx.lineTo(x + w, y + h - r);
      ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
      ctx.lineTo(x + r + 10, y + h);
      ctx.lineTo(x + r, y + h + 12);
      ctx.lineTo(x + r + 5, y + h);
      ctx.lineTo(x + r, y + h);
      ctx.quadraticCurveTo(x, y + h, x, y + h - r);
      ctx.lineTo(x, y + r);
      ctx.quadraticCurveTo(x, y, x + r, y);
      ctx.closePath();
    };

    const drawLeaf = (ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number, rot: number) => {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(rot);
      ctx.beginPath();
      ctx.moveTo(0, -size);
      ctx.bezierCurveTo(size * 0.7, -size * 0.5, size * 0.7, size * 0.5, 0, size);
      ctx.bezierCurveTo(-size * 0.7, size * 0.5, -size * 0.7, -size * 0.5, 0, -size);
      ctx.closePath();
      ctx.restore();
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      t.current += 0.007;
      const W = canvas.width;
      const H = canvas.height;

      ctx.strokeStyle = G;
      ctx.fillStyle = G;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      elements.forEach((el: any) => {
        const floatY = Math.sin(t.current * el.speed + el.phase) * 14;
        const floatX = Math.cos(t.current * el.speed * 0.65 + el.phase) * 9;
        const cx = (el.x / 100) * W + floatX;
        const cy = (el.y / 100) * H + floatY;
        const pulse = 0.7 + 0.3 * Math.sin(t.current * el.speed * 1.8 + el.phase);

        ctx.globalAlpha = el.opacity * pulse;

        if (el.type === 'star') {
          ctx.lineWidth = 1.5;
          drawStar(ctx, cx, cy, el.size);
          ctx.stroke();
        } else if (el.type === 'heart') {
          ctx.lineWidth = 1.5;
          drawHeart(ctx, cx, cy - el.size * 0.75, el.size * 0.5);
          ctx.stroke();
        } else if (el.type === 'spiral') {
          ctx.lineWidth = 1.5;
          drawSpiral(ctx, cx, cy, el.size);
          ctx.stroke();
        } else if (el.type === 'bubble') {
          ctx.lineWidth = 1.5;
          ctx.setLineDash([5, 4]);
          drawBubble(ctx, cx - el.w / 2, cy - el.h / 2, el.w, el.h);
          ctx.stroke();
          ctx.setLineDash([]);
        } else if (el.type === 'zigzag') {
          ctx.lineWidth = 1.8;
          const segW = W / el.segments;
          ctx.beginPath();
          for (let i = 0; i <= el.segments; i++) {
            const x = i * segW;
            const y = (el.y / 100) * H + (i % 2 === 0 ? -10 : 10) + Math.sin(t.current * el.speed + el.phase + i) * 6;
            i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
          }
          ctx.stroke();
        } else if (el.type === 'oval') {
          ctx.lineWidth = 1.5;
          ctx.setLineDash([6, 5]);
          ctx.beginPath();
          ctx.ellipse(cx, cy, el.rx, el.ry, t.current * el.speed * 0.3, 0, Math.PI * 2);
          ctx.stroke();
          ctx.setLineDash([]);
        } else if (el.type === 'dot') {
          ctx.beginPath();
          ctx.arc(cx, cy, el.size, 0, Math.PI * 2);
          ctx.fill();
        } else if (el.type === 'brace') {
          ctx.lineWidth = 1.5;
          const flip = el.flip ? -1 : 1;
          ctx.beginPath();
          ctx.moveTo(cx, cy - el.size / 2);
          ctx.bezierCurveTo(cx + flip * 12, cy - el.size / 2, cx + flip * 12, cy - 6, cx + flip * 18, cy);
          ctx.bezierCurveTo(cx + flip * 12, cy + 6, cx + flip * 12, cy + el.size / 2, cx, cy + el.size / 2);
          ctx.stroke();
        } else if (el.type === 'leaf') {
          ctx.lineWidth = 1.5;
          const rot = el.rotation + t.current * el.speed * 0.4;
          drawLeaf(ctx, cx, cy, el.size, rot);
          ctx.stroke();
        }
      });

      ctx.globalAlpha = 1;
      ctx.setLineDash([]);
      animRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed', top: 0, left: 0,
        width: '100%', height: '100%',
        pointerEvents: 'none', zIndex: 0,
      }}
    />
  );
};

/* ─────────────────────────────────────────────
   NOTEBOOK LINES
───────────────────────────────────────────── */
const NotebookLines = () => (
  <>
    {Array.from({ length: 50 }, (_, i) => (
      <div key={i} style={{
        position: 'fixed', left: 0, right: 0, top: 56 + i * 36,
        height: 1, background: 'rgba(21,128,61,0.05)', pointerEvents: 'none', zIndex: 0,
      }} />
    ))}
    <div style={{
      position: 'fixed', left: 52, top: 0, bottom: 0,
      width: 1.5, background: 'rgba(220,38,38,0.07)', pointerEvents: 'none', zIndex: 0,
    }} />
  </>
);

/* ─────────────────────────────────────────────
   HAND UNDERLINE
───────────────────────────────────────────── */
const HandUnderline = ({ width = 200, color = G }: { width?: number; color?: string }) => (
  <svg viewBox={`0 0 ${width} 10`} width={width} height={10} style={{ display: 'block', margin: '-2px auto 0' }}>
    <path
      d={`M4,7 Q${width * 0.25},2 ${width * 0.5},6 Q${width * 0.75},10 ${width - 4},4`}
      fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" opacity={0.5}
    />
  </svg>
);

/* ─────────────────────────────────────────────
   DOODLE TAPE
───────────────────────────────────────────── */
const DoodleTape = ({ rotate = -1.5, color = 'rgba(21,128,61,0.12)' }: { rotate?: number; color?: string }) => (
  <div style={{
    position: 'absolute', top: -11, left: '50%',
    transform: `translateX(-50%) rotate(${rotate}deg)`,
    width: 76, height: 22, background: color,
    borderRadius: 3, zIndex: 3,
    border: '1px dashed rgba(21,128,61,0.22)',
  }} />
);

/* ─────────────────────────────────────────────
   DOODLE CARD
───────────────────────────────────────────── */
const DoodleCard = ({
  children, style = {}, tapeColor, rotate = 0,
}: { children: React.ReactNode; style?: React.CSSProperties; tapeColor?: string; rotate?: number }) => (
  <motion.div
    whileHover={{ y: -6, rotate: rotate + 0.5 }}
    initial={{ rotate }}
    style={{
      background: '#fff',
      border: '2.5px dashed rgba(21,128,61,0.22)',
      borderRadius: 18,
      position: 'relative',
      boxShadow: '4px 6px 0px rgba(21,128,61,0.13), 0 2px 12px rgba(0,0,0,0.05)',
      ...style,
    }}
  >
    {tapeColor && <DoodleTape color={tapeColor} rotate={rotate > 0 ? 2 : -1.5} />}
    {children}
  </motion.div>
);

/* ─────────────────────────────────────────────
   FLOATING DOODLE BADGE (decorative)
───────────────────────────────────────────── */
const FloatingDoodle = ({ children, style = {} }: { children: React.ReactNode; style?: React.CSSProperties }) => (
  <motion.div
    animate={{ y: [0, -10, 0], rotate: [-2, 2, -2] }}
    transition={{ repeat: Infinity, duration: 4 + Math.random() * 2, ease: 'easeInOut' }}
    style={{
      position: 'absolute', zIndex: 2,
      fontFamily: FD, fontSize: 13, color: G,
      background: '#fffde6',
      border: '2px dashed rgba(21,128,61,0.28)',
      borderRadius: 30, padding: '5px 14px',
      boxShadow: '2px 3px 0 rgba(21,128,61,0.18)',
      filter: 'url(#skWobbleAbout)',
      pointerEvents: 'none',
      whiteSpace: 'nowrap',
      ...style,
    }}
  >
    {children}
  </motion.div>
);

/* ─────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────── */
export default function AboutPage() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.2 } },
  };
  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.55, type: 'spring', stiffness: 90 } },
  };

  const tapeColors = [
    'rgba(21,128,61,0.15)',
    'rgba(250,204,21,0.22)',
    'rgba(99,102,241,0.14)',
    'rgba(236,72,153,0.12)',
  ];

  const features = [
    {
      title: 'Quality',
      description: 'Placeholder: Describe your quality standards and certifications.',
      emoji: '🏆', color: '#fef9c3', accent: '#ca8a04',
    },
    {
      title: 'Innovation',
      description: 'Placeholder: Explain your research and development approach.',
      emoji: '🔬', color: '#f0fdf4', accent: G,
    },
    {
      title: 'Transparency',
      description: 'Placeholder: Share your commitment to transparency and honesty.',
      emoji: '💎', color: '#eff6ff', accent: '#3b82f6',
    },
    {
      title: 'Sustainability',
      description: 'Placeholder: Discuss your environmental and social responsibility.',
      emoji: '🌿', color: '#fdf4ff', accent: '#a855f7',
    },
  ];

  return (
    <div id="about" style={{ minHeight: '100vh', background: BG, fontFamily: FS, position: 'relative' }}>
      <DoodleCanvas />
      <SketchFilter />
      <NotebookLines />
      <Navbar />

      {/* ── Floating decorative badges scattered around ── */}
      <FloatingDoodle style={{ top: 140, left: '4%' }}>✨ Est. 2024</FloatingDoodle>
      <FloatingDoodle style={{ top: 260, right: '3%' }}>🌱 100% Natural</FloatingDoodle>
      <FloatingDoodle style={{ top: 500, left: '2%' }}>💚 Science-backed</FloatingDoodle>
      <FloatingDoodle style={{ top: 700, right: '2%' }}>🧪 Lab tested</FloatingDoodle>
      <FloatingDoodle style={{ top: 1000, left: '3%' }}>🏅 Premium quality</FloatingDoodle>

      <div style={{ paddingTop: 110, padding: '110px 24px 64px', position: 'relative', zIndex: 1 }}>
        <motion.div
          className="max-w-4xl mx-auto"
          style={{ maxWidth: 860, margin: '0 auto' }}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >

          {/* ── Header ── */}
          <motion.div variants={itemVariants} style={{ marginBottom: 56, textAlign: 'center', position: 'relative' }}>
            {/* Decorative curvy arrow above title */}
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 2.8, ease: 'easeInOut' }}
              style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}
            >
              <svg width="44" height="36" viewBox="0 0 44 36">
                <path d="M22,3 Q32,10 24,20 Q18,28 22,34" fill="none" stroke={G} strokeWidth="2.5" strokeLinecap="round" opacity={0.45} />
                <path d="M22,34 L16,26 M22,34 L28,26" fill="none" stroke={G} strokeWidth="2.5" strokeLinecap="round" opacity={0.45} />
              </svg>
            </motion.div>

            <h1 style={{
              fontFamily: FD,
              fontSize: 'clamp(38px, 6vw, 58px)',
              fontWeight: 900,
              color: '#1a1a1a',
              margin: '0 0 6px',
              lineHeight: 1.1,
              letterSpacing: -1,
              filter: 'url(#skAbout)',
            }}>
              About PlainFuel
            </h1>
            <HandUnderline width={280} />

            <motion.p
              variants={itemVariants}
              style={{ fontSize: 17, color: '#777', marginTop: 14, lineHeight: 1.7, fontFamily: FS }}
            >
              Our mission and story ✍️
            </motion.p>

            {/* Corner doodle decoration */}
            <svg style={{ position: 'absolute', top: -10, right: 0, opacity: 0.12 }} width="60" height="60" viewBox="0 0 60 60">
              <path d="M10,10 Q30,2 50,10 Q58,30 50,50 Q30,58 10,50 Q2,30 10,10" fill="none" stroke={G} strokeWidth="2" strokeDasharray="5 4" />
              <circle cx="30" cy="30" r="6" fill="none" stroke={G} strokeWidth="2" />
            </svg>
          </motion.div>

          {/* ── Introduction Card ── */}
          <motion.div variants={itemVariants} style={{ marginBottom: 36 }}>
            <DoodleCard tapeColor={tapeColors[0]} style={{ padding: 36 }}>
              {/* Margin line inside card */}
              <div style={{
                position: 'absolute', left: 52, top: 0, bottom: 0,
                width: 1, background: 'rgba(220,38,38,0.08)', pointerEvents: 'none',
              }} />

              <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
                  style={{ fontSize: 40, flexShrink: 0, lineHeight: 1, marginTop: 4 }}
                >
                  📖
                </motion.div>
                <div>
                  <h2 style={{ fontFamily: FD, fontSize: 26, fontWeight: 800, color: G, margin: '0 0 12px', filter: 'url(#skAbout)' }}>
                    Our Story
                  </h2>
                  <HandUnderline width={110} color={G} />
                  <p style={{ fontSize: 16, lineHeight: 1.85, color: '#444', margin: '12px 0 0', fontFamily: FS }}>
                    <strong style={{ fontFamily: FD, fontSize: 18, color: '#1a1a1a' }}>Placeholder content for About page.</strong> This section introduces PlainFuel and our commitment to providing high-quality, science-backed nutritional supplements. Share your brand story, values, and what makes your products unique.
                  </p>
                </div>
              </div>

              {/* Inline doodle star */}
              <svg style={{ position: 'absolute', bottom: 16, right: 20, opacity: 0.1 }} width="36" height="36" viewBox="0 0 36 36">
                <path d="M18,3 L20.5,13 L30,13 L22.5,19.5 L25,30 L18,24 L11,30 L13.5,19.5 L6,13 L15.5,13 Z" fill="none" stroke={G} strokeWidth="2" strokeLinecap="round" />
              </svg>
            </DoodleCard>
          </motion.div>

          {/* ── Features Grid ── */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: 22,
              marginBottom: 44,
            }}
          >
            {features.map((feature, i) => (
              <motion.div key={i} variants={itemVariants}>
                <DoodleCard
                  tapeColor={tapeColors[i]}
                  rotate={[-0.8, 0.6, -0.5, 0.7][i]}
                  style={{ padding: 26, background: feature.color }}
                >
                  {/* Doodle corner detail */}
                  <svg style={{ position: 'absolute', bottom: 8, right: 10, opacity: 0.08 }} width="28" height="28" viewBox="0 0 28 28">
                    <circle cx="14" cy="14" r="12" fill="none" stroke={feature.accent} strokeWidth="2" strokeDasharray="4 3" />
                  </svg>

                  <motion.div
                    animate={{ y: [0, -6, 0], rotate: [-4, 4, -4] }}
                    transition={{ repeat: Infinity, duration: 3 + i * 0.5, ease: 'easeInOut' }}
                    style={{ fontSize: 36, marginBottom: 12, display: 'block', lineHeight: 1 }}
                  >
                    {feature.emoji}
                  </motion.div>

                  <h3 style={{
                    fontFamily: FD,
                    fontSize: 24,
                    fontWeight: 800,
                    color: feature.accent,
                    margin: '0 0 6px',
                    filter: 'url(#skAbout)',
                  }}>
                    {feature.title}
                  </h3>
                  <HandUnderline width={80} color={feature.accent} />
                  <p style={{ fontSize: 13.5, lineHeight: 1.65, color: '#666', margin: '10px 0 0', fontFamily: FS }}>
                    {feature.description}
                  </p>
                </DoodleCard>
              </motion.div>
            ))}
          </motion.div>

          {/* ── Team Section ── */}
          <motion.div
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            style={{ marginBottom: 36 }}
          >
            <DoodleCard tapeColor="rgba(250,204,21,0.25)" style={{ padding: 36 }}>
              <div style={{ position: 'absolute', left: 52, top: 0, bottom: 0, width: 1, background: 'rgba(220,38,38,0.08)', pointerEvents: 'none' }} />

              <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
                <motion.div
                  animate={{ rotate: [0, -8, 8, 0] }}
                  transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
                  style={{ fontSize: 40, flexShrink: 0, lineHeight: 1, marginTop: 4 }}
                >
                  👥
                </motion.div>
                <div style={{ flex: 1 }}>
                  <h2 style={{ fontFamily: FD, fontSize: 26, fontWeight: 800, color: '#1a1a1a', margin: '0 0 6px', filter: 'url(#skAbout)' }}>
                    Our Team
                  </h2>
                  <HandUnderline width={110} />
                  <p style={{ fontSize: 16, lineHeight: 1.85, color: '#444', margin: '12px 0 0', fontFamily: FS }}>
                    Placeholder: Tell your visitors about the team behind PlainFuel. Share team member bios, expertise, and what drives your team to create exceptional products.
                  </p>
                </div>
              </div>

              {/* Decorative pencil doodle */}
              <svg style={{ position: 'absolute', bottom: 18, right: 24, opacity: 0.1 }} width="44" height="44" viewBox="0 0 44 44">
                <rect x="10" y="6" width="8" height="28" rx="2" fill="none" stroke={G} strokeWidth="2" />
                <path d="M10,34 L14,42 L18,34" fill="none" stroke={G} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <rect x="10" y="6" width="8" height="6" rx="2" fill="none" stroke={G} strokeWidth="2" />
              </svg>
            </DoodleCard>
          </motion.div>

          {/* ── Fun stats row ── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, staggerChildren: 0.1 }}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 16,
              marginBottom: 48,
            }}
          >
            {[
              { num: '10K+', label: 'Happy Customers', emoji: '😊' },
              { num: '5★', label: 'Average Rating', emoji: '⭐' },
              { num: '100%', label: 'Natural Ingredients', emoji: '🌿' },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.85 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1, type: 'spring', stiffness: 120 }}
                viewport={{ once: true }}
                whileHover={{ y: -5, rotate: i % 2 === 0 ? 1 : -1 }}
                style={{
                  background: '#fff',
                  border: '2.5px dashed rgba(21,128,61,0.22)',
                  borderRadius: 16,
                  padding: '22px 16px',
                  textAlign: 'center',
                  boxShadow: '3px 4px 0 rgba(21,128,61,0.13)',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <div style={{ fontSize: 28, marginBottom: 4 }}>{stat.emoji}</div>
                <div style={{ fontFamily: FD, fontSize: 32, fontWeight: 900, color: G, filter: 'url(#skAbout)' }}>{stat.num}</div>
                <div style={{ fontFamily: FS, fontSize: 12, color: '#888', marginTop: 4 }}>{stat.label}</div>
                {/* bg circle doodle */}
                <svg style={{ position: 'absolute', bottom: -10, right: -10, opacity: 0.06 }} width="50" height="50" viewBox="0 0 50 50">
                  <circle cx="25" cy="25" r="22" fill={G} />
                </svg>
              </motion.div>
            ))}
          </motion.div>

          {/* ── CTA ── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ textAlign: 'center', paddingTop: 8, paddingBottom: 24, position: 'relative' }}
          >
            {/* Doodle arrows pointing to CTA */}
            <svg style={{ position: 'absolute', left: '18%', top: -20, opacity: 0.25 }} width="60" height="50" viewBox="0 0 60 50">
              <path d="M10,5 Q30,10 42,36" fill="none" stroke={G} strokeWidth="2.5" strokeLinecap="round" strokeDasharray="4 3" />
              <path d="M42,36 L34,30 M42,36 L44,26" fill="none" stroke={G} strokeWidth="2.5" strokeLinecap="round" />
            </svg>
            <svg style={{ position: 'absolute', right: '18%', top: -20, opacity: 0.25, transform: 'scaleX(-1)' }} width="60" height="50" viewBox="0 0 60 50">
              <path d="M10,5 Q30,10 42,36" fill="none" stroke={G} strokeWidth="2.5" strokeLinecap="round" strokeDasharray="4 3" />
              <path d="M42,36 L34,30 M42,36 L44,26" fill="none" stroke={G} strokeWidth="2.5" strokeLinecap="round" />
            </svg>

            <motion.a
              href="/products"
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.96 }}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 10,
                padding: '14px 36px',
                background: `linear-gradient(135deg, ${G}, #1a7a36 60%, #22a349)`,
                color: '#fff',
                textDecoration: 'none',
                borderRadius: 14,
                fontFamily: FD, fontSize: 20, fontWeight: 800,
                border: 'none',
                boxShadow: `4px 5px 0px rgba(21,128,61,0.35), 0 8px 20px rgba(21,128,61,0.2)`,
                filter: 'url(#skWobbleAbout)',
                cursor: 'pointer',
                letterSpacing: 0.3,
              }}
            >
              🛍️ Explore Our Products →
            </motion.a>

            {/* Tiny hand-drawn underline beneath CTA */}
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 10 }}>
              <svg viewBox="0 0 200 8" width={200} height={8}>
                <path d="M10,5 Q60,1 100,5 Q140,9 190,4" fill="none" stroke={G} strokeWidth="1.5" strokeLinecap="round" opacity={0.2} />
              </svg>
            </div>
          </motion.div>

        </motion.div>
      </div>

      {/* ── Global font import ── */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400;600;700;800;900&family=Nunito:wght@400;500;600;700;800&display=swap');
      `}</style>
    </div>
  );
}