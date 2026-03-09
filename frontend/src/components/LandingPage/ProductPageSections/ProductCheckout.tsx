'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Loader } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { orderAPI } from '@/lib/api';

const FD = "'Playfair Display', Georgia, serif";
const FS = "'DM Sans', 'Helvetica Neue', sans-serif";
const G = '#15803d';
const BG = '#fdfaf3';

// Razorpay integration will be added later

export default function Checkout() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
 
  const [addressDetails, setAddressDetails] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India',
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Razorpay script will be loaded when payment integration is added
  }, []);

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      setError('Please log in to proceed');
      return;
    }

    // Validate all address fields
    if (!addressDetails.street.trim() || !addressDetails.city.trim() || !addressDetails.state.trim() || !addressDetails.zipCode.trim()) {
      setError('Please fill in all address details');
      return;
    }

    if (items.length === 0) {
      setError('Your cart is empty');
      return;
    }

    setIsProcessing(true);
    setError('');

    try {
      // Combine address details into a single formatted address string
      const combinedAddress = `${addressDetails.street}, ${addressDetails.city}, ${addressDetails.state} ${addressDetails.zipCode}, ${addressDetails.country}`;

      const orderData = {
        items: items.map(item => ({
          productId: item.productId,
          packageId: item.packageId,
          quantity: item.quantity,
        })),
        shippingAddress: combinedAddress,
      };

      const result = await orderAPI.createOrder(orderData);

      if (!result || !result.order?.id) {
        throw new Error('Failed to place order');
      }

      await clearCart();
      setToastMessage('✓ Order placed successfully! Payment has been processed.');
      setShowToast(true);

      setTimeout(() => {
        router.push('/');
      }, 2000);
    } catch (err) {
      console.error('Order error:', err);
      setError(err instanceof Error ? err.message : 'Failed to place order. Please try again.');
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div style={{ minHeight: '100vh', background: BG, fontFamily: FS }}>
        <Navbar />
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 24px', paddingTop: 120, textAlign: 'center' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 style={{ fontFamily: FD, fontSize: 'clamp(28px, 5vw, 42px)', fontWeight: 800, color: '#1a1a1a', margin: '0 0 12px' }}>
              No Items in Cart
            </h1>
            <p style={{ fontSize: 16, color: '#666', marginBottom: 32 }}>
              Add products to your cart before checkout.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
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
              }}
            >
              Continue Shopping
            </motion.button>
          </motion.div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{ minHeight: '100vh', background: BG, fontFamily: FS }}>
        <Navbar />
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 24px', paddingTop: 120, textAlign: 'center' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 style={{ fontFamily: FD, fontSize: 'clamp(28px, 5vw, 42px)', fontWeight: 800, color: '#1a1a1a', margin: '0 0 12px' }}>
              Sign In Required
            </h1>
            <p style={{ fontSize: 16, color: '#666', marginBottom: 32 }}>
              Please sign in to proceed with checkout.
            </p>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: BG, fontFamily: FS }}>
      <Navbar />

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 24px', paddingTop: 120 }}>
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 48 }}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={() => router.push('/cart')}
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
            }}
          >
            <ArrowLeft size={16} />
            Back to Cart
          </motion.button>

          <h1 style={{ fontFamily: FD, fontSize: 'clamp(28px, 5vw, 42px)', fontWeight: 800, color: '#1a1a1a', margin: 0 }}>
            Checkout
          </h1>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 32 }}>
          {/* Form */}
          <motion.form
            onSubmit={handlePayment}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            style={{
              background: '#fff',
              border: '2px solid rgba(21,128,61,0.15)',
              borderRadius: 16,
              padding: 32,
            }}
          >
            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  style={{
                    padding: 16,
                    background: 'rgba(239,68,68,0.1)',
                    border: '1.5px solid rgba(239,68,68,0.3)',
                    borderRadius: 12,
                    marginBottom: 24,
                    color: '#ef4444',
                    fontSize: 14,
                    fontWeight: 600,
                  }}
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* User Info (Read-only) */}
            <div style={{ marginBottom: 32 }}>
              <h2 style={{ fontFamily: FD, fontSize: 18, fontWeight: 800, color: '#1a1a1a', marginBottom: 20 }}>
                Delivery Information
              </h2>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, color: '#666', fontWeight: 600, marginBottom: 6, textTransform: 'uppercase' }}>
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={`${user.firstName} ${user.lastName}`}
                    readOnly
                    style={{
                      width: '100%',
                      padding: 12,
                      border: '1.5px solid rgba(21,128,61,0.2)',
                      borderRadius: 8,
                      fontFamily: FS,
                      fontSize: 14,
                      background: 'rgba(21,128,61,0.04)',
                      color: '#1a1a1a',
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, color: '#666', fontWeight: 600, marginBottom: 6, textTransform: 'uppercase' }}>
                    Email
                  </label>
                  <input
                    type="email"
                    value={user.email}
                    readOnly
                    style={{
                      width: '100%',
                      padding: 12,
                      border: '1.5px solid rgba(21,128,61,0.2)',
                      borderRadius: 8,
                      fontFamily: FS,
                      fontSize: 14,
                      background: 'rgba(21,128,61,0.04)',
                      color: '#1a1a1a',
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, color: '#666', fontWeight: 600, marginBottom: 6, textTransform: 'uppercase' }}>
                  Phone
                </label>
                <input
                  type="tel"
                  value={user.phone}
                  readOnly
                  style={{
                    width: '100%',
                    padding: 12,
                    border: '1.5px solid rgba(21,128,61,0.2)',
                    borderRadius: 8,
                    fontFamily: FS,
                    fontSize: 14,
                    background: 'rgba(21,128,61,0.04)',
                    color: '#1a1a1a',
                  }}
                />
              </div>
            </div>

            {/* Shipping Address */}
            <div style={{ marginBottom: 32 }}>
              <h2 style={{ fontFamily: FD, fontSize: 18, fontWeight: 800, color: '#1a1a1a', marginBottom: 20 }}>
                Shipping Address
              </h2>

              {/* Street Address */}
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 12, color: '#666', fontWeight: 600, marginBottom: 6, textTransform: 'uppercase' }}>
                  Street Address
                </label>
                <input
                  type="text"
                  value={addressDetails.street}
                  onChange={(e) => setAddressDetails({ ...addressDetails, street: e.target.value })}
                  placeholder="123 Main Street"
                  style={{
                    width: '100%',
                    padding: 12,
                    border: `1.5px solid ${error ? 'rgba(239,68,68,0.3)' : 'rgba(21,128,61,0.2)'}`,
                    borderRadius: 8,
                    fontFamily: FS,
                    fontSize: 14,
                    color: '#1a1a1a',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              {/* City & State Row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, color: '#666', fontWeight: 600, marginBottom: 6, textTransform: 'uppercase' }}>
                    City
                  </label>
                  <input
                    type="text"
                    value={addressDetails.city}
                    onChange={(e) => setAddressDetails({ ...addressDetails, city: e.target.value })}
                    placeholder="New York"
                    style={{
                      width: '100%',
                      padding: 12,
                      border: `1.5px solid ${error ? 'rgba(239,68,68,0.3)' : 'rgba(21,128,61,0.2)'}`,
                      borderRadius: 8,
                      fontFamily: FS,
                      fontSize: 14,
                      color: '#1a1a1a',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, color: '#666', fontWeight: 600, marginBottom: 6, textTransform: 'uppercase' }}>
                    State
                  </label>
                  <input
                    type="text"
                    value={addressDetails.state}
                    onChange={(e) => setAddressDetails({ ...addressDetails, state: e.target.value })}
                    placeholder="State/Province"
                    style={{
                      width: '100%',
                      padding: 12,
                      border: `1.5px solid ${error ? 'rgba(239,68,68,0.3)' : 'rgba(21,128,61,0.2)'}`,
                      borderRadius: 8,
                      fontFamily: FS,
                      fontSize: 14,
                      color: '#1a1a1a',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
              </div>

              {/* Zip & Country Row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, color: '#666', fontWeight: 600, marginBottom: 6, textTransform: 'uppercase' }}>
                    Zip Code
                  </label>
                  <input
                    type="text"
                    value={addressDetails.zipCode}
                    onChange={(e) => setAddressDetails({ ...addressDetails, zipCode: e.target.value })}
                    placeholder="10001"
                    style={{
                      width: '100%',
                      padding: 12,
                      border: `1.5px solid ${error ? 'rgba(239,68,68,0.3)' : 'rgba(21,128,61,0.2)'}`,
                      borderRadius: 8,
                      fontFamily: FS,
                      fontSize: 14,
                      color: '#1a1a1a',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, color: '#666', fontWeight: 600, marginBottom: 6, textTransform: 'uppercase' }}>
                    Country
                  </label>
                  <input
                    type="text"
                    value={addressDetails.country}
                    onChange={(e) => setAddressDetails({ ...addressDetails, country: e.target.value })}
                    placeholder="India"
                    style={{
                      width: '100%',
                      padding: 12,
                      border: `1.5px solid ${error ? 'rgba(239,68,68,0.3)' : 'rgba(21,128,61,0.2)'}`,
                      borderRadius: 8,
                      fontFamily: FS,
                      fontSize: 14,
                      color: '#1a1a1a',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Payment Button */}
            <motion.button
              type="submit"
              disabled={isProcessing}
              whileHover={{ scale: isProcessing ? 1 : 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{
                width: '100%',
                padding: 16,
                background: `linear-gradient(135deg, ${G} 0%, #1d7e34 100%)`,
                border: 'none',
                color: '#fff',
                fontFamily: FD,
                fontSize: 16,
                fontWeight: 700,
                borderRadius: 12,
                cursor: isProcessing ? 'not-allowed' : 'pointer',
                opacity: isProcessing ? 0.7 : 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                transition: 'all 0.3s ease',
              }}
            >
              {isProcessing ? (
                <>
                  <Loader size={18} style={{ animation: 'spin 1s linear infinite' }} />
                  Placing Order...
                </>
              ) : (
                `Place Order · ₹${totalPrice.toLocaleString()}`
              )}
            </motion.button>
          </motion.form>

          {/* Order Summary */}
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
            <h3 style={{ fontFamily: FD, fontSize: 18, fontWeight: 800, color: '#1a1a1a', margin: '0 0 20px' }}>
              Order Summary
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {items.map(item => (
                <div key={item.id} style={{ paddingBottom: 16, borderBottom: '1px dashed rgba(21,128,61,0.15)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: 14, fontWeight: 600, color: '#1a1a1a' }}>
                      {item.productName}
                    </span>
                    <span style={{ fontSize: 14, fontWeight: 600, color: '#1a1a1a' }}>
                      x{item.quantity}
                    </span>
                  </div>
                  <p style={{ fontSize: 12, color: '#666', margin: 0, marginBottom: 6 }}>
                    {item.packageName}
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 13, color: '#666' }}>₹{item.price}</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: G }}>
                      ₹{(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}

              <div style={{ paddingTop: 16, borderTop: '2px dashed rgba(21,128,61,0.15)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                  <span style={{ fontSize: 14, color: '#666' }}>Subtotal</span>
                  <span style={{ fontWeight: 600, color: '#1a1a1a' }}>₹{totalPrice.toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                  <span style={{ fontSize: 14, color: '#666' }}>Shipping</span>
                  <span style={{ fontWeight: 600, color: G }}>Free</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 12, borderTop: '1px solid rgba(21,128,61,0.15)' }}>
                  <span style={{ fontFamily: FD, fontSize: 16, fontWeight: 700, color: '#1a1a1a' }}>Total</span>
                  <span style={{ fontFamily: FD, fontSize: 20, fontWeight: 800, color: G }}>
                    ₹{totalPrice.toLocaleString()}
                  </span>
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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
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

      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
