'use client';

import { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { authAPI } from '@/lib/api';
import { F_SIZE, BRAND, FONTS } from '@/lib/typography';
import { Eye, EyeOff, Lock, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!token) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: BRAND.cream, padding: '48px 16px' }}>
        <div style={{ maxWidth: 450, width: '100%', background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(32px)', borderRadius: 24, boxShadow: `0 30px 60px rgba(50,45,41,0.08)`, padding: 40, border: `1px solid ${BRAND.stone}40`, textAlign: 'center' }}>
          <h1 style={{ fontSize: F_SIZE.lg, fontFamily: FONTS.main, color: BRAND.espresso }} className="font-extrabold mb-4 tracking-tight">Invalid Link</h1>
          <p style={{ fontSize: F_SIZE.md, fontFamily: FONTS.main, color: BRAND.taupe, opacity: 0.8 }} className="mb-8 font-medium leading-relaxed">
            This password reset link is invalid or has expired. Please request a new one.
          </p>
          <button
            onClick={() => router.push('/?auth=forgot')}
            className="w-full font-bold py-4 px-6 rounded-xl transition-all duration-300 shadow-md uppercase tracking-widest border-none"
            style={{ fontSize: '11px', fontFamily: FONTS.main, background: BRAND.espresso, color: BRAND.white }}
          >
            Request New Link
          </button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await authAPI.resetPassword(token, password, confirmPassword);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: BRAND.cream, padding: '48px 16px' }}>
      <style>{`
        .reset-input:focus { border-color: ${BRAND.burgundy} !important; box-shadow: 0 0 0 3px ${BRAND.burgundy}15 !important; }
      `}</style>
      <div style={{ maxWidth: 450, width: '100%', background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(32px)', borderRadius: 24, boxShadow: `0 30px 60px rgba(50,45,41,0.08)`, padding: 40, border: `1px solid ${BRAND.stone}40` }}>
        {success ? (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: `${BRAND.burgundy}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
              <CheckCircle2 size={32} color={BRAND.burgundy} />
            </div>
            <h1 style={{ fontSize: F_SIZE.lg, fontFamily: FONTS.main, color: BRAND.espresso }} className="font-extrabold mb-4 tracking-tight">Password Reset</h1>
            <p style={{ fontSize: F_SIZE.md, fontFamily: FONTS.main, color: BRAND.taupe, opacity: 0.8 }} className="mb-8 font-medium leading-relaxed">
              Your password has been successfully updated.
            </p>
            <button
              onClick={() => router.push('/?auth=login')}
              className="w-full font-bold py-4 px-6 rounded-xl transition-all duration-300 shadow-md uppercase tracking-widest border-none"
              style={{ fontSize: '11px', fontFamily: FONTS.main, background: BRAND.espresso, color: BRAND.white }}
            >
              Sign In Now
            </button>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="text-center mb-10 relative">
              <div style={{ width: 56, height: 56, borderRadius: '50%', background: BRAND.white, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', border: `1px solid ${BRAND.stone}40`, boxShadow: `0 8px 16px rgba(50,45,41,0.06)` }}>
                <Lock size={24} color={BRAND.espresso} />
              </div>
              <h1 style={{ fontSize: F_SIZE.xl, fontFamily: FONTS.main, color: BRAND.espresso }} className="font-extrabold mb-2 tracking-tight">Set New Password</h1>
              <p style={{ fontSize: F_SIZE.md, fontFamily: FONTS.main, color: BRAND.taupe, opacity: 0.8 }} className="font-medium">Enter your new secure password below</p>
            </div>

            {error && (
              <div style={{ fontSize: F_SIZE.sm, fontFamily: FONTS.main, background: '#fee2e2', borderColor: '#fecaca', color: '#dc2626' }} className="mb-6 p-4 backdrop-blur-md border rounded-xl flex items-center gap-3 font-semibold">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="password" style={{ fontSize: F_SIZE.sm, fontFamily: FONTS.main, color: BRAND.espresso }} className="block font-bold mb-2 tracking-wide uppercase text-[11px] opacity-70">New Password</label>
                <div className="relative group">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="reset-input w-full px-4 py-3 bg-white/50 backdrop-blur-sm rounded-xl focus:outline-none transition-all duration-300 font-medium pr-12"
                    style={{ fontSize: F_SIZE.sm, fontFamily: FONTS.main, border: `1px solid ${BRAND.stone}`, color: BRAND.espresso }}
                    required
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ color: BRAND.taupe }} className="absolute right-4 top-1/2 -translate-y-1/2 hover:opacity-80 transition-colors focus:outline-none">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" style={{ fontSize: F_SIZE.sm, fontFamily: FONTS.main, color: BRAND.espresso }} className="block font-bold mb-2 tracking-wide uppercase text-[11px] opacity-70">Confirm Password</label>
                <div className="relative group">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="reset-input w-full px-4 py-3 bg-white/50 backdrop-blur-sm rounded-xl focus:outline-none transition-all duration-300 font-medium pr-12"
                    style={{ fontSize: F_SIZE.sm, fontFamily: FONTS.main, border: `1px solid ${BRAND.stone}`, color: BRAND.espresso }}
                    required
                  />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} style={{ color: BRAND.taupe }} className="absolute right-4 top-1/2 -translate-y-1/2 hover:opacity-80 transition-colors focus:outline-none">
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02, y: -1, boxShadow: `0 12px 24px rgba(114, 56, 61, 0.15)` }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 shadow-md uppercase tracking-widest border-none mt-2"
                style={{ fontSize: '11px', fontFamily: FONTS.main, background: BRAND.espresso, opacity: loading ? 0.7 : 1 }}
              >
                {loading ? 'Updating...' : 'Reset Password'}
              </motion.button>
            </form>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: BRAND.cream }} />}>
      <ResetPasswordForm />
    </Suspense>
  );
}
