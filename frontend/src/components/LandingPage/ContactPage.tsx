'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Phone, Mail, MapPin, CheckCircle2, MessageSquare, User, AtSign, Tag } from 'lucide-react';
import { contactAPI } from '@/lib/api';
import { F_SIZE } from '@/lib/typography';

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

  return (
    <div className="min-h-screen pt-24 pb-12 bg-[#fdfaf3]">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

        {/* Visual Narrative Side */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#0a3d1f] text-white mb-8 shadow-xl shadow-[#0a3d1f15]">
            <MessageSquare size={14} className="text-[#16a34a]" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Contact Support</span>
          </div>

          <h1
            style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', lineHeight: 0.95 }}
            className="font-black text-[#0a3d1f] tracking-tighter mb-8"
          >
            How can we <br />
            <span className="text-[#16a34a]">optimize</span> your <br />
            experience?
          </h1>

          <p className="text-xl font-medium text-[#0a3d1f80] max-w-xl mb-12 leading-relaxed">
            Our specialized team is ready to assist you with biological logic, shipment tracking, or custom nutritional consultations.
          </p>

          <div className="space-y-8">
            <div className="flex gap-6 items-start">
              <div className="w-14 h-14 rounded-2xl bg-white border border-[#0a3d1f10] shadow-sm flex items-center justify-center text-[#16a34a]">
                <Mail size={24} />
              </div>
              <div>
                <h4 className="font-bold text-[#0a3d1f] uppercase tracking-widest text-[11px] mb-1 opacity-50">Support Email</h4>
                <p className="text-xl font-black text-[#0a3d1f]">care@plainfuel.in</p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="w-14 h-14 rounded-2xl bg-white border border-[#0a3d1f10] shadow-sm flex items-center justify-center text-[#16a34a]">
                <Phone size={24} />
              </div>
              <div>
                <h4 className="font-bold text-[#0a3d1f] uppercase tracking-widest text-[11px] mb-1 opacity-50">Direct Line</h4>
                <p className="text-xl font-black text-[#0a3d1f]">+91 98765 43210</p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="w-14 h-14 rounded-2xl bg-white border border-[#0a3d1f10] shadow-sm flex items-center justify-center text-[#16a34a]">
                <MapPin size={24} />
              </div>
              <div>
                <h4 className="font-bold text-[#0a3d1f] uppercase tracking-widest text-[11px] mb-1 opacity-50">Corporate HQ</h4>
                <p className="text-xl font-black text-[#0a3d1f]">Bengaluru, KA 560001</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Form Side */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative"
        >
          <div className="absolute inset-0 bg-white/40 backdrop-blur-3xl rounded-[48px] border border-white/60 shadow-2xl shadow-[#0a3d1f10] -z-10" />

          <div className="p-10 lg:p-14">
            <AnimatePresence mode="wait">
              {success ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="text-center py-20"
                >
                  <div className="w-24 h-24 rounded-full bg-[#16a34a15] flex items-center justify-center mx-auto mb-8">
                    <CheckCircle2 size={48} className="text-[#16a34a]" />
                  </div>
                  <h3 className="text-3xl font-black text-[#0a3d1f] mb-4">Contacted Successful</h3>
                  <p className="text-lg font-medium text-[#0a3d1f80] mb-10">Our agents will analyze your message and respond within 12 business hours.</p>
                  <button
                    onClick={() => setSuccess(false)}
                    className="px-8 py-4 rounded-2xl bg-[#0a3d1f] text-white font-black uppercase tracking-widest text-[11px] hover:bg-[#14532d] transition-colors"
                  >
                    Send Another Message
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm font-bold border border-red-100">{error}</div>}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="relative group">
                      <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0a3d1f40] group-focus-within:text-[#16a34a] transition-colors" />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Your Name"
                        className="w-full pl-12 pr-6 py-4 rounded-2xl bg-white border border-[#0a3d1f10] focus:border-[#16a34a] focus:ring-4 focus:ring-[#16a34a05] outline-none transition-all font-bold text-[#0a3d1f] placeholder:text-[#0a3d1f30]"
                        required
                      />
                    </div>
                    <div className="relative group">
                      <AtSign size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0a3d1f40] group-focus-within:text-[#16a34a] transition-colors" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Email Address"
                        className="w-full pl-12 pr-6 py-4 rounded-2xl bg-white border border-[#0a3d1f10] focus:border-[#16a34a] focus:ring-4 focus:ring-[#16a34a05] outline-none transition-all font-bold text-[#0a3d1f] placeholder:text-[#0a3d1f30]"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="relative group">
                      <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0a3d1f40] group-focus-within:text-[#16a34a] transition-colors" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="Phone Number"
                        className="w-full pl-12 pr-6 py-4 rounded-2xl bg-white border border-[#0a3d1f10] focus:border-[#16a34a] focus:ring-4 focus:ring-[#16a34a05] outline-none transition-all font-bold text-[#0a3d1f] placeholder:text-[#0a3d1f30]"
                      />
                    </div>
                    <div className="relative group">
                      <Tag size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0a3d1f40] group-focus-within:text-[#16a34a] transition-colors" />
                      <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        placeholder="Subject"
                        className="w-full pl-12 pr-6 py-4 rounded-2xl bg-white border border-[#0a3d1f10] focus:border-[#16a34a] focus:ring-4 focus:ring-[#16a34a05] outline-none transition-all font-bold text-[#0a3d1f] placeholder:text-[#0a3d1f30]"
                      />
                    </div>
                  </div>

                  <div className="relative group">
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={6}
                      placeholder="Describe your inquiry..."
                      className="w-full px-6 py-4 rounded-3xl bg-white border border-[#0a3d1f10] focus:border-[#16a34a] focus:ring-4 focus:ring-[#16a34a05] outline-none transition-all font-bold text-[#0a3d1f] placeholder:text-[#0a3d1f30] resize-none"
                      required
                    />
                  </div>

                  <motion.button
                    whileHover={{ y: -2, scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    type="submit"
                    disabled={loading}
                    className="w-full py-5 rounded-2xl bg-gradient-to-br from-[#0a3d1f] to-[#14532d] text-white font-black uppercase tracking-[0.2em] text-[11px] shadow-xl shadow-[#0a3d1f15] flex items-center justify-center gap-3 disabled:opacity-50 transition-all"
                  >
                    {loading ? 'Processing...' : (
                      <>
                        Contact Us <Send size={16} className="text-[#16a34a]" />
                      </>
                    )}
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
