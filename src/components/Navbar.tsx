'use client';

import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

// ── Inline SVG doodle helpers ────────────────────────────────────────────────

const StarDoodle = ({ size = 16, rotate = 0, style = {} }: { size?: number; rotate?: number; style?: React.CSSProperties }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden
    style={{ transform: `rotate(${rotate}deg)`, flexShrink: 0, ...style }}>
    <path
      d="M12,2 L13.2,9 L20,9 L14.6,13.4 L16.6,20 L12,15.8 L7.4,20 L9.4,13.4 L4,9 L10.8,9 Z"
      fill="none" stroke="#15803d" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
    />
  </svg>
);

const MenuDoodleIcon = ({ open }: { open: boolean }) => (
  <svg viewBox="0 0 32 26" width={32} height={26} aria-hidden>
    {open ? (
      <>
        <path d="M4,4 Q16,5 28,4" fill="none" stroke="#1a1a1a" strokeWidth="3" strokeLinecap="round"
          style={{ transform: 'rotate(45deg) translateY(-6px)', transformOrigin: '16px 13px', transition: 'all 0.3s' }} />
        <path d="M4,22 Q16,21 28,22" fill="none" stroke="#1a1a1a" strokeWidth="3" strokeLinecap="round"
          style={{ transform: 'rotate(-45deg) translateY(6px)', transformOrigin: '16px 13px', transition: 'all 0.3s' }} />
      </>
    ) : (
      <>
        <path d="M2,4 Q12,2 22,5 Q26,6 30,4" fill="none" stroke="#1a1a1a" strokeWidth="3" strokeLinecap="round" />
        <path d="M2,13 Q14,11 26,14 Q28,14.5 30,13" fill="none" stroke="#15803d" strokeWidth="3" strokeLinecap="round" />
        <path d="M2,22 Q10,20 20,23 Q24,24 30,22" fill="none" stroke="#1a1a1a" strokeWidth="3" strokeLinecap="round" />
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
        fontSize: 20,
        letterSpacing: '0.06em',
        color: accent ? '#15803d' : hovered ? '#15803d' : 'rgba(0,0,0,0.55)',
        textDecoration: 'none',
        padding: '4px 0',
        transition: 'color 0.2s',
        display: 'inline-block',
      }}
    >
      {children}
      <svg viewBox="0 0 80 8" preserveAspectRatio="none" aria-hidden
        style={{
          position: 'absolute', bottom: -5, left: 0,
          width: '100%', height: 9, pointerEvents: 'none',
          opacity: hovered || accent ? 1 : 0,
          transition: 'opacity 0.2s',
        }}>
        <motion.path
          d="M2,5 Q20,1 40,4 Q60,7 78,3"
          fill="none" stroke="#15803d" strokeWidth="2.5" strokeLinecap="round"
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
  return (
    <Link href="/"
      style={{
        display: 'flex', alignItems: 'center', gap: 8,
        textDecoration: 'none', flexShrink: 0,
      }}
    >
      <Image
        src="/images/plainfuel.png"
        alt="PlainFuel"
        width={148}
        height={36}
        priority
        style={{ height: 'auto', maxWidth: 160 }}
      />
      <StarDoodle size={17} rotate={15} style={{ opacity: 0.6, marginLeft: -4 }} />
    </Link>
  );
};

// ── CTA Button ────────────────────────────────────────────────────────────────

const DoodleCTA = ({ delay = 0, mobile = false }: { delay?: number; mobile?: boolean }) => {
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
        gap: 8,
        padding: mobile ? '12px 24px' : '9px 22px',
        background: '#15803d',
        color: '#fff',
        fontFamily: "'Permanent Marker', cursive",
        fontSize: mobile ? 17 : 15,
        letterSpacing: '0.06em',
        textDecoration: 'none',
        borderRadius: 14,
        border: '2.5px solid #15803d',
        boxShadow: hovered
          ? '5px 6px 0 rgba(21,100,50,0.5)'
          : '3px 4px 0 rgba(21,100,50,0.4)',
        transform: `rotate(${hovered ? 1 : -1}deg)`,
        transition: 'all 0.2s ease',
        flexShrink: 0,
        cursor: 'pointer',
        whiteSpace: 'nowrap',
      }}
    >
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
    { href: '#buy', label: 'Order →', accent: true },
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
        top: 'calc(100% + 10px)',
        left: 12, right: 12,
        background: '#fffef5',
        borderRadius: 20,
        padding: '24px 28px',
        border: '2px dashed rgba(21,128,61,0.4)',
        boxShadow: '6px 8px 0 rgba(21,128,61,0.15)',
        zIndex: 200,
      }}
    >
      {/* notebook lines */}
      <div style={{
        position: 'absolute', inset: 0, borderRadius: 'inherit', overflow: 'hidden', pointerEvents: 'none',
        backgroundImage: 'repeating-linear-gradient(transparent, transparent 31px, rgba(21,128,61,0.1) 31px, rgba(21,128,61,0.1) 32px)',
      }} />

      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 0 }}>
        {links.slice(0, 3).map((l, i) => (
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
              fontSize: 26,
              color: '#1a1a1a',
              textDecoration: 'none',
              padding: '14px 0',
              borderBottom: '1.5px dashed rgba(0,0,0,0.1)',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <StarDoodle size={16} rotate={i * 10} />
            {l.label}
          </motion.a>
        ))}

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: open ? 1 : 0, y: open ? 0 : 8 }}
          transition={{ delay: 0.3 }}
          style={{ marginTop: 20 }}
        >
          <DoodleCTA mobile />
        </motion.div>
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
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0, right: 0,
          zIndex: 100,
          padding: scrolled ? '6px 0' : '10px 0',
          transition: 'padding 0.4s',
        }}
      >
        {/* The navbar pill */}
        <div
          style={{
            margin: '0 16px',
            position: 'relative',
            borderRadius: 24,
            background: scrolled ? 'rgba(255,254,245,0.97)' : 'transparent',
            backdropFilter: scrolled ? 'blur(24px)' : 'none',
            boxShadow: scrolled ? '5px 6px 0 rgba(21,128,61,0.18), 0 2px 28px rgba(0,0,0,0.08)' : 'none',
            border: scrolled ? '2px dashed rgba(21,128,61,0.3)' : '2px solid transparent',
            transition: 'all 0.45s ease',
          }}
        >
          {/* Wobbly SVG border overlay when scrolled */}
          {scrolled && (
            <svg
              viewBox="0 0 800 72" preserveAspectRatio="none" aria-hidden
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', borderRadius: 24 }}
            >
              <path
                d="M12,4 Q200,1 400,4 Q600,7 788,4 Q796,4 796,36 Q796,68 788,68 Q600,65 400,68 Q200,71 12,68 Q4,68 4,36 Q4,4 12,4 Z"
                fill="none" stroke="rgba(34,197,94,0.18)" strokeWidth="1.5"
                strokeLinecap="round" strokeDasharray="8,4"
              />
            </svg>
          )}

          <div style={{
            maxWidth: 1200,
            margin: '0 auto',
            padding: '10px 28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 20,
            minHeight: 68,
          }}>

            {/* Logo */}
            <DoodleLogo />

            {/* Center Nav */}
            <nav
              style={{
                display: 'none',
                alignItems: 'center',
                gap: 36,
              }}
              className="desktop-nav"
            >
              <NavLink href="#investigation" delay={0.2}>Investigation</NavLink>
              <NavLink href="#inside" delay={0.3}>Inside</NavLink>
              <NavLink href="#habit" delay={0.4}>Habit</NavLink>

              {/* divider doodle */}
              <svg viewBox="0 0 4 28" width={4} height={28} aria-hidden>
                <line x1="2" y1="2" x2="2.5" y2="26" stroke="rgba(0,0,0,0.15)" strokeWidth="2" strokeLinecap="round" strokeDasharray="3,3" />
              </svg>

              <NavLink href="#buy" accent delay={0.5}>Order →</NavLink>
            </nav>

            {/* Right side */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              {/* Desktop CTA */}
              <div className="desktop-cta">
                <DoodleCTA delay={0.6} />
              </div>

              {/* Mobile hamburger */}
              <motion.button
                onClick={() => setMenuOpen(v => !v)}
                whileTap={{ scale: 0.88 }}
                style={{
                  background: menuOpen ? 'rgba(34,197,94,0.1)' : 'transparent',
                  border: '2px dashed rgba(34,197,94,0.45)',
                  borderRadius: 12,
                  padding: '8px 10px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'background 0.2s',
                  minWidth: 52,
                  minHeight: 48,
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
          .desktop-cta { display: flex !important; }
          .mobile-menu-btn { display: none !important; }
        }
        @media (max-width: 767px) {
          .desktop-nav { display: none !important; }
          .desktop-cta { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </>
  );
}