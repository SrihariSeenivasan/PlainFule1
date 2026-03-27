'use client';

import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { authAPI } from '@/lib/api';
import { handleGoogleCallback, loadGoogleSDK } from '@/lib/google-auth';
import { F_SIZE, BRAND, FONTS } from '@/lib/typography';
import { Eye, EyeOff } from 'lucide-react';

interface RegisterPageProps {
  onSwitchView?: (view: 'login' | 'register' | 'forgot') => void;
  onSuccess?: () => void;
}

export default function RegisterPage({ onSuccess }: RegisterPageProps) {
  const router = useRouter();
  const { register, loginWithToken } = useAuth();
  const googleButtonRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    agreeTerms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGoogleResponse = async (response: { credential: string }) => {
    setLoading(true);
    setError('');
    try {
      const googleData = await handleGoogleCallback(response);
      const authResponse = await authAPI.googleAuth(
        googleData.token,
        googleData.email,
        googleData.name,
        googleData.picture
      );
      loginWithToken(authResponse.token, authResponse.user as import('@/lib/api').User);
      onSuccess?.();
      router.push('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Google signup failed');
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGoogleSDK();
    const timer = setTimeout(() => {
      if (googleButtonRef.current && window.google) {
        try {
          window.google.accounts.id.initialize({
            client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '',
            callback: handleGoogleResponse,
          });
          window.google.accounts.id.renderButton(googleButtonRef.current, {
            theme: 'filled_black',
            size: 'large',
            width: 320,
            text: 'continue_with',
          });
        } catch (err) {
          console.error('Failed to initialize Google Sign-In:', err);
        }
      }
    }, 1500);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (!formData.agreeTerms) {
      setError('You must agree to the terms and conditions');
      return;
    }
    setLoading(true);
    try {
      await register({
        email: formData.email,
        password: formData.password,
        first_name: formData.firstName,
        last_name: formData.lastName,
        phone: formData.phone,
      });
      onSuccess?.();
      router.push('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <style>{`
        .reg-input:focus { border-color: ${BRAND.burgundy} !important; box-shadow: 0 0 0 3px ${BRAND.burgundy}15 !important; }
        .reg-checkbox:checked { background-color: ${BRAND.burgundy} !important; border-color: ${BRAND.burgundy} !important; }
        .reg-checkbox:focus { border-color: ${BRAND.burgundy} !important; box-shadow: 0 0 0 3px ${BRAND.burgundy}15 !important; outline: none; }
      `}</style>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div>
          {/* Header */}
          <div className="text-center mb-6">
            <h1 style={{ fontSize: F_SIZE.lg, fontFamily: FONTS.main, color: BRAND.espresso }} className="font-extrabold mb-2 tracking-tight">
              Create Account
            </h1>
            <p style={{ fontSize: F_SIZE.md, fontFamily: FONTS.main, color: BRAND.taupe, opacity: 0.8 }} className="font-medium">Join PlainFuel for better health</p>
          </div>

          {/* Premium Glass Google Signup Button */}
          <div className="mb-6 px-4">
            <motion.button
              whileHover={{ 
                scale: 1.02, 
                backgroundColor: 'rgba(255, 255, 255, 0.25)',
                boxShadow: `0 8px 32px rgba(50, 45, 41, 0.1)` 
              }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                if (typeof window !== 'undefined' && (window as any).google?.accounts?.id) {
                  (window as any).google.accounts.id.prompt();
                }
              }}
              className="w-full flex items-center justify-center gap-4 bg-white/20 backdrop-blur-2xl py-3.5 rounded-2xl shadow-lg transition-all duration-300 group overflow-hidden relative"
              style={{ border: `1px solid ${BRAND.stone}60` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              <svg width="24" height="24" viewBox="0 0 24 24" className="bg-white p-1 rounded-full shadow-sm">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <span style={{ fontSize: '13px', fontFamily: FONTS.main, color: BRAND.espresso }} className="font-bold tracking-wider uppercase opacity-80 group-hover:opacity-100 transition-opacity">
                Continue with Google
              </span>
              <div ref={googleButtonRef} className="hidden" />
            </motion.button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px" style={{ background: `linear-gradient(to right, transparent, ${BRAND.stone}, transparent)` }}></div>
            <span style={{ fontSize: F_SIZE.sm, fontFamily: FONTS.main, color: BRAND.taupe, opacity: 0.8 }} className="font-bold uppercase tracking-widest text-[10px]">or email register</span>
            <div className="flex-1 h-px" style={{ background: `linear-gradient(to right, transparent, ${BRAND.stone}, transparent)` }}></div>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{ fontSize: F_SIZE.sm, fontFamily: FONTS.main, background: '#fee2e2', borderColor: '#fecaca', color: '#dc2626' }}
              className="mb-6 p-4 backdrop-blur-md border rounded-xl flex items-center gap-3 font-semibold"
            >
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              {error}
            </motion.div>
          )}

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
              <div>
                <label htmlFor="firstName" style={{ fontSize: F_SIZE.sm, fontFamily: FONTS.main, color: BRAND.espresso }} className="block font-bold mb-1.5 tracking-wide uppercase text-[11px] opacity-70"> First Name </label>
                <input id="firstName" type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} placeholder="John" className="reg-input w-full px-4 py-3 bg-white/50 backdrop-blur-sm rounded-xl focus:outline-none transition-all duration-300 font-medium" style={{ fontSize: F_SIZE.sm, fontFamily: FONTS.main, border: `1px solid ${BRAND.stone}`, color: BRAND.espresso }} required />
              </div>
              <div>
                <label htmlFor="lastName" style={{ fontSize: F_SIZE.sm, fontFamily: FONTS.main, color: BRAND.espresso }} className="block font-bold mb-1.5 tracking-wide uppercase text-[11px] opacity-70"> Last Name </label>
                <input id="lastName" type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} placeholder="Doe" className="reg-input w-full px-4 py-3 bg-white/50 backdrop-blur-sm rounded-xl focus:outline-none transition-all duration-300 font-medium" style={{ fontSize: F_SIZE.sm, fontFamily: FONTS.main, border: `1px solid ${BRAND.stone}`, color: BRAND.espresso }} required />
              </div>
              <div>
                <label htmlFor="email" style={{ fontSize: F_SIZE.sm, fontFamily: FONTS.main, color: BRAND.espresso }} className="block font-bold mb-1.5 tracking-wide uppercase text-[11px] opacity-70"> Email Address </label>
                <input id="email" type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="you@example.com" className="reg-input w-full px-4 py-3 bg-white/50 backdrop-blur-sm rounded-xl focus:outline-none transition-all duration-300 font-medium" style={{ fontSize: F_SIZE.sm, fontFamily: FONTS.main, border: `1px solid ${BRAND.stone}`, color: BRAND.espresso }} required />
              </div>
              <div>
                <label htmlFor="phone" style={{ fontSize: F_SIZE.sm, fontFamily: FONTS.main, color: BRAND.espresso }} className="block font-bold mb-1.5 tracking-wide uppercase text-[11px] opacity-70"> Phone Number </label>
                <input id="phone" type="tel" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="+1 (555) 000-0000" className="reg-input w-full px-4 py-3 bg-white/50 backdrop-blur-sm rounded-xl focus:outline-none transition-all duration-300 font-medium" style={{ fontSize: F_SIZE.sm, fontFamily: FONTS.main, border: `1px solid ${BRAND.stone}`, color: BRAND.espresso }} required />
              </div>
              <div>
                <label htmlFor="password" style={{ fontSize: F_SIZE.sm, fontFamily: FONTS.main, color: BRAND.espresso }} className="block font-bold mb-1.5 tracking-wide uppercase text-[11px] opacity-70"> Password </label>
                <div className="relative group">
                  <input id="password" type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleInputChange} placeholder="••••••••" className="reg-input w-full px-4 py-3 bg-white/50 backdrop-blur-sm rounded-xl focus:outline-none transition-all duration-300 font-medium pr-12" style={{ fontSize: F_SIZE.sm, fontFamily: FONTS.main, border: `1px solid ${BRAND.stone}`, color: BRAND.espresso }} required />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ color: BRAND.taupe }} className="absolute right-4 top-1/2 -translate-y-1/2 hover:opacity-80 transition-colors focus:outline-none"> {showPassword ? <EyeOff size={18} /> : <Eye size={18} />} </button>
                </div>
              </div>
              <div>
                <label htmlFor="confirmPassword" style={{ fontSize: F_SIZE.sm, fontFamily: FONTS.main, color: BRAND.espresso }} className="block font-bold mb-1.5 tracking-wide uppercase text-[11px] opacity-70"> Confirm Password </label>
                <div className="relative group">
                  <input id="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} name="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange} placeholder="••••••••" className="reg-input w-full px-4 py-3 bg-white/50 backdrop-blur-sm rounded-xl focus:outline-none transition-all duration-300 font-medium pr-12" style={{ fontSize: F_SIZE.sm, fontFamily: FONTS.main, border: `1px solid ${BRAND.stone}`, color: BRAND.espresso }} required />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} style={{ color: BRAND.taupe }} className="absolute right-4 top-1/2 -translate-y-1/2 hover:opacity-80 transition-colors focus:outline-none"> {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />} </button>
                </div>
              </div>
            </div>

            <label className="flex items-start gap-3 cursor-pointer group py-2">
              <input type="checkbox" name="agreeTerms" checked={formData.agreeTerms} onChange={handleInputChange} className="reg-checkbox mt-1 rounded-md transition-all cursor-pointer" style={{ border: `1px solid ${BRAND.stone}` }} />
              <span style={{ fontSize: F_SIZE.sm, fontFamily: FONTS.main, color: BRAND.taupe }} className="font-semibold opacity-90 transition-opacity leading-tight">
                I agree to the{' '}
                <button type="button" onClick={() => router.push('/terms')} style={{ color: BRAND.burgundy }} className="font-extrabold underline underline-offset-4 hover:opacity-80 transition-opacity">Terms</button>{' '}and{' '}
                <button type="button" onClick={() => router.push('/privacy')} style={{ color: BRAND.burgundy }} className="font-extrabold underline underline-offset-4 hover:opacity-80 transition-opacity">Privacy</button>
              </span>
            </label>

            <motion.button
              whileHover={{ scale: 1.02, y: -1, boxShadow: `0 12px 24px rgba(114, 56, 61, 0.15)` }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 shadow-md uppercase tracking-widest mt-2 border-none"
              style={{ fontSize: '11px', fontFamily: FONTS.main, background: BRAND.espresso, opacity: loading ? 0.7 : 1 }}
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
