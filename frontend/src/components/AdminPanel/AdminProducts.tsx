'use client';

import {
  useEffect,
  useState,
  useCallback,
  memo,
  useRef,
} from 'react';
import {
  Plus,
  X,
  ChevronDown,
  ChevronUp,
  Pencil,
  Trash2,
  Copy,
  Download,
  Check,
  ImagePlus,
  Search,
  Package,
  Tag,
  RefreshCw,
} from 'lucide-react';
import NextImage from 'next/image';
import { adminAPI, Product, ProductPackage } from '@/lib/api';

/* ─── Types ─────────────────────────────────────────────── */
type FormData = Omit<Product, 'id'>;
type Variant  = { id: string; name: string; color: string; image: string };
type Nutrient = { label: string; amount?: string; friendly?: string; emoji?: string };
type ImageEntry = { preview: string; url?: string; uploading: boolean; error?: string };
type PackageId  = '7days' | '15days' | '30days';

/* ─── Constants ─────────────────────────────────────────── */
const PACKAGE_DEFS = [
  { id: '7days', duration: '7 days', daysCount: 7, pouches: 7 },
  { id: '15days', duration: '15 days', daysCount: 15, pouches: 15 },
  { id: '30days', duration: '30 days', daysCount: 30, pouches: 30 },
] as { id: PackageId; duration: '7 days' | '15 days' | '30 days'; daysCount: 7 | 15 | 30; pouches: number }[];

const makeEmptyPkg = (def: typeof PACKAGE_DEFS[0]): ProductPackage => ({
  id: def.id, duration: def.duration, daysCount: def.daysCount, pouches: def.pouches,
  price: 0, origPrice: 0, savePct: '', images: [], stock: 0,
  tag: '', subtitle: '', headline: '', accentWord: '', grayWord: '',
  persuade: '', tagline: '', highlight: '',
  benefits: [], badges: [], variants: [], nutrients: [],
});

const EMPTY_FORM: FormData = {
  name: '', description: '', category: '',
  packages: PACKAGE_DEFS.map(makeEmptyPkg),
  rating: undefined, reviews: undefined,
};

const PRODUCT_TEMPLATE = {
  name: 'PlainFuel Starter Pack',
  description: 'Complete daily nutrition in convenient pouches.',
  category: 'Starter Pack',
  packages: PACKAGE_DEFS.map((def, i) => ({
    ...makeEmptyPkg(def),
    price:     [999,  1999, 3499][i],
    origPrice: [1299, 2599, 4599][i],
    savePct:   ['Save 23%', 'Save 23%', 'Save 24%'][i],
    stock:     [150,  120,  100][i],
    tag:       ['Trial Pack', 'Best Value', 'Monthly Supply'][i],
    headline:  ['The Beginning.', 'The Consistent Choice.', 'The Long Game.'][i],
    images:    ['/uploads/products/brownpack.png'],
    benefits:  ['Lab tested', 'No artificial colours', 'Vegan friendly'],
    badges:    [`${def.duration} Pack`, 'Free Delivery'],
    variants:  [{ id: 'original', name: 'Original', color: '#d4a574', image: '/images/Products/brownpack.png' }],
    nutrients: [
      { label: 'Vitamin C', amount: '80mg', friendly: 'Immunity shield', emoji: '🍊' },
      { label: 'Zinc',      amount: '11mg', friendly: 'Energy boost',     emoji: '⚡' },
    ],
  })),
};

/* ─── Shared input styles (dark theme) ──────────────────── */
const inp: React.CSSProperties = {
  width: '100%', padding: '8px 11px', borderRadius: 8,
  border: '1px solid rgba(255,255,255,0.1)',
  background: '#0f172a', color: '#e5e7eb',
  fontSize: 13, outline: 'none', boxSizing: 'border-box',
  fontFamily: "'DM Sans',sans-serif",
};
const lbl: React.CSSProperties = {
  display: 'block', fontSize: 11, fontWeight: 700,
  color: '#6b7280', textTransform: 'uppercase',
  letterSpacing: '0.06em', marginBottom: 5,
};

/* ─── Reusable sub-components ───────────────────────────── */
const Section = memo(({
  id, title, badge, isExpanded, onToggle, children,
}: {
  id: string; title: string; badge?: string;
  isExpanded: boolean; onToggle: (id: string) => void;
  children: React.ReactNode;
}) => (
  <div style={{ marginBottom: 14 }}>
    <button
      type="button"
      onClick={() => onToggle(id)}
      style={{
        width: '100%', display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', padding: '10px 14px',
        background: '#0f172a', borderRadius: 9,
        border: '1px solid rgba(255,255,255,0.07)',
        cursor: 'pointer', marginBottom: isExpanded ? 10 : 0,
        fontWeight: 700, fontSize: 13, color: '#e5e7eb',
        fontFamily: "'DM Sans',sans-serif",
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {title}
        {badge && (
          <span style={{
            fontSize: 10, fontWeight: 700, color: '#4ade80',
            background: 'rgba(74,222,128,0.12)',
            padding: '2px 7px', borderRadius: 10,
          }}>
            {badge}
          </span>
        )}
      </div>
      {isExpanded ? <ChevronUp size={15} color="#6b7280" /> : <ChevronDown size={15} color="#6b7280" />}
    </button>
    {isExpanded && (
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '10px 14px', padding: '2px 2px',
      }}>
        {children}
      </div>
    )}
  </div>
));
Section.displayName = 'Section';

const Field = memo(({ label, full, children }: {
  label: string; full?: boolean; children: React.ReactNode;
}) => (
  <div style={{ gridColumn: full ? '1 / -1' : undefined }}>
    <label style={lbl}>{label}</label>
    {children}
  </div>
));
Field.displayName = 'Field';

/* ─── String tag input (benefits / badges) ──────────────── */
function TagInput({ items, onUpdate, placeholder }: {
  items: string[]; onUpdate: (v: string[]) => void; placeholder: string;
}) {
  const [val, setVal] = useState('');
  const add = () => {
    const trimmed = val.trim();
    if (trimmed) { onUpdate([...items, trimmed]); setVal(''); }
  };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
      <div style={{ display: 'flex', gap: 6 }}>
        <input
          style={{ ...inp, flex: 1 }}
          value={val}
          onChange={e => setVal(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); add(); } }}
          placeholder={placeholder}
        />
        <button
          type="button" onClick={add}
          style={{
            padding: '8px 13px', background: '#15803d', color: '#fff',
            border: 'none', borderRadius: 8, fontSize: 12,
            fontWeight: 700, cursor: 'pointer', flexShrink: 0,
          }}
        >+ Add</button>
      </div>
      {items.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
          {items.map((item, idx) => (
            <span key={idx} style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.25)',
              borderRadius: 6, padding: '4px 9px', fontSize: 12, color: '#4ade80',
            }}>
              {item}
              <button
                type="button"
                onClick={() => onUpdate(items.filter((_, i) => i !== idx))}
                style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', padding: 0, lineHeight: 1 }}
              >×</button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Variant input ──────────────────────────────────────── */
function VariantInput({ items, onUpdate }: {
  items: Variant[]; onUpdate: (v: Variant[]) => void;
}) {
  const [form, setForm] = useState<Variant>({ id: '', name: '', color: '#d4a574', image: '' });
  const add = () => {
    if (form.id && form.name) { onUpdate([...items, form]); setForm({ id: '', name: '', color: '#d4a574', image: '' }); }
  };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        <input style={inp} value={form.id}    onChange={e => setForm(f => ({ ...f, id:    e.target.value }))} placeholder="ID (e.g. original)" />
        <input style={inp} value={form.name}  onChange={e => setForm(f => ({ ...f, name:  e.target.value }))} placeholder="Name (e.g. Original)" />
        <input style={inp} value={form.image} onChange={e => setForm(f => ({ ...f, image: e.target.value }))} placeholder="Image URL" />
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <input type="color" style={{ ...inp, padding: 4, width: 44, cursor: 'pointer' }} value={form.color} onChange={e => setForm(f => ({ ...f, color: e.target.value }))} />
          <span style={{ fontSize: 12, color: '#6b7280' }}>{form.color}</span>
        </div>
      </div>
      <button
        type="button" onClick={add}
        style={{ padding: '8px 14px', background: '#15803d', color: '#fff', border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer', alignSelf: 'flex-start' }}
      >+ Add Variant</button>
      {items.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {items.map((v, idx) => (
            <div key={idx} style={{
              background: '#0f172a', border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 8, padding: '8px 12px',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 20, height: 20, borderRadius: 4, background: v.color, border: '1px solid rgba(255,255,255,0.1)' }} />
                <span style={{ fontSize: 12, fontWeight: 600, color: '#e5e7eb' }}>{v.name}</span>
                <span style={{ fontSize: 11, color: '#4b5563' }}>{v.id}</span>
              </div>
              <button type="button" onClick={() => onUpdate(items.filter((_, i) => i !== idx))}
                style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', fontSize: 16 }}>×</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Nutrient input ─────────────────────────────────────── */
function NutrientInput({ items, onUpdate }: {
  items: Nutrient[]; onUpdate: (v: Nutrient[]) => void;
}) {
  const [form, setForm] = useState<Nutrient>({ label: '', amount: '', friendly: '', emoji: '' });
  const add = () => {
    if (form.label && form.amount) { onUpdate([...items, form]); setForm({ label: '', amount: '', friendly: '', emoji: '' }); }
  };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        <input style={inp} value={form.label}    onChange={e => setForm(f => ({ ...f, label:    e.target.value }))} placeholder="Nutrient (Vitamin C)" />
        <input style={inp} value={form.amount}   onChange={e => setForm(f => ({ ...f, amount:   e.target.value }))} placeholder="Amount (80mg)" />
        <input style={inp} value={form.friendly} onChange={e => setForm(f => ({ ...f, friendly: e.target.value }))} placeholder="Friendly name" />
        <input style={inp} value={form.emoji}    onChange={e => setForm(f => ({ ...f, emoji:    e.target.value }))} placeholder="Emoji 🍊" maxLength={2} />
      </div>
      <button
        type="button" onClick={add}
        style={{ padding: '8px 14px', background: '#15803d', color: '#fff', border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer', alignSelf: 'flex-start' }}
      >+ Add Nutrient</button>
      {items.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {items.map((n, idx) => (
            <div key={idx} style={{
              background: '#0f172a', border: '1px solid rgba(245,158,11,0.2)',
              borderRadius: 8, padding: '8px 12px',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <div style={{ fontSize: 12 }}>
                <span style={{ fontWeight: 700, color: '#f59e0b' }}>{n.emoji} {n.label}</span>
                <span style={{ color: '#6b7280', marginLeft: 8 }}>{n.amount} · {n.friendly}</span>
              </div>
              <button type="button" onClick={() => onUpdate(items.filter((_, i) => i !== idx))}
                style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', fontSize: 16 }}>×</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Package image uploader ─────────────────────────────── */
function compressImage(file: File, targetKB = 500): Promise<Blob> {
  return new Promise((resolve, reject) => {
    // If it's a GIF or SVG, don't compress (keep original)
    if (file.type === 'image/gif' || file.type === 'image/svg+xml') {
      return resolve(file);
    }

    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const canvas = document.createElement('canvas');
      let { width, height } = img;
      
      const MAX = 2000;
      if (width > MAX || height > MAX) {
        if (width > height) { height = Math.round((height / width) * MAX); width = MAX; }
        else { width = Math.round((width / height) * MAX); height = MAX; }
      }
      
      canvas.width = width; 
      canvas.height = height;
      const ctx = canvas.getContext('2d')!;
      
      // For PNGs, we want to preserve transparency
      const isPNG = file.type === 'image/png';
      const isWebP = file.type === 'image/webp';
      
      // If not PNG/WebP, we might want a white background instead of black if it's going to be a JPG
      if (!isPNG && !isWebP) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, width, height);
      }
      
      ctx.drawImage(img, 0, 0, width, height);
      
      // Detect output format
      const outputType = (isPNG || isWebP) ? file.type : 'image/jpeg';
      
      const run = async () => {
        if (isPNG) {
          // PNG doesn't support quality setting in toBlob, just return as is
          canvas.toBlob(b => resolve(b!), 'image/png');
        } else {
          let lo = 0.1, hi = 0.95;
          let best: Blob | null = null;
          for (let i = 0; i < 8; i++) {
            const mid = (lo + hi) / 2;
            const blob: Blob = await new Promise(res => canvas.toBlob(b => res(b!), outputType, mid));
            best = blob;
            if (blob.size < targetKB * 1024) lo = mid; else hi = mid;
            if (Math.abs(blob.size - targetKB * 1024) < 10240) break;
          }
          resolve(best!);
        }
      };
      run().catch(reject);
    };
    img.onerror = reject;
    img.src = url;
  });
}

function PkgImageUploader({
  pkgId, images, onUpload, onRemove,
}: {
  pkgId: string;
  images: ImageEntry[];
  onUpload: (pkgId: string, files: FileList) => void;
  onRemove: (pkgId: string, idx: number) => void;
}) {
  const canAdd = images.length < 5;
  return (
    <div>
      <label style={lbl}>Images (up to 5)</label>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {images.map((entry, idx) => (
          <div key={idx} style={{
            position: 'relative', width: 72, height: 72, borderRadius: 8,
            overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)',
            background: '#0f172a', flexShrink: 0,
          }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={entry.preview} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            {entry.uploading && (
              <div style={{
                position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <div style={{ width: 16, height: 16, border: '2px solid #4ade80', borderTopColor: 'transparent', borderRadius: '50%', animation: 'prodSpin 0.7s linear infinite' }} />
              </div>
            )}
            {!entry.uploading && (
              <button
                type="button"
                onClick={() => onRemove(pkgId, idx)}
                style={{
                  position: 'absolute', top: 3, right: 3,
                  width: 18, height: 18, borderRadius: '50%',
                  background: 'rgba(0,0,0,0.7)', border: 'none',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              ><X size={10} color="#fff" /></button>
            )}
          </div>
        ))}
        {canAdd && (
          <label style={{
            width: 72, height: 72, borderRadius: 8,
            border: '2px dashed rgba(255,255,255,0.12)',
            background: '#0f172a', display: 'flex',
            flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', cursor: 'pointer', gap: 4, flexShrink: 0,
          }}>
            <ImagePlus size={18} color="#4b5563" />
            <span style={{ fontSize: 10, color: '#4b5563' }}>Upload</span>
            <input
              type="file" accept="image/*" multiple style={{ display: 'none' }}
              onChange={e => { if (e.target.files) { onUpload(pkgId, e.target.files); e.target.value = ''; } }}
            />
          </label>
        )}
      </div>
    </div>
  );
}

/* ─── Package form panel ─────────────────────────────────── */
function PackagePanel({
  pkgIdx, pkg, expandedSections, onToggle, onChange, images, onUpload, onRemove,
}: {
  pkgIdx: number;
  pkg: ProductPackage;
  expandedSections: Record<string, boolean>;
  onToggle: (id: string) => void;
  onChange: (idx: number, updated: ProductPackage) => void;
  images: ImageEntry[];
  onUpload: (pkgId: string, files: FileList) => void;
  onRemove: (pkgId: string, idx: number) => void;
}) {
  const p = (key: keyof ProductPackage, val: unknown) =>
    onChange(pkgIdx, { ...pkg, [key]: val });

  const secId = (s: string) => `${pkg.id}-${s}`;

  return (
    <div style={{
      background: '#0f172a', border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: 12, padding: 16, marginBottom: 12,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
        <div style={{
          width: 32, height: 32, borderRadius: 8,
          background: 'rgba(74,222,128,0.12)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 13, fontWeight: 800, color: '#4ade80',
          fontFamily: "'Segoe UI', 'Roboto', sans-serif",
        }}>
          {pkg.daysCount}
        </div>
        <div>
          <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: '#f9fafb' }}>{pkg.duration} Package</p>
          <p style={{ margin: 0, fontSize: 11, color: '#6b7280' }}>{pkg.pouches} pouches</p>
        </div>
      </div>

      {/* Pricing */}
      <Section id={secId('price')} title="Pricing & Stock" isExpanded={expandedSections[secId('price')] ?? true} onToggle={onToggle}>
        <Field label="Price (₹)">
          <input style={inp} type="number" min={0} value={pkg.price ?? ''} onChange={e => p('price', parseFloat(e.target.value) || 0)} placeholder="999" />
        </Field>
        <Field label="Original Price (₹)">
          <input style={inp} type="number" min={0} value={pkg.origPrice ?? ''} onChange={e => p('origPrice', parseFloat(e.target.value) || 0)} placeholder="1299" />
        </Field>
        <Field label="Save % Label">
          <input style={inp} value={pkg.savePct ?? ''} onChange={e => p('savePct', e.target.value)} placeholder="Save 23%" />
        </Field>
        <Field label="Stock">
          <input style={inp} type="number" min={0} value={pkg.stock ?? ''} onChange={e => p('stock', parseInt(e.target.value) || 0)} placeholder="100" />
        </Field>
      </Section>

      {/* Images */}
      <div style={{ marginBottom: 14, gridColumn: '1/-1' }}>
        <PkgImageUploader pkgId={pkg.id} images={images} onUpload={onUpload} onRemove={onRemove} />
      </div>

      {/* Marketing copy */}
      <Section id={secId('copy')} title="Marketing Copy" isExpanded={expandedSections[secId('copy')] ?? false} onToggle={onToggle}>
        <Field label="Tag">
          <input style={inp} value={pkg.tag ?? ''} onChange={e => p('tag', e.target.value)} placeholder="Trial Pack" />
        </Field>
        <Field label="Subtitle">
          <input style={inp} value={pkg.subtitle ?? ''} onChange={e => p('subtitle', e.target.value)} placeholder="Perfect for trying" />
        </Field>
        <Field label="Headline" full>
          <input style={inp} value={pkg.headline ?? ''} onChange={e => p('headline', e.target.value)} placeholder="The Beginning." />
        </Field>
        <Field label="Accent Word">
          <input style={inp} value={pkg.accentWord ?? ''} onChange={e => p('accentWord', e.target.value)} placeholder="Just Start." />
        </Field>
        <Field label="Gray Word">
          <input style={inp} value={pkg.grayWord ?? ''} onChange={e => p('grayWord', e.target.value)} placeholder="Stay consistent." />
        </Field>
        <Field label="Persuade">
          <input style={inp} value={pkg.persuade ?? ''} onChange={e => p('persuade', e.target.value)} placeholder="Have it anywhere." />
        </Field>
        <Field label="Tagline" full>
          <input style={inp} value={pkg.tagline ?? ''} onChange={e => p('tagline', e.target.value)} placeholder="Drop it in your bag. Done." />
        </Field>
        <Field label="Highlight" full>
          <input style={inp} value={pkg.highlight ?? ''} onChange={e => p('highlight', e.target.value)} placeholder="Most people feel it in 3 days." />
        </Field>
      </Section>

      {/* Benefits & Badges */}
      <Section id={secId('benefits')} title="Benefits & Badges" isExpanded={expandedSections[secId('benefits')] ?? false} onToggle={onToggle}>
        <Field label="Benefits" full>
          <TagInput items={pkg.benefits ?? []} onUpdate={v => p('benefits', v)} placeholder="Lab tested…" />
        </Field>
        <Field label="Badges" full>
          <TagInput items={pkg.badges ?? []} onUpdate={v => p('badges', v)} placeholder="Free Delivery…" />
        </Field>
      </Section>

      {/* Variants & Nutrients */}
      <Section id={secId('variants')} title="Variants & Nutrients" isExpanded={expandedSections[secId('variants')] ?? false} onToggle={onToggle}>
        <Field label="Variants" full>
          <VariantInput items={pkg.variants ?? []} onUpdate={v => p('variants', v)} />
        </Field>
        <Field label="Nutrients" full>
          <NutrientInput items={pkg.nutrients ?? []} onUpdate={v => p('nutrients', v)} />
        </Field>
      </Section>
    </div>
  );
}

/* ─── Main component ─────────────────────────────────────── */
export default function AdminProducts() {
  const [products, setProducts]           = useState<Product[]>([]);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState('');
  const [search, setSearch]               = useState('');
  const [showForm, setShowForm]           = useState(false);
  const [editingId, setEditingId]         = useState<number | null>(null);
  const [submitting, setSubmitting]       = useState(false);
  const [formError, setFormError]         = useState('');
  const [copied, setCopied]               = useState(false);
  const [refreshing, setRefreshing]       = useState(false);

  const [form, setForm] = useState<FormData>({ ...EMPTY_FORM });
  const [checkedPackages, setCheckedPackages] = useState<Record<PackageId, boolean>>({
    '7days': true, '15days': true, '30days': true,
  });
  const [packageImages, setPackageImages] = useState<Record<string, ImageEntry[]>>({
    '7days': [], '15days': [], '30days': [],
  });
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

  const scrollRef = useRef<HTMLDivElement>(null);

  /* ─── Data fetching ──────────────────────────────────── */
  const fetchProducts = useCallback(async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      else setRefreshing(true);
      const data = await adminAPI.getProducts();
      setProducts(Array.isArray(data) ? data : []);
      setError('');
    } catch {
      setError('Failed to load products');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  /* ─── Section toggle ─────────────────────────────────── */
  const toggleSection = useCallback((id: string) =>
    setExpandedSections(prev => ({ ...prev, [id]: !prev[id] })), []);

  /* ─── Image handlers ─────────────────────────────────── */
  const handleUpload = useCallback(async (pkgId: string, files: FileList) => {
    const MAX = 5;
    const current = (packageImages[pkgId] ?? []).length;
    const slots = MAX - current;
    if (slots <= 0) { setFormError('Max 5 images per package'); return; }

    const picked = Array.from(files).slice(0, slots);
    const placeholders: ImageEntry[] = picked.map(f => ({
      preview: URL.createObjectURL(f), uploading: true,
    }));
    setPackageImages(prev => ({ ...prev, [pkgId]: [...(prev[pkgId] ?? []), ...placeholders] }));

    const fd = new FormData();
    for (const file of picked) {
      const blob = await compressImage(file);
      // Determine the correct extension based on the blob's type
      const ext = blob.type.split('/')[1] || 'jpg';
      const cleanName = file.name.replace(/\.[^.]+$/, '');
      fd.append('images', blob, `${cleanName}.${ext}`);
    }

    try {
      const res  = await fetch('/api/upload', { method: 'POST', body: fd });
      const json = await res.json() as { urls?: string[]; error?: string };
      if (!res.ok) throw new Error(json.error ?? 'Upload failed');
      const urls = json.urls ?? [];
      setPackageImages(prev => {
        const list = [...(prev[pkgId] ?? [])];
        urls.forEach((url, i) => { if (current + i < list.length) list[current + i] = { ...list[current + i], url, uploading: false }; });
        return { ...prev, [pkgId]: list };
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Upload failed';
      setPackageImages(prev => {
        const list = (prev[pkgId] ?? []).map((e, i) =>
          i >= current ? { ...e, uploading: false, error: msg } : e
        );
        return { ...prev, [pkgId]: list };
      });
      setFormError(msg);
    }
  }, [packageImages]);

  const handleRemove = useCallback((pkgId: string, idx: number) =>
    setPackageImages(prev => ({
      ...prev, [pkgId]: (prev[pkgId] ?? []).filter((_, i) => i !== idx),
    })), []);

  /* ─── Package field change ───────────────────────────── */
  const handlePackageChange = useCallback((pkgIdx: number, updated: ProductPackage) => {
    setForm(prev => {
      const pkgs = [...(prev.packages ?? [])];
      pkgs[pkgIdx] = updated;
      return { ...prev, packages: pkgs };
    });
  }, []);

  /* ─── Open forms ─────────────────────────────────────── */
  const openCreate = useCallback(() => {
    setForm({ ...EMPTY_FORM, packages: PACKAGE_DEFS.map(makeEmptyPkg) });
    setCheckedPackages({ '7days': true, '15days': true, '30days': true });
    setPackageImages({ '7days': [], '15days': [], '30days': [] });
    setExpandedSections({ basic: true });
    setEditingId(null);
    setFormError('');
    setShowForm(true);
    setTimeout(() => scrollRef.current?.scrollTo({ top: 0 }), 50);
  }, []);

  const openEdit = useCallback((product: Product) => {
    const pkgs = (product.packages as ProductPackage[]) ?? [];
    const checked: Record<PackageId, boolean> = { '7days': false, '15days': false, '30days': false };
    const images: Record<string, ImageEntry[]> = { '7days': [], '15days': [], '30days': [] };

    pkgs.forEach(pkg => {
      const id = pkg.id as PackageId;
      checked[id] = true;
      images[id] = (Array.isArray(pkg.images) ? pkg.images : []).map((url: string) => ({
        preview: url, url, uploading: false,
      }));
    });

    // Ensure all 3 package slots exist, falling back to empty
    const mergedPkgs = PACKAGE_DEFS.map(def => {
      const existing = pkgs.find(p => p.id === def.id);
      return existing ?? makeEmptyPkg(def);
    });

    setForm({
      name: product.name ?? '',
      description: product.description ?? '',
      category: product.category ?? '',
      packages: mergedPkgs,
      rating: product.rating,
      reviews: product.reviews,
    });
    setCheckedPackages(checked);
    setPackageImages(images);
    setExpandedSections({ basic: true, '7days-price': true, '15days-price': true, '30days-price': true });
    setEditingId(product.id);
    setFormError('');
    setShowForm(true);
    setTimeout(() => scrollRef.current?.scrollTo({ top: 0 }), 50);
  }, []);

  /* ─── Submit ─────────────────────────────────────────── */
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    const packages = (form.packages ?? [])
      .filter(pkg => checkedPackages[pkg.id as PackageId] ?? false)
      .map(pkg => ({
        ...pkg,
        images: (packageImages[pkg.id] ?? []).filter(img => img.url).map(img => img.url!),
      }));

    if (packages.length === 0) { setFormError('Select at least one package'); return; }

    const payload = {
      name:        form.name,
      description: form.description,
      category:    form.category,
      packages,
    };

    setSubmitting(true);
    try {
      if (editingId !== null) await adminAPI.updateProduct(editingId, payload);
      else await adminAPI.createProduct(payload);
      setShowForm(false);
      fetchProducts(true);
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : 'Failed to save product');
    } finally {
      setSubmitting(false);
    }
  }, [form, checkedPackages, packageImages, editingId, fetchProducts]);

  /* ─── Delete ─────────────────────────────────────────── */
  const handleDelete = useCallback(async (id: number) => {
    if (!confirm('Delete this product?')) return;
    try {
      await adminAPI.deleteProduct(id);
      fetchProducts(true);
    } catch {
      alert('Failed to delete product');
    }
  }, [fetchProducts]);

  /* ─── Copy / download template ───────────────────────── */
  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(JSON.stringify(PRODUCT_TEMPLATE, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, []);

  const handleDownload = useCallback(() => {
    const blob = new Blob([JSON.stringify(PRODUCT_TEMPLATE, null, 2)], { type: 'application/json' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url; a.download = 'product-template.json'; a.click();
    URL.revokeObjectURL(url);
  }, []);

  /* ─── Filtered list ──────────────────────────────────── */
  const filtered = search.trim()
    ? products.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        (p.category ?? '').toLowerCase().includes(search.toLowerCase()) ||
        String(p.id).includes(search)
      )
    : products;

  /* ─── Loading state ──────────────────────────────────── */
  if (loading) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 320, gap: 12 }}>
      <div style={{ width: 36, height: 36, border: '3px solid #1f2937', borderTopColor: '#4ade80', borderRadius: '50%', animation: 'prodSpin 0.8s linear infinite' }} />
      <p style={{ color: '#6b7280', fontSize: 13 }}>Loading products…</p>
      <style>{`@keyframes prodSpin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  /* ─── Render ─────────────────────────────────────────── */
  return (
    <div style={{ fontFamily: "'Segoe UI', 'Roboto', sans-serif", display: 'flex', flexDirection: 'column', gap: 16 }}>
      <style>{`
        @keyframes prodSpin     { to { transform: rotate(360deg); } }
        @keyframes prodSlideIn  { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }

        .prod-card {
          background: #111827;
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 12px;
          padding: 16px 18px;
          transition: border-color 0.2s, transform 0.15s;
          animation: prodSlideIn 0.3s ease forwards;
        }
        .prod-card:hover {
          border-color: rgba(74,222,128,0.2);
          transform: translateY(-1px);
        }

        .prod-inp-focus:focus { border-color: rgba(74,222,128,0.5) !important; }

        .pkg-checkbox-label {
          display: flex; align-items: center; gap: 10px;
          padding: 10px 14px; border-radius: 9px;
          border: 1px solid rgba(255,255,255,0.07);
          background: #111827; cursor: pointer;
          transition: border-color 0.15s;
        }
        .pkg-checkbox-label:hover { border-color: rgba(74,222,128,0.3); }
        .pkg-checkbox-label.checked { border-color: rgba(74,222,128,0.4); background: rgba(74,222,128,0.05); }

        .modal-scroll::-webkit-scrollbar { width: 5px; }
        .modal-scroll::-webkit-scrollbar-track { background: #0f172a; }
        .modal-scroll::-webkit-scrollbar-thumb { background: #1f2937; border-radius: 4px; }

        .prod-action-btn {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 6px 11px; border-radius: 7px; font-size: 12px;
          font-weight: 700; cursor: pointer; border: 1px solid;
          transition: opacity 0.15s; font-family: 'DM Sans',sans-serif;
        }
        .prod-action-btn:hover { opacity: 0.82; }

        @media (max-width: 640px) {
          .prod-hide-sm { display: none !important; }
        }
      `}</style>

      {/* ── Page header ── */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <p style={{ fontSize: 11, fontWeight: 700, color: '#4ade80', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 2 }}>Catalogue</p>
          <h2 style={{ fontFamily: "'Segoe UI', 'Roboto', sans-serif", fontSize: 'clamp(18px,3vw,24px)', fontWeight: 800, color: '#f9fafb', margin: 0 }}>
            Products
          </h2>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={() => fetchProducts(true)}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '8px 14px', background: '#1f2937',
              border: '1px solid rgba(255,255,255,0.08)', borderRadius: 9,
              color: '#9ca3af', fontSize: 12, fontWeight: 600, cursor: 'pointer',
            }}
          >
            <RefreshCw size={13} style={{ animation: refreshing ? 'prodSpin 0.8s linear infinite' : 'none' }} />
            Refresh
          </button>
          <button
            onClick={openCreate}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '8px 16px', background: '#15803d',
              border: 'none', borderRadius: 9,
              color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer',
            }}
          >
            <Plus size={15} /> Add Product
          </button>
        </div>
      </div>

      {/* ── Stats strip ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 10 }}>
        {[
          { label: 'Total Products', value: String(products.length), color: '#4ade80' },
          { label: 'Total Packages', value: String(products.reduce((s, p) => s + (p.packages?.length ?? 0), 0)), color: '#60a5fa' },
          { label: 'In Stock', value: String(products.filter(p => (p.packages ?? []).some((pkg: ProductPackage) => (pkg.stock ?? 0) > 0)).length), color: '#34d399' },
          { label: 'Out of Stock', value: String(products.filter(p => (p.packages ?? []).every((pkg: ProductPackage) => (pkg.stock ?? 0) === 0)).length), color: '#f87171' },
        ].map(stat => (
          <div key={stat.label} style={{
            background: '#111827', border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 11, padding: '13px 15px',
          }}>
            <p style={{ fontSize: 11, color: '#6b7280', marginBottom: 4 }}>{stat.label}</p>
            <p style={{ fontSize: 22, fontWeight: 800, color: stat.color, fontFamily: "'Segoe UI', 'Roboto', sans-serif", margin: 0 }}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* ── Search ── */}
      <div style={{ position: 'relative', maxWidth: 380 }}>
        <Search size={14} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: '#4b5563' }} />
        <input
          className="prod-inp-focus"
          style={{ ...inp, paddingLeft: 34 }}
          placeholder="Search by name, category, ID…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* ── Error ── */}
      {error && (
        <div style={{ padding: '10px 14px', background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.3)', borderRadius: 9, color: '#f87171', fontSize: 13 }}>
          {error}
        </div>
      )}

      {/* ── Product grid ── */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px 24px', background: '#111827', borderRadius: 14, border: '1px solid rgba(255,255,255,0.07)' }}>
          <Package size={36} style={{ color: '#374151', margin: '0 auto 12px' }} />
          <p style={{ color: '#6b7280', fontSize: 14, fontWeight: 600 }}>No products found</p>
          <p style={{ color: '#374151', fontSize: 12, marginTop: 4 }}>
            {search ? 'Try a different search term' : 'Add your first product above'}
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
          {filtered.map((product, i) => {
            const pkgs = (product.packages ?? []) as ProductPackage[];
            const totalStock = pkgs.reduce((s, p) => s + (p.stock ?? 0), 0);
            const minPrice = pkgs.length > 0 ? Math.min(...pkgs.map(p => p.price ?? 0)) : 0;
            const maxPrice = pkgs.length > 0 ? Math.max(...pkgs.map(p => p.price ?? 0)) : 0;
            const stockStatus = totalStock === 0 ? { label: 'Out of Stock', color: '#f87171' }
              : totalStock <= 20 ? { label: 'Low Stock', color: '#f59e0b' }
              : { label: 'In Stock', color: '#4ade80' };

            return (
              <div
                key={product.id}
                className="prod-card"
                style={{ animationDelay: `${i * 0.04}s`, opacity: 0, display: 'flex', flexDirection: 'column' }}
              >
                {/* Image Preview */}
                <div style={{ 
                  width: '100%', height: 160, background: '#0a0f1a', borderRadius: 9, 
                  marginBottom: 14, overflow: 'hidden', position: 'relative',
                  border: '1px solid rgba(255,255,255,0.04)'
                }}>
                  <NextImage 
                    src={pkgs[0]?.images?.[0] || '/images/product.png'} 
                    alt={product.name}
                    fill
                    unoptimized={true}
                    style={{ objectFit: 'contain', padding: 12, backgroundColor: 'transparent' }}
                  />
                  {pkgs.length > 1 && (
                    <div style={{ 
                      position: 'absolute', bottom: 8, right: 8, background: 'rgba(0,0,0,0.6)', 
                      backdropFilter: 'blur(4px)', padding: '2px 6px', borderRadius: 6, fontSize: 10,
                      color: '#fff', border: '1px solid rgba(255,255,255,0.1)'
                    }}>
                      +{pkgs.length - 1} variations
                    </div>
                  )}
                </div>

                {/* Card header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 4 }}>
                      <span style={{
                        fontSize: 10, fontWeight: 700, color: '#6b7280',
                        background: '#1f2937', padding: '2px 7px', borderRadius: 5,
                        fontFamily: 'monospace',
                      }}>#{product.id}</span>
                      {product.category && (
                        <span style={{
                          fontSize: 10, fontWeight: 700, color: '#60a5fa',
                          background: 'rgba(96,165,250,0.1)', padding: '2px 7px', borderRadius: 5,
                        }}>
                          <Tag size={8} style={{ display: 'inline', marginRight: 3 }} />
                          {product.category}
                        </span>
                      )}
                    </div>
                    <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#f9fafb', lineHeight: 1.3 }}>
                      {product.name}
                    </h3>
                  </div>
                  <span style={{
                    fontSize: 10, fontWeight: 700, color: stockStatus.color,
                    background: `${stockStatus.color}15`,
                    border: `1px solid ${stockStatus.color}30`,
                    padding: '3px 8px', borderRadius: 20, flexShrink: 0, marginLeft: 8,
                  }}>
                    {stockStatus.label}
                  </span>
                </div>

                {/* Description */}
                {product.description && (
                  <p style={{ fontSize: 12, color: '#6b7280', margin: '0 0 12px', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {product.description}
                  </p>
                )}

                {/* Package pills */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 12 }}>
                  {pkgs.map(pkg => (
                    <span key={pkg.id} style={{
                      fontSize: 11, fontWeight: 600, color: '#9ca3af',
                      background: '#1f2937', border: '1px solid rgba(255,255,255,0.08)',
                      padding: '3px 8px', borderRadius: 6,
                    }}>
                      {pkg.duration} · ₹{(pkg.price ?? 0).toLocaleString('en-IN')}
                    </span>
                  ))}
                </div>

                {/* Stats row */}
                <div style={{ display: 'flex', gap: 12, marginBottom: 14, paddingTop: 10, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  <div>
                    <p style={{ fontSize: 10, color: '#4b5563', margin: 0 }}>Price range</p>
                    <p style={{ fontSize: 13, fontWeight: 700, color: '#4ade80', margin: 0 }}>
                      ₹{minPrice.toLocaleString('en-IN')} – ₹{maxPrice.toLocaleString('en-IN')}
                    </p>
                  </div>
                  <div>
                    <p style={{ fontSize: 10, color: '#4b5563', margin: 0 }}>Total stock</p>
                    <p style={{ fontSize: 13, fontWeight: 700, color: stockStatus.color, margin: 0 }}>{totalStock} units</p>
                  </div>
                  <div>
                    <p style={{ fontSize: 10, color: '#4b5563', margin: 0 }}>Packages</p>
                    <p style={{ fontSize: 13, fontWeight: 700, color: '#9ca3af', margin: 0 }}>{pkgs.length}</p>
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    className="prod-action-btn"
                    onClick={() => openEdit(product)}
                    style={{ background: 'rgba(96,165,250,0.1)', color: '#60a5fa', borderColor: 'rgba(96,165,250,0.3)' }}
                  >
                    <Pencil size={12} /> Edit
                  </button>
                  <button
                    className="prod-action-btn"
                    onClick={() => handleDelete(product.id)}
                    style={{ background: 'rgba(248,113,113,0.1)', color: '#f87171', borderColor: 'rgba(248,113,113,0.3)' }}
                  >
                    <Trash2 size={12} /> Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Modal ── */}
      {showForm && (
        <div style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.75)',
          zIndex: 1000, display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          padding: 'clamp(12px,3vw,24px)',
        }}>
          <div style={{
            background: '#111827',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 16, width: '100%', maxWidth: 800,
            maxHeight: '90dvh', display: 'flex',
            flexDirection: 'column', boxShadow: '0 24px 80px rgba(0,0,0,0.6)',
          }}>

            {/* Modal header */}
            <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.07)', flexShrink: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div>
                  <p style={{ fontSize: 11, fontWeight: 700, color: '#4ade80', letterSpacing: '0.1em', textTransform: 'uppercase', margin: 0 }}>
                    {editingId !== null ? 'Editing Product' : 'New Product'}
                  </p>
                  <h3 style={{ fontFamily: "'Segoe UI', 'Roboto', sans-serif", fontSize: 18, fontWeight: 800, color: '#f9fafb', margin: '4px 0 0' }}>
                    {editingId !== null ? 'Update Product' : 'Add Product'}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  style={{ background: '#1f2937', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, padding: 8, cursor: 'pointer', color: '#9ca3af' }}
                >
                  <X size={18} />
                </button>
              </div>

              {/* Template bar */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap',
                padding: '10px 14px', background: 'rgba(74,222,128,0.06)',
                border: '1px solid rgba(74,222,128,0.2)', borderRadius: 9,
              }}>
                <div style={{ flex: 1, minWidth: 160 }}>
                  <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: '#4ade80' }}>Product JSON Template</p>
                  <p style={{ margin: 0, fontSize: 11, color: '#4b5563' }}>Copy or download the full template with all fields.</p>
                </div>
                <button
                  type="button" onClick={handleCopy}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 5,
                    padding: '6px 12px', borderRadius: 7, fontSize: 12, fontWeight: 700,
                    border: '1px solid rgba(74,222,128,0.3)',
                    background: copied ? 'rgba(74,222,128,0.15)' : '#1f2937',
                    color: copied ? '#4ade80' : '#9ca3af', cursor: 'pointer',
                  }}
                >
                  {copied ? <Check size={12} /> : <Copy size={12} />}
                  {copied ? 'Copied!' : 'Copy JSON'}
                </button>
                <button
                  type="button" onClick={handleDownload}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 5,
                    padding: '6px 12px', borderRadius: 7, fontSize: 12, fontWeight: 700,
                    border: 'none', background: '#15803d', color: '#fff', cursor: 'pointer',
                  }}
                >
                  <Download size={12} /> Download
                </button>
              </div>

              {formError && (
                <div style={{ marginTop: 12, padding: '9px 13px', background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.3)', borderRadius: 8, color: '#f87171', fontSize: 13 }}>
                  {formError}
                </div>
              )}
            </div>

            {/* Modal scrollable body */}
            <div ref={scrollRef} className="modal-scroll" style={{ overflowY: 'auto', flex: 1, padding: '20px 24px' }}>
              <form onSubmit={handleSubmit}>

                {/* Basic info */}
                <Section id="basic" title="Basic Information" isExpanded={expandedSections['basic'] ?? true} onToggle={toggleSection}>
                  <Field label="Product Name *" full>
                    <input
                      className="prod-inp-focus"
                      style={inp} required value={form.name}
                      onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="PlainFuel Starter Pack"
                    />
                  </Field>
                  <Field label="Description" full>
                    <textarea
                      className="prod-inp-focus"
                      style={{ ...inp, minHeight: 68, resize: 'vertical' }}
                      value={form.description ?? ''}
                      onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Complete daily nutrition…"
                    />
                  </Field>
                  <Field label="Category">
                    <input
                      className="prod-inp-focus"
                      style={inp} value={form.category ?? ''}
                      onChange={e => setForm(prev => ({ ...prev, category: e.target.value }))}
                      placeholder="Starter Pack"
                    />
                  </Field>
                </Section>

                {/* Package selection */}
                <div style={{ marginBottom: 14 }}>
                  <p style={{ ...lbl, marginBottom: 10 }}>Select Packages</p>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {PACKAGE_DEFS.map(def => (
                      <label
                        key={def.id}
                        className={`pkg-checkbox-label ${checkedPackages[def.id] ? 'checked' : ''}`}
                      >
                        <input
                          type="checkbox"
                          checked={checkedPackages[def.id]}
                          onChange={e => setCheckedPackages(prev => ({ ...prev, [def.id]: e.target.checked }))}
                          style={{ width: 15, height: 15, accentColor: '#4ade80' }}
                        />
                        <div>
                          <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: '#e5e7eb' }}>{def.duration}</p>
                          <p style={{ margin: 0, fontSize: 11, color: '#6b7280' }}>{def.pouches} pouches</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Per-package panels */}
                {PACKAGE_DEFS.map((def, pkgIdx) =>
                  checkedPackages[def.id] ? (
                    <PackagePanel
                      key={def.id}
                      pkgIdx={pkgIdx}
                      pkg={(form.packages ?? [])[pkgIdx] ?? makeEmptyPkg(def)}
                      expandedSections={expandedSections}
                      onToggle={toggleSection}
                      onChange={handlePackageChange}
                      images={packageImages[def.id] ?? []}
                      onUpload={handleUpload}
                      onRemove={handleRemove}
                    />
                  ) : null
                )}

                {/* Paste JSON */}
                <Section id="json" title="Paste JSON (optional)" isExpanded={expandedSections['json'] ?? false} onToggle={toggleSection}>
                  <Field label="Paste modified JSON template here" full>
                    <textarea
                      className="prod-inp-focus"
                      style={{ ...inp, minHeight: 110, fontFamily: 'monospace', fontSize: 12, resize: 'vertical' }}
                      placeholder="Paste your JSON and click outside to apply…"
                      onBlur={e => {
                        if (!e.target.value.trim()) return;
                        try {
                          const data = JSON.parse(e.target.value) as Partial<FormData>;
                          setForm(prev => ({ ...EMPTY_FORM, ...prev, ...data }));
                          setFormError('');
                          e.target.value = '';
                        } catch (err: unknown) {
                          setFormError(`Invalid JSON: ${err instanceof Error ? err.message : 'Parse error'}`);
                        }
                      }}
                    />
                  </Field>
                </Section>

              </form>
            </div>

            {/* Modal footer */}
            <div style={{
              padding: '16px 24px',
              borderTop: '1px solid rgba(255,255,255,0.07)',
              display: 'flex', justifyContent: 'flex-end', gap: 10, flexShrink: 0,
            }}>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                style={{
                  padding: '9px 20px', borderRadius: 9,
                  border: '1px solid rgba(255,255,255,0.1)',
                  background: '#1f2937', fontSize: 13,
                  cursor: 'pointer', color: '#9ca3af', fontWeight: 600,
                  fontFamily: "'DM Sans',sans-serif",
                }}
              >Cancel</button>
              <button
                type="submit"
                disabled={submitting}
                onClick={handleSubmit}
                style={{
                  padding: '9px 22px', borderRadius: 9, border: 'none',
                  background: submitting ? '#166534' : '#15803d',
                  color: '#fff', fontSize: 13, fontWeight: 700,
                  cursor: submitting ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', gap: 7,
                  fontFamily: "'DM Sans',sans-serif",
                }}
              >
                {submitting && (
                  <div style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'prodSpin 0.7s linear infinite' }} />
                )}
                {submitting ? 'Saving…' : editingId !== null ? 'Update Product' : 'Create Product'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}