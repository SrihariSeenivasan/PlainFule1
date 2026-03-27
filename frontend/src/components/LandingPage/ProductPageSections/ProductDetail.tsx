'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { ShoppingCart, Star, ArrowLeft, Check, Zap, BarChart3, ChevronLeft, ChevronRight, Truck, RotateCcw } from 'lucide-react';
import { Product, ProductNutrient } from '@/lib/api';
import { useCart, CartItem } from '@/lib/cart-context';
import { useAuth } from '@/lib/auth-context';
import AuthModal from '@/components/AuthModal';
import ProductFAQ from './ProductFAQ';
import ReviewsSection from './ReviewsSection';
import { F_SIZE } from '@/lib/typography';

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
  mist: '#eef4ee',
  gold: '#b8953a',
  goldLight: '#d4af5a',
  champagne: '#f0e4c0',
  glassDark: 'rgba(4,14,7,0.88)',
};

const FONTS = {
  main: "'Montserrat', sans-serif",
  accent: "'Caveat', cursive",
};

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
    <div style={{ fontFamily: FONTS.main, minHeight: '100vh', background: C.offwhite }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '120px 24px 64px' }}>
        
        {/* Back Button */}
        <motion.button
          onClick={onBack}
          whileHover={{ x: -4 }}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: 'none', border: 'none', cursor: 'pointer',
            color: C.mid, fontWeight: 700, fontSize: F_SIZE.sm,
            marginBottom: 32, textTransform: 'uppercase', letterSpacing: '0.1em'
          }}
        >
          <ArrowLeft size={18} /> Back to Selection
        </motion.button>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
          gap: 60,
          background: C.white,
          borderRadius: 40,
          padding: '40px',
          boxShadow: '0 40px 100px -20px rgba(10, 61, 31, 0.1)',
          border: '1px solid rgba(10, 61, 31, 0.05)',
        }}>
          
          {/* Left: Image Gallery */}
          <div style={{ position: 'relative' }}>
            <div style={{ 
              aspectRatio: '1', 
              background: `linear-gradient(135deg, ${C.offwhite} 0%, ${C.white} 100%)`,
              borderRadius: 32,
              padding: 40,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              overflow: 'hidden',
              border: '1px solid rgba(0,0,0,0.03)'
            }}>
               {/* Visual Glow */}
               <div style={{ 
                    position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                    width: '120%', height: '120%', background: `radial-gradient(circle, rgba(74,222,128,0.12) 0%, transparent 70%)`,
                    pointerEvents: 'none'
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
                    style={{ objectFit: 'contain', filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.08))' }} 
                  />
                </motion.div>
              </AnimatePresence>

              {images.length > 1 && (
                <>
                  <button onClick={handlePrevImage} style={{ position: 'absolute', left: 20, top: '50%', transform: 'translateY(-50%)', background: C.white, border: 'none', borderRadius: '50%', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', zIndex: 10 }}>
                    <ChevronLeft size={20} color={C.mid} />
                  </button>
                  <button onClick={handleNextImage} style={{ position: 'absolute', right: 20, top: '50%', transform: 'translateY(-50%)', background: C.white, border: 'none', borderRadius: '50%', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', zIndex: 10 }}>
                    <ChevronRight size={20} color={C.mid} />
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
                      width: 60, height: 60, borderRadius: 12, overflow: 'hidden', border: i === currentImageIndex ? `2px solid ${C.mid}` : '2px solid transparent',
                      background: C.white, cursor: 'pointer', transition: 'all 0.2s', padding: 4
                    }}
                  >
                    <Image src={img} alt="thumb" width={60} height={60} style={{ objectFit: 'contain' }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: C.gold }}>
                    <Star size={16} fill={C.gold} />
                    <span style={{ fontSize: F_SIZE.md, fontWeight: 800, color: C.ink }}>{product.rating || 5.0}</span>
                  </div>
                  <span style={{ color: C.silver, fontSize: F_SIZE.sm, fontWeight: 500 }}>• {(product.reviews || 0).toLocaleString()} Verified Reviews</span>
              </div>
              <h1 style={{ fontSize: F_SIZE.xl, fontWeight: 900, color: C.ink, margin: 0, letterSpacing: '-0.02em' }}>{product.name}</h1>
              <p style={{ fontFamily: FONTS.accent, fontSize: F_SIZE.lg, color: C.mid, margin: '4px 0 20px' }}>Distilled Perfection</p>
              <p style={{ fontSize: F_SIZE.sm, color: '#4a554d', lineHeight: 1.8, margin: 0 }}>{product.description}</p>
            </div>

            {/* Package Selector */}
            <div>
               <p style={{ fontSize: F_SIZE.sm, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em', color: C.silver, marginBottom: 16 }}>Select Protocol</p>
               <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                 {(product.packages || []).map((pkg, i) => (
                   <button
                    key={pkg.id}
                    onClick={() => { setSelectedPackage(i); setCurrentImageIndex(0); }}
                    style={{
                      padding: '16px 24px', borderRadius: 16, border: i === selectedPackage ? `2px solid ${C.mid}` : '1px solid #e5e7eb',
                      background: i === selectedPackage ? `${C.mid}08` : C.white,
                      cursor: 'pointer', transition: 'all 0.2s', textAlign: 'left',
                      minWidth: 140, flex: 1
                    }}
                   >
                     <div style={{ fontSize: F_SIZE.sm, fontWeight: 800, color: i === selectedPackage ? C.mid : C.ink }}>{pkg.duration}</div>
                     <div style={{ fontSize: F_SIZE.sm, color: C.silver, marginTop: 2 }}>{pkg.pouches} Pouches</div>
                     {pkg.savePct && <div style={{ fontSize: F_SIZE.sm, fontWeight: 800, color: C.leaf, marginTop: 4 }}>Save {pkg.savePct}</div>}
                   </button>
                 ))}
               </div>
            </div>

            {/* Price & Action */}
            <div style={{ 
              background: C.offwhite, padding: 32, borderRadius: 24, border: '1px solid rgba(0,0,0,0.03)',
              display: 'flex', flexDirection: 'column', gap: 24
            }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
                <span style={{ fontSize: F_SIZE.xl, fontWeight: 900, color: C.mid }}>₹{price.toLocaleString()}</span>
                {packageData.origPrice && packageData.origPrice > price && (
                   <span style={{ fontSize: F_SIZE.md, color: C.silver, textDecoration: 'line-through' }}>₹{packageData.origPrice.toLocaleString()}</span>
                )}
              </div>

              <div style={{ display: 'flex', gap: 16 }}>
                <div style={{ 
                  display: 'flex', alignItems: 'center', gap: 20, 
                  background: C.white, padding: '8px 20px', borderRadius: 100,
                  border: '1px solid #e5e7eb'
                }}>
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 24, padding: 0, color: C.mid }}>-</button>
                  <span style={{ fontSize: F_SIZE.md, fontWeight: 800, minWidth: 20, textAlign: 'center' }}>{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 24, padding: 0, color: C.mid }}>+</button>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddToCart}
                  style={{
                    flex: 1, background: C.deep, color: C.white, border: 'none',
                    borderRadius: 100, fontSize: F_SIZE.sm, fontWeight: 900,
                    textTransform: 'uppercase', letterSpacing: '0.15em',
                    padding: '18px', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
                    boxShadow: '0 20px 40px -10px rgba(7, 26, 13, 0.3)'
                  }}
                >
                  <ShoppingCart size={18} /> Add to Protocol
                </motion.button>
              </div>

              <div style={{ display: 'flex', gap: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <RotateCcw size={14} color={C.mid} />
                  <span style={{ fontSize: F_SIZE.sm, fontWeight: 700, color: '#4a554d', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Easy Returns</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Truck size={14} color={C.mid} />
                  <span style={{ fontSize: F_SIZE.sm, fontWeight: 700, color: '#4a554d', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Fast Shipping</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Benefits & Nutrients */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 40, marginTop: 40 }}>
           {/* Benefits */}
           <div style={{ background: C.white, padding: 40, borderRadius: 32, boxShadow: '0 20px 60px -10px rgba(10, 61, 31, 0.05)' }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
               <div style={{ padding: 10, background: `${C.leaf}10`, borderRadius: 12 }}>
                 <Zap size={20} color={C.leaf} />
               </div>
               <h3 style={{ fontSize: F_SIZE.lg, fontWeight: 800, margin: 0 }}>Core Benefits</h3>
             </div>
             <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
               {(packageData.benefits || []).map((b: string, i: number) => (
                 <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                   <div style={{ width: 20, height: 20, borderRadius: '50%', background: `${C.leaf}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                     <Check size={12} color={C.leaf} strokeWidth={4} />
                   </div>
                   <span style={{ fontSize: F_SIZE.sm, fontWeight: 500, color: '#4a554d' }}>{b}</span>
                 </div>
               ))}
             </div>
           </div>

           {/* Nutrients */}
           <div style={{ background: C.white, padding: 40, borderRadius: 32, boxShadow: '0 20px 60px -10px rgba(10, 61, 31, 0.05)' }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
               <div style={{ padding: 10, background: `${C.gold}10`, borderRadius: 12 }}>
                 <BarChart3 size={20} color={C.gold} />
               </div>
               <h3 style={{ fontSize: F_SIZE.lg, fontWeight: 800, margin: 0 }}>Nutrient Profile</h3>
             </div>
             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
               {(packageData.nutrients || []).map((n: ProductNutrient, i: number) => (
                 <div key={i} style={{ padding: '16px', borderRadius: 16, background: C.offwhite, position: 'relative' }}>
                   <span style={{ fontSize: 22, position: 'absolute', right: 12, top: 12, opacity: 0.2 }}>{n.emoji}</span>
                   <div style={{ fontSize: F_SIZE.sm, fontWeight: 800, color: C.silver, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{n.label}</div>
                   <div style={{ fontSize: F_SIZE.lg, fontWeight: 900, color: C.mid, margin: '2px 0' }}>{n.amount}</div>
                   <div style={{ fontSize: F_SIZE.sm, color: '#4a554d', fontWeight: 500 }}>{n.friendly}</div>
                 </div>
               ))}
             </div>
           </div>
        </div>

        {/* FAQs & Reviews */}
        <div style={{ marginTop: 80, display: 'flex', flexDirection: 'column', gap: 80 }}>
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
              position: 'fixed', bottom: 40, left: '50%', transform: 'translateX(-50%)',
              background: C.deep, color: C.white, padding: '16px 32px', borderRadius: 100,
              fontSize: F_SIZE.sm, fontWeight: 700, zIndex: 1000, boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
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
