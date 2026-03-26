'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Image from 'next/image';
import {
    Sparkles, Zap, Target, Shield,
    Fingerprint, CheckCircle2,
    Microscope, Activity, Dna
} from 'lucide-react';

/* ── Design Tokens (Glacier Professional) ── */
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
    glass: 'rgba(255, 255, 255, 0.7)',
    border: 'rgba(0, 0, 0, 0.05)',
};

const FONTS = {
    main: "'Montserrat', sans-serif",
    accent: "'Caveat', cursive",
};

/* ── DATA ── */
const PAGES = [
    {
        icon: <Shield size={22} />,
        headline: "What does PlainFuel contain?",
        content: "Each serving of PlainFuel is designed to provide balanced daily support: The goal is not to overload the body, but to provide consistent and balanced nutrition.",
        list: [
            { title: "Protein", desc: "25g of whey protein with a complete amino acid profile" },
            { title: "Fiber", desc: "6g to support digestion" },
            { title: "Vitamins", desc: "B-complex, Vitamin D3, and Vitamin C (covering a significant portion of daily needs)" },
            { title: "Minerals", desc: "Calcium, Magnesium, Zinc, and Selenium" },
            { title: "Digestive Enzymes", desc: "To improve absorption and reduce digestive issues" }
        ],
        note: "Balanced & Consistent.",
        isFull: false
    },
    {
        icon: <Target size={22} />,
        headline: "How does this help?",
        content: "PlainFuel supports multiple essential functions in the body. It is not about instant results. It is about supporting your body every day.",
        list: [
            { title: "Energy and focus", desc: "B vitamins and magnesium help in how your body produces and uses energy" },
            { title: "Recovery and sleep", desc: "Protein supports muscle recovery, while magnesium helps with relaxation" },
            { title: "Bone and structural health", desc: "Calcium and Vitamin D3 support bone strength" },
            { title: "Overall daily functioning", desc: "Zinc and other micronutrients support normal body processes" }
        ],
        note: "Supporting Body Processes.",
        isFull: false
    },
    {
        icon: <Sparkles size={22} />,
        headline: "How does PlainFuel fit into daily life?",
        content: "PlainFuel is designed to be easy to use.",
        list: [
            { title: "Simple Habit", desc: "Take one sachet daily" },
            { title: "Replacement", desc: "Replace your regular protein" },
            { title: "Minimalist", desc: "No need for multiple supplements" },
            { title: "Versatile", desc: "Works with any diet" }
        ],
        note: "The focus is not perfection. The focus is consistency.",
        isFull: true
    }
];

/* ── COMPONENTS ── */

function SectionHeader({ eyebrow, title }: { eyebrow: string; title: string }) {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true });
    return (
        <div ref={ref} style={{ marginBottom: 32 }}>
            <motion.div initial={{ opacity: 0, x: -20 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.6 }} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                <div style={{ width: 40, height: 2, background: C.leaf, borderRadius: 2 }} />
                <span style={{ fontFamily: FONTS.main, fontSize: 11, fontWeight: 900, textTransform: 'uppercase', color: C.leaf, letterSpacing: '0.2em' }}>{eyebrow}</span>
            </motion.div>
            <motion.h2 initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.1 }} style={{ fontFamily: FONTS.main, fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 900, color: C.ink, margin: 0, letterSpacing: '-0.04em', lineHeight: 1 }}>{title}</motion.h2>
        </div>
    );
}

function ClinicalCard({ data, index }: { data: any; index: number }) {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: '-50px' });

    if (data.isFull) {
        return (
            <motion.div
                ref={ref}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: index * 0.1, ease: [0.165, 0.84, 0.44, 1] }}
                whileHover={{ y: -8, boxShadow: `0 40px 80px rgba(0,0,0,0.15)` }}
                className="clinical-card full-width"
                style={{
                    background: `linear-gradient(135deg, ${C.deep} 0%, ${C.forest} 100%)`,
                    borderRadius: 36,
                    padding: '24px',
                    border: `1px solid rgba(255, 255, 255, 0.08)`,
                    boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                {/* Dark glow accent */}
                <div style={{ position: 'absolute', top: 0, right: 0, width: '60%', height: '100%', background: `radial-gradient(circle at right, ${C.leaf}15 0%, transparent 60%)`, pointerEvents: 'none' }} />

                <div className="clinical-inner-full" style={{ position: 'relative', zIndex: 2, height: '100%', alignItems: 'center' }}>

                    {/* Left Text Layer */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        <div style={{ width: 56, height: 56, borderRadius: 16, background: `linear-gradient(135deg, ${C.gold} 0%, #d4af37 100%)`, color: C.white, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 10px 20px rgba(184, 149, 58, 0.4)` }}>
                            {data.icon}
                        </div>
                        <h3 style={{ fontFamily: FONTS.main, fontSize: 'clamp(28px, 3.5vw, 40px)', fontWeight: 900, color: C.white, letterSpacing: '-0.02em', margin: 0, lineHeight: 1.1 }}>
                            {data.headline}
                        </h3>
                        <p style={{ fontFamily: FONTS.main, fontSize: 18, color: 'rgba(255,255,255,0.8)', lineHeight: 1.6, margin: 0, maxWidth: 400 }}>
                            {data.content}
                        </p>
                    </div>

                    {/* Right Grid Layer */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                        {data.list && (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
                                {data.list.map((it: any, i: number) => (
                                    <div key={i} style={{ padding: '16px', borderRadius: 20, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', backdropFilter: 'blur(10px)' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                                            <div style={{ width: 28, height: 28, borderRadius: 8, background: `${C.leaf}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.leaf }}>
                                                <CheckCircle2 size={14} />
                                            </div>
                                            <strong style={{ color: C.white, fontFamily: FONTS.main, fontSize: 15 }}>{it.title}</strong>
                                        </div>
                                        <div style={{ color: 'rgba(255,255,255,0.5)', fontFamily: FONTS.main, fontSize: 14, lineHeight: 1.5 }}>
                                            {it.desc}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {data.note && (
                            <div style={{ paddingTop: 16, borderTop: `1px solid rgba(255,255,255,0.1)` }}>
                                <p style={{ fontFamily: FONTS.accent, fontSize: 22, color: C.gold, margin: 0, fontWeight: 700 }}>{data.note}</p>
                            </div>
                        )}
                    </div>

                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: index * 0.1, ease: [0.165, 0.84, 0.44, 1] }}
            whileHover={{ y: -8, boxShadow: '0 40px 80px rgba(0,0,0,0.06)' }}
            className={`clinical-card`}
            style={{
                background: C.glass,
                backdropFilter: 'blur(32px)',
                WebkitBackdropFilter: 'blur(32px)',
                borderRadius: 28,
                padding: '24px',
                border: `1px solid ${C.white}60`,
                boxShadow: '0 10px 40px rgba(0,0,0,0.02)',
                display: 'flex',
                flexDirection: 'column',
                gap: 16,
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1)',
                minHeight: 480
            }}
        >
            <Image
                src={`/images/FiveInOne/${index + 1}.png`}
                alt={data.headline}
                fill
                style={{ objectFit: 'cover', opacity: 0.05, pointerEvents: 'none' }}
            />

            <div className={'clinical-inner-standard'} style={{ position: 'relative', zIndex: 2, height: '100%' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16, height: '100%' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ width: 44, height: 44, borderRadius: 12, background: C.forest, color: C.white, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {data.icon}
                        </div>
                        <div style={{ display: 'flex', gap: 6 }}>
                            {[1, 2].map(i => <div key={i} style={{ width: 4, height: 4, borderRadius: '50%', background: C.silver, opacity: 0.2 }} />)}
                        </div>
                    </div>

                    <h3 style={{ fontFamily: FONTS.main, fontSize: 24, fontWeight: 900, color: C.ink, letterSpacing: '-0.025em', margin: 0, lineHeight: 1.1 }}>{data.headline}</h3>

                    <div style={{ fontFamily: FONTS.main, fontSize: 16, color: C.silver, lineHeight: 1.7, fontWeight: 500 }}>
                        {data.content}
                    </div>

                    <div style={{ marginTop: 'auto', paddingTop: 16, borderTop: `1px solid ${C.border}` }}>
                        <p style={{ fontFamily: FONTS.accent, fontSize: 20, color: C.gold, margin: 0, fontWeight: 700 }}>{data.note}</p>
                    </div>
                </div>
            </div>

            <div style={{ position: 'absolute', bottom: -20, right: -20, width: 100, height: 100, background: `radial-gradient(circle, ${C.forest}03 0%, transparent 70%)` }} />
        </motion.div>
    );
}

export default function FiveInOneSection() {
    return (
        <section style={{ padding: '32px 0', background: C.white, position: 'relative', overflow: 'hidden' }}>
            <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 40px', position: 'relative', zIndex: 1 }}>
                <SectionHeader eyebrow="The Logic" title="PlainFuel — A Simple Approach." />
                <div className="clinical-grid">
                    {PAGES.map((p, i) => (
                        <ClinicalCard key={i} data={p} index={i} />
                    ))}
                </div>

                <div style={{ marginTop: 32, display: 'flex', flexWrap: 'wrap', gap: 24, justifyContent: 'center' }}>
                    {[
                        { icon: <Microscope size={18} />, text: "Lab Verified Constituents" },
                        { icon: <Activity size={18} />, text: "Optimized Bio-Availability" },
                        { icon: <Dna size={18} />, text: "Zero Amino Spiking" }
                    ].map((t, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, color: C.ink, fontFamily: FONTS.main, fontSize: 12, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                            <span style={{ color: C.leaf }}>{t.icon}</span>
                            {t.text}
                        </div>
                    ))}
                </div>

                {/* ── CINEMATIC FINAL THOUGHT (MOVED HERE) ── */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="cinematic-footer-grid"
                    style={{
                        marginTop: 48,
                        borderRadius: 48,
                        background: `linear-gradient(135deg, ${C.deep} 0%, ${C.mid} 100%)`,
                        position: 'relative',
                        display: 'grid',
                        gridTemplateColumns: '1.2fr 1fr',
                        overflow: 'hidden',
                        boxShadow: '0 50px 100px rgba(0,0,0,0.12)',
                        border: `1px solid rgba(255,255,255,0.05)`
                    }}
                >
                    {/* Text Content */}
                    <div style={{ padding: '32px', position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                            <div style={{ width: 10, height: 10, borderRadius: '50%', background: C.leaf, boxShadow: `0 0 20px ${C.leaf}` }} />
                            <span style={{ fontFamily: FONTS.main, fontSize: 10, fontWeight: 900, color: C.leaf, textTransform: 'uppercase', letterSpacing: '0.25em' }}>Closing Perspective</span>
                        </div>

                        <h4 style={{
                            fontFamily: FONTS.main,
                            fontSize: 'clamp(2.2rem, 4vw, 3.8rem)',
                            fontWeight: 900,
                            color: C.white,
                            marginBottom: 20,
                            lineHeight: 1.05,
                            letterSpacing: '-0.04em'
                        }}>A Daily Ritual of<br /><span style={{ background: `linear-gradient(to right, ${C.leaf}, #4ade80)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Collective Prevention.</span></h4>

                        <div style={{ position: 'relative', borderLeft: `3px solid ${C.leaf}30`, paddingLeft: 32, marginBottom: 16 }}>
                            <p style={{
                                fontFamily: FONTS.main,
                                fontSize: 18,
                                color: 'rgba(255,255,255,0.75)',
                                lineHeight: 1.8,
                                fontWeight: 500,
                                margin: 0
                            }}>
                                Most health problems related to nutrition don’t happen suddenly. They build over time. Prevention is easier than correction. Instead of fixing deficiencies after they appear, it is better to consistently meet your daily nutritional needs.
                            </p>
                            <p style={{
                                fontFamily: FONTS.main,
                                fontSize: 18,
                                color: 'rgba(255,255,255,0.75)',
                                lineHeight: 1.8,
                                fontWeight: 500,
                                marginTop: 12,
                                margin: '12px 0 0'
                            }}>
                                PlainFuel is built around that idea. A simple habit. Done daily. Making nutrition easier to manage.
                            </p>
                        </div>

                        <div style={{ marginTop: 20, display: 'flex', alignItems: 'center', gap: 20 }}>
                            <div style={{ width: 48, height: 1, background: 'rgba(22, 163, 74, 0.4)' }} />
                            <span style={{ fontFamily: FONTS.accent, fontSize: 28, color: C.leaf, fontWeight: 700 }}>The New Standard for Tomorrow.</span>
                        </div>
                    </div>

                    {/* Image Side */}
                    <div style={{ position: 'relative', minHeight: 400 }}>
                        <Image
                            src="/images/lifestyle_final.png"
                            alt="Modern Healthy Lifestyle"
                            fill
                            style={{ objectFit: 'cover' }}
                            priority
                        />
                        {/* Cinematic Overlay Fades */}
                        <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to right, ${C.deep} 0%, transparent 40%)`, zIndex: 1 }} />
                        <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to bottom, transparent 60%, ${C.mid} 100%)`, zIndex: 1 }} />

                        {/* Dynamic Glow Accent */}
                        <div style={{ position: 'absolute', top: '10%', right: '10%', width: '40%', height: '40%', background: `radial-gradient(circle, ${C.leaf}10 0%, transparent 70%)`, pointerEvents: 'none' }} />
                    </div>
                </motion.div>
            </div>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&family=Caveat:wght@600;700&display=swap');
                .clinical-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
                .clinical-card.full-width { grid-column: 1 / -1; }
                
                .clinical-inner-full { display: grid; grid-template-columns: 1fr 1.2fr; gap: 24px; }
                .clinical-inner-standard { display: flex; flex-direction: column; }

                @media (max-width: 1024px) { 
                    .clinical-grid { grid-template-columns: 1fr; } 
                    .clinical-card.full-width { grid-column: auto; } 
                }
                @media (max-width: 960px) {
                    .cinematic-footer-grid { grid-template-columns: 1fr !important; }
                }
                @media (max-width: 768px) {
                    .clinical-inner-full { grid-template-columns: 1fr; gap: 24px; }
                }
            `}</style>
        </section>
    );
}