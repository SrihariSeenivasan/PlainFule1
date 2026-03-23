'use client';

import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { adminAPI, Order, OrderItem } from '@/lib/api';
import {
  Search, Filter, ChevronDown, ChevronUp, RefreshCw,
  Package, Truck, CheckCircle, XCircle, Clock, AlertCircle,
  Calendar, Hash,
  User, CreditCard, MapPin,
} from 'lucide-react';

// Extended Order type with user info
interface OrderWithUser extends Order {
  user?: {
    firstName?: string;
    lastName?: string;
    email?: string;
  };
}

const ORDER_STATUSES = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'] as const;
type OrderStatus = typeof ORDER_STATUSES[number];

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; bg: string; border: string; icon: React.ComponentType<{ size?: number }> }> = {
  PENDING:    { label: 'Pending',    color: '#f59e0b', bg: 'rgba(245,158,11,0.1)',  border: 'rgba(245,158,11,0.25)',  icon: Clock },
  PROCESSING: { label: 'Processing', color: '#a78bfa', bg: 'rgba(167,139,250,0.1)', border: 'rgba(167,139,250,0.25)', icon: AlertCircle },
  SHIPPED:    { label: 'Shipped',    color: '#60a5fa', bg: 'rgba(96,165,250,0.1)',  border: 'rgba(96,165,250,0.25)',  icon: Truck },
  DELIVERED:  { label: 'Delivered',  color: '#4ade80', bg: 'rgba(74,222,128,0.1)',  border: 'rgba(74,222,128,0.25)',  icon: CheckCircle },
  CANCELLED:  { label: 'Cancelled',  color: '#f87171', bg: 'rgba(248,113,113,0.1)', border: 'rgba(248,113,113,0.25)', icon: XCircle },
};

type SortKey = 'id' | 'totalAmount' | 'createdAt' | 'status';
type SortDir = 'asc' | 'desc';

export default function AdminOrders() {
  const [orders, setOrders] = useState<OrderWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [search, setSearch] = useState('');
  const [updating, setUpdating] = useState<number | null>(null);
  const [successMsg, setSuccessMsg] = useState('');
  const [expandedOrder, setExpandedOrder] = useState<number | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>('createdAt');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [page, setPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const PAGE_SIZE = 15;

  const fetchOrders = useCallback(async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      else setRefreshing(true);
      const fetched = await adminAPI.getOrders(filterStatus || undefined);
      setOrders(Array.isArray(fetched) ? fetched : []);
      setError('');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load orders';
      setError(errorMessage);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [filterStatus]);

  useEffect(() => { fetchOrders(); setPage(1); }, [fetchOrders]);

  const handleStatusUpdate = async (orderId: number, newStatus: string) => {
    setUpdating(orderId);
    setSuccessMsg('');
    try {
      await adminAPI.updateOrderStatus(orderId, { status: newStatus });
      setSuccessMsg(`Order #${orderId} → ${newStatus}`);
      setTimeout(() => setSuccessMsg(''), 3000);
      await fetchOrders(true);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update order';
      setError(errorMessage);
    } finally {
      setUpdating(null);
    }
  };

  const handleSort = useCallback((key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('desc'); }
  }, [sortKey]);

  const filtered = useMemo(() => {
    let list = [...orders];
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(o => {
        const orderWithUser = o as OrderWithUser;
        return (
          orderWithUser.orderNumber?.toLowerCase().includes(q) ||
          String(orderWithUser.id).includes(q) ||
          orderWithUser.user?.firstName?.toLowerCase().includes(q) ||
          orderWithUser.user?.lastName?.toLowerCase().includes(q) ||
          orderWithUser.user?.email?.toLowerCase().includes(q)
        );
      });
    }
    list.sort((a, b) => {
      let va: string | number = '', vb: string | number = '';
      if (sortKey === 'totalAmount') { va = parseFloat(String(a.totalAmount)); vb = parseFloat(String(b.totalAmount)); }
      else if (sortKey === 'createdAt') { va = new Date(a.createdAt).getTime(); vb = new Date(b.createdAt).getTime(); }
      else if (sortKey === 'id') { va = a.id; vb = b.id; }
      else { va = a.status; vb = b.status; }
      return sortDir === 'asc' ? (va > vb ? 1 : -1) : (va < vb ? 1 : -1);
    });
    return list;
  }, [orders, search, sortKey, sortDir]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const statusCounts = useMemo(() =>
    ORDER_STATUSES.reduce((acc, s) => ({ ...acc, [s]: orders.filter(o => o.status === s).length }), {} as Record<OrderStatus, number>),
    [orders]
  );

  const totalRevenue = useMemo(() => orders.filter(o => o.status !== 'CANCELLED').reduce((s, o) => s + parseFloat(String(o.totalAmount)), 0), [orders]);

  const getItemLabel = useCallback((item: OrderItem) => {
    const productName = item.product?.name ?? `Product #${item.productId}`;
    const packageLabel = item.package ? ` · ${item.package.duration}` : '';
    return `${productName}${packageLabel}`;
  }, []);

  const SortIcon = useCallback(({ k }: { k: SortKey }) => (
    sortKey === k
      ? (sortDir === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />)
      : <span style={{ opacity: 0.3 }}><ChevronDown size={12} /></span>
  ), [sortKey, sortDir]);

  if (loading) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 320, gap: 12 }}>
      <div style={{ width: 36, height: 36, border: '3px solid #1f2937', borderTopColor: '#4ade80', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <p style={{ color: '#6b7280', fontSize: 13 }}>Loading orders…</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  return (
    <div style={{ fontFamily: "'Segoe UI', 'Roboto', sans-serif", display: 'flex', flexDirection: 'column', gap: 16 }}>
      <style>{`

        .orders-table { width: 100%; border-collapse: collapse; }
        .orders-table th {
          padding: 10px 14px; text-align: left; font-size: 11px; font-weight: 700;
          color: #6b7280; text-transform: uppercase; letter-spacing: 0.06em;
          background: #0f172a; border-bottom: 1px solid rgba(255,255,255,0.06);
          white-space: nowrap; cursor: pointer; user-select: none;
        }
        .orders-table th:hover { color: #d1d5db; }
        .orders-table td {
          padding: 12px 14px; font-size: 13px; color: #d1d5db;
          border-bottom: 1px solid rgba(255,255,255,0.04);
          vertical-align: middle;
        }
        .orders-table tr.data-row:hover td { background: rgba(255,255,255,0.025); cursor: pointer; }
        .orders-table tr.expanded-row td { background: #0a0f1a; }

        .status-pill {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 700;
          border: 1px solid; white-space: nowrap;
        }

        .filter-chip {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 600;
          cursor: pointer; border: 1px solid rgba(255,255,255,0.08);
          background: transparent; color: #9ca3af; transition: all 0.15s; white-space: nowrap;
        }
        .filter-chip:hover { border-color: rgba(74,222,128,0.3); color: #e5e7eb; }
        .filter-chip.active { background: rgba(74,222,128,0.12); border-color: rgba(74,222,128,0.4); color: #4ade80; }

        .status-select {
          background: #1f2937; border: 1px solid rgba(255,255,255,0.1);
          color: #e5e7eb; font-size: 12px; font-weight: 600;
          padding: 5px 8px; border-radius: 7px; cursor: pointer; outline: none;
          font-family: 'Segoe UI', 'Roboto', sans-serif;
          transition: border-color 0.15s;
        }
        .status-select:hover { border-color: rgba(74,222,128,0.4); }
        .status-select:disabled { opacity: 0.4; cursor: not-allowed; }

        .page-btn {
          width: 30px; height: 30px; border-radius: 7px; border: 1px solid rgba(255,255,255,0.08);
          background: transparent; color: #9ca3af; font-size: 12px; font-weight: 600;
          cursor: pointer; display: flex; align-items: center; justify-content: center;
          transition: all 0.15s;
        }
        .page-btn:hover:not(:disabled) { background: rgba(255,255,255,0.06); color: #e5e7eb; }
        .page-btn.active { background: rgba(74,222,128,0.15); border-color: rgba(74,222,128,0.4); color: #4ade80; }
        .page-btn:disabled { opacity: 0.3; cursor: not-allowed; }

        .search-input {
          width: 100%; background: #111827; border: 1px solid rgba(255,255,255,0.08);
          color: #e5e7eb; font-size: 13px; padding: 9px 12px 9px 36px;
          border-radius: 9px; outline: none; font-family: 'Segoe UI', 'Roboto', sans-serif;
          transition: border-color 0.15s;
        }
        .search-input:focus { border-color: rgba(74,222,128,0.4); }
        .search-input::placeholder { color: #4b5563; }

        .summary-card {
          background: #111827; border: 1px solid rgba(255,255,255,0.07);
          border-radius: 11px; padding: 14px 16px;
        }

        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .slide-down { animation: slideDown 0.2s ease forwards; }

        .scroll-x { overflow-x: auto; }
        .scroll-x::-webkit-scrollbar { height: 4px; }
        .scroll-x::-webkit-scrollbar-track { background: #0f172a; }
        .scroll-x::-webkit-scrollbar-thumb { background: #1f2937; border-radius: 4px; }

        @media (max-width: 640px) {
          .hide-mobile { display: none !important; }
          .orders-table td, .orders-table th { padding: 10px 10px; }
        }
      `}</style>

      {/* Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <p style={{ fontSize: 11, fontWeight: 700, color: '#4ade80', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 2 }}>Management</p>
          <h2 style={{ fontFamily: "'Segoe UI', 'Roboto', sans-serif", fontSize: 'clamp(18px, 3vw, 24px)', fontWeight: 800, color: '#f9fafb', margin: 0 }}>
            Orders
          </h2>
        </div>
        <button
          onClick={() => fetchOrders(true)}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '8px 14px', background: '#1f2937', border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 9, color: '#9ca3af', fontSize: 12, fontWeight: 600,
            cursor: 'pointer', transition: 'all 0.15s',
          }}
        >
          <RefreshCw size={13} style={{ animation: refreshing ? 'spin 0.8s linear infinite' : 'none' }} />
          Refresh
        </button>
      </div>

      {/* Summary strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 10 }}>
        <div className="summary-card" style={{ gridColumn: 'span 1' }}>
          <p style={{ fontSize: 11, color: '#6b7280', marginBottom: 4 }}>Total Orders</p>
          <p style={{ fontSize: 22, fontWeight: 800, color: '#f9fafb', fontFamily: "'Segoe UI', 'Roboto', sans-serif" }}>{orders.length.toLocaleString('en-IN')}</p>
        </div>
        <div className="summary-card">
          <p style={{ fontSize: 11, color: '#6b7280', marginBottom: 4 }}>Revenue</p>
          <p style={{ fontSize: 22, fontWeight: 800, color: '#4ade80', fontFamily: "'Segoe UI', 'Roboto', sans-serif" }}>₹{(totalRevenue / 100000).toFixed(1)}L</p>
        </div>
        {ORDER_STATUSES.slice(0, 3).map(s => {
          const cfg = STATUS_CONFIG[s];
          return (
            <div key={s} className="summary-card">
              <p style={{ fontSize: 11, color: '#6b7280', marginBottom: 4 }}>{cfg.label}</p>
              <p style={{ fontSize: 22, fontWeight: 800, color: cfg.color, fontFamily: "'Segoe UI', 'Roboto', sans-serif" }}>{statusCounts[s]}</p>
            </div>
          );
        })}
      </div>

      {/* Filters row */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>
        {/* Search */}
        <div style={{ position: 'relative', flex: '1 1 200px', maxWidth: 320 }}>
          <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#4b5563' }} />
          <input
            className="search-input"
            placeholder="Search order, customer…"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
          />
        </div>

        {/* Status chips */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          <button
            className={`filter-chip ${filterStatus === '' ? 'active' : ''}`}
            onClick={() => { setFilterStatus(''); setPage(1); }}
          >
            All <span style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 10, padding: '1px 6px', fontSize: 10 }}>{orders.length}</span>
          </button>
          {ORDER_STATUSES.map(s => {
            const cfg = STATUS_CONFIG[s];
            return (
              <button
                key={s}
                className={`filter-chip ${filterStatus === s ? 'active' : ''}`}
                onClick={() => { setFilterStatus(s); setPage(1); }}
                style={filterStatus === s ? { background: `${cfg.color}18`, borderColor: `${cfg.color}55`, color: cfg.color } : {}}
              >
                {cfg.label}
                <span style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 10, padding: '1px 6px', fontSize: 10 }}>{statusCounts[s]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Toast messages */}
      {error && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.3)', borderRadius: 9, color: '#f87171', fontSize: 13 }}>
          <XCircle size={15} /> {error}
        </div>
      )}
      {successMsg && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.3)', borderRadius: 9, color: '#4ade80', fontSize: 13 }}>
          <CheckCircle size={15} /> {successMsg}
        </div>
      )}

      {/* Results count */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <p style={{ fontSize: 12, color: '#4b5563' }}>
          Showing <span style={{ color: '#9ca3af', fontWeight: 600 }}>{paginated.length}</span> of <span style={{ color: '#9ca3af', fontWeight: 600 }}>{filtered.length}</span> orders
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Filter size={12} style={{ color: '#4b5563' }} />
          <span style={{ fontSize: 12, color: '#4b5563' }}>Sort: <span style={{ color: '#9ca3af' }}>{sortKey}</span></span>
        </div>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px 24px', background: '#111827', borderRadius: 14, border: '1px solid rgba(255,255,255,0.07)' }}>
          <Package size={36} style={{ color: '#374151', margin: '0 auto 12px' }} />
          <p style={{ color: '#6b7280', fontSize: 14, fontWeight: 600 }}>No orders found</p>
          <p style={{ color: '#374151', fontSize: 12, marginTop: 4 }}>Try adjusting your search or filters</p>
        </div>
      ) : (
        <div style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, overflow: 'hidden' }}>
          <div className="scroll-x">
            <table className="orders-table" style={{ minWidth: 720 }}>
              <thead>
                <tr>
                  <th onClick={() => handleSort('id')} style={{ width: 44 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Hash size={11} /><SortIcon k="id" /></div>
                  </th>
                  <th>Order</th>
                  <th className="hide-mobile"><div style={{ display: 'flex', alignItems: 'center', gap: 4 }}><User size={11} /> Customer</div></th>
                  <th className="hide-mobile">Items</th>
                  <th onClick={() => handleSort('totalAmount')}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}><CreditCard size={11} /> Amount <SortIcon k="totalAmount" /></div>
                  </th>
                  <th onClick={() => handleSort('status')}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>Status <SortIcon k="status" /></div>
                  </th>
                  <th onClick={() => handleSort('createdAt')} className="hide-mobile">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Calendar size={11} /> Date <SortIcon k="createdAt" /></div>
                  </th>
                  <th style={{ width: 130 }}>Update</th>
                  <th style={{ width: 36 }}></th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((order) => {
                  const cfg = STATUS_CONFIG[order.status as OrderStatus] ?? STATUS_CONFIG.PENDING;
                  const StatusIcon = cfg.icon;
                  const orderWithUser = order as OrderWithUser;
                  const isExpanded = expandedOrder === order.id;
                  const isUpdating = updating === order.id;

                  return (
                    <React.Fragment key={order.id}>
                      <tr
                        className="data-row"
                        onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                      >
                        <td style={{ color: '#4b5563', fontWeight: 600, fontSize: 11 }}>#{order.id}</td>
                        <td>
                          <div style={{ fontWeight: 700, color: '#f9fafb', fontSize: 13 }}>{order.orderNumber}</div>
                        </td>
                        <td className="hide-mobile">
                          {orderWithUser.user ? (
                            <div>
                              <div style={{ fontWeight: 600, color: '#e5e7eb', fontSize: 13 }}>
                                {`${orderWithUser.user.firstName ?? ''} ${orderWithUser.user.lastName ?? ''}`.trim() || '—'}
                              </div>
                              <div style={{ fontSize: 11, color: '#6b7280' }}>{orderWithUser.user.email}</div>
                            </div>
                          ) : <span style={{ color: '#4b5563' }}>—</span>}
                        </td>
                        <td className="hide-mobile">
                          <span style={{ background: 'rgba(255,255,255,0.06)', padding: '3px 8px', borderRadius: 6, fontSize: 11, fontWeight: 600, color: '#9ca3af' }}>
                            {order.items?.length ?? 0} item{(order.items?.length ?? 0) !== 1 ? 's' : ''}
                          </span>
                        </td>
                        <td>
                          <span style={{ fontWeight: 700, color: '#f9fafb', fontSize: 13 }}>
                            ₹{parseFloat(String(order.totalAmount)).toLocaleString('en-IN')}
                          </span>
                        </td>
                        <td>
                          <span className="status-pill" style={{ color: cfg.color, background: cfg.bg, borderColor: cfg.border }}>
                            <StatusIcon size={10} />
                            {cfg.label}
                          </span>
                        </td>
                        <td className="hide-mobile" style={{ color: '#6b7280', fontSize: 12 }}>
                          {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' })}
                        </td>
                        <td onClick={e => e.stopPropagation()}>
                          {order.status !== 'CANCELLED' ? (
                            <select
                              className="status-select"
                              value={order.status}
                              disabled={isUpdating}
                              onChange={e => handleStatusUpdate(order.id, e.target.value)}
                            >
                              {ORDER_STATUSES.filter(s => s !== 'CANCELLED').map(s => (
                                <option key={s} value={s}>{s}</option>
                              ))}
                            </select>
                          ) : (
                            <span style={{ fontSize: 11, color: '#374151' }}>Closed</span>
                          )}
                        </td>
                        <td>
                          {isUpdating ? (
                            <div style={{ width: 14, height: 14, border: '2px solid #1f2937', borderTopColor: '#4ade80', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                          ) : (
                            <ChevronDown size={14} style={{ color: '#374151', transition: 'transform 0.2s', transform: isExpanded ? 'rotate(180deg)' : 'none' }} />
                          )}
                        </td>
                      </tr>

                      {/* Expanded detail row */}
                      {isExpanded && (
                        <tr key={`${order.id}-exp`} className="expanded-row">
                          <td colSpan={9} style={{ padding: '16px 20px' }}>
                            <div className="slide-down" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
                              {/* Items */}
                              <div>
                                <p style={{ fontSize: 10, fontWeight: 700, color: '#4b5563', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Order Items</p>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                  {order.items?.map(item => (
                                    <div key={item.id} style={{
                                      background: '#111827', border: '1px solid rgba(255,255,255,0.06)',
                                      borderRadius: 8, padding: '8px 12px',
                                      display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8,
                                    }}>
                                      <div>
                                        <p style={{ fontSize: 12, fontWeight: 600, color: '#e5e7eb', margin: 0 }}>{getItemLabel(item)}</p>
                                        <p style={{ fontSize: 11, color: '#6b7280', margin: '2px 0 0' }}>Qty: {item.quantity}</p>
                                      </div>
                                      <span style={{ fontSize: 12, fontWeight: 700, color: '#4ade80', flexShrink: 0 }}>
                                        ₹{(parseFloat(String(item.price)) * item.quantity).toLocaleString('en-IN')}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Details */}
                              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                <p style={{ fontSize: 10, fontWeight: 700, color: '#4b5563', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 0 }}>Details</p>
                                {order.shippingAddress && (
                                  <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                                    <MapPin size={13} style={{ color: '#6b7280', flexShrink: 0, marginTop: 1 }} />
                                    <p style={{ fontSize: 12, color: '#9ca3af', margin: 0 }}>{order.shippingAddress}</p>
                                  </div>
                                )}
                                {order.deliveryDate && (
                                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                    <CheckCircle size={13} style={{ color: '#4ade80', flexShrink: 0 }} />
                                    <p style={{ fontSize: 12, color: '#9ca3af', margin: 0 }}>
                                      Delivered: {new Date(order.deliveryDate).toLocaleDateString('en-IN')}
                                    </p>
                                  </div>
                                )}
                                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                  <Calendar size={13} style={{ color: '#6b7280', flexShrink: 0 }} />
                                  <p style={{ fontSize: 12, color: '#9ca3af', margin: 0 }}>
                                    Placed: {new Date(order.createdAt).toLocaleString('en-IN')}
                                  </p>
                                </div>
                                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                  <CreditCard size={13} style={{ color: '#6b7280', flexShrink: 0 }} />
                                  <p style={{ fontSize: 12, color: '#9ca3af', margin: 0 }}>
                                    Total: <span style={{ color: '#4ade80', fontWeight: 700 }}>₹{parseFloat(String(order.totalAmount)).toLocaleString('en-IN')}</span>
                                  </p>
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
              <span style={{ fontSize: 12, color: '#4b5563' }}>
                Page {page} of {totalPages}
              </span>
              <div style={{ display: 'flex', gap: 4 }}>
                <button className="page-btn" disabled={page === 1} onClick={() => setPage(1)}>«</button>
                <button className="page-btn" disabled={page === 1} onClick={() => setPage(p => p - 1)}>‹</button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const p = Math.max(1, Math.min(totalPages - 4, page - 2)) + i;
                  return (
                    <button key={p} className={`page-btn ${p === page ? 'active' : ''}`} onClick={() => setPage(p)}>{p}</button>
                  );
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