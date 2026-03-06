'use client';

import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { authAPI } from '@/lib/api';
import { handleGoogleCallback, loadGoogleSDK } from '@/lib/google-auth';

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
      // Get user from auth context or localStorage
      const userStr = localStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : null;
      if (user?.role === 'ADMIN') {
        router.push('/admin/dashboard');
      } else {
        router.push('/dashboard');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
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
          <div className="text-center mb-5">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Create Account
            </h1>
            <p className="text-sm sm:text-base text-gray-600">Join PlainFuel for better health</p>
          </div>

          {/* Google Signup Button */}
          <div ref={googleButtonRef} style={{ display: 'flex', justifyContent: 'center' }} className="mb-4"></div>

          {/* Divider */}
          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px bg-gray-200"></div>
            <span className="text-gray-500 text-xs sm:text-sm">or register with email</span>
            <div className="flex-1 h-px bg-gray-200"></div>
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

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="firstName" className="block text-xs sm:text-sm font-semibold text-gray-900 mb-1">
                  First Name
                </label>
                <input
                  id="firstName"
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="John"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all"
                  required
                />
              </div>

              <div>
                <label htmlFor="lastName" className="block text-xs sm:text-sm font-semibold text-gray-900 mb-1">
                  Last Name
                </label>
                <input
                  id="lastName"
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Doe"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-xs sm:text-sm font-semibold text-gray-900 mb-1">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="you@example.com"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all"
                required
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-xs sm:text-sm font-semibold text-gray-900 mb-1">
                Phone Number
              </label>
              <input
                id="phone"
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="+1 (555) 000-0000"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-xs sm:text-sm font-semibold text-gray-900 mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="••••••••"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all"
                required
              />
              <p className="text-xs text-gray-500 mt-0.5">Min 8 chars: uppercase, lowercase, numbers</p>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-xs sm:text-sm font-semibold text-gray-900 mb-1">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="••••••••"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all"
                required
              />
            </div>

            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="agreeTerms"
                checked={formData.agreeTerms}
                onChange={handleInputChange}
                className="mt-1"
              />
              <span className="text-xs sm:text-sm text-gray-600">
                I agree to the{' '}
                <button type="button" onClick={() => {}} className="text-green-600 hover:text-green-700 font-semibold">
                  Terms
                </button>{' '}
                and{' '}
                <button type="button" onClick={() => {}} className="text-green-600 hover:text-green-700 font-semibold">
                  Privacy
                </button>
              </span>
            </label>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 px-4 text-sm sm:text-base rounded-lg transition-all duration-300"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
