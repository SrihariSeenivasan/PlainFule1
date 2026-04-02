'use client';

import { useState, ReactNode, ChangeEvent } from 'react';
import { motion,  } from 'framer-motion';
import Image from 'next/image';
import { CheckCircle, CreditCard, Truck, ShieldCheck, Send } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import MainLayout from '@/components/MainLayout';
import { F_SIZE, BRAND } from '@/lib/typography';

/* ── Type Definitions ── */
interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface RazorpayWindow {
  Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
}

interface RazorpayOptions {
  key: string | undefined;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayResponse) => Promise<void>;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  theme: { color: string };
}

interface RazorpayInstance {
  open: () => void;
}

interface CheckoutCardProps {
  children: ReactNode;
  title: string;
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

interface PaymentOptionProps {
  id: string;
  title: string;
  desc: string;
  icon: ReactNode;
  selected: boolean;
  onClick: () => void;
}

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
  glass: 'rgba(255, 255, 255, 0.92)',
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

export default function Checkout() {
  const router = useRouter();
  const { user } = useAuth();
  const { items, totalPrice, clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [error, setError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('online');
  
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
          handler: async (response: RazorpayResponse) => {
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
          theme: { color: BRAND.primary }
        };
        const razorpayWindow = window as unknown as RazorpayWindow;
        const rzp = new razorpayWindow.Razorpay(options);
        rzp.open();
      } else {
        setOrderId(res.order.id.toString());
        setOrderComplete(true);
        clearCart();
        setIsProcessing(false);
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Something went wrong while placing order';
      setError(errorMessage);
      setIsProcessing(false);
    }
  };

  if (orderComplete) {
    return (
      <MainLayout background={BRAND.light}>
        <div style={{ maxWidth: 1160, margin: '160px auto 100px', padding: '0 24px', textAlign: 'center', fontFamily: FONTS.main }}>
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            style={{ 
              background: C.white, padding: '64px 40px', borderRadius: 16, 
              boxShadow: '0 4px 20px rgba(0,0,0,0.04), 0 20px 60px rgba(0,0,0,0.06)',
            }}
          >
            <div style={{ width: 100, height: 100, background: 'linear-gradient(135deg, #f8f9f8 0%, #f1f5f1 45%, #ffffff 100%)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 32px' }}>
              <CheckCircle size={44} color={BRAND.primaryDark} />
            </div>
            <h1 style={{ fontSize: F_SIZE.xl, fontWeight: 900, color: C.ink, margin: '0 0 16px', letterSpacing: '-0.04em', lineHeight: 1 }}>Order Confirmed.</h1>
            <p style={{ color: C.silver, fontSize: F_SIZE.md, marginBottom: 48, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Order ID: <strong style={{color: BRAND.primary}}>#{orderId}</strong></p>
            <div style={{ display: 'flex', gap: 20, justifyContent: 'center' }}>
              <button 
                onClick={() => router.push('/my-orders')}
                style={{ 
                  padding: '18px 32px', background: BRAND.primary, color: C.white, border: 'none', borderRadius: 6, fontWeight: 900, cursor: 'pointer',
                  fontSize: F_SIZE.sm, textTransform: 'uppercase', letterSpacing: '0.22em', boxShadow: '0 8px 32px rgba(10,61,31,0.12)'
                }}
              >
                Track Shipment
              </button>
              <button 
                onClick={() => router.push('/products')}
                style={{ 
                   padding: '18px 32px', background: 'transparent', color: BRAND.primary, border: `2.5px solid ${BRAND.primary}`, borderRadius: 6, fontWeight: 900, cursor: 'pointer',
                   fontSize: F_SIZE.sm, textTransform: 'uppercase', letterSpacing: '0.22em'
                }}
              >
                Continue Shopping
              </button>
            </div>
          </motion.div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout background={BRAND.light}>
      <div style={{ maxWidth: 1160, margin: '160px auto 100px', padding: '0 24px', fontFamily: FONTS.main }}>
        
        {/* Header */}
        <div style={{ marginBottom: 56 }}>
          <Chip>Processing Order</Chip>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 20, marginTop: 24 }}>
            <h1 style={{ fontSize: F_SIZE.xl, fontWeight: 900, color: C.ink, margin: 0, letterSpacing: '-0.04em', lineHeight: 1 }}>
              Secure <span style={{ fontWeight: 300, color: BRAND.primary }}>Checkout</span>
            </h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', marginTop: 12 }}>
            <GoldLine style={{ width: 180 }} />
          </div>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 400px', gap: 48, alignItems: 'start' }}>
          {/* Checkout Steps */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            {/* Step 1: Shipping */}
            <CheckoutCard title="Shipping Details">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                <Input name="name" label="Full Name" value={formData.name} onChange={handleInputChange} />
                <Input name="email" label="Email Address" value={formData.email} onChange={handleInputChange} />
                <Input name="phone" label="Phone Number" value={formData.phone} onChange={handleInputChange} />
                <div style={{ gridColumn: 'span 2' }}>
                  <Input name="address" label="Primary Shipping Address" value={formData.address} onChange={handleInputChange} />
                </div>
                <Input name="city" label="City" value={formData.city} onChange={handleInputChange} />
                <Input name="state" label="Region/State" value={formData.state} onChange={handleInputChange} />
                <Input name="zipCode" label="Zip/Pin Code" value={formData.zipCode} onChange={handleInputChange} />
              </div>
            </CheckoutCard>

            {/* Step 2: Payment */}
            <CheckoutCard title="Payment Method">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <PaymentOption 
                  id="online" title="Pay Online" desc="Instant Secure Transaction" icon={<CreditCard size={20} />} 
                  selected={paymentMethod === 'online'} onClick={() => setPaymentMethod('online')} 
                />
                <PaymentOption 
                  id="cod" title="Pay on Receipt" desc="Terminal Delivery Payment" icon={<Truck size={20} />} 
                  selected={paymentMethod === 'cod'} onClick={() => setPaymentMethod('cod')} 
                />
              </div>
            </CheckoutCard>
          </div>

          {/* Right: Order Summary Sidebar */}
          <div style={{ position: 'sticky', top: 120 }}>
            <div style={{ 
              background: C.white, padding: 40, borderRadius: 16, border: '1px solid rgba(0,0,0,0.05)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.04), 0 20px 60px rgba(0,0,0,0.06)'
            }}>
              <h3 style={{ fontSize: F_SIZE.lg, fontWeight: 900, marginBottom: 28, letterSpacing: '-0.01em' }}>Summary</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginBottom: 32 }}>
                {items.map(item => (
                  <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', gap: 20 }}>
                    <div style={{ display: 'flex', gap: 16 }}>
                      <div style={{ width: 56, height: 56, background: BRAND.white, borderRadius: 6, flexShrink: 0, padding: 4, display: 'flex', alignItems: 'center' }}>
                        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                           <Image src={item.image} alt={item.productName} fill style={{ objectFit: 'contain' }} />
                        </div>
                      </div>
                      <div>
                        <div style={{ fontWeight: 800, fontSize: F_SIZE.sm, color: C.ink }}>{item.productName}</div>
                        <div style={{ fontSize: 11, color: C.silver, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', marginTop: 4 }}>QTY: {item.quantity} · {item.packageName}</div>
                      </div>
                    </div>
                    <div style={{ fontWeight: 900, color: BRAND.primary }}>₹{(item.price * item.quantity).toLocaleString()}</div>
                  </div>
                ))}
              </div>

              <GoldLine style={{ margin: '24px 0', opacity: 0.6 }} />

              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: C.silver, fontSize: F_SIZE.sm, fontWeight: 700, textTransform: 'uppercase' }}>
                  <span>Gross Value</span>
                  <span>₹{totalPrice.toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: C.silver, fontSize: F_SIZE.sm, fontWeight: 700, textTransform: 'uppercase' }}>
                  <span>Shipping</span>
                  <span style={{ color: BRAND.primaryDark }}>FREE</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: F_SIZE.lg, fontWeight: 900, marginTop: 12, color: BRAND.primary }}>
                  <span>Final Total</span>
                  <span>₹{totalPrice.toLocaleString()}</span>
                </div>
              </div>

              {error && (
                <div style={{ marginTop: 20, padding: 16, background: 'rgba(239,68,68,0.1)', color: '#ef4444', borderRadius: 8, fontSize: 12, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  × {error}
                </div>
              )}

              <motion.button 
                whileHover={{ scale: 1.01, backgroundColor: BRAND.primary }}
                whileTap={{ scale: 0.99 }}
                onClick={handlePlaceOrder}
                disabled={isProcessing || items.length === 0}
                style={{ 
                  width: '100%', padding: 20, background: BRAND.primary, color: C.white, border: 'none', borderRadius: 6, fontWeight: 900, 
                  fontSize: F_SIZE.sm, textTransform: 'uppercase', letterSpacing: '0.22em', marginTop: 32, cursor: 'pointer',
                  boxShadow: '0 8px 32px rgba(10,61,31,0.12)', opacity: isProcessing ? 0.7 : 1
                }}
              >
                {isProcessing ? 'Processing...' : `Complete Order · ₹${totalPrice.toLocaleString()}`} <Send size={16} />
              </motion.button>

              <div style={{ display: 'flex', gap: 10, alignItems: 'center', justifyContent: 'center', marginTop: 24, opacity: 0.4 }}>
                <ShieldCheck size={16} />
                <span style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Secure SSL Encryption Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&family=Caveat:wght@600;700&display=swap');
      `}</style>
    </MainLayout>
  );
}

function CheckoutCard({ children, title }: CheckoutCardProps) {
  return (
    <div style={{ background: C.white, borderRadius: 16, padding: '40px', border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 4px 20px rgba(0,0,0,0.04), 0 20px 60px rgba(0,0,0,0.06)' }}>
      <h2 style={{ fontSize: F_SIZE.lg, fontWeight: 900, marginBottom: 32, color: C.ink, letterSpacing: '-0.01em' }}>{title}</h2>
      {children}
    </div>
  );
}

function Input({ label, value, onChange, ...props }: InputProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <label style={{ fontSize: 11, fontWeight: 900, color: C.silver, textTransform: 'uppercase', letterSpacing: '0.12em' }}>{label}</label>
      <input 
        style={{ 
          padding: '16px 20px', borderRadius: 6, border: '1.5px solid rgba(0,0,0,0.08)', outline: 'none', background: BRAND.light, 
          fontFamily: FONTS.main, fontSize: F_SIZE.sm, fontWeight: 700, color: C.ink, transition: '0.2s'
        }}
        onFocus={e => e.currentTarget.style.borderColor = BRAND.primary}
        onBlur={e => e.currentTarget.style.borderColor = 'rgba(0,0,0,0.08)'}
        value={value}
        onChange={onChange}
        {...props} 
      />
    </div>
  );
}

function PaymentOption({ title, desc, icon, selected, onClick }: PaymentOptionProps) {
  return (
    <div 
      onClick={onClick}
      style={{ 
        display: 'flex', alignItems: 'center', gap: 20, padding: 24, borderRadius: 12, border: `2.5px solid ${selected ? BRAND.primary : 'rgba(0,0,0,0.06)'}`,
        background: selected ? `${BRAND.primary}04` : 'transparent', cursor: 'pointer', transition: '0.2s'
      }}
    >
      <div style={{ width: 56, height: 56, borderRadius: 8, background: selected ? BRAND.primary : C.mist, color: selected ? C.white : BRAND.primary, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {icon}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 900, color: C.ink, fontSize: F_SIZE.md }}>{title}</div>
        <div style={{ fontSize: F_SIZE.sm, color: C.silver, fontWeight: 700, marginTop: 4 }}>{desc}</div>
      </div>
      <div style={{ width: 24, height: 24, borderRadius: '50%', border: `2px solid ${selected ? BRAND.primary : '#ddd'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {selected && <div style={{ width: 12, height: 12, borderRadius: '50%', background: BRAND.primary }} />}
      </div>
    </div>
  );
}



