'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

interface ForgotPasswordProps {
  onSwitchView?: (view: 'login' | 'register' | 'forgot') => void;
}

export default function ForgotPassword({ onSwitchView }: ForgotPasswordProps) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Dummy implementation - will be replaced with backend
    console.log('Reset email sent to:', email);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1500);
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
            {!submitted && (
              <div className="flex justify-center mb-3">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#15803d" strokeWidth={2}>
                    <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
            )}
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1.5">
              Reset Password
            </h1>
            <p className="text-xs sm:text-sm text-gray-600">
              {submitted
                ? 'Check your email for reset link (Valid for 24 hours)'
                : 'Enter your email and we\'ll send you a reset link'}
            </p>
          </div>

          {!submitted ? (
            <>
              {/* Reset Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
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

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 px-4 text-sm sm:text-base rounded-lg transition-all duration-300"
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
                className="space-y-4"
              >
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
                  <p className="text-green-800 font-semibold mb-1 text-sm">Check your email!</p>
                  <p className="text-green-700 text-xs sm:text-sm">
                    Reset link sent to <strong>{email}</strong>
                  </p>
                </div>

                <div className="space-y-1.5 text-xs sm:text-sm text-gray-600">
                  <p>• Check inbox and spam folder</p>
                  <p>• Click link to reset password</p>
                  <p>• Link expires in 24 hours</p>
                </div>

                <div className="border-t pt-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSubmitted(false)}
                    className="w-full bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold py-2 px-4 text-sm rounded-lg transition-all duration-300"
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
