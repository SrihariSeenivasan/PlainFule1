'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Bell, ChevronDown, LogOut, Home, User, Shield } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

const FONT = "'Segoe UI', 'Roboto', sans-serif";

// ─── Route label map ──────────────────────────────────────────────────────────

const ROUTE_LABELS: Record<string, string> = {
  '/admin/dashboard': 'Dashboard',
  '/admin/orders':    'Orders',
  '/admin/returns':   'Returns',
  '/admin/payments':  'Payments',
  '/admin/products':  'Products',
  '/admin/inventory': 'Inventory',
  '/admin/users':     'Users',
  '/admin/faq':       'FAQs',
};

// ─── Avatar ───────────────────────────────────────────────────────────────────

interface AvatarProps {
  firstName?: string;
  lastName?: string;
  size?: number;
}

function Avatar({ firstName, lastName, size = 32 }: AvatarProps) {
  const initials = `${firstName?.[0] ?? ''}${lastName?.[0] ?? ''}`.toUpperCase() || 'A';
  return (
    <div style={{
      width: size, height: size,
      borderRadius: '50%',
      background: 'linear-gradient(135deg, #16a34a, #15803d)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.38, fontWeight: 700,
      color: '#fff', fontFamily: FONT,
      flexShrink: 0, userSelect: 'none',
      letterSpacing: '0.03em',
    }}>
      {initials}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function AdminHeader() {
  const { user, logout } = useAuth();
  const router           = useRouter();
  const pathname         = usePathname();

  const [menuOpen,  setMenuOpen]  = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const menuRef  = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  const pageLabel = ROUTE_LABELS[pathname] ?? 'Admin';
  const fullName  = `${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim() || 'Admin';
  const isAdmin   = user?.role === 'ADMIN';

  const handleLogout = useCallback(() => {
    logout();
    router.push('/');
  }, [logout, router]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current  && !menuRef.current.contains(e.target as Node))  setMenuOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <>
      <style>{`
        @keyframes hdr-drop {
          from { opacity: 0; transform: translateY(-5px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .hdr-dd { animation: hdr-drop 0.14s ease forwards; }

        .hdr-icon-btn {
          width: 36px; height: 36px; border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          background: transparent;
          border: 1px solid rgba(255,255,255,0.09);
          color: #6b7280; cursor: pointer;
          transition: background 0.14s, border-color 0.14s, color 0.14s;
          flex-shrink: 0; position: relative;
        }
        .hdr-icon-btn:hover       { background: rgba(255,255,255,0.06); border-color: rgba(255,255,255,0.15); color: #e5e7eb; }
        .hdr-icon-btn.hdr-active  { background: rgba(74,222,128,0.1); border-color: rgba(74,222,128,0.3); color: #4ade80; }

        .hdr-user-btn {
          display: flex; align-items: center; gap: 8px;
          padding: 4px 10px 4px 4px;
          background: transparent;
          border: 1px solid rgba(255,255,255,0.09);
          border-radius: 10px; cursor: pointer;
          transition: background 0.14s, border-color 0.14s;
          font-family: ${FONT};
        }
        .hdr-user-btn:hover       { background: rgba(255,255,255,0.05); border-color: rgba(255,255,255,0.14); }
        .hdr-user-btn.hdr-active  { background: rgba(255,255,255,0.06); border-color: rgba(255,255,255,0.14); }

        .hdr-mrow {
          display: flex; align-items: center; gap: 9px;
          padding: 8px 12px; border-radius: 7px;
          font-size: 13px; font-weight: 500;
          color: #9ca3af; cursor: pointer;
          transition: background 0.12s, color 0.12s;
          background: none; border: none;
          width: 100%; text-align: left;
          font-family: ${FONT};
        }
        .hdr-mrow:hover        { background: rgba(255,255,255,0.05); color: #f3f4f6; }
        .hdr-mrow.hdr-danger:hover { background: rgba(239,68,68,0.1); color: #f87171; }

        /* responsive helpers */
        .hdr-sm-only { display: none; }
        .hdr-md-only { display: none; }
        .hdr-mobile-brand { display: flex; }
        @media (min-width: 540px) { .hdr-sm-only { display: flex !important; } }
        @media (min-width: 768px) {
          .hdr-md-only       { display: flex !important; }
          .hdr-mobile-brand  { display: none !important; }
        }
      `}</style>

      <header style={{
        position: 'sticky', top: 0, zIndex: 40,
        height: 56,
        background: '#0b1120',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px',
        gap: 16,
        fontFamily: FONT,
      }}>

        {/* ── LEFT ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>

          {/* Mobile brand */}
          <div className="hdr-mobile-brand" style={{ alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 30, height: 30, borderRadius: 8,
              background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
            </div>
            <span style={{ fontSize: 16, fontWeight: 700, color: '#f9fafb', letterSpacing: '-0.01em' }}>
              PlainFuel
            </span>
          </div>

          {/* Desktop page label */}
          <div className="hdr-md-only" style={{ alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 3, height: 18, borderRadius: 2,
              background: 'linear-gradient(to bottom, #4ade80, #16a34a)',
              flexShrink: 0,
            }} />
            <h2 style={{
              margin: 0,
              fontSize: 16, fontWeight: 600,
              color: '#f3f4f6',
              letterSpacing: '-0.01em',
              whiteSpace: 'nowrap',
            }}>
              {pageLabel}
            </h2>
          </div>
        </div>

        {/* ── RIGHT ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>

          {/* Bell */}
          <div ref={notifRef} style={{ position: 'relative' }}>
            <button
              type="button"
              className={`hdr-icon-btn${notifOpen ? ' hdr-active' : ''}`}
              onClick={() => { setNotifOpen(v => !v); setMenuOpen(false); }}
            >
              <Bell size={16} />
              {/* unread dot */}
              <span style={{
                position: 'absolute', top: 8, right: 8,
                width: 6, height: 6, borderRadius: '50%',
                background: '#22c55e',
                border: '1.5px solid #0b1120',
              }} />
            </button>

            {notifOpen && (
              <div className="hdr-dd" style={{
                position: 'absolute', top: 'calc(100% + 10px)', right: 0,
                width: 272,
                background: '#111827',
                border: '1px solid rgba(255,255,255,0.09)',
                borderRadius: 12,
                boxShadow: '0 12px 40px rgba(0,0,0,0.5)',
                zIndex: 100, overflow: 'hidden',
                fontFamily: FONT,
              }}>
                {/* header */}
                <div style={{
                  padding: '11px 14px 10px',
                  borderBottom: '1px solid rgba(255,255,255,0.06)',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                    Notifications
                  </span>
                  <span style={{
                    fontSize: 10, fontWeight: 700, color: '#4ade80',
                    background: 'rgba(74,222,128,0.12)',
                    border: '1px solid rgba(74,222,128,0.2)',
                    padding: '2px 7px', borderRadius: 20,
                  }}>
                    1 new
                  </span>
                </div>

                {/* notification item */}
                <div style={{ padding: '8px' }}>
                  <div style={{
                    display: 'flex', gap: 10, alignItems: 'flex-start',
                    padding: '10px 12px', borderRadius: 8,
                    background: 'rgba(74,222,128,0.06)',
                    border: '1px solid rgba(74,222,128,0.1)',
                  }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                      background: 'rgba(74,222,128,0.12)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 8h14M5 8a2 2 0 010-4h14a2 2 0 010 4M5 8l1 12h12L19 8" />
                      </svg>
                    </div>
                    <div>
                      <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: '#e5e7eb', lineHeight: 1.4 }}>
                        New order received
                      </p>
                      <p style={{ margin: '3px 0 0', fontSize: 11, color: '#4b5563' }}>Just now</p>
                    </div>
                  </div>
                </div>

                <p style={{ margin: 0, padding: '7px 14px 11px', fontSize: 11, color: '#374151', textAlign: 'center' }}>
                  No more notifications
                </p>
              </div>
            )}
          </div>

          {/* User menu */}
          <div ref={menuRef} style={{ position: 'relative' }}>
            <button
              type="button"
              className={`hdr-user-btn${menuOpen ? ' hdr-active' : ''}`}
              onClick={() => { setMenuOpen(v => !v); setNotifOpen(false); }}
            >
              <Avatar firstName={user?.firstName} lastName={user?.lastName} size={28} />

              {/* name + role - sm+ only */}
              <div className="hdr-sm-only" style={{ flexDirection: 'column', gap: 1, alignItems: 'flex-start' }}>
                <span style={{
                  fontSize: 13, fontWeight: 600, color: '#f3f4f6',
                  lineHeight: 1.2, whiteSpace: 'nowrap',
                  maxWidth: 110, overflow: 'hidden', textOverflow: 'ellipsis',
                }}>
                  {fullName}
                </span>
                <span style={{
                  fontSize: 10, fontWeight: 600,
                  color: isAdmin ? '#60a5fa' : '#4ade80',
                }}>
                  {isAdmin ? 'Admin' : 'User'}
                </span>
              </div>

              <ChevronDown
                size={13}
                className="hdr-sm-only"
                style={{
                  color: '#6b7280',
                  transition: 'transform 0.2s',
                  transform: menuOpen ? 'rotate(180deg)' : 'none',
                  flexShrink: 0,
                }}
              />
            </button>

            {menuOpen && (
              <div className="hdr-dd" style={{
                position: 'absolute', top: 'calc(100% + 10px)', right: 0,
                width: 220,
                background: '#111827',
                border: '1px solid rgba(255,255,255,0.09)',
                borderRadius: 12,
                boxShadow: '0 12px 40px rgba(0,0,0,0.5)',
                zIndex: 100, overflow: 'hidden',
                fontFamily: FONT,
              }}>
                {/* profile strip */}
                <div style={{
                  padding: '14px 14px 12px',
                  borderBottom: '1px solid rgba(255,255,255,0.07)',
                  display: 'flex', alignItems: 'center', gap: 10,
                }}>
                  <Avatar firstName={user?.firstName} lastName={user?.lastName} size={38} />
                  <div style={{ minWidth: 0 }}>
                    <p style={{
                      margin: 0, fontSize: 14, fontWeight: 700,
                      color: '#f9fafb',
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>
                      {fullName}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 3 }}>
                      {isAdmin
                        ? <Shield size={10} style={{ color: '#60a5fa' }} />
                        : <User   size={10} style={{ color: '#4ade80' }} />}
                      <span style={{
                        fontSize: 11, fontWeight: 600,
                        color: isAdmin ? '#60a5fa' : '#4ade80',
                      }}>
                        {isAdmin ? 'Administrator' : 'User'}
                      </span>
                    </div>
                    {user?.email && (
                      <p style={{
                        margin: '3px 0 0', fontSize: 11, color: '#4b5563',
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      }}>
                        {user.email}
                      </p>
                    )}
                  </div>
                </div>

                {/* menu actions */}
                <div style={{ padding: 6 }}>
                  <button
                    type="button"
                    className="hdr-mrow"
                    onClick={() => { router.push('/?view=home'); setMenuOpen(false); }}
                  >
                    <Home size={14} /> Back to Home
                  </button>
                  <div style={{ height: 1, background: 'rgba(255,255,255,0.05)', margin: '4px 0' }} />
                  <button
                    type="button"
                    className="hdr-mrow hdr-danger"
                    onClick={handleLogout}
                  >
                    <LogOut size={14} /> Logout
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      </header>
    </>
  );
}