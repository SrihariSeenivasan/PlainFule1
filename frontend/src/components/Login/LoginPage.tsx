'use client';

import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { authAPI } from '@/lib/api';
import { handleGoogleCallback, loadGoogleSDK } from '@/lib/google-auth';

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
      // Redirect based on role
      if (authResponse.user.role === 'ADMIN') {
        router.push('/admin/dashboard');
      } else {
        router.push('/dashboard');
      }
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
          window.google.accounts.id.renderButton(googleButtonRef.current, {
            theme: 'outline',
            size: 'large',
            width: googleButtonRef.current.offsetWidth,
          });
        } catch (err) {
          console.error('Failed to initialize Google Sign-In:', err);
        }
      }
    }, 500);

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
      // Get user from auth context or localStorage
      const userStr = localStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : null;
      if (user?.role === 'ADMIN') {
        router.push('/admin/dashboard');
      } else {
        router.push('/dashboard');
      }
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
          <div className="text-center mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Welcome Back
            </h1>
            <p className="text-sm sm:text-base text-gray-600">Sign in to your PlainFuel account</p>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm"
            >
              {error}
            </motion.div>
          )}

          {/* Google Login Button - Primary CTA */}
          <div ref={googleButtonRef} style={{ display: 'flex', justifyContent: 'center' }} className="mb-5"></div>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-gray-200"></div>
            <span className="text-gray-500 text-xs sm:text-sm">or continue with email</span>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>

          {/* Email Form */}
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-xs sm:text-sm font-semibold text-gray-900 mb-1.5">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-xs sm:text-sm font-semibold text-gray-900 mb-1.5">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all"
                required
              />
            </div>

            <div className="flex items-center justify-between gap-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded border-gray-300" />
                <span className="text-xs sm:text-sm text-gray-600">Remember me</span>
              </label>
              <button type="button" onClick={() => onSwitchView?.('forgot')} className="text-xs sm:text-sm text-green-600 hover:text-green-700 font-semibold">
                Forgot password?
              </button>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 px-4 text-sm sm:text-base rounded-lg transition-all duration-300"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
