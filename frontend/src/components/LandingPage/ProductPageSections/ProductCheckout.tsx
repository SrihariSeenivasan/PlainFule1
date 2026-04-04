'use client';

import { useState, ReactNode, ChangeEvent, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { CheckCircle, CreditCard, Truck, ShieldCheck, Send, Plus, ChevronDown } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import MainLayout from '@/components/MainLayout';
import { F_SIZE, BRAND, FONTS } from '@/lib/typography';

/* ── Type Definitions ── */
interface Address {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}

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
  prefill: { name: string; email: string; contact: string };
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

function CheckoutCard({ children, title }: CheckoutCardProps) {
  return (
    <div style={{
      background: BRAND.white, borderRadius: 16,
      padding: 'clamp(20px, 5vw, 40px)',
      border: '1px solid rgba(0,0,0,0.05)',
      boxShadow: '0 4px 20px rgba(0,0,0,0.04), 0 20px 60px rgba(0,0,0,0.06)',
    }}>
      <h2 style={{
        fontSize: F_SIZE.lg, fontWeight: 900,
        marginBottom: 'clamp(16px, 4vw, 32px)',
        color: BRAND.primaryDark, letterSpacing: '-0.01em',
      }}>{title}</h2>
      {children}
    </div>
  );
}

function Input({ label, value, onChange, ...props }: InputProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <label style={{
        fontSize: 11, fontWeight: 900, color: BRAND.secondary,
        textTransform: 'uppercase', letterSpacing: '0.12em',
      }}>{label}</label>
      <input
        style={{
          padding: 'clamp(12px, 2vw, 16px) clamp(14px, 3vw, 20px)',
          borderRadius: 6, border: `1.5px solid ${BRAND.quaternary}`,
          outline: 'none', background: BRAND.light,
          fontFamily: FONTS.main, fontSize: F_SIZE.sm,
          fontWeight: 700, color: BRAND.primary,
          transition: 'border-color 0.2s', width: '100%', boxSizing: 'border-box',
        }}
        onFocus={e => (e.currentTarget.style.borderColor = BRAND.primaryDark)}
        onBlur={e => (e.currentTarget.style.borderColor = BRAND.quaternary)}
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
        display: 'flex', alignItems: 'center',
        gap: 'clamp(12px, 3vw, 20px)',
        padding: 'clamp(14px, 3vw, 24px)',
        borderRadius: 12,
        border: `2.5px solid ${selected ? BRAND.primaryDark : BRAND.quaternary}`,
        background: selected ? `${BRAND.primaryDark}06` : 'transparent',
        cursor: 'pointer', transition: 'border-color 0.2s, background 0.2s',
      }}
    >
      <div style={{
        width: 'clamp(40px, 8vw, 56px)', height: 'clamp(40px, 8vw, 56px)',
        borderRadius: 8, flexShrink: 0,
        background: selected ? BRAND.primaryDark : BRAND.tertiary,
        color: selected ? BRAND.white : BRAND.primary,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {icon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 900, color: BRAND.primary, fontSize: F_SIZE.md }}>{title}</div>
        <div style={{ fontSize: F_SIZE.sm, color: BRAND.secondary, fontWeight: 700, marginTop: 4 }}>{desc}</div>
      </div>
      <div style={{
        width: 24, height: 24, borderRadius: '50%', flexShrink: 0,
        border: `2px solid ${selected ? BRAND.primaryDark : BRAND.quaternary}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {selected && <div style={{ width: 12, height: 12, borderRadius: '50%', background: BRAND.primaryDark }} />}
      </div>
    </div>
  );
}

/* ── Main Export ── */
export default function Checkout() {
  const router = useRouter();
  const { user } = useAuth();
  const { items, totalPrice, clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [error, setError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('online');
  const [savedAddresses, setSavedAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);

  const [formData, setFormData] = useState({
    name: user ? `${user.firstName} ${user.lastName}` : '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India',
  });

  // Load saved addresses on mount
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        if (user) {
          const response = await api.users.getAddresses();
          setSavedAddresses(response);
          const defaultAddr = response.find((a: Address) => a.isDefault);
          if (defaultAddr) {
            setSelectedAddressId(defaultAddr.id);
            setFormData({
              name: defaultAddr.name,
              email: defaultAddr.email,
              phone: defaultAddr.phone,
              address: defaultAddr.address,
              city: defaultAddr.city,
              state: defaultAddr.state,
              zipCode: defaultAddr.zipCode,
              country: defaultAddr.country,
            });
          }
        }
      } catch (err) {
        console.error('Error loading addresses:', err);
      } finally {
        setLoadingAddresses(false);
      }
    };

    fetchAddresses();
  }, [user]);

  const loadRazorpay = () =>
    new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSelectAddress = (address: Address) => {
    setSelectedAddressId(address.id);
    setFormData({
      name: address.name,
      email: address.email,
      phone: address.phone,
      address: address.address,
      city: address.city,
      state: address.state,
      zipCode: address.zipCode,
      country: address.country,
    });
    setShowNewAddressForm(false);
  };

  const validateForm = () => {
    if (!formData.name || !formData.email || !formData.phone || !formData.address || !formData.city || !formData.zipCode) {
      setError('Please fill all required fields');
      return false;
    }
    return true;
  };

  const handleSaveNewAddress = async () => {
    if (!validateForm()) return;
    try {
      const newAddr = await api.users.createAddress({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        country: formData.country,
        isDefault: savedAddresses.length === 0, // Set as default if first address
      });
      
      // Add to saved addresses list
      const newAddress: Address = newAddr.address;
      setSavedAddresses([...savedAddresses, newAddress]);
      setSelectedAddressId(newAddress.id);
      setShowNewAddressForm(false);
      
      // If no previous addresses, this becomes default
      if (savedAddresses.length === 0) {
        setLoadingAddresses(false);
      }
    } catch (err) {
      console.error('Error saving address:', err);
      setError('Failed to save address');
    }
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
          price: item.price,
        })),
        shippingAddress: formData,
        paymentMethod,
        totalAmount: totalPrice,
      });

      if (paymentMethod === 'online' && res.razorpayOrderId) {
        const isLoaded = await loadRazorpay();
        if (!isLoaded) {
          setError('Razorpay SDK failed to load. Are you online?');
          setIsProcessing(false);
          return;
        }
        const options: RazorpayOptions = {
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
              razorpaySignature: response.razorpay_signature,
            });
            setOrderId(res.order.id.toString());
            setOrderComplete(true);
            clearCart();
            setIsProcessing(false);
          },
          prefill: { name: formData.name, email: formData.email, contact: formData.phone },
          theme: { color: BRAND.primaryDark },
        };
        const rzp = new (window as unknown as RazorpayWindow).Razorpay(options);
        rzp.open();
      } else {
        setOrderId(res.order.id.toString());
        setOrderComplete(true);
        clearCart();
        setIsProcessing(false);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong while placing order');
      setIsProcessing(false);
    }
  };

  /* ── Order Complete Screen ── */
  if (orderComplete) {
    return (
      <MainLayout background={BRAND.light}>
        <div style={{
          maxWidth: 640, margin: '0 auto',
          padding: 'clamp(100px, 15vw, 160px) clamp(16px, 5vw, 24px) clamp(48px, 8vw, 100px)',
          textAlign: 'center', fontFamily: FONTS.main,
        }}>
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            style={{
              background: BRAND.white,
              padding: 'clamp(32px, 8vw, 64px) clamp(20px, 6vw, 40px)',
              borderRadius: 16,
              boxShadow: '0 4px 20px rgba(0,0,0,0.04), 0 20px 60px rgba(0,0,0,0.06)',
            }}
          >
            <div style={{
              width: 100, height: 100, borderRadius: '50%',
              background: BRAND.light,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 32px',
            }}>
              <CheckCircle size={44} color={BRAND.primaryDark} />
            </div>

            <h1 style={{
              fontSize: F_SIZE.xl, fontWeight: 900, color: BRAND.primaryDark,
              margin: '0 0 16px', letterSpacing: '-0.04em', lineHeight: 1,
            }}>Order Confirmed.</h1>

            <p style={{
              color: BRAND.secondary, fontSize: F_SIZE.md,
              marginBottom: 48, fontWeight: 700,
              textTransform: 'uppercase', letterSpacing: '0.04em',
            }}>
              Order ID: <strong style={{ color: BRAND.primary }}>#{orderId}</strong>
            </p>

            <div style={{
              display: 'flex', gap: 'clamp(10px, 3vw, 20px)',
              justifyContent: 'center', flexWrap: 'wrap',
            }}>
              <button
                onClick={() => router.push('/my-orders')}
                style={{
                  padding: 'clamp(14px, 3vw, 18px) clamp(20px, 5vw, 32px)',
                  background: BRAND.primary, color: BRAND.white,
                  border: 'none', borderRadius: 6, fontWeight: 900, cursor: 'pointer',
                  fontFamily: FONTS.main,
                  fontSize: F_SIZE.sm, textTransform: 'uppercase', letterSpacing: '0.22em',
                  boxShadow: '0 8px 32px rgba(50,45,41,0.12)',
                }}
              >Track Shipment</button>
              <button
                onClick={() => router.push('/products')}
                style={{
                  padding: 'clamp(14px, 3vw, 18px) clamp(20px, 5vw, 32px)',
                  background: 'transparent', color: BRAND.primary,
                  border: `2.5px solid ${BRAND.primary}`, borderRadius: 6,
                  fontWeight: 900, cursor: 'pointer', fontFamily: FONTS.main,
                  fontSize: F_SIZE.sm, textTransform: 'uppercase', letterSpacing: '0.22em',
                }}
              >Continue Shopping</button>
            </div>
          </motion.div>
        </div>
      </MainLayout>
    );
  }

  /* ── Checkout Page ── */
  return (
    <MainLayout background={BRAND.light}>
      <div style={{
        maxWidth: 1160, margin: '0 auto',
        padding: 'clamp(80px, 12vw, 160px) clamp(16px, 5vw, 20px) clamp(40px, 8vw, 100px)',
        fontFamily: FONTS.main,
      }}>

        {/* ── Header ── */}
        <div style={{ marginBottom: 'clamp(28px, 5vw, 56px)' }}>
          <Chip>Processing Order</Chip>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 20, marginTop: 24, flexWrap: 'wrap' }}>
            <h1 style={{
              fontSize: F_SIZE.xl, fontWeight: 900, color: BRAND.primaryDark,
              margin: 0, letterSpacing: '-0.04em', lineHeight: 1,
            }}>
              Secure <span style={{ fontWeight: 300, color: BRAND.primary }}>Checkout</span>
            </h1>
          </div>
          <div style={{ marginTop: 12 }}>
            <GoldLine style={{ width: 180 }} />
          </div>
        </div>

        {/* ── Responsive grid: stacks on mobile, two-col on ≥768px ── */}
        <div className="checkout-grid" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 'clamp(20px, 4vw, 48px)', alignItems: 'start' }}>

          {/* Left: Form */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(16px, 4vw, 32px)' }}>

            {/* Step 1: Shipping */}
            <CheckoutCard title="Shipping Details">
              {!loadingAddresses && savedAddresses.length > 0 && !showNewAddressForm && (
                <div style={{ marginBottom: 'clamp(16px, 4vw, 24px)' }}>
                  <div style={{
                    fontSize: 11, fontWeight: 900, color: BRAND.secondary,
                    textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 12,
                  }}>Select Saved Address</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {savedAddresses.map((addr) => (
                      <div
                        key={addr.id}
                        onClick={() => handleSelectAddress(addr)}
                        style={{
                          padding: 'clamp(12px, 2vw, 16px)',
                          borderRadius: 8,
                          border: `2px solid ${selectedAddressId === addr.id ? BRAND.primaryDark : BRAND.quaternary}`,
                          background: selectedAddressId === addr.id ? `${BRAND.primaryDark}08` : 'transparent',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                        }}
                      >
                        <div style={{ fontWeight: 800, fontSize: F_SIZE.sm, color: BRAND.primaryDark }}>
                          {addr.name} {addr.isDefault && <span style={{ fontSize: 10, color: BRAND.primary, fontWeight: 900 }}>· DEFAULT</span>}
                        </div>
                        <div style={{ fontSize: 11, color: BRAND.secondary, fontWeight: 600, marginTop: 4 }}>
                          {addr.address}, {addr.city}, {addr.state} {addr.zipCode}
                        </div>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => setShowNewAddressForm(true)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 8,
                      marginTop: 12, padding: '10px 14px',
                      background: 'transparent', border: `1.5px dashed ${BRAND.primary}`,
                      borderRadius: 6, cursor: 'pointer', fontWeight: 700,
                      color: BRAND.primary, fontSize: F_SIZE.sm,
                      fontFamily: FONTS.main,
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = `${BRAND.primary}10`;
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    <Plus size={16} /> Add New Address
                  </button>
                  <GoldLine style={{ margin: 'clamp(16px, 4vw, 24px) 0', opacity: 0.4 }} />
                </div>
              )}

              {(showNewAddressForm || loadingAddresses || savedAddresses.length === 0) && (
                <>
                  {showNewAddressForm && savedAddresses.length > 0 && (
                    <button
                      onClick={() => setShowNewAddressForm(false)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 8,
                        marginBottom: 12, padding: '8px 12px',
                        background: 'transparent', border: `1px solid ${BRAND.primary}`,
                        borderRadius: 4, cursor: 'pointer', fontWeight: 700,
                        color: BRAND.primary, fontSize: 10,
                        fontFamily: FONTS.main,
                        textTransform: 'uppercase',
                      }}
                    >
                      ← Back to Saved
                    </button>
                  )}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))',
                    gap: 'clamp(12px, 3vw, 24px)',
                  }}>
                    <Input name="name" label="Full Name" value={formData.name} onChange={handleInputChange} />
                    <Input name="email" label="Email Address" value={formData.email} onChange={handleInputChange} type="email" />
                    <Input name="phone" label="Phone Number" value={formData.phone} onChange={handleInputChange} type="tel" />
                    <div style={{ gridColumn: '1 / -1' }}>
                      <Input name="address" label="Primary Shipping Address" value={formData.address} onChange={handleInputChange} />
                    </div>
                    <Input name="city" label="City" value={formData.city} onChange={handleInputChange} />
                    <Input name="state" label="Region / State" value={formData.state} onChange={handleInputChange} />
                    <Input name="zipCode" label="Zip / Pin Code" value={formData.zipCode} onChange={handleInputChange} />
                  </div>
                  
                  {/* Save Address Option */}
                  <div style={{ marginTop: 'clamp(16px, 4vw, 24px)', paddingTop: 'clamp(16px, 4vw, 24px)', borderTop: `1px solid ${BRAND.quaternary}` }}>
                    <button
                      onClick={handleSaveNewAddress}
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                        width: '100%', padding: 'clamp(10px, 2vw, 14px)',
                        background: `${BRAND.primary}15`, border: `1.5px solid ${BRAND.primary}`,
                        borderRadius: 6, cursor: 'pointer', fontWeight: 700,
                        color: BRAND.primary, fontSize: F_SIZE.sm,
                        fontFamily: FONTS.main,
                        textTransform: 'uppercase',
                        transition: 'all 0.2s',
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.background = `${BRAND.primary}25`;
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.background = `${BRAND.primary}15`;
                      }}
                    >
                      <Plus size={16} /> Save This Address for Future Orders
                    </button>
                  </div>
                </>
              )}
            </CheckoutCard>

            {/* Step 2: Payment */}
            <CheckoutCard title="Payment Method">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 2vw, 16px)' }}>
                <PaymentOption
                  id="online" title="Pay Online" desc="Instant Secure Transaction"
                  icon={<CreditCard size={20} />}
                  selected={paymentMethod === 'online'} onClick={() => setPaymentMethod('online')}
                />
                <PaymentOption
                  id="cod" title="Pay on Receipt" desc="Terminal Delivery Payment"
                  icon={<Truck size={20} />}
                  selected={paymentMethod === 'cod'} onClick={() => setPaymentMethod('cod')}
                />
              </div>
            </CheckoutCard>
          </div>

          {/* Right: Order Summary */}
          <div className="checkout-sidebar">
            <div style={{
              background: BRAND.white,
              padding: 'clamp(20px, 5vw, 40px)',
              borderRadius: 16,
              border: `1px solid ${BRAND.quaternary}40`,
              boxShadow: '0 4px 20px rgba(0,0,0,0.04), 0 20px 60px rgba(0,0,0,0.06)',
            }}>
              <h3 style={{
                fontSize: F_SIZE.lg, fontWeight: 900,
                marginBottom: 'clamp(16px, 4vw, 28px)',
                letterSpacing: '-0.01em', color: BRAND.primary,
              }}>Summary</h3>

              {/* Line items */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(14px, 3vw, 20px)', marginBottom: 'clamp(20px, 4vw, 32px)' }}>
                {items.map(item => (
                  <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', gap: 16, alignItems: 'flex-start' }}>
                    <div style={{ display: 'flex', gap: 'clamp(10px, 2vw, 16px)', flex: 1, minWidth: 0 }}>
                      <div style={{
                        width: 52, height: 52, flexShrink: 0,
                        background: BRAND.light, borderRadius: 6,
                        padding: 4, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        position: 'relative',
                      }}>
                        {item.image ? (
                          <Image src={item.image} alt={item.productName} fill style={{ objectFit: 'contain', padding: 4 }} />
                        ) : null}
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div style={{
                          fontWeight: 800, fontSize: F_SIZE.sm, color: BRAND.primaryDark,
                          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                        }}>{item.productName}</div>
                        <div style={{
                          fontSize: 11, color: BRAND.secondary, fontWeight: 700,
                          textTransform: 'uppercase', letterSpacing: '0.04em', marginTop: 4,
                        }}>QTY: {item.quantity} · {item.packageName}</div>
                      </div>
                    </div>
                    <div style={{ fontWeight: 900, color: BRAND.primary, flexShrink: 0 }}>
                      ₹{(item.price * item.quantity).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>

              <GoldLine style={{ margin: '0 0 clamp(16px, 4vw, 24px)', opacity: 0.6 }} />

              {/* Totals */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: BRAND.secondary, fontSize: F_SIZE.sm, fontWeight: 700, textTransform: 'uppercase' }}>
                  <span>Gross Value</span>
                  <span>₹{totalPrice.toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: BRAND.secondary, fontSize: F_SIZE.sm, fontWeight: 700, textTransform: 'uppercase' }}>
                  <span>Shipping</span>
                  <span style={{ color: BRAND.primaryDark }}>FREE</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: F_SIZE.lg, fontWeight: 900, marginTop: 12, color: BRAND.primary }}>
                  <span>Final Total</span>
                  <span>₹{totalPrice.toLocaleString()}</span>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div style={{
                  marginTop: 20, padding: 16,
                  background: 'rgba(239,68,68,0.08)', color: '#ef4444',
                  borderRadius: 8, fontSize: 12, fontWeight: 900,
                  textTransform: 'uppercase', letterSpacing: '0.05em',
                }}>× {error}</div>
              )}

              {/* CTA */}
              <motion.button
                whileHover={{ scale: 1.01, backgroundColor: BRAND.primaryDark }}
                whileTap={{ scale: 0.99 }}
                onClick={handlePlaceOrder}
                disabled={isProcessing || items.length === 0}
                style={{
                  width: '100%',
                  padding: 'clamp(14px, 3vw, 20px)',
                  background: BRAND.primary, color: BRAND.white,
                  border: 'none', borderRadius: 6, fontWeight: 900,
                  fontFamily: FONTS.main,
                  fontSize: F_SIZE.sm, textTransform: 'uppercase', letterSpacing: '0.18em',
                  marginTop: 'clamp(20px, 4vw, 32px)', cursor: isProcessing ? 'not-allowed' : 'pointer',
                  boxShadow: '0 8px 32px rgba(50,45,41,0.12)',
                  opacity: isProcessing ? 0.7 : 1,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                  transition: 'background-color 0.2s',
                }}
              >
                {isProcessing ? 'Processing...' : `Complete Order · ₹${totalPrice.toLocaleString()}`}
                {!isProcessing && <Send size={15} />}
              </motion.button>

              {/* Trust badge */}
              <div style={{
                display: 'flex', gap: 10, alignItems: 'center',
                justifyContent: 'center', marginTop: 24,
                color: BRAND.secondary, opacity: 0.6,
              }}>
                <ShieldCheck size={15} />
                <span style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Secure SSL Encryption Active
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Responsive grid breakpoints */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&family=Caveat:wght@600;700&display=swap');

        .checkout-grid {
          grid-template-columns: 1fr;
        }
        @media (min-width: 768px) {
          .checkout-grid {
            grid-template-columns: minmax(0, 1fr) clamp(280px, 38vw, 400px);
          }
          .checkout-sidebar {
            position: sticky;
            top: clamp(80px, 10vw, 120px);
          }
        }
      `}</style>
    </MainLayout>
  );
}