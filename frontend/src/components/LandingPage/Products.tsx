'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { ShoppingCart, Check, Star, Minus, Plus, Truck, RotateCcw } from 'lucide-react';
import Navbar from '@/components/Navbar';

/* ── theme ── */
const FD = "'Playfair Display', Georgia, serif";
const FS = "'DM Sans', 'Helvetica Neue', sans-serif";
const G  = '#15803d';
const BG = '#fdfaf3';

/* ─── sketch filter (reused from landing page) ─── */
const SketchFilter = () => (
  <svg width="0" height="0" style={{ position: 'absolute' }}>
    <filter id="skProducts">
      <feTurbulence type="turbulence" baseFrequency="0.015" numOctaves="3" seed="2" />
      <feDisplacementMap in="SourceGraphic" scale="2.5" />
    </filter>
  </svg>
);

/* ─── doodle decorations ─── */
const Squiggle = ({ style = {} }: { style?: React.CSSProperties }) => (
  <svg viewBox="0 0 120 20" width={120} height={20} style={{ position: 'absolute', ...style }} aria-hidden>
    <path d="M2,10 Q15,2 30,10 Q45,18 60,10 Q75,2 90,10 Q105,18 118,10"
      fill="none" stroke={G} strokeWidth="2" strokeLinecap="round" opacity={0.15} />
  </svg>
);

const DoodleCircle = ({ size = 40, style = {} }: { size?: number; style?: React.CSSProperties }) => (
  <svg viewBox="0 0 50 50" width={size} height={size} style={{ position: 'absolute', ...style }} aria-hidden>
    <circle cx="25" cy="25" r="20" fill="none" stroke={G} strokeWidth="1.5" strokeDasharray="4 3" opacity={0.12} />
  </svg>
);

const DoodleStar = ({ size = 24, style = {} }: { size?: number; style?: React.CSSProperties }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} style={{ position: 'absolute', ...style }} aria-hidden>
    <path d="M12,2 L13.2,9 L20,9 L14.6,13.4 L16.6,20 L12,15.8 L7.4,20 L9.4,13.4 L4,9 L10.8,9 Z"
      fill="none" stroke={G} strokeWidth="1.5" strokeLinecap="round" opacity={0.15} />
  </svg>
);

/* ─── product data ─── */
interface ProductVariant {
  id: string;
  name: string;
  color: string;
  image: string;
}

interface ProductData {
  id: number;
  name: string;
  subtitle: string;
  description: string;
  rating: number;
  reviews: number;
  variants: ProductVariant[];
  oneTimePrice: number;
  subscribePrice: number;
  origPrice: number;
  tag: string;
  duration: string;
  benefits: string[];
  nutrients: { label: string; amount: string }[];
}

const PRODUCTS: ProductData[] = [
  {
    id: 0,
    name: 'PlainFuel Starter Pack',
    subtitle: 'Your 7-day introduction to complete nutrition.',
    description: 'One invisible scoop. 26 micronutrients. Drop it in your morning drink and forget about it — your body will remember.',
    rating: 4.8, reviews: 2847,
    variants: [
      { id: 'original', name: 'Original', color: '#d4a574', image: '/images/Products/brownpack.png' },
      { id: 'lime', name: 'Lime', color: '#84cc16', image: '/images/Products/limepack.png' },
      { id: 'orange', name: 'Orange', color: '#f97316', image: '/images/Products/orangepack.png' },
      { id: 'red', name: 'Berry', color: '#ef4444', image: '/images/Products/redpack.png' },
    ],
    oneTimePrice: 1500, subscribePrice: 1200, origPrice: 2000,
    tag: 'Trial · 7 Pouches', duration: '7 Days',
    benefits: ['Zero sugar', 'No artificial colours', 'Vegan friendly', 'Lab tested'],
    nutrients: [
      { label: 'Vitamin C', amount: '80mg' },
      { label: 'Zinc', amount: '11mg' },
      { label: 'Vitamin B12', amount: '2.4μg' },
      { label: 'Iron', amount: '18mg' },
    ],
  },
  {
    id: 1,
    name: 'PlainFuel Balanced',
    subtitle: 'The 15-day cycle for sustained energy.',
    description: 'Morning commute, late nights, post-gym? Your nutrition doesn\'t care about your schedule — but ours does.',
    rating: 4.9, reviews: 5213,
    variants: [
      { id: 'original', name: 'Original', color: '#d4a574', image: '/images/Products/Pack1.png' },
      { id: 'lime', name: 'Lime', color: '#84cc16', image: '/images/Products/limepack.png' },
      { id: 'orange', name: 'Orange', color: '#f97316', image: '/images/Products/orangepack.png' },
      { id: 'berry', name: 'Berry', color: '#ef4444', image: '/images/Products/redpack.png' },
    ],
    oneTimePrice: 2500, subscribePrice: 2100, origPrice: 3200,
    tag: 'Subscription · 15 Pouches', duration: '15 Days',
    benefits: ['Bioavailable formula', 'Gut-friendly', 'Priority shipping', 'Balanced nutrients'],
    nutrients: [
      { label: 'Omega-3', amount: '500mg' },
      { label: 'Magnesium', amount: '400mg' },
      { label: 'Vitamin D', amount: '600IU' },
      { label: 'Protein', amount: '20g' },
    ],
  },
  {
    id: 2,
    name: 'PlainFuel Monthly Protocol',
    subtitle: 'Full 30-day transformation cycle.',
    description: 'Real change needs commitment. 30 days of precision nutrition — gut, cells, performance. All of it.',
    rating: 4.9, reviews: 8941,
    variants: [
      { id: 'premium', name: 'Premium', color: '#15803d', image: '/images/Products/product_premium.png' },
      { id: 'original', name: 'Original', color: '#d4a574', image: '/images/Products/Pack2.png' },
      { id: 'bundle', name: 'Bundle', color: '#eab308', image: '/images/Products/insidebundle.png' },
    ],
    oneTimePrice: 4500, subscribePrice: 3900, origPrice: 6000,
    tag: 'Full Cycle · 30 Pouches', duration: '30 Days',
    benefits: ['Premium formula', 'Exclusive access', 'Free shipping', 'Full protocol'],
    nutrients: [
      { label: 'Vitamin C', amount: '160mg' },
      { label: 'Omega-3', amount: '1000mg' },
      { label: 'Probiotics', amount: '10B CFU' },
      { label: 'All 26 Micros', amount: '100% RDA' },
    ],
  },
];

/* ─── main component ─── */
export default function Products({ onNavigate }: { onNavigate?: (view: string) => void } = {}) {
  const [selectedProduct, setSelectedProduct] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [purchaseType, setPurchaseType] = useState<'onetime' | 'subscribe'>('onetime');
  const [quantity, setQuantity] = useState(1);

  const product = PRODUCTS[selectedProduct];
  const variant = product.variants[selectedVariant];

  const handleProductChange = (idx: number) => {
    setSelectedProduct(idx);
    setSelectedVariant(0);
    setQuantity(1);
  };

  const price = purchaseType === 'subscribe' ? product.subscribePrice : product.oneTimePrice;

  return (
    <div style={{ minHeight: '100vh', background: BG, fontFamily: FS, position: 'relative' }}>
      <Navbar onNavigate={onNavigate} />
      <SketchFilter />

      {/* ── Doodle decorations ── */}
      <Squiggle style={{ top: 40, left: '5%', opacity: 0.12 }} />
      <Squiggle style={{ bottom: 80, right: '3%', opacity: 0.1, transform: 'rotate(180deg)' }} />
      <DoodleCircle size={60} style={{ top: 120, right: '8%', opacity: 0.08 }} />
      <DoodleStar size={28} style={{ top: 200, left: '3%', opacity: 0.12 }} />
      <DoodleCircle size={35} style={{ bottom: 200, left: '6%', opacity: 0.08 }} />
      <DoodleStar size={22} style={{ bottom: 150, right: '5%', opacity: 0.1 }} />

      {/* ── Ruled lines (notebook feel) ── */}
      {Array.from({ length: 30 }, (_, i) => (
        <div key={i} style={{
          position: 'absolute', left: 0, right: 0, top: 60 + i * 40,
          height: 1, background: 'rgba(21,128,61,0.04)', pointerEvents: 'none',
        }} />
      ))}

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 24px', paddingTop: 120, position: 'relative', zIndex: 1 }}>
        {/* ─── Page header ─── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ textAlign: 'center', marginBottom: 48 }}
        >
          <h1 style={{ fontFamily: FD, fontSize: 'clamp(28px, 5vw, 42px)', fontWeight: 800, color: '#1a1a1a', margin: 0 }}>
            Our Products
          </h1>
          <p style={{ fontFamily: FS, fontSize: 'clamp(14px, 2vw, 16px)', color: '#666', marginTop: 8, maxWidth: 500, marginLeft: 'auto', marginRight: 'auto' }}>
            One invisible scoop. 26 micronutrients. Choose the plan that fits your life.
          </p>
          {/* Hand-drawn underline */}
          <svg viewBox="0 0 200 8" width={160} height={8} style={{ margin: '12px auto 0', display: 'block' }}>
            <path d="M5,5 Q50,1 100,5 Q150,9 195,4" fill="none" stroke={G} strokeWidth="2.5" strokeLinecap="round" opacity={0.4} />
          </svg>
        </motion.div>

        {/* ─── Product tabs ─── */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginBottom: 40, flexWrap: 'wrap' }}>
          {PRODUCTS.map((p, i) => (
            <motion.button
              key={p.id}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleProductChange(i)}
              style={{
                padding: '10px 24px', borderRadius: 30,
                border: `2px solid ${selectedProduct === i ? G : 'rgba(21,128,61,0.2)'}`,
                background: selectedProduct === i ? G : 'transparent',
                color: selectedProduct === i ? '#fff' : '#1a1a1a',
                fontFamily: FS, fontWeight: 600, fontSize: 14,
                cursor: 'pointer', transition: 'all 0.2s',
              }}
            >
              {p.name.replace('PlainFuel ', '')}
            </motion.button>
          ))}
        </div>

        {/* ─── Product detail card ─── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.35 }}
          >
            {/* ── Notebook-style card ── */}
            <div style={{
              background: '#fff',
              border: '2px solid rgba(21,128,61,0.15)',
              borderRadius: 16,
              overflow: 'hidden',
              boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
              position: 'relative',
            }}>
              {/* Tape decoration */}
              <div style={{
                position: 'absolute', top: -6, left: '50%', transform: 'translateX(-50%) rotate(-1deg)',
                width: 80, height: 24, background: 'rgba(21,128,61,0.08)',
                borderRadius: 4, zIndex: 2,
              }} />

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'clamp(280px, 45%, 520px) 1fr',
                gap: 0,
              }}>
                {/* ── LEFT: Image gallery ── */}
                <div style={{
                  padding: 'clamp(24px, 4vw, 48px)',
                  background: 'rgba(21,128,61,0.03)',
                  borderRight: '1px dashed rgba(21,128,61,0.15)',
                  display: 'flex', flexDirection: 'column', alignItems: 'center',
                  position: 'relative',
                }}>
                  {/* Tag badge */}
                  <div style={{
                    position: 'absolute', top: 20, left: 20,
                    background: '#fffde6', border: '1.5px solid rgba(21,128,61,0.2)',
                    borderRadius: 6, padding: '4px 12px',
                    fontFamily: FS, fontSize: 12, fontWeight: 600, color: G,
                  }}>
                    {product.tag}
                  </div>

                  {/* Main image */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={variant.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3 }}
                      style={{ width: '100%', maxWidth: 360, aspectRatio: '1', position: 'relative', margin: '24px 0' }}
                    >
                      <Image
                        src={variant.image}
                        alt={product.name}
                        fill
                        style={{ objectFit: 'contain' }}
                        sizes="360px"
                      />
                    </motion.div>
                  </AnimatePresence>

                  {/* Thumbnail strip */}
                  <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                    {product.variants.map((v, i) => (
                      <motion.button
                        key={v.id}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedVariant(i)}
                        style={{
                          width: 56, height: 56, borderRadius: 10, overflow: 'hidden',
                          border: selectedVariant === i ? `2.5px solid ${G}` : '2px solid rgba(0,0,0,0.08)',
                          background: '#fff', cursor: 'pointer', position: 'relative', padding: 4,
                        }}
                      >
                        <Image src={v.image} alt={v.name} fill style={{ objectFit: 'contain', padding: 4 }} sizes="56px" />
                        {selectedVariant === i && (
                          <motion.div
                            layoutId="variantCheck"
                            style={{
                              position: 'absolute', bottom: 2, right: 2,
                              width: 16, height: 16, borderRadius: '50%',
                              background: G, display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}
                          >
                            <Check size={10} color="#fff" />
                          </motion.div>
                        )}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* ── RIGHT: Product info ── */}
                <div style={{ padding: 'clamp(24px, 4vw, 48px)' }}>
                  {/* Reviews */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
                    <div style={{ display: 'flex', gap: 2 }}>
                      {[1, 2, 3, 4, 5].map(s => (
                        <Star key={s} size={14} fill={s <= Math.round(product.rating) ? '#facc15' : 'none'} color="#facc15" />
                      ))}
                    </div>
                    <span style={{ fontFamily: FS, fontSize: 13, color: '#666' }}>
                      {product.rating} · {product.reviews.toLocaleString()} Reviews
                    </span>
                  </div>

                  {/* Title */}
                  <h2 style={{ fontFamily: FD, fontSize: 'clamp(22px, 3.5vw, 32px)', fontWeight: 800, color: '#1a1a1a', margin: '0 0 8px' }}>
                    {product.name}
                  </h2>
                  <p style={{ fontFamily: FS, fontSize: 15, color: '#555', lineHeight: 1.6, margin: '0 0 20px' }}>
                    {product.description}
                  </p>

                  {/* Variant selector */}
                  <div style={{ marginBottom: 20 }}>
                    <p style={{ fontFamily: FS, fontSize: 13, fontWeight: 600, color: '#444', marginBottom: 8 }}>
                      Flavour: <span style={{ color: G }}>{variant.name}</span>
                    </p>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      {product.variants.map((v, i) => (
                        <motion.button
                          key={v.id}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setSelectedVariant(i)}
                          style={{
                            padding: '6px 16px', borderRadius: 20,
                            border: selectedVariant === i ? `2px solid ${G}` : '1.5px solid #e5e5e5',
                            background: selectedVariant === i ? 'rgba(21,128,61,0.06)' : '#fff',
                            fontFamily: FS, fontSize: 13, fontWeight: 500,
                            color: selectedVariant === i ? G : '#444',
                            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
                          }}
                        >
                          <span style={{
                            width: 10, height: 10, borderRadius: '50%',
                            background: v.color, border: '1px solid rgba(0,0,0,0.1)',
                          }} />
                          {v.name}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Purchase options */}
                  <div style={{
                    border: '1.5px solid rgba(21,128,61,0.15)', borderRadius: 12,
                    overflow: 'hidden', marginBottom: 20,
                  }}>
                    {/* One-time */}
                    <label style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '14px 16px', cursor: 'pointer',
                      background: purchaseType === 'onetime' ? 'rgba(21,128,61,0.04)' : '#fff',
                      borderBottom: '1px solid rgba(21,128,61,0.1)',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <input
                          type="radio" name="purchase" checked={purchaseType === 'onetime'}
                          onChange={() => setPurchaseType('onetime')}
                          style={{ accentColor: G, width: 16, height: 16 }}
                        />
                        <span style={{ fontFamily: FS, fontSize: 14, fontWeight: 600 }}>One-Time Purchase</span>
                      </div>
                      <span style={{ fontFamily: FD, fontSize: 20, fontWeight: 800, color: '#1a1a1a' }}>
                        ₹{product.oneTimePrice.toLocaleString()}
                      </span>
                    </label>

                    {/* Subscribe */}
                    <label style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '14px 16px', cursor: 'pointer',
                      background: purchaseType === 'subscribe' ? 'rgba(21,128,61,0.04)' : '#fff',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <input
                          type="radio" name="purchase" checked={purchaseType === 'subscribe'}
                          onChange={() => setPurchaseType('subscribe')}
                          style={{ accentColor: G, width: 16, height: 16 }}
                        />
                        <div>
                          <span style={{ fontFamily: FS, fontSize: 14, fontWeight: 600 }}>Subscribe & Save</span>
                          <span style={{
                            marginLeft: 8, padding: '2px 8px', borderRadius: 10,
                            background: '#dcfce7', fontFamily: FS, fontSize: 11, fontWeight: 700, color: G,
                          }}>
                            BEST VALUE
                          </span>
                          <p style={{ fontFamily: FS, fontSize: 12, color: '#888', margin: '2px 0 0' }}>
                            Deliver every {product.duration.replace(' Days', '')} days
                          </p>
                        </div>
                      </div>
                      <span style={{ fontFamily: FD, fontSize: 20, fontWeight: 800, color: G }}>
                        ₹{product.subscribePrice.toLocaleString()}
                      </span>
                    </label>
                  </div>

                  {/* Quantity + Add to cart */}
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 20 }}>
                    {/* Quantity */}
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: 0,
                      border: '1.5px solid rgba(21,128,61,0.2)', borderRadius: 10,
                      overflow: 'hidden',
                    }}>
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        style={{
                          width: 40, height: 40, border: 'none',
                          background: 'transparent', cursor: 'pointer',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: '#666',
                        }}
                      >
                        <Minus size={16} />
                      </button>
                      <span style={{
                        width: 40, textAlign: 'center', fontFamily: FS,
                        fontSize: 15, fontWeight: 600, color: '#1a1a1a',
                      }}>
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        style={{
                          width: 40, height: 40, border: 'none',
                          background: 'transparent', cursor: 'pointer',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: '#666',
                        }}
                      >
                        <Plus size={16} />
                      </button>
                    </div>

                    {/* Add to cart */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      style={{
                        flex: 1, height: 44, borderRadius: 10,
                        background: G, border: 'none',
                        color: '#fff', fontFamily: FS, fontSize: 15, fontWeight: 700,
                        cursor: 'pointer', display: 'flex', alignItems: 'center',
                        justifyContent: 'center', gap: 8,
                      }}
                    >
                      <ShoppingCart size={18} />
                      Add to Cart · ₹{(price * quantity).toLocaleString()}
                    </motion.button>
                  </div>

                  {/* Trust badges */}
                  <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <RotateCcw size={14} color="#666" />
                      <span style={{ fontFamily: FS, fontSize: 12, color: '#666' }}>No Questions Asked Refund</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Truck size={14} color="#666" />
                      <span style={{ fontFamily: FS, fontSize: 12, color: '#666' }}>Free Shipping on All Orders</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Bottom section: Benefits + Nutrients ── */}
              <div style={{
                borderTop: '1px dashed rgba(21,128,61,0.15)',
                padding: 'clamp(24px, 4vw, 40px)',
                display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40,
              }}>
                {/* Benefits */}
                <div>
                  <h3 style={{ fontFamily: FD, fontSize: 18, fontWeight: 800, color: '#1a1a1a', marginBottom: 16 }}>
                    What makes it different
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    {product.benefits.map((b) => (
                      <div key={b} style={{
                        display: 'flex', alignItems: 'center', gap: 8,
                        padding: '8px 12px', borderRadius: 8,
                        background: 'rgba(21,128,61,0.04)',
                        border: '1px solid rgba(21,128,61,0.08)',
                      }}>
                        <Check size={14} color={G} />
                        <span style={{ fontFamily: FS, fontSize: 13, color: '#333' }}>{b}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Key nutrients */}
                <div>
                  <h3 style={{ fontFamily: FD, fontSize: 18, fontWeight: 800, color: '#1a1a1a', marginBottom: 16 }}>
                    Key Nutrients
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    {product.nutrients.map((n) => (
                      <div key={n.label} style={{
                        padding: '10px 14px', borderRadius: 8,
                        background: '#fffde6', border: '1.5px solid rgba(21,128,61,0.12)',
                        position: 'relative',
                      }}>
                        <p style={{ fontFamily: FS, fontSize: 13, fontWeight: 600, color: '#1a1a1a', margin: 0 }}>
                          {n.label}
                        </p>
                        <p style={{ fontFamily: FD, fontSize: 18, fontWeight: 800, color: G, margin: '2px 0 0' }}>
                          {n.amount}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Responsive overrides ── */}
      <style jsx global>{`
        @media (max-width: 768px) {
          .products-grid {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 900px) {
          [style*="gridTemplateColumns: clamp"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
