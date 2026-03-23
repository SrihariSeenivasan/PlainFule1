'use client';

import React, { useEffect, useState, useMemo, useCallback } from 'react';
import {
  Search,
  RefreshCw,
  Users,
  Shield,
  User,
  Mail,
  Phone,
  Hash,
  ChevronDown,
  ChevronUp,
  Filter,
  Calendar,
} from 'lucide-react';
import { adminAPI, User as UserType } from '@/lib/api';

/* ─── Types ─────────────────────────────────────────────── */
type RoleFilter = 'ALL' | 'ADMIN' | 'USER';
type SortKey = 'id' | 'firstName' | 'email' | 'role';
type SortDir = 'asc' | 'desc';

interface RoleConfig {
  label: string;
  color: string;
  bg: string;
  border: string;
  icon: React.ComponentType<{ size?: number }>;
}

/* ─── Config ─────────────────────────────────────────────── */
const ROLE_CONFIG: Record<string, RoleConfig> = {
  ADMIN: {
    label: 'Admin',
    color: '#60a5fa',
    bg: 'rgba(96,165,250,0.1)',
    border: 'rgba(96,165,250,0.25)',
    icon: Shield,
  },
  USER: {
    label: 'User',
    color: '#4ade80',
    bg: 'rgba(74,222,128,0.1)',
    border: 'rgba(74,222,128,0.25)',
    icon: User,
  },
};

const DEFAULT_ROLE_CONFIG: RoleConfig = {
  label: 'Unknown',
  color: '#9ca3af',
  bg: 'rgba(156,163,175,0.1)',
  border: 'rgba(156,163,175,0.25)',
  icon: User,
};

const PAGE_SIZE = 15;

/* ─── Avatar initials ────────────────────────────────────── */
function Avatar({ user, size = 36 }: { user: UserType; size?: number }) {
  const initials = `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`.toUpperCase() || '?';
  const colors = ['#4ade80', '#60a5fa', '#f59e0b', '#a78bfa', '#34d399', '#fb923c'];
  const colorIdx = (user.id ?? 0) % colors.length;
  const color = colors[colorIdx];

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: `${color}20`,
        border: `2px solid ${color}40`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: size * 0.36,
        fontWeight: 800,
        color,
        flexShrink: 0,
        fontFamily: "'Syne',sans-serif",
      }}
    >
      {initials}
    </div>
  );
}

/* ─── Sort icon ──────────────────────────────────────────── */
function SortIcon({ sortKey, currentKey, sortDir }: { sortKey: SortKey; currentKey: SortKey; sortDir: SortDir }) {
  if (sortKey !== currentKey) {
    return <ChevronDown size={11} style={{ opacity: 0.25 }} />;
  }
  return sortDir === 'asc' ? <ChevronUp size={11} /> : <ChevronDown size={11} />;
}

/* ─── Main component ─────────────────────────────────────── */
export default function AdminUsers() {
  const [users, setUsers]         = useState<UserType[]>([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState('');
  const [search, setSearch]       = useState('');
  const [roleFilter, setRoleFilter] = useState<RoleFilter>('ALL');
  const [sortKey, setSortKey]     = useState<SortKey>('id');
  const [sortDir, setSortDir]     = useState<SortDir>('asc');
  const [page, setPage]           = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  /* ─── Fetch ──────────────────────────────────────────── */
  const fetchUsers = useCallback(async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      else setRefreshing(true);
      const data = await adminAPI.getUsers();
      setUsers(Array.isArray(data) ? data : []);
      setError('');
    } catch {
      setError('Failed to load users');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  /* ─── Sort handler ───────────────────────────────────── */
  const handleSort = useCallback((key: SortKey) => {
    setSortKey(prev => {
      if (prev === key) {
        setSortDir(d => (d === 'asc' ? 'desc' : 'asc'));
        return prev;
      }
      setSortDir('asc');
      return key;
    });
  }, []);

  /* ─── Derived data ───────────────────────────────────── */
  const adminCount = useMemo(() => users.filter(u => u.role === 'ADMIN').length, [users]);
  const userCount  = useMemo(() => users.filter(u => u.role === 'USER').length,  [users]);

  const filtered = useMemo(() => {
    let list = [...users];

    if (roleFilter !== 'ALL') {
      list = list.filter(u => u.role === roleFilter);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(u =>
        (u.firstName ?? '').toLowerCase().includes(q) ||
        (u.lastName  ?? '').toLowerCase().includes(q) ||
        (u.email     ?? '').toLowerCase().includes(q) ||
        (u.phone     ?? '').toLowerCase().includes(q) ||
        String(u.id).includes(q)
      );
    }

    list.sort((a, b) => {
      let va: number | string = '';
      let vb: number | string = '';

      switch (sortKey) {
        case 'id':
          va = a.id ?? 0;
          vb = b.id ?? 0;
          break;
        case 'firstName':
          va = `${a.firstName ?? ''} ${a.lastName ?? ''}`.toLowerCase();
          vb = `${b.firstName ?? ''} ${b.lastName ?? ''}`.toLowerCase();
          break;
        case 'email':
          va = (a.email ?? '').toLowerCase();
          vb = (b.email ?? '').toLowerCase();
          break;
        case 'role':
          va = a.role ?? '';
          vb = b.role ?? '';
          break;
      }

      return sortDir === 'asc' ? (va > vb ? 1 : -1) : va < vb ? 1 : -1;
    });

    return list;
  }, [users, roleFilter, search, sortKey, sortDir]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  /* ─── Loading ────────────────────────────────────────── */
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
            borderTopColor: '#60a5fa',
            borderRadius: '50%',
            animation: 'uSpin 0.8s linear infinite',
          }}
        />
        <p style={{ color: '#6b7280', fontSize: 13 }}>Loading users…</p>
        <style>{`@keyframes uSpin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  /* ─── Render ─────────────────────────────────────────── */
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


        @keyframes uSpin     { to { transform: rotate(360deg); } }
        @keyframes uSlideIn  { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:translateY(0); } }
        @keyframes uSlideDown {
          from { opacity:0; transform:translateY(-5px); }
          to   { opacity:1; transform:translateY(0); }
        }

        .u-table { width: 100%; border-collapse: collapse; }
        .u-table th {
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
        .u-table th:hover { color: #d1d5db; }
        .u-table td {
          padding: 13px 14px;
          font-size: 13px;
          color: #d1d5db;
          border-bottom: 1px solid rgba(255,255,255,0.04);
          vertical-align: middle;
        }
        .u-table tr.u-data-row:hover td {
          background: rgba(255,255,255,0.025);
          cursor: pointer;
        }
        .u-table tr.u-exp-row td { background: #080d16; }

        .u-role-pill {
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

        .u-filter-chip {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 13px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          border: 1px solid rgba(255,255,255,0.08);
          background: transparent;
          color: #9ca3af;
          transition: all 0.15s;
          white-space: nowrap;
          font-family: 'DM Sans', sans-serif;
        }
        .u-filter-chip:hover {
          border-color: rgba(96,165,250,0.3);
          color: #e5e7eb;
        }

        .u-search-input {
          width: 100%;
          background: #111827;
          border: 1px solid rgba(255,255,255,0.08);
          color: #e5e7eb;
          font-size: 13px;
          padding: 9px 12px 9px 36px;
          border-radius: 9px;
          outline: none;
          font-family: 'DM Sans', sans-serif;
          transition: border-color 0.15s;
          box-sizing: border-box;
        }
        .u-search-input:focus { border-color: rgba(96,165,250,0.4); }
        .u-search-input::placeholder { color: #4b5563; }

        .u-summary-card {
          background: #111827;
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 11px;
          padding: 14px 16px;
        }

        .u-page-btn {
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
          font-family: 'DM Sans', sans-serif;
        }
        .u-page-btn:hover:not(:disabled) {
          background: rgba(255,255,255,0.06);
          color: #e5e7eb;
        }
        .u-page-btn.u-pg-active {
          background: rgba(96,165,250,0.15);
          border-color: rgba(96,165,250,0.4);
          color: #60a5fa;
        }
        .u-page-btn:disabled { opacity: 0.3; cursor: not-allowed; }

        .u-scroll-x { overflow-x: auto; }
        .u-scroll-x::-webkit-scrollbar { height: 4px; }
        .u-scroll-x::-webkit-scrollbar-track { background: #0f172a; }
        .u-scroll-x::-webkit-scrollbar-thumb { background: #1f2937; border-radius: 4px; }

        .u-detail-row { animation: uSlideDown 0.2s ease; }

        .u-contact-chip {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 5px 10px;
          border-radius: 7px;
          font-size: 12px;
          font-weight: 500;
          background: #111827;
          border: 1px solid rgba(255,255,255,0.06);
          color: #9ca3af;
        }

        @media (max-width: 640px) {
          .u-hide-sm { display: none !important; }
          .u-table td, .u-table th { padding: 10px; }
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
              color: '#60a5fa',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              marginBottom: 2,
            }}
          >
            Directory
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
            Users
          </h2>
        </div>
        <button
          type="button"
          onClick={() => fetchUsers(true)}
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
            style={{ animation: refreshing ? 'uSpin 0.8s linear infinite' : 'none' }}
          />
          Refresh
        </button>
      </div>

      {/* ── Summary strip ── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
          gap: 10,
        }}
      >
        {/* Total */}
        <div className="u-summary-card" style={{ borderColor: 'rgba(96,165,250,0.2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 5 }}>
            <Users size={13} style={{ color: '#60a5fa' }} />
            <p style={{ fontSize: 11, color: '#6b7280', margin: 0 }}>Total Users</p>
          </div>
          <p
            style={{
              fontSize: 26,
              fontWeight: 800,
              color: '#60a5fa',
              fontFamily: "'Syne',sans-serif",
              margin: 0,
            }}
          >
            {users.length.toLocaleString('en-IN')}
          </p>
        </div>

        {/* Admins */}
        <div className="u-summary-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 5 }}>
            <Shield size={13} style={{ color: '#60a5fa' }} />
            <p style={{ fontSize: 11, color: '#6b7280', margin: 0 }}>Admins</p>
          </div>
          <p
            style={{
              fontSize: 26,
              fontWeight: 800,
              color: '#60a5fa',
              fontFamily: "'Syne',sans-serif",
              margin: 0,
            }}
          >
            {adminCount}
          </p>
        </div>

        {/* Regular users */}
        <div className="u-summary-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 5 }}>
            <User size={13} style={{ color: '#4ade80' }} />
            <p style={{ fontSize: 11, color: '#6b7280', margin: 0 }}>Regular Users</p>
          </div>
          <p
            style={{
              fontSize: 26,
              fontWeight: 800,
              color: '#4ade80',
              fontFamily: "'Syne',sans-serif",
              margin: 0,
            }}
          >
            {userCount}
          </p>
        </div>

        {/* Shown in search */}
        <div className="u-summary-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 5 }}>
            <Filter size={13} style={{ color: '#a78bfa' }} />
            <p style={{ fontSize: 11, color: '#6b7280', margin: 0 }}>Filtered</p>
          </div>
          <p
            style={{
              fontSize: 26,
              fontWeight: 800,
              color: '#a78bfa',
              fontFamily: "'Syne',sans-serif",
              margin: 0,
            }}
          >
            {filtered.length}
          </p>
        </div>
      </div>

      {/* ── Role distribution bar ── */}
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
            marginBottom: 10,
          }}
        >
          Role Distribution
        </p>
        {/* Stacked bar */}
        <div
          style={{
            display: 'flex',
            height: 8,
            borderRadius: 4,
            overflow: 'hidden',
            background: '#0f172a',
            marginBottom: 10,
          }}
        >
          {users.length > 0 && (
            <>
              <div
                style={{
                  width: `${(adminCount / users.length) * 100}%`,
                  background: '#60a5fa',
                  transition: 'width 0.8s ease',
                }}
              />
              <div
                style={{
                  width: `${(userCount / users.length) * 100}%`,
                  background: '#4ade80',
                  transition: 'width 0.8s ease',
                }}
              />
            </>
          )}
        </div>
        {/* Legend */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 20px' }}>
          {[
            { label: 'Admins',        count: adminCount, color: '#60a5fa' },
            { label: 'Regular Users', count: userCount,  color: '#4ade80' },
          ].map(item => (
            <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: item.color,
                  flexShrink: 0,
                }}
              />
              <span style={{ fontSize: 12, color: '#9ca3af' }}>{item.label}</span>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: item.color,
                  background: `${item.color}18`,
                  padding: '1px 6px',
                  borderRadius: 10,
                }}
              >
                {item.count} ·{' '}
                {users.length > 0
                  ? Math.round((item.count / users.length) * 100)
                  : 0}
                %
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Filters ── */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>
        {/* Search */}
        <div style={{ position: 'relative', flex: '1 1 200px', maxWidth: 340 }}>
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
            className="u-search-input"
            placeholder="Search name, email, phone, ID…"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
          />
        </div>

        {/* Role filter chips */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {(
            [
              { key: 'ALL',   label: 'All',    count: users.length, activeColor: '#60a5fa', activeBg: 'rgba(96,165,250,0.12)',  activeBorder: 'rgba(96,165,250,0.4)'  },
              { key: 'ADMIN', label: 'Admins', count: adminCount,   activeColor: '#60a5fa', activeBg: 'rgba(96,165,250,0.12)',  activeBorder: 'rgba(96,165,250,0.4)'  },
              { key: 'USER',  label: 'Users',  count: userCount,    activeColor: '#4ade80', activeBg: 'rgba(74,222,128,0.12)', activeBorder: 'rgba(74,222,128,0.4)'  },
            ] as const
          ).map(chip => {
            const isActive = roleFilter === chip.key;
            return (
              <button
                key={chip.key}
                type="button"
                className="u-filter-chip"
                onClick={() => { setRoleFilter(chip.key); setPage(1); }}
                style={
                  isActive
                    ? {
                        background: chip.activeBg,
                        borderColor: chip.activeBorder,
                        color: chip.activeColor,
                      }
                    : {}
                }
              >
                {chip.label}
                <span
                  style={{
                    background: 'rgba(255,255,255,0.1)',
                    borderRadius: 10,
                    padding: '1px 6px',
                    fontSize: 10,
                  }}
                >
                  {chip.count}
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
          {error}
        </div>
      )}

      {/* ── Count ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <p style={{ fontSize: 12, color: '#4b5563', margin: 0 }}>
          Showing{' '}
          <span style={{ color: '#9ca3af', fontWeight: 600 }}>{paginated.length}</span> of{' '}
          <span style={{ color: '#9ca3af', fontWeight: 600 }}>{filtered.length}</span> users
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
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
          <Users size={36} style={{ color: '#374151', margin: '0 auto 12px' }} />
          <p style={{ color: '#6b7280', fontSize: 14, fontWeight: 600 }}>No users found</p>
          <p style={{ color: '#374151', fontSize: 12, marginTop: 4 }}>
            Try adjusting your search or filters
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
          <div className="u-scroll-x">
            <table className="u-table" style={{ minWidth: 620 }}>
              <thead>
                <tr>
                  {/* ID */}
                  <th
                    onClick={() => handleSort('id')}
                    style={{ width: 60 }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Hash size={11} />
                      ID
                      <SortIcon sortKey="id" currentKey={sortKey} sortDir={sortDir} />
                    </div>
                  </th>

                  {/* Name */}
                  <th onClick={() => handleSort('firstName')}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <User size={11} />
                      Name
                      <SortIcon sortKey="firstName" currentKey={sortKey} sortDir={sortDir} />
                    </div>
                  </th>

                  {/* Email */}
                  <th onClick={() => handleSort('email')} className="u-hide-sm">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Mail size={11} />
                      Email
                      <SortIcon sortKey="email" currentKey={sortKey} sortDir={sortDir} />
                    </div>
                  </th>

                  {/* Phone */}
                  <th className="u-hide-sm">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Phone size={11} />
                      Phone
                    </div>
                  </th>

                  {/* Role */}
                  <th onClick={() => handleSort('role')}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      Role
                      <SortIcon sortKey="role" currentKey={sortKey} sortDir={sortDir} />
                    </div>
                  </th>

                  {/* Expand */}
                  <th style={{ width: 28 }} />
                </tr>
              </thead>
              <tbody>
                {paginated.map((user, rowIdx) => {
                  const cfg = ROLE_CONFIG[user.role] ?? DEFAULT_ROLE_CONFIG;
                  const RoleIcon = cfg.icon;
                  const isExpanded = expandedId === user.id;
                  const fullName = `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim();

                  return (
                    <React.Fragment key={user.id}>
                      <tr
                        className="u-data-row"
                        style={{ animation: `uSlideIn 0.3s ease ${rowIdx * 0.03}s forwards`, opacity: 0 }}
                        onClick={() => setExpandedId(isExpanded ? null : (user.id ?? null))}
                      >
                        {/* ID */}
                        <td>
                          <span
                            style={{
                              fontSize: 11,
                              fontWeight: 700,
                              color: '#4b5563',
                              fontFamily: 'monospace',
                            }}
                          >
                            #{user.id}
                          </span>
                        </td>

                        {/* Name + Avatar */}
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <Avatar user={user} size={32} />
                            <div>
                              <p
                                style={{
                                  margin: 0,
                                  fontSize: 13,
                                  fontWeight: 700,
                                  color: '#f9fafb',
                                  lineHeight: 1.2,
                                }}
                              >
                                {fullName || '—'}
                              </p>
                              {/* Show email on mobile when email column hidden */}
                              <p
                                className="u-hide-sm"
                                style={{
                                  display: 'none',
                                }}
                              />
                            </div>
                          </div>
                        </td>

                        {/* Email */}
                        <td className="u-hide-sm">
                          <span style={{ color: '#9ca3af', fontSize: 13 }}>
                            {user.email ?? '—'}
                          </span>
                        </td>

                        {/* Phone */}
                        <td className="u-hide-sm">
                          <span style={{ color: '#9ca3af', fontSize: 13 }}>
                            {user.phone ?? '—'}
                          </span>
                        </td>

                        {/* Role pill */}
                        <td>
                          <span
                            className="u-role-pill"
                            style={{
                              color: cfg.color,
                              background: cfg.bg,
                              borderColor: cfg.border,
                            }}
                          >
                            <RoleIcon size={10} />
                            {cfg.label}
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

                      {/* Expanded user detail */}
                      {isExpanded && (
                        <tr className="u-exp-row">
                          <td colSpan={6} style={{ padding: '16px 20px' }}>
                            <div className="u-detail-row">
                              <div
                                style={{
                                  display: 'grid',
                                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                                  gap: 16,
                                }}
                              >
                                {/* Profile card */}
                                <div
                                  style={{
                                    background: '#111827',
                                    border: '1px solid rgba(255,255,255,0.06)',
                                    borderRadius: 10,
                                    padding: '14px 16px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 14,
                                  }}
                                >
                                  <Avatar user={user} size={48} />
                                  <div>
                                    <p
                                      style={{
                                        margin: 0,
                                        fontSize: 15,
                                        fontWeight: 800,
                                        color: '#f9fafb',
                                        fontFamily: "'Syne',sans-serif",
                                      }}
                                    >
                                      {fullName || 'No name'}
                                    </p>
                                    <span
                                      className="u-role-pill"
                                      style={{
                                        color: cfg.color,
                                        background: cfg.bg,
                                        borderColor: cfg.border,
                                        marginTop: 5,
                                        display: 'inline-flex',
                                      }}
                                    >
                                      <RoleIcon size={10} />
                                      {cfg.label}
                                    </span>
                                  </div>
                                </div>

                                {/* Contact details */}
                                <div
                                  style={{
                                    background: '#111827',
                                    border: '1px solid rgba(255,255,255,0.06)',
                                    borderRadius: 10,
                                    padding: '14px 16px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 8,
                                  }}
                                >
                                  <p
                                    style={{
                                      fontSize: 10,
                                      fontWeight: 700,
                                      color: '#4b5563',
                                      textTransform: 'uppercase',
                                      letterSpacing: '0.08em',
                                      margin: 0,
                                    }}
                                  >
                                    Contact
                                  </p>
                                  {user.email && (
                                    <div className="u-contact-chip">
                                      <Mail size={11} style={{ color: '#60a5fa', flexShrink: 0 }} />
                                      <span
                                        style={{
                                          overflow: 'hidden',
                                          textOverflow: 'ellipsis',
                                          whiteSpace: 'nowrap',
                                        }}
                                      >
                                        {user.email}
                                      </span>
                                    </div>
                                  )}
                                  {user.phone && (
                                    <div className="u-contact-chip">
                                      <Phone size={11} style={{ color: '#4ade80', flexShrink: 0 }} />
                                      <span>{user.phone}</span>
                                    </div>
                                  )}
                                </div>

                                {/* Account metadata */}
                                <div
                                  style={{
                                    background: '#111827',
                                    border: '1px solid rgba(255,255,255,0.06)',
                                    borderRadius: 10,
                                    padding: '14px 16px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 8,
                                  }}
                                >
                                  <p
                                    style={{
                                      fontSize: 10,
                                      fontWeight: 700,
                                      color: '#4b5563',
                                      textTransform: 'uppercase',
                                      letterSpacing: '0.08em',
                                      margin: 0,
                                    }}
                                  >
                                    Account
                                  </p>
                                  <div
                                    style={{
                                      display: 'flex',
                                      justifyContent: 'space-between',
                                      alignItems: 'center',
                                    }}
                                  >
                                    <span style={{ fontSize: 12, color: '#6b7280' }}>User ID</span>
                                    <span
                                      style={{
                                        fontSize: 12,
                                        fontWeight: 700,
                                        color: '#e5e7eb',
                                        fontFamily: 'monospace',
                                      }}
                                    >
                                      #{user.id}
                                    </span>
                                  </div>
                                  <div
                                    style={{
                                      display: 'flex',
                                      justifyContent: 'space-between',
                                      alignItems: 'center',
                                    }}
                                  >
                                    <span style={{ fontSize: 12, color: '#6b7280' }}>Role</span>
                                    <span
                                      className="u-role-pill"
                                      style={{
                                        color: cfg.color,
                                        background: cfg.bg,
                                        borderColor: cfg.border,
                                        fontSize: 10,
                                      }}
                                    >
                                      <RoleIcon size={9} />
                                      {cfg.label}
                                    </span>
                                  </div>
                                  {(user as UserType & { createdAt?: string }).createdAt && (
                                    <div
                                      style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        gap: 8,
                                      }}
                                    >
                                      <span
                                        style={{
                                          display: 'flex',
                                          alignItems: 'center',
                                          gap: 4,
                                          fontSize: 12,
                                          color: '#6b7280',
                                        }}
                                      >
                                        <Calendar size={11} />
                                        Joined
                                      </span>
                                      <span style={{ fontSize: 12, color: '#9ca3af' }}>
                                        {new Date(
                                          (user as UserType & { createdAt: string }).createdAt
                                        ).toLocaleDateString('en-IN', {
                                          day: 'numeric',
                                          month: 'short',
                                          year: 'numeric',
                                        })}
                                      </span>
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

          {/* ── Pagination ── */}
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
                  type="button"
                  className="u-page-btn"
                  disabled={page === 1}
                  onClick={() => setPage(1)}
                >
                  «
                </button>
                <button
                  type="button"
                  className="u-page-btn"
                  disabled={page === 1}
                  onClick={() => setPage(p => p - 1)}
                >
                  ‹
                </button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const p = Math.max(1, Math.min(totalPages - 4, page - 2)) + i;
                  return (
                    <button
                      key={p}
                      type="button"
                      className={`u-page-btn ${p === page ? 'u-pg-active' : ''}`}
                      onClick={() => setPage(p)}
                    >
                      {p}
                    </button>
                  );
                })}
                <button
                  type="button"
                  className="u-page-btn"
                  disabled={page === totalPages}
                  onClick={() => setPage(p => p + 1)}
                >
                  ›
                </button>
                <button
                  type="button"
                  className="u-page-btn"
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