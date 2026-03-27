'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Star, ArrowRight, Sparkles, Check } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { productAPI, Product } from '@/lib/api';
import ProductDetail from './ProductDetail';
import { F_SIZE, BRAND } from '@/lib/typography';

/* ── Design Tokens ── */
const C = {
  forest: BRAND.espresso,
  deep: BRAND.espresso,
  mid: BRAND.espresso,
  leaf: BRAND.burgundy,
  ink: BRAND.espresso,
  white: '#ffffff',
  offwhite: BRAND.cream,
  silver: '#64748b',
  mist: BRAND.stone,
  gold: BRAND.burgundy,
  goldLight: '#a16207',
  glow: 'rgba(74,222,128,0.22)',
  glass: 'rgba(255, 255, 255, 0.92)',
};

const FONTS = {
  main: "'Montserrat', sans-serif",
  accent: "'Caveat', cursive",
};

/* ── Components ── */
function GoldLine({ style }: { style?: React.CSSProperties }) {
  return (
    <div style={{
      height: 1, width: '100%',
      background: `linear-gradient(to right, transparent, ${C.gold}99, transparent)`,
      ...style,
    }} />
  );
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 8,
      fontFamily: FONTS.main,
      fontSize: F_SIZE.sm, letterSpacing: '0.26em', textTransform: 'uppercase',
      color: BRAND.espresso, fontWeight: 700,
      border: `1px solid ${BRAND.espresso}40`,
      borderRadius: 2, padding: '5px 14px',
      backgroundColor: 'rgba(10, 61, 31, 0.05)',
    }}>{children}</span>
  );
}

function DotGrid() {
  return (
    <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0, opacity: 0.08, pointerEvents: 'none' }}>
      <defs>
        <pattern id="dotgrid-prod" width="28" height="28" patternUnits="userSpaceOnUse">
          <circle cx="14" cy="14" r="0.9" fill={C.gold} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#dotgrid-prod)" />
    </svg>
  );
}

/* ── Main Component ── */
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
      <div style={{ minHeight: '100vh', background: BRAND.cream, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONTS.main }}>
        <div style={{ textAlign: 'center' }}>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
            style={{ width: 40, height: 40, border: `2px solid ${BRAND.espresso}22`, borderTopColor: BRAND.espresso, borderRadius: '50%', margin: '0 auto 20px' }}
          />
          <p style={{ fontSize: F_SIZE.sm, fontWeight: 700, color: BRAND.espresso, letterSpacing: '0.2em', textTransform: 'uppercase' }}>Loading Products...</p>
        </div>
      </div>
    );
  }

  if (selectedProduct) {
    return <ProductDetail product={selectedProduct} onBack={() => setSelectedProduct(null)} />;
  }

  return (
    <div style={{ minHeight: '100vh', background: BRAND.cream, fontFamily: FONTS.main, position: 'relative', overflow: 'hidden' }}>
      <Navbar />
      
      {/* Background Decor */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <DotGrid />
        <div style={{ 
          position: 'absolute', inset: 0, 
          background: 'radial-gradient(ellipse at 10% 55%, rgba(22,101,52,0.035) 0%, transparent 52%), radial-gradient(ellipse at 90% 15%, rgba(133,77,14,0.02) 0%, transparent 48%)'
        }} />
      </div>
      
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '160px 24px 80px', position: 'relative', zIndex: 1 }}>
        
        {/* Header Section */}
        <div style={{ textAlign: 'center', marginBottom: 80 }}>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{ marginBottom: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16 }}
          >
            <Chip>
              <svg viewBox="0 0 8 8" width={6} height={6}><circle cx="4" cy="4" r="3" fill={BRAND.espresso} /></svg>
              Elite Selection
            </Chip>
          </motion.div>
          
          <h2 style={{ fontSize: F_SIZE.xl, fontWeight: 900, color: C.ink, margin: 0, lineHeight: 0.88, letterSpacing: '-0.04em' }}>
            Available <span style={{ fontWeight: 300, color: BRAND.espresso }}>Selections</span>
          </h2>
          
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 22 }}>
            <GoldLine style={{ width: 240 }} />
          </div>
          
          <p style={{ 
            fontFamily: FONTS.accent, fontSize: F_SIZE.lg, fontWeight: 700, color: BRAND.espresso,
            margin: '32px auto 0', letterSpacing: '0.01em', maxWidth: 600
          }}>
            Select your daily fuel system formulated for maximum bio-efficiency.
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
              whileHover={{ y: -8 }}
              onClick={() => setSelectedProduct(p)}
              style={{
                position: 'relative',
                height: 580,
                borderRadius: 16,
                overflow: 'hidden',
                background: C.white,
                boxShadow: '0 4px 20px rgba(0,0,0,0.04), 0 20px 60px rgba(0,0,0,0.06)',
                cursor: 'pointer',
                border: '1px solid rgba(0,0,0,0.05)',
              }}
            >
              {/* Image Area */}
              <div style={{ 
                height: 360, 
                position: 'relative', 
                background: 'linear-gradient(160deg, #f8f9f8 0%, #f1f5f1 45%, #ffffff 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden'
              }}>
                <div style={{ 
                    position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                    width: '120%', height: '100%', background: `radial-gradient(circle, ${C.glow} 0%, transparent 70%)`,
                    opacity: 0.15
                }} />
                
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6 }}
                  style={{ position: 'relative', width: '70%', height: '70%' }}
                >
                  <Image 
                    src={p.packages?.[0]?.images?.[0] || '/images/product.png'} 
                    alt={p.name} fill
                    unoptimized={true}
                    style={{ objectFit: 'contain', filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.08))', backgroundColor: 'transparent' }} 
                  />
                </motion.div>

                {/* Protocol Badge */}
                <div style={{ position: 'absolute', top: 20, left: 24, zIndex: 10 }}>
                   <span style={{
                    fontFamily: FONTS.main, fontSize: F_SIZE.sm, letterSpacing: '0.2em',
                    color: `${C.ink}44`, fontWeight: 700,
                  }}>PRODUCT-{String(i+1).padStart(2, '0')}</span>
                </div>
              </div>

              {/* Verified Circle */}
              <div style={{ position: 'absolute', top: 345, right: 32, zIndex: 20 }}>
                <div style={{ 
                  width: 30, height: 30, borderRadius: '50%', background: C.white, 
                  display: 'flex', alignItems: 'center', justifyContent: 'center', 
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)', border: `1px solid ${BRAND.espresso}10` 
                }}>
                  <Check size={16} color={BRAND.burgundy} strokeWidth={4} />
                </div>
              </div>

              {/* Content Overlay */}
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0,
                height: 220,
                padding: '28px 32px 32px',
                background: C.glass,
                backdropFilter: 'blur(22px)',
                WebkitBackdropFilter: 'blur(22px)',
                zIndex: 10,
                display: 'flex', flexDirection: 'column', gap: 14,
                borderTop: '1px solid rgba(0,0,0,0.05)'
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 4 }}>
                    <h3 style={{ 
                      fontSize: F_SIZE.lg, fontWeight: 800, color: C.ink, margin: 0, 
                      letterSpacing: '-0.02em', lineHeight: 1 
                    }}>{p.name}</h3>
                    <span style={{ fontFamily: FONTS.accent, fontSize: F_SIZE.md, color: BRAND.espresso, fontWeight: 700 }}>Formula</span>
                  </div>
                  <p style={{ 
                    fontSize: F_SIZE.sm, color: C.silver, letterSpacing: '0.14em', 
                    textTransform: 'uppercase', margin: 0, fontWeight: 600
                  }}>
                    Scientifically Engineered
                  </p>
                </div>

                <GoldLine style={{ width: '100%', margin: '2px 0' }} />

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Star size={14} fill={C.gold} color={C.gold} />
                      <span style={{ fontSize: F_SIZE.md, fontWeight: 800, color: C.ink }}>{p.rating || 5.0}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                       <span style={{ 
                        fontSize: F_SIZE.sm, fontWeight: 900, color: BRAND.espresso, 
                        fontFamily: FONTS.main, letterSpacing: '0.05em' 
                      }}>₹{p.packages?.[0]?.price?.toLocaleString()}</span>
                    </div>
                  </div>

                  <motion.div
                    whileHover={{ x: 3 }}
                    style={{
                      fontFamily: FONTS.main, fontSize: F_SIZE.sm, letterSpacing: '0.2em',
                      textTransform: 'uppercase', color: BRAND.espresso, fontWeight: 900,
                      display: 'flex', alignItems: 'center', gap: 8
                    }}
                  >
                    Details <ArrowRight size={14} />
                  </motion.div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginTop: 4 }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: BRAND.burgundy, boxShadow: `0 0 7px ${BRAND.burgundy}66` }} />
                  <span style={{ fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: C.silver, fontWeight: 700 }}>
                    Quality Verified — In Stock
                  </span>
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


