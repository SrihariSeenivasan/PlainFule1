'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Plus, Pencil, Trash2, Search, X, ChevronDown, ChevronUp, HelpCircle, Tag, LayoutGrid } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { adminAPI, Product, getApiUrl } from '@/lib/api';

// ─── Types ────────────────────────────────────────────────────────────────────

type FAQType = 'PRODUCT' | 'COMMON';
type FilterType = 'all' | FAQType;

interface FAQ {
  id: number;
  question: string;
  answer: string;
  type: FAQType;
  productId?: number;
  createdAt: string;
}

interface FormState {
  question: string;
  answer: string;
  type: FAQType;
  productId: string;
}

const EMPTY_FORM: FormState = {
  question: '',
  answer: '',
  type: 'PRODUCT',
  productId: '',
};

// ─── Sub-components ───────────────────────────────────────────────────────────

interface SummaryCardProps {
  label: string;
  value: number;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  accent: string;
  fill: number; // 0–100
}

function SummaryCard({ label, value, icon: Icon, accent, fill }: SummaryCardProps) {
  return (
    <div className="faq-card">
      <div className="faq-card__body">
        <div>
          <p className="faq-card__label">{label}</p>
          <p className="faq-card__value">{value}</p>
        </div>
        <span className="faq-card__icon" style={{ color: accent }}>
          <Icon size={28} />
        </span>
      </div>
      <div className="faq-card__track">
        <div className="faq-card__fill" style={{ width: `${fill}%`, background: accent }} />
      </div>
    </div>
  );
}

interface FAQRowProps {
  faq: FAQ;
  productName: string;
  expanded: boolean;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

function FAQRow({ faq, productName, expanded, onToggle, onEdit, onDelete }: FAQRowProps) {
  const typeColor = faq.type === 'PRODUCT' ? '#4ade80' : '#60a5fa';
  const typeLabel = faq.type === 'PRODUCT' ? 'Product FAQ' : 'Common FAQ';

  return (
    <div className="faqrow">
      {/* Header row */}
      <div
        className="faqrow__head"
        onClick={onToggle}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onToggle(); }}
      >
        <div className="faqrow__meta">
          <span
            className="faqrow__type"
            style={{ background: `${typeColor}18`, color: typeColor, border: `1px solid ${typeColor}33` }}
          >
            {typeLabel}
          </span>
          {faq.type === 'PRODUCT' && faq.productId && (
            <span className="faqrow__product">{productName}</span>
          )}
        </div>
        <p className="faqrow__question">{faq.question}</p>
        <div className="faqrow__right">
          <span className="faqrow__date">{new Date(faq.createdAt).toLocaleDateString()}</span>
          <button
            type="button"
            className="faqrow__edit"
            onClick={(e) => { e.stopPropagation(); onEdit(); }}
          >
            <Pencil size={13} />
            Edit
          </button>
          <button
            type="button"
            className="faqrow__del"
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
          >
            <Trash2 size={13} />
          </button>
          <span className="faqrow__chevron">
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </span>
        </div>
      </div>

      {/* Expanded answer */}
      {expanded && (
        <div className="faqrow__answer">
          <p className="faqrow__answer-text">{faq.answer}</p>
        </div>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AdminFAQ() {
  const { token } = useAuth();

  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [formError, setFormError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [form, setForm] = useState<FormState>({ ...EMPTY_FORM });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);

  const [filterType, setFilterType] = useState<FilterType>('all');
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState<number | null>(null);

  // ── Data loading ──

  const loadFAQs = useCallback(async () => {
    try {
      const res = await fetch(`${getApiUrl()}/faqs`);
      if (!res.ok) throw new Error('Failed to load FAQs');
      const json = await res.json();
      setFaqs(json.data ?? []);
    } catch {
      setError('Failed to load FAQs');
    }
  }, []);

  const loadProducts = useCallback(async () => {
    try {
      const data = await adminAPI.getProducts();
      setProducts(Array.isArray(data) ? data : []);
    } catch {
      // non-fatal
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await Promise.all([loadFAQs(), loadProducts()]);
      setLoading(false);
    };
    init();
  }, [loadFAQs, loadProducts]);

  // ── Helpers ──

  const getProductName = useCallback(
    (productId?: number): string => {
      if (!productId) return 'All Products';
      return products.find((p) => p.id === productId)?.name ?? 'Unknown Product';
    },
    [products],
  );

  const productOptions = useMemo(
    () => products.map((p) => ({ value: String(p.id), label: p.name })),
    [products],
  );

  // ── Filtered list ──

  const filteredFAQs = useMemo(() => {
    let list = faqs;
    if (filterType !== 'all') list = list.filter((f) => f.type === filterType);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (f) =>
          f.question.toLowerCase().includes(q) ||
          f.answer.toLowerCase().includes(q) ||
          getProductName(f.productId).toLowerCase().includes(q),
      );
    }
    return list;
  }, [faqs, filterType, search, getProductName]);

  // ── Summary stats ──

  const totalFAQs = faqs.length;
  const productFAQs = faqs.filter((f) => f.type === 'PRODUCT').length;
  const commonFAQs = faqs.filter((f) => f.type === 'COMMON').length;
  const linkedProducts = useMemo(() => {
    const ids = new Set(faqs.filter((f) => f.productId).map((f) => f.productId));
    return ids.size;
  }, [faqs]);

  // ── Form handlers ──

  const openCreate = useCallback(() => {
    setForm({ ...EMPTY_FORM });
    setEditingId(null);
    setFormError('');
    setShowForm(true);
  }, []);

  const openEdit = useCallback((faq: FAQ) => {
    setForm({
      question: faq.question,
      answer: faq.answer,
      type: faq.type,
      productId: faq.productId ? String(faq.productId) : '',
    });
    setEditingId(faq.id);
    setFormError('');
    setShowForm(true);
  }, []);

  const closeForm = useCallback(() => {
    setShowForm(false);
    setEditingId(null);
    setForm({ ...EMPTY_FORM });
    setFormError('');
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setFormError('');

      if (!form.question.trim() || !form.answer.trim()) {
        setFormError('Question and answer are required.');
        return;
      }
      if (form.type === 'PRODUCT' && !form.productId) {
        setFormError('Please select a product for this FAQ.');
        return;
      }

      const body: { question: string; answer: string; type: FAQType; productId?: number } = {
        question: form.question.trim(),
        answer: form.answer.trim(),
        type: form.type,
      };
      if (form.productId) body.productId = parseInt(form.productId, 10);

      setSubmitting(true);
      try {
        const url = editingId
          ? `${getApiUrl()}/faqs/${editingId}`
          : `${getApiUrl()}/faqs`;
        const res = await fetch(url, {
          method: editingId ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(body),
        });
        if (!res.ok) throw new Error('Failed to save FAQ');
        setSuccessMsg(editingId ? 'FAQ updated.' : 'FAQ created.');
        setTimeout(() => setSuccessMsg(''), 3000);
        closeForm();
        await loadFAQs();
      } catch {
        setFormError('Failed to save FAQ. Please try again.');
      } finally {
        setSubmitting(false);
      }
    },
    [form, editingId, token, closeForm, loadFAQs],
  );

  const handleDelete = useCallback(
    async (id: number) => {
      if (!window.confirm('Delete this FAQ?')) return;
      try {
        const res = await fetch(`${getApiUrl()}/faqs/${id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Failed to delete');
        await loadFAQs();
      } catch {
        setError('Failed to delete FAQ.');
      }
    },
    [token, loadFAQs],
  );

  const setField = useCallback(<K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  }, []);

  // ─── Render ─────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="faq-loading">
        <div className="faq-spinner" />
        <p>Loading FAQs…</p>
      </div>
    );
  }

  return (
    <>
      {/* ── Scoped styles ── */}
      <style>{`
        .faq-root { max-width: 1100px; }

        /* Loading */
        .faq-loading { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 60vh; gap: 12px; color: #9ca3af; font-family: 'Segoe UI', 'Roboto', sans-serif; }
        .faq-spinner { width: 36px; height: 36px; border: 3px solid #1f2937; border-top-color: #4ade80; border-radius: 50%; animation: faq-spin 0.8s linear infinite; }
        @keyframes faq-spin { to { transform: rotate(360deg); } }

        /* Header */
        .faq-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; margin-bottom: 24px; flex-wrap: wrap; }
        .faq-title { font-family: 'Segoe UI', 'Roboto', sans-serif; font-size: clamp(22px, 3vw, 30px); font-weight: 800; color: #f9fafb; margin: 0 0 4px; }
        .faq-subtitle { font-family: 'Segoe UI', 'Roboto', sans-serif; font-size: 13px; color: #6b7280; margin: 0; }
        .faq-add-btn { display: flex; align-items: center; gap: 6px; padding: 9px 18px; background: #4ade80; color: #0f172a; border: none; border-radius: 8px; font-family: 'Segoe UI', 'Roboto', sans-serif; font-size: 14px; font-weight: 700; cursor: pointer; white-space: nowrap; transition: background 0.15s; flex-shrink: 0; }
        .faq-add-btn:hover { background: #86efac; }

        /* Summary cards */
        .faq-cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(190px, 1fr)); gap: 14px; margin-bottom: 24px; }
        .faq-card { background: #111827; border: 1px solid #1f2937; border-radius: 12px; padding: 16px 18px 14px; }
        .faq-card__body { display: flex; align-items: flex-start; justify-content: space-between; gap: 8px; margin-bottom: 12px; }
        .faq-card__label { font-family: 'Segoe UI', 'Roboto', sans-serif; font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 4px; }
        .faq-card__value { font-family: 'Segoe UI', 'Roboto', sans-serif; font-size: 28px; font-weight: 800; color: #f9fafb; margin: 0; line-height: 1; }
        .faq-card__icon { flex-shrink: 0; margin-top: 2px; display: inline-flex; align-items: center; justify-content: center; }
        .faq-card__track { height: 4px; background: #1f2937; border-radius: 4px; overflow: hidden; }
        .faq-card__fill { height: 100%; border-radius: 4px; transition: width 0.6s ease; }

        /* Alerts */
        .faq-alert { padding: 10px 14px; border-radius: 8px; font-family: 'Segoe UI', 'Roboto', sans-serif; font-size: 13px; margin-bottom: 16px; }
        .faq-alert--error { background: rgba(239,68,68,0.12); border: 1px solid rgba(239,68,68,0.3); color: #fca5a5; }
        .faq-alert--success { background: rgba(74,222,128,0.1); border: 1px solid rgba(74,222,128,0.25); color: #86efac; }

        /* Toolbar */
        .faq-toolbar { display: flex; gap: 10px; flex-wrap: wrap; align-items: center; margin-bottom: 16px; }
        .faq-search { flex: 1; min-width: 200px; position: relative; }
        .faq-search__icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: #6b7280; pointer-events: none; }
        .faq-search input { width: 100%; padding: 9px 12px 9px 36px; background: #111827; border: 1px solid #1f2937; border-radius: 8px; color: #f9fafb; font-family: 'Segoe UI', 'Roboto', sans-serif; font-size: 13px; outline: none; box-sizing: border-box; }
        .faq-search input:focus { border-color: #4ade80; }
        .faq-search input::placeholder { color: #6b7280; }

        /* Filter chips */
        .faq-chips { display: flex; gap: 6px; flex-wrap: wrap; }
        .faq-chip { padding: 6px 14px; border-radius: 20px; font-family: 'Segoe UI', 'Roboto', sans-serif; font-size: 12px; font-weight: 600; cursor: pointer; border: 1px solid #1f2937; background: transparent; color: #9ca3af; transition: all 0.15s; white-space: nowrap; }
        .faq-chip:hover { color: #f9fafb; border-color: #374151; }
        .faq-chip--active-all { background: rgba(74,222,128,0.1); color: #4ade80; border-color: rgba(74,222,128,0.3); }
        .faq-chip--active-product { background: rgba(74,222,128,0.1); color: #4ade80; border-color: rgba(74,222,128,0.3); }
        .faq-chip--active-common { background: rgba(96,165,250,0.1); color: #60a5fa; border-color: rgba(96,165,250,0.3); }

        /* Results header */
        .faq-results-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; }
        .faq-results-count { font-family: 'Segoe UI', 'Roboto', sans-serif; font-size: 13px; color: #6b7280; margin: 0; }

        /* FAQ Rows */
        .faqrow { background: #111827; border: 1px solid #1f2937; border-radius: 12px; margin-bottom: 8px; overflow: hidden; transition: border-color 0.15s; }
        .faqrow:hover { border-color: #374151; }
        .faqrow__head { display: flex; align-items: center; gap: 12px; padding: 14px 16px; cursor: pointer; flex-wrap: wrap; outline: none; }
        .faqrow__head:focus-visible { outline: 2px solid #4ade80; outline-offset: -2px; border-radius: 12px; }
        .faqrow__meta { display: flex; align-items: center; gap: 6px; flex-shrink: 0; }
        .faqrow__type { padding: 3px 10px; border-radius: 20px; font-family: 'Segoe UI', 'Roboto', sans-serif; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; white-space: nowrap; }
        .faqrow__product { padding: 3px 10px; border-radius: 20px; font-family: 'Segoe UI', 'Roboto', sans-serif; font-size: 11px; font-weight: 600; background: rgba(167,139,250,0.12); color: #a78bfa; border: 1px solid rgba(167,139,250,0.25); white-space: nowrap; max-width: 140px; overflow: hidden; text-overflow: ellipsis; }
        .faqrow__question { flex: 1; min-width: 120px; font-family: 'Segoe UI', 'Roboto', sans-serif; font-size: 14px; font-weight: 600; color: #f9fafb; margin: 0; }
        .faqrow__right { display: flex; align-items: center; gap: 8px; margin-left: auto; flex-shrink: 0; }
        .faqrow__date { font-family: 'Segoe UI', 'Roboto', sans-serif; font-size: 11px; color: #6b7280; white-space: nowrap; }
        .faqrow__edit { display: flex; align-items: center; gap: 4px; padding: 5px 10px; background: rgba(96,165,250,0.1); border: 1px solid rgba(96,165,250,0.25); border-radius: 6px; color: #60a5fa; font-family: 'Segoe UI', 'Roboto', sans-serif; font-size: 11px; font-weight: 600; cursor: pointer; transition: background 0.15s; white-space: nowrap; }
        .faqrow__edit:hover { background: rgba(96,165,250,0.2); }
        .faqrow__del { display: flex; align-items: center; padding: 5px 8px; background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.2); border-radius: 6px; color: #f87171; cursor: pointer; transition: background 0.15s; }
        .faqrow__del:hover { background: rgba(239,68,68,0.2); }
        .faqrow__chevron { color: #6b7280; display: flex; align-items: center; }
        .faqrow__answer { padding: 0 16px 14px; border-top: 1px solid #1f2937; }
        .faqrow__answer-text { font-family: 'Segoe UI', 'Roboto', sans-serif; font-size: 13px; color: #9ca3af; line-height: 1.65; margin: 12px 0 0; white-space: pre-wrap; }

        /* Empty state */
        .faq-empty { text-align: center; padding: 48px 24px; color: #6b7280; }
        .faq-empty__icon { font-size: 40px; margin-bottom: 12px; }
        .faq-empty__title { font-family: 'Segoe UI', 'Roboto', sans-serif; font-size: 15px; font-weight: 600; color: #9ca3af; margin: 0 0 4px; }
        .faq-empty__sub { font-family: 'Segoe UI', 'Roboto', sans-serif; font-size: 13px; margin: 0; }

        /* Modal */
        .faq-modal-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,0.65); z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 24px 16px; }
        .faq-modal { background: #111827; border: 1px solid #1f2937; border-radius: 16px; width: 100%; max-width: 600px; max-height: 90vh; display: flex; flex-direction: column; box-shadow: 0 24px 60px rgba(0,0,0,0.5); }
        .faq-modal__head { padding: 20px 24px; border-bottom: 1px solid #1f2937; display: flex; align-items: center; justify-content: space-between; flex-shrink: 0; }
        .faq-modal__title { font-family: 'Segoe UI', 'Roboto', sans-serif; font-size: 18px; font-weight: 800; color: #f9fafb; margin: 0; }
        .faq-modal__close { background: none; border: none; color: #6b7280; cursor: pointer; padding: 4px; display: flex; border-radius: 6px; transition: color 0.15s; }
        .faq-modal__close:hover { color: #f9fafb; }
        .faq-modal__body { overflow-y: auto; flex: 1; padding: 24px; }
        .faq-modal__foot { padding: 16px 24px; border-top: 1px solid #1f2937; display: flex; justify-content: flex-end; gap: 10px; flex-shrink: 0; }

        /* Form fields */
        .faq-field { margin-bottom: 18px; }
        .faq-field label { display: block; font-family: 'Segoe UI', 'Roboto', sans-serif; font-size: 12px; font-weight: 700; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 6px; }
        .faq-field input, .faq-field textarea, .faq-field select { width: 100%; padding: 10px 12px; background: #0f172a; border: 1px solid #1f2937; border-radius: 8px; color: #f9fafb; font-family: 'Segoe UI', 'Roboto', sans-serif; font-size: 14px; outline: none; transition: border-color 0.15s; box-sizing: border-box; }
        .faq-field input:focus, .faq-field textarea:focus, .faq-field select:focus { border-color: #4ade80; }
        .faq-field input::placeholder, .faq-field textarea::placeholder { color: #374151; }
        .faq-field textarea { resize: vertical; min-height: 100px; line-height: 1.6; }
        .faq-field select { appearance: none; -webkit-appearance: none; cursor: pointer; }
        .faq-field select option { background: #111827; }

        /* Type toggle */
        .faq-type-btns { display: flex; gap: 8px; }
        .faq-type-btn { flex: 1; padding: 9px 14px; border-radius: 8px; font-family: 'Segoe UI', 'Roboto', sans-serif; font-size: 13px; font-weight: 600; cursor: pointer; border: 1px solid #1f2937; background: transparent; color: #9ca3af; transition: all 0.15s; text-align: center; }
        .faq-type-btn--active-product { background: rgba(74,222,128,0.12); color: #4ade80; border-color: rgba(74,222,128,0.3); }
        .faq-type-btn--active-common { background: rgba(96,165,250,0.12); color: #60a5fa; border-color: rgba(96,165,250,0.3); }

        /* Buttons */
        .faq-btn-cancel { padding: 9px 18px; background: transparent; border: 1px solid #374151; border-radius: 8px; color: #9ca3af; font-family: 'Segoe UI', 'Roboto', sans-serif; font-size: 14px; font-weight: 600; cursor: pointer; transition: border-color 0.15s, color 0.15s; }
        .faq-btn-cancel:hover { border-color: #6b7280; color: #f9fafb; }
        .faq-btn-submit { padding: 9px 22px; background: #4ade80; border: none; border-radius: 8px; color: #0f172a; font-family: 'Segoe UI', 'Roboto', sans-serif; font-size: 14px; font-weight: 700; cursor: pointer; transition: background 0.15s; }
        .faq-btn-submit:hover:not(:disabled) { background: #86efac; }
        .faq-btn-submit:disabled { opacity: 0.5; cursor: not-allowed; }

        /* Form error */
        .faq-form-error { margin-bottom: 16px; padding: 10px 14px; background: rgba(239,68,68,0.12); border: 1px solid rgba(239,68,68,0.3); border-radius: 8px; font-family: 'Segoe UI', 'Roboto', sans-serif; font-size: 13px; color: #fca5a5; }

        @media (max-width: 640px) {
          .faqrow__head { gap: 8px; }
          .faqrow__right { gap: 6px; }
          .faqrow__date { display: none; }
          .faqrow__meta { flex-wrap: wrap; }
        }
      `}</style>

      <div className="faq-root">
        {/* ── Header ── */}
        <div className="faq-header">
          <div>
            <h1 className="faq-title">FAQ Management</h1>
            <p className="faq-subtitle">{totalFAQs} total FAQs · {products.length} products available</p>
          </div>
          <button type="button" className="faq-add-btn" onClick={openCreate}>
            <Plus size={16} />
            Add FAQ
          </button>
        </div>

        {/* ── Summary Cards ── */}
        <div className="faq-cards">
          <SummaryCard
            label="Total FAQs"
            value={totalFAQs}
            icon={HelpCircle}
            accent="#4ade80"
            fill={totalFAQs > 0 ? 100 : 0}
          />
          <SummaryCard
            label="Product FAQs"
            value={productFAQs}
            icon={Tag}
            accent="#60a5fa"
            fill={totalFAQs > 0 ? Math.round((productFAQs / totalFAQs) * 100) : 0}
          />
          <SummaryCard
            label="Common FAQs"
            value={commonFAQs}
            icon={LayoutGrid}
            accent="#a78bfa"
            fill={totalFAQs > 0 ? Math.round((commonFAQs / totalFAQs) * 100) : 0}
          />
          <SummaryCard
            label="Products with FAQs"
            value={linkedProducts}
            icon={Tag}
            accent="#f59e0b"
            fill={products.length > 0 ? Math.round((linkedProducts / products.length) * 100) : 0}
          />
        </div>

        {/* ── Alerts ── */}
        {error && <div className="faq-alert faq-alert--error">{error}</div>}
        {successMsg && <div className="faq-alert faq-alert--success">{successMsg}</div>}

        {/* ── Toolbar ── */}
        <div className="faq-toolbar">
          <div className="faq-search">
            <Search size={15} className="faq-search__icon" />
            <input
              type="text"
              placeholder="Search questions, answers or products…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="faq-chips">
            {(['all', 'PRODUCT', 'COMMON'] as FilterType[]).map((f) => {
              const labels: Record<FilterType, string> = {
                all: `All (${totalFAQs})`,
                PRODUCT: `Product (${productFAQs})`,
                COMMON: `Common (${commonFAQs})`,
              };
              const activeClass =
                filterType === f
                  ? f === 'all'
                    ? 'faq-chip--active-all'
                    : f === 'PRODUCT'
                    ? 'faq-chip--active-product'
                    : 'faq-chip--active-common'
                  : '';
              return (
                <button
                  key={f}
                  type="button"
                  className={`faq-chip ${activeClass}`}
                  onClick={() => setFilterType(f)}
                >
                  {labels[f]}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Results count ── */}
        <div className="faq-results-header">
          <p className="faq-results-count">
            {filteredFAQs.length} result{filteredFAQs.length !== 1 ? 's' : ''}
            {search ? ` for "${search}"` : ''}
          </p>
        </div>

        {/* ── FAQ List ── */}
        {filteredFAQs.length === 0 ? (
          <div className="faq-empty">
            <div className="faq-empty__icon">🤔</div>
            <p className="faq-empty__title">No FAQs found</p>
            <p className="faq-empty__sub">
              {search ? 'Try a different search term.' : 'Create your first FAQ above.'}
            </p>
          </div>
        ) : (
          <div>
            {filteredFAQs.map((faq) => (
              <FAQRow
                key={faq.id}
                faq={faq}
                productName={getProductName(faq.productId)}
                expanded={expanded === faq.id}
                onToggle={() => setExpanded(expanded === faq.id ? null : faq.id)}
                onEdit={() => openEdit(faq)}
                onDelete={() => handleDelete(faq.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Modal ── */}
      {showForm && (
        <div className="faq-modal-backdrop" onClick={closeForm}>
          <div className="faq-modal" onClick={(e) => e.stopPropagation()}>
            {/* Head */}
            <div className="faq-modal__head">
              <h2 className="faq-modal__title">
                {editingId !== null ? 'Edit FAQ' : 'New FAQ'}
              </h2>
              <button type="button" className="faq-modal__close" onClick={closeForm}>
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <div className="faq-modal__body">
              {formError && <div className="faq-form-error">{formError}</div>}

              <form id="faq-form" onSubmit={handleSubmit}>
                {/* Type selector */}
                <div className="faq-field">
                  <label>Type *</label>
                  <div className="faq-type-btns">
                    <button
                      type="button"
                      className={`faq-type-btn${form.type === 'PRODUCT' ? ' faq-type-btn--active-product' : ''}`}
                      onClick={() => setField('type', 'PRODUCT')}
                    >
                      Product FAQ
                    </button>
                    <button
                      type="button"
                      className={`faq-type-btn${form.type === 'COMMON' ? ' faq-type-btn--active-common' : ''}`}
                      onClick={() => {
                        setField('type', 'COMMON');
                        setField('productId', '');
                      }}
                    >
                      Common FAQ
                    </button>
                  </div>
                </div>

                {/* Product selector */}
                {form.type === 'PRODUCT' && (
                  <div className="faq-field">
                    <label>Product *</label>
                    <select
                      value={form.productId}
                      onChange={(e) => setField('productId', e.target.value)}
                    >
                      <option value="">— Select a product —</option>
                      {productOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Question */}
                <div className="faq-field">
                  <label>Question *</label>
                  <input
                    type="text"
                    value={form.question}
                    onChange={(e) => setField('question', e.target.value)}
                    placeholder="What would a customer ask?"
                  />
                </div>

                {/* Answer */}
                <div className="faq-field">
                  <label>Answer *</label>
                  <textarea
                    value={form.answer}
                    onChange={(e) => setField('answer', e.target.value)}
                    placeholder="Write a clear, helpful answer…"
                  />
                </div>
              </form>
            </div>

            {/* Footer */}
            <div className="faq-modal__foot">
              <button type="button" className="faq-btn-cancel" onClick={closeForm}>
                Cancel
              </button>
              <button
                type="submit"
                form="faq-form"
                className="faq-btn-submit"
                disabled={submitting}
              >
                {submitting ? 'Saving…' : editingId !== null ? 'Update FAQ' : 'Create FAQ'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}