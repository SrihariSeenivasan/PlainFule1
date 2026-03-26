'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MainLayout from '@/components/MainLayout';
import Image from 'next/image';
import { Sparkles, Heart, Rocket, ShieldCheck, Users, ArrowRight, Zap, Target, BookOpen, Microscope, FlaskConical, Award } from 'lucide-react';

/* ─── Design Tokens ─────────────────────────────────────────── */
const COLORS = {
  forest: '#0a3d1f',
  deep: '#071a0d',
  mid: '#14532d',
  leaf: '#16a34a',
  ink: '#070d08',
  white: '#ffffff',
  offwhite: '#fafbf9',
  silver: '#9eaaa0',
  mist: '#eef4ee',
  gold: '#b8953a',
  goldLight: '#d4af5a',
  champagne: '#f0e4c0',
  glass: 'rgba(255, 255, 255, 0.45)',
  glassDark: 'rgba(4, 14, 7, 0.65)',
};

/* ─── Premium Doodle (Very Selective) ────────────────────────── */
const StarDoodle = ({ size = 20, rotation = 0, color = COLORS.gold }: { size?: number; rotation?: number; color?: string }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} style={{ transform: `rotate(${rotation}deg)`, opacity: 0.6 }}>
    <path d="M12,2 L13.2,9 L20,9 L14.6,13.4 L16.6,20 L12,15.8 L7.4,20 L9.4,13.4 L4,9 L10.8,9 Z"
      fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/* ─── Professional Card ───────────────────────────────────────── */
function TrustCard({ children, index, delay = 0, direction = 'up' }: { children: React.ReactNode; index?: number; delay?: number; direction?: 'left' | 'right' | 'up' }) {
  const initial = direction === 'left' ? { x: -60, opacity: 0 } : direction === 'right' ? { x: 60, opacity: 0 } : { y: 30, opacity: 0 };
  
  return (
    <motion.div
      initial={initial}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: false, margin: "-100px" }}
      transition={{ duration: 0.8, delay: (index ?? 0) * 0.1 + delay, ease: [0.22, 1, 0.36, 1] }}
      style={{
        background: 'rgba(255, 255, 255, 0.55)',
        backdropFilter: 'blur(32px) saturate(140%)',
        borderRadius: 24,
        padding: '40px',
        border: '1px solid rgba(10, 61, 31, 0.08)',
        boxShadow: '0 8px 32px rgba(10, 61, 31, 0.03)',
        position: 'relative',
        overflow: 'hidden',
      }}
      whileHover={{ y: -5, boxShadow: `0 20px 40px rgba(10, 61, 31, 0.08)`, borderColor: `${COLORS.leaf}30` }}
    >
      {children}
    </motion.div>
  );
}

/* ─── Main Component ─────────────────────────────────────────── */
export default function AboutPage() {
  return (
    <MainLayout background={COLORS.offwhite}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&family=Caveat:wght@400;600;700;900&display=swap');
        
        .hero-gradient {
            background: radial-gradient(circle at top right, ${COLORS.mist} 0%, transparent 70%),
                        radial-gradient(circle at bottom left, ${COLORS.mist}30 0%, transparent 70%);
        }
        .text-balanced { text-wrap: balance; }
      `}</style>

      <main className="hero-gradient" style={{ position: 'relative', zIndex: 1, paddingTop: 160, paddingBottom: 160 }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 40px' }}>
          
          {/* HEADER / HERO */}
          <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', gap: 80, alignItems: 'center', marginBottom: 160 }}>
            <motion.div
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                    <div style={{ width: 40, height: 2, background: COLORS.gold }}></div>
                    <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 11, fontWeight: 900, textTransform: 'uppercase', color: COLORS.forest, letterSpacing: '0.3em' }}>Pharmaceutical Excellence</span>
                </div>
                <h1 style={{ 
                    fontFamily: "'Montserrat', sans-serif", 
                    fontSize: 'clamp(3rem, 6vw, 5rem)', 
                    fontWeight: 900, color: COLORS.forest, 
                    margin: 0, letterSpacing: '-0.04em', lineHeight: 1.05 
                }}>
                    Integrity Over<br/>Complexity.
                </h1>
                <p style={{ 
                    fontFamily: "'Montserrat', sans-serif", 
                    fontSize: 18, color: '#4a5a4e', 
                    marginTop: 32, lineHeight: 1.7, fontWeight: 500, maxWidth: 540
                }}>
                    PlainFuel is a nutritional science brand built to eliminate the noise. Founded by pharmacists and healthcare specialists, we standardize daily maintenance into one uncompromising baseline.
                </p>
                <div style={{ display: 'flex', gap: 24, marginTop: 48 }}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 32, fontWeight: 900, color: COLORS.forest }}>100%</div>
                        <div style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 11, fontWeight: 700, color: COLORS.silver, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Traceability</div>
                    </div>
                    <div style={{ width: 1, height: 60, background: `${COLORS.forest}20` }} />
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 32, fontWeight: 900, color: COLORS.forest }}>FSSAI</div>
                        <div style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 11, fontWeight: 700, color: COLORS.silver, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Certified</div>
                    </div>
                    <div style={{ width: 1, height: 60, background: `${COLORS.forest}20` }} />
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 32, fontWeight: 900, color: COLORS.forest }}>USP</div>
                        <div style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 11, fontWeight: 700, color: COLORS.silver, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Standards</div>
                    </div>
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.2 }}
                style={{ position: 'relative' }}
            >
                <div style={{ 
                    borderRadius: 32, overflow: 'hidden', 
                    boxShadow: '0 40px 80px rgba(10, 61, 31, 0.12)',
                    border: '1px solid rgba(255,255,255,0.8)',
                    position: 'relative'
                }}>
                    <Image 
                        src="/images/lab_hero.png" 
                        alt="Pharmaceutical Laboratory" 
                        width={600} 
                        height={600} 
                        style={{ objectFit: 'cover' }}
                    />
                    <div style={{ position: 'absolute', inset: 0, boxShadow: 'inset 0 0 80px rgba(10, 61, 31, 0.05)' }} />
                </div>
                <div style={{ position: 'absolute', top: -30, right: -30, background: '#fff', padding: '16px 24px', borderRadius: 20, boxShadow: '0 20px 40px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 40, height: 40, borderRadius: '50%', background: COLORS.leaf, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <ShieldCheck size={20} />
                    </div>
                    <div>
                        <div style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 13, fontWeight: 900, color: COLORS.forest }}>GMP Certified</div>
                        <div style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 11, color: COLORS.silver }}>Quality Assurance</div>
                    </div>
                </div>
                <StarDoodle size={48} rotation={15} color={COLORS.gold} />
            </motion.div>
          </section>

          {/* PILLARS OF TRUST */}
          <div style={{ textAlign: 'center', marginBottom: 80 }}>
            <h2 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 32, fontWeight: 900, color: COLORS.forest, marginBottom: 12 }}>The Trust Layer</h2>
            <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 16, color: COLORS.silver, fontWeight: 500 }}>Standardized by pharmacists, designed for you.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: 32, marginBottom: 120 }}>
            <TrustCard index={0} direction="left">
                <FlaskConical size={32} color={COLORS.leaf} style={{ marginBottom: 24 }} />
                <h3 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 24, fontWeight: 900, color: COLORS.forest, marginBottom: 16 }}>Biological Balance</h3>
                <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 15, lineHeight: 1.7, color: '#4a5a4e', fontWeight: 500 }}>
                    We avoid "super-dosing". Our formula is engineered around human body's daily metabolic baselines. No fillers, no spikes—just what your body can actually absorb.
                </p>
                <div style={{ marginTop: 24, padding: '12px 20px', background: COLORS.mist, borderRadius: 12, border: '1px solid rgba(10, 61, 31, 0.05)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 800, color: COLORS.mid }}>
                        <BookOpen size={16} /> Data-Driven Method
                    </div>
                </div>
            </TrustCard>

            <TrustCard index={1} direction="right">
                <Microscope size={32} color={COLORS.gold} style={{ marginBottom: 24 }} />
                <h3 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 24, fontWeight: 900, color: COLORS.forest, marginBottom: 16 }}>Clinical Standards</h3>
                <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 15, lineHeight: 1.7, color: '#4a5a4e', fontWeight: 500 }}>
                    Every batch of PlainFuel undergoes three-stage quality control. We standardize against the Pharmaceutical grade to ensure 100% potency until the day of expiry.
                </p>
                <div style={{ marginTop: 24, padding: '12px 20px', background: COLORS.mist, borderRadius: 12, border: '1px solid rgba(10, 61, 31, 0.05)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 800, color: COLORS.mid }}>
                        <Award size={16} /> Lab Certified Purity
                    </div>
                </div>
            </TrustCard>
          </div>

          {/* TEAM / PROFESSIONAL CREDIBILITY */}
          <div style={{ 
            background: COLORS.forest, 
            borderRadius: 40, 
            padding: '100px 80px', 
            color: '#fff',
            position: 'relative',
            overflow: 'hidden',
            marginBottom: 120,
            boxShadow: '0 40px 100px rgba(10, 61, 31, 0.15)'
          }}>
             <div style={{ position: 'absolute', inset: 0, opacity: 0.04, backgroundImage: `radial-gradient(#fff 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />
             
             <div style={{ position: 'relative', zIndex: 1, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 80, alignItems: 'center' }}>
                <motion.div
                   initial={{ x: -80, opacity: 0 }}
                   whileInView={{ x: 0, opacity: 1 }}
                   viewport={{ once: false, margin: "-100px" }}
                   transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                >
                   <h2 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 42, fontWeight: 900, marginBottom: 32, letterSpacing: '-0.02em', lineHeight: 1.1 }}>Built by the<br/>Science-Obsessed.</h2>
                   <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 18, lineHeight: 1.8, color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>
                      PlainFuel was established by a collective of pharmacists and nutritional clinicians who were tired of the "marketing-first" approach to wellness. We don't sell instant results—we provide long-term standard.
                   </p>
                   <div style={{ marginTop: 40, display: 'flex', gap: 32 }}>
                      <div>
                         <div style={{ fontSize: 32, fontWeight: 900, color: COLORS.gold }}>12+</div>
                         <div style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em' }}>Specialists</div>
                      </div>
                      <div style={{ width: 1, height: 50, background: 'rgba(255,255,255,0.1)' }} />
                      <div>
                         <div style={{ fontSize: 32, fontWeight: 900, color: COLORS.gold }}>240+</div>
                         <div style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em' }}>Formulations</div>
                      </div>
                   </div>
                </motion.div>
                <motion.div 
                   initial={{ x: 80, opacity: 0 }}
                   whileInView={{ x: 0, opacity: 1 }}
                   viewport={{ once: false, margin: "-100px" }}
                   transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                   style={{ textAlign: 'center', position: 'relative' }}
                >
                   <div style={{ 
                      width: 240, height: 240, borderRadius: '50%', background: `linear-gradient(135deg, ${COLORS.mid} 0%, ${COLORS.leaf} 100%)`, 
                      margin: '0 auto 32px', border: '8px solid rgba(255,255,255,0.1)', overflow: 'hidden', padding: 24,
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                   }}>
                      {/* Pharmaceutical Illustration Placeholder */}
                      <Microscope size={120} color="#fff" strokeWidth={1} />
                   </div>
                   <h3 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 24, fontWeight: 800, margin: 0 }}>Dr. S Seenivasan</h3>
                   <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 14, color: COLORS.goldLight, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', marginTop: 8 }}>Founder & Chief Formulator</p>
                   <p style={{ fontFamily: "'Caveat', cursive", fontSize: 22, color: '#fff', opacity: 0.6, marginTop: 12 }}>"Standardizing nutrition for every biological potential." ✨</p>
                </motion.div>
             </div>
          </div>

          {/* CTA */}
          <div style={{ textAlign: 'center', borderTop: `1px solid ${COLORS.mid}10`, paddingTop: 120 }}>
             <h2 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 48, fontWeight: 900, color: COLORS.forest, marginBottom: 24, letterSpacing: '-0.03em' }}>Ready to Standardize?</h2>
             <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 18, color: COLORS.silver, marginBottom: 48, fontWeight: 500 }}>Join the 10,000+ people building their biological baseline daily.</p>
             <motion.button 
                whileHover={{ scale: 1.05, background: COLORS.leaf, boxShadow: `0 20px 40px ${COLORS.leaf}20` }}
                whileTap={{ scale: 0.98 }}
                style={{ 
                    padding: '24px 64px', background: COLORS.forest, color: '#fff', 
                    borderRadius: 100, border: 'none', fontFamily: "'Montserrat', sans-serif", 
                    fontSize: 14, fontWeight: 800, textTransform: 'uppercase', 
                    letterSpacing: '0.25em', cursor: 'pointer', transition: 'all 0.4s' 
                }}
             >
                Explore Products <ArrowRight size={18} style={{ display: 'inline', marginLeft: 12 }} />
             </motion.button>
          </div>

        </div>
      </main>

      {/* Background Subtle Overlays */}
      <div style={{ position: 'absolute', top: '10%', right: '-10%', width: 800, height: 800, background: `radial-gradient(circle, ${COLORS.mist} 0%, transparent 70%)`, opacity: 0.5, pointerEvents: 'none' }} />
    </MainLayout>
  );
}