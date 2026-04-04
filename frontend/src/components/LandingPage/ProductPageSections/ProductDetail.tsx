'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { ShoppingCart, Star, ArrowLeft, Zap, BarChart3, ChevronLeft, ChevronRight, Truck, RotateCcw } from 'lucide-react';
import { Product, ProductNutrient } from '@/lib/api';
import { useCart, CartItem } from '@/lib/cart-context';
import { useAuth } from '@/lib/auth-context';
import AuthModal from '@/components/AuthModal';
import ProductFAQ from './ProductFAQ';
import ReviewsSection from './ReviewsSection';
import { F_SIZE, BRAND, FONTS } from '@/lib/typography';

/* ── Sub-components ── */
function GoldLine({ style }: { style?: React.CSSProperties }) {
  return (
    <div style={{
      height: 1, width: '100%',
      background: `linear-gradient(to right, transparent, ${BRAND.primaryDark}99, transparent)`,
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
      color: BRAND.primary, fontWeight: 700,
      border: `1px solid ${BRAND.primary}40`,
      borderRadius: 2, padding: '5px 14px',
      backgroundColor: 'rgba(50, 45, 41, 0.05)',
    }}>{children}</span>
  );
}

interface ProductDetailProps {
  product: Product;
  onBack: () => void;
}

export default function ProductDetail({ product, onBack }: ProductDetailProps) {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [selectedPackage, setSelectedPackage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const packageData = product.packages?.[selectedPackage];
  const images = packageData?.images || [];
  const price = packageData?.price || 0;

  const handlePrevImage = () => {
    if (images.length > 0)
      setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    if (images.length > 0)
      setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleAddToCart = async () => {
    if (!packageData) return;
    if (!user) { setShowLoginModal(true); return; }

    const cartItem: CartItem = {
      id: `${product.id}-${packageData.id}`,
      productId: product.id,
      productName: product.name,
      packageId: packageData.id,
      packageName: `${packageData.duration} · ${packageData.pouches} pouches`,
      price: packageData.price,
      origPrice: packageData.origPrice,
      quantity,
      image: packageData.images?.[0] || '/images/product.png',
      duration: packageData.duration,
      pouches: packageData.pouches,
    };

    try {
      await addToCart(cartItem);
      setToastMessage(`✓ Added ${quantity} ${packageData.duration} package(s) to cart!`);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (err) {
      console.error('Error adding to cart:', err);
      setToastMessage('Failed to add item to cart.');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  if (!packageData) return null;

  return (
    <div style={{ fontFamily: FONTS.main, minHeight: '100vh', background: BRAND.white }}>
      <div style={{
        maxWidth: 1200, margin: '0 auto',
        padding: 'clamp(60px, 8vw, 120px) clamp(16px, 5vw, 20px) clamp(40px, 8vw, 80px)',
      }}>

        {/* ── Back Button ── */}
        <motion.button
          onClick={onBack}
          whileHover={{ x: -4 }}
          style={{
            display: 'flex', alignItems: 'center', gap: 12,
            background: 'none', border: 'none', cursor: 'pointer',
            color: BRAND.primary, fontWeight: 900,
            fontSize: 'clamp(0.7rem, 2vw, 0.75rem)',
            marginBottom: 'clamp(16px, 4vw, 32px)',
            textTransform: 'uppercase', letterSpacing: '0.2em',
          }}
        >
          <ArrowLeft size={18} /> Back to Products
        </motion.button>

        {/* ── Hero: Image + Info ── */}
        {/* Single col on mobile, two col on ≥768px */}
        <div
          className="pd-hero"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: 'clamp(24px, 5vw, 60px)',
            background: BRAND.white,
            borderRadius: 16,
            padding: 'clamp(20px, 5vw, 48px)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.04), 0 20px 60px rgba(0,0,0,0.06)',
            border: '1px solid rgba(0,0,0,0.05)',
            alignItems: 'start',
          }}
        >
          {/* Left: Image Gallery */}
          <div>
            <div style={{
              aspectRatio: '1',
              background: BRAND.light,
              borderRadius: 12,
              padding: 'clamp(20px, 5vw, 40px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              position: 'relative', overflow: 'hidden',
              border: `1px solid ${BRAND.quaternary}30`,
            }}>
              {/* Radial glow */}
              <div style={{
                position: 'absolute', top: '50%', left: '50%',
                transform: 'translate(-50%,-50%)',
                width: '120%', height: '120%',
                background: `radial-gradient(circle, ${BRAND.light} 0%, transparent 70%)`,
                pointerEvents: 'none', opacity: 0.15,
              }} />

              <AnimatePresence mode="wait">
                <motion.div
                  key={currentImageIndex}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                  style={{ width: '100%', height: '100%', position: 'relative' }}
                >
                  <Image
                    src={images[currentImageIndex] || '/images/product.png'}
                    alt={product.name} fill unoptimized
                    style={{ objectFit: 'contain', filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.08))' }}
                  />
                </motion.div>
              </AnimatePresence>

              {images.length > 1 && (
                <>
                  <button onClick={handlePrevImage} style={{
                    position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
                    background: BRAND.white, border: 'none', borderRadius: '50%',
                    width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', zIndex: 10,
                  }}>
                    <ChevronLeft size={20} color={BRAND.primary} />
                  </button>
                  <button onClick={handleNextImage} style={{
                    position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                    background: BRAND.white, border: 'none', borderRadius: '50%',
                    width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', zIndex: 10,
                  }}>
                    <ChevronRight size={20} color={BRAND.primary} />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div style={{ display: 'flex', gap: 10, marginTop: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentImageIndex(i)}
                    style={{
                      width: 'clamp(52px, 10vw, 72px)', height: 'clamp(52px, 10vw, 72px)',
                      borderRadius: 8, overflow: 'hidden',
                      border: i === currentImageIndex ? `2.5px solid ${BRAND.primaryDark}` : `2.5px solid transparent`,
                      background: BRAND.white, cursor: 'pointer', transition: 'border-color 0.2s', padding: 4,
                    }}
                  >
                    <Image src={img} alt="thumb" width={72} height={72} unoptimized style={{ objectFit: 'contain' }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(16px, 4vw, 28px)' }}>

            {/* Title block */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12, flexWrap: 'wrap' }}>
                <Chip>Quality Verified</Chip>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Star size={16} fill={BRAND.primaryDark} color={BRAND.primaryDark} />
                  <span style={{ fontSize: F_SIZE.md, fontWeight: 900, color: BRAND.primaryDark }}>
                    {product.rating || 5.0}
                  </span>
                </div>
              </div>

              <h1 style={{
                fontSize: 'clamp(1.75rem, 4vw, 3rem)', fontWeight: 900, color: BRAND.primaryDark,
                margin: '0 0 8px', letterSpacing: '-0.03em', lineHeight: 1,
              }}>{product.name}</h1>

              <p style={{ fontFamily: FONTS.accent, fontSize: F_SIZE.lg, color: BRAND.primary, fontWeight: 700, marginBottom: 16 }}>
                Optimal Formulation Edition
              </p>

              <GoldLine style={{ marginBottom: 'clamp(16px, 4vw, 28px)', opacity: 0.6 }} />

              <p style={{
                fontSize: F_SIZE.md, color: BRAND.primary, lineHeight: 1.9, margin: 0, fontWeight: 500,
                borderLeft: `2px solid ${BRAND.primaryDark}`, paddingLeft: 22,
              }}>
                {product.description}
              </p>
            </div>

            {/* Package Selector */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <div style={{ width: 20, height: 1, background: BRAND.primaryDark }} />
                <span style={{
                  fontFamily: FONTS.main, fontSize: F_SIZE.sm,
                  letterSpacing: '0.24em', textTransform: 'uppercase',
                  color: BRAND.primary, fontWeight: 900,
                }}>Select Duration</span>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 160px), 1fr))',
                gap: 'clamp(10px, 2vw, 16px)',
              }}>
                {(product.packages || []).map((pkg, i) => (
                  <button
                    key={pkg.id}
                    onClick={() => { setSelectedPackage(i); setCurrentImageIndex(0); }}
                    style={{
                      padding: 'clamp(10px, 2vw, 20px) clamp(12px, 3vw, 24px)',
                      borderRadius: 8, textAlign: 'left', cursor: 'pointer',
                      transition: 'all 0.2s', position: 'relative',
                      border: i === selectedPackage
                        ? `2.5px solid ${BRAND.primaryDark}`
                        : `1.5px solid ${BRAND.quaternary}`,
                      background: i === selectedPackage ? `${BRAND.primaryDark}08` : BRAND.white,
                    }}
                  >
                    <div style={{ fontSize: F_SIZE.md, fontWeight: 900, color: i === selectedPackage ? BRAND.primaryDark : BRAND.primary }}>
                      {pkg.duration}
                    </div>
                    <div style={{ fontSize: F_SIZE.sm, color: BRAND.secondary, fontWeight: 700, marginTop: 4, letterSpacing: '0.04em' }}>
                      {pkg.pouches} Pouches
                    </div>
                    {pkg.savePct && (
                      <div style={{
                        position: 'absolute', top: 10, right: 10,
                        padding: '3px 8px', background: BRAND.primaryDark,
                        color: BRAND.white, fontSize: 10, fontWeight: 900, borderRadius: 2,
                      }}>SAVE {pkg.savePct}</div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Price & Add to Cart */}
            <div style={{
              background: BRAND.light,
              padding: 'clamp(16px, 4vw, 32px)',
              borderRadius: 12,
              border: `1px solid ${BRAND.quaternary}40`,
              display: 'flex', flexDirection: 'column',
              gap: 'clamp(14px, 3vw, 24px)',
            }}>
              {/* Price row */}
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 'clamp(1.75rem, 5vw, 2.5rem)', fontWeight: 900, color: BRAND.primary, letterSpacing: '-0.02em' }}>
                  ₹{price.toLocaleString()}
                </span>
                {packageData.origPrice && packageData.origPrice > price && (
                  <span style={{ fontSize: F_SIZE.lg, color: BRAND.secondary, fontWeight: 600, textDecoration: 'line-through' }}>
                    ₹{packageData.origPrice.toLocaleString()}
                  </span>
                )}
              </div>

              {/* Qty + Add to Cart — stack vertically on very small screens */}
              <div className="pd-action-row" style={{ display: 'flex', gap: 'clamp(10px, 2vw, 20px)', flexWrap: 'wrap' }}>
                {/* Quantity control */}
                <div style={{
                  display: 'inline-flex', alignItems: 'center',
                  gap: 'clamp(12px, 3vw, 24px)',
                  background: BRAND.white,
                  padding: '0 clamp(14px, 3vw, 24px)',
                  borderRadius: 6, border: `1px solid ${BRAND.quaternary}`,
                  height: 56, flexShrink: 0,
                }}>
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 26, padding: 0, color: BRAND.primary, fontWeight: 800, lineHeight: 1 }}
                  >−</button>
                  <span style={{ fontSize: F_SIZE.lg, fontWeight: 900, minWidth: 22, textAlign: 'center', color: BRAND.primaryDark }}>
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 22, padding: 0, color: BRAND.primary, fontWeight: 800, lineHeight: 1 }}
                  >+</button>
                </div>

                {/* Add to Cart */}
                <motion.button
                  whileHover={{ scale: 1.01, backgroundColor: BRAND.primaryDark }}
                  whileTap={{ scale: 0.99 }}
                  onClick={handleAddToCart}
                  style={{
                    flex: 1, minWidth: 'min(100%, 160px)',
                    background: BRAND.primary, color: BRAND.white,
                    border: 'none', borderRadius: 6,
                    fontSize: F_SIZE.sm, fontWeight: 900,
                    textTransform: 'uppercase', letterSpacing: '0.18em',
                    padding: '16px clamp(12px,3vw,18px)', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
                    boxShadow: '0 8px 32px rgba(50,45,41,0.12)',
                    transition: 'background-color 0.2s',
                  }}
                >
                  <ShoppingCart size={18} /> Add to Cart
                </motion.button>
              </div>

              {/* Shipping badges */}
              <div style={{ display: 'flex', gap: 'clamp(16px, 4vw, 32px)', flexWrap: 'wrap', opacity: 0.85 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <RotateCcw size={15} color={BRAND.primary} />
                  <span style={{ fontSize: F_SIZE.sm, fontWeight: 800, color: BRAND.secondary, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    Easy Returns
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Truck size={16} color={BRAND.primaryDark} />
                  <span style={{ fontSize: F_SIZE.sm, fontWeight: 800, color: BRAND.secondary, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    Express Delivery
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Benefits & Nutrients ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
          gap: 'clamp(20px, 4vw, 40px)',
          marginTop: 'clamp(20px, 4vw, 40px)',
        }}>
          {/* Benefits */}
          <div style={{
            background: BRAND.white,
            padding: 'clamp(20px, 5vw, 48px)',
            borderRadius: 16,
            boxShadow: '0 4px 20px rgba(0,0,0,0.04), 0 20px 60px rgba(0,0,0,0.06)',
            border: `1px solid ${BRAND.quaternary}30`,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 'clamp(16px, 4vw, 32px)', flexWrap: 'wrap' }}>
              <div style={{
                width: 48, height: 48, flexShrink: 0,
                background: `${BRAND.primaryDark}10`, borderRadius: 12,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Zap size={22} color={BRAND.primaryDark} />
              </div>
              <h3 style={{ fontSize: F_SIZE.lg, fontWeight: 900, margin: 0, letterSpacing: '-0.01em', color: BRAND.primary }}>
                Core Benefits
              </h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {(packageData.benefits || []).map((b: string, i: number) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: BRAND.primaryDark, marginTop: 9, flexShrink: 0 }} />
                  <span style={{ fontSize: F_SIZE.md, fontWeight: 600, color: BRAND.primary, lineHeight: 1.5 }}>{b}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Nutrients */}
          <div style={{
            background: BRAND.white,
            padding: 'clamp(20px, 5vw, 48px)',
            borderRadius: 16,
            boxShadow: '0 4px 20px rgba(0,0,0,0.04), 0 20px 60px rgba(0,0,0,0.06)',
            border: `1px solid ${BRAND.quaternary}30`,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 'clamp(16px, 4vw, 32px)', flexWrap: 'wrap' }}>
              <div style={{
                width: 48, height: 48, flexShrink: 0,
                background: `${BRAND.primaryDark}10`, borderRadius: 12,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <BarChart3 size={22} color={BRAND.primaryDark} />
              </div>
              <h3 style={{ fontSize: F_SIZE.lg, fontWeight: 900, margin: 0, letterSpacing: '-0.01em', color: BRAND.primary }}>
                Bio-Nutrient Profile
              </h3>
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 150px), 1fr))',
              gap: 'clamp(10px, 2vw, 16px)',
            }}>
              {(packageData.nutrients || []).map((n: ProductNutrient, i: number) => (
                <div key={i} style={{
                  padding: 'clamp(14px, 3vw, 24px)',
                  borderRadius: 8, background: BRAND.light,
                  border: `1px solid ${BRAND.quaternary}30`,
                }}>
                  <div style={{ fontSize: F_SIZE.sm, fontWeight: 800, color: BRAND.secondary, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 6 }}>
                    {n.label}
                  </div>
                  <div style={{ fontSize: F_SIZE.lg, fontWeight: 900, color: BRAND.primary, lineHeight: 1 }}>
                    {n.amount}
                  </div>
                  <div style={{ fontSize: 11, color: BRAND.primaryDark, fontWeight: 800, marginTop: 8, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    {n.friendly}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── FAQs & Reviews ── */}
        <div style={{ marginTop: 'clamp(48px, 10vw, 100px)', display: 'flex', flexDirection: 'column', gap: 'clamp(48px, 10vw, 100px)' }}>
          <ProductFAQ productId={product.id} />
          <ReviewsSection productId={product.id} />
        </div>
      </div>

      {/* ── Toast ── */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            style={{
              position: 'fixed', bottom: 40, left: '50%', x: '-50%',
              background: BRAND.primary, color: BRAND.white,
              padding: 'clamp(12px,3vw,16px) clamp(20px,5vw,32px)',
              borderRadius: 100, fontSize: F_SIZE.sm, fontWeight: 900,
              zIndex: 1000, boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
              textTransform: 'uppercase', letterSpacing: '0.1em',
              maxWidth: 'calc(100vw - 48px)', textAlign: 'center',
            }}
          >
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      <AuthModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />

      {/* Responsive breakpoints + font */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&family=Caveat:wght@600;700&display=swap');

        /* Hero: two columns on ≥768px */
        @media (min-width: 768px) {
          .pd-hero {
            grid-template-columns: 1fr 1fr !important;
          }
        }

        /* Action row: always in a row, wraps only if very tight */
        .pd-action-row {
          flex-wrap: nowrap;
        }
        @media (max-width: 380px) {
          .pd-action-row {
            flex-wrap: wrap;
          }
        }
      `}</style>
    </div>
  );
}