'use client';

import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';

// ── Inline SVG doodle helpers ────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ScribbleUnderline = ({ color = '#22c55e', style = {} }: { color?: string; style?: React.CSSProperties }) => (
  <svg viewBox="0 0 80 8" preserveAspectRatio="none" aria-hidden
    style={{ position: 'absolute', bottom: -4, left: 0, width: '100%', height: 8, pointerEvents: 'none', ...style }}>
    <path
      d="M2,5 Q20,1 40,4 Q60,7 78,3"
      fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round"
    />
  </svg>
);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const WobblyPill = ({ children, style = {}, className = '' }: { children: React.ReactNode; style?: React.CSSProperties; className?: string }) => (
  <span style={{ position: 'relative', display: 'inline-block', ...style }} className={className}>
    <svg viewBox="0 0 120 36" preserveAspectRatio="none" aria-hidden
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
      <path
        d="M10,4 Q60,0 110,4 Q118,4 118,18 Q118,32 110,32 Q60,36 10,32 Q2,32 2,18 Q2,4 10,4 Z"
        fill="rgba(34,197,94,0.12)" stroke="#22c55e" strokeWidth="2"
        strokeLinecap="round" strokeDasharray="5,2"
      />
    </svg>
    {children}
  </span>
);

const StarDoodle = ({ size = 16, rotate = 0, style = {} }: { size?: number; rotate?: number; style?: React.CSSProperties }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden
    style={{ transform: `rotate(${rotate}deg)`, flexShrink: 0, ...style }}>
    <path
      d="M12,2 L13.2,9 L20,9 L14.6,13.4 L16.6,20 L12,15.8 L7.4,20 L9.4,13.4 L4,9 L10.8,9 Z"
      fill="none" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
    />
  </svg>
);

const MenuDoodleIcon = ({ open }: { open: boolean }) => (
  <svg viewBox="0 0 28 22" width={28} height={22} aria-hidden>
    {open ? (
      <>
        <path d="M4,4 Q14,5 24,4" fill="none" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round"
          style={{ transform: 'rotate(45deg) translateY(-6px)', transformOrigin: '14px 11px', transition: 'all 0.3s' }} />
        <path d="M4,18 Q14,17 24,18" fill="none" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round"
          style={{ transform: 'rotate(-45deg) translateY(6px)', transformOrigin: '14px 11px', transition: 'all 0.3s' }} />
      </>
    ) : (
      <>
        <path d="M2,4 Q10,2 18,5 Q22,6 26,4" fill="none" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M2,11 Q12,9 22,12 Q24,12.5 26,11" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M2,18 Q8,16 16,19 Q20,20 26,18" fill="none" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round" />
      </>
    )}
  </svg>
);

// ── Nav Link ─────────────────────────────────────────────────────────────────

const NavLink = ({ href, children, accent = false, delay = 0 }: { href: string; children: React.ReactNode; accent?: boolean; delay?: number }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.a
      href={href}
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        fontFamily: "'Caveat', cursive",
        fontWeight: 700,
        fontSize: 17,
        letterSpacing: '0.06em',
        color: accent ? '#22c55e' : hovered ? '#22c55e' : 'rgba(0,0,0,0.55)',
        textDecoration: 'none',
        padding: '2px 0',
        transition: 'color 0.2s',
        display: 'inline-block',
      }}
    >
      {children}
      {/* animated scribble underline */}
      <svg viewBox="0 0 80 8" preserveAspectRatio="none" aria-hidden
        style={{
          position: 'absolute', bottom: -4, left: 0,
          width: '100%', height: 8, pointerEvents: 'none',
          opacity: hovered || accent ? 1 : 0,
          transition: 'opacity 0.2s',
        }}>
        <motion.path
          d="M2,5 Q20,1 40,4 Q60,7 78,3"
          fill="none" stroke="#22c55e" strokeWidth="2.2" strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: hovered || accent ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />
      </svg>
    </motion.a>
  );
};

// ── Logo ─────────────────────────────────────────────────────────────────────

const DoodleLogo = () => {
  const [hovered, setHovered] = useState(false);
  return (
    <Link href="/"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 10,
        textDecoration: 'none', flexShrink: 0,
      }}
    >
      {/* Sketchy logo mark */}
      <motion.div
        animate={{ rotate: hovered ? [0, -8, 6, -3, 0] : 0 }}
        transition={{ duration: 0.5 }}
        style={{ position: 'relative', width: 38, height: 38, flexShrink: 0 }}
      >
        {/* hand-drawn box */}
        <svg viewBox="0 0 40 40" width={38} height={38} style={{ position: 'absolute', inset: 0 }}>
          <path
            d="M5,5 Q20,2 35,5 Q38,5 38,20 Q38,35 35,36 Q20,38 5,36 Q2,35 2,20 Q2,5 5,5 Z"
            fill="rgba(34,197,94,0.15)"
            stroke="#22c55e"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeDasharray={hovered ? 'none' : '200'}
            strokeDashoffset="0"
          />
          <text
            x="50%" y="54%" dominantBaseline="middle" textAnchor="middle"
            style={{
              fontFamily: "'Permanent Marker', cursive",
              fontSize: 18, fill: '#16a34a', fontWeight: 900,
            }}
          >P</text>
        </svg>
      </motion.div>

      {/* wordmark */}
      <span style={{
        fontFamily: "'Permanent Marker', cursive",
        fontSize: 22,
        color: '#1a1a1a',
        letterSpacing: '0.02em',
        position: 'relative',
      }}>
        Plainfuel
        {hovered && (
          <motion.span
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            style={{
              position: 'absolute', bottom: -3, left: 0,
              width: '100%', height: 3,
              background: '#22c55e',
              borderRadius: 2,
              transformOrigin: 'left',
            }}
          />
        )}
      </span>

      {/* tiny star accent */}
      <StarDoodle size={14} rotate={15} style={{ opacity: 0.6, marginLeft: -4 }} />
    </Link>
  );
};

// ── CTA Button ────────────────────────────────────────────────────────────────

const DoodleCTA = ({ delay = 0 }: { delay?: number }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.a
      href="#buy"
      initial={{ opacity: 0, scale: 0.85, rotate: -3 }}
      animate={{ opacity: 1, scale: 1, rotate: hovered ? 1 : -1 }}
      transition={{ duration: 0.5, delay }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '9px 22px',
        background: hovered ? '#15803d' : '#22c55e',
        color: '#fff',
        fontFamily: "'Permanent Marker', cursive",
        fontSize: 14,
        letterSpacing: '0.06em',
        textDecoration: 'none',
        borderRadius: 12,
        border: '2.5px solid #15803d',
        boxShadow: hovered
          ? '4px 5px 0 #15803d'
          : '3px 3px 0 #15803d',
        transform: `rotate(${hovered ? 1 : -1}deg)`,
        transition: 'all 0.2s ease',
        flexShrink: 0,
        cursor: 'pointer',
      }}
    >
      {/* doodle border overlay */}
      <svg viewBox="0 0 140 44" preserveAspectRatio="none" aria-hidden
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
        <path
          d="M8,4 Q70,1 132,4 Q138,4 138,22 Q138,40 132,40 Q70,43 8,40 Q2,40 2,22 Q2,4 8,4 Z"
          fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5"
          strokeLinecap="round" strokeDasharray="6,3"
        />
      </svg>
      Get Started ✦
    </motion.a>
  );
};

// ── Mobile Drawer ─────────────────────────────────────────────────────────────

const MobileDrawer = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const links = [
    { href: '#investigation', label: 'Investigation' },
    { href: '#inside', label: 'Inside' },
    { href: '#habit', label: 'Habit' },
  ] as const;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scaleY: 0.85 }}
      animate={{ opacity: open ? 1 : 0, y: open ? 0 : -20, scaleY: open ? 1 : 0.85 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      style={{
        transformOrigin: 'top',
        pointerEvents: open ? 'auto' : 'none',
        position: 'absolute',
        top: 'calc(100% + 8px)',
        left: 16, right: 16,
        background: '#fffef5',
        borderRadius: 16,
        padding: '20px 24px',
        border: '2px dashed rgba(34,197,94,0.4)',
        boxShadow: '6px 8px 0 rgba(34,197,94,0.15)',
        zIndex: 200,
      }}
    >
      {/* notebook lines */}
      <div style={{
        position: 'absolute', inset: 0, borderRadius: 'inherit', overflow: 'hidden', pointerEvents: 'none',
        backgroundImage: 'repeating-linear-gradient(transparent, transparent 27px, rgba(34,197,94,0.1) 27px, rgba(34,197,94,0.1) 28px)',
      }} />

      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 4 }}>
        {links.map((l, i) => (
          <motion.a
            key={l.href}
            href={l.href}
            onClick={onClose}
            initial={{ opacity: 0, x: -14 }}
            animate={{ opacity: open ? 1 : 0, x: open ? 0 : -14 }}
            transition={{ delay: 0.05 * i + 0.1 }}
            style={{
              fontFamily: "'Caveat', cursive",
              fontWeight: 700,
              fontSize: 22,
              color: '#1a1a1a',
              textDecoration: 'none',
              padding: '10px 0',
              borderBottom: i < links.length - 1 ? '1.5px dashed rgba(0,0,0,0.1)' : 'none',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
            }}
          >
            <StarDoodle size={14} rotate={i * 10} />
            {l.label}
          </motion.a>
        ))}

        <motion.a
          href="#buy"
          onClick={onClose}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: open ? 1 : 0, y: open ? 0 : 8 }}
          transition={{ delay: 0.3 }}
          style={{
            marginTop: 16,
            display: 'block',
            textAlign: 'center',
            background: '#22c55e',
            color: '#fff',
            fontFamily: "'Permanent Marker', cursive",
            fontSize: 16,
            padding: '12px',
            borderRadius: 10,
            border: '2px solid #15803d',
            boxShadow: '3px 3px 0 #15803d',
            textDecoration: 'none',
            transform: 'rotate(-0.5deg)',
          }}
        >
          Get Started ✦
        </motion.a>
      </div>
    </motion.div>
  );
};

// ── Main Navbar ───────────────────────────────────────────────────────────────

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, 'change', (y) => {
    setScrolled(y > 60);
  });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400;600;700;900&family=Permanent+Marker&display=swap');
      `}</style>

      <motion.nav
        initial={{ y: -90, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0, right: 0,
          zIndex: 100,
          padding: scrolled ? '8px 0' : '14px 0',
          transition: 'padding 0.4s',
        }}
      >
        {/* The navbar pill */}
        <div
          style={{
            margin: '0 16px',
            position: 'relative',
            borderRadius: 20,
            background: scrolled ? 'rgba(255,254,245,0.96)' : 'transparent',
            backdropFilter: scrolled ? 'blur(20px)' : 'none',
            boxShadow: scrolled ? '4px 5px 0 rgba(34,197,94,0.18), 0 2px 24px rgba(0,0,0,0.07)' : 'none',
            border: scrolled ? '2px dashed rgba(34,197,94,0.3)' : '2px solid transparent',
            transition: 'all 0.45s ease',
          }}
        >
          {/* Wobbly SVG border overlay when scrolled */}
          {scrolled && (
            <svg
              viewBox="0 0 800 64" preserveAspectRatio="none" aria-hidden
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', borderRadius: 20 }}
            >
              <path
                d="M12,4 Q200,1 400,4 Q600,7 788,4 Q796,4 796,32 Q796,60 788,60 Q600,57 400,60 Q200,63 12,60 Q4,60 4,32 Q4,4 12,4 Z"
                fill="none" stroke="rgba(34,197,94,0.18)" strokeWidth="1.5"
                strokeLinecap="round" strokeDasharray="8,4"
              />
            </svg>
          )}

          <div style={{
            maxWidth: 1200,
            margin: '0 auto',
            padding: '10px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 24,
          }}>

            {/* Logo */}
            <DoodleLogo />

            {/* Center Nav */}
            <nav style={{
              display: 'none',
              alignItems: 'center',
              gap: 32,
            }}
              className="desktop-nav"
            >
              <NavLink href="#investigation" delay={0.2}>Investigation</NavLink>
              <NavLink href="#inside" delay={0.3}>Inside</NavLink>
              <NavLink href="#habit" delay={0.4}>Habit</NavLink>

              {/* divider doodle */}
              <svg viewBox="0 0 4 24" width={4} height={24} aria-hidden>
                <line x1="2" y1="2" x2="2.5" y2="22" stroke="rgba(0,0,0,0.15)" strokeWidth="2" strokeLinecap="round" strokeDasharray="3,3" />
              </svg>

              <NavLink href="#buy" accent delay={0.5}>Order →</NavLink>
            </nav>

            {/* Right side */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <DoodleCTA delay={0.6} />

              {/* Mobile hamburger */}
              <motion.button
                onClick={() => setMenuOpen(v => !v)}
                whileTap={{ scale: 0.9 }}
                style={{
                  background: menuOpen ? 'rgba(34,197,94,0.1)' : 'transparent',
                  border: '2px dashed rgba(34,197,94,0.4)',
                  borderRadius: 10,
                  padding: 6,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'background 0.2s',
                }}
                className="mobile-menu-btn"
                aria-label="Toggle menu"
              >
                <MenuDoodleIcon open={menuOpen} />
              </motion.button>
            </div>
          </div>

          {/* Mobile drawer */}
          <MobileDrawer open={menuOpen} onClose={() => setMenuOpen(false)} />
        </div>
      </motion.nav>

      {/* responsive styles */}
      <style>{`
        @media (min-width: 768px) {
          .desktop-nav { display: flex !important; }
          .mobile-menu-btn { display: none !important; }
        }
        @media (max-width: 767px) {
          .desktop-nav { display: none !important; }
        }
      `}</style>
    </>
  );
}