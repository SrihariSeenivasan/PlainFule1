'use client';

import { motion, useAnimationFrame, useMotionValue, useSpring, useInView } from 'framer-motion';
import { useState, useCallback, useRef } from 'react';
import {
    Target, Leaf, Sparkles, UserCheck,
    Dna, ShieldCheck, Check, FlaskConical
} from 'lucide-react';
import { F_SIZE, FONTS, BRAND } from '@/lib/typography';



/* ── DATA ── */
const allCards = [
    {
        icon: <Target className="w-5 h-5" />,
        stat: '21', statSuffix: ' ingredients',
        statLabel: 'calibrated for Indian diet',
        title: 'Precision Dosage',
        content: 'Our formula targets specific dietary gaps in typical Indian meals — not generic Western bodies.',
        note: 'no guesswork!',
        accent: BRAND.espresso,
    },
    {
        icon: <Leaf className="w-5 h-5" />,
        stat: '100%', statSuffix: '',
        statLabel: 'active ingredients',
        title: 'Zero Filler Ethics',
        content: 'Most supplements are 80% maltodextrin. We use 100% active ingredients. Every milligram is functional.',
        note: 'zero junk!',
        accent: BRAND.burgundy,
    },
    {
        icon: <Sparkles className="w-5 h-5" />,
        stat: '0 mg', statSuffix: '',
        statLabel: 'taste or texture added',
        title: 'Invisible Utility',
        content: 'Tasteless and textureless. Mix into anything without changing the flavour of your favourite foods.',
        note: 'mix anywhere!',
        accent: BRAND.taupe,
    },
    {
        icon: <UserCheck className="w-5 h-5" />,
        stat: '≥65%', statSuffix: '',
        statLabel: 'RDA covered per serving',
        title: 'Bio-Identical Forms',
        content: 'Methylcobalamin B12, Calcium Citrate, Zinc Gluconate — forms your body recognises and absorbs fast.',
        note: 'absorbed fast!',
        accent: BRAND.burgundy,
    },
    {
        icon: <Dna className="w-5 h-5" />,
        stat: '0%', statSuffix: '',
        statLabel: 'amino acids',
        title: 'Clean Label DNA',
        content: 'No amino spiking — nothing to inflate our protein numbers or skew your natural macros.',
        note: 'pure science!',
        accent: BRAND.espresso,
    },
];

const ingredients = [
    { name: 'Vitamin B12 (Methylcobalamin)', qty: '1.7 mcg', rda: '77% RDA', highlight: true },
    { name: 'Vitamin C (Ascorbic Acid)', qty: '50 mg', rda: '62% RDA', highlight: true },
    { name: 'Calcium (Citrate form)', qty: '300 mg', rda: '30% RDA', highlight: true },
    { name: 'Zinc (Gluconate form)', qty: '6.8 mg', rda: '40% RDA', highlight: true },
    { name: 'Magnesium (Citrate)', qty: '132 mg', rda: '30% RDA', highlight: false },
    { name: 'Digestive Enzymes blend', qty: '100 mg', rda: '—', highlight: false },
];

const supplements = [
    { label: 'Whey Protein', cost: '₹4,000', pct: 100, accent: BRAND.burgundy },
    { label: 'Omega-3', cost: '₹1,500', pct: 37, accent: BRAND.taupe },
    { label: 'Magnesium', cost: '₹1,000', pct: 25, accent: BRAND.espresso },
    { label: 'Creatine', cost: '₹800', pct: 20, accent: BRAND.burgundy },
];

const rdaBars = [
    { label: 'B12', pct: 77, color: BRAND.espresso },
    { label: 'B6', pct: 70, color: BRAND.burgundy },
    { label: 'Folic', pct: 73, color: BRAND.taupe },
    { label: 'D3', pct: 66, color: BRAND.burgundy },
    { label: 'Vit C', pct: 62, color: BRAND.espresso },
    { label: 'B1', pct: 61, color: BRAND.burgundy },
];

/* ── SUB-COMPONENTS ── */

function Chip({ text, icon: Icon }: { text: string; icon?: any }) {
    return (
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '6px 16px', borderRadius: 100, background: BRAND.white, border: `1px solid ${BRAND.espresso}15`, backdropFilter: 'blur(10px)', marginBottom: 20 }}>
            {Icon && <Icon size={12} color={BRAND.burgundy} />}
            <span style={{ fontSize: F_SIZE.sm, fontWeight: 900, color: BRAND.espresso, letterSpacing: '0.15em', textTransform: 'uppercase', fontFamily: FONTS.main }}>{text}</span>
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
                border: highlight ? `1px solid ${BRAND.burgundy}25` : `1px solid ${BRAND.border}`,
                background: highlight ? `${BRAND.burgundy}05` : BRAND.white,
                marginBottom: 8, transition: 'all 0.3s'
            }}
        >
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 10 }}>
                {highlight ? <Check size={14} color={BRAND.burgundy} /> : <div style={{ width: 6, height: 6, borderRadius: '50%', background: BRAND.textMuted, opacity: 0.3 }} />}
                <span style={{ fontFamily: FONTS.main, fontSize: F_SIZE.sm, fontWeight: 600, color: BRAND.text }}>{name}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontFamily: FONTS.main, fontSize: F_SIZE.sm, color: BRAND.textMuted }}>{qty}</span>
                <span style={{ fontFamily: FONTS.main, fontSize: F_SIZE.sm, fontWeight: 900, color: highlight ? BRAND.burgundy : BRAND.textMuted, background: highlight ? `${BRAND.burgundy}11` : BRAND.stone, padding: '4px 10px', borderRadius: 100 }}>{rda}</span>
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
                background: BRAND.white, border: `1px solid ${BRAND.border}`,
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
                    <div style={{ fontFamily: FONTS.main, fontSize: F_SIZE.sm, fontWeight: 800, color: BRAND.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{item.statLabel}</div>
                    <div style={{ fontFamily: FONTS.main, fontSize: F_SIZE.lg, fontWeight: 900, color: item.accent }}>{item.stat}<span style={{ fontSize: F_SIZE.sm, opacity: 0.6 }}>{item.statSuffix}</span></div>
                </div>
            </div>
            <h4 style={{ fontFamily: FONTS.main, fontSize: F_SIZE.md, fontWeight: 800, color: BRAND.text, marginBottom: 8 }}>{item.title}</h4>
            <p style={{ fontFamily: FONTS.main, fontSize: F_SIZE.sm, color: BRAND.textMuted, lineHeight: 1.6, margin: 0 }}>{item.content}</p>
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
        <section ref={sectionRef} style={{ background: BRAND.white, padding: '32px 0', overflow: 'hidden', position: 'relative' }}>

            {/* Ambient Background Elements */}
            <div style={{ position: 'absolute', top: -100, left: -100, width: 600, height: 600, background: `radial-gradient(circle, ${BRAND.espresso}05 0%, transparent 70%)`, pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', bottom: -100, right: -100, width: 600, height: 600, background: `radial-gradient(circle, ${BRAND.burgundy}05 0%, transparent 70%)`, pointerEvents: 'none' }} />

            <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 40px', position: 'relative', zIndex: 1 }}>

                {/* ── TOP SECTION: HEADER ── */}
                <div style={{ marginBottom: 32, textAlign: 'center' }}>
                    <Chip text="The Simple Process" icon={ShieldCheck} />
                    <h2 style={{ fontFamily: FONTS.main, fontSize: F_SIZE.xl, fontWeight: 900, color: BRAND.text, lineHeight: 1.1, letterSpacing: '-0.04em', margin: '16px auto 12px', maxWidth: 800 }}>
                        What do we do <span style={{ color: BRAND.burgundy }}>today?</span>
                    </h2>
                    <p style={{ fontFamily: FONTS.main, fontSize: F_SIZE.md, color: BRAND.burgundy, lineHeight: 1.7, maxWidth: 720, margin: '0 auto' }}>
                        To fill nutritional gaps, most people turn to multiple supplements. But this creates a new problem: it's hard to track and maintain in a busy life.
                    </p>
                </div>

                {/* ── CARDS GRID ── */}
                <div className="complexity-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 32, alignItems: 'stretch', marginBottom: 32 }}>

                    {/* Column 1: Complexity Barrier */}
                    <div style={{ padding: '24px', background: `${BRAND.cream}80`, borderRadius: 40, border: `1px solid ${BRAND.espresso}05`, position: 'relative', display: 'flex', flexDirection: 'column' }}>
                        <div style={{ display: 'flex', justifyItems: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                            <Chip text="Market Analysis" />
                        </div>

                        <h3 style={{ fontFamily: FONTS.main, fontSize: F_SIZE.lg, fontWeight: 900, color: BRAND.text, marginBottom: 16 }}>The Complexity Barrier.</h3>
                        <p style={{ fontFamily: FONTS.main, fontSize: F_SIZE.sm, color: BRAND.burgundy, marginBottom: 24 }}>The issue is not effort; the issue is that the system for meeting daily needs is too complex.</p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginBottom: 32, flex: 1 }}>
                            {supplements.map((s, i) => (
                                <div key={i}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                                        <span style={{ fontFamily: FONTS.main, fontSize: F_SIZE.sm, fontWeight: 800, color: BRAND.text }}>{s.label}</span>
                                        <span style={{ fontFamily: FONTS.main, fontSize: F_SIZE.sm, fontWeight: 900, color: s.accent }}>{s.cost}</span>
                                    </div>
                                    <div style={{ height: 8, background: BRAND.white, borderRadius: 10 }}>
                                        <motion.div initial={{ width: 0 }} whileInView={{ width: `${s.pct}%` }} transition={{ duration: 1, delay: i * 0.1 }} style={{ height: '100%', background: s.accent, borderRadius: 10 }} />
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div style={{ padding: '24px', background: BRAND.espresso, borderRadius: 28, textAlign: 'center', boxShadow: '0 20px 48px rgba(0,0,0,0.1)' }}>
                            <div style={{ fontFamily: FONTS.main, fontSize: F_SIZE.sm, fontWeight: 900, color: `${BRAND.white}70`, textTransform: 'uppercase', letterSpacing: '0.2rem', marginBottom: 10 }}>Total Investment</div>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
                                <span style={{ fontSize: F_SIZE.xl, fontWeight: 900, color: BRAND.white }}>₹7,300</span>
                                <div style={{ height: 24, width: 1, background: `${BRAND.white}30` }} />
                                <span style={{ fontSize: F_SIZE.sm, fontWeight: 800, color: BRAND.burgundy }}>All-In-One</span>
                            </div>
                        </div>
                    </div>

                    {/* Column 2: Laboratory Ingredients */}
                    <div style={{ padding: '24px', background: BRAND.cream, borderRadius: 40, border: `1px solid ${BRAND.espresso}08`, boxShadow: '0 4px 30px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                            <FlaskConical size={20} color={BRAND.espresso} />
                            <h4 style={{ fontFamily: FONTS.main, fontSize: F_SIZE.sm, fontWeight: 900, color: BRAND.text, textTransform: 'uppercase', letterSpacing: '0.12em', margin: 0 }}>Laboratory Ingredients</h4>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, flex: 1, justifyContent: 'center' }}>
                            {ingredients.map((ing, i) => <IngredientRow key={i} {...ing} index={i} />)}
                        </div>
                    </div>
                </div>

                {/* ── CAROUSEL SECTION ── */}
                <div style={{ borderTop: `1px solid ${BRAND.espresso}08`, paddingTop: 32 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                        <div>
                            <h3 style={{ fontFamily: FONTS.main, fontSize: F_SIZE.xl, fontWeight: 900, color: BRAND.text, margin: 0 }}>PlainFuel simplifies the process.</h3>
                            <p style={{ fontFamily: FONTS.accent, fontSize: F_SIZE.lg, color: BRAND.burgundy, margin: '8px 0 0' }}>One simple habit. Done daily. Making nutrition easier.</p>
                        </div>
                        <div style={{ display: 'flex', gap: 12 }}>
                            {[1, 2, 3].map(i => <div key={i} style={{ width: 4, height: 4, borderRadius: '50%', background: BRAND.textMuted, opacity: 0.3 + (i * 0.2) }} />)}
                        </div>
                    </div>

                    <TrainRow direction="left" cards={ROW_CARDS} speed={50} paused={false} />
                </div>

                {/* ── RDA BARS ── */}
                <div style={{ marginTop: 32, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 16 }}>
                    {rdaBars.map((b, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.1 }}
                            className="rda-card"
                            style={{ textAlign: 'center', padding: '20px 16px', background: BRAND.cream, borderRadius: 24, border: `1px solid ${BRAND.espresso}02` }}
                        >
                            <div style={{ fontFamily: FONTS.main, fontSize: F_SIZE.lg, fontWeight: 900, color: b.color, marginBottom: 12 }}>{b.pct}%</div>
                            <div className="rda-bar-box" style={{ height: 120, width: 12, background: BRAND.white, borderRadius: 10, margin: '0 auto 12px', position: 'relative', overflow: 'hidden' }}>
                                <motion.div initial={{ height: 0 }} whileInView={{ height: `${b.pct}%` }} transition={{ duration: 1, delay: i * 0.1 }} style={{ width: '100%', background: `${b.color}cc`, position: 'absolute', bottom: 0 }} />
                            </div>
                            <div style={{ fontFamily: FONTS.main, fontSize: F_SIZE.sm, fontWeight: 800, color: BRAND.text }}>{b.label}</div>
                        </motion.div>
                    ))}
                </div>

            </div>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&family=Caveat:wght@600;700&display=swap');
                
                @media (max-width: 968px) {
                    .complexity-grid { grid-template-columns: 1fr !important; }
                }
                
                @media (max-width: 640px) {
                    .rda-bar-box { display: none !important; }
                    .rda-card { padding: 12px 8px !important; }
                }
            `}</style>
        </section>
    );
}





