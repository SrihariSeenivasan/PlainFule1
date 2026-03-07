'use client';

import { useEffect, useState, useCallback, memo } from 'react';
import { Plus, X, ChevronDown, ChevronUp, Pencil, Trash2, Copy, Download, Check, ImagePlus, Loader2 } from 'lucide-react';
import { adminAPI, Product } from '@/lib/api';

const EMPTY_FORM: Omit<Product, 'id'> = {
  name: '',
  description: '',
  price: 0,
  category: '',
  stock: 0,
  subscribePrice: undefined,
  origPrice: undefined,
  tag: '',
  duration: '',
  subtitle: '',
  rating: undefined,
  reviews: undefined,
  headline: '',
  accentWord: '',
  grayWord: '',
  persuade: '',
  tagline: '',
  highlight: '',
  savePct: '',
  benefits: [],
  badges: [],
  variants: [],
  nutrients: [],
};

type FormData = Omit<Product, 'id'>;

// Define these styles outside the component
const inputStyle: React.CSSProperties = {
  width: '100%', padding: '8px 12px', borderRadius: 8,
  border: '1px solid #d1d5db', fontSize: 14,
  backgroundColor: '#fff', color: '#111827', outline: 'none', boxSizing: 'border-box',
};

const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: 12, fontWeight: 600,
  color: '#374151', marginBottom: 4,
};

const getSectionHeaderStyle = (): React.CSSProperties => ({
  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  padding: '10px 14px', background: '#f3f4f6', borderRadius: 8,
  cursor: 'pointer', marginBottom: 8, fontWeight: 600, fontSize: 13, color: '#1f2937',
});

const PRODUCT_TEMPLATE = {
  name: 'PlainFuel Starter Pack',
  description: 'One pouch. No mixing. No measuring.',
  price: 999,
  stock: 100,
  images: ['/uploads/products/example.jpg'],
  category: 'Starter',
  subscribePrice: 799,
  origPrice: 1299,
  savePct: 'Save 25%',
  duration: '30 Days',
  tag: 'Trial · 7 Pouches',
  subtitle: 'Your 7-day intro to nutrition.',
  rating: 4.8,
  reviews: 324,
  headline: 'The Beginning.',
  accentWord: 'Just Start.',
  grayWord: 'Stay consistent.',
  persuade: 'Have it anywhere.',
  tagline: 'Drop it in your bag. Done.',
  highlight: 'Most people feel it in 3 days.',
  benefits: ['Lab tested', 'No artificial colours', 'Vegan friendly'],
  badges: ['7-Day Trial', 'Starter Formula', 'Free Delivery'],
  variants: [
    { id: 'original', name: 'Original', color: '#d4a574', image: '/images/Products/brownpack.png' },
    { id: 'lime', name: 'Lime Twist', color: '#84cc16', image: '/images/Products/limepack.png' },
  ],
  nutrients: [
    { label: 'Vitamin C', amount: '80mg', friendly: 'Immunity shield', emoji: '🍊' },
    { label: 'Zinc', amount: '11mg', friendly: 'Energy spark', emoji: '⚡' },
    { label: 'Magnesium', amount: '150mg', friendly: 'Muscle recovery', emoji: '💪' },
  ],
};

// Memoized Section component
const Section = memo(({ id, title, children, isExpanded, onToggle }: {
  id: string;
  title: string;
  children: React.ReactNode;
  isExpanded: boolean;
  onToggle: (id: string) => void;
}) => (
  <div style={{ marginBottom: 16 }}>
    <div style={getSectionHeaderStyle()} onClick={() => onToggle(id)}>
      <span>{title}</span>
      {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
    </div>
    {isExpanded && (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 16px', padding: '4px 2px' }}>
        {children}
      </div>
    )}
  </div>
));
Section.displayName = 'Section';

// Memoized Field component
const Field = memo(({ label, full, children }: {
  label: string;
  full?: boolean;
  children: React.ReactNode;
}) => (
  <div style={{ gridColumn: full ? '1 / -1' : undefined }}>
    <label style={labelStyle}>{label}</label>
    {children}
  </div>
));
Field.displayName = 'Field';

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    basic: true, pricing: false, display: false, copy: false, json: false,
  });

  const [form, setForm] = useState<FormData>({ ...EMPTY_FORM });

  // JSON array text states
  const [benefitsText, setBenefitsText] = useState('');
  const [badgesText, setBadgesText] = useState('');
  const [variantsText, setVariantsText] = useState('');
  const [nutrientsText, setNutrientsText] = useState('');
  const [copied, setCopied] = useState(false);

  // Image upload state
  type ImageEntry = { preview: string; url?: string; uploading: boolean; error?: string };
  const [imageEntries, setImageEntries] = useState<ImageEntry[]>([]);

  // Compress a File to target ~500 KB using canvas
  const compressImage = (file: File, targetKB = 500): Promise<Blob> =>
    new Promise((resolve, reject) => {
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);
      img.onload = () => {
        URL.revokeObjectURL(objectUrl);
        const canvas = document.createElement('canvas');
        let { width, height } = img;
        // Scale down if very large (keep aspect ratio, max 2000px wide)
        const MAX_SIDE = 2000;
        if (width > MAX_SIDE || height > MAX_SIDE) {
          if (width > height) { height = Math.round((height / width) * MAX_SIDE); width = MAX_SIDE; }
          else { width = Math.round((width / height) * MAX_SIDE); height = MAX_SIDE; }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d')!;
        ctx.drawImage(img, 0, 0, width, height);
        // Binary-search quality to hit ~500 KB
        let lo = 0.1, hi = 0.95, bestBlob: Blob | null = null;
        const attempt = (quality: number) =>
          new Promise<Blob>(res => canvas.toBlob(b => res(b!), 'image/jpeg', quality));
        (async () => {
          for (let i = 0; i < 8; i++) {
            const mid = (lo + hi) / 2;
            const blob = await attempt(mid);
            bestBlob = blob;
            if (blob.size < targetKB * 1024) lo = mid; else hi = mid;
            if (Math.abs(blob.size - targetKB * 1024) < 10 * 1024) break;
          }
          resolve(bestBlob!);
        })().catch(reject);
      };
      img.onerror = reject;
      img.src = objectUrl;
    });

  const handleImageFiles = async (files: FileList | null) => {
    if (!files) return;
    const MAX_FILES = 5;
    const MAX_MB = 10;
    const current = imageEntries.length;
    const slots = MAX_FILES - current;
    if (slots <= 0) { setFormError('Maximum 5 images allowed'); return; }
    const picked = Array.from(files).slice(0, slots);
    const oversized = picked.filter(f => f.size > MAX_MB * 1024 * 1024);
    if (oversized.length) { setFormError(`Files must be under ${MAX_MB} MB each`); return; }

    // Add placeholders immediately (show spinner)
    const placeholders: ImageEntry[] = picked.map(f => ({
      preview: URL.createObjectURL(f),
      uploading: true,
    }));
    setImageEntries(prev => [...prev, ...placeholders]);

    // Compress + upload each
    const formData = new FormData();
    for (const file of picked) {
      const compressed = await compressImage(file);
      formData.append('images', compressed, file.name.replace(/\.[^.]+$/, '.jpg'));
    }

    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? 'Upload failed');
      const urls: string[] = json.urls;
      setImageEntries(prev => {
        const updated = [...prev];
        const startIdx = current;
        urls.forEach((url, i) => {
          updated[startIdx + i] = { ...updated[startIdx + i], url, uploading: false };
        });
        return updated;
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Upload failed';
      setImageEntries(prev => {
        const updated = [...prev];
        for (let i = current; i < updated.length; i++) {
          updated[i] = { ...updated[i], uploading: false, error: msg };
        }
        return updated;
      });
      setFormError(msg);
    }
  };

  const removeImage = useCallback((idx: number) =>
    setImageEntries(prev => prev.filter((_, i) => i !== idx)), 
  []);

  const handleCopyTemplate = useCallback(async () => {
    await navigator.clipboard.writeText(JSON.stringify(PRODUCT_TEMPLATE, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, []);

  const handleDownloadTemplate = useCallback(() => {
    const blob = new Blob([JSON.stringify(PRODUCT_TEMPLATE, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'product-template.json';
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await adminAPI.getProducts();
      setProducts(Array.isArray(data) ? data : []);
      setError('');
    } catch {
      setError('Failed to load products');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const toggleSection = useCallback((key: string) =>
    setExpandedSections(prev => ({ ...prev, [key]: !prev[key] })), 
  []);

  const setField = useCallback((key: keyof FormData, value: unknown) =>
    setForm(prev => ({ ...prev, [key]: value })), 
  []);

  const openCreate = useCallback(() => {
    setForm({ ...EMPTY_FORM });
    setBenefitsText(''); setBadgesText(''); setVariantsText(''); setNutrientsText('');
    setImageEntries([]);
    setEditingId(null); setFormError('');
    setExpandedSections({ basic: true, pricing: false, display: false, copy: false, json: false });
    setShowForm(true);
  }, []);

  const openEdit = useCallback((product: Product) => {
    const { id, ...rest } = product;
    setForm({ ...EMPTY_FORM, ...rest });
    setBenefitsText(JSON.stringify(product.benefits ?? [], null, 2));
    setBadgesText(JSON.stringify(product.badges ?? [], null, 2));
    setVariantsText(JSON.stringify(product.variants ?? [], null, 2));
    setNutrientsText(JSON.stringify(product.nutrients ?? [], null, 2));
    // Populate image entries from existing URLs
    const existingUrls: string[] = Array.isArray(product.images) ? (product.images as string[]) : [];
    setImageEntries(existingUrls.map(url => ({ preview: url, url, uploading: false })));
    setEditingId(id); setFormError('');
    setExpandedSections({ basic: true, pricing: true, display: true, copy: true, json: false });
    setShowForm(true);
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const parseJsonField = (text: string, fieldName: string): any[] | null => {
    if (!text.trim()) return [];
    try { return JSON.parse(text); }
    catch { setFormError(`Invalid JSON in ${fieldName}`); return null; }
  };

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    const benefits = parseJsonField(benefitsText, 'Benefits'); if (benefits === null) return;
    const badges = parseJsonField(badgesText, 'Badges'); if (badges === null) return;
    const variants = parseJsonField(variantsText, 'Variants'); if (variants === null) return;
    const nutrients = parseJsonField(nutrientsText, 'Nutrients'); if (nutrients === null) return;

    const payload = {
      ...form,
      benefits, badges, variants, nutrients,
      images: imageEntries.filter(e => e.url).map(e => e.url!),
    };

    setSubmitting(true);
    try {
      if (editingId !== null) {
        await adminAPI.updateProduct(editingId, payload);
      } else {
        await adminAPI.createProduct(payload);
      }
      setShowForm(false);
      fetchProducts();
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : 'Failed to save product');
    } finally {
      setSubmitting(false);
    }
  }, [form, benefitsText, badgesText, variantsText, nutrientsText, imageEntries, editingId]);

  const handleDelete = useCallback(async (id: number) => {
    if (!confirm('Delete this product?')) return;
    try {
      await adminAPI.deleteProduct(id);
      fetchProducts();
    } catch {
      alert('Failed to delete product');
    }
  }, []);

  const getStatusColor = (stock: number) =>
    stock > 0
      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';

  if (loading) return <div className="p-6 text-gray-600">Loading products...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: '#111827', margin: 0 }}>Products</h2>
        <button onClick={openCreate}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '8px 16px', background: '#15803d', color: '#fff',
            border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer',
          }}>
          <Plus size={16} /> Add Product
        </button>
      </div>

      {/* Create / Edit Form Modal */}
      {showForm && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
          zIndex: 1000, display: 'flex', alignItems: 'center',
          justifyContent: 'center', padding: '24px 16px',
        }}>
          <div style={{
            background: '#fff', borderRadius: 14, width: '100%', maxWidth: 760,
            position: 'relative', boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
            display: 'flex', flexDirection: 'column', maxHeight: '90vh',
          }}>
            {/* Fixed Header */}
            <div style={{ padding: 24, borderBottom: '1px solid #e5e7eb', flexShrink: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#111827' }}>
                  {editingId !== null ? 'Edit Product' : 'Add New Product'}
                </h3>
                <button onClick={() => setShowForm(false)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280' }}>
                  <X size={22} />
                </button>
              </div>

              {/* Template download / copy bar */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 14px', background: '#f0fdf4', border: '1px solid #bbf7d0',
                borderRadius: 8, marginBottom: 20,
              }}>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: '#15803d' }}>Product template</p>
                  <p style={{ margin: 0, fontSize: 11, color: '#4b5563', marginTop: 2 }}>
                    Download or copy the full JSON template with all fields and example values.
                  </p>
                </div>
                <button type="button" onClick={handleCopyTemplate}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 5,
                    padding: '6px 12px', borderRadius: 6, fontSize: 12, fontWeight: 600,
                    border: '1px solid #86efac', background: copied ? '#dcfce7' : '#fff',
                    color: copied ? '#15803d' : '#374151', cursor: 'pointer', whiteSpace: 'nowrap',
                  }}>
                  {copied ? <Check size={13} /> : <Copy size={13} />}
                  {copied ? 'Copied!' : 'Copy JSON'}
                </button>
                <button type="button" onClick={handleDownloadTemplate}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 5,
                    padding: '6px 12px', borderRadius: 6, fontSize: 12, fontWeight: 600,
                    border: 'none', background: '#15803d', color: '#fff',
                    cursor: 'pointer', whiteSpace: 'nowrap',
                  }}>
                  <Download size={13} /> Download .json
                </button>
              </div>

              {formError && (
                <div style={{ padding: '10px 14px', background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 8, color: '#dc2626', fontSize: 13 }}>
                  {formError}
                </div>
              )}
            </div>

            {/* Scrollable Content */}
            <div style={{ overflowY: 'auto', flex: 1, padding: 24 }}>
              <form onSubmit={handleSubmit} style={{ display: 'contents' }}>
                {/* ── BASIC INFO ── */}
                <Section id="basic" title="Basic Information" isExpanded={expandedSections['basic']} onToggle={toggleSection}>
                  <Field label="Name *" full>
                    <input style={inputStyle} value={form.name} required
                      onChange={e => setField('name', e.target.value)} placeholder="PlainFuel Starter Pack" />
                  </Field>
                  <Field label="Description" full>
                    <textarea style={{ ...inputStyle, minHeight: 72, resize: 'vertical' }}
                      value={form.description ?? ''}
                      onChange={e => setField('description', e.target.value)}
                      placeholder="One pouch. No mixing. No measuring..." />
                  </Field>
                  <Field label="Price (₹) *">
                    <input style={inputStyle} type="number" min={0} required value={form.price}
                      onChange={e => setField('price', parseFloat(e.target.value) || 0)} />
                  </Field>
                  <Field label="Stock">
                    <input style={inputStyle} type="number" min={0} value={form.stock}
                      onChange={e => setField('stock', parseInt(e.target.value) || 0)} />
                  </Field>
                  <Field label="Category">
                    <input style={inputStyle} value={form.category ?? ''}
                      onChange={e => setField('category', e.target.value)} placeholder="Starter" />
                  </Field>
                </Section>

                {/* ── IMAGES ── */}
                <div style={{ marginBottom: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: '#f3f4f6', borderRadius: 8, marginBottom: 8, fontWeight: 600, fontSize: 13, color: '#1f2937' }}>
                    <span>Product Images</span>
                    <span style={{ fontSize: 11, fontWeight: 400, color: '#6b7280' }}>Up to 5 images </span>
                  </div>
                  {/* Thumbnails */}
                  {imageEntries.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 10 }}>
                      {imageEntries.map((entry, idx) => (
                        <div key={idx} style={{ position: 'relative', width: 90, height: 90, borderRadius: 8, overflow: 'hidden', border: '2px solid #d1d5db', background: '#f9fafb', flexShrink: 0 }}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={entry.preview} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                          {entry.uploading && (
                            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <Loader2 size={22} color="#fff" style={{ animation: 'spin 1s linear infinite' }} />
                            </div>
                          )}
                          {entry.error && (
                            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(220,38,38,0.85)', color: '#fff', fontSize: 9, padding: '2px 4px', textAlign: 'center' }}>
                              Error
                            </div>
                          )}
                          {!entry.uploading && (
                            <button type="button" onClick={() => removeImage(idx)}
                              style={{ position: 'absolute', top: 3, right: 3, width: 20, height: 20, borderRadius: '50%', background: 'rgba(0,0,0,0.6)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}>
                              <X size={11} color="#fff" />
                            </button>
                          )}
                          <div style={{ position: 'absolute', bottom: 3, left: 3, background: 'rgba(0,0,0,0.55)', borderRadius: 4, padding: '1px 5px', fontSize: 9, color: '#fff' }}>
                            {idx + 1}
                          </div>
                        </div>
                      ))}
                      {imageEntries.length < 5 && (
                        <label style={{ width: 90, height: 90, borderRadius: 8, border: '2px dashed #d1d5db', background: '#f9fafb', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', gap: 4, flexShrink: 0 }}>
                          <ImagePlus size={22} color="#9ca3af" />
                          <span style={{ fontSize: 10, color: '#9ca3af' }}>Add</span>
                          <input type="file" accept="image/*" multiple style={{ display: 'none' }}
                            onChange={e => handleImageFiles(e.target.files)} />
                        </label>
                      )}
                    </div>
                  )}
                  {/* Drop zone when empty */}
                  {imageEntries.length === 0 && (
                    <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '28px 16px', border: '2px dashed #d1d5db', borderRadius: 10, cursor: 'pointer', background: '#fafafa', textAlign: 'center' }}>
                      <ImagePlus size={32} color="#9ca3af" />
                      <div>
                        <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: '#374151' }}>Click to upload images</p>
                        <p style={{ margin: '2px 0 0', fontSize: 11, color: '#6b7280' }}>JPG, PNG, WebP · up to 5 files · 10 MB each</p>
                      </div>
                      <input type="file" accept="image/*" multiple style={{ display: 'none' }}
                        onChange={e => handleImageFiles(e.target.files)} />
                    </label>
                  )}
                </div>

                {/* ── PRICING ── */}
                <Section id="pricing" title="Pricing" isExpanded={expandedSections['pricing']} onToggle={toggleSection}>
                  <Field label="Subscribe Price (₹)">
                    <input style={inputStyle} type="number" min={0}
                      value={form.subscribePrice ?? ''}
                      onChange={e => setField('subscribePrice', e.target.value ? parseFloat(e.target.value) : undefined)} />
                  </Field>
                  <Field label="Original / Compare-at Price (₹)">
                    <input style={inputStyle} type="number" min={0}
                      value={form.origPrice ?? ''}
                      onChange={e => setField('origPrice', e.target.value ? parseFloat(e.target.value) : undefined)} />
                  </Field>
                  <Field label="Save % Label">
                    <input style={inputStyle} value={form.savePct ?? ''}
                      onChange={e => setField('savePct', e.target.value)} placeholder="Save 25%" />
                  </Field>
                  <Field label="Duration">
                    <input style={inputStyle} value={form.duration ?? ''}
                      onChange={e => setField('duration', e.target.value)} placeholder="30 Days" />
                  </Field>
                </Section>

                {/* ── DISPLAY INFO ── */}
                <Section id="display" title="Display Info" isExpanded={expandedSections['display']} onToggle={toggleSection}>
                  <Field label="Tag">
                    <input style={inputStyle} value={form.tag ?? ''}
                      onChange={e => setField('tag', e.target.value)} placeholder="Trial · 7 Pouches" />
                  </Field>
                  <Field label="Subtitle">
                    <input style={inputStyle} value={form.subtitle ?? ''}
                      onChange={e => setField('subtitle', e.target.value)} placeholder="Your 7-day intro to nutrition." />
                  </Field>
                  <Field label="Rating">
                    <input style={inputStyle} type="number" min={0} max={5} step={0.1}
                      value={form.rating ?? ''}
                      onChange={e => setField('rating', e.target.value ? parseFloat(e.target.value) : undefined)} placeholder="4.8" />
                  </Field>
                  <Field label="Review Count">
                    <input style={inputStyle} type="number" min={0}
                      value={form.reviews ?? ''}
                      onChange={e => setField('reviews', e.target.value ? parseInt(e.target.value) : undefined)} placeholder="324" />
                  </Field>
                </Section>

                {/* ── MARKETING COPY ── */}
                <Section id="copy" title="Marketing Copy" isExpanded={expandedSections['copy']} onToggle={toggleSection}>
                  <Field label="Headline" full>
                    <input style={inputStyle} value={form.headline ?? ''}
                      onChange={e => setField('headline', e.target.value)} placeholder="The Beginning." />
                  </Field>
                  <Field label="Accent Word">
                    <input style={inputStyle} value={form.accentWord ?? ''}
                      onChange={e => setField('accentWord', e.target.value)} placeholder="Just Start." />
                  </Field>
                  <Field label="Gray Word">
                    <input style={inputStyle} value={form.grayWord ?? ''}
                      onChange={e => setField('grayWord', e.target.value)} placeholder="Stay consistent." />
                  </Field>
                  <Field label="Persuade">
                    <input style={inputStyle} value={form.persuade ?? ''}
                      onChange={e => setField('persuade', e.target.value)} placeholder="Have it anywhere." />
                  </Field>
                  <Field label="Tagline">
                    <input style={inputStyle} value={form.tagline ?? ''}
                      onChange={e => setField('tagline', e.target.value)} placeholder="Drop it in your bag. Done." />
                  </Field>
                  <Field label="Highlight">
                    <input style={inputStyle} value={form.highlight ?? ''}
                      onChange={e => setField('highlight', e.target.value)} placeholder="Most people feel it in 3 days." />
                  </Field>
                </Section>

                {/* ── PASTE JSON ── */}
                <Section id="json" title="Or Paste JSON" isExpanded={expandedSections['json']} onToggle={toggleSection}>
                  <Field label='Paste your modified product JSON here' full>
                    <textarea style={{ ...inputStyle, minHeight: 120, fontFamily: 'monospace', fontSize: 12, resize: 'vertical' }}
                      placeholder={'Paste the downloaded/copied JSON template with your changes here...'}
                      onBlur={(e) => {
                        try {
                          const data = JSON.parse(e.target.value);
                          setForm(prev => ({ ...EMPTY_FORM, ...prev, ...data }));
                          setBenefitsText(JSON.stringify(data.benefits ?? [], null, 2));
                          setBadgesText(JSON.stringify(data.badges ?? [], null, 2));
                          setVariantsText(JSON.stringify(data.variants ?? [], null, 2));
                          setNutrientsText(JSON.stringify(data.nutrients ?? [], null, 2));
                          if (data.images && Array.isArray(data.images)) {
                            setImageEntries(data.images.map((url: string) => ({ preview: url, url, uploading: false })));
                          }
                          setFormError('');
                          e.target.value = '';
                        } catch (err) {
                          setFormError(`Invalid JSON: ${err instanceof Error ? err.message : 'Parse error'}`);
                        }
                      }}
                    />
                  </Field>
                </Section>
              </form>
            </div>

            {/* Fixed Footer */}
            <div style={{ padding: 24, borderTop: '1px solid #e5e7eb', display: 'flex', justifyContent: 'flex-end', gap: 10, flexShrink: 0 }}>
              <button type="button" onClick={() => setShowForm(false)}
                style={{ padding: '9px 20px', borderRadius: 8, border: '1px solid #d1d5db', background: '#fff', fontSize: 14, cursor: 'pointer', color: '#374151', fontWeight: 600 }}>
                Cancel
              </button>
              <button type="submit" disabled={submitting} onClick={handleSubmit}
                style={{ padding: '9px 20px', borderRadius: 8, border: 'none', background: submitting ? '#86efac' : '#15803d', color: '#fff', fontSize: 14, fontWeight: 600, cursor: submitting ? 'not-allowed' : 'pointer' }}>
                {submitting ? 'Saving...' : editingId !== null ? 'Update Product' : 'Create Product'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Products table */}
      {products.length === 0 ? (
        <div className="p-6 text-gray-600">No products found. Add your first product above.</div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">ID</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Price</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Sub. Price</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Category</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Stock</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <td className="px-6 py-3 text-sm font-medium text-gray-900 dark:text-white">{product.id}</td>
                  <td className="px-6 py-3 text-sm text-gray-600 dark:text-gray-400">
                    <div style={{ fontWeight: 600, color: '#111827' }}>{product.name}</div>
                    {product.tag && <div style={{ fontSize: 11, color: '#6b7280' }}>{product.tag}</div>}
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-600 dark:text-gray-400">₹{product.price}</td>
                  <td className="px-6 py-3 text-sm text-gray-600 dark:text-gray-400">
                    {product.subscribePrice ? `₹${product.subscribePrice}` : '—'}
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-600 dark:text-gray-400">{product.category || '—'}</td>
                  <td className="px-6 py-3 text-sm text-gray-600 dark:text-gray-400">{product.stock} units</td>
                  <td className="px-6 py-3 text-sm">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(product.stock)}`}>
                      {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </td>
                  <td className="px-6 py-3">
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button onClick={() => openEdit(product)}
                        style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '5px 10px', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 6, color: '#2563eb', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                        <Pencil size={13} /> Edit
                      </button>
                      <button onClick={() => handleDelete(product.id)}
                        style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '5px 10px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 6, color: '#dc2626', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                        <Trash2 size={13} /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

