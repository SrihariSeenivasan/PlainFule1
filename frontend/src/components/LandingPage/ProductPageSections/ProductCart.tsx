'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Trash2, Plus, Minus, ShoppingCart, ArrowLeft, LogIn, ShieldCheck, Truck, RefreshCw } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import AuthModal from '@/components/AuthModal';
import MainLayout from '@/components/MainLayout';
import { F_SIZE, BRAND, FONTS } from '@/lib/typography';

/* ── Components ── */
function GoldLine({ style }: { style?: React.CSSProperties }) {
  return (
    <div style={{
      height: 1, width: '100%',
      background: `linear-gradient(to right, transparent, ${BRAND.stone}99, transparent)`,
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
      border: `1px solid ${BRAND.stone}40`,
      borderRadius: 2, padding: '5px 14px',
      backgroundColor: 'rgba(50, 45, 41, 0.05)',
    }}>{children}</span>
  );
}

export default function ProductCart() {
  const router = useRouter();
  const { user } = useAuth();
  const { items, totalPrice, totalItems, removeFromCart, updateQuantity, clearCart } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleProceedToCheckout = async () => {
    if (items.length === 0) return;
    setIsCheckingOut(true);
    try {
      router.push('/checkout');
    } catch (err) {
      console.error('Checkout error:', err);
      setToastMessage('Failed to proceed to checkout. Please try again.');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } finally {
      setIsCheckingOut(false);
    }
  };

  const handleRemoveItem = async (id: string | number) => {
    try {
      await removeFromCart(id);
      setToastMessage('Item removed from cart');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    } catch (err) {
      console.error('Error removing item:', err);
      setToastMessage('Failed to remove item');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    }
  };

  const handleClearCart = async () => {
    if (window.confirm('Are you sure you want to clear your entire cart?')) {
      try {
        await clearCart();
        setToastMessage('Cart cleared');
        setShowToast(true);
        setTimeout(() => setShowToast(false), 2000);
      } catch (err) {
        console.error('Error clearing cart:', err);
        setToastMessage('Failed to clear cart');
        setShowToast(true);
        setTimeout(() => setShowToast(false), 2000);
      }
    }
  };

  if (items.length === 0) {
    return (
      <MainLayout background={BRAND.cream}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '160px 24px 100px', textAlign: 'center', fontFamily: FONTS.main }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div style={{ marginBottom: 32, display: 'flex', justifyContent: 'center' }}>
              <Chip>Status Report — Empty</Chip>
            </div>
            
            <div style={{ 
              width: 120, height: 120, borderRadius: '50%', background: BRAND.white,
              display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 40px',
              border: `1px solid ${BRAND.stone}40`, boxShadow: '0 10px 30px rgba(50,45,41,0.04)'
            }}>
              <ShoppingCart size={48} color={BRAND.taupe} strokeWidth={1.5} />
            </div>

            <h1 style={{ fontSize: F_SIZE.xl, fontWeight: 900, color: BRAND.espresso, margin: '0 0 16px', letterSpacing: '-0.04em', lineHeight: 1 }}>
              Your <span style={{ fontWeight: 300, color: BRAND.taupe }}>Cart</span> is Empty
            </h1>

            <p style={{ fontSize: F_SIZE.lg, fontFamily: FONTS.accent, color: BRAND.taupe, fontWeight: 700, marginBottom: 48 }}>
              Let's find the right products for your daily needs.
            </p>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push('/products')}
              style={{
                padding: '18px 36px', background: BRAND.espresso, color: BRAND.white, border: 'none', borderRadius: 6,
                fontSize: F_SIZE.sm, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.22em',
                cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 12, transition: 'all 0.3s ease',
                boxShadow: `0 8px 32px rgba(50,45,41,0.12)`
              }}
            >
              <ArrowLeft size={18} /> Continue Shopping
            </motion.button>
          </motion.div>
        </div>
        <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
      </MainLayout>
    );
  }

  return (
    <MainLayout background={BRAND.cream}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '160px 24px 100px', position: 'relative', zIndex: 1, fontFamily: FONTS.main }}>
        
        {/* Header */}
        <div style={{ marginBottom: 56 }}>
          <Chip>Cart — {totalItems} {totalItems === 1 ? 'Item' : 'Items'}</Chip>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 20, marginTop: 24 }}>
            <h1 style={{ fontSize: F_SIZE.xl, fontWeight: 900, color: BRAND.espresso, margin: 0, letterSpacing: '-0.04em', lineHeight: 1 }}>
              Shopping <span style={{ fontWeight: 300, color: BRAND.taupe }}>Cart</span>
            </h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', marginTop: 12 }}>
            <GoldLine style={{ width: 180 }} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 380px', gap: 40, alignItems: 'start' }}>
          {/* Cart Items List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div style={{ 
              background: BRAND.white, border: `1px solid ${BRAND.stone}40`, 
              borderRadius: 16, overflow: 'hidden', boxShadow: '0 4px 20px rgba(50,45,41,0.04), 0 20px 60px rgba(50,45,41,0.06)' 
            }}>
              <div style={{ padding: '28px 32px', borderBottom: `1px solid ${BRAND.stone}40` }}>
                <h2 style={{ fontSize: F_SIZE.lg, fontWeight: 900, color: BRAND.espresso, margin: 0 }}>Order Summary</h2>
              </div>

              <div style={{ padding: '32px' }}>
                <AnimatePresence mode="popLayout">
                  {items.map((item, index) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ delay: index * 0.05 }}
                      style={{
                        display: 'grid', gridTemplateColumns: '120px 1fr', gap: 28,
                        paddingBottom: 28, marginBottom: 28, borderBottom: `1px solid ${BRAND.stone}40`
                      }}
                    >
                      {/* Product Image */}
                      <div style={{
                        width: 120, height: 120, borderRadius: 8, overflow: 'hidden',
                        background: 'linear-gradient(160deg, #f8f9f8 0%, #ffffff 100%)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 10, border: `1px solid ${BRAND.stone}20`
                      }}>
                        <div style={{ position: 'relative', width: '80%', height: '80%' }}>
                           <Image src={item.image} alt={item.productName} fill style={{ objectFit: 'contain', filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.08))' }} />
                        </div>
                      </div>

                      {/* Product Details */}
                      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                             <h3 style={{ fontSize: F_SIZE.md, fontWeight: 900, color: BRAND.espresso, margin: '0 0 6px' }}>{item.productName}</h3>
                             <motion.button 
                               whileHover={{ scale: 1.1, color: BRAND.burgundy }}
                               onClick={() => handleRemoveItem(item.id!)}
                               style={{ background: 'none', border: 'none', color: BRAND.taupe, cursor: 'pointer', padding: 4 }}
                             >
                                <Trash2 size={18} />
                             </motion.button>
                          </div>
                          <p style={{ fontSize: F_SIZE.sm, color: BRAND.taupe, margin: '0 0 12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                            {item.packageName}
                          </p>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <span style={{ fontSize: F_SIZE.md, fontWeight: 900, color: BRAND.espresso }}>₹{item.price.toLocaleString()}</span>
                            {item.origPrice && item.origPrice > item.price && (
                              <span style={{ fontSize: F_SIZE.sm, color: BRAND.taupe, textDecoration: 'line-through' }}>₹{item.origPrice.toLocaleString()}</span>
                            )}
                          </div>
                        </div>

                        {/* Quantity Controls */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginTop: 12 }}>
                          <div style={{ 
                            display: 'flex', alignItems: 'center', gap: 16, border: `1px solid ${BRAND.stone}60`, borderRadius: 4, padding: '4px 12px', background: BRAND.cream
                          }}>
                            <button onClick={() => updateQuantity(item.id!, item.quantity - 1)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: BRAND.espresso, fontWeight: 900, fontSize: 18 }}>−</button>
                            <span style={{ fontSize: F_SIZE.sm, fontWeight: 900, color: BRAND.espresso, minWidth: 24, textAlign: 'center' }}>{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.id!, item.quantity + 1)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: BRAND.espresso, fontWeight: 900, fontSize: 18 }}>+</button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                
                <motion.button
                  whileHover={{ color: BRAND.burgundy, x: 2 }}
                  onClick={handleClearCart}
                  style={{
                    background: 'none', border: 'none', color: BRAND.taupe, fontFamily: FONTS.main,
                    fontSize: 11, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.15em',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8
                  }}
                >
                  Clear Entire Cart <RefreshCw size={12} />
                </motion.button>
              </div>
            </div>
          </div>

          {/* Checkout Summary Sidebar */}
          <div style={{ position: 'sticky', top: 120 }}>
            <div style={{ 
              background: BRAND.white, border: `1px solid ${BRAND.stone}40`, borderRadius: 16, 
              padding: '36px', boxShadow: '0 10px 30px -10px rgba(50,45,41,0.04)' 
            }}>
              <h3 style={{ fontSize: F_SIZE.lg, fontWeight: 900, color: BRAND.espresso, margin: '0 0 24px', letterSpacing: '-0.01em' }}>Billing Details</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                   <span style={{ fontSize: F_SIZE.sm, color: BRAND.taupe, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Cart Value</span>
                  <span style={{ fontWeight: 600, color: BRAND.espresso }}>₹{totalPrice.toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: F_SIZE.sm, color: BRAND.taupe, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Priority Shipping</span>
                  <span style={{ fontWeight: 800, color: BRAND.burgundy }}>FREE</span>
                </div>
                
                <GoldLine style={{ margin: '12px 0' }} />
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontSize: F_SIZE.md, fontWeight: 900, color: BRAND.espresso }}>Total Order Value</span>
                   <span style={{ fontSize: F_SIZE.lg, fontWeight: 900, color: BRAND.espresso }}>₹{totalPrice.toLocaleString()}</span>
                </div>

                <motion.button
                  whileHover={{ scale: 1.01, backgroundColor: BRAND.burgundy }}
                  whileTap={{ scale: 0.99 }}
                  onClick={handleProceedToCheckout}
                  disabled={isCheckingOut}
                  style={{
                    marginTop: 24, padding: '20px', background: BRAND.espresso, color: BRAND.white, border: 'none',
                    borderRadius: 6, fontSize: F_SIZE.sm, fontWeight: 900, textTransform: 'uppercase',
                    letterSpacing: '0.22em', cursor: isCheckingOut ? 'not-allowed' : 'pointer',
                    boxShadow: `0 8px 32px rgba(50,45,41,0.12)`, transition: 'all 0.3s ease',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, opacity: isCheckingOut ? 0.7 : 1
                  }}
                >
                  {isCheckingOut ? 'Processing...' : (
                    <>
                      Proceed to Checkout <ArrowLeft size={18} style={{ transform: 'rotate(180deg)' }} />
                    </>
                  )}
                </motion.button>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 24, padding: '20px', background: BRAND.cream, borderRadius: 8 }}>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <ShieldCheck size={16} color={BRAND.taupe} />
                    <span style={{ fontSize: 10, fontWeight: 800, color: BRAND.taupe, textTransform: 'uppercase', letterSpacing: '0.05em' }}>End-to-End SSL Encrypted</span>
                  </div>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <Truck size={16} color={BRAND.taupe} />
                    <span style={{ fontSize: 10, fontWeight: 800, color: BRAND.taupe, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Express Delivery Verified</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            style={{
              position: 'fixed', bottom: 40, left: '50%', x: '-50%',
              background: BRAND.espresso, color: BRAND.white, padding: '16px 32px', borderRadius: 100,
              fontSize: 13, fontWeight: 900, zIndex: 1000, boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
              textTransform: 'uppercase', letterSpacing: '0.15em'
            }}
          >
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
      
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&family=Caveat:wght@600;700&display=swap');
      `}</style>
    </MainLayout>
  );
}



