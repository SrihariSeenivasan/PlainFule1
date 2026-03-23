'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import {
  LayoutDashboard, Package, CreditCard,
  ShoppingBag, Users, Home, LogOut,
  MoreHorizontal, X, Boxes, HelpCircle, RotateCcw,
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

const FONT = "'Segoe UI', 'Roboto', sans-serif";

// ─── Nav config ───────────────────────────────────────────────────────────────

interface NavItem {
  href: string;
  icon: React.ComponentType<{ size?: number }>;
  label: string;
}

const ALL_ITEMS: NavItem[] = [
  { href: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/orders',    icon: Package,         label: 'Orders'    },
  { href: '/admin/returns',   icon: RotateCcw,       label: 'Returns'   },
  { href: '/admin/payments',  icon: CreditCard,      label: 'Payments'  },
  { href: '/admin/products',  icon: ShoppingBag,     label: 'Products'  },
  { href: '/admin/inventory', icon: Boxes,           label: 'Inventory' },
  { href: '/admin/users',     icon: Users,           label: 'Users'     },
  { href: '/admin/faq',       icon: HelpCircle,      label: 'FAQs'      },
];

const PRIMARY_NAV: NavItem[] = [
  { href: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/orders',    icon: Package,         label: 'Orders'    },
  { href: '/admin/products',  icon: ShoppingBag,     label: 'Products'  },
];

const MORE_ITEMS: NavItem[] = [
  { href: '/admin/payments',  icon: CreditCard,  label: 'Payments'  },
  { href: '/admin/returns',   icon: RotateCcw,   label: 'Returns'   },
  { href: '/admin/inventory', icon: Boxes,       label: 'Inventory' },
  { href: '/admin/users',     icon: Users,       label: 'Users'     },
  { href: '/admin/faq',       icon: HelpCircle,  label: 'FAQs'      },
];

// ─── Desktop nav link ─────────────────────────────────────────────────────────

interface DesktopLinkProps { item: NavItem; active: boolean }

function DesktopLink({ item, active }: DesktopLinkProps) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '9px 12px', borderRadius: 8,
        textDecoration: 'none',
        fontFamily: FONT,
        fontSize: 13,
        fontWeight: active ? 600 : 400,
        color: active ? '#f9fafb' : '#6b7280',
        background: active ? 'rgba(255,255,255,0.07)' : 'transparent',
        transition: 'background 0.13s, color 0.13s',
        borderLeft: active ? '3px solid #22c55e' : '3px solid transparent',
        paddingLeft: active ? 10 : 12,
      }}
      onMouseEnter={e => {
        if (!active) {
          const el = e.currentTarget as HTMLAnchorElement;
          el.style.background = 'rgba(255,255,255,0.04)';
          el.style.color = '#d1d5db';
        }
      }}
      onMouseLeave={e => {
        if (!active) {
          const el = e.currentTarget as HTMLAnchorElement;
          el.style.background = 'transparent';
          el.style.color = '#6b7280';
        }
      }}
    >
      <Icon size={16} />
      <span style={{ flex: 1 }}>{item.label}</span>
    </Link>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function AdminSidebar() {
  const { logout } = useAuth();
  const router     = useRouter();
  const pathname   = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);

  const handleLogout = () => { logout(); router.push('/'); };
  const isActive = (href: string) => pathname === href;

  return (
    <>
      <style>{`
        @keyframes sb-up {
          from { transform: translateY(20px); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
        .sb-drawer { animation: sb-up 0.2s ease forwards; }

        /* Desktop sidebar — visible md+ */
        .sb-sidebar { display: none; }
        @media (min-width: 768px) { .sb-sidebar { display: flex; } }

        /* Mobile bottom bar — hidden md+ */
        .sb-bottom  { display: flex; }
        @media (min-width: 768px) { .sb-bottom { display: none; } }

        .sb-tab {
          flex: 1; display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          gap: 3px; padding: 7px 4px;
          text-decoration: none;
          color: #4b5563;
          font-family: ${FONT};
          transition: color 0.14s;
          background: none; border: none; cursor: pointer;
        }
        .sb-tab:hover  { color: #9ca3af; }
        .sb-tab.sb-act { color: #22c55e; }
        .sb-tab span   { font-size: 10px; font-weight: 500; }
        .sb-tab.sb-act span { font-weight: 700; }
      `}</style>

      {/* ─── Desktop Sidebar ─── */}
      <aside className="sb-sidebar" style={{
        flexDirection: 'column',
        width: 216,
        background: '#0b1120',
        borderRight: '1px solid rgba(255,255,255,0.07)',
        height: '100%',
        flexShrink: 0,
        fontFamily: FONT,
      }}>
        {/* Brand */}
        <div style={{
          padding: '18px 16px 14px',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          flexShrink: 0,
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <div style={{
            width: 32, height: 32, borderRadius: 9,
            background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
          </div>
          <div>
            <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#f9fafb', lineHeight: 1.2, letterSpacing: '-0.01em' }}>
              PlainFuel
            </p>
            <p style={{ margin: 0, fontSize: 10, color: '#374151', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              Admin Panel
            </p>
          </div>
        </div>

        {/* Section label */}
        <div style={{ padding: '16px 16px 6px' }}>
          <p style={{ margin: 0, fontSize: 10, fontWeight: 700, color: '#1f2937', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Menu
          </p>
        </div>

        {/* Nav */}
        <nav style={{
          flex: 1, padding: '0 8px',
          overflowY: 'auto',
          display: 'flex', flexDirection: 'column', gap: 1,
        }}>
          {ALL_ITEMS.map(item => (
            <DesktopLink key={item.href} item={item} active={isActive(item.href)} />
          ))}
        </nav>

        {/* Footer */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '8px 8px 0' }}>
          <Link
            href="/?view=home"
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '9px 12px', borderRadius: 8,
              textDecoration: 'none', color: '#4b5563',
              fontSize: 13, fontWeight: 400, fontFamily: FONT,
              transition: 'color 0.13s',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = '#9ca3af'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = '#4b5563'; }}
          >
            <Home size={16} />
            Back to Home
          </Link>
        </div>

        <div style={{ padding: '8px' }}>
          <button
            type="button"
            onClick={handleLogout}
            style={{
              width: '100%', display: 'flex', alignItems: 'center',
              justifyContent: 'center', gap: 8,
              padding: '9px 16px',
              background: 'rgba(239,68,68,0.08)',
              border: '1px solid rgba(239,68,68,0.18)',
              borderRadius: 8, color: '#ef4444',
              fontSize: 13, fontWeight: 600,
              fontFamily: FONT, cursor: 'pointer',
              transition: 'background 0.13s',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(239,68,68,0.14)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(239,68,68,0.08)'; }}
          >
            <LogOut size={14} /> Logout
          </button>
        </div>
      </aside>

      {/* ─── Mobile: backdrop ─── */}
      {moreOpen && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 40,
            background: 'rgba(0,0,0,0.55)',
            backdropFilter: 'blur(3px)',
          }}
          onClick={() => setMoreOpen(false)}
        />
      )}

      {/* ─── Mobile: More drawer ─── */}
      {moreOpen && (
        <div className="sb-drawer" style={{
          position: 'fixed', bottom: 56, left: 0, right: 0, zIndex: 50,
          background: '#0f172a',
          borderTop: '1px solid rgba(255,255,255,0.09)',
          borderRadius: '16px 16px 0 0',
          paddingBottom: 'env(safe-area-inset-bottom)',
          fontFamily: FONT,
        }}>
          {/* handle */}
          <div style={{ display: 'flex', justifyContent: 'center', padding: '10px 0 2px' }}>
            <div style={{ width: 32, height: 3, borderRadius: 2, background: 'rgba(255,255,255,0.1)' }} />
          </div>

          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '8px 18px 10px',
          }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#d1d5db' }}>More</span>
            <button
              type="button"
              onClick={() => setMoreOpen(false)}
              style={{ background: 'none', border: 'none', color: '#4b5563', cursor: 'pointer', display: 'flex', padding: 4 }}
            >
              <X size={17} />
            </button>
          </div>

          <div style={{ padding: '0 8px 8px', display: 'flex', flexDirection: 'column', gap: 1 }}>
            {MORE_ITEMS.map(item => {
              const Icon  = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMoreOpen(false)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '11px 14px', borderRadius: 8,
                    textDecoration: 'none',
                    fontFamily: FONT, fontSize: 14,
                    fontWeight: active ? 600 : 400,
                    color: active ? '#f9fafb' : '#9ca3af',
                    background: active ? 'rgba(255,255,255,0.07)' : 'transparent',
                    borderLeft: active ? '3px solid #22c55e' : '3px solid transparent',
                    paddingLeft: active ? 12 : 14,
                  }}
                >
                  <Icon size={18} />
                  {item.label}
                </Link>
              );
            })}

            <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', margin: '6px 4px' }} />

            <Link
              href="/?view=home"
              onClick={() => setMoreOpen(false)}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '11px 14px', borderRadius: 8,
                textDecoration: 'none', color: '#4b5563',
                fontFamily: FONT, fontSize: 14, fontWeight: 400,
              }}
            >
              <Home size={18} /> Back to Home
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '11px 14px', borderRadius: 8,
                background: 'none', border: 'none',
                color: '#ef4444', fontFamily: FONT,
                fontSize: 14, fontWeight: 600,
                cursor: 'pointer', width: '100%', textAlign: 'left',
              }}
            >
              <LogOut size={18} /> Logout
            </button>
          </div>
        </div>
      )}

      {/* ─── Mobile: bottom tab bar ─── */}
      <nav className="sb-bottom" style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 50,
        background: '#0b1120',
        borderTop: '1px solid rgba(255,255,255,0.08)',
        paddingBottom: 'env(safe-area-inset-bottom)',
        alignItems: 'stretch',
      }}>
        {PRIMARY_NAV.map(item => {
          const Icon   = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMoreOpen(false)}
              className={`sb-tab${active ? ' sb-act' : ''}`}
              style={{ position: 'relative' }}
            >
              {active && (
                <span style={{
                  position: 'absolute', top: 0, left: '25%', right: '25%',
                  height: 2, background: '#22c55e',
                  borderRadius: '0 0 2px 2px',
                }} />
              )}
              <Icon size={20} />
              <span>{item.label}</span>
            </Link>
          );
        })}

        <button
          type="button"
          className={`sb-tab${moreOpen ? ' sb-act' : ''}`}
          onClick={() => setMoreOpen(v => !v)}
        >
          <MoreHorizontal size={20} />
          <span>More</span>
        </button>
      </nav>
    </>
  );
}