'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Package, DollarSign, Users, TrendingUp,
  ArrowUpRight, ArrowDownRight, ShoppingCart,
  RotateCcw, Clock, CheckCircle, XCircle, Truck,
  BarChart2, Activity,
} from 'lucide-react';
import AdminOrders from './AdminOrders';
import AdminPayments from './AdminPayments';
import AdminProducts from './AdminProducts';
import AdminReturns from './AdminReturns';
import AdminUsers from './AdminUsers';

type TabType = 'overview' | 'orders' | 'returns' | 'payments' | 'products' | 'users';

const tabs: { id: TabType; label: string; icon: React.ComponentType<{ size?: number; className?: string }> }[] = [
  { id: 'overview',  label: 'Overview',  icon: BarChart2 },
  { id: 'orders',    label: 'Orders',    icon: Package },
  { id: 'returns',   label: 'Returns',   icon: RotateCcw },
  { id: 'payments',  label: 'Payments',  icon: DollarSign },
  { id: 'products',  label: 'Products',  icon: ShoppingCart },
  { id: 'users',     label: 'Users',     icon: Users },
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  return (
    <div className="min-h-full" style={{ fontFamily: "'Segoe UI', 'Roboto', sans-serif" }}>
      <style>{`

        .dash-tab-btn {
          position: relative;
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 14px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          border: none;
          transition: all 0.18s ease;
          white-space: nowrap;
          background: transparent;
          color: #6b7280;
        }
        .dash-tab-btn:hover {
          background: rgba(255,255,255,0.06);
          color: #d1d5db;
        }
        .dash-tab-btn.active {
          background: rgba(21, 128, 61, 0.18);
          color: #4ade80;
        }
        .dash-tab-btn.active::after {
          content: '';
          position: absolute;
          bottom: -1px;
          left: 12px;
          right: 12px;
          height: 2px;
          background: #4ade80;
          border-radius: 2px 2px 0 0;
        }

        .stat-card {
          background: #111827;
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 14px;
          padding: 20px;
          position: relative;
          overflow: hidden;
          transition: transform 0.2s, border-color 0.2s;
        }
        .stat-card:hover {
          transform: translateY(-2px);
          border-color: rgba(74, 222, 128, 0.25);
        }
        .stat-card::before {
          content: '';
          position: absolute;
          top: 0; right: 0;
          width: 120px; height: 120px;
          border-radius: 50%;
          opacity: 0.04;
          transform: translate(30%, -30%);
        }

        .sparkline-bar {
          flex: 1;
          border-radius: 3px 3px 0 0;
          transition: opacity 0.2s;
          min-width: 0;
        }
        .sparkline-bar:hover { opacity: 0.85; }

        .activity-row {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 10px 0;
          border-bottom: 1px solid rgba(255,255,255,0.04);
          transition: background 0.15s;
        }
        .activity-row:last-child { border-bottom: none; }

        .ring-chart {
          transform: rotate(-90deg);
        }

        @keyframes countUp {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-count { animation: countUp 0.5s ease forwards; }

        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-slide-in { animation: fadeSlideIn 0.4s ease forwards; }

        .scroll-tabs::-webkit-scrollbar { display: none; }
        .scroll-tabs { scrollbar-width: none; }
      `}</style>

      {/* Page header */}
      <div className="mb-6 fade-slide-in">
        <p className="text-xs font-semibold tracking-widest uppercase text-green-500 mb-1">Control Center</p>
        <h1 style={{ fontFamily: "'Segoe UI', 'Roboto', sans-serif", fontSize: 'clamp(22px, 4vw, 32px)', fontWeight: 800, color: '#f9fafb', lineHeight: 1.1 }}>
          Admin Dashboard
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Tab Navigation */}
      <div style={{ borderBottom: '1px solid rgba(255,255,255,0.07)', marginBottom: 24 }}>
        <div className="scroll-tabs flex gap-1 overflow-x-auto pb-px">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`dash-tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            >
              <tab.icon size={14} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div>
        {activeTab === 'overview'  && <OverviewTab />}
        {activeTab === 'orders'    && <AdminOrders />}
        {activeTab === 'returns'   && <AdminReturns />}
        {activeTab === 'payments'  && <AdminPayments />}
        {activeTab === 'products'  && <AdminProducts />}
        {activeTab === 'users'     && <AdminUsers />}
      </div>
    </div>
  );
}

/* ─── Sparkline micro-chart ─── */
function Sparkline({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data);
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2, height: 32, width: '100%' }}>
      {data.map((v, i) => (
        <div
          key={i}
          className="sparkline-bar"
          style={{
            height: `${(v / max) * 100}%`,
            background: color,
            opacity: i === data.length - 1 ? 1 : 0.35 + (i / data.length) * 0.5,
          }}
        />
      ))}
    </div>
  );
}

/* ─── Animated counter ─── */
function AnimatedNumber({ target, prefix = '', suffix = '' }: { target: number; prefix?: string; suffix?: string }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<ReturnType<typeof setInterval> | null>(null);
  useEffect(() => {
    let start = 0;
    const step = target / 40;
    ref.current = setInterval(() => {
      start += step;
      if (start >= target) { setDisplay(target); if (ref.current) clearInterval(ref.current); }
      else setDisplay(Math.floor(start));
    }, 16);
    return () => { if (ref.current) clearInterval(ref.current); };
  }, [target]);
  return <span>{prefix}{display.toLocaleString('en-IN')}{suffix}</span>;
}

/* ─── Ring / Donut chart ─── */
function RingChart({ segments }: { segments: { value: number; color: string; label: string }[] }) {
  const total = segments.reduce((a, b) => a + b.value, 0);
  const r = 40, cx = 50, cy = 50;
  const circumference = 2 * Math.PI * r;
  
  // Pre-calculate all dash values
  const dashValues = segments.map(seg => (seg.value / total) * circumference);
  
  return (
    <svg viewBox="0 0 100 100" width="100%" height="100%" style={{ maxWidth: 140 }}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#1f2937" strokeWidth="16" />
      {segments.map((seg, i) => {
        const dash = dashValues[i];
        const gap = circumference - dash;
        // Calculate offset as sum of all previous dashes
        const offset = dashValues.slice(0, i).reduce((a, b) => a + b, 0);
        
        return (
          <circle
            key={i}
            className="ring-chart"
            cx={cx} cy={cy} r={r}
            fill="none"
            stroke={seg.color}
            strokeWidth="16"
            strokeDasharray={`${dash} ${gap}`}
            strokeDashoffset={-offset}
            style={{ transformOrigin: '50px 50px' }}
          />
        );
      })}
    </svg>
  );
}

/* ─── Main Overview ─── */
function OverviewTab() {
  const stats = [
    {
      title: 'Total Orders',
      value: 1234,
      prefix: '',
      suffix: '',
      change: '+12%',
      up: true,
      icon: Package,
      color: '#4ade80',
      bg: '#4ade80',
      spark: [40, 55, 48, 72, 60, 88, 95, 80, 110, 105, 120, 115],
    },
    {
      title: 'Revenue',
      value: 452310,
      prefix: '₹',
      suffix: '',
      change: '+5.2%',
      up: true,
      icon: DollarSign,
      color: '#34d399',
      bg: '#34d399',
      spark: [200, 280, 220, 350, 300, 420, 390, 460, 430, 510, 490, 540],
    },
    {
      title: 'Active Users',
      value: 892,
      prefix: '',
      suffix: '',
      change: '+2.1%',
      up: true,
      icon: Users,
      color: '#60a5fa',
      bg: '#60a5fa',
      spark: [300, 320, 310, 340, 360, 380, 370, 400, 420, 410, 440, 450],
    },
    {
      title: 'Conversion',
      value: 3,
      prefix: '',
      suffix: '.24%',
      change: '-0.3%',
      up: false,
      icon: TrendingUp,
      color: '#f59e0b',
      bg: '#f59e0b',
      spark: [3.8, 3.6, 3.9, 3.5, 3.7, 3.4, 3.6, 3.3, 3.5, 3.2, 3.4, 3.24],
    },
  ];

  const orderStatus = [
    { label: 'Delivered',  value: 612, color: '#4ade80', icon: CheckCircle },
    { label: 'Shipped',    value: 245, color: '#60a5fa', icon: Truck },
    { label: 'Processing', value: 187, color: '#f59e0b', icon: Clock },
    { label: 'Cancelled',  value: 93,  color: '#f87171', icon: XCircle },
    { label: 'Pending',    value: 97,  color: '#a78bfa', icon: Activity },
  ];
  const totalOrders = orderStatus.reduce((a, b) => a + b.value, 0);

  const recentActivity = [
    { type: 'order',   label: 'New order #ORD-2847',         sub: 'Ravi Kumar · ₹1,999',   time: '2m ago',  color: '#4ade80' },
    { type: 'return',  label: 'Return requested #RET-0214',   sub: 'Priya Sharma · ₹999',   time: '14m ago', color: '#f87171' },
    { type: 'user',    label: 'New user registered',          sub: 'meena.r@gmail.com',      time: '31m ago', color: '#60a5fa' },
    { type: 'order',   label: 'Order shipped #ORD-2841',      sub: 'Anil Mehta · ₹3,499',   time: '1h ago',  color: '#4ade80' },
    { type: 'payment', label: 'Payment received #PAY-1102',   sub: '₹5,498 via Razorpay',   time: '2h ago',  color: '#34d399' },
    { type: 'order',   label: 'Order delivered #ORD-2835',    sub: 'Sunita Rao · ₹1,999',   time: '3h ago',  color: '#4ade80' },
    { type: 'return',  label: 'Refund processed #RET-0210',   sub: 'Karan Singh · ₹999',    time: '5h ago',  color: '#f87171' },
  ];

  const topProducts = [
    { name: 'PlainFuel 30-Day Pack', sales: 412, revenue: 1440788, pct: 100 },
    { name: 'PlainFuel 15-Day Pack', sales: 537, revenue:  1072463, pct: 74 },
    { name: 'PlainFuel 7-Day Pack',  sales: 285, revenue:  284715,  pct: 42 },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Stats grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: 14,
      }}>
        {stats.map((s, i) => (
          <div
            key={s.title}
            className="stat-card fade-slide-in"
            style={{ animationDelay: `${i * 0.07}s`, opacity: 0 }}
          >
            <div style={{ position: 'absolute', top: 0, right: 0, width: 120, height: 120, borderRadius: '50%', background: s.bg, opacity: 0.05, transform: 'translate(30%, -30%)' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: `${s.color}18`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <s.icon size={18} color={s.color} />
              </div>
              <span style={{
                display: 'flex', alignItems: 'center', gap: 3,
                fontSize: 11, fontWeight: 700,
                color: s.up ? '#4ade80' : '#f87171',
                background: s.up ? 'rgba(74,222,128,0.1)' : 'rgba(248,113,113,0.1)',
                padding: '3px 7px', borderRadius: 20,
              }}>
                {s.up ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />}
                {s.change}
              </span>
            </div>
            <p style={{ fontSize: 12, color: '#6b7280', fontWeight: 500, marginBottom: 4 }}>{s.title}</p>
            <p className="animate-count" style={{ fontSize: 'clamp(20px, 3vw, 26px)', fontWeight: 800, color: '#f9fafb', lineHeight: 1, marginBottom: 12, fontFamily: "'Segoe UI', 'Roboto', sans-serif" }}>
              <AnimatedNumber target={s.value} prefix={s.prefix} suffix={s.suffix} />
            </p>
            <Sparkline data={s.spark} color={s.color} />
          </div>
        ))}
      </div>

      {/* Middle row: Order status + Top products */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: 14,
      }}>

        {/* Order status donut */}
        <div style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: 20 }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>Order Status Breakdown</p>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ width: 130, height: 130, flexShrink: 0 }}>
              <RingChart segments={orderStatus.map(o => ({ value: o.value, color: o.color, label: o.label }))} />
            </div>
            <div style={{ flex: 1, minWidth: 140, display: 'flex', flexDirection: 'column', gap: 7 }}>
              {orderStatus.map(o => (
                <div key={o.label} style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: o.color, flexShrink: 0 }} />
                    <span style={{ fontSize: 12, color: '#9ca3af' }}>{o.label}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#f9fafb' }}>{o.value}</span>
                    <span style={{ fontSize: 10, color: '#4b5563' }}>{Math.round((o.value / totalOrders) * 100)}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top products */}
        <div style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: 20 }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>Top Products by Revenue</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {topProducts.map((p, i) => (
              <div key={p.name}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{
                      width: 22, height: 22, borderRadius: 6,
                      background: i === 0 ? 'rgba(74,222,128,0.15)' : i === 1 ? 'rgba(96,165,250,0.15)' : 'rgba(245,158,11,0.15)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 10, fontWeight: 800,
                      color: i === 0 ? '#4ade80' : i === 1 ? '#60a5fa' : '#f59e0b',
                    }}>#{i + 1}</div>
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#e5e7eb' }}>{p.name}</span>
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#4ade80' }}>₹{(p.revenue / 100000).toFixed(1)}L</span>
                </div>
                <div style={{ height: 4, background: '#1f2937', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', borderRadius: 4,
                    width: `${p.pct}%`,
                    background: i === 0 ? '#4ade80' : i === 1 ? '#60a5fa' : '#f59e0b',
                    transition: 'width 1s ease',
                  }} />
                </div>
                <p style={{ fontSize: 11, color: '#4b5563', marginTop: 4 }}>{p.sales} units sold</p>
              </div>
            ))}
          </div>
        </div>

        {/* Quick KPIs */}
        <div style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: 20 }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>Quick Metrics</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {[
              { label: 'Avg Order Value', value: '₹2,184', color: '#4ade80' },
              { label: 'Return Rate',     value: '4.2%',   color: '#f87171' },
              { label: 'New Users Today', value: '23',     color: '#60a5fa' },
              { label: 'Pending Returns', value: '11',     color: '#f59e0b' },
              { label: 'Low Stock SKUs',  value: '5',      color: '#f87171' },
              { label: 'Reviews Today',   value: '8',      color: '#a78bfa' },
            ].map(k => (
              <div key={k.label} style={{ background: '#0f172a', borderRadius: 10, padding: '12px 14px' }}>
                <p style={{ fontSize: 11, color: '#6b7280', marginBottom: 4 }}>{k.label}</p>
                <p style={{ fontSize: 20, fontWeight: 800, color: k.color, fontFamily: "'Segoe UI', 'Roboto', sans-serif" }}>{k.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent activity */}
      <div style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Recent Activity</p>
          <span style={{ fontSize: 11, color: '#4ade80', fontWeight: 600, cursor: 'pointer' }}>View all →</span>
        </div>
        <div>
          {recentActivity.map((a, i) => (
            <div key={i} className="activity-row">
              <div style={{
                width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                background: `${a.color}18`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: a.color }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: '#e5e7eb', margin: 0 }}>{a.label}</p>
                <p style={{ fontSize: 11, color: '#6b7280', margin: '2px 0 0' }}>{a.sub}</p>
              </div>
              <span style={{ fontSize: 11, color: '#4b5563', flexShrink: 0 }}>{a.time}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}