'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { authAPI } from '@/lib/api';
import { F_SIZE } from '@/lib/typography';

interface ForgotPasswordProps {
  onSwitchView?: (view: 'login' | 'register' | 'forgot') => void;
}

export default function ForgotPassword({ onSwitchView }: ForgotPasswordProps) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await authAPI.forgotPassword(email);
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send reset email');
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
            {!submitted && (
              <div className="flex justify-center mb-4">
                <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center border border-green-100 shadow-sm">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#0a3d1f" strokeWidth={2}>
                    <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
            )}
            <h1 style={{ fontSize: F_SIZE.lg, fontFamily: "'Montserrat', sans-serif", color: '#0a3d1f' }} className="font-extrabold mb-2 tracking-tight">
              Reset Password
            </h1>
            <p style={{ fontSize: F_SIZE.md, fontFamily: "'Montserrat', sans-serif", color: '#14532d', opacity: 0.8 }} className="font-medium leading-relaxed">
              {submitted
                ? 'Check your email for reset link (Valid for 24 hours)'
                : 'Enter your email and we\'ll send you a reset link'}
            </p>
          </div>

          {!submitted ? (
            <>
              {/* Reset Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
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

                <div className="mb-6">
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
                    disabled={loading}
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.02, y: -1, boxShadow: '0 12px 24px rgba(10, 61, 31, 0.2)' }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-br from-[#0a3d1f] to-[#14532d] text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg shadow-[#0a3d1f]/10 uppercase tracking-widest mt-2"
                  style={{ fontSize: '11px', fontFamily: "'Montserrat', sans-serif" }}
                >
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </motion.button>
              </form>
            </>
          ) : (
            <>
              {/* Success Message */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6"
              >
                <div className="bg-green-50/50 backdrop-blur-md border border-green-100 rounded-2xl p-6 text-center shadow-sm">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-4 border border-green-50 shadow-inner">
                    <span className="text-2xl">✨</span>
                  </div>
                  <p style={{ fontSize: F_SIZE.md, fontFamily: "'Montserrat', sans-serif" }} className="text-green-900 font-extrabold mb-2">Check your email!</p>
                  <p style={{ fontSize: F_SIZE.sm, fontFamily: "'Montserrat', sans-serif" }} className="text-green-800 font-medium leading-relaxed">
                    Reset link sent to <strong>{email}</strong>
                  </p>
                </div>

                <div style={{ fontSize: F_SIZE.sm, fontFamily: "'Montserrat', sans-serif" }} className="space-y-2 text-gray-700 font-medium opacity-80 px-2">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    <p>Check inbox and spam folder</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    <p>Click link to reset password</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    <p>Link expires in 24 hours</p>
                  </div>
                </div>

                <div className="border-t border-gray-100/50 pt-6">
                  <motion.button
                    whileHover={{ scale: 1.02, backgroundColor: 'rgba(10, 61, 31, 0.05)' }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSubmitted(false)}
                    className="w-full bg-white/40 border border-gray-200 text-[#0a3d1f] font-bold py-3.5 px-4 rounded-xl transition-all duration-300 uppercase tracking-widest"
                    style={{ fontSize: '10px', fontFamily: "'Montserrat', sans-serif" }}
                  >
                    Try Another Email
                  </motion.button>
                </div>
              </motion.div>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
