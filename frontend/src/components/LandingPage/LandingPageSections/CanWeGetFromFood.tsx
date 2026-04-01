'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Image from 'next/image';
import {
    CheckCircle2, FlaskConical, Microscope, Info,
    PlayCircle
} from 'lucide-react';
import { F_SIZE, FONTS, BRAND } from '@/lib/typography';

/* ── SUB-COMPONENTS ── */

function DataChip({ label, value, color = BRAND.espresso }: { label: string; value: string; color?: string }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, padding: '16px 20px', borderRadius: 24, background: BRAND.white, border: `1px solid ${BRAND.espresso}08`, boxShadow: '0 10px 30px rgba(0,0,0,0.02)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: color }} />
                <div style={{ fontFamily: FONTS.main, fontSize: F_SIZE.sm, fontWeight: 900, color: BRAND.ink, letterSpacing: '-0.01em' }}>{label}</div>
            </div>
            <div style={{ paddingLeft: 22, fontFamily: FONTS.main, fontSize: F_SIZE.md, fontWeight: 800, color: color, lineHeight: 1.6 }}>{value}</div>
        </div>
    );
}

function SectionHeader({ eyebrow, title, desc }: { eyebrow: string; title: React.ReactNode; desc: React.ReactNode }) {
    return (
        <div style={{ marginBottom: 24 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '6px 16px', borderRadius: 100, background: BRAND.white, border: `1px solid ${BRAND.espresso}15`, marginBottom: 20 }}>
                <Microscope size={14} color={BRAND.burgundy} />
                <span style={{ fontSize: F_SIZE.sm, fontWeight: 900, color: BRAND.espresso, letterSpacing: '0.15em', textTransform: 'uppercase', fontFamily: FONTS.main }}>{eyebrow}</span>
            </div>
            <h2 style={{ fontFamily: FONTS.main, fontSize: F_SIZE.xl, fontWeight: 900, color: BRAND.ink, lineHeight: 1.15, letterSpacing: '-0.04em', margin: '0 0 12px' }}>
                {title}
            </h2>
            <p style={{ fontFamily: FONTS.main, fontSize: F_SIZE.md, color: BRAND.ink, lineHeight: 1.8, margin: 0, fontWeight: 600 }}>
                {desc}
            </p>
        </div>
    );
}

/* ── MAIN ── */
export default function CanWeGetFromFood() {
    const sectionRef = useRef(null);
    const inView = useInView(sectionRef, { once: true, margin: '-100px' });

    return (
        <section ref={sectionRef} style={{ background: BRAND.cream, padding: '32px 24px', position: 'relative', overflow: 'hidden' }}>

            <div style={{ maxWidth: 1280, margin: '0 auto', position: 'relative', zIndex: 1 }}>

                <div className="food-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 1.2fr', gap: 64, alignItems: 'center' }}>

                    {/* LEFT — Case Study Card */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={inView ? { opacity: 1, scale: 1 } : {}}
                        transition={{ duration: 1 }}
                        style={{ position: 'relative', width: '100%', aspectRatio: '4/5', borderRadius: 48, overflow: 'hidden', boxShadow: '0 40px 80px rgba(0,0,0,0.12)', background: BRAND.espresso }}
                    >
                        <Image src="/images/why/bg-diet.png" alt="Dietary Gap" fill style={{ objectFit: 'cover', opacity: 0.4 }} priority />
                        <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to top, ${BRAND.espresso} 0%, transparent 50%)`, zIndex: 1 }} />

                        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 40, zIndex: 2 }}>
                            <PlayCircle size={80} color={BRAND.white} strokeWidth={1} style={{ opacity: 0.4 }} />
                        </div>

                        <div style={{ position: 'absolute', top: 32, left: 32, zIndex: 2 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 20px', borderRadius: 100, background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)' }}>
                                <FlaskConical size={14} color={BRAND.burgundy} />
                                <span style={{ fontFamily: FONTS.main, fontSize: 12, fontWeight: 900, color: BRAND.white, textTransform: 'uppercase', letterSpacing: '0.2em' }}>Biomarker Case Study</span>
                            </div>
                        </div>

                        <div style={{ position: 'absolute', bottom: 40, left: 40, right: 40, zIndex: 2 }}>
                            <div style={{ padding: '24px', background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(32px)', borderRadius: 28, border: '1px solid rgba(255,255,255,0.1)' }}>
                                <p style={{ fontFamily: FONTS.main, fontSize: F_SIZE.sm, color: BRAND.stone, lineHeight: 1.7, margin: 0, fontWeight: 600 }}>Discover why reaching clinical nutritional thresholds through whole food alone is a logistical challenge.</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* RIGHT — Content */}
                    <div>
                        <SectionHeader
                            eyebrow="Theoretical vs Practical"
                            title={<span>Can we get everything <br /> from <span style={{ color: BRAND.accent }}>food?</span></span>}
                            desc="In theory, yes. In reality, it is difficult to do consistently in our modern world. Let's look at the numbers:"
                        />

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
                            <DataChip label="Spinach is considered rich in iron" value="But to meet daily iron needs, you would need around 600 grams of spinach every day." color="#ef4444" />
                            <DataChip label="Ragi is rich in calcium" value="To meet daily calcium needs, you would need around 300 grams of ragi daily." color="#92400e" />
                            <DataChip label="Eggs provide Vitamin D3" value="To meet daily requirements, you would need 15 or more eggs every day" color="#eab308" />
                        </div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={inView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.8 }}
                            style={{ padding: '24px', background: BRAND.white, borderRadius: 40, border: `1px solid ${BRAND.espresso}08`, boxShadow: '0 20px 40px rgba(0,0,0,0.02)' }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                                <Info size={18} color={BRAND.taupe} />
                                <div style={{ fontFamily: FONTS.main, fontSize: F_SIZE.sm, fontWeight: 900, textTransform: 'uppercase', color: BRAND.espresso, letterSpacing: '0.15em' }}>Consistency & Practicality</div>
                            </div>
                            <h4 style={{ fontFamily: FONTS.main, fontSize: F_SIZE.lg, fontWeight: 900, color: BRAND.ink, marginBottom: 16 }}>This is not practical for most people.</h4>
                            <p style={{ fontFamily: FONTS.main, fontSize: F_SIZE.md, color: BRAND.ink, lineHeight: 1.8, margin: 0, fontWeight: 500 }}>
                                So the problem is not lack of knowledge. The problem is <span style={{ color: BRAND.burgundy, fontWeight: 900 }}>consistency and practicality.</span>
                            </p>
                            <div style={{ marginTop: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
                                <div style={{ width: 32, height: 1, background: BRAND.stone }} />
                                <span style={{ fontFamily: FONTS.accent, fontSize: F_SIZE.lg, color: BRAND.burgundy, fontWeight: 700 }}>A Practical Choice.</span>
                            </div>
                        </motion.div>
                    </div>

                </div>

            </div>

            <style>{`
                @media (max-width: 1024px) {
                    .food-grid { grid-template-columns: 1fr !important; gap: 48px !important; }
                }
            `}</style>
        </section>
    );
}
