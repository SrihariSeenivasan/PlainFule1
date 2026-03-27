'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { ShoppingBag, Star, ShieldCheck, Zap, ArrowRight, Sparkles } from 'lucide-react';
import { F_SIZE, BRAND, FONTS } from '@/lib/typography';
import Image from 'next/image';

export default function InsiderBundleSection() {
    const sectionRef = useRef<HTMLElement>(null);
    const inView = useInView(sectionRef, { once: true, margin: '-100px' });
    const [btnHover, setBtnHover] = useState(false);

    const PERKS = [
        { icon: <ShieldCheck size={18} color={BRAND.burgundy} />, text: 'Pharmaceutical grade purity' },
        { icon: <Zap size={18} color={BRAND.burgundy} />, text: 'Zero commitment, cancel anytime' },
        { icon: <Star size={18} color={BRAND.burgundy} />, text: 'Exclusive early access to new drops' }
    ];

    return (
        <section
            ref={sectionRef}
            style={{
                background: BRAND.white,
                padding: '100px 24px',
                position: 'relative',
                overflow: 'hidden'
            }}
        >
            {/* Ambient Radiance */}
            <div style={{ position: 'absolute', top: '20%', right: '-10%', width: '50vw', height: '50vw', background: `radial-gradient(circle, ${BRAND.espresso}05 0%, transparent 70%)`, pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', bottom: '20%', left: '-10%', width: '40vw', height: '40vw', background: `radial-gradient(circle, ${BRAND.burgundy}05 0%, transparent 70%)`, pointerEvents: 'none' }} />

            <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 64, alignItems: 'center' }}>
                    
                    {/* LEFT CONTENT */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
                        <div>
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={inView ? { opacity: 1, x: 0 } : {}}
                                transition={{ duration: 0.5 }}
                                style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '6px 16px', borderRadius: 100, background: BRAND.cream, border: `1px solid ${BRAND.espresso}10`, marginBottom: 24 }}
                            >
                                <Sparkles size={14} color={BRAND.espresso} />
                                <span style={{ fontSize: F_SIZE.sm, fontWeight: 900, color: BRAND.espresso, letterSpacing: '0.15em', textTransform: 'uppercase', fontFamily: FONTS.main }}>Exclusive Access</span>
                            </motion.div>

                            <motion.h2
                                initial={{ opacity: 0, y: 20 }}
                                animate={inView ? { opacity: 1, y: 0 } : {}}
                                transition={{ duration: 0.6, delay: 0.1 }}
                                style={{ fontFamily: FONTS.main, fontSize: F_SIZE.xl, fontWeight: 900, color: BRAND.espresso, margin: '0 0 16px', lineHeight: 1.1, letterSpacing: '-0.04em' }}
                            >
                                The <span style={{ color: BRAND.burgundy }}>Insider</span> Bundle.
                            </motion.h2>

                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={inView ? { opacity: 1, y: 0 } : {}}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                style={{ fontFamily: FONTS.main, fontSize: F_SIZE.md, color: BRAND.taupe, lineHeight: 1.6, margin: 0, maxWidth: 500 }}
                            >
                                Join the elite circle of PlainFuel users. Get personalized nutrient packs delivered monthly with 30% savings and priority support.
                            </motion.p>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
                            {[
                                { label: 'Saving', value: '30%' },
                                { label: 'Reviews', value: '4.9/5' },
                                { label: 'Flavors', value: '6+' }
                            ].map((stat, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={inView ? { opacity: 1, scale: 1 } : {}}
                                    transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
                                    style={{ padding: '20px', borderRadius: 20, background: BRAND.cream, border: `1px solid ${BRAND.espresso}05`, textAlign: 'center' }}
                                >
                                    <div style={{ fontSize: F_SIZE.lg, fontWeight: 900, color: BRAND.espresso }}>{stat.value}</div>
                                    <div style={{ fontSize: F_SIZE.sm, color: BRAND.taupe, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{stat.label}</div>
                                </motion.div>
                            ))}
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            {PERKS.map((perk, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={inView ? { opacity: 1, x: 0 } : {}}
                                    transition={{ duration: 0.4, delay: 0.6 + i * 0.1 }}
                                    style={{ display: 'flex', alignItems: 'center', gap: 12 }}
                                >
                                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: `${BRAND.burgundy}10`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        {perk.icon}
                                    </div>
                                    <span style={{ fontFamily: FONTS.main, fontSize: F_SIZE.sm, color: BRAND.espresso, fontWeight: 600 }}>{perk.text}</span>
                                </motion.div>
                            ))}
                        </div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={inView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.6, delay: 0.9 }}
                        >
                            <button
                                onMouseEnter={() => setBtnHover(true)}
                                onMouseLeave={() => setBtnHover(false)}
                                style={{
                                    padding: '18px 40px',
                                    borderRadius: 100,
                                    background: BRAND.espresso,
                                    color: BRAND.white,
                                    border: 'none',
                                    fontFamily: FONTS.main,
                                    fontSize: F_SIZE.md,
                                    fontWeight: 900,
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 12,
                                    transition: 'all 0.3s ease',
                                    boxShadow: btnHover ? `0 20px 40px ${BRAND.espresso}30` : '0 10px 20px rgba(0,0,0,0.1)',
                                    transform: btnHover ? 'translateY(-4px)' : 'translateY(0)'
                                }}
                            >
                                <ShoppingBag size={20} />
                                Subscribe & Save
                                <ArrowRight size={20} style={{ transform: btnHover ? 'translateX(4px)' : 'translateX(0)', transition: 'transform 0.3s ease' }} />
                            </button>
                        </motion.div>
                    </div>

                    {/* RIGHT IMAGE */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={inView ? { opacity: 1, scale: 1 } : {}}
                        transition={{ duration: 1, delay: 0.2 }}
                        style={{ position: 'relative' }}
                    >
                        <div style={{ position: 'absolute', inset: -40, background: `radial-gradient(circle, ${BRAND.burgundy}08 0%, transparent 70%)` }} />
                        <div style={{ position: 'relative', borderRadius: 40, overflow: 'hidden', boxShadow: '0 40px 80px rgba(0,0,0,0.12)', border: `8px solid ${BRAND.white}` }}>
                            <Image
                                src="/images/insidebundle.png"
                                alt="Inside Bundle"
                                width={600}
                                height={600}
                                style={{ width: '100%', height: 'auto', display: 'block' }}
                            />
                            <div style={{ position: 'absolute', top: 24, right: 24, padding: '12px 24px', background: BRAND.burgundy, color: BRAND.white, borderRadius: 100, fontWeight: 900, fontSize: F_SIZE.sm }}>
                                BEST VALUE
                            </div>
                        </div>

                        {/* Floating elements */}
                        <motion.div
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                            style={{
                                position: 'absolute',
                                bottom: 40,
                                left: -20,
                                padding: '16px 24px',
                                background: BRAND.white,
                                borderRadius: 20,
                                boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 12,
                                border: `1px solid ${BRAND.espresso}05`
                            }}
                        >
                            <div style={{ width: 40, height: 40, borderRadius: '50%', background: BRAND.cream, overflow: 'hidden' }}>
                                <Image src="/images/avatar.jpg" alt="User" width={40} height={40} />
                            </div>
                            <div>
                                <div style={{ fontSize: F_SIZE.sm, fontWeight: 900, color: BRAND.espresso }}>Anita S.</div>
                                <div style={{ fontSize: 10, color: BRAND.taupe }}>Verified Insider</div>
                            </div>
                        </motion.div>
                    </motion.div>

                </div>
            </div>

            <style>{`
                @media (max-width: 900px) {
                    div[style*="grid-template-columns: 1.2fr 1fr"] {
                        grid-template-columns: 1fr !important;
                        gap: 48px;
                    }
                }
            `}</style>
        </section>
    );
}
