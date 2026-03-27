'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import LoginPage from './Login/LoginPage';
import RegisterPage from './Login/RegisterPage';
import ForgotPassword from './Login/ForgotPassword';

type ModalView = 'login' | 'register' | 'forgot' | null;

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [currentView, setCurrentView] = useState<ModalView>('login');

  const handleSwitchView = (view: ModalView) => {
    setCurrentView(view);
  };

  const handleClose = () => {
    setCurrentView('login');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleClose}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(4, 14, 7, 0.4)',
          backdropFilter: 'blur(32px)',
          WebkitBackdropFilter: 'blur(32px)',
          zIndex: 999,
        }}
      />

      {/* Modal Container */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px',
          pointerEvents: isOpen ? 'auto' : 'none',
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3 }}
          style={{
            maxHeight: '90vh',
            overflowY: 'auto',
            maxWidth: currentView === 'register' ? '650px' : '480px',
            width: '100%',
            transition: 'max-width 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            msOverflowStyle: 'none', // IE and Edge
            scrollbarWidth: 'none', // Firefox
          }}
          className="auth-modal-scroll-container"
        >
          <div
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.65)',
              backdropFilter: 'blur(40px) saturate(180%)',
              WebkitBackdropFilter: 'blur(40px) saturate(180%)',
              borderRadius: '24px',
              padding: 'clamp(32px, 8vw, 48px)',
              boxShadow: '0 32px 80px rgba(10, 61, 31, 0.18), inset 0 0 0 1px rgba(255, 255, 255, 0.4)',
              border: '1px solid rgba(10, 61, 31, 0.1)',
              position: 'relative',
            }}
          >
          {/* Close Button */}
          <button
            onClick={handleClose}
            style={{
              position: 'absolute',
              top: '24px',
              right: '24px',
              background: 'rgba(10, 61, 31, 0.05)',
              border: '1px solid rgba(10, 61, 31, 0.1)',
              borderRadius: '12px',
              fontSize: '18px',
              color: '#0a3d1f',
              cursor: 'pointer',
              padding: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(10, 61, 31, 0.1)';
              e.currentTarget.style.transform = 'rotate(90deg)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(10, 61, 31, 0.05)';
              e.currentTarget.style.transform = 'rotate(0deg)';
            }}
          >
            ✕
          </button>

          {/* Modal Content */}
          <div key={currentView || 'default'} style={{ marginTop: currentView === 'login' ? 0 : '0' }}>
            {currentView === 'login' && <LoginPage onSwitchView={handleSwitchView} onSuccess={handleClose} />}

            {currentView === 'register' && <RegisterPage onSwitchView={handleSwitchView} onSuccess={handleClose} />}

            {currentView === 'forgot' && <ForgotPassword onSwitchView={handleSwitchView} />}
          </div>

          {/* Navigation Links */}
          {currentView === 'login' && (
            <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '14px', fontFamily: "'Montserrat', sans-serif" }}>
              <span style={{ color: '#0a3d1f', opacity: 0.7 }}>Don&apos;t have an account? </span>
              <button
                onClick={() => handleSwitchView('register')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#16a34a',
                  fontWeight: '800',
                  cursor: 'pointer',
                  letterSpacing: '0.02em',
                  textTransform: 'uppercase',
                  fontSize: '12px',
                  marginLeft: '4px',
                }}
              >
                Sign up
              </button>
            </div>
          )}

          {currentView === 'register' && (
            <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '14px', fontFamily: "'Montserrat', sans-serif" }}>
              <span style={{ color: '#0a3d1f', opacity: 0.7 }}>Already have an account? </span>
              <button
                onClick={() => handleSwitchView('login')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#16a34a',
                  fontWeight: '800',
                  cursor: 'pointer',
                  letterSpacing: '0.02em',
                  textTransform: 'uppercase',
                  fontSize: '12px',
                  marginLeft: '4px',
                }}
              >
                Sign in
              </button>
            </div>
          )}
        </div>
        </motion.div>
      </div>
    </>
  );
}
