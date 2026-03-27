'use client';

import { motion, useAnimationFrame, useMotionValue, useSpring, useInView } from 'framer-motion';
import { useState, useCallback, useRef } from 'react';
import { 
    Target, Leaf, Sparkles, UserCheck, 
    Dna, ShieldCheck, Check, FlaskConical
} from 'lucide-react';
import { F_SIZE } from '@/lib/typography';

/* ── Design Tokens (Standardized Glacier Elite) ── */
const C = {
    forest: '#0a3d1f',
    deep: '#071a0d',
    mid: '#14532d',
    leaf: '#16a34a',
    ink: '#070d08',
    white: '#ffffff',
    offwhite: '#fafafa',
    silver: '#64748b',
    mist: '#f1f5f9',
    gold: '#854d0e',
    goldLight: '#a16207',
    glass: 'rgba(255, 255, 255, 0.75)',
    border: 'rgba(0, 0, 0, 0.05)',
};

const FONTS = {
    main: "'Montserrat', sans-serif",
    accent: "'Caveat', cursive",
};

/* ── DATA ── */
const allCards = [
    {
        icon: <Target className="w-5 h-5" />,
        stat: '21', statSuffix: ' ingredients',
        statLabel: 'calibrated for Indian diet',
        title: 'Precision Dosage',
        content: 'Our formula targets specific dietary gaps in typical Indian meals — not generic Western bodies.',
        note: 'no guesswork!',
        accent: C.forest,
    },
    {
        icon: <Leaf className="w-5 h-5" />,
        stat: '100%', statSuffix: '',
        statLabel: 'active ingredients',
        title: 'Zero Filler Ethics',
        content: 'Most supplements are 80% maltodextrin. We use 100% active ingredients. Every milligram is functional.',
        note: 'zero junk!',
        accent: C.gold,
    },
    {
        icon: <Sparkles className="w-5 h-5" />,
        stat: '0 mg', statSuffix: '',
        statLabel: 'taste or texture added',
        title: 'Invisible Utility',
        content: 'Tasteless and textureless. Mix into anything without changing the flavour of your favourite foods.',
        note: 'mix anywhere!',
        accent: '#7c3aed',
    },
    {
        icon: <UserCheck className="w-5 h-5" />,
        stat: '≥65%', statSuffix: '',
        statLabel: 'RDA covered per serving',
        title: 'Bio-Identical Forms',
        content: 'Methylcobalamin B12, Calcium Citrate, Zinc Gluconate — forms your body recognises and absorbs fast.',
        note: 'absorbed fast!',
        accent: '#db2777',
    },
    {
        icon: <Dna className="w-5 h-5" />,
        stat: '0%', statSuffix: '',
        statLabel: 'amino acids',
        title: 'Clean Label DNA',
        content: 'No amino spiking — nothing to inflate our protein numbers or skew your natural macros.',
        note: 'pure science!',
        accent: '#0ea5e9',
    },
];

const ingredients = [
    { name: 'Vitamin B12 (Methylcobalamin)', qty: '1.7 mcg', rda: '77% RDA', highlight: true  },
    { name: 'Vitamin C (Ascorbic Acid)',      qty: '50 mg',   rda: '62% RDA', highlight: true  },
    { name: 'Calcium (Citrate form)',         qty: '300 mg',  rda: '30% RDA', highlight: true  },
    { name: 'Zinc (Gluconate form)',          qty: '6.8 mg',  rda: '40% RDA', highlight: true  },
    { name: 'Magnesium (Citrate)',            qty: '132 mg',  rda: '30% RDA', highlight: false },
    { name: 'Digestive Enzymes blend',        qty: '100 mg',  rda: '—',       highlight: false },
];

const supplements = [
    { label: 'Whey Protein', cost: '₹4,000', pct: 100, accent: '#db2777' },
    { label: 'Omega-3',      cost: '₹1,500', pct: 37,  accent: '#d97706' },
    { label: 'Magnesium',    cost: '₹1,000', pct: 25,  accent: '#7c3aed' },
    { label: 'Creatine',     cost: '₹800',   pct: 20,  accent: '#15803d' },
];

const rdaBars = [
    { label: 'B12',    pct: 77, color: C.forest },
    { label: 'B6',     pct: 70, color: C.gold },
    { label: 'Folic',  pct: 73, color: '#7c3aed' },
    { label: 'D3',     pct: 66, color: '#db2777' },
    { label: 'Vit C',  pct: 62, color: C.forest },
    { label: 'B1',     pct: 61, color: C.gold },
];

/* ── SUB-COMPONENTS ── */

function Chip({ text, icon: Icon }: { text: string; icon?: any }) {
    return (
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '6px 16px', borderRadius: 100, background: C.white, border: `1px solid ${C.forest}15`, backdropFilter: 'blur(10px)', marginBottom: 20 }}>
            {Icon && <Icon size={12} color={C.gold} />}
            <span style={{ fontSize: F_SIZE.sm, fontWeight: 900, color: C.forest, letterSpacing: '0.15em', textTransform: 'uppercase', fontFamily: FONTS.main }}>{text}</span>
        </div>
    );
}

function IngredientRow({ name, qty, rda, highlight, index }: {
    name: string; qty: string; rda: string; highlight: boolean; index: number;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, x: -14 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.06 }}
            style={{
                display: 'flex', alignItems: 'center', justifyItems: 'space-between', gap: 12, padding: '12px 16px', borderRadius: 14,
                border: highlight ? `1px solid ${C.leaf}25` : `1px solid ${C.border}`,
                background: highlight ? `${C.leaf}05` : C.white,
                marginBottom: 8, transition: 'all 0.3s'
            }}
        >
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 10 }}>
                {highlight ? <Check size={14} color={C.leaf} /> : <div style={{ width: 6, height: 6, borderRadius: '50%', background: C.silver, opacity: 0.3 }} />}
                <span style={{ fontFamily: FONTS.main, fontSize: F_SIZE.sm, fontWeight: 600, color: C.ink }}>{name}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontFamily: FONTS.main, fontSize: F_SIZE.sm, color: C.silver }}>{qty}</span>
                <span style={{ fontFamily: FONTS.main, fontSize: F_SIZE.sm, fontWeight: 900, color: highlight ? C.leaf : C.silver, background: highlight ? `${C.leaf}11` : C.mist, padding: '4px 10px', borderRadius: 100 }}>{rda}</span>
            </div>
        </motion.div>
    );
}

function TrainCard({ item, isHovered, onHover, onLeave }: {
    item: any;
    isHovered: boolean;
    onHover: () => void;
    onLeave: () => void;
}) {
    return (
        <motion.div
            onMouseEnter={onHover}
            onMouseLeave={onLeave}
            style={{
                width: 280, flexShrink: 0, padding: '16px', borderRadius: 28,
                background: C.white, border: `1px solid ${C.border}`,
                boxShadow: isHovered ? '0 32px 64px rgba(0,0,0,0.08)' : '0 10px 30px rgba(0,0,0,0.03)',
                transition: 'all 0.5s cubic-bezier(0.165, 0.84, 0.44, 1)'
            }}
            animate={{ y: isHovered ? -10 : 0, scale: isHovered ? 1.02 : 1 }}
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: `${item.accent}11`, color: item.accent, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {item.icon}
                </div>
                <div>
                   <div style={{ fontFamily: FONTS.main, fontSize: F_SIZE.sm, fontWeight: 800, color: C.silver, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{item.statLabel}</div>
                   <div style={{ fontFamily: FONTS.main, fontSize: F_SIZE.lg, fontWeight: 900, color: item.accent }}>{item.stat}<span style={{ fontSize: F_SIZE.sm, opacity: 0.6 }}>{item.statSuffix}</span></div>
                </div>
            </div>
            <h4 style={{ fontFamily: FONTS.main, fontSize: F_SIZE.md, fontWeight: 800, color: C.ink, marginBottom: 8 }}>{item.title}</h4>
            <p style={{ fontFamily: FONTS.main, fontSize: F_SIZE.sm, color: C.silver, lineHeight: 1.6, margin: 0 }}>{item.content}</p>
        </motion.div>
    );
}

function TrainRow({ cards, direction, speed, paused }: { cards: any[]; direction: 'left' | 'right'; speed: number; paused: boolean }) {
    const x = useMotionValue(0);
    const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
    const CARD_W = 280 + 24;
    const LOOP_W = (cards.length / 2) * CARD_W;

    useAnimationFrame((_, delta) => {
        if (paused && hoveredIdx !== null) return;
        const velocity = direction === 'left' ? -speed : speed;
        let next = x.get() + (velocity * delta) / 1000;
        if (direction === 'left' && next <= -LOOP_W) next += LOOP_W;
        if (direction === 'right' && next >= 0) next -= LOOP_W;
        x.set(next);
    });

    return (
        <div style={{ overflow: 'visible', padding: '20px 0' }}>
            <motion.div style={{ x, display: 'flex', gap: 24 }}>
                {cards.map((item, i) => (
                    <TrainCard key={i} item={item} isHovered={hoveredIdx === i} onHover={() => setHoveredIdx(i)} onLeave={() => setHoveredIdx(null)} />
                ))}
            </motion.div>
        </div>
    );
}

/* ── MAIN ── */
export default function HAWDsection() {
    const sectionRef = useRef(null);
    const inView = useInView(sectionRef, { once: true, margin: '-100px' });
    const ROW_CARDS = [...allCards, ...allCards];

    return (
        <section ref={sectionRef} style={{ background: C.white, padding: '32px 0', overflow: 'hidden', position: 'relative' }}>
            
            {/* Ambient Background Elements */}
            <div style={{ position: 'absolute', top: -100, left: -100, width: 600, height: 600, background: `radial-gradient(circle, ${C.forest}05 0%, transparent 70%)`, pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', bottom: -100, right: -100, width: 600, height: 600, background: `radial-gradient(circle, ${C.gold}05 0%, transparent 70%)`, pointerEvents: 'none' }} />

            <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 40px', position: 'relative', zIndex: 1 }}>
                
                {/* ── TOP SECTION ── */}
                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 480px', gap: 40, alignItems: 'flex-start', marginBottom: 48 }}>
                    <div>
                        <Chip text="The Simple Process" icon={ShieldCheck} />
                        <h2 style={{ fontFamily: FONTS.main, fontSize: F_SIZE.xl, fontWeight: 900, color: C.ink, lineHeight: 1.1, letterSpacing: '-0.04em', margin: '12px 0' }}>
                            What do we do <br /> <span style={{ color: C.leaf }}>today?</span>
                        </h2>
                        <p style={{ fontFamily: FONTS.main, fontSize: F_SIZE.md, color: C.silver, lineHeight: 1.7, maxWidth: 520, marginBottom: 24 }}>
                            To fill nutritional gaps, most people turn to multiple supplements. But this creates a new problem: it's hard to track and maintain in a busy life.
                        </p>

                        <div style={{ padding: '24px', background: C.offwhite, borderRadius: 32, border: `1px solid ${C.forest}08`, boxShadow: '0 4px 30px rgba(0,0,0,0.02)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                                <FlaskConical size={18} color={C.forest} />
                                <h4 style={{ fontFamily: FONTS.main, fontSize: F_SIZE.sm, fontWeight: 800, color: C.ink, textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>Laboratory Ingredients</h4>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                {ingredients.map((ing, i) => <IngredientRow key={i} {...ing} index={i} />)}
                            </div>
                        </div>
                    </div>

                    <div style={{ padding: '24px', background: `${C.mist}50`, borderRadius: 40, border: `1px solid ${C.forest}05`, position: 'relative' }}>
                        <div style={{ display: 'flex', justifyItems: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                             <Chip text="Market Analysis" />
                        </div>
                        
                        <h3 style={{ fontFamily: FONTS.main, fontSize: F_SIZE.lg, fontWeight: 900, color: C.ink, marginBottom: 12 }}>The Complexity Barrier.</h3>
                        <p style={{ fontFamily: FONTS.main, fontSize: F_SIZE.sm, color: C.silver, marginBottom: 20 }}>The issue is not effort; the issue is that the system for meeting daily needs is too complex.</p>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 24 }}>
                            {supplements.map((s, i) => (
                                <div key={i}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                                        <span style={{ fontFamily: FONTS.main, fontSize: F_SIZE.sm, fontWeight: 800, color: C.ink }}>{s.label}</span>
                                        <span style={{ fontFamily: FONTS.main, fontSize: F_SIZE.sm, fontWeight: 900, color: s.accent }}>{s.cost}</span>
                                    </div>
                                    <div style={{ height: 6, background: C.white, borderRadius: 10 }}>
                                        <motion.div initial={{ width: 0 }} whileInView={{ width: `${s.pct}%` }} transition={{ duration: 1, delay: i * 0.1 }} style={{ height: '100%', background: s.accent, borderRadius: 10 }} />
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div style={{ padding: '20px', background: C.forest, borderRadius: 24, textAlign: 'center', boxShadow: '0 20px 48px rgba(10,61,31,0.2)' }}>
                            <div style={{ fontFamily: FONTS.main, fontSize: F_SIZE.sm, fontWeight: 900, color: `${C.white}70`, textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 8 }}>Total Investment</div>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
                                <span style={{ fontSize: F_SIZE.xl, fontWeight: 900, color: C.white }}>₹7,300</span>
                                <div style={{ height: 24, width: 1, background: `${C.white}30` }} />
                                <span style={{ fontSize: F_SIZE.sm, fontWeight: 800, color: C.leaf }}>All-In-One</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── CAROUSEL SECTION ── */}
                <div style={{ borderTop: `1px solid ${C.forest}08`, paddingTop: 32 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                        <div>
                             <h3 style={{ fontFamily: FONTS.main, fontSize: F_SIZE.lg, fontWeight: 900, color: C.ink, margin: 0 }}>PlainFuel simplifies the process.</h3>
                             <p style={{ fontFamily: FONTS.accent, fontSize: F_SIZE.md, color: C.gold, margin: '8px 0 0' }}>One simple habit. Done daily. Making nutrition easier.</p>
                        </div>
                        <div style={{ display: 'flex', gap: 12 }}>
                             {[1, 2, 3].map(i => <div key={i} style={{ width: 4, height: 4, borderRadius: '50%', background: C.silver, opacity: 0.3 + (i * 0.2) }} />)}
                        </div>
                    </div>
                    
                    <TrainRow direction="left" cards={ROW_CARDS} speed={50} paused={false} />
                </div>

                {/* ── RDA BARS ── */}
                <div style={{ marginTop: 48, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 16 }}>
                    {rdaBars.map((b, i) => (
                        <motion.div 
                            key={i} 
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.1 }}
                            style={{ textAlign: 'center', padding: '20px 16px', background: C.offwhite, borderRadius: 24, border: `1px solid ${C.forest}02` }}
                        >
                            <div style={{ fontFamily: FONTS.main, fontSize: F_SIZE.lg, fontWeight: 900, color: b.color, marginBottom: 12 }}>{b.pct}%</div>
                            <div style={{ height: 120, width: 12, background: C.white, borderRadius: 10, margin: '0 auto 12px', position: 'relative', overflow: 'hidden' }}>
                                <motion.div initial={{ height: 0 }} whileInView={{ height: `${b.pct}%` }} transition={{ duration: 1, delay: i * 0.1 }} style={{ width: '100%', background: `${b.color}cc`, position: 'absolute', bottom: 0 }} />
                            </div>
                            <div style={{ fontFamily: FONTS.main, fontSize: F_SIZE.sm, fontWeight: 800, color: C.ink }}>{b.label}</div>
                        </motion.div>
                    ))}
                </div>

            </div>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&family=Caveat:wght@600;700&display=swap');
            `}</style>
        </section>
    );
}