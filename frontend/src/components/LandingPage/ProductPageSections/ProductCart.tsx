'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Trash2, Plus, Minus, ShoppingCart, ArrowLeft, LogIn } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import AuthModal from '@/components/AuthModal';
import MainLayout from '@/components/MainLayout';

const FD = "'Playfair Display', Georgia, serif";
const FS = "'DM Sans', 'Helvetica Neue', sans-serif";
const G = '#15803d';
const BG = '#fdfaf3';

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
      // Navigate to checkout page
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
      <MainLayout background={BG}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 24px', paddingTop: 120, textAlign: 'center' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {!user ? (
              <>
                {/* Not logged in - show login prompt */}
                <div style={{
                  width: 80,
                  height: 80,
                  margin: '0 auto 24px',
                  background: 'rgba(21,128,61,0.1)',
                  borderRadius: 16,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <LogIn size={40} color={G} />
                </div>

                <h1 style={{
                  fontFamily: FD,
                  fontSize: 'clamp(28px, 5vw, 42px)',
                  fontWeight: 800,
                  color: '#1a1a1a',
                  margin: '0 0 12px',
                }}>
                  Sign In to Your Cart
                </h1>

                <p style={{
                  fontSize: 16,
                  color: '#666',
                  marginBottom: 32,
                  maxWidth: 400,
                  marginLeft: 'auto',
                  marginRight: 'auto',
                }}>
                  Log in to view your saved cart and continue shopping. Your items will be saved for you.
                </p>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowAuthModal(true)}
                  style={{
                    padding: '12px 28px',
                    background: G,
                    color: '#fff',
                    border: 'none',
                    borderRadius: 12,
                    fontFamily: FD,
                    fontSize: 16,
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    transition: 'all 0.3s ease',
                  }}
                >
                  <LogIn size={18} />
                  Log In to Cart
                </motion.button>
              </>
            ) : (
              <>
                {/* Logged in but cart empty */}
                <div style={{
                  width: 80,
                  height: 80,
                  margin: '0 auto 24px',
                  background: 'rgba(21,128,61,0.1)',
                  borderRadius: 16,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <ShoppingCart size={40} color={G} />
                </div>

                <h1 style={{
                  fontFamily: FD,
                  fontSize: 'clamp(28px, 5vw, 42px)',
                  fontWeight: 800,
                  color: '#1a1a1a',
                  margin: '0 0 12px',
                }}>
                  Your Cart is Empty
                </h1>

                <p style={{
                  fontSize: 16,
                  color: '#666',
                  marginBottom: 32,
                  maxWidth: 400,
                  marginLeft: 'auto',
                  marginRight: 'auto',
                }}>
                  Start shopping to add products to your cart. Browse our collection of healthy supplements.
                </p>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => router.push('/products')}
                  style={{
                    padding: '12px 28px',
                    background: G,
                    color: '#fff',
                    border: 'none',
                    borderRadius: 12,
                    fontFamily: FD,
                    fontSize: 16,
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    transition: 'all 0.3s ease',
                  }}
                >
                  <ArrowLeft size={18} />
                  Continue Shopping
                </motion.button>
              </>
            )}
          </motion.div>
        </div>

        {/* Auth Modal for empty cart */}
        <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
      </MainLayout>
    );
  }

  return (
    <MainLayout background={BG}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 24px', paddingTop: 120, position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ marginBottom: 48 }}
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={() => router.push('/products')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '8px 12px',
              borderRadius: 8,
              border: `1.5px solid ${G}`,
              background: 'transparent',
              color: G,
              fontFamily: FS,
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
              marginBottom: 16,
              transition: 'all 0.2s',
            }}
          >
            ← Back to Products
          </motion.button>

          <h1 style={{
            fontFamily: FD,
            fontSize: 'clamp(28px, 5vw, 42px)',
            fontWeight: 800,
            color: '#1a1a1a',
            margin: 0,
          }}>
            Shopping Cart
          </h1>
          <p style={{
            fontSize: 16,
            color: '#666',
            marginTop: 8,
          }}>
            {totalItems} {totalItems === 1 ? 'item' : 'items'} in your cart
          </p>
        </motion.div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 360px',
          gap: 32,
        }}>
          {/* Cart Items */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div style={{
              background: '#fff',
              border: '2px solid rgba(21,128,61,0.15)',
              borderRadius: 16,
              overflow: 'hidden',
            }}>
              <div style={{
                padding: '24px',
                borderBottom: '2px dashed rgba(21,128,61,0.15)',
              }}>
                <h2 style={{
                  fontFamily: FD,
                  fontSize: 20,
                  fontWeight: 800,
                  color: '#1a1a1a',
                  margin: 0,
                }}>
                  Order Summary
                </h2>
              </div>

              <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: 20 }}>
                <AnimatePresence mode="popLayout">
                  {items.map((item, index) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.05 }}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '100px 1fr',
                        gap: 16,
                        paddingBottom: 20,
                        borderBottom: '1px dashed rgba(21,128,61,0.15)',
                      }}
                    >
                      {/* Product Image */}
                      <div style={{
                        width: 100,
                        height: 100,
                        borderRadius: 12,
                        overflow: 'hidden',
                        background: 'rgba(21,128,61,0.05)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        <Image
                          src={item.image}
                          alt={item.productName}
                          width={100}
                          height={100}
                          style={{ objectFit: 'contain' }}
                        />
                      </div>

                      {/* Product Details */}
                      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <div>
                          <h3 style={{
                            fontFamily: FD,
                            fontSize: 16,
                            fontWeight: 700,
                            color: '#1a1a1a',
                            margin: '0 0 4px',
                          }}>
                            {item.productName}
                          </h3>
                          <p style={{
                            fontSize: 13,
                            color: '#666',
                            margin: '0 0 8px',
                          }}>
                            {item.packageName}
                          </p>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 12,
                          }}>
                            <span style={{
                              fontFamily: FD,
                              fontSize: 16,
                              fontWeight: 700,
                              color: G,
                            }}>
                              ₹{item.price.toLocaleString()}
                            </span>
                            {item.origPrice && item.origPrice > item.price && (
                              <span style={{
                                fontSize: 13,
                                color: '#999',
                                textDecoration: 'line-through',
                              }}>
                                ₹{item.origPrice.toLocaleString()}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Quantity Controls */}
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 12,
                          marginTop: 12,
                        }}>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                            border: `1.5px solid ${G}`,
                            borderRadius: 8,
                            padding: '4px 8px',
                          }}>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => updateQuantity(item.id!, item.quantity - 1)}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: 24,
                                height: 24,
                                background: 'transparent',
                                border: 'none',
                                color: G,
                                cursor: 'pointer',
                                padding: 0,
                              }}
                            >
                              <Minus size={16} />
                            </motion.button>
                            <span style={{
                              fontFamily: FS,
                              fontSize: 14,
                              fontWeight: 600,
                              color: '#1a1a1a',
                              minWidth: 30,
                              textAlign: 'center',
                            }}>
                              {item.quantity}
                            </span>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => updateQuantity(item.id!, item.quantity + 1)}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: 24,
                                height: 24,
                                background: 'transparent',
                                border: 'none',
                                color: G,
                                cursor: 'pointer',
                                padding: 0,
                              }}
                            >
                              <Plus size={16} />
                            </motion.button>
                          </div>

                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleRemoveItem(item.id!)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 4,
                              padding: '6px 12px',
                              background: 'rgba(239,68,68,0.1)',
                              border: '1px solid rgba(239,68,68,0.2)',
                              borderRadius: 6,
                              color: '#ef4444',
                              fontFamily: FS,
                              fontSize: 12,
                              fontWeight: 600,
                              cursor: 'pointer',
                              transition: 'all 0.2s',
                            }}
                          >
                            <Trash2 size={14} />
                            Remove
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {items.length > 0 && (
                <div style={{
                  padding: '16px 24px',
                  borderTop: '2px dashed rgba(21,128,61,0.15)',
                  background: 'rgba(21,128,61,0.02)',
                }}>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    onClick={handleClearCart}
                    style={{
                      width: '100%',
                      padding: '10px',
                      background: 'transparent',
                      border: `1px dashed rgba(239,68,68,0.3)`,
                      color: '#ef4444',
                      fontFamily: FS,
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: 'pointer',
                      borderRadius: 8,
                      transition: 'all 0.2s',
                    }}
                  >
                    Clear Cart
                  </motion.button>
                </div>
              )}
            </div>
          </motion.div>

          {/* Summary Sidebar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{
              background: '#fff',
              border: '2px solid rgba(21,128,61,0.15)',
              borderRadius: 16,
              padding: 24,
              height: 'fit-content',
              position: 'sticky',
              top: 100,
            }}
          >
            <h3 style={{
              fontFamily: FD,
              fontSize: 18,
              fontWeight: 800,
              color: '#1a1a1a',
              margin: '0 0 20px',
            }}>
              Price Details
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Price breakdown */}
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 14, color: '#666' }}>Subtotal ({totalItems} items)</span>
                <span style={{ fontWeight: 600, color: '#1a1a1a' }}>
                  ₹{totalPrice.toLocaleString()}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 14, color: '#666' }}>Shipping</span>
                <span style={{ fontWeight: 600, color: G }}>Free</span>
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                paddingTop: 16,
                borderTop: '2px dashed rgba(21,128,61,0.15)',
              }}>
                <span style={{ fontFamily: FD, fontSize: 16, fontWeight: 700, color: '#1a1a1a' }}>Total</span>
                <span style={{ fontFamily: FD, fontSize: 20, fontWeight: 800, color: G }}>
                  ₹{totalPrice.toLocaleString()}
                </span>
              </div>

              {/* CTA */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleProceedToCheckout}
                disabled={isCheckingOut}
                style={{
                  marginTop: 20,
                  padding: '14px',
                  background: `linear-gradient(135deg, ${G} 0%, #1d7e34 100%)`,
                  border: 'none',
                  color: '#fff',
                  fontFamily: FD,
                  fontSize: 15,
                  fontWeight: 700,
                  borderRadius: 12,
                  cursor: isCheckingOut ? 'not-allowed' : 'pointer',
                  opacity: isCheckingOut ? 0.7 : 1,
                  boxShadow: '0 4px 12px rgba(21,128,61,0.2)',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                }}
              >
                {isCheckingOut ? 'Processing...' : 'Proceed to Checkout'}
              </motion.button>

              {/* Trust badges */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
                marginTop: 20,
                paddingTop: 20,
                borderTop: '2px dashed rgba(21,128,61,0.15)',
              }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <div style={{
                    width: 24,
                    height: 24,
                    background: 'rgba(21,128,61,0.1)',
                    borderRadius: 6,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    ✓
                  </div>
                  <span style={{ fontSize: 12, color: '#666' }}>Secure Checkout</span>
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <div style={{
                    width: 24,
                    height: 24,
                    background: 'rgba(21,128,61,0.1)',
                    borderRadius: 6,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    ✓
                  </div>
                  <span style={{ fontSize: 12, color: '#666' }}>Easy Returns</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 20, x: -20 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: -20, x: -20 }}
            transition={{ duration: 0.3 }}
            style={{
              position: 'fixed',
              bottom: 24,
              left: 24,
              background: G,
              color: '#fff',
              padding: '16px 24px',
              borderRadius: 12,
              fontFamily: FS,
              fontSize: 14,
              fontWeight: 600,
              boxShadow: '0 8px 24px rgba(21,128,61,0.3)',
              zIndex: 1000,
              maxWidth: 300,
            }}
          >
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Auth Modal */}
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </MainLayout>
  );
}
