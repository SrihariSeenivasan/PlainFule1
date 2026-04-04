'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Trash2, ShoppingCart, ArrowLeft, ShieldCheck, Truck, RefreshCw } from 'lucide-react';
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
      background: `linear-gradient(to right, transparent, ${BRAND.tertiary}99, transparent)`,
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
      border: `1px solid ${BRAND.tertiary}40`,
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

  /* ── Empty State ── */
  if (items.length === 0) {
    return (
      <MainLayout background={BRAND.light}>
        <div style={{
          maxWidth: 1200, margin: '0 auto',
          padding: 'clamp(100px, 15vw, 160px) clamp(16px, 5vw, 24px) clamp(48px, 8vw, 100px)',
          textAlign: 'center', fontFamily: FONTS.main,
        }}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <div style={{ marginBottom: 32, display: 'flex', justifyContent: 'center' }}>
              <Chip>Status Report — Empty</Chip>
            </div>

            <div style={{
              width: 120, height: 120, borderRadius: '50%', background: BRAND.white,
              display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 40px',
              border: `1px solid ${BRAND.tertiary}40`, boxShadow: '0 10px 30px rgba(50,45,41,0.04)',
            }}>
              <ShoppingCart size={48} color={BRAND.secondary} strokeWidth={1.5} />
            </div>

            <h1 style={{
              fontSize: F_SIZE.xl, fontWeight: 900, color: BRAND.primary,
              margin: '0 0 16px', letterSpacing: '-0.04em', lineHeight: 1,
            }}>
              Your <span style={{ fontWeight: 300, color: BRAND.secondary }}>Cart</span> is Empty
            </h1>

            <p style={{
              fontSize: F_SIZE.lg, fontFamily: FONTS.accent, color: BRAND.secondary,
              fontWeight: 700, marginBottom: 48,
            }}>
              Lets find the right products for your daily needs.
            </p>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push('/products')}
              style={{
                padding: '18px 36px', background: BRAND.primary, color: BRAND.white,
                border: 'none', borderRadius: 6,
                fontSize: F_SIZE.sm, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.22em',
                cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 12,
                transition: 'all 0.3s ease', boxShadow: '0 8px 32px rgba(50,45,41,0.12)',
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

  /* ── Cart Page ── */
  return (
    <MainLayout background={BRAND.light}>
      <div style={{
        maxWidth: 1200, margin: '0 auto',
        padding: 'clamp(80px, 12vw, 160px) clamp(16px, 5vw, 20px) clamp(40px, 8vw, 100px)',
        position: 'relative', zIndex: 1, fontFamily: FONTS.main,
      }}>

        {/* ── Header ── */}
        <div style={{ marginBottom: 'clamp(28px, 5vw, 56px)' }}>
          <Chip>Cart — {totalItems} {totalItems === 1 ? 'Item' : 'Items'}</Chip>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 20, marginTop: 24 }}>
            <h1 style={{
              fontSize: F_SIZE.xl, fontWeight: 900, color: BRAND.primary,
              margin: 0, letterSpacing: '-0.04em', lineHeight: 1,
            }}>
              Shopping <span style={{ fontWeight: 300, color: BRAND.secondary }}>Cart</span>
            </h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', marginTop: 12 }}>
            <GoldLine style={{ width: 180 }} />
          </div>
        </div>

        {/* ── Two-column layout → stacks on mobile ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr)',
          gap: 'clamp(20px, 4vw, 40px)',
        }}>
          {/* Responsive override via a style tag — avoids JS media query */}
          <style>{`
            @media (min-width: 768px) {
              .cart-grid { grid-template-columns: minmax(0, 1fr) clamp(280px, 36vw, 380px) !important; }
            }
          `}</style>

          {/* Apply class via a wrapper trick — inline style on the parent div already set, class applied below */}

          {/* Cart Items Card */}
          <div style={{
            background: BRAND.white,
            border: `1px solid ${BRAND.tertiary}40`,
            borderRadius: 16, overflow: 'hidden',
            boxShadow: '0 4px 20px rgba(50,45,41,0.04), 0 20px 60px rgba(50,45,41,0.06)',
          }}>
            <div style={{
              padding: 'clamp(16px, 4vw, 28px) clamp(16px, 4vw, 32px)',
              borderBottom: `1px solid ${BRAND.tertiary}40`,
            }}>
              <h2 style={{ fontSize: F_SIZE.lg, fontWeight: 900, color: BRAND.primary, margin: 0 }}>Order Summary</h2>
            </div>

            <div style={{ padding: 'clamp(16px, 4vw, 32px)' }}>
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
                      display: 'grid',
                      gridTemplateColumns: 'clamp(72px, 18vw, 120px) 1fr',
                      gap: 'clamp(14px, 3vw, 28px)',
                      paddingBottom: 'clamp(16px, 4vw, 28px)',
                      marginBottom: 'clamp(16px, 4vw, 28px)',
                      borderBottom: `1px solid ${BRAND.tertiary}40`,
                    }}
                  >
                    {/* Product Image */}
                    <div style={{
                      width: '100%',
                      aspectRatio: '1 / 1',
                      borderRadius: 8, overflow: 'hidden',
                      background: 'linear-gradient(160deg, #f8f9f8 0%, #ffffff 100%)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      padding: 10, border: `1px solid ${BRAND.tertiary}20`,
                    }}>
                      <div style={{ position: 'relative', width: '80%', height: '80%' }}>
                        <Image
                          src={item.image} alt={item.productName} fill
                          style={{ objectFit: 'contain', filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.08))' }}
                        />
                      </div>
                    </div>

                    {/* Product Details */}
                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minWidth: 0 }}>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                          <h3 style={{
                            fontSize: F_SIZE.md, fontWeight: 900, color: BRAND.primary,
                            margin: '0 0 6px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                          }}>{item.productName}</h3>
                          <motion.button
                            whileHover={{ scale: 1.1, color: BRAND.primaryDark }}
                            onClick={() => handleRemoveItem(item.id!)}
                            style={{ background: 'none', border: 'none', color: BRAND.secondary, cursor: 'pointer', padding: 4, flexShrink: 0 }}
                          >
                            <Trash2 size={16} />
                          </motion.button>
                        </div>

                        <p style={{
                          fontSize: F_SIZE.sm, color: BRAND.secondary,
                          margin: '0 0 10px', fontWeight: 700,
                          textTransform: 'uppercase', letterSpacing: '0.04em',
                          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                        }}>
                          {item.packageName}
                        </p>

                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                          <span style={{ fontSize: F_SIZE.md, fontWeight: 900, color: BRAND.primary }}>
                            ₹{item.price.toLocaleString()}
                          </span>
                          {item.origPrice && item.origPrice > item.price && (
                            <span style={{ fontSize: F_SIZE.sm, color: BRAND.secondary, textDecoration: 'line-through' }}>
                              ₹{item.origPrice.toLocaleString()}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Quantity Controls */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 12, flexWrap: 'wrap' }}>
                        <div style={{
                          display: 'inline-flex', alignItems: 'center', gap: 'clamp(8px, 2vw, 16px)',
                          border: `1px solid ${BRAND.tertiary}60`, borderRadius: 4,
                          padding: '4px clamp(8px, 2vw, 12px)', background: BRAND.light,
                        }}>
                          <button
                            onClick={() => updateQuantity(item.id!, item.quantity - 1)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: BRAND.primary, fontWeight: 900, fontSize: 18, lineHeight: 1 }}
                          >−</button>
                          <span style={{ fontSize: F_SIZE.sm, fontWeight: 900, color: BRAND.primary, minWidth: 20, textAlign: 'center' }}>
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id!, item.quantity + 1)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: BRAND.primary, fontWeight: 900, fontSize: 18, lineHeight: 1 }}
                          >+</button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              <motion.button
                whileHover={{ color: BRAND.primaryDark, x: 2 }}
                onClick={handleClearCart}
                style={{
                  background: 'none', border: 'none', color: BRAND.secondary, fontFamily: FONTS.main,
                  fontSize: 11, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.15em',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
                }}
              >
                Clear Entire Cart <RefreshCw size={12} />
              </motion.button>
            </div>
          </div>

          {/* ── Billing Summary ── */}
          {/* On mobile: full width, no sticky. On ≥768px: sticky sidebar */}
          <div>
            <div style={{
              background: BRAND.white, border: `1px solid ${BRAND.tertiary}40`,
              borderRadius: 16, padding: 'clamp(20px, 5vw, 36px)',
              boxShadow: '0 10px 30px -10px rgba(50,45,41,0.04)',
              position: 'sticky', top: 'clamp(80px, 10vw, 120px)',
            }}>
              <h3 style={{
                fontSize: F_SIZE.lg, fontWeight: 900, color: BRAND.primary,
                margin: '0 0 24px', letterSpacing: '-0.01em',
              }}>Billing Details</h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: F_SIZE.sm, color: BRAND.secondary, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Cart Value
                  </span>
                  <span style={{ fontWeight: 600, color: BRAND.primary }}>₹{totalPrice.toLocaleString()}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: F_SIZE.sm, color: BRAND.secondary, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Priority Shipping
                  </span>
                  <span style={{ fontWeight: 800, color: BRAND.primaryDark }}>FREE</span>
                </div>

                <GoldLine style={{ margin: '12px 0' }} />

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12 }}>
                  <span style={{ fontSize: F_SIZE.md, fontWeight: 900, color: BRAND.primary }}>Total Order Value</span>
                  <span style={{ fontSize: F_SIZE.lg, fontWeight: 900, color: BRAND.primary, flexShrink: 0 }}>
                    ₹{totalPrice.toLocaleString()}
                  </span>
                </div>

                <motion.button
                  whileHover={{ scale: 1.01, backgroundColor: BRAND.primaryDark }}
                  whileTap={{ scale: 0.99 }}
                  onClick={handleProceedToCheckout}
                  disabled={isCheckingOut}
                  style={{
                    marginTop: 24, padding: 'clamp(14px, 3vw, 20px)',
                    background: BRAND.primary, color: BRAND.white,
                    border: 'none', borderRadius: 6,
                    fontSize: F_SIZE.sm, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.22em',
                    cursor: isCheckingOut ? 'not-allowed' : 'pointer',
                    boxShadow: '0 8px 32px rgba(50,45,41,0.12)', transition: 'all 0.3s ease',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
                    opacity: isCheckingOut ? 0.7 : 1, width: '100%',
                  }}
                >
                  {isCheckingOut ? 'Processing...' : (
                    <>Proceed to Checkout <ArrowLeft size={18} style={{ transform: 'rotate(180deg)' }} /></>
                  )}
                </motion.button>

                <div style={{
                  display: 'flex', flexDirection: 'column', gap: 12, marginTop: 8,
                  padding: 'clamp(14px, 3vw, 20px)', background: BRAND.light, borderRadius: 8,
                }}>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <ShieldCheck size={16} color={BRAND.secondary} />
                    <span style={{ fontSize: 10, fontWeight: 800, color: BRAND.secondary, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      End-to-End SSL Encrypted
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <Truck size={16} color={BRAND.secondary} />
                    <span style={{ fontSize: 10, fontWeight: 800, color: BRAND.secondary, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Express Delivery Verified
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Responsive two-column grid injection */}
        <style>{`
          @media (min-width: 768px) {
            .cart-outer-grid {
              grid-template-columns: minmax(0, 1fr) clamp(280px, 36vw, 380px) !important;
            }
          }
        `}</style>
      </div>

      {/* ── Toast ── */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            style={{
              position: 'fixed', bottom: 40, left: '50%', x: '-50%',
              background: BRAND.primary, color: BRAND.white,
              padding: 'clamp(12px, 3vw, 16px) clamp(20px, 5vw, 32px)',
              borderRadius: 100, fontSize: 13, fontWeight: 900,
              zIndex: 1000, boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
              textTransform: 'uppercase', letterSpacing: '0.15em',
              maxWidth: 'calc(100vw - 48px)', textAlign: 'center',
            }}
          >
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&family=Caveat:wght@600;700&display=swap');
      `}</style>
    </MainLayout>
  );
}