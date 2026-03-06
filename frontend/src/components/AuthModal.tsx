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
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
            maxHeight: '85vh',
            overflowY: 'auto',
            maxWidth: 'clamp(300px, 100%, 450px)',
            width: '100%',
          }}
        >
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              padding: 'clamp(20px, 5vw, 28px)',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
              position: 'relative',
            }}
          >
          {/* Close Button */}
          <button
            onClick={handleClose}
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              padding: '8px',
            }}
          >
            ✕
          </button>

          {/* Modal Content */}
          <div style={{ marginTop: currentView === 'login' ? 0 : '0' }}>
            {currentView === 'login' && <LoginPage onSwitchView={handleSwitchView} />}

            {currentView === 'register' && <RegisterPage onSwitchView={handleSwitchView} />}

            {currentView === 'forgot' && <ForgotPassword onSwitchView={handleSwitchView} />}
          </div>

          {/* Navigation Links */}
          {currentView === 'login' && (
            <div style={{ marginTop: '16px', textAlign: 'center', fontSize: '14px' }}>
              <span style={{ color: '#666' }}>Don&apos;t have an account? </span>
              <button
                onClick={() => handleSwitchView('register')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#15803d',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                }}
              >
                Sign up
              </button>
            </div>
          )}

          {currentView === 'register' && (
            <div style={{ marginTop: '16px', textAlign: 'center', fontSize: '14px' }}>
              <span style={{ color: '#666' }}>Already have an account? </span>
              <button
                onClick={() => handleSwitchView('login')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#15803d',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  textDecoration: 'underline',
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
