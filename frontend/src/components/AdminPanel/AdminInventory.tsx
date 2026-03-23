'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import {
  Search,
  Minus,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Loader2,
  Package,
  TrendingDown,
  TrendingUp,
  Filter,
} from 'lucide-react';
import { adminAPI, Product, ProductPackage } from '@/lib/api';

/* ─── Types ─────────────────────────────────────────────── */
type StockLevel = 'out' | 'critical' | 'low' | 'ok';

interface StockStatus {
  level: StockLevel;
  label: string;
  color: string;
  bg: string;
  border: string;
}

/* ─── Helpers ────────────────────────────────────────────── */
function getStockStatus(stock: number): StockStatus {
  if (stock === 0)  return { level: 'out',      label: 'Out of Stock', color: '#f87171', bg: 'rgba(248,113,113,0.1)',  border: 'rgba(248,113,113,0.3)'  };
  if (stock <= 5)   return { level: 'critical',  label: 'Critical',     color: '#fb923c', bg: 'rgba(251,146,60,0.1)',   border: 'rgba(251,146,60,0.3)'   };
  if (stock <= 15)  return { level: 'low',       label: 'Low Stock',    color: '#f59e0b', bg: 'rgba(245,158,11,0.1)',   border: 'rgba(245,158,11,0.3)'   };
  return                   { level: 'ok',        label: 'In Stock',     color: '#4ade80', bg: 'rgba(74,222,128,0.1)',   border: 'rgba(74,222,128,0.3)'   };
}

const PAGE_SIZE = 12;

/* ─── Stock adjuster buttons ─────────────────────────────── */
interface AdjustBtnProps {
  label: string;
  disabled: boolean;
  onClick: () => void;
  variant: 'add' | 'sub';
}
function AdjustBtn({ label, disabled, onClick, variant }: AdjustBtnProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      style={{
        flex: 1,
        padding: '6px 4px',
        borderRadius: 7,
        border: 'none',
        fontSize: 12,
        fontWeight: 700,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.45 : 1,
        background: variant === 'add' ? 'rgba(74,222,128,0.15)' : 'rgba(248,113,113,0.15)',
        color:      variant === 'add' ? '#4ade80'               : '#f87171',
        transition: 'opacity 0.15s, background 0.15s',
        fontFamily: "'Segoe UI', 'Roboto', sans-serif",
      }}
    >
      {label}
    </button>
  );
}

/* ─── Single package row ─────────────────────────────────── */
interface PackageRowProps {
  pkg: ProductPackage;
  productId: number;
  isUpdating: boolean;
  onAdjust: (productId: number, pkgId: string, delta: number) => void;
  onSetStock: (productId: number, pkgId: string, value: number) => void;
}
function PackageRow({ pkg, productId, isUpdating, onAdjust, onSetStock }: PackageRowProps) {
  const stock = pkg.stock ?? 0;
  const status = getStockStatus(stock);
  const [localVal, setLocalVal] = useState(String(stock));

  /* sync when external stock changes */
  useEffect(() => { setLocalVal(String(stock)); }, [stock]);

  const commitInput = () => {
    const parsed = parseInt(localVal, 10);
    if (!Number.isNaN(parsed) && parsed !== stock) {
      onSetStock(productId, pkg.id, parsed);
    } else {
      setLocalVal(String(stock));
    }
  };

  return (
    <div style={{
      background: '#0a0f1a',
      border: `1px solid ${status.border}`,
      borderRadius: 10,
      padding: '12px 14px',
    }}>
      {/* Package header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
        <div>
          <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: '#e5e7eb' }}>{pkg.duration}</p>
          <p style={{ margin: 0, fontSize: 11, color: '#6b7280' }}>{pkg.pouches} pouches · ₹{(pkg.price ?? 0).toLocaleString('en-IN')}</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{ margin: 0, fontSize: 22, fontWeight: 800, color: status.color, fontFamily: "'Segoe UI', 'Roboto', sans-serif", lineHeight: 1 }}>{stock}</p>
          <span style={{
            fontSize: 10, fontWeight: 700,
            color: status.color, background: status.bg,
            border: `1px solid ${status.border}`,
            padding: '2px 7px', borderRadius: 10,
          }}>{status.label}</span>
        </div>
      </div>

      {/* Direct input */}
      <input
        type="number"
        min={0}
        value={localVal}
        onChange={e => setLocalVal(e.target.value)}
        onBlur={commitInput}
        onKeyDown={e => { if (e.key === 'Enter') commitInput(); }}
        disabled={isUpdating}
        style={{
          width: '100%', padding: '7px 10px', borderRadius: 7,
          border: '1px solid rgba(255,255,255,0.08)',
          background: '#111827', color: '#e5e7eb',
          fontSize: 13, outline: 'none', boxSizing: 'border-box',
          marginBottom: 8, fontFamily: "'Segoe UI', 'Roboto', sans-serif",
          opacity: isUpdating ? 0.5 : 1,
        }}
        placeholder="Set exact stock"
      />

      {/* ±1 / ±5 buttons */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 5 }}>
        <AdjustBtn label="+5"  disabled={isUpdating} onClick={() => onAdjust(productId, pkg.id, 5)}   variant="add" />
        <AdjustBtn label="+1"  disabled={isUpdating} onClick={() => onAdjust(productId, pkg.id, 1)}   variant="add" />
        <AdjustBtn label="-1"  disabled={isUpdating} onClick={() => onAdjust(productId, pkg.id, -1)}  variant="sub" />
        <AdjustBtn label="-5"  disabled={isUpdating} onClick={() => onAdjust(productId, pkg.id, -5)}  variant="sub" />
      </div>
    </div>
  );
}

/* ─── Main component ─────────────────────────────────────── */
export default function AdminInventory() {
  const [products, setProducts]     = useState<Product[]>([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLevel, setFilterLevel] = useState<StockLevel | 'all'>('all');
  const [updating, setUpdating]     = useState<number | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage]             = useState(1);

  /* ─── Fetch ──────────────────────────────────────────── */
  const fetchProducts = useCallback(async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      else setRefreshing(true);
      const data = await adminAPI.getProducts();
      if (Array.isArray(data)) setProducts(data);
      setError('');
    } catch {
      setError('Failed to load inventory');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  /* ─── Update helpers ─────────────────────────────────── */
  const applyStockUpdate = useCallback(
    async (productId: number, updatedPackages: ProductPackage[], productName: string) => {
      setUpdating(productId);
      try {
        const product = products.find(p => p.id === productId);
        if (!product) return;
        await adminAPI.updateProduct(productId, {
          name:        product.name,
          description: product.description,
          category:    product.category,
          packages:    updatedPackages,
        });
        setProducts(prev =>
          prev.map(p => p.id === productId ? { ...p, packages: updatedPackages } : p)
        );
        setSuccessMsg(`Stock updated for ${productName}`);
        setError('');
        setTimeout(() => setSuccessMsg(''), 3000);
      } catch {
        setError('Failed to update stock');
      } finally {
        setUpdating(null);
      }
    },
    [products]
  );

  const handleAdjust = useCallback(
    (productId: number, pkgId: string, delta: number) => {
      const product = products.find(p => p.id === productId);
      if (!product?.packages) return;
      const updated = (product.packages as ProductPackage[]).map(pkg =>
        pkg.id === pkgId
          ? { ...pkg, stock: Math.max(0, (pkg.stock ?? 0) + delta) }
          : pkg
      );
      applyStockUpdate(productId, updated, product.name);
    },
    [products, applyStockUpdate]
  );

  const handleSetStock = useCallback(
    (productId: number, pkgId: string, value: number) => {
      const product = products.find(p => p.id === productId);
      if (!product?.packages) return;
      const updated = (product.packages as ProductPackage[]).map(pkg =>
        pkg.id === pkgId ? { ...pkg, stock: Math.max(0, value) } : pkg
      );
      applyStockUpdate(productId, updated, product.name);
    },
    [products, applyStockUpdate]
  );

  /* ─── Derived data ───────────────────────────────────── */
  const getTotalStock = (product: Product) =>
    ((product.packages ?? []) as ProductPackage[]).reduce((s, p) => s + (p.stock ?? 0), 0);

  const getProductLevel = (product: Product): StockLevel => {
    const total = getTotalStock(product);
    if (total === 0)  return 'out';
    if (total <= 10)  return 'critical';
    if (total <= 30)  return 'low';
    return 'ok';
  };

  const levelCounts = useMemo(() => ({
    out:      products.filter(p => getProductLevel(p) === 'out').length,
    critical: products.filter(p => getProductLevel(p) === 'critical').length,
    low:      products.filter(p => getProductLevel(p) === 'low').length,
    ok:       products.filter(p => getProductLevel(p) === 'ok').length,
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [products]);

  const totalUnits = useMemo(
    () => products.reduce((s, p) => s + getTotalStock(p), 0),
  [products]);

  const filtered = useMemo(() => {
    let list = [...products];
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        String(p.id).includes(q)
      );
    }
    if (filterLevel !== 'all') {
      list = list.filter(p => getProductLevel(p) === filterLevel);
    }
    return list;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products, searchTerm, filterLevel]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  /* ─── Loading ────────────────────────────────────────── */
  if (loading) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 320, gap: 12 }}>
      <Loader2 size={32} style={{ color: '#4ade80', animation: 'invSpin 0.8s linear infinite' }} />
      <p style={{ color: '#6b7280', fontSize: 13 }}>Loading inventory…</p>
      <style>{`@keyframes invSpin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  /* ─── Render ─────────────────────────────────────────── */
  return (
    <div style={{ fontFamily: "'Segoe UI', 'Roboto', sans-serif", display: 'flex', flexDirection: 'column', gap: 16 }}>
      <style>{`

        @keyframes invSpin     { to { transform: rotate(360deg); } }
        @keyframes invSlideIn  { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }

        .inv-card {
          background: #111827;
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 13px;
          overflow: hidden;
          transition: border-color 0.2s, transform 0.15s;
          animation: invSlideIn 0.3s ease forwards;
          opacity: 0;
        }
        .inv-card:hover { border-color: rgba(74,222,128,0.2); transform: translateY(-1px); }

        .inv-filter-chip {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 6px 13px; border-radius: 20px;
          font-size: 12px; font-weight: 700;
          cursor: pointer; white-space: nowrap;
          border: 1px solid rgba(255,255,255,0.08);
          background: transparent; color: #9ca3af;
          transition: all 0.15s;
          font-family: 'DM Sans', sans-serif;
        }
        .inv-filter-chip:hover { border-color: rgba(74,222,128,0.3); color: #e5e7eb; }

        .inv-summary-card {
          background: #111827;
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 11px;
          padding: 13px 15px;
        }

        .inv-search {
          width: 100%; background: #111827;
          border: 1px solid rgba(255,255,255,0.08);
          color: #e5e7eb; font-size: 13px;
          padding: 9px 12px 9px 36px;
          border-radius: 9px; outline: none;
          font-family: 'DM Sans', sans-serif;
          transition: border-color 0.15s;
          box-sizing: border-box;
        }
        .inv-search:focus { border-color: rgba(74,222,128,0.4); }
        .inv-search::placeholder { color: #4b5563; }

        .inv-page-btn {
          width: 30px; height: 30px; border-radius: 7px;
          border: 1px solid rgba(255,255,255,0.08);
          background: transparent; color: #9ca3af;
          font-size: 12px; font-weight: 600; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.15s; font-family: 'Segoe UI', 'Roboto', sans-serif;
        }
        .inv-page-btn:hover:not(:disabled) { background: rgba(255,255,255,0.06); color: #e5e7eb; }
        .inv-page-btn.inv-pg-active { background: rgba(74,222,128,0.15); border-color: rgba(74,222,128,0.4); color: #4ade80; }
        .inv-page-btn:disabled { opacity: 0.3; cursor: not-allowed; }

        .inv-progress-bar { height: 4px; background: #1f2937; border-radius: 2px; overflow: hidden; margin-top: 6px; }
        .inv-progress-fill { height: 100%; border-radius: 2px; transition: width 0.8s ease; }
      `}</style>

      {/* ── Header ── */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <p style={{ fontSize: 11, fontWeight: 700, color: '#4ade80', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 2 }}>
            Warehouse
          </p>
          <h2 style={{ fontFamily: "'Segoe UI', 'Roboto', sans-serif", fontSize: 'clamp(18px,3vw,24px)', fontWeight: 800, color: '#f9fafb', margin: 0 }}>
            Inventory
          </h2>
        </div>
        <button
          type="button"
          onClick={() => fetchProducts(true)}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '8px 14px', background: '#1f2937',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 9, color: '#9ca3af',
            fontSize: 12, fontWeight: 600, cursor: 'pointer',
          }}
        >
          <RefreshCw
            size={13}
            style={{ animation: refreshing ? 'invSpin 0.8s linear infinite' : 'none' }}
          />
          Refresh
        </button>
      </div>

      {/* ── Summary strip ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 10 }}>
        {/* Total units */}
        <div className="inv-summary-card" style={{ borderColor: 'rgba(74,222,128,0.2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 5 }}>
            <Package size={13} style={{ color: '#4ade80' }} />
            <p style={{ fontSize: 11, color: '#6b7280', margin: 0 }}>Total Units</p>
          </div>
          <p style={{ fontSize: 22, fontWeight: 800, color: '#4ade80', fontFamily: "'Segoe UI', 'Roboto', sans-serif", margin: 0 }}>
            {totalUnits.toLocaleString('en-IN')}
          </p>
          <div className="inv-progress-bar">
            <div className="inv-progress-fill" style={{ width: '100%', background: '#4ade80' }} />
          </div>
        </div>

        {/* In stock */}
        <div className="inv-summary-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 5 }}>
            <TrendingUp size={13} style={{ color: '#34d399' }} />
            <p style={{ fontSize: 11, color: '#6b7280', margin: 0 }}>Healthy</p>
          </div>
          <p style={{ fontSize: 22, fontWeight: 800, color: '#34d399', fontFamily: "'Segoe UI', 'Roboto', sans-serif", margin: 0 }}>
            {levelCounts.ok}
          </p>
          <div className="inv-progress-bar">
            <div
              className="inv-progress-fill"
              style={{
                width: products.length > 0 ? `${(levelCounts.ok / products.length) * 100}%` : '0%',
                background: '#34d399',
              }}
            />
          </div>
        </div>

        {/* Low stock */}
        <div className="inv-summary-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 5 }}>
            <TrendingDown size={13} style={{ color: '#f59e0b' }} />
            <p style={{ fontSize: 11, color: '#6b7280', margin: 0 }}>Low Stock</p>
          </div>
          <p style={{ fontSize: 22, fontWeight: 800, color: '#f59e0b', fontFamily: "'Segoe UI', 'Roboto', sans-serif", margin: 0 }}>
            {levelCounts.low}
          </p>
          <div className="inv-progress-bar">
            <div
              className="inv-progress-fill"
              style={{
                width: products.length > 0 ? `${(levelCounts.low / products.length) * 100}%` : '0%',
                background: '#f59e0b',
              }}
            />
          </div>
        </div>

        {/* Critical */}
        <div className="inv-summary-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 5 }}>
            <AlertCircle size={13} style={{ color: '#fb923c' }} />
            <p style={{ fontSize: 11, color: '#6b7280', margin: 0 }}>Critical</p>
          </div>
          <p style={{ fontSize: 22, fontWeight: 800, color: '#fb923c', fontFamily: "'Segoe UI', 'Roboto', sans-serif", margin: 0 }}>
            {levelCounts.critical}
          </p>
          <div className="inv-progress-bar">
            <div
              className="inv-progress-fill"
              style={{
                width: products.length > 0 ? `${(levelCounts.critical / products.length) * 100}%` : '0%',
                background: '#fb923c',
              }}
            />
          </div>
        </div>

        {/* Out of stock */}
        <div className="inv-summary-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 5 }}>
            <Minus size={13} style={{ color: '#f87171' }} />
            <p style={{ fontSize: 11, color: '#6b7280', margin: 0 }}>Out of Stock</p>
          </div>
          <p style={{ fontSize: 22, fontWeight: 800, color: '#f87171', fontFamily: "'Segoe UI', 'Roboto', sans-serif", margin: 0 }}>
            {levelCounts.out}
          </p>
          <div className="inv-progress-bar">
            <div
              className="inv-progress-fill"
              style={{
                width: products.length > 0 ? `${(levelCounts.out / products.length) * 100}%` : '0%',
                background: '#f87171',
              }}
            />
          </div>
        </div>
      </div>

      {/* ── Filters row ── */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>
        {/* Search */}
        <div style={{ position: 'relative', flex: '1 1 200px', maxWidth: 340 }}>
          <Search
            size={14}
            style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#4b5563' }}
          />
          <input
            className="inv-search"
            placeholder="Search by name or ID…"
            value={searchTerm}
            onChange={e => { setSearchTerm(e.target.value); setPage(1); }}
          />
        </div>

        {/* Level filter chips */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {(
            [
              { key: 'all',      label: 'All',          count: products.length, color: '#9ca3af',  activeColor: '#4ade80',  activeBg: 'rgba(74,222,128,0.12)',  activeBorder: 'rgba(74,222,128,0.4)'  },
              { key: 'ok',       label: 'In Stock',     count: levelCounts.ok,       color: '#4ade80',  activeColor: '#4ade80',  activeBg: 'rgba(74,222,128,0.12)',  activeBorder: 'rgba(74,222,128,0.4)'  },
              { key: 'low',      label: 'Low',          count: levelCounts.low,      color: '#f59e0b',  activeColor: '#f59e0b',  activeBg: 'rgba(245,158,11,0.12)', activeBorder: 'rgba(245,158,11,0.4)'  },
              { key: 'critical', label: 'Critical',     count: levelCounts.critical, color: '#fb923c',  activeColor: '#fb923c',  activeBg: 'rgba(251,146,60,0.12)',  activeBorder: 'rgba(251,146,60,0.4)'  },
              { key: 'out',      label: 'Out of Stock', count: levelCounts.out,      color: '#f87171',  activeColor: '#f87171',  activeBg: 'rgba(248,113,113,0.12)', activeBorder: 'rgba(248,113,113,0.4)' },
            ] as const
          ).map(chip => {
            const isActive = filterLevel === chip.key;
            return (
              <button
                key={chip.key}
                type="button"
                className="inv-filter-chip"
                onClick={() => { setFilterLevel(chip.key); setPage(1); }}
                style={isActive ? {
                  background: chip.activeBg,
                  borderColor: chip.activeBorder,
                  color: chip.activeColor,
                } : {}}
              >
                {chip.label}
                <span style={{
                  background: 'rgba(255,255,255,0.1)',
                  borderRadius: 10, padding: '1px 6px', fontSize: 10,
                }}>
                  {chip.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Toasts ── */}
      {error && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '10px 14px',
          background: 'rgba(248,113,113,0.1)',
          border: '1px solid rgba(248,113,113,0.3)',
          borderRadius: 9, color: '#f87171', fontSize: 13,
        }}>
          <AlertCircle size={14} /> {error}
        </div>
      )}
      {successMsg && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '10px 14px',
          background: 'rgba(74,222,128,0.1)',
          border: '1px solid rgba(74,222,128,0.3)',
          borderRadius: 9, color: '#4ade80', fontSize: 13,
        }}>
          <CheckCircle size={14} /> {successMsg}
        </div>
      )}

      {/* ── Count bar ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <p style={{ fontSize: 12, color: '#4b5563', margin: 0 }}>
          Showing{' '}
          <span style={{ color: '#9ca3af', fontWeight: 600 }}>{paginated.length}</span> of{' '}
          <span style={{ color: '#9ca3af', fontWeight: 600 }}>{filtered.length}</span> products
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <Filter size={12} style={{ color: '#4b5563' }} />
          <span style={{ fontSize: 12, color: '#4b5563' }}>
            {filtered.length} result{filtered.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* ── Empty state ── */}
      {filtered.length === 0 && (
        <div style={{
          textAlign: 'center', padding: '48px 24px',
          background: '#111827', borderRadius: 14,
          border: '1px solid rgba(255,255,255,0.07)',
        }}>
          <Package size={36} style={{ color: '#374151', margin: '0 auto 12px' }} />
          <p style={{ color: '#6b7280', fontSize: 14, fontWeight: 600 }}>No products found</p>
          <p style={{ color: '#374151', fontSize: 12, marginTop: 4 }}>Try adjusting your filters</p>
        </div>
      )}

      {/* ── Product cards grid ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: 14,
      }}>
        {paginated.map((product, cardIdx) => {
          const pkgs = (product.packages ?? []) as ProductPackage[];
          const totalStock = pkgs.reduce((s, p) => s + (p.stock ?? 0), 0);
          const productLevel = getProductLevel(product);
          const productStatus = getStockStatus(totalStock);
          const isUpdating = updating === product.id;

          return (
            <div
              key={product.id}
              className="inv-card"
              style={{ animationDelay: `${cardIdx * 0.04}s` }}
            >
              {/* Card header */}
              <div style={{
                padding: '14px 16px',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
                display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
              }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                    <span style={{
                      fontSize: 10, fontWeight: 700, color: '#4b5563',
                      background: '#1f2937', padding: '2px 6px', borderRadius: 5,
                      fontFamily: 'monospace',
                    }}>#{product.id}</span>
                  </div>
                  <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: '#f9fafb', lineHeight: 1.3 }}>
                    {product.name}
                  </h3>
                </div>

                <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: 10 }}>
                  <p style={{
                    margin: 0,
                    fontSize: 28,
                    fontWeight: 800,
                    color: productStatus.color,
                    fontFamily: "'Segoe UI', 'Roboto', sans-serif",
                    lineHeight: 1,
                  }}>
                    {totalStock}
                  </p>
                  <span style={{
                    fontSize: 9, fontWeight: 700, textTransform: 'uppercase',
                    letterSpacing: '0.06em', color: productStatus.color,
                  }}>
                    total units
                  </span>
                </div>
              </div>

              {/* Level indicator bar */}
              <div style={{ height: 3, background: '#0f172a' }}>
                <div style={{
                  height: '100%',
                  width: productLevel === 'ok' ? '100%'
                       : productLevel === 'low' ? '45%'
                       : productLevel === 'critical' ? '15%'
                       : '0%',
                  background: productStatus.color,
                  transition: 'width 0.6s ease',
                }} />
              </div>

              {/* Packages */}
              <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {pkgs.length === 0 ? (
                  <p style={{ fontSize: 12, color: '#4b5563', fontStyle: 'italic' }}>No packages configured</p>
                ) : (
                  pkgs.map(pkg => (
                    <PackageRow
                      key={pkg.id}
                      pkg={pkg}
                      productId={product.id}
                      isUpdating={isUpdating}
                      onAdjust={handleAdjust}
                      onSetStock={handleSetStock}
                    />
                  ))
                )}

                {/* Updating spinner */}
                {isUpdating && (
                  <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    gap: 8, padding: '8px',
                    background: 'rgba(74,222,128,0.06)',
                    borderRadius: 8, border: '1px solid rgba(74,222,128,0.2)',
                  }}>
                    <Loader2 size={14} style={{ color: '#4ade80', animation: 'invSpin 0.7s linear infinite' }} />
                    <span style={{ fontSize: 12, color: '#4ade80', fontWeight: 600 }}>Updating…</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Pagination ── */}
      {totalPages > 1 && (
        <div style={{
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', flexWrap: 'wrap', gap: 8,
          padding: '12px 0',
        }}>
          <span style={{ fontSize: 12, color: '#4b5563' }}>
            Page {page} of {totalPages}
          </span>
          <div style={{ display: 'flex', gap: 4 }}>
            <button className="inv-page-btn" disabled={page === 1} onClick={() => setPage(1)}>«</button>
            <button className="inv-page-btn" disabled={page === 1} onClick={() => setPage(p => p - 1)}>‹</button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const p = Math.max(1, Math.min(totalPages - 4, page - 2)) + i;
              return (
                <button
                  key={p}
                  className={`inv-page-btn ${p === page ? 'inv-pg-active' : ''}`}
                  onClick={() => setPage(p)}
                >
                  {p}
                </button>
              );
            })}
            <button className="inv-page-btn" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>›</button>
            <button className="inv-page-btn" disabled={page === totalPages} onClick={() => setPage(totalPages)}>»</button>
          </div>
        </div>
      )}
    </div>
  );
}