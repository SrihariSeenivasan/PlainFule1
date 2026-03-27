'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Phone, Mail, MapPin, CheckCircle2, MessageSquare, User, AtSign, Tag } from 'lucide-react';
import { contactAPI } from '@/lib/api';
import { F_SIZE, BRAND, FONTS } from '@/lib/typography';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await contactAPI.submitMessage(formData);
      setSuccess(true);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    paddingLeft: 48,
    paddingRight: 24,
    paddingTop: 16,
    paddingBottom: 16,
    borderRadius: 16,
    background: BRAND.white,
    border: `1.5px solid ${BRAND.silver}`,
    outline: 'none',
    fontFamily: FONTS.main,
    fontSize: F_SIZE.sm,
    fontWeight: 700,
    color: BRAND.espresso,
    transition: 'all 0.3s',
    boxSizing: 'border-box',
  };

  const infoIconStyle: React.CSSProperties = {
    width: 56,
    height: 56,
    borderRadius: 16,
    background: BRAND.white,
    border: `1px solid ${BRAND.silver}`,
    boxShadow: `0 4px 12px rgba(50,45,41,0.06)`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: BRAND.burgundy,
    flexShrink: 0,
  };

  return (
    <div style={{ minHeight: '100vh', paddingTop: 96, paddingBottom: 48, background: BRAND.cream }}>
      <style>{`
        .contact-input:focus {
          border-color: ${BRAND.burgundy} !important;
          box-shadow: 0 0 0 3px ${BRAND.burgundy}18 !important;
        }
        .contact-input::placeholder { color: ${BRAND.stone}; }
        .contact-textarea:focus {
          border-color: ${BRAND.burgundy} !important;
          box-shadow: 0 0 0 3px ${BRAND.burgundy}18 !important;
        }
        .contact-textarea::placeholder { color: ${BRAND.stone}; }
        .contact-icon-group:focus-within .contact-icon { color: ${BRAND.burgundy}; }
      `}</style>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(460px, 1fr))', gap: 64, alignItems: 'center' }}>

        {/* Visual Narrative Side */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: BRAND.espresso, padding: '8px 20px', borderRadius: 100, marginBottom: 32, boxShadow: `0 10px 20px rgba(50,45,41,0.12)` }}>
            <MessageSquare size={14} color={BRAND.stone} />
            <span style={{ fontFamily: FONTS.main, fontSize: 10, fontWeight: 800, color: BRAND.white, textTransform: 'uppercase', letterSpacing: '0.2em' }}>Contact Support</span>
          </div>

          <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', lineHeight: 0.95, fontWeight: 900, fontFamily: FONTS.main, color: BRAND.espresso, marginBottom: 32, letterSpacing: '-0.04em', margin: 0 }}>
            How can we <br />
            <span style={{ color: BRAND.burgundy }}>optimize</span> your <br />
            experience?
          </h1>

          <p style={{ fontFamily: FONTS.main, fontSize: F_SIZE.md, fontWeight: 500, color: BRAND.taupe, maxWidth: 480, marginBottom: 48, lineHeight: 1.7, marginTop: 24 }}>
            Our specialized team is ready to assist you with biological logic, shipment tracking, or custom nutritional consultations.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
              <div style={infoIconStyle}><Mail size={24} /></div>
              <div>
                <h4 style={{ fontFamily: FONTS.main, fontWeight: 800, color: BRAND.taupe, textTransform: 'uppercase', letterSpacing: '0.15em', fontSize: 11, marginBottom: 6, opacity: 0.7 }}>Support Email</h4>
                <p style={{ fontFamily: FONTS.main, fontSize: F_SIZE.md, fontWeight: 900, color: BRAND.espresso, margin: 0 }}>care@plainfuel.in</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
              <div style={infoIconStyle}><Phone size={24} /></div>
              <div>
                <h4 style={{ fontFamily: FONTS.main, fontWeight: 800, color: BRAND.taupe, textTransform: 'uppercase', letterSpacing: '0.15em', fontSize: 11, marginBottom: 6, opacity: 0.7 }}>Direct Line</h4>
                <p style={{ fontFamily: FONTS.main, fontSize: F_SIZE.md, fontWeight: 900, color: BRAND.espresso, margin: 0 }}>+91 98765 43210</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
              <div style={infoIconStyle}><MapPin size={24} /></div>
              <div>
                <h4 style={{ fontFamily: FONTS.main, fontWeight: 800, color: BRAND.taupe, textTransform: 'uppercase', letterSpacing: '0.15em', fontSize: 11, marginBottom: 6, opacity: 0.7 }}>Corporate HQ</h4>
                <p style={{ fontFamily: FONTS.main, fontSize: F_SIZE.md, fontWeight: 900, color: BRAND.espresso, margin: 0 }}>Bengaluru, KA 560001</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Form Side */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{ position: 'relative' }}
        >
          <div style={{ background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(32px)', borderRadius: 48, border: `1px solid ${BRAND.stone}40`, boxShadow: `0 40px 80px rgba(50,45,41,0.08)`, padding: '48px 56px' }}>
            <AnimatePresence mode="wait">
              {success ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  style={{ textAlign: 'center', padding: '80px 0' }}
                >
                  <div style={{ width: 96, height: 96, borderRadius: '50%', background: `${BRAND.burgundy}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 32px' }}>
                    <CheckCircle2 size={48} color={BRAND.burgundy} />
                  </div>
                  <h3 style={{ fontFamily: FONTS.main, fontSize: F_SIZE.lg, fontWeight: 900, color: BRAND.espresso, marginBottom: 16 }}>Message Sent!</h3>
                  <p style={{ fontFamily: FONTS.main, fontSize: F_SIZE.md, fontWeight: 500, color: BRAND.taupe, marginBottom: 40 }}>Our agents will analyze your message and respond within 12 business hours.</p>
                  <button
                    onClick={() => setSuccess(false)}
                    style={{ padding: '16px 32px', borderRadius: 16, background: BRAND.espresso, color: BRAND.white, fontFamily: FONTS.main, fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.2em', border: 'none', cursor: 'pointer' }}
                  >
                    Send Another Message
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  {error && (
                    <div style={{ padding: 16, background: '#fee2e2', color: '#dc2626', borderRadius: 12, fontSize: F_SIZE.sm, fontWeight: 700, border: '1px solid #fecaca' }}>{error}</div>
                  )}

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div className="contact-icon-group" style={{ position: 'relative' }}>
                      <User size={16} className="contact-icon" style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: BRAND.stone, transition: 'color 0.3s' }} />
                      <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="Your Name" className="contact-input" style={inputStyle} required />
                    </div>
                    <div className="contact-icon-group" style={{ position: 'relative' }}>
                      <AtSign size={16} className="contact-icon" style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: BRAND.stone, transition: 'color 0.3s' }} />
                      <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="Email Address" className="contact-input" style={inputStyle} required />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div className="contact-icon-group" style={{ position: 'relative' }}>
                      <Phone size={16} className="contact-icon" style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: BRAND.stone, transition: 'color 0.3s' }} />
                      <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="Phone Number" className="contact-input" style={inputStyle} />
                    </div>
                    <div className="contact-icon-group" style={{ position: 'relative' }}>
                      <Tag size={16} className="contact-icon" style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: BRAND.stone, transition: 'color 0.3s' }} />
                      <input type="text" name="subject" value={formData.subject} onChange={handleInputChange} placeholder="Subject" className="contact-input" style={inputStyle} />
                    </div>
                  </div>

                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={6}
                    placeholder="Describe your inquiry..."
                    className="contact-textarea"
                    style={{ ...inputStyle, paddingLeft: 24, borderRadius: 24, resize: 'none', lineHeight: 1.6 }}
                    required
                  />

                  <motion.button
                    whileHover={{ y: -2, scale: 1.01, background: BRAND.burgundy, boxShadow: `0 20px 40px rgba(114,56,61,0.25)` }}
                    whileTap={{ scale: 0.99 }}
                    type="submit"
                    disabled={loading}
                    style={{ width: '100%', padding: '20px', borderRadius: 16, background: BRAND.espresso, color: BRAND.white, fontFamily: FONTS.main, fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.2em', boxShadow: `0 12px 24px rgba(50,45,41,0.15)`, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, border: 'none', cursor: 'pointer', opacity: loading ? 0.6 : 1, transition: 'all 0.3s' }}
                  >
                    {loading ? 'Processing...' : <><span>Contact Us</span><Send size={16} color={BRAND.stone} /></>}
                  </motion.button>
                </form>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
