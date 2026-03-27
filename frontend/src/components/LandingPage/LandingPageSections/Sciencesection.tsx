'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Microscope, FlaskConical, Beaker, ShieldCheck, Sparkles } from 'lucide-react';
import { F_SIZE, BRAND, FONTS } from '@/lib/typography';
import Image from 'next/image';

/* ── Design Tokens ── */

function FeatureCard({ icon, title, text, delay = 0 }: { icon: React.ReactNode; title: string; text: string; delay?: number }) {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: '-100px' });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay }}
            style={{
                background: BRAND.white,
                padding: '24px',
                borderRadius: 24,
                border: `1px solid ${BRAND.espresso}08`,
                boxShadow: '0 10px 30px rgba(0,0,0,0.02)',
                display: 'flex',
                flexDirection: 'column',
                gap: 16
            }}
        >
            <div style={{ width: 48, height: 48, borderRadius: 16, background: BRAND.cream, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {icon}
            </div>
            <div>
                <h4 style={{ fontFamily: FONTS.main, fontSize: F_SIZE.md, fontWeight: 900, color: BRAND.espresso, marginBottom: 8 }}>{title}</h4>
                <p style={{ fontFamily: FONTS.main, fontSize: F_SIZE.sm, color: BRAND.taupe, lineHeight: 1.6, margin: 0 }}>{text}</p>
            </div>
        </motion.div>
    );
}

export default function Sciencesection() {
    const sectionRef = useRef(null);
    const inView = useInView(sectionRef, { once: true, margin: '-100px' });

    return (
        <section
            ref={sectionRef}
            style={{
                backgroundColor: BRAND.cream,
                padding: '80px 24px',
                position: 'relative',
                overflow: 'hidden'
            }}
        >
            {/* Ambient Background Elements */}
            <div style={{ position: 'absolute', top: '10%', right: '-5%', width: '40vw', height: '40vw', background: `radial-gradient(circle, ${BRAND.burgundy}05 0%, transparent 70%)`, pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', bottom: '10%', left: '-5%', width: '30vw', height: '30vw', background: `radial-gradient(circle, ${BRAND.espresso}05 0%, transparent 70%)`, pointerEvents: 'none' }} />

            <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>
                
                <div style={{ textAlign: 'center', marginBottom: 56 }}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={inView ? { opacity: 1, scale: 1 } : {}}
                        transition={{ duration: 0.5 }}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '6px 16px', borderRadius: 100, background: BRAND.white, border: `1px solid ${BRAND.espresso}15`, marginBottom: 24 }}
                    >
                        <Sparkles size={14} color={BRAND.burgundy} />
                        <span style={{ fontSize: F_SIZE.sm, fontWeight: 800, color: BRAND.espresso, letterSpacing: '0.15em', textTransform: 'uppercase', fontFamily: FONTS.main }}>The Science of Sufficiency</span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={inView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        style={{ fontFamily: FONTS.main, fontSize: F_SIZE.xl, fontWeight: 900, color: BRAND.espresso, margin: '0 0 16px', lineHeight: 1.1, letterSpacing: '-0.04em' }}
                    >
                        Bridging the <span style={{ color: BRAND.burgundy }}>Biological Delta</span>.
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={inView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        style={{ fontFamily: FONTS.main, fontSize: F_SIZE.md, color: BRAND.taupe, maxWidth: 640, margin: '0 auto', lineHeight: 1.6 }}
                    >
                        We use clinically-proven, bio-identical nutrients to address the specific metabolic gaps in the modern Indian diet.
                    </motion.p>
                </div>

                <div className="sci-grid">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
                        <FeatureCard
                            icon={<Microscope size={24} color={BRAND.burgundy} />}
                            title="Bio-Identical Formulation"
                            text="Our nutrients are recognized by your body as natural, ensuring maximum cellular absorption and biological availability."
                            delay={0.3}
                        />
                        <FeatureCard
                            icon={<FlaskConical size={24} color={BRAND.burgundy} />}
                            title="Precision Dosing"
                            text="No fillers, no fluff. Just the exact levels of vitamins and minerals required to maintain peak metabolic health."
                            delay={0.4}
                        />
                        <FeatureCard
                            icon={<Beaker size={24} color={BRAND.burgundy} />}
                            title="Synergistic Effects"
                            text="Engineered to work together. Each ingredient enhances the absorption and efficacy of the others for superior results."
                            delay={0.5}
                        />
                        <FeatureCard
                            icon={<ShieldCheck size={24} color={BRAND.burgundy} />}
                            title="Pharmaceutical Grade"
                            text="Manufactured in state-of-the-art facilities with rigorous testing to ensure 100% purity and potency in every sachet."
                            delay={0.6}
                        />
                    </div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8, delay: 0.7 }}
                    style={{
                        marginTop: 64,
                        padding: '40px',
                        borderRadius: 32,
                        background: BRAND.espresso,
                        color: BRAND.white,
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: 40,
                        alignItems: 'center',
                        position: 'relative',
                        overflow: 'hidden'
                    }}
                >
                    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0.1 }}>
                        <Image src="/images/science-pattern.png" alt="Pattern" fill style={{ objectFit: 'cover' }} />
                    </div>
                    
                    <div style={{ position: 'relative', zIndex: 1 }}>
                        <h3 style={{ fontFamily: FONTS.main, fontSize: F_SIZE.lg, fontWeight: 900, marginBottom: 16 }}>Why it works?</h3>
                        <p style={{ fontFamily: FONTS.main, fontSize: F_SIZE.md, color: 'rgba(255,255,255,0.7)', lineHeight: 1.8, margin: 0 }}>
                            Most supplements use synthetic forms that the body struggles to process. PlainFuel utilizes bio-identical structures that merge seamlessly with your metabolism, providing immediate and sustainable energy and health benefits.
                        </p>
                    </div>

                    <div style={{ position: 'relative', zIndex: 1, padding: '24px', background: 'rgba(255,255,255,0.05)', borderRadius: 24, border: '1px solid rgba(255,255,255,0.1)' }}>
                        <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: F_SIZE.lg, fontWeight: 900, color: BRAND.burgundy }}>95%</div>
                                <div style={{ fontSize: F_SIZE.sm, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Absorption Rate</div>
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: F_SIZE.lg, fontWeight: 900, color: BRAND.burgundy }}>0%</div>
                                <div style={{ fontSize: F_SIZE.sm, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Synthetic Fillers</div>
                            </div>
                        </div>
                        <p style={{ fontFamily: FONTS.main, fontSize: F_SIZE.sm, color: BRAND.white, fontStyle: 'italic', margin: 0 }}>
                            "Precision is the only path to restorative health." — PlainFuel Science Team
                        </p>
                    </div>
                </motion.div>
            </div>

            <style>{`
                @media (max-width: 900px) {
                    div[style*="grid-template-columns: 1fr 1fr"] {
                        grid-template-columns: 1fr !important;
                    }
                }
            `}</style>
        </section>
    );
}
