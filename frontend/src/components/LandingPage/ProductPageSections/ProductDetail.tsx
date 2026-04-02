'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { ShoppingCart, Star, ArrowLeft, Check, Zap, BarChart3, ChevronLeft, ChevronRight, Truck, RotateCcw } from 'lucide-react';
import { Product, ProductNutrient } from '@/lib/api';
import { useCart, CartItem } from '@/lib/cart-context';
import { useAuth } from '@/lib/auth-context';
import AuthModal from '@/components/AuthModal';
import ProductFAQ from './ProductFAQ';
import ReviewsSection from './ReviewsSection';
import { F_SIZE, BRAND } from '@/lib/typography';

/* ── Design Tokens ── */
const C = {
  forest: BRAND.primary,
  deep: BRAND.primary,
  mid: BRAND.primary,
  leaf: BRAND.primaryDark,
  ink: BRAND.primary,
  white: '#ffffff',
  offwhite: BRAND.light,
  silver: '#64748b',
  mist: BRAND.tertiary,
  gold: BRAND.primaryDark,
  goldLight: '#a16207',
  champagne: '#fef3c7',
  glass: 'rgba(255, 255, 255, 0.92)',
  glow: 'rgba(74,222,128,0.22)',
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
      color: BRAND.primary, fontWeight: 700,
      border: `1px solid ${BRAND.primary}40`,
      borderRadius: 2, padding: '5px 14px',
      backgroundColor: 'rgba(10, 61, 31, 0.05)',
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

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const packageData = product.packages?.[selectedPackage];
  const images = packageData?.images || [];
  const price = packageData?.price || 0;

  const handlePrevImage = () => {
    if (images.length > 0) {
      setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    }
  };

  const handleNextImage = () => {
    if (images.length > 0) {
      setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }
  };

  const handleAddToCart = async () => {
    if (!packageData) return;
    if (!user) {
      setShowLoginModal(true);
      return;
    }

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
    <div style={{ fontFamily: FONTS.main, minHeight: '100vh', background: BRAND.light }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '120px 24px 80px' }}>
        
        {/* Back Button */}
        <motion.button
          onClick={onBack}
          whileHover={{ x: -4 }}
          style={{
            display: 'flex', alignItems: 'center', gap: 12,
            background: 'none', border: 'none', cursor: 'pointer',
            color: BRAND.primary, fontWeight: 900, fontSize: F_SIZE.sm,
            marginBottom: 32, textTransform: 'uppercase', letterSpacing: '0.2em'
          }}
        >
          <ArrowLeft size={18} /> Back to Products
        </motion.button>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
          gap: 60,
          background: C.white,
          borderRadius: 16,
          padding: '48px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.04), 0 20px 60px rgba(0,0,0,0.06)',
          border: '1px solid rgba(0,0,0,0.05)',
          alignItems: 'start'
        }}>
          
          {/* Left: Image Gallery */}
          <div style={{ position: 'relative' }}>
            <div style={{ 
              aspectRatio: '1', 
              background: 'linear-gradient(160deg, #f8f9f8 0%, #f1f5f1 45%, #ffffff 100%)',
              borderRadius: 12,
              padding: 40,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              overflow: 'hidden',
              border: '1px solid rgba(0,0,0,0.03)'
            }}>
               <div style={{ 
                    position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                    width: '120%', height: '120%', background: `radial-gradient(circle, ${C.glow} 0%, transparent 70%)`,
                    pointerEvents: 'none', opacity: 0.15
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
                    alt={product.name} fill 
                    unoptimized={true}
                    style={{ objectFit: 'contain', filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.08))', backgroundColor: 'transparent' }} 
                  />
                </motion.div>
              </AnimatePresence>

              {images.length > 1 && (
                <>
                  <button onClick={handlePrevImage} style={{ position: 'absolute', left: 20, top: '50%', transform: 'translateY(-50%)', background: C.white, border: 'none', borderRadius: '50%', width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', zIndex: 10 }}>
                    <ChevronLeft size={22} color={BRAND.primary} />
                  </button>
                  <button onClick={handleNextImage} style={{ position: 'absolute', right: 20, top: '50%', transform: 'translateY(-50%)', background: C.white, border: 'none', borderRadius: '50%', width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', zIndex: 10 }}>
                    <ChevronRight size={22} color={BRAND.primary} />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div style={{ display: 'flex', gap: 12, marginTop: 20, justifyContent: 'center' }}>
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentImageIndex(i)}
                    style={{
                      width: 72, height: 72, borderRadius: 8, overflow: 'hidden', border: i === currentImageIndex ? `2.5px solid ${BRAND.primary}` : '2.5px solid transparent',
                      background: C.white, cursor: 'pointer', transition: 'all 0.2s', padding: 4
                    }}
                  >
                    <Image src={img} alt="thumb" width={72} height={72} unoptimized={true} style={{ objectFit: 'contain', backgroundColor: 'transparent' }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12 }}>
                 <Chip>Quality Verified</Chip>
                 <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: C.gold }}>
                    <Star size={16} fill={C.gold} color={C.gold} />
                    <span style={{ fontSize: F_SIZE.md, fontWeight: 900, color: C.ink }}>{product.rating || 5.0}</span>
                  </div>
              </div>

              <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, color: C.ink, margin: '0 0 8px', letterSpacing: '-0.03em', lineHeight: 1 }}>{product.name}</h1>
              <p style={{ fontFamily: FONTS.accent, fontSize: F_SIZE.lg, color: BRAND.primary, fontWeight: 700, marginBottom: 20 }}>Optimal Formulation Edition</p>
              
              <GoldLine style={{ marginBottom: 28, opacity: 0.6 }} />
              
              <p style={{ 
                fontSize: F_SIZE.md, color: '#3c4a3e', lineHeight: 1.9, margin: 0, fontWeight: 500,
                borderLeft: `2px solid ${C.gold}`, paddingLeft: 22
              }}>
                {product.description}
              </p>
            </div>

            {/* Package Selector */}
            <div>
               <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
                 <div style={{ width: 20, height: 1, background: C.gold }} />
                 <span style={{
                   fontFamily: FONTS.main, fontSize: F_SIZE.sm, letterSpacing: '0.24em',
                   textTransform: 'uppercase', color: BRAND.primary, fontWeight: 900,
                 }}>Select Duration</span>
               </div>
               
               <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                 {(product.packages || []).map((pkg, i) => (
                   <button
                    key={pkg.id}
                    onClick={() => { setSelectedPackage(i); setCurrentImageIndex(0); }}
                    style={{
                      padding: '20px 24px', borderRadius: 8, border: i === selectedPackage ? `2.5px solid ${BRAND.primary}` : '1.5px solid rgba(0,0,0,0.08)',
                      background: i === selectedPackage ? `${BRAND.primary}04` : C.white,
                      cursor: 'pointer', transition: 'all 0.2s', textAlign: 'left',
                      position: 'relative'
                    }}
                   >
                     <div style={{ fontSize: F_SIZE.md, fontWeight: 900, color: i === selectedPackage ? BRAND.primary : C.ink }}>{pkg.duration}</div>
                     <div style={{ fontSize: F_SIZE.sm, color: C.silver, fontWeight: 700, marginTop: 4, letterSpacing: '0.04em' }}>{pkg.pouches} Pouches</div>
                     {pkg.savePct && (
                       <div style={{ 
                         position: 'absolute', top: 12, right: 12, padding: '4px 10px', 
                         background: BRAND.primaryDark, color: C.white, fontSize: 10, fontWeight: 900, borderRadius: 2
                       }}>SAVE {pkg.savePct}</div>
                     )}
                   </button>
                 ))}
               </div>
            </div>

            {/* Price & Action */}
            <div style={{ 
              background: C.mist, padding: '32px 40px', borderRadius: 12, border: '1px solid rgba(0,0,0,0.05)',
              display: 'flex', flexDirection: 'column', gap: 24, boxShadow: '0 10px 30px -10px rgba(0,0,0,0.03)'
            }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 16 }}>
                <span style={{ fontSize: '2.5rem', fontWeight: 900, color: BRAND.primary, letterSpacing: '-0.02em' }}>₹{price.toLocaleString()}</span>
                {packageData.origPrice && packageData.origPrice > price && (
                   <span style={{ fontSize: F_SIZE.lg, color: C.silver, fontWeight: 600, textDecoration: 'line-through' }}>₹{packageData.origPrice.toLocaleString()}</span>
                )}
              </div>

              <div style={{ display: 'flex', gap: 20 }}>
                <div style={{ 
                  display: 'flex', alignItems: 'center', gap: 24, 
                  background: C.white, padding: '0 24px', borderRadius: 6,
                  border: '1px solid rgba(0,0,0,0.08)', height: 62
                }}>
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 28, padding: 0, color: BRAND.primary, fontWeight: 800 }}>−</button>
                  <span style={{ fontSize: F_SIZE.lg, fontWeight: 900, minWidth: 24, textAlign: 'center', color: C.ink }}>{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 24, padding: 0, color: BRAND.primary, fontWeight: 800 }}>+</button>
                </div>

                <motion.button
                  whileHover={{ scale: 1.01, backgroundColor: BRAND.primary }}
                  whileTap={{ scale: 0.99 }}
                  onClick={handleAddToCart}
                  style={{
                    flex: 1, background: BRAND.primary, color: C.white, border: 'none',
                    borderRadius: 6, fontSize: F_SIZE.sm, fontWeight: 900,
                    textTransform: 'uppercase', letterSpacing: '0.22em',
                    padding: '18px', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14,
                    boxShadow: '0 8px 32px rgba(10,61,31,0.12)'
                  }}
                >
                  <ShoppingCart size={20} /> Add to Cart
                </motion.button>
              </div>

              <div style={{ display: 'flex', gap: 32, opacity: 0.8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <RotateCcw size={16} color={BRAND.primary} />
                  <span style={{ fontSize: F_SIZE.sm, fontWeight: 800, color: C.silver, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Easy Returns</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Truck size={16} color={BRAND.primary} />
                  <span style={{ fontSize: F_SIZE.sm, fontWeight: 800, color: C.silver, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Express Delivery</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Benefits & Nutrients */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 40, marginTop: 40 }}>
           {/* Benefits */}
           <div style={{ 
             background: C.white, padding: '48px', borderRadius: 16, 
             boxShadow: '0 4px 20px rgba(0,0,0,0.04), 0 20px 60px rgba(0,0,0,0.06)', 
             border: '1px solid rgba(0,0,0,0.05)'
           }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 32 }}>
               <div style={{ width: 48, height: 48, background: `${BRAND.primaryDark}10`, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                 <Zap size={22} color={BRAND.primaryDark} />
               </div>
               <h3 style={{ fontSize: F_SIZE.lg, fontWeight: 900, margin: 0, letterSpacing: '-0.01em' }}>Core Benefits</h3>
             </div>
             <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
               {(packageData.benefits || []).map((b: string, i: number) => (
                 <div key={i} style={{ display: 'flex', alignItems: 'start', gap: 16 }}>
                   <div style={{ width: 6, height: 6, borderRadius: '50%', background: BRAND.primaryDark, marginTop: 8 }} />
                   <span style={{ fontSize: F_SIZE.md, fontWeight: 600, color: '#3c4a3e', lineHeight: 1.4 }}>{b}</span>
                 </div>
               ))}
             </div>
           </div>

           {/* Nutrients */}
           <div style={{ 
             background: C.white, padding: '48px', borderRadius: 16, 
             boxShadow: '0 4px 20px rgba(0,0,0,0.04), 0 20px 60px rgba(0,0,0,0.06)', 
             border: '1px solid rgba(0,0,0,0.05)'
           }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 32 }}>
               <div style={{ width: 48, height: 48, background: `${C.gold}10`, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                 <BarChart3 size={22} color={C.gold} />
               </div>
               <h3 style={{ fontSize: F_SIZE.lg, fontWeight: 900, margin: 0, letterSpacing: '-0.01em' }}>Bio-Nutrient Profile</h3>
             </div>
             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
               {(packageData.nutrients || []).map((n: ProductNutrient, i: number) => (
                 <div key={i} style={{ padding: '24px', borderRadius: 8, background: C.mist, border: '1px solid rgba(0,0,0,0.03)' }}>
                   <div style={{ fontSize: F_SIZE.sm, fontWeight: 800, color: C.silver, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 6 }}>{n.label}</div>
                   <div style={{ fontSize: F_SIZE.lg, fontWeight: 900, color: BRAND.primary, lineHeight: 1 }}>{n.amount}</div>
                   <div style={{ fontSize: 11, color: C.gold, fontWeight: 800, marginTop: 8, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{n.friendly}</div>
                 </div>
               ))}
             </div>
           </div>
        </div>

        {/* FAQs & Reviews (Simplified & Themed) */}
        <div style={{ marginTop: 100, display: 'flex', flexDirection: 'column', gap: 100 }}>
           <ProductFAQ productId={product.id} />
           <ReviewsSection productId={product.id} />
        </div>
      </div>

      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            style={{
              position: 'fixed', bottom: 40, left: '50%', x: '-50%',
              background: BRAND.primary, color: C.white, padding: '16px 32px', borderRadius: 100,
              fontSize: F_SIZE.sm, fontWeight: 900, zIndex: 1000, boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
              textTransform: 'uppercase', letterSpacing: '0.1em'
            }}
          >
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      <AuthModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
      
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&family=Caveat:wght@600;700&display=swap');
      `}</style>
    </div>
  );
}



