'use client';

import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { authAPI } from '@/lib/api';
import { handleGoogleCallback, loadGoogleSDK } from '@/lib/google-auth';
import { F_SIZE } from '@/lib/typography';

interface LoginPageProps {
  onSwitchView?: (view: 'login' | 'register' | 'forgot') => void;
  onSuccess?: () => void;
}

export default function LoginPage({ onSwitchView, onSuccess }: LoginPageProps) {
  const router = useRouter();
  const { login, loginWithToken } = useAuth();
  const googleButtonRef = useRef<HTMLDivElement>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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

      // Store token and user
      loginWithToken(authResponse.token, authResponse.user as import('@/lib/api').User);

      onSuccess?.();
      // Redirect to home
      router.push('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Google login failed');
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
          // Initialize but keep hidden to use custom glassy button
          window.google.accounts.id.renderButton(googleButtonRef.current, {
            theme: 'outline',
            size: 'large',
            width: 320,
          });
        } catch (err) {
          console.error('Failed to initialize Google Sign-In:', err);
        }
      }
    }, 1000);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(email, password);
      onSuccess?.();
      router.push('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div>
          {/* Header */}
          <div className="text-center mb-8">
            <h1 style={{ fontSize: F_SIZE.lg, fontFamily: "'Montserrat', sans-serif", color: '#0a3d1f' }} className="font-extrabold mb-2 tracking-tight">
              Welcome Back
            </h1>
            <p style={{ fontSize: F_SIZE.md, fontFamily: "'Montserrat', sans-serif", color: '#14532d', opacity: 0.8 }} className="font-medium">Sign in to your PlainFuel account</p>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{ fontSize: F_SIZE.sm, fontFamily: "'Montserrat', sans-serif" }}
              className="mb-6 p-4 bg-red-50/50 backdrop-blur-md border border-red-200 text-red-800 rounded-xl flex items-center gap-3 font-semibold"
            >
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              {error}
            </motion.div>
          )}

          {/* Premium Glass Google Login Button */}
          <div className="mb-6 px-4">
            <motion.button
              whileHover={{ 
                scale: 1.02, 
                backgroundColor: 'rgba(255, 255, 255, 0.25)',
                boxShadow: '0 8px 32px rgba(10, 61, 31, 0.15)' 
              }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                if (typeof window !== 'undefined' && (window as any).google?.accounts?.id) {
                  (window as any).google.accounts.id.prompt();
                }
              }}
              className="w-full flex items-center justify-center gap-4 bg-white/20 backdrop-blur-2xl border border-white/40 py-3.5 rounded-2xl shadow-xl transition-all duration-300 group overflow-hidden relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              <svg width="24" height="24" viewBox="0 0 24 24" className="bg-white p-1 rounded-full shadow-sm">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <span style={{ fontSize: '13px', fontFamily: "'Montserrat', sans-serif", color: '#0a3d1f' }} className="font-bold tracking-wider uppercase opacity-80 group-hover:opacity-100 transition-opacity">
                Continue with Google
              </span>
              
              <div ref={googleButtonRef} className="hidden" />
            </motion.button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 my-8">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
            <span style={{ fontSize: F_SIZE.sm, fontFamily: "'Montserrat', sans-serif", color: '#14532d', opacity: 0.6 }} className="font-bold uppercase tracking-widest text-[10px]">or email login</span>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
          </div>

          {/* Email Form */}
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div>
              <label htmlFor="email" style={{ fontSize: F_SIZE.sm, fontFamily: "'Montserrat', sans-serif", color: '#0a3d1f' }} className="block font-bold mb-2 tracking-wide uppercase text-[11px] opacity-70">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all duration-300 placeholder:text-gray-400 font-medium"
                style={{ fontSize: F_SIZE.sm, fontFamily: "'Montserrat', sans-serif" }}
                required
              />
            </div>

            <div>
              <label htmlFor="password" style={{ fontSize: F_SIZE.sm, fontFamily: "'Montserrat', sans-serif", color: '#0a3d1f' }} className="block font-bold mb-2 tracking-wide uppercase text-[11px] opacity-70">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all duration-300 placeholder:text-gray-400 font-medium"
                style={{ fontSize: F_SIZE.sm, fontFamily: "'Montserrat', sans-serif" }}
                required
              />
            </div>

            <div className="flex items-center justify-between gap-2 py-1">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" className="rounded-md border-gray-300 text-green-600 focus:ring-green-600 transition-all cursor-pointer" />
                <span style={{ fontSize: F_SIZE.sm, fontFamily: "'Montserrat', sans-serif", color: '#14532d' }} className="font-semibold opacity-70 group-hover:opacity-100 transition-opacity">Remember me</span>
              </label>
              <button type="button" onClick={() => onSwitchView?.('forgot')} style={{ fontSize: F_SIZE.sm, fontFamily: "'Montserrat', sans-serif" }} className="text-green-600 hover:text-green-700 font-bold tracking-tight">
                Forgot password?
              </button>
            </div>

            <motion.button
              whileHover={{ scale: 1.02, y: -1, boxShadow: '0 12px 24px rgba(10, 61, 31, 0.2)' }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-br from-[#0a3d1f] to-[#14532d] text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg shadow-[#0a3d1f]/10 uppercase tracking-widest"
              style={{ fontSize: '11px', fontFamily: "'Montserrat', sans-serif" }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
