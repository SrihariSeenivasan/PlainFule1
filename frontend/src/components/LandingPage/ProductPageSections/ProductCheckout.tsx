'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { CheckCircle, CreditCard, Truck, ShieldCheck } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import MainLayout from '@/components/MainLayout';
import { F_SIZE } from '@/lib/typography';

const G = '#15803d';
const BG = '#fdfaf3';
const FD = "'Playfair Display', Georgia, serif";
const FS = "'DM Sans', 'Helvetica Neue', sans-serif";

export default function Checkout() {
  const router = useRouter();
  const { user } = useAuth();
  const { items, totalPrice, clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [activeStep, setActiveStep] = useState(1);
  const [error, setError] = useState('');
  
  // Forms state
  const [formData, setFormData] = useState({
    name: user ? `${user.firstName} ${user.lastName}` : '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India'
  });

  const [paymentMethod, setPaymentMethod] = useState('online');

  // Load Razorpay Script
  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (!formData.name || !formData.email || !formData.phone || !formData.address || !formData.city || !formData.zipCode) {
      setError('Please fill all required fields');
      return false;
    }
    return true;
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) return;
    
    setIsProcessing(true);
    setError('');

    try {
      // Create order on backend
      const res = await api.orders.create({
        items: items.map(item => ({
          productId: typeof item.productId === 'string' ? parseInt(item.productId) : item.productId,
          packageId: item.packageId,
          quantity: item.quantity,
          price: item.price
        })),
        shippingAddress: formData,
        paymentMethod,
        totalAmount: totalPrice
      });

      if (paymentMethod === 'online' && res.razorpayOrderId) {
        const isLoaded = await loadRazorpay();
        if (!isLoaded) {
          setError('Razorpay SDK failed to load. Are you online?');
          setIsProcessing(false);
          return;
        }

        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: totalPrice * 100,
          currency: 'INR',
          name: 'PlainFuel',
          description: 'Payment for your order',
          order_id: res.razorpayOrderId,
          handler: async (response: any) => {
            // Verify payment on backend
            await api.orders.verifyPayment({
              orderId: res.order.id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpayOrderId: response.razorpay_order_id,
              razorpaySignature: response.razorpay_signature
            });
            
            setOrderId(res.order.id.toString());
            setOrderComplete(true);
            clearCart();
            setIsProcessing(false);
          },
          prefill: {
            name: formData.name,
            email: formData.email,
            contact: formData.phone
          },
          theme: { color: G }
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.open();
      } else {
        // COD logic
        setOrderId(res.order.id.toString());
        setOrderComplete(true);
        clearCart();
        setIsProcessing(false);
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong while placing order');
      setIsProcessing(false);
    }
  };

  if (orderComplete) {
    return (
      <MainLayout background={BG}>
        <div style={{ maxWidth: 600, margin: '140px auto 100px', padding: '0 24px', textAlign: 'center' }}>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            style={{ 
              background: '#fff', 
              padding: '60px 40px', 
              borderRadius: 24, 
              boxShadow: '0 20px 50px rgba(0,0,0,0.05)',
              border: '2px solid rgba(21,128,61,0.1)'
            }}
          >
            <div style={{ width: 80, height: 80, background: 'rgba(21,128,61,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
              <CheckCircle size={40} color={G} />
            </div>
            <h1 style={{ fontFamily: FD, fontSize: F_SIZE.xl, fontWeight: 800, color: '#1a1a1a', margin: '0 0 12px' }}>Order Confirmed!</h1>
            <p style={{ color: '#666', fontSize: F_SIZE.md, marginBottom: 32 }}>Thank you for your purchase. Your order ID is <strong style={{color: G}}>#{orderId}</strong>. We've sent a confirmation email to {formData.email}.</p>
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
              <button 
                onClick={() => router.push('/my-orders')}
                style={{ padding: '12px 24px', background: G, color: '#fff', border: 'none', borderRadius: 12, fontWeight: 700, cursor: 'pointer' }}
              >
                Track Order
              </button>
              <button 
                onClick={() => router.push('/products')}
                style={{ padding: '12px 24px', background: 'transparent', color: G, border: `2px solid ${G}`, borderRadius: 12, fontWeight: 700, cursor: 'pointer' }}
              >
                Keep Shopping
              </button>
            </div>
          </motion.div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout background={BG}>
      <div style={{ maxWidth: 1200, margin: '140px auto 100px', padding: '0 24px' }}>
        <h1 style={{ fontFamily: FD, fontSize: F_SIZE.xl, fontWeight: 800, color: '#1a1a1a', marginBottom: 40 }}>Checkout</h1>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: 40 }}>
          {/* Checkout Steps */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {/* Step 1: Shipping */}
            <CheckoutCard active={activeStep >= 1} title="1. Shipping Information">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <Input name="name" label="Full Name" value={formData.name} onChange={handleInputChange} />
                <Input name="email" label="Email Address" value={formData.email} onChange={handleInputChange} />
                <Input name="phone" label="Phone Number" value={formData.phone} onChange={handleInputChange} />
                <div style={{ gridColumn: 'span 2' }}>
                  <Input name="address" label="Street Address" value={formData.address} onChange={handleInputChange} />
                </div>
                <Input name="city" label="City" value={formData.city} onChange={handleInputChange} />
                <Input name="state" label="State" value={formData.state} onChange={handleInputChange} />
                <Input name="zipCode" label="Pincode" value={formData.zipCode} onChange={handleInputChange} />
              </div>
            </CheckoutCard>

            {/* Step 2: Payment */}
            <CheckoutCard active={activeStep >= 1} title="2. Payment Method">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <PaymentOption 
                  id="online" 
                  title="Pay Online" 
                  desc="UPI, Cards, Netbanking (Razorpay)" 
                  icon={<CreditCard size={20} />} 
                  selected={paymentMethod === 'online'} 
                  onClick={() => setPaymentMethod('online')} 
                />
                <PaymentOption 
                  id="cod" 
                  title="Cash on Delivery" 
                  desc="Pay when you receive your order" 
                  icon={<Truck size={20} />} 
                  selected={paymentMethod === 'cod'} 
                  onClick={() => setPaymentMethod('cod')} 
                />
              </div>
            </CheckoutCard>
          </div>

          {/* Right: Order Summary */}
          <div style={{ position: 'sticky', top: 120, height: 'fit-content' }}>
            <div style={{ 
              background: '#fff', 
              padding: 32, 
              borderRadius: 24, 
              border: '2px solid rgba(21,128,61,0.1)',
              boxShadow: '0 10px 30px rgba(0,0,0,0.03)'
            }}>
              <h3 style={{ fontFamily: FD, fontSize: F_SIZE.lg, fontWeight: 800, marginBottom: 24 }}>Order Summary</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 24 }}>
                {items.map(item => (
                  <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                    <div style={{ display: 'flex', gap: 12 }}>
                      <div style={{ width: 48, height: 48, background: '#f5f5f5', borderRadius: 8, flexShrink: 0 }}>
                        <Image src={item.image} alt={item.productName} width={48} height={48} style={{ objectFit: 'contain' }} />
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: F_SIZE.sm }}>{item.productName}</div>
                        <div style={{ fontSize: F_SIZE.sm, color: '#666' }}>qty: {item.quantity} · {item.packageName}</div>
                      </div>
                    </div>
                    <div style={{ fontWeight: 700 }}>₹{(item.price * item.quantity).toLocaleString()}</div>
                  </div>
                ))}
              </div>

              <div style={{ 
                borderTop: '2px dashed rgba(21,128,61,0.1)', 
                paddingTop: 20, 
                display: 'flex', 
                flexDirection: 'column', 
                gap: 12 
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#666' }}>
                  <span>Subtotal</span>
                  <span>₹{totalPrice.toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#666' }}>
                  <span>Shipping</span>
                  <span style={{ color: G, fontWeight: 700 }}>FREE</span>
                </div>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  fontSize: F_SIZE.lg, 
                  fontWeight: 800, 
                  marginTop: 8,
                  fontFamily: FD,
                  color: '#1a1a1a'
                }}>
                  <span>Total</span>
                  <span style={{ color: G }}>₹{totalPrice.toLocaleString()}</span>
                </div>
              </div>

              {error && (
                <div style={{ marginTop: 20, padding: 12, background: 'rgba(239,68,68,0.1)', color: '#ef4444', borderRadius: 8, fontSize: F_SIZE.sm, fontWeight: 600 }}>
                  {error}
                </div>
              )}

              <button 
                onClick={handlePlaceOrder}
                disabled={isProcessing || items.length === 0}
                style={{ 
                  width: '100%', 
                  padding: 16, 
                  background: G, 
                  color: '#fff', 
                  border: 'none', 
                  borderRadius: 16, 
                  fontWeight: 800, 
                  fontSize: F_SIZE.md,
                  marginTop: 24,
                  cursor: (isProcessing || items.length === 0) ? 'not-allowed' : 'pointer',
                  boxShadow: '0 10px 20px rgba(21,128,61,0.2)',
                  transition: '0.3s'
                }}
              >
                {isProcessing ? 'Processing...' : `Place Order · ₹${totalPrice.toLocaleString()}`}
              </button>

              <div style={{ display: 'flex', gap: 8, alignItems: 'center', justifyContent: 'center', marginTop: 16, opacity: 0.5 }}>
                <ShieldCheck size={16} />
                <span style={{ fontSize: F_SIZE.sm, fontWeight: 600 }}>Secure 256-bit SSL encrypted payment</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

function CheckoutCard({ children, title, active }: any) {
  return (
    <div style={{ 
      background: '#fff', 
      borderRadius: 24, 
      padding: 32, 
      border: `2px solid ${active ? 'rgba(21,128,61,0.2)' : '#eee'}`,
      boxShadow: active ? '0 10px 30px rgba(0,0,0,0.03)' : 'none',
      opacity: active ? 1 : 0.6
    }}>
      <h2 style={{ fontFamily: FD, fontSize: F_SIZE.lg, fontWeight: 800, marginBottom: 24, color: '#1a1a1a' }}>{title}</h2>
      {children}
    </div>
  );
}

function Input({ label, ...props }: any) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ fontSize: F_SIZE.sm, fontWeight: 700, color: '#666', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</label>
      <input 
        style={{ 
          padding: '12px 16px', 
          borderRadius: 12, 
          border: '2px solid #eee', 
          fontFamily: FS,
          fontSize: F_SIZE.sm,
          outline: 'none',
          transition: '0.2s'
        }}
        {...props} 
      />
    </div>
  );
}

function PaymentOption({ title, desc, icon, selected, onClick }: any) {
  return (
    <div 
      onClick={onClick}
      style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 16, 
        padding: 20, 
        borderRadius: 16, 
        border: `2px solid ${selected ? G : '#eee'}`,
        background: selected ? 'rgba(21,128,61,0.02)' : 'transparent',
        cursor: 'pointer',
        transition: '0.2s'
      }}
    >
      <div style={{ 
        width: 48, 
        height: 48, 
        borderRadius: 12, 
        background: selected ? G : '#f5f5f5', 
        color: selected ? '#fff' : '#666',
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        {icon}
      </div>
      <div>
        <div style={{ fontWeight: 800, color: '#1a1a1a' }}>{title}</div>
        <div style={{ fontSize: F_SIZE.sm, color: '#666' }}>{desc}</div>
      </div>
      <div style={{ 
        marginLeft: 'auto', 
        width: 24, 
        height: 24, 
        borderRadius: '50%', 
        border: `2px solid ${selected ? G : '#ddd'}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {selected && <div style={{ width: 12, height: 12, borderRadius: '50%', background: G }} />}
      </div>
    </div>
  );
}
