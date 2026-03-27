'use client';

import { motion } from 'framer-motion';
import { useSearchParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { authAPI } from '@/lib/api';
import { F_SIZE } from '@/lib/typography';

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!newPassword || !confirmPassword) {
      setError('Both password fields are required');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!token) {
      setError('Invalid reset link. Please request a new password reset.');
      return;
    }

    setLoading(true);

    try {
      await authAPI.resetPassword(token, newPassword, confirmPassword);
      setSubmitted(true);
      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push('/');
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reset password');
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full bg-white/60 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/40">
          <h1 style={{ fontSize: F_SIZE.lg, fontFamily: "'Montserrat', sans-serif", color: '#0a3d1f' }} className="font-extrabold mb-4 tracking-tight">Invalid Link</h1>
          <p style={{ fontSize: F_SIZE.md, fontFamily: "'Montserrat', sans-serif", color: '#14532d', opacity: 0.8 }} className="mb-8 font-medium leading-relaxed">
            This password reset link is invalid or has expired. Please request a new one.
          </p>
          <button
            onClick={() => router.push('/')}
            className="w-full bg-gradient-to-br from-[#0a3d1f] to-[#14532d] text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 shadow-xl shadow-[#0a3d1f]/10 uppercase tracking-widest"
            style={{ fontSize: '11px', fontFamily: "'Montserrat', sans-serif" }}
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full bg-white/60 backdrop-blur-xl rounded-2xl shadow-2xl p-10 border border-white/40"
      >
        {!submitted ? (
          <>
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center border border-green-100 shadow-sm">
                  <svg
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#0a3d1f"
                    strokeWidth={2}
                  >
                    <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm0-14h12a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V5a2 2 0 012-2z" />
                  </svg>
                </div>
              </div>
              <h1 style={{ fontSize: F_SIZE.xl, fontFamily: "'Montserrat', sans-serif", color: '#0a3d1f' }} className="font-extrabold mb-2 tracking-tight">Reset Password</h1>
              <p style={{ fontSize: F_SIZE.md, fontFamily: "'Montserrat', sans-serif", color: '#14532d', opacity: 0.8 }} className="font-medium">Enter your new password below</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  style={{ fontSize: F_SIZE.sm, fontFamily: "'Montserrat', sans-serif" }}
                  className="mb-8 p-4 bg-red-50/50 backdrop-blur-md border border-red-200 text-red-800 rounded-xl flex items-center gap-3 font-semibold"
                >
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  {error}
                </motion.div>
              )}

              <div>
                <label
                  htmlFor="newPassword"
                  style={{ fontSize: F_SIZE.sm, fontFamily: "'Montserrat', sans-serif", color: '#0a3d1f' }}
                  className="block font-bold mb-2 tracking-wide uppercase text-[11px] opacity-70"
                >
                  New Password
                </label>
                <input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all duration-300 placeholder:text-gray-400 font-medium"
                  style={{ fontSize: F_SIZE.sm, fontFamily: "'Montserrat', sans-serif" }}
                  disabled={loading}
                  minLength={6}
                />
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  style={{ fontSize: F_SIZE.sm, fontFamily: "'Montserrat', sans-serif", color: '#0a3d1f' }}
                  className="block font-bold mb-2 tracking-wide uppercase text-[11px] opacity-70"
                >
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all duration-300 placeholder:text-gray-400 font-medium"
                  style={{ fontSize: F_SIZE.sm, fontFamily: "'Montserrat', sans-serif" }}
                  disabled={loading}
                  minLength={6}
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02, y: -1, boxShadow: '0 12px 24px rgba(10, 61, 31, 0.2)' }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-br from-[#0a3d1f] to-[#14532d] text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 shadow-xl shadow-[#0a3d1f]/10 uppercase tracking-widest mt-2"
                style={{ fontSize: '11px', fontFamily: "'Montserrat', sans-serif" }}
              >
                {loading ? 'Resetting...' : 'Reset Password'}
              </motion.button>

              <button
                type="button"
                onClick={() => router.push('/')}
                className="w-full bg-white/40 border border-gray-200 text-[#0a3d1f] font-bold py-3.5 px-4 rounded-xl transition-all duration-300 shadow-sm uppercase tracking-widest mt-4"
                style={{ fontSize: '10px', fontFamily: "'Montserrat', sans-serif" }}
              >
                Back to Home
              </button>
            </form>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6 text-center"
          >
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center border border-green-100 shadow-inner">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#0a3d1f"
                  strokeWidth={3}
                >
                  <path d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <h2 style={{ fontSize: F_SIZE.lg, fontFamily: "'Montserrat', sans-serif" }} className="font-extrabold text-gray-900 tracking-tight">Password Reset Successfully!</h2>
            <p style={{ fontSize: F_SIZE.sm, fontFamily: "'Montserrat', sans-serif" }} className="text-gray-700 font-medium opacity-80 leading-relaxed">Your password has been reset. Redirecting to home...</p>
            <div className="flex justify-center pt-2">
              <div className="animate-spin h-6 w-6 border-2 border-green-600 border-t-transparent rounded-full shadow-sm" />
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
