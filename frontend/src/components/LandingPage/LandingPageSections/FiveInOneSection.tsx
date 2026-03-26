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
        icon: <Fingerprint size={22} />,
        headline: "What is PlainFuel?",
        content: "PlainFuel is a daily nutrition supplement designed to simplify how we meet our body’s needs. Instead of taking multiple supplements or tracking different nutrients, PlainFuel brings everything together in one scoop. It combines protein, essential micronutrients, and fiber in a structured way so that your body gets consistent support every day. This is not just another protein powder. It is designed to act as a daily nutrition system — something you can rely on without overthinking.",
        note: "Simplifying the Complex.",
        isFull: false
    },
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
        icon: <Zap size={22} />,
        headline: "What does PlainFuel do?",
        content: "PlainFuel simplifies this entire process. Instead of managing multiple supplements, you take one scoop daily. It can replace your regular protein scoop, while also providing essential vitamins, minerals, fiber, and digestive support. No extra planning. No extra tracking. Just a simple daily habit.",
        note: "One Scoop Daily.",
        isFull: false
    },
    {
        icon: <Sparkles size={22} />,
        headline: "How does PlainFuel fit into daily life?",
        content: "PlainFuel is designed to be easy to use. Take one scoop daily. Replace your regular protein. No need for multiple supplements. Works with any diet. The focus is not perfection. The focus is consistency.",
        list: [
            { title: "Simple Habit", desc: "One scoop daily" },
            { title: "Flexible", desc: "Works with any diet" }
        ],
        note: "Habit. Consistency.",
        isFull: true
    }
];

/* ── COMPONENTS ── */

function SectionHeader({ eyebrow, title }: { eyebrow: string; title: string }) {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true });
    return (
        <div ref={ref} style={{ marginBottom: 80 }}>
            <motion.div initial={{ opacity: 0, x: -20 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.6 }} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
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

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: index * 0.1, ease: [0.165, 0.84, 0.44, 1] }}
            whileHover={{ y: -8, boxShadow: '0 40px 80px rgba(0,0,0,0.06)' }}
            className={`clinical-card ${data.isFull ? 'full-width' : ''}`}
            style={{
                background: C.glass,
                backdropFilter: 'blur(32px)',
                WebkitBackdropFilter: 'blur(32px)',
                borderRadius: 28,
                padding: '48px',
                border: `1px solid ${C.white}60`,
                boxShadow: '0 10px 40px rgba(0,0,0,0.02)',
                display: 'flex',
                flexDirection: 'column',
                gap: 28,
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1)',
                minHeight: data.isFull ? 'auto' : 480
            }}
        >
            <Image 
                src={`/images/FiveInOne/${index + 1}.png`} 
                alt={data.headline} 
                fill 
                style={{ objectFit: 'cover', opacity: 0.05, pointerEvents: 'none' }} 
            />
            
            <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', gap: 28, height: '100%' }}>
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

                {data.list && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 8 }}>
                        {data.list.map((it: any, i: number) => (
                            <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                                <div style={{ color: C.leaf, marginTop: 4 }}>
                                    <CheckCircle2 size={16} />
                                </div>
                                <div style={{ fontFamily: FONTS.main, fontSize: 15, color: C.silver, lineHeight: 1.4 }}>
                                    <strong style={{ color: C.ink }}>{it.title}:</strong> {it.desc}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <div style={{ marginTop: 'auto', paddingTop: 24, borderTop: `1px solid ${C.border}` }}>
                    <p style={{ fontFamily: FONTS.accent, fontSize: 20, color: C.gold, margin: 0, fontWeight: 700 }}>{data.note}</p>
                </div>
            </div>
            
            <div style={{ position: 'absolute', bottom: -20, right: -20, width: 100, height: 100, background: `radial-gradient(circle, ${C.forest}03 0%, transparent 70%)` }} />
        </motion.div>
    );
}

export default function FiveInOneSection() {
    return (
        <section style={{ padding: '160px 0', background: C.white, position: 'relative', overflow: 'hidden' }}>
            <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 40px', position: 'relative', zIndex: 1 }}>
                <SectionHeader eyebrow="The Logic" title="PlainFuel — A Simple Approach." />
                <div className="clinical-grid">
                    {PAGES.map((p, i) => (
                        <ClinicalCard key={i} data={p} index={i} />
                    ))}
                </div>
                <div style={{ marginTop: 80, display: 'flex', flexWrap: 'wrap', gap: 40, justifyContent: 'center' }}>
                     {[
                        { icon: <Microscope size={18} />, text: "Lab Verified Constituents" },
                        { icon: <Activity size={18} />, text: "Optimized Bio-Availability" },
                        { icon: <Dna size={18} />, text: "Zero Amino Spiking" }
                     ].map((t, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, color: C.silver, fontFamily: FONTS.main, fontSize: 12, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                            <span style={{ color: C.leaf }}>{t.icon}</span>
                            {t.text}
                        </div>
                     ))}
                </div>
            </div>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&family=Caveat:wght@600;700&display=swap');
                .clinical-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; }
                .clinical-card.full-width { grid-column: 1 / -1; }
                @media (max-width: 1024px) { .clinical-grid { grid-template-columns: 1fr; } .clinical-card.full-width { grid-column: auto; } }
            `}</style>
        </section>
    );
}