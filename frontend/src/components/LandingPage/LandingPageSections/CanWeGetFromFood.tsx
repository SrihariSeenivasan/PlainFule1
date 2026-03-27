'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Image from 'next/image';
import {
    CheckCircle2, FlaskConical, Microscope, Info,
    PlayCircle
} from 'lucide-react';
import { F_SIZE } from '@/lib/typography';

/* ── Design Tokens (Glacier Scientific) ── */
const C = {
    forest: '#0a3d1f',
    deep: '#071a0d',
    mid: '#14532d',
    leaf: '#16a34a',
    ink: '#070d08',
    white: '#ffffff',
    offwhite: '#fafafa',
    mist: '#f1f5f9',
    gold: '#854d0e',
    silver: '#64748b',
    glass: 'rgba(255, 255, 255, 0.75)',
    border: 'rgba(0, 0, 0, 0.05)',
};

const FONTS = {
    main: "'Montserrat', sans-serif",
    accent: "'Caveat', cursive",
};

/* ── SUB-COMPONENTS ── */

function DataChip({ label, value, color = C.forest }: { label: string; value: string; color?: string }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, padding: '16px 20px', borderRadius: 20, background: C.white, border: `1px solid ${C.border}`, boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: color }} />
                <div style={{ fontFamily: FONTS.main, fontSize: F_SIZE.sm, fontWeight: 700, color: C.ink }}>{label}</div>
            </div>
            <div style={{ paddingLeft: 18, fontFamily: FONTS.main, fontSize: F_SIZE.sm, fontWeight: 800, color: color, lineHeight: 1.4 }}>{value}</div>
        </div>
    );
}

function SectionBadge({ text, icon: Icon }: { text: string; icon?: any }) {
    return (
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '6px 16px', borderRadius: 100, background: C.white, border: `1px solid ${C.forest}15`, backdropFilter: 'blur(10px)', marginBottom: 20 }}>
            {Icon && <Icon size={12} color={C.gold} />}
            <span style={{ fontSize: F_SIZE.sm, fontWeight: 900, color: C.forest, letterSpacing: '0.15em', textTransform: 'uppercase', fontFamily: FONTS.main }}>{text}</span>
        </div>
    );
}

/* ── MAIN ── */
export default function CanWeGetFromFood() {
    const sectionRef = useRef(null);
    const inView = useInView(sectionRef, { once: true, margin: '-100px' });

    return (
        <section ref={sectionRef} style={{ background: C.offwhite, padding: '32px 0', position: 'relative', overflow: 'hidden' }}>

            {/* Background Atmosphere */}
            <div style={{ position: 'absolute', top: '10%', right: '-10%', width: '50vw', height: '50vw', background: `radial-gradient(circle, ${C.forest}04 0%, transparent 70%)`, pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', bottom: '10%', left: '-10%', width: '40vw', height: '40vw', background: `radial-gradient(circle, ${C.gold}04 0%, transparent 70%)`, pointerEvents: 'none' }} />

            <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 40px', position: 'relative', zIndex: 1 }}>

                <div className="food-grid">

                    {/* LEFT — Scientific Integration (Display) */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={inView ? { opacity: 1, scale: 1 } : {}}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        style={{ position: 'relative', width: '100%', aspectRatio: '9/16', maxHeight: 600, borderRadius: 40, border: `1px solid ${C.white}80`, overflow: 'hidden', boxShadow: '0 48px 96px rgba(0,0,0,0.12)', background: C.deep }}
                    >
                        <Image src="/images/why/bg-diet.png" alt="Dietary Gap" fill style={{ objectFit: 'cover', opacity: 0.4 }} />
                        <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to top, ${C.deep} 0%, transparent 40%)`, zIndex: 1 }} />
                        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 40, zIndex: 2 }}>
                            <PlayCircle size={64} color={C.white} strokeWidth={1} style={{ opacity: 0.4, marginBottom: 24 }} />
                            <h4 style={{ fontFamily: FONTS.main, fontSize: F_SIZE.md, color: C.white, fontWeight: 700, margin: 0, opacity: 0.7 }}>The Feasibility Gap.</h4>
                        </div>

                        <div style={{ position: 'absolute', top: 32, left: 32, zIndex: 2 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 16px', borderRadius: 100, background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)' }}>
                                <FlaskConical size={14} color={C.leaf} />
                                <span style={{ fontFamily: FONTS.main, fontSize: F_SIZE.sm, fontWeight: 900, color: C.white, textTransform: 'uppercase', letterSpacing: '0.15em' }}>Biomarker Case Study</span>
                            </div>
                        </div>

                        <div style={{ position: 'absolute', bottom: 32, left: 32, right: 32, zIndex: 2 }}>
                            <div style={{ padding: '24px', background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(32px)', borderRadius: 24, border: '1px solid rgba(255,255,255,0.1)' }}>
                                <p style={{ fontFamily: FONTS.main, fontSize: F_SIZE.sm, color: 'rgba(255,255,255,0.8)', lineHeight: 1.6, margin: 0 }}>Discover why reaching clinical nutritional thresholds through whole food alone is a modern logistical challenge.</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* RIGHT — Analytical Content */}
                    <div>
                        <SectionBadge text="Theoretical vs Practical" icon={Microscope} />
                        <h2 style={{ fontFamily: FONTS.main, fontSize: F_SIZE.xl, fontWeight: 900, color: C.ink, lineHeight: 1.15, letterSpacing: '-0.03em', margin: '8px 0 12px' }}>
                            Can we get everything <br /> from <span style={{ color: C.leaf }}>food?</span>
                        </h2>

                        <p style={{ fontFamily: FONTS.main, fontSize: F_SIZE.md, color: C.ink, lineHeight: 1.75, marginBottom: 12 }}>
                            In theory, yes. In reality, it is difficult to do consistently. Let's look at simple examples:
                        </p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
                            <DataChip label="Spinach is considered rich in iron" value="But to meet daily iron needs, you would need around 600 grams of spinach every day" color="#ef4444" />
                            <DataChip label="Ragi is rich in calcium" value="To meet daily calcium needs, you would need around 300 grams of ragi daily" color={C.gold} />
                            <DataChip label="Eggs provide Vitamin D3" value="To meet daily requirements, you would need 15 or more eggs every day" color="#f59e0b" />
                        </div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={inView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            style={{ padding: '20px', background: C.white, borderRadius: 32, border: `1px solid ${C.forest}08`, boxShadow: '0 20px 60px rgba(0,0,0,0.04)', position: 'relative', overflow: 'hidden' }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                                <Info size={18} color={C.forest} style={{ opacity: 0.3 }} />
                                <div style={{ fontFamily: FONTS.main, fontSize: F_SIZE.sm, fontWeight: 900, textTransform: 'uppercase', color: C.forest, letterSpacing: '0.15em' }}>Consistency & Practicality</div>
                            </div>
                            <h4 style={{ fontFamily: FONTS.main, fontSize: F_SIZE.lg, fontWeight: 800, color: C.ink, marginBottom: 12 }}>This is not practical for most people.</h4>
                            <p style={{ fontFamily: FONTS.main, fontSize: F_SIZE.md, color: C.ink, lineHeight: 1.7, margin: 0 }}>
                                So the problem is not lack of knowledge. The problem is consistency and practicality.
                            </p>
                            <div style={{ marginTop: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
                                <CheckCircle2 size={16} color={C.leaf} />
                                <span style={{ fontFamily: FONTS.accent, fontSize: F_SIZE.md, color: C.leaf, fontWeight: 700 }}>Practical Choice.</span>
                            </div>
                        </motion.div>


                    </div>

                </div>

            </div>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&family=Caveat:wght@600;700&display=swap');
                
                .food-grid {
                    display: grid;
                    grid-template-columns: minmax(0, 1fr) 1.1fr;
                    gap: 32px;
                    align-items: center;
                }
                @media (max-width: 1024px) {
                    .food-grid {
                        grid-template-columns: 1fr;
                        gap: 24px;
                    }
                    .food-grid > div:first-child {
                        max-height: 400px;
                    }
                }
            `}</style>
        </section>
    );
}