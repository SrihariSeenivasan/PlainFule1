'use client';

import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { adminAPI, ReturnRequest, ReturnStatus } from '@/lib/api';
import {
  Search, RefreshCw, ChevronDown, ChevronUp,
  CheckCircle, XCircle, Clock, Package, RotateCcw,
  DollarSign, AlertTriangle, ArrowRight, Calendar,
  User, Hash, MessageSquare, Filter,
} from 'lucide-react';

// Extended ReturnRequest type with user info
interface ReturnRequestWithUser extends ReturnRequest {
  user?: {
    firstName?: string;
    lastName?: string;
    email?: string;
  };
}

const STATUS_CONFIG: Record<ReturnStatus, {
  label: string; color: string; bg: string; border: string;
  icon: React.ComponentType<{ size?: number }>;
  next: ReturnStatus[];
  nextColors: string[];
}> = {
  REQUESTED: {
    label: 'Requested', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.25)',
    icon: Clock, next: ['APPROVED', 'REJECTED'], nextColors: ['#4ade80', '#f87171'],
  },
  APPROVED: {
    label: 'Approved', color: '#4ade80', bg: 'rgba(74,222,128,0.1)', border: 'rgba(74,222,128,0.25)',
    icon: CheckCircle, next: ['RECEIVED'], nextColors: ['#60a5fa'],
  },
  REJECTED: {
    label: 'Rejected', color: '#f87171', bg: 'rgba(248,113,113,0.1)', border: 'rgba(248,113,113,0.25)',
    icon: XCircle, next: [], nextColors: [],
  },
  RECEIVED: {
    label: 'Received', color: '#60a5fa', bg: 'rgba(96,165,250,0.1)', border: 'rgba(96,165,250,0.25)',
    icon: Package, next: ['REFUNDED'], nextColors: ['#a78bfa'],
  },
  REFUNDED: {
    label: 'Refunded', color: '#a78bfa', bg: 'rgba(167,139,250,0.1)', border: 'rgba(167,139,250,0.25)',
    icon: DollarSign, next: [], nextColors: [],
  },
};

const ALL_STATUSES = Object.keys(STATUS_CONFIG) as ReturnStatus[];

type SortKey = 'id' | 'refundAmount' | 'createdAt' | 'status';
type SortDir = 'asc' | 'desc';

export default function AdminReturns() {
  const [returns, setReturns] = useState<ReturnRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [search, setSearch] = useState('');
  const [updating, setUpdating] = useState<number | null>(null);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>('createdAt');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 15;

  const fetchReturns = useCallback(async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      else setRefreshing(true);
      const data = await adminAPI.getReturnRequests(filterStatus || undefined);
      setReturns(Array.isArray(data) ? data : []);
      setError('');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load return requests';
      setError(errorMessage);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [filterStatus]);

  useEffect(() => { fetchReturns(); setPage(1); }, [fetchReturns]);

  const handleUpdateStatus = useCallback(async (returnId: number, newStatus: string) => {
    setUpdating(returnId);
    setSuccessMsg('');
    try {
      await adminAPI.updateReturnStatus(returnId, newStatus);
      setSuccessMsg(`Return #${returnId} → ${newStatus}`);
      setTimeout(() => setSuccessMsg(''), 3000);
      await fetchReturns(true);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update return status';
      setError(errorMessage);
    } finally {
      setUpdating(null);
    }
  }, [fetchReturns]);

  const handleSort = useCallback((key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('desc'); }
  }, [sortKey]);

  const filtered = useMemo(() => {
    let list = [...returns];
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(r => {
        const rrWithUser = r as ReturnRequestWithUser;
        return (
          String(r.id).includes(q) ||
          r.order?.orderNumber?.toLowerCase().includes(q) ||
          rrWithUser.user?.firstName?.toLowerCase().includes(q) ||
          rrWithUser.user?.lastName?.toLowerCase().includes(q) ||
          rrWithUser.user?.email?.toLowerCase().includes(q) ||
          r.reason?.toLowerCase().includes(q)
        );
      });
    }
    list.sort((a, b) => {
      let va: number | string = '', vb: number | string = '';
      if (sortKey === 'refundAmount') { va = parseFloat(String(a.refundAmount ?? 0)); vb = parseFloat(String(b.refundAmount ?? 0)); }
      else if (sortKey === 'createdAt') { va = new Date(a.createdAt).getTime(); vb = new Date(b.createdAt).getTime(); }
      else if (sortKey === 'id') { va = a.id; vb = b.id; }
      else { va = a.status; vb = b.status; }
      return sortDir === 'asc' ? (va > vb ? 1 : -1) : (va < vb ? 1 : -1);
    });
    return list;
  }, [returns, search, sortKey, sortDir]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const statusCounts = useMemo(() =>
    ALL_STATUSES.reduce((acc, s) => ({ ...acc, [s]: returns.filter(r => r.status === s).length }), {} as Record<ReturnStatus, number>),
    [returns]
  );

  const totalRefundable = useMemo(() =>
    returns.filter(r => ['APPROVED', 'RECEIVED'].includes(r.status))
      .reduce((s, r) => s + parseFloat(String(r.refundAmount ?? 0)), 0),
    [returns]
  );

  const totalRefunded = useMemo(() =>
    returns.filter(r => r.status === 'REFUNDED')
      .reduce((s, r) => s + parseFloat(String(r.refundAmount ?? 0)), 0),
    [returns]
  );

  const SortIcon = ({ k }: { k: SortKey }) => (
    sortKey === k
      ? (sortDir === 'asc' ? <ChevronUp size={11} /> : <ChevronDown size={11} />)
      : <span style={{ opacity: 0.25 }}><ChevronDown size={11} /></span>
  );

  if (loading) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 320, gap: 12 }}>
      <div style={{ width: 36, height: 36, border: '3px solid #1f2937', borderTopColor: '#f59e0b', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <p style={{ color: '#6b7280', fontSize: 13 }}>Loading returns…</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  return (
    <div style={{ fontFamily: "'Segoe UI', 'Roboto', sans-serif", display: 'flex', flexDirection: 'column', gap: 16 }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes slideDown { from { opacity:0; transform:translateY(-6px); } to { opacity:1; transform:translateY(0); } }
        @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }

        .rt-table { width:100%; border-collapse:collapse; }
        .rt-table th {
          padding:10px 14px; text-align:left; font-size:11px; font-weight:700;
          color:#6b7280; text-transform:uppercase; letter-spacing:0.06em;
          background:#0f172a; border-bottom:1px solid rgba(255,255,255,0.06);
          white-space:nowrap; cursor:pointer; user-select:none;
        }
        .rt-table th:hover { color:#d1d5db; }
        .rt-table td {
          padding:12px 14px; font-size:13px; color:#d1d5db;
          border-bottom:1px solid rgba(255,255,255,0.04); vertical-align:middle;
        }
        .rt-table tr.data-row:hover td { background:rgba(255,255,255,0.025); cursor:pointer; }
        .rt-table tr.exp-row td { background:#080d16; }

        .status-pill {
          display:inline-flex; align-items:center; gap:5px;
          padding:4px 10px; border-radius:20px; font-size:11px; font-weight:700;
          border:1px solid; white-space:nowrap;
        }

        .action-btn {
          padding:5px 11px; border-radius:7px; font-size:11px; font-weight:700;
          border:none; cursor:pointer; transition:all 0.15s; white-space:nowrap;
          display:inline-flex; align-items:center; gap:4px;
        }
        .action-btn:disabled { opacity:0.4; cursor:not-allowed; }

        .filter-chip {
          display:inline-flex; align-items:center; gap:6px;
          padding:6px 12px; border-radius:20px; font-size:12px; font-weight:600;
          cursor:pointer; border:1px solid rgba(255,255,255,0.08);
          background:transparent; color:#9ca3af; transition:all 0.15s; white-space:nowrap;
        }
        .filter-chip:hover { border-color:rgba(245,158,11,0.3); color:#e5e7eb; }

        .search-input {
          width:100%; background:#111827; border:1px solid rgba(255,255,255,0.08);
          color:#e5e7eb; font-size:13px; padding:9px 12px 9px 36px;
          border-radius:9px; outline:none; font-family:'DM Sans',sans-serif;
          transition:border-color 0.15s; box-sizing:border-box;
        }
        .search-input:focus { border-color:rgba(245,158,11,0.4); }
        .search-input::placeholder { color:#4b5563; }

        .summary-card {
          background:#111827; border:1px solid rgba(255,255,255,0.07);
          border-radius:11px; padding:14px 16px;
        }

        .page-btn {
          width:30px; height:30px; border-radius:7px; border:1px solid rgba(255,255,255,0.08);
          background:transparent; color:#9ca3af; font-size:12px; font-weight:600;
          cursor:pointer; display:flex; align-items:center; justify-content:center; transition:all 0.15s;
        }
        .page-btn:hover:not(:disabled) { background:rgba(255,255,255,0.06); color:#e5e7eb; }
        .page-btn.pg-active { background:rgba(245,158,11,0.15); border-color:rgba(245,158,11,0.4); color:#f59e0b; }
        .page-btn:disabled { opacity:0.3; cursor:not-allowed; }

        .pipeline { display:flex; align-items:center; gap:6px; flex-wrap:wrap; }
        .pipeline-step {
          display:flex; align-items:center; gap:5px;
          padding:5px 10px; border-radius:6px; font-size:11px; font-weight:700;
          border:1px solid rgba(255,255,255,0.07);
        }
        .pipeline-step.done { opacity:1; }
        .pipeline-step.pending { opacity:0.35; }

        .scroll-x { overflow-x:auto; }
        .scroll-x::-webkit-scrollbar { height:4px; }
        .scroll-x::-webkit-scrollbar-track { background:#0f172a; }
        .scroll-x::-webkit-scrollbar-thumb { background:#1f2937; border-radius:4px; }

        @media (max-width:640px) {
          .hide-sm { display:none !important; }
          .rt-table td, .rt-table th { padding:10px 10px; }
        }
      `}</style>

      {/* Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <p style={{ fontSize: 11, fontWeight: 700, color: '#f59e0b', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 2 }}>Management</p>
          <h2 style={{ fontFamily: "'Segoe UI', 'Roboto', sans-serif", fontSize: 'clamp(18px,3vw,24px)', fontWeight: 800, color: '#f9fafb', margin: 0 }}>
            Returns &amp; Refunds
          </h2>
        </div>
        <button
          onClick={() => fetchReturns(true)}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '8px 14px', background: '#1f2937',
            border: '1px solid rgba(255,255,255,0.08)', borderRadius: 9,
            color: '#9ca3af', fontSize: 12, fontWeight: 600, cursor: 'pointer',
          }}
        >
          <RefreshCw size={13} style={{ animation: refreshing ? 'spin 0.8s linear infinite' : 'none' }} />
          Refresh
        </button>
      </div>

      {/* Summary strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 10 }}>
        <div className="summary-card">
          <p style={{ fontSize: 11, color: '#6b7280', marginBottom: 4 }}>Total Returns</p>
          <p style={{ fontSize: 22, fontWeight: 800, color: '#f9fafb', fontFamily: "'Segoe UI', 'Roboto', sans-serif" }}>{returns.length}</p>
        </div>
        <div className="summary-card">
          <p style={{ fontSize: 11, color: '#6b7280', marginBottom: 4 }}>Pending Action</p>
          <p style={{ fontSize: 22, fontWeight: 800, color: '#f59e0b', fontFamily: "'Segoe UI', 'Roboto', sans-serif" }}>
            {statusCounts.REQUESTED}
          </p>
        </div>
        <div className="summary-card">
          <p style={{ fontSize: 11, color: '#6b7280', marginBottom: 4 }}>Refund Pending</p>
          <p style={{ fontSize: 22, fontWeight: 800, color: '#60a5fa', fontFamily: "'Segoe UI', 'Roboto', sans-serif" }}>
            ₹{totalRefundable.toLocaleString('en-IN')}
          </p>
        </div>
        <div className="summary-card">
          <p style={{ fontSize: 11, color: '#6b7280', marginBottom: 4 }}>Total Refunded</p>
          <p style={{ fontSize: 22, fontWeight: 800, color: '#a78bfa', fontFamily: "'Segoe UI', 'Roboto', sans-serif" }}>
            ₹{totalRefunded.toLocaleString('en-IN')}
          </p>
        </div>
        <div className="summary-card">
          <p style={{ fontSize: 11, color: '#6b7280', marginBottom: 4 }}>Rejected</p>
          <p style={{ fontSize: 22, fontWeight: 800, color: '#f87171', fontFamily: "'Segoe UI', 'Roboto', sans-serif" }}>
            {statusCounts.REJECTED}
          </p>
        </div>
      </div>

      {/* Return pipeline visual */}
      <div style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '14px 18px' }}>
        <p style={{ fontSize: 10, fontWeight: 700, color: '#4b5563', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>Return Pipeline</p>
        <div className="pipeline">
          {ALL_STATUSES.filter(s => s !== 'REJECTED').map((s, i, arr) => {
            const cfg = STATUS_CONFIG[s];
            const Icon = cfg.icon;
            return (
              <React.Fragment key={s}>
                <div className="pipeline-step done" style={{ background: `${cfg.color}12`, borderColor: `${cfg.color}30`, color: cfg.color }}>
                  <Icon size={11} />
                  <span>{cfg.label}</span>
                  <span style={{ background: `${cfg.color}20`, borderRadius: 10, padding: '1px 6px', fontSize: 10 }}>{statusCounts[s]}</span>
                </div>
                {i < arr.length - 1 && <ArrowRight size={12} style={{ color: '#374151', flexShrink: 0 }} />}
              </React.Fragment>
            );
          })}
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
            <div className="pipeline-step" style={{ background: 'rgba(248,113,113,0.1)', borderColor: 'rgba(248,113,113,0.3)', color: '#f87171', opacity: 1 }}>
              <XCircle size={11} />
              Rejected
              <span style={{ background: 'rgba(248,113,113,0.2)', borderRadius: 10, padding: '1px 6px', fontSize: 10 }}>{statusCounts.REJECTED}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: '1 1 200px', maxWidth: 320 }}>
          <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#4b5563' }} />
          <input
            className="search-input"
            placeholder="Search return, order, customer…"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          <button
            className={`filter-chip ${filterStatus === '' ? 'active' : ''}`}
            onClick={() => { setFilterStatus(''); setPage(1); }}
            style={filterStatus === '' ? { background: 'rgba(245,158,11,0.12)', borderColor: 'rgba(245,158,11,0.4)', color: '#f59e0b' } : {}}
          >
            All <span style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 10, padding: '1px 6px', fontSize: 10 }}>{returns.length}</span>
          </button>
          {ALL_STATUSES.map(s => {
            const cfg = STATUS_CONFIG[s];
            const active = filterStatus === s;
            return (
              <button
                key={s}
                className="filter-chip"
                onClick={() => { setFilterStatus(s); setPage(1); }}
                style={active ? { background: cfg.bg, borderColor: cfg.border, color: cfg.color } : {}}
              >
                {cfg.label}
                <span style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 10, padding: '1px 6px', fontSize: 10 }}>{statusCounts[s]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Toasts */}
      {error && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.3)', borderRadius: 9, color: '#f87171', fontSize: 13 }}>
          <AlertTriangle size={14} /> {error}
        </div>
      )}
      {successMsg && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.3)', borderRadius: 9, color: '#4ade80', fontSize: 13 }}>
          <CheckCircle size={14} /> {successMsg}
        </div>
      )}

      {/* Count */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <p style={{ fontSize: 12, color: '#4b5563' }}>
          Showing <span style={{ color: '#9ca3af', fontWeight: 600 }}>{paginated.length}</span> of <span style={{ color: '#9ca3af', fontWeight: 600 }}>{filtered.length}</span> requests
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Filter size={12} style={{ color: '#4b5563' }} />
          <span style={{ fontSize: 12, color: '#4b5563' }}>Sort: <span style={{ color: '#9ca3af' }}>{sortKey}</span></span>
        </div>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px 24px', background: '#111827', borderRadius: 14, border: '1px solid rgba(255,255,255,0.07)' }}>
          <RotateCcw size={36} style={{ color: '#374151', margin: '0 auto 12px' }} />
          <p style={{ color: '#6b7280', fontSize: 14, fontWeight: 600 }}>No return requests found</p>
          <p style={{ color: '#374151', fontSize: 12, marginTop: 4 }}>Try adjusting your filters</p>
        </div>
      ) : (
        <div style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, overflow: 'hidden' }}>
          <div className="scroll-x">
            <table className="rt-table" style={{ minWidth: 700 }}>
              <thead>
                <tr>
                  <th onClick={() => handleSort('id')} style={{ width: 50 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Hash size={11} /><SortIcon k="id" /></div>
                  </th>
                  <th>Order</th>
                  <th className="hide-sm"><div style={{ display: 'flex', alignItems: 'center', gap: 4 }}><User size={11} /> Customer</div></th>
                  <th onClick={() => handleSort('refundAmount')}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}><DollarSign size={11} /> Refund <SortIcon k="refundAmount" /></div>
                  </th>
                  <th onClick={() => handleSort('status')}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>Status <SortIcon k="status" /></div>
                  </th>
                  <th onClick={() => handleSort('createdAt')} className="hide-sm">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Calendar size={11} /> Date <SortIcon k="createdAt" /></div>
                  </th>
                  <th>Actions</th>
                  <th style={{ width: 28 }}></th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((rr) => {
                  const cfg = STATUS_CONFIG[rr.status as ReturnStatus] ?? STATUS_CONFIG.REQUESTED;
                  const StatusIcon = cfg.icon;
                  const rrWithUser = rr as ReturnRequest & { user?: { firstName?: string; lastName?: string; email?: string } };
                  const isExpanded = expanded === rr.id;
                  const isUpdating = updating === rr.id;

                  return (
                    <React.Fragment key={rr.id}>
                      <tr
                        className="data-row"
                        onClick={() => setExpanded(isExpanded ? null : rr.id)}
                      >
                        <td style={{ color: '#4b5563', fontWeight: 600, fontSize: 11 }}>#{rr.id}</td>
                        <td>
                          <span style={{ fontWeight: 700, color: '#f9fafb', fontSize: 13 }}>
                            {rr.order?.orderNumber ?? `ORD-${rr.orderId}`}
                          </span>
                        </td>
                        <td className="hide-sm">
                          {rrWithUser.user ? (
                            <div>
                              <div style={{ fontWeight: 600, color: '#e5e7eb', fontSize: 13 }}>
                                {`${rrWithUser.user.firstName ?? ''} ${rrWithUser.user.lastName ?? ''}`.trim() || '—'}
                              </div>
                              <div style={{ fontSize: 11, color: '#6b7280' }}>{rrWithUser.user.email}</div>
                            </div>
                          ) : <span style={{ color: '#4b5563' }}>—</span>}
                        </td>
                        <td>
                          {rr.refundAmount != null ? (
                            <span style={{ fontWeight: 700, color: '#a78bfa', fontSize: 13 }}>
                              ₹{parseFloat(String(rr.refundAmount)).toLocaleString('en-IN')}
                            </span>
                          ) : <span style={{ color: '#4b5563' }}>—</span>}
                        </td>
                        <td>
                          <span className="status-pill" style={{ color: cfg.color, background: cfg.bg, borderColor: cfg.border }}>
                            <StatusIcon size={10} />
                            {cfg.label}
                          </span>
                        </td>
                        <td className="hide-sm" style={{ color: '#6b7280', fontSize: 12 }}>
                          {new Date(rr.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' })}
                        </td>
                        <td onClick={e => e.stopPropagation()}>
                          {isUpdating ? (
                            <div style={{ width: 16, height: 16, border: '2px solid #1f2937', borderTopColor: '#f59e0b', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                          ) : cfg.next.length > 0 ? (
                            <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                              {cfg.next.map((nextStatus, ni) => (
                                <button
                                  key={nextStatus}
                                  className="action-btn"
                                  disabled={isUpdating}
                                  onClick={() => handleUpdateStatus(rr.id, nextStatus)}
                                  style={{
                                    background: `${cfg.nextColors[ni]}18`,
                                    color: cfg.nextColors[ni],
                                    border: `1px solid ${cfg.nextColors[ni]}40`,
                                  }}
                                >
                                  {nextStatus === 'APPROVED' && <CheckCircle size={10} />}
                                  {nextStatus === 'REJECTED' && <XCircle size={10} />}
                                  {nextStatus === 'RECEIVED' && <Package size={10} />}
                                  {nextStatus === 'REFUNDED' && <DollarSign size={10} />}
                                  {nextStatus}
                                </button>
                              ))}
                            </div>
                          ) : (
                            <span style={{ fontSize: 11, color: '#374151' }}>Closed</span>
                          )}
                        </td>
                        <td>
                          <ChevronDown
                            size={14}
                            style={{ color: '#374151', transition: 'transform 0.2s', transform: isExpanded ? 'rotate(180deg)' : 'none' }}
                          />
                        </td>
                      </tr>

                      {/* Expanded row */}
                      {isExpanded && (
                        <tr className="exp-row">
                          <td colSpan={8} style={{ padding: '16px 20px' }}>
                            <div style={{ animation: 'slideDown 0.2s ease', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>

                              {/* Return items */}
                              <div>
                                <p style={{ fontSize: 10, fontWeight: 700, color: '#4b5563', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Returned Items</p>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                  {rr.items?.map(ri => {
                                    const productName = ri.orderItem?.product?.name ?? `Product #${ri.orderItem?.productId}`;
                                    const pkgLabel = ri.orderItem?.package ? ` · ${ri.orderItem.package.duration}` : '';
                                    return (
                                      <div key={ri.id} style={{
                                        background: '#111827', border: '1px solid rgba(255,255,255,0.06)',
                                        borderRadius: 8, padding: '8px 12px',
                                        display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8,
                                      }}>
                                        <div>
                                          <p style={{ fontSize: 12, fontWeight: 600, color: '#e5e7eb', margin: 0 }}>{productName}{pkgLabel}</p>
                                          <p style={{ fontSize: 11, color: '#6b7280', margin: '2px 0 0' }}>Return qty: {ri.quantity}</p>
                                        </div>
                                      </div>
                                    );
                                  })}
                                  {(!rr.items || rr.items.length === 0) && (
                                    <p style={{ fontSize: 12, color: '#4b5563' }}>No item details available</p>
                                  )}
                                </div>
                              </div>

                              {/* Reason + details */}
                              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                <p style={{ fontSize: 10, fontWeight: 700, color: '#4b5563', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 0 }}>Details</p>
                                {rr.reason && (
                                  <div style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 8, padding: '10px 12px' }}>
                                    <div style={{ display: 'flex', gap: 6, alignItems: 'flex-start' }}>
                                      <MessageSquare size={13} style={{ color: '#f59e0b', flexShrink: 0, marginTop: 1 }} />
                                      <p style={{ fontSize: 12, color: '#d1d5db', margin: 0, lineHeight: 1.5 }}>{rr.reason}</p>
                                    </div>
                                  </div>
                                )}
                                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                  <Calendar size={13} style={{ color: '#6b7280' }} />
                                  <p style={{ fontSize: 12, color: '#9ca3af', margin: 0 }}>
                                    Requested: {new Date(rr.createdAt).toLocaleString('en-IN')}
                                  </p>
                                </div>
                                {rr.refundAmount != null && (
                                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                    <DollarSign size={13} style={{ color: '#a78bfa' }} />
                                    <p style={{ fontSize: 12, color: '#9ca3af', margin: 0 }}>
                                      Refund amount: <span style={{ color: '#a78bfa', fontWeight: 700 }}>₹{parseFloat(String(rr.refundAmount)).toLocaleString('en-IN')}</span>
                                    </p>
                                  </div>
                                )}
                              </div>

                              {/* Status journey */}
                              <div>
                                <p style={{ fontSize: 10, fontWeight: 700, color: '#4b5563', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>Status Journey</p>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                  {ALL_STATUSES.filter(s => s !== 'REJECTED').map(s => {
                                    const scfg = STATUS_CONFIG[s];
                                    const SIcon = scfg.icon;
                                    const statusOrder = ['REQUESTED', 'APPROVED', 'RECEIVED', 'REFUNDED'];
                                    const currentIdx = statusOrder.indexOf(rr.status);
                                    const thisIdx = statusOrder.indexOf(s);
                                    const isDone = thisIdx <= currentIdx;
                                    return (
                                      <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <div style={{
                                          width: 24, height: 24, borderRadius: '50%',
                                          background: isDone ? `${scfg.color}20` : '#1f2937',
                                          border: `2px solid ${isDone ? scfg.color : '#374151'}`,
                                          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                                          color: isDone ? scfg.color : '#4b5563',
                                        }}>
                                          <SIcon size={11} />
                                        </div>
                                        <span style={{ fontSize: 12, fontWeight: isDone ? 600 : 400, color: isDone ? scfg.color : '#4b5563' }}>
                                          {scfg.label}
                                        </span>
                                        {rr.status === s && (
                                          <span style={{ fontSize: 10, fontWeight: 700, color: scfg.color, background: scfg.bg, padding: '2px 6px', borderRadius: 4 }}>Current</span>
                                        )}
                                      </div>
                                    );
                                  })}
                                  {rr.status === 'REJECTED' && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                                      <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'rgba(248,113,113,0.2)', border: '2px solid #f87171', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <XCircle size={11} color="#f87171" />
                                      </div>
                                      <span style={{ fontSize: 12, fontWeight: 600, color: '#f87171' }}>Rejected</span>
                                      <span style={{ fontSize: 10, fontWeight: 700, color: '#f87171', background: 'rgba(248,113,113,0.1)', padding: '2px 6px', borderRadius: 4 }}>Current</span>
                                    </div>
                                  )}
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
            <div style={{ padding: '12px 16px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
              <span style={{ fontSize: 12, color: '#4b5563' }}>Page {page} of {totalPages}</span>
              <div style={{ display: 'flex', gap: 4 }}>
                <button className="page-btn" disabled={page === 1} onClick={() => setPage(1)}>«</button>
                <button className="page-btn" disabled={page === 1} onClick={() => setPage(p => p - 1)}>‹</button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const p = Math.max(1, Math.min(totalPages - 4, page - 2)) + i;
                  return <button key={p} className={`page-btn ${p === page ? 'pg-active' : ''}`} onClick={() => setPage(p)}>{p}</button>;
                })}
                <button className="page-btn" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>›</button>
                <button className="page-btn" disabled={page === totalPages} onClick={() => setPage(totalPages)}>»</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}