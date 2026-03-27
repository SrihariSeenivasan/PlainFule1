'use client';

import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import React from 'react';
import { useRouter } from 'next/navigation';
import { Shield, LogOut, User, Menu, X, ShoppingCart, Package, UserCircle, ChevronDown, Sparkles } from 'lucide-react';
import AuthModal from './AuthModal';
import { useAuth } from '@/lib/auth-context';
import { useCart } from '@/lib/cart-context';
import { BRAND, FONTS } from '@/lib/typography';

// ── Doodle Elements ────────────────────────────────────────────────────────────
const StarDoodle = ({ size = 16, rotation = 0, style = {}, color = BRAND.burgundy }: {
  size?: number; rotation?: number; style?: React.CSSProperties; color?: string
}) => (
  <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden
    style={{ transform: `rotate(${rotation}deg)`, flexShrink: 0, ...style }}>
    <path d="M12,2 L13.2,9 L20,9 L14.6,13.4 L16.6,20 L12,15.8 L7.4,20 L9.4,13.4 L4,9 L10.8,9 Z"
      fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// ── Nav Link ──────────────────────────────────────────────────────────────────
const NavLink = ({ href, children, accent = false, delay = 0, onClick }: {
  href: string; children: React.ReactNode; accent?: boolean; delay?: number; onClick?: () => void
}) => {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -1 }}
    >
      <Link
        href={onClick ? '#' : href}
        onClick={onClick ? (e: React.MouseEvent) => { e.preventDefault(); onClick(); } : undefined}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          position: 'relative',
          fontFamily: FONTS.main,
          fontWeight: 700,
          fontSize: 12.5,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: hovered || accent ? BRAND.burgundy : BRAND.espresso,
          textDecoration: 'none',
          padding: '8px 14px',
          transition: 'all 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
        }}
      >
        {children}
        {hovered && (
          <motion.div
            initial={{ scale: 0, opacity: 0, rotate: '-45deg' }}
            animate={{ scale: 1, opacity: 1, rotate: '0deg' }}
            style={{ position: 'absolute', top: -4, right: 0 }}
          >
            <StarDoodle size={10} rotation={15} color={BRAND.taupe} />
          </motion.div>
        )}
        <motion.span
          initial={{ scaleX: 0 }}
          animate={{ scaleX: hovered || accent ? 1 : 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: 'absolute',
            bottom: 6,
            left: 14,
            width: '60%',
            height: 1.5,
            background: BRAND.burgundy,
            transformOrigin: 'left',
            borderRadius: 1,
            opacity: 0.7,
          }}
        />
      </Link>
    </motion.div>
  );
};

// ── Logo ──────────────────────────────────────────────────────────────────────
const PremiumLogo = () => (
  <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 6, textDecoration: 'none', flexShrink: 0, position: 'relative' }}>
    <motion.div
      whileHover={{ scale: 1.05, rotate: ['-1deg', '1deg', '-1deg'] }}
      transition={{ duration: 0.4 }}
    >
      <Image 
        src="/images/plainfuel.png" 
        alt="PlainFuel" 
        width={130} 
        height={32} 
        priority
        style={{ height: 'auto', maxWidth: 130 }} 
      />
    </motion.div>
    <motion.div
      animate={{ 
        rotate: ['0deg', '360deg'],
        scale: [1, 1.1, 1],
      }}
      transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
      style={{ position: 'absolute', top: -8, right: -12, opacity: 0.4 }}
    >
      <StarDoodle size={12} rotation={0} color={BRAND.taupe} />
    </motion.div>
  </Link>
);

// ── Desktop CTA ───────────────────────────────────────────────────────────────
const PremiumCTA = ({ delay = 0 }: { delay?: number }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link 
        href="/products"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 10,
          background: `linear-gradient(135deg, ${BRAND.espresso} 0%, ${BRAND.burgundy} 100%)`,
          color: BRAND.white,
          fontFamily: FONTS.main,
          fontSize: 10.5,
          fontWeight: 800,
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          textDecoration: 'none',
          borderRadius: 6,
          padding: '12px 26px',
          boxShadow: hovered 
            ? `0 12px 24px rgba(114,56,61,0.3), inset 0 1px 1px rgba(255,255,255,0.2)` 
            : `0 6px 16px rgba(114,56,61,0.2), inset 0 1px 1px rgba(255,255,255,0.1)`,
          transition: 'all 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
          cursor: 'pointer',
          whiteSpace: 'nowrap',
          border: `1px solid ${BRAND.burgundy}40`,
          position: 'relative',
          overflow: 'hidden',
          transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
        }}
      >
        {/* Shimmer effect */}
        <motion.div
          animate={{ x: hovered ? ['-100%', '200%'] : '-100%' }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          style={{
            position: 'absolute', top: 0, left: 0, width: '40%', height: '100%',
            background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.2), transparent)',
            transform: 'skewX(-20deg)',
          }}
        />
        Get Started
        <motion.span
          animate={{ x: hovered ? [0, 4, 0] : 0 }}
          transition={{ duration: 0.3, repeat: hovered ? Infinity : 0 }}
        >
          <Sparkles size={12} />
        </motion.span>
      </Link>
    </motion.div>
  );
};

// ── Icon Button ─────────────────────────────────────────────────────────────
const PremiumIconBtn = ({ onClick, delay = 0, children, badge, ariaLabel }: {
  onClick: () => void; delay?: number;
  children: React.ReactNode; badge?: number; ariaLabel: string;
}) => {
  return (
    <motion.button 
      onClick={onClick}
      initial={{ opacity: 0, scale: 0.8 }} 
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ y: -3, scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      style={{
        position: 'relative',
        display: 'inline-flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        width: 42, 
        height: 42,
        background: 'rgba(255,255,255,0.1)',
        backdropFilter: 'blur(8px)',
        color: BRAND.espresso,
        border: `1px solid ${BRAND.stone}40`,
        borderRadius: 12,
        cursor: 'pointer', 
        padding: 0,
        transition: 'all 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
      }} 
      aria-label={ariaLabel}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = BRAND.taupe;
        e.currentTarget.style.background = BRAND.white;
        e.currentTarget.style.boxShadow = `0 8px 20px ${BRAND.stone}40`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = `${BRAND.stone}40`;
        e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.05)';
      }}
    >
      {children}
      {badge != null && badge > 0 && (
        <motion.span
          initial={{ scale: 0, rotate: '-20deg' }} 
          animate={{ scale: 1, rotate: '0deg' }}
          style={{
            position: 'absolute', 
            top: -4, 
            right: -4,
            width: 20, 
            height: 20,
            background: BRAND.burgundy, 
            color: '#fff',
            borderRadius: '50%',
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            fontSize: 10, 
            fontWeight: 800,
            border: `2.5px solid ${BRAND.white}`,
            boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
          }}
        >
          {badge > 9 ? '9+' : badge}
        </motion.span>
      )}
    </motion.button>
  );
};

// ── Profile Dropdown ──────────────────────────────────────────────────────────
const ProfileDropdown = ({ open, onClose, navigate }: { open: boolean; onClose: () => void; navigate: (path: string) => void }) => {
  const { logout, user } = useAuth();
  const handleLogout = () => { logout(); onClose(); window.location.href = '/'; };
  const handleNav = (path: string) => { onClose(); navigate(path); };

  const menuItems = user?.role !== 'ADMIN' ? [
    { path: '/my-profile', icon: <UserCircle size={16} />, label: 'My Profile' },
    { path: '/my-orders', icon: <Package size={16} />, label: 'My Orders' },
    { path: '/cart', icon: <ShoppingCart size={16} />, label: 'Cart' },
  ] : [];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.94, rotateX: '-15deg' }}
          animate={{ opacity: 1, y: 0, scale: 1, rotateX: '0deg' }}
          exit={{ opacity: 0, y: 15, scale: 0.94 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          style={{
            transformOrigin: 'top right',
            perspective: '1000px',
            position: 'absolute', 
            top: 'calc(100% + 18px)', 
            right: 0,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(32px) saturate(160%)',
            borderRadius: 16, 
            padding: '10px',
            border: `1px solid ${BRAND.silver}`,
            boxShadow: `0 24px 60px rgba(50,45,41,0.18), 0 0 0 1px rgba(255,255,255,0.4)`,
            zIndex: 300, 
            minWidth: 230,
          }}
        >
          <div style={{
            padding: '14px 16px',
            marginBottom: 8,
            background: `linear-gradient(135deg, ${BRAND.burgundy}15 0%, ${BRAND.burgundy}05 100%)`,
            borderRadius: 10,
            border: `1px solid ${BRAND.burgundy}10`,
            position: 'relative',
            overflow: 'hidden',
          }}>
            <p style={{ margin: 0, fontSize: 8.5, color: BRAND.taupe, fontWeight: 800, letterSpacing: '0.2em', textTransform: 'uppercase', opacity: 0.7 }}>Account Member</p>
            <p style={{ margin: '4px 0 0', fontSize: 16, fontWeight: 800, color: BRAND.espresso, fontFamily: FONTS.main }}>
              {user?.firstName || 'User'}
            </p>
            <StarDoodle size={10} style={{ position: 'absolute', top: 12, right: 12, opacity: 0.3 }} color={BRAND.taupe} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {menuItems.map(({ path, icon, label }) => (
              <motion.button 
                key={path}
                onClick={() => handleNav(path)}
                whileHover={{ backgroundColor: `${BRAND.burgundy}08`, x: 5 }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px',
                  border: 'none', background: 'transparent', borderRadius: 8,
                  fontFamily: FONTS.main, fontSize: 13.5, fontWeight: 600,
                  color: BRAND.espresso, cursor: 'pointer', width: '100%', textAlign: 'left',
                  transition: 'all 0.25s',
                }}>
                <span style={{ color: BRAND.burgundy, display: 'flex' }}>{icon}</span> {label}
              </motion.button>
            ))}

            {user?.role === 'ADMIN' && (
              <motion.a href="/admin/dashboard" onClick={onClose}
                whileHover={{ backgroundColor: 'rgba(239,68,68,0.05)', x: 5 }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px',
                  textDecoration: 'none', borderRadius: 8,
                  fontFamily: FONTS.main, fontSize: 13.5, fontWeight: 600,
                  color: '#ef4444', transition: 'all 0.25s',
                }}>
                <Shield size={16} /> Admin Panel
              </motion.a>
            )}

            <div style={{ height: 1.5, background: `${BRAND.stone}40`, margin: '6px 12px' }} />

            <motion.button onClick={handleLogout}
              whileHover={{ backgroundColor: 'rgba(239,68,68,0.05)', x: 5 }}
              style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px',
                border: 'none', background: 'transparent', borderRadius: 8,
                fontFamily: FONTS.main, fontSize: 13.5, fontWeight: 600,
                color: '#ef4444', cursor: 'pointer', width: '100%', textAlign: 'left',
                transition: 'all 0.25s',
              }}>
              <LogOut size={16} /> Logout
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// ── Mobile Drawer ─────────────────────────────────────────────────────────────
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
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'fixed', inset: 0, background: `rgba(50,45,41,0.4)`,
              backdropFilter: 'blur(12px)', zIndex: 190,
            }}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 220 }}
            style={{
              position: 'fixed', top: 12, right: 12, bottom: 12,
              width: '85%', maxWidth: 340,
              background: 'rgba(255, 255, 255, 0.92)',
              backdropFilter: 'blur(32px) saturate(180%)',
              zIndex: 200, padding: '80px 32px 40px',
              display: 'flex', flexDirection: 'column',
              borderRadius: 24,
              border: `1px solid ${BRAND.silver}`,
              boxShadow: '-15px 0 50px rgba(0,0,0,0.15)',
            }}
          >
            <StarDoodle size={40} rotation={15} style={{ position: 'absolute', top: 32, right: 32, opacity: 0.1 }} color={BRAND.taupe} />
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                {links.map((link, i) => (
                  <motion.div key={link.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.1 }}
                  >
                    <Link
                      href={link.href}
                      onClick={onClose}
                      style={{
                        fontFamily: FONTS.main,
                        fontSize: 22, fontWeight: 800,
                        color: BRAND.espresso, textDecoration: 'none',
                        letterSpacing: '0.02em',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                      }}
                    >
                      {link.label}
                      <StarDoodle size={14} rotation={i * 20} style={{ opacity: 0.4 }} color={BRAND.taupe} />
                    </Link>
                  </motion.div>
                ))}
              </div>

              <div style={{ height: 1, background: `linear-gradient(to right, ${BRAND.stone}60, transparent)` }} />

              {!isAuthenticated ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <motion.button 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    onClick={() => { onOpenAuth(); onClose(); }}
                    style={{
                      padding: '18px',
                      background: BRAND.espresso, color: BRAND.white,
                      fontFamily: FONTS.main, fontSize: 13, fontWeight: 800,
                      letterSpacing: '0.2em', textTransform: 'uppercase',
                      borderRadius: 12, border: 'none', cursor: 'pointer',
                      boxShadow: `0 8px 24px rgba(50,45,41,0.2)`,
                    }}
                  >
                    Get Started
                  </motion.button>
                  <motion.button 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    onClick={() => { onOpenAuth(); onClose(); }}
                    style={{
                      padding: '18px',
                      background: 'transparent', color: BRAND.espresso,
                      fontFamily: FONTS.main, fontSize: 13, fontWeight: 800,
                      letterSpacing: '0.2em', textTransform: 'uppercase',
                      borderRadius: 12, border: `2px solid ${BRAND.espresso}`,
                      cursor: 'pointer',
                    }}
                  >
                    Sign In
                  </motion.button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  <div style={{ marginBottom: 12 }}>
                    <p style={{ margin: 0, fontSize: 14, color: BRAND.taupe, opacity: 0.7, fontFamily: FONTS.main, fontWeight: 600 }}>Welcome back,</p>
                    <p style={{ margin: '4px 0 0', fontSize: 24, fontWeight: 900, color: BRAND.espresso, fontFamily: FONTS.main }}>
                      {user?.firstName}
                    </p>
                  </div>
                  <button onClick={() => { navigate('/my-profile'); onClose(); }} style={mobileBtnStyle}>Profile</button>
                  <button onClick={() => { navigate('/my-orders'); onClose(); }} style={mobileBtnStyle}>Orders</button>
                  <button onClick={() => { navigate('/cart'); onClose(); }} style={mobileBtnStyle}>Cart</button>
                  <button onClick={() => { onLogout(); onClose(); }} style={{ ...mobileBtnStyle, color: '#ef4444', background: 'rgba(239,68,68,0.05)', borderColor: 'rgba(239,68,68,0.1)' }}>Logout</button>
                </div>
              )}
            </div>
            
            {/* Signature at bottom */}
            <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'center', opacity: 0.2 }}>
              <p style={{ fontFamily: FONTS.accent, fontSize: 18, color: BRAND.taupe }}>Fuel your day nicely ✨</p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const mobileBtnStyle = {
  padding: '16px 20px',
  background: `rgba(239,233,225,0.6)`,
  color: BRAND.espresso,
  fontFamily: FONTS.main,
  fontSize: 15,
  fontWeight: 700,
  borderRadius: 12,
  border: `1px solid ${BRAND.stone}40`,
  cursor: 'pointer',
  textAlign: 'left' as const,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
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

  useMotionValueEvent(scrollY, 'change', (y) => setScrolled(y > 20));
  useEffect(() => { setMounted(true); }, []);

  const navigate = (path: string) => router.push(path);
  const handleLogout = () => { logout(); router.push('/'); };
  const handleCartClick = () => router.push('/cart');

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800;900&family=Caveat:wght@400;600;700&display=swap');

        .nav-desktop { display: flex; align-items: center; gap: 4px; }
        .nav-mobile-btn { display: none; }

        @media (max-width: 860px) {
          .nav-desktop { display: none !important; }
          .nav-mobile-btn { display: flex !important; }
        }
      `}</style>

      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        style={{ 
          position: 'fixed', 
          top: 0, left: 0, right: 0, 
          zIndex: 1000,
          padding: scrolled ? '12px 20px' : '20px 32px',
          transition: 'all 0.6s cubic-bezier(0.22, 1, 0.36, 1)',
        }}
      >
        <div style={{
          maxWidth: 1360,
          margin: '0 auto',
          height: scrolled ? 68 : 74,
          background: scrolled ? 'rgba(255, 255, 255, 0.85)' : 'rgba(255, 255, 255, 0.25)',
          backdropFilter: 'blur(36px) saturate(180%)',
          WebkitBackdropFilter: 'blur(36px) saturate(180%)',
          borderRadius: scrolled ? 24 : 16,
          border: `1px solid ${scrolled ? BRAND.silver : 'rgba(255, 255, 255, 0.3)'}`,
          boxShadow: scrolled ? `0 15px 45px rgba(50,45,41,0.1), inset 0 0 0 1px rgba(255,255,255,0.4)` : 'none',
          padding: '0 28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          transition: 'all 0.6s cubic-bezier(0.22, 1, 0.36, 1)',
        }}>
          {/* Logo */}
          <PremiumLogo />

          {/* Core Navigation */}
          <div className="nav-desktop">
            <div style={{ display: 'flex', gap: 4, background: `rgba(50,45,41,0.04)`, padding: '4px', borderRadius: 14, marginRight: 12 }}>
              <NavLink href="/about">About</NavLink>
              <NavLink href="/products">Products</NavLink>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <PremiumIconBtn 
                onClick={handleCartClick} 
                badge={totalItems} 
                ariaLabel="Shopping cart"
              >
                <ShoppingCart size={19} strokeWidth={2.2} />
              </PremiumIconBtn>

              {mounted && isAuthenticated ? (
                <div style={{ position: 'relative' }}>
                  <PremiumIconBtn 
                    onClick={() => setProfileDropdownOpen(v => !v)}
                    ariaLabel="User profile"
                  >
                    <User size={19} strokeWidth={2.2} />
                  </PremiumIconBtn>
                  <ProfileDropdown 
                    open={profileDropdownOpen} 
                    onClose={() => setProfileDropdownOpen(false)} 
                    navigate={navigate} 
                  />
                </div>
              ) : (
                <NavLink href="#" onClick={() => setAuthModalOpen(true)}>Sign In</NavLink>
              )}

              <PremiumCTA />
            </div>
          </div>

          {/* Mobile hamburger */}
          <div className="nav-mobile-btn" style={{ alignItems: 'center', gap: 14 }}>
            <PremiumIconBtn 
              onClick={handleCartClick} 
              badge={totalItems} 
              ariaLabel="Shopping cart"
            >
              <ShoppingCart size={19} strokeWidth={2.2} />
            </PremiumIconBtn>
            
            <motion.button
              onClick={() => setMenuOpen(v => !v)}
              whileTap={{ scale: 0.9 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 44,
                height: 44,
                background: BRAND.espresso,
                borderRadius: 14,
                border: 'none',
                cursor: 'pointer',
                color: BRAND.white,
                boxShadow: `0 8px 16px rgba(50,45,41,0.2)`,
              }}
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </motion.button>
          </div>
        </div>

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