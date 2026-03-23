'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { adminAPI, Order } from '@/lib/api';
import {
  Search,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  XCircle,
  Clock,
  Truck,
  AlertCircle,
  DollarSign,
  Filter,
  Hash,
  Calendar,
  User,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';

type PaymentStatus = 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
type SortKey = 'id' | 'totalAmount' | 'createdAt' | 'status';
type SortDir = 'asc' | 'desc';

interface StatusConfig {
  label: string;
  color: string;
  bg: string;
  border: string;
  icon: React.ComponentType<{ size?: number }>;
}

const STATUS_CONFIG: Record<PaymentStatus, StatusConfig> = {
  PENDING:    { label: 'Pending',    color: '#a78bfa', bg: 'rgba(167,139,250,0.1)', border: 'rgba(167,139,250,0.25)', icon: Clock },
  PROCESSING: { label: 'Processing', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)',  border: 'rgba(245,158,11,0.25)',  icon: AlertCircle },
  SHIPPED:    { label: 'Shipped',    color: '#60a5fa', bg: 'rgba(96,165,250,0.1)',  border: 'rgba(96,165,250,0.25)',  icon: Truck },
  DELIVERED:  { label: 'Delivered',  color: '#4ade80', bg: 'rgba(74,222,128,0.1)',  border: 'rgba(74,222,128,0.25)',  icon: CheckCircle },
  CANCELLED:  { label: 'Cancelled',  color: '#f87171', bg: 'rgba(248,113,113,0.1)', border: 'rgba(248,113,113,0.25)', icon: XCircle },
};

const ALL_STATUSES = Object.keys(STATUS_CONFIG) as PaymentStatus[];
const PAGE_SIZE = 15;

export default function AdminPayments() {
  const [payments, setPayments] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('createdAt');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [page, setPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const fetchPayments = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      else setRefreshing(true);
      const data = await adminAPI.getOrders();
      setPayments(Array.isArray(data) ? data : []);
      setError('');
    } catch {
      setError('Failed to load payments');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
  };

  const filtered = useMemo(() => {
    let list = [...payments];

    if (filterStatus) {
      list = list.filter((p) => p.status === filterStatus);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.orderNumber?.toLowerCase().includes(q) ||
          String(p.id).includes(q) ||
          (p as Order & { user?: { firstName?: string; lastName?: string; email?: string } }).user?.email?.toLowerCase().includes(q) ||
          (p as Order & { user?: { firstName?: string; lastName?: string; email?: string } }).user?.firstName?.toLowerCase().includes(q)
      );
    }

    list.sort((a, b) => {
      let va: number | string = '';
      let vb: number | string = '';
      if (sortKey === 'totalAmount') {
        va = parseFloat(String(a.totalAmount));
        vb = parseFloat(String(b.totalAmount));
      } else if (sortKey === 'createdAt') {
        va = new Date(a.createdAt).getTime();
        vb = new Date(b.createdAt).getTime();
      } else if (sortKey === 'id') {
        va = a.id;
        vb = b.id;
      } else {
        va = a.status;
        vb = b.status;
      }
      return sortDir === 'asc' ? (va > vb ? 1 : -1) : va < vb ? 1 : -1;
    });

    return list;
  }, [payments, filterStatus, search, sortKey, sortDir]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const statusCounts = useMemo(
    () =>
      ALL_STATUSES.reduce(
        (acc, s) => ({ ...acc, [s]: payments.filter((p) => p.status === s).length }),
        {} as Record<PaymentStatus, number>
      ),
    [payments]
  );

  const totalRevenue = useMemo(
    () =>
      payments
        .filter((p) => p.status !== 'CANCELLED')
        .reduce((s, p) => s + parseFloat(String(p.totalAmount)), 0),
    [payments]
  );

  const deliveredRevenue = useMemo(
    () =>
      payments
        .filter((p) => p.status === 'DELIVERED')
        .reduce((s, p) => s + parseFloat(String(p.totalAmount)), 0),
    [payments]
  );

  const cancelledLoss = useMemo(
    () =>
      payments
        .filter((p) => p.status === 'CANCELLED')
        .reduce((s, p) => s + parseFloat(String(p.totalAmount)), 0),
    [payments]
  );

  const avgOrderValue = payments.length > 0 ? totalRevenue / payments.filter((p) => p.status !== 'CANCELLED').length : 0;

  const SortIcon = ({ k }: { k: SortKey }) =>
    sortKey === k ? (
      sortDir === 'asc' ? <ChevronUp size={11} /> : <ChevronDown size={11} />
    ) : (
      <span style={{ opacity: 0.25 }}>
        <ChevronDown size={11} />
      </span>
    );

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 320,
          gap: 12,
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            border: '3px solid #1f2937',
            borderTopColor: '#4ade80',
            borderRadius: '50%',
            animation: 'pmSpin 0.8s linear infinite',
          }}
        />
        <p style={{ color: '#6b7280', fontSize: 13 }}>Loading payments…</p>
        <style>{`@keyframes pmSpin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div
      style={{
        fontFamily: "'Segoe UI', 'Roboto', sans-serif",
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
      }}
    >
      <style>{`


        @keyframes pmSpin    { to { transform: rotate(360deg); } }
        @keyframes pmSlideDown {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .pm-table { width: 100%; border-collapse: collapse; }
        .pm-table th {
          padding: 10px 14px;
          text-align: left;
          font-size: 11px;
          font-weight: 700;
          color: #6b7280;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          background: #0f172a;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          white-space: nowrap;
          cursor: pointer;
          user-select: none;
        }
        .pm-table th:hover { color: #d1d5db; }
        .pm-table td {
          padding: 12px 14px;
          font-size: 13px;
          color: #d1d5db;
          border-bottom: 1px solid rgba(255,255,255,0.04);
          vertical-align: middle;
        }
        .pm-table tr.pm-data-row:hover td {
          background: rgba(255,255,255,0.025);
          cursor: pointer;
        }
        .pm-table tr.pm-exp-row td { background: #080d16; }

        .pm-status-pill {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 700;
          border: 1px solid;
          white-space: nowrap;
        }

        .pm-filter-chip {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          border: 1px solid rgba(255,255,255,0.08);
          background: transparent;
          color: #9ca3af;
          transition: all 0.15s;
          white-space: nowrap;
        }
        .pm-filter-chip:hover {
          border-color: rgba(74,222,128,0.3);
          color: #e5e7eb;
        }

        .pm-search-input {
          width: 100%;
          background: #111827;
          border: 1px solid rgba(255,255,255,0.08);
          color: #e5e7eb;
          font-size: 13px;
          padding: 9px 12px 9px 36px;
          border-radius: 9px;
          outline: none;
          font-family: 'Segoe UI', 'Roboto', sans-serif;
          transition: border-color 0.15s;
          box-sizing: border-box;
        }
        .pm-search-input:focus { border-color: rgba(74,222,128,0.4); }
        .pm-search-input::placeholder { color: #4b5563; }

        .pm-summary-card {
          background: #111827;
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 11px;
          padding: 14px 16px;
          position: relative;
          overflow: hidden;
        }

        .pm-page-btn {
          width: 30px;
          height: 30px;
          border-radius: 7px;
          border: 1px solid rgba(255,255,255,0.08);
          background: transparent;
          color: #9ca3af;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.15s;
        }
        .pm-page-btn:hover:not(:disabled) {
          background: rgba(255,255,255,0.06);
          color: #e5e7eb;
        }
        .pm-page-btn.pm-pg-active {
          background: rgba(74,222,128,0.15);
          border-color: rgba(74,222,128,0.4);
          color: #4ade80;
        }
        .pm-page-btn:disabled { opacity: 0.3; cursor: not-allowed; }

        .pm-scroll-x { overflow-x: auto; }
        .pm-scroll-x::-webkit-scrollbar { height: 4px; }
        .pm-scroll-x::-webkit-scrollbar-track { background: #0f172a; }
        .pm-scroll-x::-webkit-scrollbar-thumb { background: #1f2937; border-radius: 4px; }

        .pm-revenue-bar {
          height: 6px;
          border-radius: 3px;
          background: #1f2937;
          overflow: hidden;
          margin-top: 8px;
        }
        .pm-revenue-bar-fill {
          height: 100%;
          border-radius: 3px;
          transition: width 1s ease;
        }

        @media (max-width: 640px) {
          .pm-hide-sm { display: none !important; }
          .pm-table td, .pm-table th { padding: 10px; }
        }
      `}</style>

      {/* ── Header ── */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 12,
          alignItems: 'flex-start',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <p
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: '#4ade80',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              marginBottom: 2,
            }}
          >
            Finance
          </p>
          <h2
            style={{
              fontFamily: "'Syne',sans-serif",
              fontSize: 'clamp(18px,3vw,24px)',
              fontWeight: 800,
              color: '#f9fafb',
              margin: 0,
            }}
          >
            Payments
          </h2>
        </div>
        <button
          onClick={() => fetchPayments(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '8px 14px',
            background: '#1f2937',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 9,
            color: '#9ca3af',
            fontSize: 12,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          <RefreshCw
            size={13}
            style={{ animation: refreshing ? 'pmSpin 0.8s linear infinite' : 'none' }}
          />
          Refresh
        </button>
      </div>

      {/* ── Summary Cards ── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: 10,
        }}
      >
        {/* Total Revenue */}
        <div className="pm-summary-card" style={{ borderColor: 'rgba(74,222,128,0.2)' }}>
          <div
            style={{
              position: 'absolute',
              top: -20,
              right: -20,
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: 'rgba(74,222,128,0.06)',
            }}
          />
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
            <DollarSign size={13} style={{ color: '#4ade80' }} />
            <p style={{ fontSize: 11, color: '#6b7280', margin: 0 }}>Total Revenue</p>
          </div>
          <p
            style={{
              fontSize: 'clamp(18px,2.5vw,22px)',
              fontWeight: 800,
              color: '#4ade80',
              fontFamily: "'Syne',sans-serif",
              margin: 0,
            }}
          >
            ₹{(totalRevenue / 100000).toFixed(2)}L
          </p>
          <div className="pm-revenue-bar">
            <div
              className="pm-revenue-bar-fill"
              style={{ width: '100%', background: '#4ade80' }}
            />
          </div>
        </div>

        {/* Confirmed */}
        <div className="pm-summary-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
            <TrendingUp size={13} style={{ color: '#34d399' }} />
            <p style={{ fontSize: 11, color: '#6b7280', margin: 0 }}>Confirmed</p>
          </div>
          <p
            style={{
              fontSize: 'clamp(18px,2.5vw,22px)',
              fontWeight: 800,
              color: '#34d399',
              fontFamily: "'Syne',sans-serif",
              margin: 0,
            }}
          >
            ₹{(deliveredRevenue / 100000).toFixed(2)}L
          </p>
          <div className="pm-revenue-bar">
            <div
              className="pm-revenue-bar-fill"
              style={{
                width: totalRevenue > 0 ? `${(deliveredRevenue / totalRevenue) * 100}%` : '0%',
                background: '#34d399',
              }}
            />
          </div>
        </div>

        {/* Avg Order Value */}
        <div className="pm-summary-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
            <Hash size={13} style={{ color: '#60a5fa' }} />
            <p style={{ fontSize: 11, color: '#6b7280', margin: 0 }}>Avg Order</p>
          </div>
          <p
            style={{
              fontSize: 'clamp(18px,2.5vw,22px)',
              fontWeight: 800,
              color: '#60a5fa',
              fontFamily: "'Syne',sans-serif",
              margin: 0,
            }}
          >
            ₹{Math.round(avgOrderValue).toLocaleString('en-IN')}
          </p>
          <div className="pm-revenue-bar">
            <div
              className="pm-revenue-bar-fill"
              style={{ width: '60%', background: '#60a5fa' }}
            />
          </div>
        </div>

        {/* Cancelled Loss */}
        <div className="pm-summary-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
            <TrendingDown size={13} style={{ color: '#f87171' }} />
            <p style={{ fontSize: 11, color: '#6b7280', margin: 0 }}>Cancelled Loss</p>
          </div>
          <p
            style={{
              fontSize: 'clamp(18px,2.5vw,22px)',
              fontWeight: 800,
              color: '#f87171',
              fontFamily: "'Syne',sans-serif",
              margin: 0,
            }}
          >
            ₹{(cancelledLoss / 1000).toFixed(1)}K
          </p>
          <div className="pm-revenue-bar">
            <div
              className="pm-revenue-bar-fill"
              style={{
                width: totalRevenue > 0 ? `${Math.min((cancelledLoss / totalRevenue) * 100, 100)}%` : '0%',
                background: '#f87171',
              }}
            />
          </div>
        </div>

        {/* Total Transactions */}
        <div className="pm-summary-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
            <Filter size={13} style={{ color: '#a78bfa' }} />
            <p style={{ fontSize: 11, color: '#6b7280', margin: 0 }}>Transactions</p>
          </div>
          <p
            style={{
              fontSize: 'clamp(18px,2.5vw,22px)',
              fontWeight: 800,
              color: '#a78bfa',
              fontFamily: "'Syne',sans-serif",
              margin: 0,
            }}
          >
            {payments.length.toLocaleString('en-IN')}
          </p>
          <div className="pm-revenue-bar">
            <div
              className="pm-revenue-bar-fill"
              style={{ width: '100%', background: '#a78bfa' }}
            />
          </div>
        </div>
      </div>

      {/* ── Status Breakdown Bar ── */}
      <div
        style={{
          background: '#111827',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 12,
          padding: '14px 18px',
        }}
      >
        <p
          style={{
            fontSize: 10,
            fontWeight: 700,
            color: '#4b5563',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            marginBottom: 12,
          }}
        >
          Payment Status Distribution
        </p>

        {/* Stacked bar */}
        <div
          style={{
            display: 'flex',
            height: 8,
            borderRadius: 4,
            overflow: 'hidden',
            gap: 1,
            marginBottom: 12,
          }}
        >
          {ALL_STATUSES.map((s) => {
            const pct = payments.length > 0 ? (statusCounts[s] / payments.length) * 100 : 0;
            return (
              pct > 0 && (
                <div
                  key={s}
                  style={{
                    width: `${pct}%`,
                    background: STATUS_CONFIG[s].color,
                    opacity: 0.85,
                  }}
                  title={`${STATUS_CONFIG[s].label}: ${statusCounts[s]}`}
                />
              )
            );
          })}
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 16px' }}>
          {ALL_STATUSES.map((s) => {
            const cfg = STATUS_CONFIG[s];
            const pct =
              payments.length > 0
                ? Math.round((statusCounts[s] / payments.length) * 100)
                : 0;
            return (
              <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: cfg.color,
                    flexShrink: 0,
                  }}
                />
                <span style={{ fontSize: 12, color: '#9ca3af' }}>{cfg.label}</span>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: cfg.color,
                    background: cfg.bg,
                    padding: '1px 6px',
                    borderRadius: 10,
                  }}
                >
                  {statusCounts[s]} · {pct}%
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Filters ── */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: '1 1 200px', maxWidth: 320 }}>
          <Search
            size={14}
            style={{
              position: 'absolute',
              left: 10,
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#4b5563',
            }}
          />
          <input
            className="pm-search-input"
            placeholder="Search payment, order, email…"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          <button
            className="pm-filter-chip"
            onClick={() => { setFilterStatus(''); setPage(1); }}
            style={
              filterStatus === ''
                ? { background: 'rgba(74,222,128,0.12)', borderColor: 'rgba(74,222,128,0.4)', color: '#4ade80' }
                : {}
            }
          >
            All
            <span
              style={{
                background: 'rgba(255,255,255,0.1)',
                borderRadius: 10,
                padding: '1px 6px',
                fontSize: 10,
              }}
            >
              {payments.length}
            </span>
          </button>

          {ALL_STATUSES.map((s) => {
            const cfg = STATUS_CONFIG[s];
            const active = filterStatus === s;
            return (
              <button
                key={s}
                className="pm-filter-chip"
                onClick={() => { setFilterStatus(s); setPage(1); }}
                style={
                  active
                    ? { background: cfg.bg, borderColor: cfg.border, color: cfg.color }
                    : {}
                }
              >
                {cfg.label}
                <span
                  style={{
                    background: 'rgba(255,255,255,0.1)',
                    borderRadius: 10,
                    padding: '1px 6px',
                    fontSize: 10,
                  }}
                >
                  {statusCounts[s]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Error ── */}
      {error && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '10px 14px',
            background: 'rgba(248,113,113,0.1)',
            border: '1px solid rgba(248,113,113,0.3)',
            borderRadius: 9,
            color: '#f87171',
            fontSize: 13,
          }}
        >
          <XCircle size={14} />
          {error}
        </div>
      )}

      {/* ── Count ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <p style={{ fontSize: 12, color: '#4b5563', margin: 0 }}>
          Showing{' '}
          <span style={{ color: '#9ca3af', fontWeight: 600 }}>{paginated.length}</span> of{' '}
          <span style={{ color: '#9ca3af', fontWeight: 600 }}>{filtered.length}</span> payments
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Filter size={12} style={{ color: '#4b5563' }} />
          <span style={{ fontSize: 12, color: '#4b5563' }}>
            Sort:{' '}
            <span style={{ color: '#9ca3af' }}>{sortKey}</span>
          </span>
        </div>
      </div>

      {/* ── Table ── */}
      {filtered.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: '48px 24px',
            background: '#111827',
            borderRadius: 14,
            border: '1px solid rgba(255,255,255,0.07)',
          }}
        >
          <DollarSign size={36} style={{ color: '#374151', margin: '0 auto 12px' }} />
          <p style={{ color: '#6b7280', fontSize: 14, fontWeight: 600 }}>No payments found</p>
          <p style={{ color: '#374151', fontSize: 12, marginTop: 4 }}>
            Try adjusting your filters
          </p>
        </div>
      ) : (
        <div
          style={{
            background: '#111827',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 14,
            overflow: 'hidden',
          }}
        >
          <div className="pm-scroll-x">
            <table className="pm-table" style={{ minWidth: 680 }}>
              <thead>
                <tr>
                  <th
                    onClick={() => handleSort('id')}
                    style={{ width: 80 }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      Pay ID <SortIcon k="id" />
                    </div>
                  </th>
                  <th>Order No.</th>
                  <th className="pm-hide-sm">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <User size={11} /> Customer
                    </div>
                  </th>
                  <th onClick={() => handleSort('totalAmount')}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <DollarSign size={11} /> Amount <SortIcon k="totalAmount" />
                    </div>
                  </th>
                  <th onClick={() => handleSort('status')}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      Status <SortIcon k="status" />
                    </div>
                  </th>
                  <th onClick={() => handleSort('createdAt')} className="pm-hide-sm">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Calendar size={11} /> Date <SortIcon k="createdAt" />
                    </div>
                  </th>
                  <th className="pm-hide-sm">Items</th>
                  <th style={{ width: 28 }} />
                </tr>
              </thead>
              <tbody>
                {paginated.map((payment) => {
                  const cfg =
                    STATUS_CONFIG[payment.status as PaymentStatus] ?? STATUS_CONFIG.PENDING;
                  const StatusIcon = cfg.icon;
                  const payWithUser = payment as Order & {
                    user?: { firstName?: string; lastName?: string; email?: string };
                  };
                  const isExpanded = expandedId === payment.id;

                  return (
                    <React.Fragment key={payment.id}>
                      <tr
                        className="pm-data-row"
                        onClick={() => setExpandedId(isExpanded ? null : payment.id)}
                      >
                        {/* Pay ID */}
                        <td>
                          <span
                            style={{
                              fontSize: 12,
                              fontWeight: 700,
                              color: '#4ade80',
                              background: 'rgba(74,222,128,0.08)',
                              padding: '3px 8px',
                              borderRadius: 6,
                              fontFamily: 'monospace',
                            }}
                          >
                            PAY-{String(payment.id).padStart(4, '0')}
                          </span>
                        </td>

                        {/* Order number */}
                        <td>
                          <span style={{ fontWeight: 600, color: '#e5e7eb', fontSize: 13 }}>
                            {payment.orderNumber}
                          </span>
                        </td>

                        {/* Customer */}
                        <td className="pm-hide-sm">
                          {payWithUser.user ? (
                            <div>
                              <div style={{ fontWeight: 600, color: '#e5e7eb', fontSize: 13 }}>
                                {`${payWithUser.user.firstName ?? ''} ${payWithUser.user.lastName ?? ''}`.trim() ||
                                  '—'}
                              </div>
                              <div style={{ fontSize: 11, color: '#6b7280' }}>
                                {payWithUser.user.email}
                              </div>
                            </div>
                          ) : (
                            <span style={{ color: '#4b5563' }}>—</span>
                          )}
                        </td>

                        {/* Amount */}
                        <td>
                          <span
                            style={{ fontWeight: 700, color: '#f9fafb', fontSize: 14 }}
                          >
                            ₹{parseFloat(String(payment.totalAmount)).toLocaleString('en-IN')}
                          </span>
                        </td>

                        {/* Status */}
                        <td>
                          <span
                            className="pm-status-pill"
                            style={{
                              color: cfg.color,
                              background: cfg.bg,
                              borderColor: cfg.border,
                            }}
                          >
                            <StatusIcon size={10} />
                            {cfg.label}
                          </span>
                        </td>

                        {/* Date */}
                        <td className="pm-hide-sm" style={{ color: '#6b7280', fontSize: 12 }}>
                          {new Date(payment.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: '2-digit',
                          })}
                        </td>

                        {/* Items count */}
                        <td className="pm-hide-sm">
                          <span
                            style={{
                              background: 'rgba(255,255,255,0.06)',
                              padding: '3px 8px',
                              borderRadius: 6,
                              fontSize: 11,
                              fontWeight: 600,
                              color: '#9ca3af',
                            }}
                          >
                            {payment.items?.length ?? 0} item
                            {(payment.items?.length ?? 0) !== 1 ? 's' : ''}
                          </span>
                        </td>

                        {/* Expand chevron */}
                        <td>
                          <ChevronDown
                            size={14}
                            style={{
                              color: '#374151',
                              transition: 'transform 0.2s',
                              transform: isExpanded ? 'rotate(180deg)' : 'none',
                            }}
                          />
                        </td>
                      </tr>

                      {/* Expanded detail */}
                      {isExpanded && (
                        <tr className="pm-exp-row">
                          <td colSpan={8} style={{ padding: '16px 20px' }}>
                            <div
                              style={{
                                animation: 'pmSlideDown 0.2s ease',
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                                gap: 16,
                              }}
                            >
                              {/* Items list */}
                              <div>
                                <p
                                  style={{
                                    fontSize: 10,
                                    fontWeight: 700,
                                    color: '#4b5563',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.08em',
                                    marginBottom: 8,
                                  }}
                                >
                                  Line Items
                                </p>
                                <div
                                  style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 6,
                                  }}
                                >
                                  {payment.items && payment.items.length > 0 ? (
                                    payment.items.map((item) => (
                                      <div
                                        key={item.id}
                                        style={{
                                          background: '#111827',
                                          border: '1px solid rgba(255,255,255,0.06)',
                                          borderRadius: 8,
                                          padding: '8px 12px',
                                          display: 'flex',
                                          justifyContent: 'space-between',
                                          alignItems: 'center',
                                          gap: 8,
                                        }}
                                      >
                                        <div>
                                          <p
                                            style={{
                                              fontSize: 12,
                                              fontWeight: 600,
                                              color: '#e5e7eb',
                                              margin: 0,
                                            }}
                                          >
                                            {item.product?.name ?? `Product #${item.productId}`}
                                            {item.package ? ` · ${item.package.duration}` : ''}
                                          </p>
                                          <p
                                            style={{
                                              fontSize: 11,
                                              color: '#6b7280',
                                              margin: '2px 0 0',
                                            }}
                                          >
                                            Qty: {item.quantity} × ₹
                                            {parseFloat(String(item.price)).toLocaleString('en-IN')}
                                          </p>
                                        </div>
                                        <span
                                          style={{
                                            fontSize: 12,
                                            fontWeight: 700,
                                            color: '#4ade80',
                                            flexShrink: 0,
                                          }}
                                        >
                                          ₹
                                          {(
                                            parseFloat(String(item.price)) * item.quantity
                                          ).toLocaleString('en-IN')}
                                        </span>
                                      </div>
                                    ))
                                  ) : (
                                    <p style={{ fontSize: 12, color: '#4b5563' }}>
                                      No item details available
                                    </p>
                                  )}
                                </div>
                              </div>

                              {/* Payment summary */}
                              <div
                                style={{
                                  background: '#0f172a',
                                  border: '1px solid rgba(255,255,255,0.06)',
                                  borderRadius: 10,
                                  padding: '14px 16px',
                                  display: 'flex',
                                  flexDirection: 'column',
                                  gap: 10,
                                }}
                              >
                                <p
                                  style={{
                                    fontSize: 10,
                                    fontWeight: 700,
                                    color: '#4b5563',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.08em',
                                    marginBottom: 2,
                                  }}
                                >
                                  Payment Summary
                                </p>

                                <div
                                  style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                  }}
                                >
                                  <span style={{ fontSize: 12, color: '#6b7280' }}>
                                    Payment ID
                                  </span>
                                  <span
                                    style={{
                                      fontSize: 12,
                                      fontWeight: 700,
                                      color: '#4ade80',
                                      fontFamily: 'monospace',
                                    }}
                                  >
                                    PAY-{String(payment.id).padStart(4, '0')}
                                  </span>
                                </div>

                                <div
                                  style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                  }}
                                >
                                  <span style={{ fontSize: 12, color: '#6b7280' }}>
                                    Order
                                  </span>
                                  <span style={{ fontSize: 12, fontWeight: 600, color: '#e5e7eb' }}>
                                    {payment.orderNumber}
                                  </span>
                                </div>

                                <div
                                  style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                  }}
                                >
                                  <span style={{ fontSize: 12, color: '#6b7280' }}>Date</span>
                                  <span style={{ fontSize: 12, color: '#9ca3af' }}>
                                    {new Date(payment.createdAt).toLocaleString('en-IN')}
                                  </span>
                                </div>

                                <div
                                  style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                  }}
                                >
                                  <span style={{ fontSize: 12, color: '#6b7280' }}>Status</span>
                                  <span
                                    className="pm-status-pill"
                                    style={{
                                      color: cfg.color,
                                      background: cfg.bg,
                                      borderColor: cfg.border,
                                      fontSize: 10,
                                    }}
                                  >
                                    <StatusIcon size={9} />
                                    {cfg.label}
                                  </span>
                                </div>

                                <div
                                  style={{
                                    borderTop: '1px solid rgba(255,255,255,0.06)',
                                    paddingTop: 10,
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                  }}
                                >
                                  <span
                                    style={{
                                      fontSize: 13,
                                      fontWeight: 700,
                                      color: '#e5e7eb',
                                    }}
                                  >
                                    Total
                                  </span>
                                  <span
                                    style={{
                                      fontSize: 16,
                                      fontWeight: 800,
                                      color: '#4ade80',
                                      fontFamily: "'Syne',sans-serif",
                                    }}
                                  >
                                    ₹
                                    {parseFloat(String(payment.totalAmount)).toLocaleString(
                                      'en-IN'
                                    )}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div
              style={{
                padding: '12px 16px',
                borderTop: '1px solid rgba(255,255,255,0.06)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 8,
              }}
            >
              <span style={{ fontSize: 12, color: '#4b5563' }}>
                Page {page} of {totalPages}
              </span>
              <div style={{ display: 'flex', gap: 4 }}>
                <button
                  className="pm-page-btn"
                  disabled={page === 1}
                  onClick={() => setPage(1)}
                >
                  «
                </button>
                <button
                  className="pm-page-btn"
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  ‹
                </button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const p = Math.max(1, Math.min(totalPages - 4, page - 2)) + i;
                  return (
                    <button
                      key={p}
                      className={`pm-page-btn ${p === page ? 'pm-pg-active' : ''}`}
                      onClick={() => setPage(p)}
                    >
                      {p}
                    </button>
                  );
                })}
                <button
                  className="pm-page-btn"
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  ›
                </button>
                <button
                  className="pm-page-btn"
                  disabled={page === totalPages}
                  onClick={() => setPage(totalPages)}
                >
                  »
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}