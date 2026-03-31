'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Image from 'next/image';
import {
    Sparkles, Target, Shield,
    CheckCircle2, Microscope, Activity, Dna
} from 'lucide-react';
import { F_SIZE, FONTS, BRAND } from '@/lib/typography';

/* ── DATA ── */
const PAGES = [
    {
        icon: <Shield size={22} />,
        headline: "What does PlainFuel contain?",
        contentBefore: "Each serving of PlainFuel is designed to provide balanced daily support: ",
        list: [
            { title: "Protein", desc: "25g of whey protein with a complete amino acid profile" },
            { title: "Fiber", desc: "6g to support digestion" },
            { title: "Vitamins", desc: "B-complex, Vitamin D3, and Vitamin C (covering a significant portion of daily needs)" },
            { title: "Minerals", desc: "Calcium, Magnesium, Zinc, and Selenium" },
            { title: "Digestive Enzymes", desc: "To improve absorption and reduce digestive issues" }
        ],
        contentAfter: "The goal is not to overload the body, but to provide consistent and balanced nutrition.",
        note: "Balanced & Consistent.",
        isFull: false
    },
    {
        icon: <Target size={22} />,
        headline: "How does this help?",
        contentBefore: "PlainFuel supports multiple essential functions in the body:",
        list: [
            { title: "Energy and focus", desc: "B vitamins and magnesium help in how your body produces and uses energy" },
            { title: "Recovery and sleep", desc: "Protein supports muscle recovery, while magnesium helps with relaxation" },
            { title: "Bone and structural health", desc: "Calcium and Vitamin D3 support bone strength" },
            { title: "Overall daily functioning", desc: "Zinc and other micronutrients support normal body processes" }
        ],
        contentAfterPoints: [
            "It is not about instant results.",
            "It is about supporting your body every day."
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
        note: "The focus is consistency.",
        isFull: true
    }
];

/* ── COMPONENTS ── */

function SectionHeader({ eyebrow, title }: { eyebrow: string; title: React.ReactNode }) {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: '-100px' });
    return (
        <div ref={ref} style={{ marginBottom: 24 }}>
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6 }}
                style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}
            >
                <div style={{ width: 40, height: 2, background: BRAND.burgundy, borderRadius: 2 }} />
                <span style={{ fontFamily: FONTS.main, fontSize: F_SIZE.sm, fontWeight: 900, textTransform: 'uppercase', color: BRAND.burgundy, letterSpacing: '0.2em' }}>{eyebrow}</span>
            </motion.div>
            <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.1 }}
                style={{ fontFamily: FONTS.main, fontSize: F_SIZE.xl, fontWeight: 900, color: BRAND.ink, margin: 0, letterSpacing: '-0.04em', lineHeight: 1.1 }}
            >
                {title}
            </motion.h2>
        </div>
    );
}

function ClinicalCard({ data, index }: { data: any; index: number }) {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: '-100px' });

    if (data.isFull) {
        return (
            <motion.div
                ref={ref}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                style={{
                    background: BRAND.espresso,
                    borderRadius: 48,
                    padding: '40px',
                    boxShadow: '0 40px 100px rgba(0,0,0,0.15)',
                    gridColumn: '1 / -1',
                    position: 'relative',
                    overflow: 'hidden',
                }}
                className="full-card"
            >
                <div style={{ position: 'absolute', top: 0, right: 0, width: '60%', height: '100%', background: `radial-gradient(circle at right, ${BRAND.burgundy}20 0%, transparent 70%)` }} />

                <div className="card-inner-grid" style={{ position: 'relative', zIndex: 1, display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: 64, alignItems: 'center' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
                        <div style={{ width: 64, height: 64, borderRadius: 20, background: BRAND.burgundy, color: BRAND.white, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {data.icon}
                        </div>
                        <div>
                            <h3 style={{ fontFamily: FONTS.main, fontSize: F_SIZE.lg, fontWeight: 900, color: BRAND.white, marginBottom: 20, lineHeight: 1.25 }}>{data.headline}</h3>
                            <p style={{ fontFamily: FONTS.main, fontSize: F_SIZE.md, color: BRAND.stone, lineHeight: 1.8, margin: 0 }}>{data.content}</p>
                        </div>
                    </div>

                    <div className="list-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24 }}>
                        {data.list.map((it: any, i: number) => (
                            <div key={i} style={{ padding: '24px', borderRadius: 28, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                                    <CheckCircle2 size={18} color={BRAND.stone} />
                                    <strong style={{ color: BRAND.white, fontSize: F_SIZE.md, fontWeight: 800 }}>{it.title}</strong>
                                </div>
                                <p style={{ color: BRAND.stone, fontSize: F_SIZE.sm, lineHeight: 1.5, margin: 0, opacity: 0.8 }}>{it.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div style={{ marginTop: 48, paddingTop: 32, borderTop: `1px solid rgba(255,255,255,0.1)`, textAlign: 'center' }}>
                    <p style={{ fontFamily: FONTS.accent, fontSize: F_SIZE.lg, color: BRAND.stone, margin: 0, fontWeight: 700 }}>{data.note}</p>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: index * 0.1 }}
            style={{
                background: BRAND.white,
                borderRadius: 40,
                padding: '32px',
                boxShadow: '0 20px 40px rgba(0,0,0,0.04)',
                border: `1px solid ${BRAND.espresso}08`,
                position: 'relative',
                overflow: 'hidden',
                minHeight: 580,
                display: 'flex',
                flexDirection: 'column'
            }}
        >
            <div style={{ position: 'absolute', top: 0, right: 0, width: '100%', height: '100%', opacity: 0.05 }}>
                <Image src={`/images/FiveInOne/${index + 1}.png`} alt="Visual" fill style={{ objectFit: 'cover' }} />
            </div>

            <div style={{ position: 'relative', zIndex: 1, flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ width: 56, height: 56, borderRadius: 16, background: BRAND.espresso, color: BRAND.white, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 32 }}>
                    {data.icon}
                </div>

                <h3 style={{ fontFamily: FONTS.main, fontSize: F_SIZE.lg, fontWeight: 900, color: BRAND.espresso, marginBottom: 20, lineHeight: 1.25 }}>{data.headline}</h3>

                {data.contentBefore && (
                    <p style={{ fontFamily: FONTS.main, fontSize: F_SIZE.md, color: BRAND.ink, lineHeight: 1.6, marginBottom: 24, fontWeight: 600 }}>
                        {data.contentBefore}
                    </p>
                )}

                {!data.contentBefore && data.content && (
                    <p style={{ fontFamily: FONTS.main, fontSize: F_SIZE.md, color: BRAND.taupe, lineHeight: 1.8, marginBottom: 24, fontWeight: 600 }}>{data.content}</p>
                )}

                {data.list && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 28 }}>
                        {data.list.map((it: any, i: number) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -10 }}
                                animate={inView ? { opacity: 1, x: 0 } : {}}
                                transition={{ delay: 0.2 + (i * 0.05) }}
                                style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}
                            >
                                <div style={{ marginTop: 6 }}>
                                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: BRAND.taupe }} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <span style={{ fontFamily: FONTS.main, fontSize: F_SIZE.md, color: BRAND.secondary, fontWeight: 800 }}>{it.title}: </span>
                                    <span style={{ fontFamily: FONTS.main, fontSize: F_SIZE.md, color: BRAND.ink, fontWeight: 500, lineHeight: 1.5 }}>{it.desc}</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}

                {data.contentAfter && typeof data.contentAfter === 'string' && (
                    <p style={{ fontFamily: FONTS.main, fontSize: F_SIZE.md, color: BRAND.ink, lineHeight: 1.6, marginTop: 'auto', marginBottom: 24, fontWeight: 600 }}>
                        {data.contentAfter.includes("consistent and balanced nutrition.") ? (
                            <>
                                {data.contentAfter.split("consistent and balanced nutrition.")[0]}
                                <span style={{ color: BRAND.burgundy, fontWeight: 800 }}>consistent and balanced nutrition.</span>
                                {data.contentAfter.split("consistent and balanced nutrition.")[1]}
                            </>
                        ) : data.contentAfter}
                    </p>
                )}

                {data.contentAfterPoints && (
                    <div style={{ marginTop: 'auto', marginBottom: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {data.contentAfterPoints.map((line: string, i: number) => (
                            <motion.p
                                key={i}
                                initial={{ opacity: 0 }}
                                animate={inView ? { opacity: 1 } : {}}
                                transition={{ delay: 0.6 + (i * 0.2) }}
                                style={{ fontFamily: FONTS.main, fontSize: F_SIZE.md, color: BRAND.burgundy, fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}
                            >
                                <div style={{ width: 12, height: 1, background: BRAND.burgundy }} />
                                {line}
                            </motion.p>
                        ))}
                    </div>
                )}

                <div style={{ marginTop: (data.contentAfter || data.contentAfterPoints) ? 0 : 'auto', paddingTop: 24, borderTop: `1px solid ${BRAND.espresso}08` }}>
                    <p style={{ fontFamily: FONTS.accent, fontSize: F_SIZE.lg, color: BRAND.burgundy, margin: 0, fontWeight: 700 }}>{data.note}</p>
                </div>
            </div>
        </motion.div>
    );
}

export default function FiveInOneSection() {
    return (
        <section style={{ padding: '40px 0', background: BRAND.cream, position: 'relative', overflow: 'hidden' }}>
            <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 1 }}>

                <SectionHeader eyebrow="The Logic" title="PlainFuel — A Simple Approach." />

                <div className="clinical-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 40 }}>
                    {PAGES.map((p, i) => (
                        <ClinicalCard key={i} data={p} index={i} />
                    ))}
                </div>

                <div style={{ marginTop: 64, display: 'flex', flexWrap: 'wrap', gap: 48, justifyContent: 'center' }}>
                    {[
                        { icon: <Microscope size={20} />, text: "Lab Verified Constituents" },
                        { icon: <Activity size={20} />, text: "Optimized Bio-Availability" },
                        { icon: <Dna size={20} />, text: "Zero Amino Spiking" }
                    ].map((t, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, color: BRAND.espresso, fontFamily: FONTS.main, fontSize: F_SIZE.sm, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.15em' }}>
                            <div style={{ color: BRAND.burgundy }}>{t.icon}</div>
                            {t.text}
                        </div>
                    ))}
                </div>

                {/* ── CLOSING PERSPECTIVE ── */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="closing-perspective-card"
                    style={{
                        marginTop: 40,
                        borderRadius: 56,
                        background: BRAND.espresso,
                        display: 'grid',
                        gridTemplateColumns: '1.2fr 1fr',
                        overflow: 'hidden',
                        boxShadow: '0 50px 100px rgba(0,0,0,0.2)',
                    }}
                >
                    <div style={{ padding: '80px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
                            <div style={{ width: 12, height: 12, borderRadius: '50%', background: BRAND.burgundy, boxShadow: `0 0 20px ${BRAND.burgundy}` }} />
                            <span style={{ fontFamily: FONTS.main, fontSize: F_SIZE.sm, fontWeight: 900, color: BRAND.stone, textTransform: 'uppercase', letterSpacing: '0.25em' }}>Closing Perspective</span>
                        </div>

                        <h4 style={{
                            fontFamily: FONTS.main,
                            fontSize: 'clamp(2rem, 5vw, 3rem)',
                            fontWeight: 900,
                            color: BRAND.white,
                            marginBottom: 32,
                            lineHeight: 1.05,
                            letterSpacing: '-0.04em'
                        }}>A Daily Ritual of<br /><span style={{ color: BRAND.stone }}>Collective Prevention.</span></h4>

                        <div style={{ borderLeft: `3px solid ${BRAND.stone}20`, paddingLeft: 32, marginBottom: 40 }}>
                            <p style={{ fontFamily: FONTS.main, fontSize: F_SIZE.md, color: brandyrgba(255, 255, 255, 0.7), lineHeight: 1.9, margin: 0 }}>
                                Most health problems related to nutrition don’t happen suddenly. They build over time. Prevention is easier than correction. Instead of fixing deficiencies after they appear, it is better to consistently meet your daily nutritional needs.
                            </p>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
                            <div style={{ width: 48, height: 1, background: BRAND.stone, opacity: 0.2 }} />
                            <span style={{ fontFamily: FONTS.accent, fontSize: '1.8rem', color: BRAND.stone, fontWeight: 700 }}>The New Standard for Tomorrow.</span>
                        </div>
                    </div>

                    <div style={{ position: 'relative', minHeight: 500 }}>
                        <Image src="/images/lifestyle_final.png" alt="Lifestyle" fill style={{ objectFit: 'cover' }} priority />
                        <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to right, ${BRAND.espresso} 0%, transparent 40%)` }} />
                        <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to bottom, transparent 60%, ${BRAND.espresso} 100%)` }} />
                    </div>
                </motion.div>
            </div>

            <style>{`
                @media (max-width: 1100px) {
                    .closing-perspective-card { grid-template-columns: 1fr !important; }
                    .card-inner-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
                }
                @media (max-width: 900px) {
                    .clinical-grid { grid-template-columns: 1fr !important; }
                }
                @media (max-width: 768px) {
                    .list-grid { grid-template-columns: 1fr !important; }
                    .full-card { padding: 32px 24px !important; border-radius: 32px !important; }
                    .closing-perspective-card { 
                        border-radius: 0 !important; 
                        margin: 40px -24px 0 !important; 
                        width: calc(100% + 48px) !important;
                    }
                    .closing-perspective-card > div:first-child { padding: 48px 24px !important; }
                    .closing-perspective-card h4 { font-size: 2rem !important; }
                }
            `}</style>
        </section>
    );
}

// Fixed typo in template
const brandyrgba = (r: any, g: any, b: any, a: any) => `rgba(${r},${g},${b},${a})`;
