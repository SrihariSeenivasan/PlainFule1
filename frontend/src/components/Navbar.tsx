'use client';

import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import React from 'react';
import { useRouter } from 'next/navigation';
import { Shield, LogOut, User, Menu, X, ShoppingCart, Package, UserCircle } from 'lucide-react';
import AuthModal from './AuthModal';
import { useAuth } from '@/lib/auth-context';
import { useCart } from '@/lib/cart-context';

// ── Star Doodle ───────────────────────────────────────────────────────────────
const StarDoodle = ({ size = 16, rotate = 0, style = {} }: {
  size?: number; rotate?: number; style?: React.CSSProperties
}) => (
  <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden
    style={{ transform: `rotate(${rotate}deg)`, flexShrink: 0, ...style }}>
    <path d="M12,2 L13.2,9 L20,9 L14.6,13.4 L16.6,20 L12,15.8 L7.4,20 L9.4,13.4 L4,9 L10.8,9 Z"
      fill="none" stroke="#15803d" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// ── Nav Link ──────────────────────────────────────────────────────────────────
const NavLink = ({ href, children, accent = false, delay = 0, onClick }: {
  href: string; children: React.ReactNode; accent?: boolean; delay?: number; onClick?: () => void
}) => {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.a
      href={onClick ? undefined : href}
      onClick={onClick ? (e: React.MouseEvent) => { e.preventDefault(); onClick(); } : undefined}
      initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative', fontFamily: "'Caveat', cursive", fontWeight: 700, fontSize: 20,
        letterSpacing: '0.06em', color: accent ? '#15803d' : hovered ? '#15803d' : 'rgba(0,0,0,0.55)',
        textDecoration: 'none', padding: '4px 0', transition: 'color 0.2s', display: 'inline-block',
      }}
    >
      {children}
      <svg viewBox="0 0 80 8" preserveAspectRatio="none" aria-hidden
        style={{ position: 'absolute', bottom: -5, left: 0, width: '100%', height: 9, pointerEvents: 'none', opacity: hovered || accent ? 1 : 0, transition: 'opacity 0.2s' }}>
        <motion.path d="M2,5 Q20,1 40,4 Q60,7 78,3" fill="none" stroke="#15803d" strokeWidth="2.5" strokeLinecap="round"
          initial={{ pathLength: 0 }} animate={{ pathLength: hovered || accent ? 1 : 0 }} transition={{ duration: 0.3 }} />
      </svg>
    </motion.a>
  );
};

// ── Logo ──────────────────────────────────────────────────────────────────────
const DoodleLogo = () => (
  <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 6, textDecoration: 'none', flexShrink: 0 }}>
    <Image src="/images/plainfuel.png" alt="PlainFuel" width={120} height={30} priority
      style={{ height: 'auto', maxWidth: 120 }} />
    <StarDoodle size={14} rotate={15} style={{ opacity: 0.6, marginLeft: -4 }} />
  </Link>
);

// ── Desktop CTA ───────────────────────────────────────────────────────────────
const DoodleCTA = ({ delay = 0 }: { delay?: number }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.a href="/products"
      transition={{ duration: 0.5, delay }}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative', display: 'inline-flex', alignItems: 'center', gap: 6,
        padding: '8px 18px', background: '#15803d', color: '#fff',
        fontFamily: "'Permanent Marker', cursive", fontSize: 14, letterSpacing: '0.06em',
        textDecoration: 'none', borderRadius: 12, border: '2px solid #15803d',
        boxShadow: hovered ? '4px 5px 0 rgba(21,100,50,0.5)' : '3px 4px 0 rgba(21,100,50,0.4)',
        transform: `rotate(${hovered ? 1 : -1}deg)`, transition: 'all 0.2s ease',
        flexShrink: 0, cursor: 'pointer', whiteSpace: 'nowrap',
      }}
    >
      Get Started ✦
    </motion.a>
  );
};

// ── Desktop Login Button ──────────────────────────────────────────────────────
const LoginButton = ({ delay = 0, onClick }: { delay?: number; onClick?: () => void }) => (
  <motion.button onClick={onClick}
    initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5, delay }}
    whileHover={{ scale: 1.03 }}
    style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      padding: '8px 16px', background: 'transparent', color: '#15803d',
      fontFamily: "'Caveat', cursive", fontSize: 15, fontWeight: 700,
      borderRadius: 12, border: '2px dashed rgba(21,128,61,0.5)',
      flexShrink: 0, cursor: 'pointer', whiteSpace: 'nowrap',
    }}
  >
    Sign In
  </motion.button>
);

// ── Profile Dropdown ──────────────────────────────────────────────────────────
const ProfileDropdown = ({ open, onClose, navigate }: { open: boolean; onClose: () => void; navigate: (path: string) => void }) => {
  const { logout, user } = useAuth();
  const handleLogout = () => { logout(); onClose(); window.location.href = '/'; };
  const handleNav = (path: string) => {
    onClose();
    navigate(path);
  };
  const linkStyle = { display: 'flex', alignItems: 'center', gap: 8, padding: '9px 14px', textDecoration: 'none', fontSize: 14, fontWeight: 600, color: '#1a1a1a', fontFamily: "'Caveat', cursive", cursor: 'pointer' } as const;
  return (
    <motion.div
      initial={{ opacity: 0, y: -8, scale: 0.95 }}
      animate={{ opacity: open ? 1 : 0, y: open ? 0 : -8, scale: open ? 1 : 0.95 }}
      transition={{ duration: 0.18 }}
      style={{
        transformOrigin: 'top right', pointerEvents: open ? 'auto' : 'none',
        position: 'absolute', top: 'calc(100% + 8px)', right: 0,
        background: '#fffef5', borderRadius: 14, padding: '10px 0',
        border: '2px dashed rgba(21,128,61,0.4)', boxShadow: '4px 5px 0 rgba(21,128,61,0.15)',
        zIndex: 300, minWidth: 200,
      }}
    >
      <div style={{ padding: '10px 14px', borderBottom: '1.5px dashed rgba(21,128,61,0.2)' }}>
        <p style={{ margin: 0, fontSize: 10, color: '#999', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Signed in as</p>
        <p style={{ margin: '4px 0 0', fontSize: 15, fontWeight: 700, color: '#1a1a1a', fontFamily: "'Caveat', cursive" }}>
          {user?.firstName || 'User'}
        </p>
      </div>
      {user?.role !== 'ADMIN' && (
        <>
          <motion.button onClick={() => handleNav('/my-profile')} whileHover={{ backgroundColor: 'rgba(21,128,61,0.08)' }}
            style={{ ...linkStyle, width: '100%', border: 'none', background: 'transparent' }}>
            <UserCircle size={16} /> My Profile
          </motion.button>
          <motion.button onClick={() => handleNav('/my-orders')} whileHover={{ backgroundColor: 'rgba(21,128,61,0.08)' }}
            style={{ ...linkStyle, width: '100%', border: 'none', background: 'transparent' }}>
            <Package size={16} /> My Orders
          </motion.button>
          <motion.button onClick={() => handleNav('/cart')} whileHover={{ backgroundColor: 'rgba(21,128,61,0.08)' }}
            style={{ ...linkStyle, width: '100%', border: 'none', background: 'transparent', borderBottom: '1.5px dashed rgba(21,128,61,0.15)', paddingBottom: 11 }}>
            <ShoppingCart size={16} /> Cart
          </motion.button>
        </>
      )}
      {user?.role === 'ADMIN' && (
        <motion.a href="/admin/dashboard" onClick={onClose} whileHover={{ backgroundColor: 'rgba(239,68,68,0.08)' }}
          style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 14px', textDecoration: 'none', fontSize: 14, fontWeight: 600, color: '#ef4444', fontFamily: "'Caveat', cursive", borderBottom: '1.5px dashed rgba(21,128,61,0.15)' }}>
          <Shield size={16} /> Admin Panel
        </motion.a>
      )}
      <motion.button onClick={handleLogout} whileHover={{ backgroundColor: 'rgba(239,68,68,0.08)' }}
        style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '9px 14px', border: 'none', background: 'transparent', fontSize: 14, fontWeight: 600, color: '#ef4444', cursor: 'pointer', fontFamily: "'Caveat', cursive" }}>
        <LogOut size={16} /> Logout
      </motion.button>
    </motion.div>
  );
};

// ── Profile Icon Button ───────────────────────────────────────────────────────
const ProfileIconButton = ({ onClick, delay = 0 }: { onClick: () => void; delay?: number }) => (
  <motion.button onClick={onClick}
    initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5, delay }} whileHover={{ scale: 1.05 }}
    style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      width: 36, height: 36, background: '#15803d', color: '#fff',
      border: '2px solid #15803d', borderRadius: 10, cursor: 'pointer',
      boxShadow: '2px 3px 0 rgba(21,100,50,0.3)', flexShrink: 0, padding: 0,
    }} aria-label="Open profile menu"
  >
    <User size={16} />
  </motion.button>
);

// ── Cart Icon Button ───────────────────────────────────────────────────────
const CartIconButton = ({ onClick, totalItems, delay = 0 }: { onClick: () => void; totalItems: number; delay?: number }) => (
  <motion.button onClick={onClick}
    initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5, delay }} whileHover={{ scale: 1.05 }}
    style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      width: 36, height: 36, background: '#15803d', color: '#fff',
      border: '2px solid #15803d', borderRadius: 10, cursor: 'pointer',
      boxShadow: '2px 3px 0 rgba(21,100,50,0.3)', flexShrink: 0, padding: 0,
      position: 'relative',
    }} aria-label="View shopping cart"
  >
    <ShoppingCart size={16} />
    {totalItems > 0 && (
      <motion.span
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        style={{
          position: 'absolute',
          top: -8,
          right: -8,
          width: 24,
          height: 24,
          background: '#ef4444',
          color: '#fff',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 11,
          fontWeight: 700,
          border: '2px solid #fffef5',
          boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
        }}
      >
        {totalItems > 9 ? '9+' : totalItems}
      </motion.span>
    )}
  </motion.button>
);

// ── Mobile Drawer — rendered OUTSIDE the pill, as a sibling ──────────────────
const MobileDrawer = ({ open, onClose, onOpenAuth, isAuthenticated, user, onLogout, navigate }: {
  open: boolean; onClose: () => void;
  onOpenAuth: () => void; isAuthenticated: boolean;
  user: { firstName?: string; role?: string } | null; onLogout: () => void;
  navigate: (path: string) => void;
}) => {
  const links = [
    { href: '/about', label: 'About' },
    { href: '/products', label: 'Products' },
  ] as const;

  return (
    <motion.div
      initial={false}
      animate={{ opacity: open ? 1 : 0, y: open ? 0 : -8, pointerEvents: open ? 'auto' : 'none' }}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      style={{
        position: 'fixed',
        /* sits just below the navbar — adjust top if needed */
        top: 76,
        left: 12, right: 12,
        background: '#fffef5',
        borderRadius: 16,
        padding: '12px 14px',
        border: '2px dashed rgba(21,128,61,0.3)',
        boxShadow: '0 8px 24px rgba(0,0,0,0.1), 3px 4px 0 rgba(21,128,61,0.1)',
        zIndex: 99,
        pointerEvents: open ? 'auto' : 'none',
      }}
    >
      {/* subtle notebook lines */}
      <div style={{
        position: 'absolute', inset: 0, borderRadius: 'inherit', overflow: 'hidden', pointerEvents: 'none',
        backgroundImage: 'repeating-linear-gradient(transparent, transparent 26px, rgba(21,128,61,0.06) 26px, rgba(21,128,61,0.06) 27px)',
      }} />

      <div style={{ position: 'relative' }}>
        {/* Nav links */}
        <div style={{ display: 'flex', flexDirection: 'column', marginBottom: 10 }}>
          {links.map((l, i) => (
            <motion.a
              key={l.href}
              href={l.href}
              onClick={() => { onClose(); }}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: open ? 1 : 0, x: open ? 0 : -6 }}
              transition={{ delay: open ? 0.03 * i + 0.04 : 0 }}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                fontFamily: "'Caveat', cursive", fontWeight: 700, fontSize: 15,
                color: '#1a1a1a', textDecoration: 'none',
                padding: '8px 0',
                borderBottom: '1px dashed rgba(0,0,0,0.07)',
              }}
            >
              <StarDoodle size={11} rotate={i * 15} />
              {l.label}
            </motion.a>
          ))}
        </div>

        {/* Auth row */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: open ? 1 : 0 }}
          transition={{ delay: open ? 0.14 : 0 }}
        >
          {isAuthenticated ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <p style={{ margin: '0 0 6px', fontFamily: "'Caveat', cursive", fontSize: 13, fontWeight: 700, color: '#15803d' }}>
                Hey, {user?.firstName || 'there'} 👋
              </p>
              {user?.role !== 'ADMIN' ? (
                <>
                  {[
                    { path: '/my-profile', icon: <UserCircle size={14} />, label: 'My Profile' },
                    { path: '/my-orders',  icon: <Package size={14} />,    label: 'My Orders' },
                    { path: '/cart',       icon: <ShoppingCart size={14} />, label: 'Cart' },
                  ].map(({ path, icon, label }) => (
                    <motion.button
                      key={path}
                      onClick={() => { navigate(path); onClose(); }}
                      whileHover={{ backgroundColor: 'rgba(21,128,61,0.1)' }}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 8,
                        padding: '8px 10px', background: 'rgba(21,128,61,0.04)',
                        border: '1.5px dashed rgba(21,128,61,0.25)', borderRadius: 9,
                        fontFamily: "'Caveat', cursive", fontSize: 14, fontWeight: 700,
                        color: '#1a1a1a', cursor: 'pointer', width: '100%',
                      }}
                    >
                      {icon} {label}
                    </motion.button>
                  ))}
                  <button onClick={() => { onLogout(); onClose(); }}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
                      padding: '7px 10px', background: 'rgba(239,68,68,0.06)',
                      border: '1.5px dashed rgba(239,68,68,0.3)', borderRadius: 9,
                      fontFamily: "'Caveat', cursive", fontSize: 13, fontWeight: 700,
                      color: '#ef4444', cursor: 'pointer', marginTop: 2,
                    }}
                  >
                    <LogOut size={13} /> Logout
                  </button>
                </>
              ) : (
                <div style={{ display: 'flex', gap: 6 }}>
                  <motion.a href="/admin/dashboard" onClick={onClose} whileHover={{ scale: 1.02 }}
                    style={{
                      flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
                      padding: '7px 10px', background: 'rgba(239,68,68,0.07)',
                      border: '1.5px dashed rgba(239,68,68,0.3)', borderRadius: 9,
                      textDecoration: 'none', fontFamily: "'Caveat', cursive",
                      fontSize: 13, fontWeight: 700, color: '#ef4444',
                    }}
                  >
                    <Shield size={13} /> Admin Panel
                  </motion.a>
                  <button onClick={() => { onLogout(); onClose(); }}
                    style={{
                      flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
                      padding: '7px 10px', background: 'rgba(239,68,68,0.06)',
                      border: '1.5px dashed rgba(239,68,68,0.3)', borderRadius: 9,
                      fontFamily: "'Caveat', cursive", fontSize: 13, fontWeight: 700,
                      color: '#ef4444', cursor: 'pointer',
                    }}
                  >
                    <LogOut size={13} /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', gap: 8 }}>
              {/* Compact inline CTA */}
              <motion.a href="/products" whileHover={{ scale: 1.02 }}
                style={{
                  flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  padding: '8px 10px', background: '#15803d', color: '#fff',
                  fontFamily: "'Permanent Marker', cursive", fontSize: 13,
                  textDecoration: 'none', borderRadius: 10,
                  border: '2px solid #15803d',
                  boxShadow: '2px 3px 0 rgba(21,100,50,0.35)',
                  whiteSpace: 'nowrap',
                }}
              >
                Get Started ✦
              </motion.a>
              <button onClick={() => { onOpenAuth(); onClose(); }}
                style={{
                  flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  padding: '8px 10px', background: 'transparent', color: '#15803d',
                  fontFamily: "'Caveat', cursive", fontSize: 14, fontWeight: 700,
                  borderRadius: 10, border: '2px dashed rgba(21,128,61,0.45)',
                  cursor: 'pointer', whiteSpace: 'nowrap',
                }}
              >
                Sign In
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

// ── Main Navbar ───────────────────────────────────────────────────────────────
export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const { isAuthenticated, user, logout } = useAuth();
  const { totalItems } = useCart();
  const { scrollY } = useScroll();
  const router = useRouter();

  useMotionValueEvent(scrollY, 'change', (y) => setScrolled(y > 60));
  React.useEffect(() => { setMounted(true); }, []);

  const navigate = (path: string) => router.push(path);
  const handleLogout = () => { logout(); router.push('/'); };
  const handleCartClick = () => router.push('/cart');

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400;600;700;900&family=Permanent+Marker&display=swap');

        /* ── Responsive visibility ── */
        .nav-desktop,
        .nav-desktop-cta { display: flex; }
        .nav-mobile-btn  { display: none; }

        @media (max-width: 767px) {
          .nav-desktop,
          .nav-desktop-cta { display: none !important; }
          .nav-mobile-btn  { display: flex !important; }
        }
        @media (min-width: 768px) {
          .nav-desktop,
          .nav-desktop-cta { display: flex !important; }
          .nav-mobile-btn  { display: none !important; }
        }
      `}</style>

      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100 }}
      >
        {/* ── Pill ── */}
        <div style={{
          margin: scrolled ? '8px 12px' : '10px 12px',
          borderRadius: 20,
          background: scrolled ? 'rgba(255,254,245,0.97)' : 'transparent',
          backdropFilter: scrolled ? 'blur(24px)' : 'none',
          boxShadow: scrolled ? '4px 5px 0 rgba(21,128,61,0.16), 0 2px 24px rgba(0,0,0,0.07)' : 'none',
          border: scrolled ? '2px dashed rgba(21,128,61,0.28)' : '2px solid transparent',
          transition: 'all 0.4s ease',
        }}>
          <div style={{
            maxWidth: 1200, margin: '0 auto',
            padding: '0 16px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            gap: 12, height: 58,
          }}>
            {/* Logo */}
            <DoodleLogo />

            {/* Desktop center nav */}
            <nav className="nav-desktop" style={{ alignItems: 'center', gap: 30 }}>
              <NavLink href="/about" delay={0.2}>About</NavLink>
              <NavLink href="/products" delay={0.25}>Products</NavLink>
            </nav>

            {/* Right: desktop buttons + mobile hamburger */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>

              {/* Desktop auth row — CSS class controls display */}
              <div className="nav-desktop-cta" style={{ alignItems: 'center', gap: 8, position: 'relative' }}>
                <DoodleCTA delay={0.6} />
                <CartIconButton delay={0.62} onClick={handleCartClick} totalItems={totalItems} />
                {mounted && isAuthenticated ? (
                  <>
                  <ProfileIconButton delay={0.65} onClick={() => setProfileDropdownOpen(v => !v)} />
                    <ProfileDropdown open={profileDropdownOpen} onClose={() => setProfileDropdownOpen(false)} navigate={navigate} />
                  </>
                ) : mounted ? (
                  <LoginButton delay={0.65} onClick={() => setAuthModalOpen(true)} />
                ) : null}
              </div>

              {/* Mobile hamburger — CSS class controls display, NO inline display */}
              <motion.button
                onClick={() => setMenuOpen(v => !v)}
                whileTap={{ scale: 0.88 }}
                className="nav-mobile-btn"
                style={{
                  alignItems: 'center', justifyContent: 'center',
                  width: 40, height: 40,
                  background: menuOpen ? 'rgba(21,128,61,0.12)' : 'rgba(255,255,255,0.9)',
                  border: '2px dashed rgba(21,128,61,0.4)',
                  borderRadius: 10, cursor: 'pointer',
                  transition: 'background 0.2s', padding: 0,
                }}
                aria-label="Toggle menu"
              >
                <motion.div
                  animate={{ rotate: menuOpen ? 90 : 0 }}
                  transition={{ duration: 0.2 }}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  {menuOpen
                    ? <X size={18} strokeWidth={2.5} color="#1a1a1a" />
                    : <Menu size={18} strokeWidth={2.5} color="#1a1a1a" />
                  }
                </motion.div>
              </motion.button>
            </div>
          </div>
        </div>

        {/* ── Mobile drawer — lives OUTSIDE pill, below it ── */}
        <MobileDrawer
          open={menuOpen}
          onClose={() => setMenuOpen(false)}
          onOpenAuth={() => setAuthModalOpen(true)}
          isAuthenticated={mounted && isAuthenticated}
          user={user}
          onLogout={handleLogout}
          navigate={navigate}
        />
      </motion.nav>

      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </>
  );
}