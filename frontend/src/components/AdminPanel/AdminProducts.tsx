'use client';

import { useEffect, useState, useCallback, memo } from 'react';
import { Plus, X, ChevronDown, ChevronUp, Pencil, Trash2, Copy, Download, Check, ImagePlus } from 'lucide-react';
import { adminAPI, Product, ProductPackage } from '@/lib/api';

const EMPTY_FORM: Omit<Product, 'id'> = {
  name: '',
  description: '',
  category: '',
  packages: [
    { 
      id: '7days', duration: '7 days', daysCount: 7, pouches: 7, 
      price: 0, origPrice: 0, savePct: '', images: [], stock: 0,
      tag: '', subtitle: '', headline: '', accentWord: '', grayWord: '', 
      persuade: '', tagline: '', highlight: '', benefits: [], badges: [], 
      variants: [], nutrients: []
    },
    { 
      id: '15days', duration: '15 days', daysCount: 15, pouches: 15, 
      price: 0, origPrice: 0, savePct: '', images: [], stock: 0,
      tag: '', subtitle: '', headline: '', accentWord: '', grayWord: '', 
      persuade: '', tagline: '', highlight: '', benefits: [], badges: [], 
      variants: [], nutrients: []
    },
    { 
      id: '30days', duration: '30 days', daysCount: 30, pouches: 30, 
      price: 0, origPrice: 0, savePct: '', images: [], stock: 0,
      tag: '', subtitle: '', headline: '', accentWord: '', grayWord: '', 
      persuade: '', tagline: '', highlight: '', benefits: [], badges: [], 
      variants: [], nutrients: []
    },
  ],
  rating: undefined,
  reviews: undefined,
};

type FormData = Omit<Product, 'id'>;

// Type definitions for array inputs
type Variant = { id: string; name: string; color: string; image: string };
type Nutrient = { label: string; amount?: string; friendly?: string; emoji?: string };

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
  description: 'Complete daily nutrition in convenient pouches. Mix with water, drink, feel better.',
  category: 'Starter Pack',
  packages: [
    {
      id: '7days',
      duration: '7 days',
      daysCount: 7,
      pouches: 7,
      price: 999,
      origPrice: 1299,
      savePct: 'Save 23%',
      stock: 150,
      tag: 'Trial Pack',
      subtitle: 'Perfect for trying',
      headline: 'The Beginning',
      accentWord: 'Just Start',
      grayWord: 'Stay consistent',
      persuade: 'Have it anywhere',
      tagline: 'Drop it in your bag',
      highlight: 'Feel the difference in 3 days',
      images: ['/uploads/products/brownpack.png'],
      benefits: ['Lab tested', 'No artificial colours', 'Vegan friendly'],
      badges: ['7-Day Trial', 'Free Delivery'],
      variants: [{ id: 'original', name: 'Original', color: '#d4a574', image: '/images/Products/brownpack.png' }],
      nutrients: [
        { label: 'Vitamin C', amount: '80mg', friendly: 'Immunity shield', emoji: '🍊' },
        { label: 'Zinc', amount: '11mg', friendly: 'Energy boost', emoji: '⚡' },
      ]
    },
    {
      id: '15days',
      duration: '15 days',
      daysCount: 15,
      pouches: 15,
      price: 1999,
      origPrice: 2599,
      savePct: 'Save 23%',
      stock: 120,
      tag: 'Best Value',
      subtitle: 'Most popular choice',
      headline: 'The Consistent Choice',
      accentWord: 'Build Habit',
      grayWord: 'Track Progress',
      persuade: 'Perfect for travel',
      tagline: 'Two weeks of nutrition',
      highlight: 'Results visible in 2 weeks',
      images: ['/uploads/products/brownpack.png'],
      benefits: ['Lab tested', 'No artificial colours', 'Vegan friendly'],
      badges: ['Best Value', 'Free Delivery'],
      variants: [{ id: 'original', name: 'Original', color: '#d4a574', image: '/images/Products/brownpack.png' }],
      nutrients: [
        { label: 'Vitamin C', amount: '80mg', friendly: 'Immunity shield', emoji: '🍊' },
        { label: 'Zinc', amount: '11mg', friendly: 'Energy boost', emoji: '⚡' },
      ]
    },
    {
      id: '30days',
      duration: '30 days',
      daysCount: 30,
      pouches: 30,
      price: 3499,
      origPrice: 4599,
      savePct: 'Save 24%',
      stock: 100,
      tag: 'Monthly Supply',
      subtitle: 'Complete month supply',
      headline: 'The Long Game',
      accentWord: 'Transform',
      grayWord: 'Real Results',
      persuade: 'Make it a routine',
      tagline: 'Full month of nutrition',
      highlight: 'Maximum benefits at 30 days',
      images: ['/uploads/products/brownpack.png'],
      benefits: ['Lab tested', 'No artificial colours', 'Vegan friendly'],
      badges: ['Monthly Supply', 'Free Delivery'],
      variants: [{ id: 'original', name: 'Original', color: '#d4a574', image: '/images/Products/brownpack.png' }],
      nutrients: [
        { label: 'Vitamin C', amount: '80mg', friendly: 'Immunity shield', emoji: '🍊' },
        { label: 'Zinc', amount: '11mg', friendly: 'Energy boost', emoji: '⚡' },
      ]
    }
  ]
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

// String Array Input (for Benefits, Badges)
const StringArrayInput = ({ items, onUpdate, placeholder }: {
  items: string[];
  onUpdate: (items: string[]) => void;
  placeholder: string;
}) => {
  const [inputValue, setInputValue] = useState('');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', gap: 6 }}>
        <input
          style={{ ...inputStyle, flex: 1 }}
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          onKeyPress={e => {
            if (e.key === 'Enter' && inputValue.trim()) {
              onUpdate([...items, inputValue.trim()]);
              setInputValue('');
            }
          }}
          placeholder={placeholder}
        />
        <button
          type="button"
          onClick={() => {
            if (inputValue.trim()) {
              onUpdate([...items, inputValue.trim()]);
              setInputValue('');
            }
          }}
          style={{
            padding: '8px 14px', background: '#15803d', color: '#fff',
            border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Add
        </button>
      </div>
      {items.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {items.map((item, idx) => (
            <div key={idx} style={{
              background: '#e8f5f0', border: '1px solid #15803d', borderRadius: 6,
              padding: '6px 10px', display: 'flex', alignItems: 'center', gap: 6,
            }}>
              <span style={{ fontSize: 12, color: '#1a1a1a' }}>{item}</span>
              <button
                type="button"
                onClick={() => onUpdate(items.filter((_, i) => i !== idx))}
                style={{
                  background: 'none', border: 'none', color: '#d32f2f', cursor: 'pointer',
                  fontSize: 14, fontWeight: 700, padding: 0,
                }}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Variant Array Input
const VariantArrayInput = ({ items, onUpdate }: {
  items: Variant[];
  onUpdate: (items: Variant[]) => void;
}) => {
  const [formData, setFormData] = useState<Variant>({ id: '', name: '', color: '#d4a574', image: '' });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <input style={inputStyle} value={formData.id} onChange={e => setFormData({ ...formData, id: e.target.value })} placeholder="Variant ID (e.g., original)" />
        <input style={inputStyle} value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="Variant Name (e.g., Original)" />
        <input style={inputStyle} type="color" value={formData.color} onChange={e => setFormData({ ...formData, color: e.target.value })} />
        <input style={inputStyle} value={formData.image} onChange={e => setFormData({ ...formData, image: e.target.value })} placeholder="Image URL" />
      </div>
      <button
        type="button"
        onClick={() => {
          if (formData.id && formData.name) {
            onUpdate([...items, formData]);
            setFormData({ id: '', name: '', color: '#d4a574', image: '' });
          }
        }}
        style={{
          padding: '8px 14px', background: '#15803d', color: '#fff',
          border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer',
        }}
      >
        Add Variant
      </button>
      {items.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {items.map((item, idx) => (
            <div key={idx} style={{
              background: '#f9f9f9', border: '1px solid #d1d5db', borderRadius: 8, padding: 8,
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 24, height: 24, background: item.color, borderRadius: 4 }} />
                <span style={{ fontSize: 12, fontWeight: 600 }}>{item.name}</span>
              </div>
              <button
                type="button"
                onClick={() => onUpdate(items.filter((_, i) => i !== idx))}
                style={{
                  background: 'none', border: 'none', color: '#d32f2f', cursor: 'pointer',
                  fontSize: 14, fontWeight: 700, padding: 0,
                }}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Nutrient Array Input
const NutrientArrayInput = ({ items, onUpdate }: {
  items: Nutrient[];
  onUpdate: (items: Nutrient[]) => void;
}) => {
  const [formData, setFormData] = useState<Nutrient>({ label: '', amount: '', friendly: '', emoji: '' });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <input style={inputStyle} value={formData.label} onChange={e => setFormData({ ...formData, label: e.target.value })} placeholder="Nutrient (e.g., Vitamin C)" />
        <input style={inputStyle} value={formData.amount} onChange={e => setFormData({ ...formData, amount: e.target.value })} placeholder="Amount (e.g., 80mg)" />
        <input style={inputStyle} value={formData.friendly} onChange={e => setFormData({ ...formData, friendly: e.target.value })} placeholder="Friendly name (e.g., Immunity shield)" />
        <input style={inputStyle} value={formData.emoji} onChange={e => setFormData({ ...formData, emoji: e.target.value })} placeholder="Emoji (e.g., 🍊)" maxLength={2} />
      </div>
      <button
        type="button"
        onClick={() => {
          if (formData.label && formData.amount) {
            onUpdate([...items, formData]);
            setFormData({ label: '', amount: '', friendly: '', emoji: '' });
          }
        }}
        style={{
          padding: '8px 14px', background: '#15803d', color: '#fff',
          border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer',
        }}
      >
        Add Nutrient
      </button>
      {items.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {items.map((item, idx) => (
            <div key={idx} style={{
              background: '#fffde6', border: '1px solid #d4a574', borderRadius: 8, padding: 10,
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <div style={{ fontSize: 12 }}>
                <div style={{ fontWeight: 600, color: '#1a1a1a' }}>{item.emoji} {item.label}</div>
                <div style={{ color: '#666', fontSize: 11 }}>{item.amount} · {item.friendly}</div>
              </div>
              <button
                type="button"
                onClick={() => onUpdate(items.filter((_, i) => i !== idx))}
                style={{
                  background: 'none', border: 'none', color: '#d32f2f', cursor: 'pointer',
                  fontSize: 14, fontWeight: 700, padding: 0,
                }}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

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

  const [copied, setCopied] = useState(false);

  // Image upload state (PACKAGE LEVEL ONLY - No product-level images)
  type ImageEntry = { preview: string; url?: string; uploading: boolean; error?: string };
  
  // Package state
  const [checkedPackages, setCheckedPackages] = useState({ '7days': true, '15days': true, '30days': true });
  const [packageImages, setPackageImages] = useState<Record<string, ImageEntry[]>>({
    '7days': [],
    '15days': [],
    '30days': [],
  });

  // Compress a File to target ~500 KB using canvas (Shared by package images)
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

  const handlePackageImageFiles = async (packageId: string, files: FileList | null) => {
    if (!files) return;
    const MAX_FILES = 5;
    const MAX_MB = 10;
    const current = (packageImages[packageId] ?? []).length;
    const slots = MAX_FILES - current;
    if (slots <= 0) { setFormError('Maximum 5 images per package'); return; }
    const picked = Array.from(files).slice(0, slots);
    const oversized = picked.filter(f => f.size > MAX_MB * 1024 * 1024);
    if (oversized.length) { setFormError(`Files must be under ${MAX_MB} MB each`); return; }

    // Add placeholders
    const placeholders: ImageEntry[] = picked.map(f => ({
      preview: URL.createObjectURL(f),
      uploading: true,
    }));
    setPackageImages(prev => ({
      ...prev,
      [packageId]: [...(prev[packageId] ?? []), ...placeholders],
    }));

    // Compress + upload
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
      setPackageImages(prev => {
        const updated = { ...prev };
        const pkgList = updated[packageId] ?? [];
        urls.forEach((url, i) => {
          if (current + i < pkgList.length) {
            pkgList[current + i] = { ...pkgList[current + i], url, uploading: false };
          }
        });
        updated[packageId] = pkgList;
        return updated;
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Upload failed';
      setPackageImages(prev => {
        const updated = { ...prev };
        const pkgList = updated[packageId] ?? [];
        for (let i = current; i < pkgList.length; i++) {
          pkgList[i] = { ...pkgList[i], uploading: false, error: msg };
        }
        updated[packageId] = pkgList;
        return updated;
      });
      setFormError(msg);
    }
  };

  const removePackageImage = useCallback((packageId: string, idx: number) =>
    setPackageImages(prev => ({
      ...prev,
      [packageId]: (prev[packageId] ?? []).filter((_, i) => i !== idx),
    })), 
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
    setCheckedPackages({ '7days': true, '15days': true, '30days': true });
    setPackageImages({ '7days': [], '15days': [], '30days': [] });
    setEditingId(null); setFormError('');
    setExpandedSections({ basic: true, pricing: false, display: false, copy: false, json: false });
    setShowForm(true);
  }, []);

  const openEdit = useCallback((product: Product) => {
    const { id, ...rest } = product;
    
    // Load package data and images
    const packages = (product.packages as ProductPackage[]) ?? [];
    const initialChecked: { '7days': boolean; '15days': boolean; '30days': boolean } = { '7days': false, '15days': false, '30days': false };
    const initialPkgImages: Record<string, ImageEntry[]> = {};
    
    packages.forEach((pkg: ProductPackage) => {
      const pkgId = pkg.id as '7days' | '15days' | '30days';
      initialChecked[pkgId] = true;
      const pkgImages = Array.isArray(pkg.images) ? pkg.images : [];
      initialPkgImages[pkg.id] = pkgImages.map((url: string) => ({ preview: url, url, uploading: false }));
    });
    
    // Set form with the product's packages instead of EMPTY_FORM's packages
    setForm({ 
      name: rest.name || '',
      description: rest.description || '',
      category: rest.category || '',
      packages: packages.length > 0 ? packages : EMPTY_FORM.packages,
      rating: rest.rating,
      reviews: rest.reviews,
    });
    
    setCheckedPackages(initialChecked);
    setPackageImages(initialPkgImages);
    
    setEditingId(id); setFormError('');
    setExpandedSections({ basic: true, pricing: true, display: true, copy: true, json: false });
    setShowForm(true);
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    // Build packages from form and packageImages
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { rating, reviews, ...formWithoutStats } = form;
    
    const packages = (form.packages ?? [])
      .filter(pkg => checkedPackages[pkg.id as '7days' | '15days' | '30days'] ?? false)
      .map(pkg => ({
        ...pkg,
        images: (packageImages[pkg.id] ?? []).filter(img => img.url).map(img => img.url!),
      }));

    if (packages.length === 0) {
      setFormError('Please select at least one package');
      return;
    }

    // Payload now only includes product-level common fields and packages
    const payload = {
      name: formWithoutStats.name,
      description: formWithoutStats.description,
      category: formWithoutStats.category,
      packages,
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
  }, [form, packageImages, checkedPackages, editingId]);

  const handleDelete = useCallback(async (id: number) => {
    if (!confirm('Delete this product?')) return;
    try {
      await adminAPI.deleteProduct(id);
      fetchProducts();
    } catch {
      alert('Failed to delete product');
    }
  }, []);

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
                  <Field label="Category">
                    <input style={inputStyle} value={form.category ?? ''}
                      onChange={e => setField('category', e.target.value)} placeholder="Starter" />
                  </Field>
                </Section>

                {/* ── NOTE: Images are now managed per-package below ── */}
                <div style={{ padding: '10px 12px', background: 'rgba(59, 130, 246, 0.05)', border: '1px solid rgba(59, 130, 246, 0.2)', borderRadius: 8, marginBottom: 16, fontSize: 12, color: '#1e40af', display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                  <span style={{ lineHeight: 1.4 }}>📦 All images are managed per-package below. Each package can have its own set of product images.</span>
                </div>

                {/* ── PRICING & PACKAGES ── */}
                <Section id="pricing" title="Packages & Pricing" isExpanded={expandedSections['pricing']} onToggle={toggleSection}>
                  <div style={{ gridColumn: '1 / -1', marginBottom: 12 }}>
                    <p style={{ ...labelStyle, marginBottom: 12 }}>Select packages and set prices (one price per package)</p>
                  </div>

                  {/* 7 Days Package */}
                  <div style={{ gridColumn: '1 / -1', paddingBottom: 16, borderBottom: '1px solid #e5e7eb' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                      <input type="checkbox" id="pkg7" checked={checkedPackages['7days']}
                        onChange={e => setCheckedPackages(prev => ({ ...prev, '7days': e.target.checked }))}
                        style={{ width: 18, height: 18, cursor: 'pointer' }} />
                      <label htmlFor="pkg7" style={{ ...labelStyle, margin: 0, cursor: 'pointer', fontWeight: 600 }}>7 Days Sachet (7 pouches)</label>
                    </div>
                    {checkedPackages['7days'] && (
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                        <Field label="Price (₹)">
                          <input style={inputStyle} type="number" min={0}
                            value={(form.packages?.[0]?.price ?? '')}
                            onChange={e => {
                              const newPackages = [...(form.packages ?? [])];
                              newPackages[0] = { ...newPackages[0], price: parseFloat(e.target.value) || 0 };
                              setField('packages', newPackages);
                            }} placeholder="999" />
                        </Field>
                        <Field label="Original Price (₹)">
                          <input style={inputStyle} type="number" min={0}
                            value={(form.packages?.[0]?.origPrice ?? '')}
                            onChange={e => {
                              const newPackages = [...(form.packages ?? [])];
                              newPackages[0] = { ...newPackages[0], origPrice: parseFloat(e.target.value) || 0 };
                              setField('packages', newPackages);
                            }} placeholder="1299" />
                        </Field>
                        <Field label="Save % Label" full>
                          <input style={inputStyle}
                            value={(form.packages?.[0]?.savePct ?? '')}
                            onChange={e => {
                              const newPackages = [...(form.packages ?? [])];
                              newPackages[0] = { ...newPackages[0], savePct: e.target.value };
                              setField('packages', newPackages);
                            }} placeholder="Save 25%" />
                        </Field>
                        <div style={{ gridColumn: '1 / -1' }}>
                          <label style={labelStyle}>Package Images (up to 5)</label>
                          {(packageImages['7days'] ?? []).length > 0 && (
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 10 }}>
                              {(packageImages['7days'] ?? []).map((entry, idx) => (
                                <div key={idx} style={{ position: 'relative', width: 80, height: 80, borderRadius: 8, overflow: 'hidden', border: '2px solid #d1d5db', background: '#f9fafb', flexShrink: 0 }}>
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img src={entry.preview} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                                  {!entry.uploading && (
                                    <button type="button" onClick={() => removePackageImage('7days', idx)}
                                      style={{ position: 'absolute', top: 2, right: 2, width: 18, height: 18, borderRadius: '50%', background: 'rgba(0,0,0,0.6)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}>
                                      <X size={10} color="#fff" />
                                    </button>
                                  )}
                                </div>
                              ))}
                              {(packageImages['7days'] ?? []).length < 5 && (
                                <label style={{ width: 80, height: 80, borderRadius: 8, border: '2px dashed #d1d5db', background: '#f9fafb', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', gap: 4, flexShrink: 0 }}>
                                  <ImagePlus size={18} color="#9ca3af" />
                                  <input type="file" accept="image/*" multiple style={{ display: 'none' }}
                                    onChange={e => handlePackageImageFiles('7days', e.target.files)} />
                                </label>
                              )}
                            </div>
                          )}
                          {(packageImages['7days'] ?? []).length === 0 && (
                            <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '16px', border: '2px dashed #d1d5db', borderRadius: 8, cursor: 'pointer', background: '#fafafa' }}>
                              <ImagePlus size={24} color="#9ca3af" />
                              <span style={{ fontSize: 12, color: '#6b7280' }}>Click to upload</span>
                              <input type="file" accept="image/*" multiple style={{ display: 'none' }}
                                onChange={e => handlePackageImageFiles('7days', e.target.files)} />
                            </label>
                          )}
                        </div>
                        
                        {/* Stock */}
                        <Field label="Stock">
                          <input style={inputStyle} type="number" min={0}
                            value={(form.packages?.[0]?.stock ?? '')}
                            onChange={e => {
                              const newPackages = [...(form.packages ?? [])];
                              newPackages[0] = { ...newPackages[0], stock: parseInt(e.target.value) || 0 };
                              setField('packages', newPackages);
                            }} placeholder="100" />
                        </Field>

                        {/* Tag & Subtitle */}
                        <Field label="Tag">
                          <input style={inputStyle}
                            value={(form.packages?.[0]?.tag ?? '')}
                            onChange={e => {
                              const newPackages = [...(form.packages ?? [])];
                              newPackages[0] = { ...newPackages[0], tag: e.target.value };
                              setField('packages', newPackages);
                            }} placeholder="Trial · 7 Pouches" />
                        </Field>
                        <Field label="Subtitle">
                          <input style={inputStyle}
                            value={(form.packages?.[0]?.subtitle ?? '')}
                            onChange={e => {
                              const newPackages = [...(form.packages ?? [])];
                              newPackages[0] = { ...newPackages[0], subtitle: e.target.value };
                              setField('packages', newPackages);
                            }} placeholder="Your 7-day intro to nutrition." />
                        </Field>

                        {/* Marketing Copy */}
                        <Field label="Headline" full>
                          <input style={inputStyle}
                            value={(form.packages?.[0]?.headline ?? '')}
                            onChange={e => {
                              const newPackages = [...(form.packages ?? [])];
                              newPackages[0] = { ...newPackages[0], headline: e.target.value };
                              setField('packages', newPackages);
                            }} placeholder="The Beginning." />
                        </Field>
                        <Field label="Accent Word">
                          <input style={inputStyle}
                            value={(form.packages?.[0]?.accentWord ?? '')}
                            onChange={e => {
                              const newPackages = [...(form.packages ?? [])];
                              newPackages[0] = { ...newPackages[0], accentWord: e.target.value };
                              setField('packages', newPackages);
                            }} placeholder="Just Start." />
                        </Field>
                        <Field label="Gray Word">
                          <input style={inputStyle}
                            value={(form.packages?.[0]?.grayWord ?? '')}
                            onChange={e => {
                              const newPackages = [...(form.packages ?? [])];
                              newPackages[0] = { ...newPackages[0], grayWord: e.target.value };
                              setField('packages', newPackages);
                            }} placeholder="Stay consistent." />
                        </Field>
                        <Field label="Persuade">
                          <input style={inputStyle}
                            value={(form.packages?.[0]?.persuade ?? '')}
                            onChange={e => {
                              const newPackages = [...(form.packages ?? [])];
                              newPackages[0] = { ...newPackages[0], persuade: e.target.value };
                              setField('packages', newPackages);
                            }} placeholder="Have it anywhere." />
                        </Field>
                        <Field label="Tagline">
                          <input style={inputStyle}
                            value={(form.packages?.[0]?.tagline ?? '')}
                            onChange={e => {
                              const newPackages = [...(form.packages ?? [])];
                              newPackages[0] = { ...newPackages[0], tagline: e.target.value };
                              setField('packages', newPackages);
                            }} placeholder="Drop it in your bag. Done." />
                        </Field>
                        <Field label="Highlight">
                          <input style={inputStyle}
                            value={(form.packages?.[0]?.highlight ?? '')}
                            onChange={e => {
                              const newPackages = [...(form.packages ?? [])];
                              newPackages[0] = { ...newPackages[0], highlight: e.target.value };
                              setField('packages', newPackages);
                            }} placeholder="Most people feel it in 3 days." />
                        </Field>

                        {/* Benefits */}
                        <Field label="Benefits" full>
                          <StringArrayInput
                            items={form.packages?.[0]?.benefits ?? []}
                            onUpdate={items => {
                              const newPackages = [...(form.packages ?? [])];
                              newPackages[0] = { ...newPackages[0], benefits: items };
                              setField('packages', newPackages);
                            }}
                            placeholder="Type benefit and press Enter..."
                          />
                        </Field>

                        {/* Badges */}
                        <Field label="Badges" full>
                          <StringArrayInput
                            items={form.packages?.[0]?.badges ?? []}
                            onUpdate={items => {
                              const newPackages = [...(form.packages ?? [])];
                              newPackages[0] = { ...newPackages[0], badges: items };
                              setField('packages', newPackages);
                            }}
                            placeholder="Type badge and press Enter..."
                          />
                        </Field>

                        {/* Variants */}
                        <Field label="Variants" full>
                          <VariantArrayInput
                            items={form.packages?.[0]?.variants ?? []}
                            onUpdate={items => {
                              const newPackages = [...(form.packages ?? [])];
                              newPackages[0] = { ...newPackages[0], variants: items };
                              setField('packages', newPackages);
                            }}
                          />
                        </Field>

                        {/* Nutrients */}
                        <Field label="Nutrients" full>
                          <NutrientArrayInput
                            items={form.packages?.[0]?.nutrients ?? []}
                            onUpdate={items => {
                              const newPackages = [...(form.packages ?? [])];
                              newPackages[0] = { ...newPackages[0], nutrients: items };
                              setField('packages', newPackages);
                            }}
                          />
                        </Field>
                      </div>
                    )}
                  </div>

                  {/* 15 Days Package */}
                  <div style={{ gridColumn: '1 / -1', paddingBottom: 16, borderBottom: '1px solid #e5e7eb' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                      <input type="checkbox" id="pkg15" checked={checkedPackages['15days']}
                        onChange={e => setCheckedPackages(prev => ({ ...prev, '15days': e.target.checked }))}
                        style={{ width: 18, height: 18, cursor: 'pointer' }} />
                      <label htmlFor="pkg15" style={{ ...labelStyle, margin: 0, cursor: 'pointer', fontWeight: 600 }}>15 Days Sachet (15 pouches)</label>
                    </div>
                    {checkedPackages['15days'] && (
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                        <Field label="Price (₹)">
                          <input style={inputStyle} type="number" min={0}
                            value={(form.packages?.[1]?.price ?? '')}
                            onChange={e => {
                              const newPackages = [...(form.packages ?? [])];
                              newPackages[1] = { ...newPackages[1], price: parseFloat(e.target.value) || 0 };
                              setField('packages', newPackages);
                            }} placeholder="1999" />
                        </Field>
                        <Field label="Original Price (₹)">
                          <input style={inputStyle} type="number" min={0}
                            value={(form.packages?.[1]?.origPrice ?? '')}
                            onChange={e => {
                              const newPackages = [...(form.packages ?? [])];
                              newPackages[1] = { ...newPackages[1], origPrice: parseFloat(e.target.value) || 0 };
                              setField('packages', newPackages);
                            }} placeholder="2499" />
                        </Field>
                        <Field label="Save % Label" full>
                          <input style={inputStyle}
                            value={(form.packages?.[1]?.savePct ?? '')}
                            onChange={e => {
                              const newPackages = [...(form.packages ?? [])];
                              newPackages[1] = { ...newPackages[1], savePct: e.target.value };
                              setField('packages', newPackages);
                            }} placeholder="Save 20%" />
                        </Field>
                        <div style={{ gridColumn: '1 / -1' }}>
                          <label style={labelStyle}>Package Images (up to 5)</label>
                          {(packageImages['15days'] ?? []).length > 0 && (
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 10 }}>
                              {(packageImages['15days'] ?? []).map((entry, idx) => (
                                <div key={idx} style={{ position: 'relative', width: 80, height: 80, borderRadius: 8, overflow: 'hidden', border: '2px solid #d1d5db', background: '#f9fafb', flexShrink: 0 }}>
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img src={entry.preview} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                                  {!entry.uploading && (
                                    <button type="button" onClick={() => removePackageImage('15days', idx)}
                                      style={{ position: 'absolute', top: 2, right: 2, width: 18, height: 18, borderRadius: '50%', background: 'rgba(0,0,0,0.6)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}>
                                      <X size={10} color="#fff" />
                                    </button>
                                  )}
                                </div>
                              ))}
                              {(packageImages['15days'] ?? []).length < 5 && (
                                <label style={{ width: 80, height: 80, borderRadius: 8, border: '2px dashed #d1d5db', background: '#f9fafb', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', gap: 4, flexShrink: 0 }}>
                                  <ImagePlus size={18} color="#9ca3af" />
                                  <input type="file" accept="image/*" multiple style={{ display: 'none' }}
                                    onChange={e => handlePackageImageFiles('15days', e.target.files)} />
                                </label>
                              )}
                            </div>
                          )}
                          {(packageImages['15days'] ?? []).length === 0 && (
                            <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '16px', border: '2px dashed #d1d5db', borderRadius: 8, cursor: 'pointer', background: '#fafafa' }}>
                              <ImagePlus size={24} color="#9ca3af" />
                              <span style={{ fontSize: 12, color: '#6b7280' }}>Click to upload</span>
                              <input type="file" accept="image/*" multiple style={{ display: 'none' }}
                                onChange={e => handlePackageImageFiles('15days', e.target.files)} />
                            </label>
                          )}
                        </div>
                        
                        {/* Stock */}
                        <Field label="Stock">
                          <input style={inputStyle} type="number" min={0}
                            value={(form.packages?.[1]?.stock ?? '')}
                            onChange={e => {
                              const newPackages = [...(form.packages ?? [])];
                              newPackages[1] = { ...newPackages[1], stock: parseInt(e.target.value) || 0 };
                              setField('packages', newPackages);
                            }} placeholder="100" />
                        </Field>

                        {/* Tag & Subtitle */}
                        <Field label="Tag">
                          <input style={inputStyle}
                            value={(form.packages?.[1]?.tag ?? '')}
                            onChange={e => {
                              const newPackages = [...(form.packages ?? [])];
                              newPackages[1] = { ...newPackages[1], tag: e.target.value };
                              setField('packages', newPackages);
                            }} placeholder="Trial · 15 Pouches" />
                        </Field>
                        <Field label="Subtitle">
                          <input style={inputStyle}
                            value={(form.packages?.[1]?.subtitle ?? '')}
                            onChange={e => {
                              const newPackages = [...(form.packages ?? [])];
                              newPackages[1] = { ...newPackages[1], subtitle: e.target.value };
                              setField('packages', newPackages);
                            }} placeholder="Your 15-day intro to nutrition." />
                        </Field>

                        {/* Marketing Copy */}
                        <Field label="Headline" full>
                          <input style={inputStyle}
                            value={(form.packages?.[1]?.headline ?? '')}
                            onChange={e => {
                              const newPackages = [...(form.packages ?? [])];
                              newPackages[1] = { ...newPackages[1], headline: e.target.value };
                              setField('packages', newPackages);
                            }} placeholder="The Next Level." />
                        </Field>
                        <Field label="Accent Word">
                          <input style={inputStyle}
                            value={(form.packages?.[1]?.accentWord ?? '')}
                            onChange={e => {
                              const newPackages = [...(form.packages ?? [])];
                              newPackages[1] = { ...newPackages[1], accentWord: e.target.value };
                              setField('packages', newPackages);
                            }} placeholder="Double Down." />
                        </Field>
                        <Field label="Gray Word">
                          <input style={inputStyle}
                            value={(form.packages?.[1]?.grayWord ?? '')}
                            onChange={e => {
                              const newPackages = [...(form.packages ?? [])];
                              newPackages[1] = { ...newPackages[1], grayWord: e.target.value };
                              setField('packages', newPackages);
                            }} placeholder="Build momentum." />
                        </Field>
                        <Field label="Persuade">
                          <input style={inputStyle}
                            value={(form.packages?.[1]?.persuade ?? '')}
                            onChange={e => {
                              const newPackages = [...(form.packages ?? [])];
                              newPackages[1] = { ...newPackages[1], persuade: e.target.value };
                              setField('packages', newPackages);
                            }} placeholder="Worth sharing." />
                        </Field>
                        <Field label="Tagline">
                          <input style={inputStyle}
                            value={(form.packages?.[1]?.tagline ?? '')}
                            onChange={e => {
                              const newPackages = [...(form.packages ?? [])];
                              newPackages[1] = { ...newPackages[1], tagline: e.target.value };
                              setField('packages', newPackages);
                            }} placeholder="The habit that sticks." />
                        </Field>
                        <Field label="Highlight">
                          <input style={inputStyle}
                            value={(form.packages?.[1]?.highlight ?? '')}
                            onChange={e => {
                              const newPackages = [...(form.packages ?? [])];
                              newPackages[1] = { ...newPackages[1], highlight: e.target.value };
                              setField('packages', newPackages);
                            }} placeholder="See real results in 2 weeks." />
                        </Field>

                        {/* Benefits */}
                        <Field label="Benefits" full>
                          <StringArrayInput
                            items={form.packages?.[1]?.benefits ?? []}
                            onUpdate={items => {
                              const newPackages = [...(form.packages ?? [])];
                              newPackages[1] = { ...newPackages[1], benefits: items };
                              setField('packages', newPackages);
                            }}
                            placeholder="Type benefit and press Enter..."
                          />
                        </Field>

                        {/* Badges */}
                        <Field label="Badges" full>
                          <StringArrayInput
                            items={form.packages?.[1]?.badges ?? []}
                            onUpdate={items => {
                              const newPackages = [...(form.packages ?? [])];
                              newPackages[1] = { ...newPackages[1], badges: items };
                              setField('packages', newPackages);
                            }}
                            placeholder="Type badge and press Enter..."
                          />
                        </Field>

                        {/* Variants */}
                        <Field label="Variants" full>
                          <VariantArrayInput
                            items={form.packages?.[1]?.variants ?? []}
                            onUpdate={items => {
                              const newPackages = [...(form.packages ?? [])];
                              newPackages[1] = { ...newPackages[1], variants: items };
                              setField('packages', newPackages);
                            }}
                          />
                        </Field>

                        {/* Nutrients */}
                        <Field label="Nutrients" full>
                          <NutrientArrayInput
                            items={form.packages?.[1]?.nutrients ?? []}
                            onUpdate={items => {
                              const newPackages = [...(form.packages ?? [])];
                              newPackages[1] = { ...newPackages[1], nutrients: items };
                              setField('packages', newPackages);
                            }}
                          />
                        </Field>
                      </div>
                    )}
                  </div>

                  {/* 30 Days Package */}
                  <div style={{ gridColumn: '1 / -1' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                      <input type="checkbox" id="pkg30" checked={checkedPackages['30days']}
                        onChange={e => setCheckedPackages(prev => ({ ...prev, '30days': e.target.checked }))}
                        style={{ width: 18, height: 18, cursor: 'pointer' }} />
                      <label htmlFor="pkg30" style={{ ...labelStyle, margin: 0, cursor: 'pointer', fontWeight: 600 }}>30 Days Sachet (30 pouches)</label>
                    </div>
                    {checkedPackages['30days'] && (
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                        <Field label="Price (₹)">
                          <input style={inputStyle} type="number" min={0}
                            value={(form.packages?.[2]?.price ?? '')}
                            onChange={e => {
                              const newPackages = [...(form.packages ?? [])];
                              newPackages[2] = { ...newPackages[2], price: parseFloat(e.target.value) || 0 };
                              setField('packages', newPackages);
                            }} placeholder="3599" />
                        </Field>
                        <Field label="Original Price (₹)">
                          <input style={inputStyle} type="number" min={0}
                            value={(form.packages?.[2]?.origPrice ?? '')}
                            onChange={e => {
                              const newPackages = [...(form.packages ?? [])];
                              newPackages[2] = { ...newPackages[2], origPrice: parseFloat(e.target.value) || 0 };
                              setField('packages', newPackages);
                            }} placeholder="4799" />
                        </Field>
                        <Field label="Save % Label" full>
                          <input style={inputStyle}
                            value={(form.packages?.[2]?.savePct ?? '')}
                            onChange={e => {
                              const newPackages = [...(form.packages ?? [])];
                              newPackages[2] = { ...newPackages[2], savePct: e.target.value };
                              setField('packages', newPackages);
                            }} placeholder="Save 25%" />
                        </Field>
                        <div style={{ gridColumn: '1 / -1' }}>
                          <label style={labelStyle}>Package Images (up to 5)</label>
                          {(packageImages['30days'] ?? []).length > 0 && (
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 10 }}>
                              {(packageImages['30days'] ?? []).map((entry, idx) => (
                                <div key={idx} style={{ position: 'relative', width: 80, height: 80, borderRadius: 8, overflow: 'hidden', border: '2px solid #d1d5db', background: '#f9fafb', flexShrink: 0 }}>
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img src={entry.preview} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                                  {!entry.uploading && (
                                    <button type="button" onClick={() => removePackageImage('30days', idx)}
                                      style={{ position: 'absolute', top: 2, right: 2, width: 18, height: 18, borderRadius: '50%', background: 'rgba(0,0,0,0.6)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}>
                                      <X size={10} color="#fff" />
                                    </button>
                                  )}
                                </div>
                              ))}
                              {(packageImages['30days'] ?? []).length < 5 && (
                                <label style={{ width: 80, height: 80, borderRadius: 8, border: '2px dashed #d1d5db', background: '#f9fafb', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', gap: 4, flexShrink: 0 }}>
                                  <ImagePlus size={18} color="#9ca3af" />
                                  <input type="file" accept="image/*" multiple style={{ display: 'none' }}
                                    onChange={e => handlePackageImageFiles('30days', e.target.files)} />
                                </label>
                              )}
                            </div>
                          )}
                          {(packageImages['30days'] ?? []).length === 0 && (
                            <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '16px', border: '2px dashed #d1d5db', borderRadius: 8, cursor: 'pointer', background: '#fafafa' }}>
                              <ImagePlus size={24} color="#9ca3af" />
                              <span style={{ fontSize: 12, color: '#6b7280' }}>Click to upload</span>
                              <input type="file" accept="image/*" multiple style={{ display: 'none' }}
                                onChange={e => handlePackageImageFiles('30days', e.target.files)} />
                            </label>
                          )}
                        </div>
                        
                        {/* Stock */}
                        <Field label="Stock">
                          <input style={inputStyle} type="number" min={0}
                            value={(form.packages?.[2]?.stock ?? '')}
                            onChange={e => {
                              const newPackages = [...(form.packages ?? [])];
                              newPackages[2] = { ...newPackages[2], stock: parseInt(e.target.value) || 0 };
                              setField('packages', newPackages);
                            }} placeholder="100" />
                        </Field>

                        {/* Tag & Subtitle */}
                        <Field label="Tag">
                          <input style={inputStyle}
                            value={(form.packages?.[2]?.tag ?? '')}
                            onChange={e => {
                              const newPackages = [...(form.packages ?? [])];
                              newPackages[2] = { ...newPackages[2], tag: e.target.value };
                              setField('packages', newPackages);
                            }} placeholder="The Full Month" />
                        </Field>
                        <Field label="Subtitle">
                          <input style={inputStyle}
                            value={(form.packages?.[2]?.subtitle ?? '')}
                            onChange={e => {
                              const newPackages = [...(form.packages ?? [])];
                              newPackages[2] = { ...newPackages[2], subtitle: e.target.value };
                              setField('packages', newPackages);
                            }} placeholder="Your complete 30-day transformation." />
                        </Field>

                        {/* Marketing Copy */}
                        <Field label="Headline" full>
                          <input style={inputStyle}
                            value={(form.packages?.[2]?.headline ?? '')}
                            onChange={e => {
                              const newPackages = [...(form.packages ?? [])];
                              newPackages[2] = { ...newPackages[2], headline: e.target.value };
                              setField('packages', newPackages);
                            }} placeholder="The Transformation." />
                        </Field>
                        <Field label="Accent Word">
                          <input style={inputStyle}
                            value={(form.packages?.[2]?.accentWord ?? '')}
                            onChange={e => {
                              const newPackages = [...(form.packages ?? [])];
                              newPackages[2] = { ...newPackages[2], accentWord: e.target.value };
                              setField('packages', newPackages);
                            }} placeholder="Go All In." />
                        </Field>
                        <Field label="Gray Word">
                          <input style={inputStyle}
                            value={(form.packages?.[2]?.grayWord ?? '')}
                            onChange={e => {
                              const newPackages = [...(form.packages ?? [])];
                              newPackages[2] = { ...newPackages[2], grayWord: e.target.value };
                              setField('packages', newPackages);
                            }} placeholder="See it through." />
                        </Field>
                        <Field label="Persuade">
                          <input style={inputStyle}
                            value={(form.packages?.[2]?.persuade ?? '')}
                            onChange={e => {
                              const newPackages = [...(form.packages ?? [])];
                              newPackages[2] = { ...newPackages[2], persuade: e.target.value };
                              setField('packages', newPackages);
                            }} placeholder="This is your month." />
                        </Field>
                        <Field label="Tagline">
                          <input style={inputStyle}
                            value={(form.packages?.[2]?.tagline ?? '')}
                            onChange={e => {
                              const newPackages = [...(form.packages ?? [])];
                              newPackages[2] = { ...newPackages[2], tagline: e.target.value };
                              setField('packages', newPackages);
                            }} placeholder="One month. Life changes." />
                        </Field>
                        <Field label="Highlight">
                          <input style={inputStyle}
                            value={(form.packages?.[2]?.highlight ?? '')}
                            onChange={e => {
                              const newPackages = [...(form.packages ?? [])];
                              newPackages[2] = { ...newPackages[2], highlight: e.target.value };
                              setField('packages', newPackages);
                            }} placeholder="Most people don't look back after 30 days." />
                        </Field>

                        {/* Benefits */}
                        <Field label="Benefits" full>
                          <StringArrayInput
                            items={form.packages?.[2]?.benefits ?? []}
                            onUpdate={items => {
                              const newPackages = [...(form.packages ?? [])];
                              newPackages[2] = { ...newPackages[2], benefits: items };
                              setField('packages', newPackages);
                            }}
                            placeholder="Type benefit and press Enter..."
                          />
                        </Field>

                        {/* Badges */}
                        <Field label="Badges" full>
                          <StringArrayInput
                            items={form.packages?.[2]?.badges ?? []}
                            onUpdate={items => {
                              const newPackages = [...(form.packages ?? [])];
                              newPackages[2] = { ...newPackages[2], badges: items };
                              setField('packages', newPackages);
                            }}
                            placeholder="Type badge and press Enter..."
                          />
                        </Field>

                        {/* Variants */}
                        <Field label="Variants" full>
                          <VariantArrayInput
                            items={form.packages?.[2]?.variants ?? []}
                            onUpdate={items => {
                              const newPackages = [...(form.packages ?? [])];
                              newPackages[2] = { ...newPackages[2], variants: items };
                              setField('packages', newPackages);
                            }}
                          />
                        </Field>

                        {/* Nutrients */}
                        <Field label="Nutrients" full>
                          <NutrientArrayInput
                            items={form.packages?.[2]?.nutrients ?? []}
                            onUpdate={items => {
                              const newPackages = [...(form.packages ?? [])];
                              newPackages[2] = { ...newPackages[2], nutrients: items };
                              setField('packages', newPackages);
                            }}
                          />
                        </Field>
                      </div>
                    )}
                  </div>
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
                          // Images are now per-package, handled in packages array
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
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Category</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Packages</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <td className="px-6 py-3 text-sm font-medium text-gray-900 dark:text-white">{product.id}</td>
                  <td className="px-6 py-3 text-sm text-gray-600 dark:text-gray-400">
                    <div style={{ fontWeight: 600, color: '#111827' }}>{product.name}</div>
                    {product.category && <div style={{ fontSize: 11, color: '#6b7280', marginTop: 2 }}>{product.category}</div>}
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-600 dark:text-gray-400">{product.category || '—'}</td>
                  <td className="px-6 py-3 text-sm text-gray-600 dark:text-gray-400">
                    {(product.packages?.length ?? 0) > 0 ? `${product.packages?.length} packages` : '—'}
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

