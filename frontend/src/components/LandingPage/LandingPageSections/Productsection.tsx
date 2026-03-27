'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ArrowRight, Sparkles, Check } from 'lucide-react';
import { F_SIZE } from '@/lib/typography';
import Image from 'next/image';
import Link from 'next/link';
import { productAPI, type Product as BackendProduct } from '@/lib/api';

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
export default function ProductSection() {
  const [products, setProducts] = useState<BackendProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      try {
        const data = await productAPI.getAll();
        setProducts(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetch();
  }, []);

  if (loading || products.length === 0) return null;

  return (
    <section id="products" style={{ position: 'relative', padding: '60px 0', overflow: 'hidden' }}>
      {/* Top Shimmer Border */}
      <div style={{
        position: 'absolute', top: 0, left: '10%', right: '10%', height: 1,
        background: `linear-gradient(to right, transparent, ${C.mid}22, transparent)`,
        zIndex: 10
      }} />

      <PremiumBackground />

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 1 }}>
        {/* Header Section */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '6px 16px', borderRadius: 100, background: `${C.white}88`, border: `1px solid ${C.mid}15`, backdropFilter: 'blur(10px)', marginBottom: 20 }}
          >
            <Sparkles size={14} color={C.gold} />
            <span style={{ fontSize: F_SIZE.sm, fontWeight: 800, color: C.mid, letterSpacing: '0.15em', textTransform: 'uppercase' }}>Elite Selection</span>
          </motion.div>

          <h2 style={{ fontFamily: FONTS.main, fontSize: F_SIZE.xl, fontWeight: 900, color: C.ink, margin: 0, lineHeight: 1.1 }}>
            Fuel <span style={{ fontFamily: FONTS.accent, color: C.mid, fontVariantCaps: 'normal' }}>Cycle.</span>
          </h2>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 8 }}>
            <GoldUnderline width={220} />
          </div>

          <p style={{ fontFamily: FONTS.main, fontSize: F_SIZE.sm, color: C.ink, marginTop: 24, letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600, opacity: 0.8 }}>
            Elevate your daily ritual <span style={{ color: C.gold, margin: '0 8px' }}>—</span> Experience the shift.
          </p>
        </div>

        {/* Grid Section */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 24,
          maxWidth: products.length === 1 ? 400 : 1200,
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
              style={{
                position: 'relative',
                height: 480, // Tightened height
                borderRadius: 48,
                overflow: 'hidden',
                background: 'rgba(255, 255, 255, 0.45)', // Premium Light Glass
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255, 255, 255, 0.5)',
                boxShadow: '0 25px 50px -12px rgba(10, 61, 31, 0.08)',
                cursor: 'pointer'
              }}
            >
              {/* Immersive Image Area */}
              <div style={{ position: 'absolute', inset: 0, zIndex: 0, background: `linear-gradient(135deg, ${C.offwhite} 0%, ${C.white} 100%)` }}>
                {/* Visual Glow */}
                <div style={{
                  position: 'absolute', top: '15%', left: '50%', transform: 'translate(-50%, -50%)',
                  width: '120%', height: '80%', background: `radial-gradient(circle, ${C.glow} 0%, transparent 70%)`,
                  opacity: 0.4
                }} />

                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1 }}
                  style={{ position: 'relative', width: '100%', height: '70%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <Image
                    src={p.packages?.[0]?.images?.[0] || '/images/Products/product.png'}
                    alt={p.name} fill
                    unoptimized={true}
                    style={{ objectFit: 'contain', padding: 30, filter: 'drop-shadow(0 15px 35px rgba(0,0,0,0.06))', backgroundColor: 'transparent' }}
                  />
                </motion.div>
              </div>

              {/* Protocol Badge */}
              <div style={{ position: 'absolute', top: 24, left: 24, zIndex: 10 }}>
                <div style={{ padding: '6px 14px', borderRadius: 100, background: 'rgba(10, 61, 31, 0.05)', border: '1px solid rgba(10, 61, 31, 0.1)', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Sparkles size={10} color={C.gold} />
                  <span style={{ fontSize: F_SIZE.sm, fontWeight: 900, color: C.mid, textTransform: 'uppercase', letterSpacing: '0.15em' }}>Package {String(i + 1).padStart(2, '0')}</span>
                </div>
              </div>

              {/* Verified Badge */}
              <div style={{ position: 'absolute', top: 24, right: 24, zIndex: 10 }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: C.white, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', border: `1px solid ${C.mid}10` }}>
                  <Check size={16} color={C.mid} strokeWidth={4} />
                </div>
              </div>

              {/* Content Overlay */}
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0,
                padding: '32px 28px 28px',
                background: 'linear-gradient(to top, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.7) 60%, transparent 100%)',
                backdropFilter: 'blur(20px)',
                zIndex: 5,
                display: 'flex', flexDirection: 'column', gap: 12
              }}>
                <div>
                  <h3 style={{ fontFamily: FONTS.main, fontSize: F_SIZE.lg, fontWeight: 900, color: C.ink, margin: '0 0 4px', letterSpacing: '-0.02em', lineHeight: 1 }}>{p.name}</h3>
                  <p style={{ fontFamily: FONTS.main, fontSize: F_SIZE.sm, color: '#4a554d', lineHeight: 1.5, margin: 0, fontWeight: 500, opacity: 0.85 }}>
                    Scientifically distilled for performance excellence.
                  </p>
                </div>

                {/* Stats & Action Row */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: C.ink }}>
                      <Star size={14} fill={C.gold} color={C.gold} />
                      <span style={{ fontSize: F_SIZE.md, fontWeight: 900 }}>{p.rating || 5.0}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <span style={{ fontSize: F_SIZE.sm, fontWeight: 800, color: C.silver, textTransform: 'uppercase', marginRight: 4 }}>INR</span>
                      <span style={{ fontSize: F_SIZE.lg, fontWeight: 900, color: C.mid }}>{p.packages?.[0]?.price?.toLocaleString()}</span>
                    </div>
                  </div>

                  <Link href={`/products?id=${p.id}`} passHref legacyBehavior>
                    <motion.a
                      whileHover={{ scale: 1.05, backgroundColor: C.forest }}
                      whileTap={{ scale: 0.95 }}
                      style={{
                        background: C.deep,
                        color: C.white,
                        padding: '12px 24px',
                        borderRadius: 100,
                        fontSize: F_SIZE.sm,
                        fontWeight: 900,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        boxShadow: `0 10px 20px ${C.forest}22`,
                        cursor: 'pointer'
                      }}
                    >
                      Explore <ArrowRight size={16} />
                    </motion.a>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&family=Caveat:wght@600;700&display=swap');
      `}</style>
    </section>
  );
}