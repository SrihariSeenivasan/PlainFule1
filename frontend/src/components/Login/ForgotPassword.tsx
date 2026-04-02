'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { authAPI } from '@/lib/api';
import { F_SIZE, BRAND, FONTS } from '@/lib/typography';
import { ArrowLeft, Mail } from 'lucide-react';

interface ForgotPasswordProps {
  onSwitchView?: (view: 'login' | 'register' | 'forgot') => void;
}

export default function ForgotPassword({ onSwitchView }: ForgotPasswordProps) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await authAPI.forgotPassword(email);
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <style>{`
        .forgot-input:focus { border-color: ${BRAND.primaryDark} !important; box-shadow: 0 0 0 3px ${BRAND.primaryDark}15 !important; }
      `}</style>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <button
          onClick={() => onSwitchView?.('login')}
          style={{ fontSize: F_SIZE.sm, fontFamily: FONTS.main, color: BRAND.secondary }}
          className="mb-8 flex items-center gap-2 hover:opacity-70 transition-opacity font-bold uppercase tracking-wider text-[10px]"
        >
          <ArrowLeft size={14} /> Back to Login
        </button>

        <div className="text-center mb-8 relative">
          {submitted && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute left-1/2 -top-16 -translate-x-1/2 w-12 h-12 rounded-full flex items-center justify-center shadow-lg"
              style={{ background: `${BRAND.primaryDark}15` }}
            >
              <Mail size={24} style={{ color: BRAND.primaryDark }} />
            </motion.div>
          )}
          <h1 style={{ fontSize: F_SIZE.lg, fontFamily: FONTS.main, color: BRAND.primary }} className="font-extrabold mb-2 tracking-tight">
            Reset Password
          </h1>
          <p style={{ fontSize: F_SIZE.md, fontFamily: FONTS.main, color: BRAND.secondary, opacity: 0.8 }} className="font-medium leading-relaxed">
            {submitted
              ? 'Check your email for reset link'
              : 'Enter your email and we\'ll send you a reset link'}
          </p>
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

        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" style={{ fontSize: F_SIZE.sm, fontFamily: FONTS.main, color: BRAND.primary }} className="block font-bold mb-2 tracking-wide uppercase text-[11px] opacity-70">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="forgot-input w-full px-4 py-3 bg-white/50 backdrop-blur-sm rounded-xl focus:outline-none transition-all duration-300 font-medium"
                style={{ fontSize: F_SIZE.sm, fontFamily: FONTS.main, border: `1px solid ${BRAND.tertiary}`, color: BRAND.primary }}
                required
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02, y: -1, boxShadow: `0 12px 24px rgba(114, 56, 61, 0.15)` }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 shadow-md uppercase tracking-widest border-none"
              style={{ fontSize: '11px', fontFamily: FONTS.main, background: BRAND.primary, opacity: loading ? 0.7 : 1 }}
            >
              {loading ? 'Sending link...' : 'Send Reset Link'}
            </motion.button>
          </form>
        ) : (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSubmitted(false)}
            className="w-full font-bold py-4 px-6 rounded-xl transition-all duration-300 uppercase tracking-widest border-none"
            style={{ fontSize: '11px', fontFamily: FONTS.main, background: `${BRAND.secondary}20`, color: BRAND.primary }}
          >
            Try another email
          </motion.button>
        )}
      </motion.div>
    </div>
  );
}
