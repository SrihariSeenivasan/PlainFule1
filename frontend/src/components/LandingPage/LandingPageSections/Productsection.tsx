'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ArrowRight, Sparkles, Check } from 'lucide-react';
import { F_SIZE, BRAND, FONTS } from '@/lib/typography';
import Image from 'next/image';
import Link from 'next/link';
import { productAPI, type Product as BackendProduct } from '@/lib/api';

/* ─────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────── */
function PremiumBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
      {/* Off-white base */}
      <div className="absolute inset-0" style={{ background: BRAND.cream }} />

      {/* Ambient Light Peaks */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `
          radial-gradient(circle at 10% 20%, ${BRAND.espresso}06 0%, transparent 40%),
          radial-gradient(circle at 90% 80%, ${BRAND.burgundy}04 0%, transparent 40%)
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
          <circle cx="20" cy="20" r="1" fill={BRAND.espresso} />
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
      stroke={BRAND.burgundy} strokeWidth="2.5" strokeLinecap="round"
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
    <section id="products" style={{ position: 'relative', padding: '100px 0', overflow: 'hidden' }}>
      <PremiumBackground />

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 1 }}>
        {/* Header Section */}
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '6px 16px', borderRadius: 100, background: BRAND.white, border: `1px solid ${BRAND.espresso}15`, backdropFilter: 'blur(10px)', marginBottom: 20 }}
          >
            <Sparkles size={14} color={BRAND.burgundy} />
            <span style={{ fontSize: F_SIZE.sm, fontWeight: 900, color: BRAND.espresso, letterSpacing: '0.15em', textTransform: 'uppercase', fontFamily: FONTS.main }}>Elite Selection</span>
          </motion.div>

          <h2 style={{ fontFamily: FONTS.main, fontSize: F_SIZE.xl, fontWeight: 900, color: BRAND.espresso, margin: 0, lineHeight: 1.1, letterSpacing: '-0.04em' }}>
            Fuel <span style={{ color: BRAND.burgundy }}>Cycle.</span>
          </h2>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 8 }}>
            <GoldUnderline width={220} />
          </div>

          <p style={{ fontFamily: FONTS.main, fontSize: F_SIZE.md, color: BRAND.burgundy, marginTop: 24, maxWidth: 600, marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.6 }}>
            Experience the standard in metabolic restoration. Engineered for cellular resonance.
          </p>
        </div>

        {/* Grid Section */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 32,
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
                height: 520,
                borderRadius: 48,
                overflow: 'hidden',
                background: BRAND.white,
                border: `1px solid ${BRAND.espresso}08`,
                boxShadow: '0 20px 50px rgba(0,0,0,0.04)',
                cursor: 'pointer'
              }}
            >
              {/* Immersive Image Area */}
              <div style={{ position: 'absolute', inset: 0, zIndex: 0, background: BRAND.cream }}>
                <div style={{
                  position: 'absolute', top: '15%', left: '50%', transform: 'translate(-50%, -50%)',
                  width: '120%', height: '80%', background: `radial-gradient(circle, ${BRAND.burgundy}05 0%, transparent 70%)`
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
                    style={{ objectFit: 'contain', padding: 40, filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.08))' }}
                  />
                </motion.div>
              </div>

              {/* Protocol Badge */}
              <div style={{ position: 'absolute', top: 32, left: 32, zIndex: 10 }}>
                <div style={{ padding: '8px 16px', borderRadius: 100, background: BRAND.white, border: `1px solid ${BRAND.espresso}10`, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Sparkles size={12} color={BRAND.burgundy} />
                  <span style={{ fontSize: F_SIZE.sm, fontWeight: 900, color: BRAND.espresso, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Package {String(i + 1).padStart(2, '0')}</span>
                </div>
              </div>

              {/* Verified Badge */}
              <div style={{ position: 'absolute', top: 32, right: 32, zIndex: 10 }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: BRAND.white, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', border: `1px solid ${BRAND.espresso}10` }}>
                  <Check size={18} color={BRAND.espresso} strokeWidth={4} />
                </div>
              </div>

              {/* Content Overlay */}
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0,
                padding: '40px 32px 32px',
                background: 'linear-gradient(to top, white 0%, rgba(255,255,255,0.95) 60%, transparent 100%)',
                backdropFilter: 'blur(20px)',
                zIndex: 5,
                display: 'flex', flexDirection: 'column', gap: 16
              }}>
                <div>
                  <h3 style={{ fontFamily: FONTS.main, fontSize: F_SIZE.lg, fontWeight: 900, color: BRAND.espresso, margin: '0 0 8px', letterSpacing: '-0.02em' }}>{p.name}</h3>
                  <p style={{ fontFamily: FONTS.main, fontSize: F_SIZE.sm, color: BRAND.taupe, lineHeight: 1.5, margin: 0, fontWeight: 600 }}>
                    Cellular restoration engineered for total human performance.
                  </p>
                </div>

                {/* Stats & Action Row */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: BRAND.espresso }}>
                      <Star size={16} fill={BRAND.burgundy} color={BRAND.burgundy} />
                      <span style={{ fontSize: F_SIZE.md, fontWeight: 900 }}>{p.rating || 5.0}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <span style={{ fontSize: F_SIZE.sm, fontWeight: 800, color: BRAND.taupe }}>INR</span>
                      <span style={{ fontSize: F_SIZE.lg, fontWeight: 900, color: BRAND.espresso }}>{p.packages?.[0]?.price?.toLocaleString()}</span>
                    </div>
                  </div>

                  <Link href={`/products?id=${p.id}`} passHref legacyBehavior>
                    <motion.a
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      style={{
                        background: BRAND.espresso,
                        color: BRAND.white,
                        padding: '12px 28px',
                        borderRadius: 100,
                        fontSize: F_SIZE.sm,
                        fontWeight: 900,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        boxShadow: `0 10px 20px ${BRAND.espresso}20`,
                        cursor: 'pointer'
                      }}
                    >
                      Details <ArrowRight size={18} />
                    </motion.a>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
