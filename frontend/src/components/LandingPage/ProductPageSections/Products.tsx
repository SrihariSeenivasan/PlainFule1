'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { ShoppingCart, Star, ArrowRight, Sparkles, Check } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { productAPI, Product } from '@/lib/api';
import ProductDetail from './ProductDetail';

/* ── Design Tokens ── */
const C = {
  forest: '#0a3d1f',
  deep: '#071a0d',
  mid: '#14532d',
  leaf: '#16a34a',
  ink: '#070d08',
  white: '#ffffff',
  offwhite: '#f7f8f5',
  silver: '#9eaaa0',
  gold: '#b8953a',
  goldLight: '#d4af5a',
  glow: 'rgba(74,222,128,0.18)',
};

const FONTS = {
  main: "'Montserrat', sans-serif",
  accent: "'Caveat', cursive",
};

/* ─────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────── */
function PremiumBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
      {/* Off-white base */}
      <div className="absolute inset-0" style={{ background: C.offwhite }} />
      
      {/* Ambient Light Peaks */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `
          radial-gradient(circle at 10% 20%, rgba(22,101,52,0.06) 0%, transparent 40%),
          radial-gradient(circle at 90% 80%, rgba(184,149,58,0.04) 0%, transparent 40%)
        `,
      }} />

      {/* Subtle Noise / Grain Overlay */}
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.015,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
      }} />

      {/* Sophisticated Dot Grid */}
      <svg width="100%" height="100%" style={{ position: 'absolute', opacity: 0.04 }}>
        <pattern id="grid-sophisticated" width="40" height="40" patternUnits="userSpaceOnUse">
          <circle cx="20" cy="20" r="1" fill={C.mid} />
        </pattern>
        <rect width="100%" height="100%" fill="url(#grid-sophisticated)" />
      </svg>
    </div>
  );
}

const GoldUnderline = ({ width = 160 }: { width?: number }) => (
  <svg width={width} height="12" viewBox={`0 0 ${width} 12`} fill="none" style={{ display: 'block', marginTop: 4 }}>
    <motion.path
      d={`M2 6 Q${width * 0.25} 2 ${width * 0.5} 6 Q${width * 0.75} 10 ${width - 2} 6`}
      stroke={C.gold} strokeWidth="2.5" strokeLinecap="round"
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.2, ease: "easeInOut" }}
    />
  </svg>
);

/* ─────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────── */
export default function Products() {
  const searchParams = useSearchParams();
  const productIdFromUrl = searchParams.get('id');
  
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const fetchedProducts = await productAPI.getAll();
        const productList = Array.isArray(fetchedProducts) ? fetchedProducts : [];
        setProducts(productList);

        // If there's an ID in the URL, try to pre-select that product
        if (productIdFromUrl) {
          const product = productList.find((p: Product) => p.id === Number(productIdFromUrl));
          if (product) setSelectedProduct(product);
        }
      } catch (err) {
        console.error('Failed to fetch products:', err);
        setError('Failed to load products.');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [productIdFromUrl]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: C.offwhite, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONTS.main }}>
        <div style={{ textAlign: 'center' }}>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
            style={{ width: 40, height: 40, border: `3px solid ${C.mid}22`, borderTopColor: C.mid, borderRadius: '50%', margin: '0 auto 20px' }}
          />
          <p style={{ fontSize: 13, fontWeight: 700, color: C.mid, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Synchronizing Protocols...</p>
        </div>
      </div>
    );
  }

  if (selectedProduct) {
    return <ProductDetail product={selectedProduct} onBack={() => setSelectedProduct(null)} />;
  }

  return (
    <div style={{ minHeight: '100vh', background: C.offwhite, fontFamily: FONTS.main, position: 'relative' }}>
      <Navbar />
      <PremiumBackground />
      
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '160px 24px 80px', position: 'relative', zIndex: 1 }}>
        
        {/* Header Section */}
        <div style={{ textAlign: 'center', marginBottom: 80 }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '6px 16px', borderRadius: 100, background: `${C.white}88`, border: `1px solid ${C.mid}15`, backdropFilter: 'blur(10px)', marginBottom: 20 }}
          >
            <Sparkles size={14} color={C.gold} />
            <span style={{ fontSize: 10, fontWeight: 800, color: C.mid, letterSpacing: '0.15em', textTransform: 'uppercase' }}>Elite Selection</span>
          </motion.div>
          
          <h2 style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 900, color: C.ink, margin: 0, lineHeight: 1.1, letterSpacing: '-0.03em' }}>
            Available <span style={{ fontFamily: FONTS.accent, color: C.mid, fontVariantCaps: 'normal' }}>Protocols.</span>
          </h2>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 12 }}>
            <GoldUnderline width={240} />
          </div>
          
          <p style={{ fontSize: 14, color: C.silver, marginTop: 32, letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600, opacity: 0.8, maxWidth: 500, margin: '32px auto 0', lineHeight: 1.6 }}>
            Select your daily fuel system formulated for <span style={{ color: C.mid }}>maximum bio-efficiency</span> and performance.
          </p>
        </div>

        {/* Grid Section */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', 
          gap: 40,
          margin: '0 auto'
        }}>
          {products.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: i * 0.1 }}
              whileHover={{ y: -12 }}
              onClick={() => setSelectedProduct(p)}
              style={{
                position: 'relative',
                height: 540,
                borderRadius: 48,
                overflow: 'hidden',
                background: 'rgba(255, 255, 255, 0.45)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255, 255, 255, 0.5)',
                boxShadow: '0 40px 100px -20px rgba(10, 61, 31, 0.08)',
                cursor: 'pointer'
              }}
            >
              {/* Immersive Image Area */}
              <div style={{ position: 'absolute', inset: 0, zIndex: 0, background: `linear-gradient(135deg, ${C.offwhite} 0%, ${C.white} 100%)` }}>
                <div style={{ 
                    position: 'absolute', top: '15%', left: '50%', transform: 'translate(-50%, -50%)',
                    width: '120%', height: '80%', background: `radial-gradient(circle, ${C.glow} 0%, transparent 70%)`,
                    opacity: 0.4
                }} />
                
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.6 }}
                  style={{ position: 'relative', width: '100%', height: '70%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <Image 
                    src={p.packages?.[0]?.images?.[0] || '/images/product.png'} 
                    alt={p.name} fill
                    style={{ objectFit: 'contain', padding: 40, filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.06))' }} 
                  />
                </motion.div>
              </div>

              {/* Protocol Badge */}
              <div style={{ position: 'absolute', top: 32, left: 32, zIndex: 10 }}>
                <div style={{ padding: '8px 16px', borderRadius: 100, background: 'rgba(10, 61, 31, 0.05)', border: '1px solid rgba(10, 61, 31, 0.1)', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Sparkles size={12} color={C.gold} />
                  <span style={{ fontSize: 10, fontWeight: 900, color: C.mid, textTransform: 'uppercase', letterSpacing: '0.15em' }}>P-{String(i+1).padStart(2, '0')}</span>
                </div>
              </div>

              {/* Verified Badge */}
              <div style={{ position: 'absolute', top: 32, right: 32, zIndex: 10 }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: C.white, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', border: `1px solid ${C.mid}10` }}>
                  <Check size={18} color={C.mid} strokeWidth={4} />
                </div>
              </div>

              {/* Content Overlay */}
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0,
                padding: '40px 32px 32px',
                background: 'linear-gradient(to top, rgba(255,255,255,0.98) 0%, rgba(255,255,255,0.85) 60%, transparent 100%)',
                backdropFilter: 'blur(20px)',
                zIndex: 5,
                display: 'flex', flexDirection: 'column', gap: 16
              }}>
                <div>
                  <h3 style={{ fontSize: 28, fontWeight: 900, color: C.ink, margin: '0 0 4px', letterSpacing: '-0.02em', lineHeight: 1 }}>{p.name}</h3>
                  <p style={{ fontSize: 14, color: '#4a554d', lineHeight: 1.6, margin: 0, fontWeight: 500, opacity: 0.85 }}>
                    Scientifically engineered for cellular efficiency.
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: C.gold }}>
                      <Star size={16} fill={C.gold} />
                      <span style={{ fontSize: 18, fontWeight: 900, color: C.ink }}>{p.rating || 5.0}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <span style={{ fontSize: 10, fontWeight: 800, color: C.silver, textTransform: 'uppercase', marginRight: 4 }}>INR</span>
                      <span style={{ fontSize: 24, fontWeight: 900, color: C.mid }}>{p.packages?.[0]?.price?.toLocaleString()}</span>
                    </div>
                  </div>

                  <motion.div
                    whileHover={{ scale: 1.05, backgroundColor: C.deep }}
                    whileTap={{ scale: 0.95 }}
                    style={{
                      background: C.deep,
                      color: C.white,
                      padding: '12px 24px',
                      borderRadius: 100,
                      fontSize: 13,
                      fontWeight: 900,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      boxShadow: `0 10px 20px ${C.forest}22`,
                      cursor: 'pointer',
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em'
                    }}
                  >
                    Details <ArrowRight size={16} />
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&family=Caveat:wght@600;700&display=swap');
      `}</style>
    </div>
  );
}