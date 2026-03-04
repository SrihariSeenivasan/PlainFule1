'use client';

import { motion, useAnimationFrame, useMotionValue, useSpring } from 'framer-motion';
import { useState, useCallback } from 'react';
import { Target, Leaf, Sparkles, UserCheck } from 'lucide-react';
import { StarDoodle, Sparkle, CircleDoodle } from '@/components/Elements/SvgDoodles';

/* ── THEME ── */
const T = {
    text:        '#1a1a1a',
    textMid:     '#444444',
    textSoft:    '#777777',
    textFaint:   '#aaaaaa',
    green:       '#15803d',
    greenDark:   '#15803d',
    greenBg:     'rgba(34,197,94,0.08)',
    greenBorder: 'rgba(34,197,94,0.30)',
    cardBg:      'rgba(0,0,0,0.03)',
    cardBorder:  'rgba(0,0,0,0.09)',
    panelBg:     'rgba(0,0,0,0.025)',
};

/* ── FONTS ── */
const SANS  = "'DM Sans', 'Helvetica Neue', sans-serif";
const SERIF = "'Playfair Display', 'Playfair', Georgia, serif";
const HAND  = "'Caveat', cursive";

/* ── DATA ── */
const allCards = [
    {
        icon: <Target className="w-5 h-5" />,
        stat: '21', statSuffix: ' ingredients',
        statLabel: 'calibrated for Indian diet',
        title: 'Precision Dosage',
        content: 'Our formula targets the specific dietary gaps in typical Indian meals — not generic Western bodies.',
        note: 'no guesswork!',
        accent: '#15803d', accentBg: 'rgba(21,128,61,0.08)', accentBorder: 'rgba(21,128,61,0.25)',
        rotate: '-rotate-1',
    },
    {
        icon: <Leaf className="w-5 h-5" />,
        stat: '100%', statSuffix: '',
        statLabel: 'active ingredients',
        title: 'Zero Filler Ethics',
        content: 'Most supplements are 80% maltodextrin. We use 100% active ingredients. Every milligram is functional.',
        note: 'zero junk!',
        accent: '#d97706', accentBg: 'rgba(217,119,6,0.08)', accentBorder: 'rgba(217,119,6,0.25)',
        rotate: 'rotate-1',
    },
    {
        icon: <Sparkles className="w-5 h-5" />,
        stat: '0 mg', statSuffix: '',
        statLabel: 'taste or texture added',
        title: 'Invisible Utility',
        content: 'Tasteless and textureless. Mix into anything without changing the flavour of your favourite foods.',
        note: 'mix anywhere!',
        accent: '#7c3aed', accentBg: 'rgba(124,58,237,0.08)', accentBorder: 'rgba(124,58,237,0.25)',
        rotate: '-rotate-[0.5deg]',
    },
    {
        icon: <UserCheck className="w-5 h-5" />,
        stat: '≥65%', statSuffix: '',
        statLabel: 'RDA covered per serving',
        title: 'Bio-Identical Forms',
        content: 'Methylcobalamin B12, Calcium Citrate, Zinc Gluconate — forms your body recognises and absorbs fast.',
        note: 'absorbed fast!',
        accent: '#db2777', accentBg: 'rgba(219,39,119,0.08)', accentBorder: 'rgba(219,39,119,0.25)',
        rotate: 'rotate-[0.5deg]',
    },
    {
        icon: <span className="text-xl">🧬</span>,
        stat: '0%', statSuffix: '',
        statLabel: 'amino acids',
        title: 'Amino Acids',
        content: 'No added amino acids — nothing to inflate our protein numbers or skew your macros.',
        note: 'clean formula!',
        accent: '#0ea5e9', accentBg: 'rgba(14,165,233,0.08)', accentBorder: 'rgba(14,165,233,0.30)',
        rotate: '-rotate-1',
    },
    {
        icon: <span className="text-xl">🌾</span>,
        stat: '0%', statSuffix: '',
        statLabel: 'gluten',
        title: 'Gluten',
        content: 'Completely gluten-free. Safe for those with celiac disease or gluten sensitivity.',
        note: 'gluten free!',
        accent: '#f59e0b', accentBg: 'rgba(245,158,11,0.08)', accentBorder: 'rgba(245,158,11,0.30)',
        rotate: 'rotate-1',
    },
    {
        icon: <span className="text-xl">🍬</span>,
        stat: '0%', statSuffix: '',
        statLabel: 'artificial sweeteners',
        title: 'Artificial Sweeteners',
        content: 'No aspartame, sucralose, or stevia. Pure and unadulterated from start to finish.',
        note: 'truly sweet!',
        accent: '#ec4899', accentBg: 'rgba(236,72,153,0.08)', accentBorder: 'rgba(236,72,153,0.30)',
        rotate: '-rotate-[0.5deg]',
    },
    {
        icon: <span className="text-xl">🎨</span>,
        stat: '0%', statSuffix: '',
        statLabel: 'artificial flavours',
        title: 'Artificial Flavours',
        content: 'No lab-made taste additives. What you mix it into is exactly what you taste.',
        note: 'all natural!',
        accent: '#8b5cf6', accentBg: 'rgba(139,92,246,0.08)', accentBorder: 'rgba(139,92,246,0.30)',
        rotate: 'rotate-[0.5deg]',
    },
    {
        icon: <span className="text-xl">🍭</span>,
        stat: '0%', statSuffix: '',
        statLabel: 'added sugar',
        title: 'Added Sugar',
        content: 'Zero grams of added sugar in every serving. Your sweet tooth stays your business.',
        note: 'no sugar!',
        accent: '#ef4444', accentBg: 'rgba(239,68,68,0.08)', accentBorder: 'rgba(239,68,68,0.30)',
        rotate: '-rotate-1',
    },
    {
        icon: <span className="text-xl">🔬</span>,
        stat: '0%', statSuffix: '',
        statLabel: 'genetically modified organisms',
        title: 'GMOs',
        content: 'Every ingredient is sourced non-GMO. We believe in food that nature intended.',
        note: 'non-GMO!',
        accent: '#10b981', accentBg: 'rgba(16,185,129,0.08)', accentBorder: 'rgba(16,185,129,0.30)',
        rotate: 'rotate-1',
    },
    {
        icon: <span className="text-xl">🚫</span>,
        stat: '0%', statSuffix: '',
        statLabel: 'maltodextrin',
        title: 'Maltodextrin',
        content: "The cheap filler most brands hide behind. We don't use a single gram of it.",
        note: 'zero filler!',
        accent: '#f97316', accentBg: 'rgba(249,115,22,0.08)', accentBorder: 'rgba(249,115,22,0.30)',
        rotate: '-rotate-[0.5deg]',
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
    { label: 'B12',    pct: 77, color: '#15803d' },
    { label: 'B6',     pct: 70, color: '#d97706' },
    { label: 'Folic',  pct: 73, color: '#7c3aed' },
    { label: 'D3',     pct: 66, color: '#db2777' },
    { label: 'Vit C',  pct: 62, color: '#15803d' },
    { label: 'B1',     pct: 61, color: '#d97706' },
    { label: 'Biotin', pct: 65, color: '#7c3aed' },
];

/* ── SVG ATOMS ── */
function WiggleLine({ color = '#15803d', className = '' }: { color?: string; className?: string }) {
    return (
        <svg viewBox="0 0 200 10" fill="none" className={className} aria-hidden="true">
            <path d="M0 5 C25 1,50 9,75 5 S125 1,150 5 S180 9,200 5"
                stroke={color} strokeWidth="2" strokeLinecap="round" fill="none" />
        </svg>
    );
}

function DoodleCheck({ color = '#15803d', className = '' }: { color?: string; className?: string }) {
    return (
        <svg viewBox="0 0 20 20" fill="none" className={className} aria-hidden="true">
            <path d="M3 11 L8 16 L17 5" stroke={color} strokeWidth="2.5"
                strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>
    );
}

function H({ children, className = '', style = {} }: {
    children: React.ReactNode; className?: string; style?: React.CSSProperties
}) {
    return (
        <span style={{ fontFamily: HAND, ...style }} className={className}>
            {children}
        </span>
    );
}

function StickyNote({ text }: { text: string }) {
    return (
        <span style={{ fontFamily: HAND, background: '#fef08a', color: '#713f12' }}
            className="inline-block text-[11px] font-bold px-2.5 py-0.5 rounded shadow rotate-2 select-none whitespace-nowrap border border-yellow-300/60">
            {text}
        </span>
    );
}

/* ── SUB-COMPONENTS ── */
function IngredientRow({ name, qty, rda, highlight, index }: {
    name: string; qty: string; rda: string; highlight: boolean; index: number;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, x: -14 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.06 }}
            whileHover={{ x: 4 }}
            className="flex items-center justify-between gap-3 px-3 py-2 rounded-xl border transition-all cursor-default"
            style={{
                borderColor: highlight ? T.greenBorder : 'rgba(0,0,0,0.08)',
                background:  highlight ? T.greenBg    : 'rgba(0,0,0,0.02)',
            }}
        >
            <div className="flex items-center gap-2 min-w-0">
                {highlight
                    ? <DoodleCheck color={T.green} className="w-3.5 h-3.5 shrink-0" />
                    : <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: T.textFaint }} />
                }
                <span className="text-[11px] font-semibold truncate" style={{ fontFamily: SANS, color: T.textMid }}>{name}</span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
                <span className="text-[10px]" style={{ fontFamily: SERIF, color: T.textSoft }}>{qty}</span>
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                    style={{
                        fontFamily: SANS,
                        background: highlight ? T.greenBg : 'rgba(0,0,0,0.05)',
                        color:      highlight ? T.greenDark : T.textSoft,
                    }}>
                    {rda}
                </span>
            </div>
        </motion.div>
    );
}

function SupplementBar({ label, cost, pct, accent, index }: {
    label: string; cost: string; pct: number; accent: string; index: number;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, x: 18 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center gap-3"
        >
            <span className="text-[11px] font-semibold w-24 text-right shrink-0" style={{ fontFamily: SANS, color: T.textMid }}>
                {label}
            </span>
            <div className="flex-1 h-7 rounded-full overflow-hidden relative"
                style={{ background: 'rgba(0,0,0,0.06)' }}>
                <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${pct}%` }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 + 0.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    className="h-full rounded-full flex items-center justify-end pr-3"
                    style={{ background: `${accent}22`, borderRight: `2.5px solid ${accent}` }}
                >
                    <span className="text-[10px] font-bold" style={{ fontFamily: SERIF, color: accent }}>{cost}</span>
                </motion.div>
            </div>
        </motion.div>
    );
}

function RdaBar({ label, pct, color, index }: {
    label: string; pct: number; color: string; index: number;
}) {
    return (
        <div className="flex flex-col items-center gap-2">
            <span className="text-[13px] font-bold" style={{ fontFamily: SERIF, color }}>{pct}%</span>
            <div className="relative w-10 h-32 flex items-end rounded-full overflow-hidden"
                style={{ background: 'rgba(0,0,0,0.07)' }}>
                <motion.div
                    initial={{ height: 0 }}
                    whileInView={{ height: `${pct}%` }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.08 + 0.3, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                    className="w-full rounded-full"
                    style={{ background: `${color}cc` }}
                />
            </div>
            <span className="text-[10px] font-semibold text-center leading-tight" style={{ fontFamily: SANS, color: T.textSoft }}>{label}</span>
        </div>
    );
}

interface UnifiedCardItem {
    icon: React.ReactNode;
    stat: string; statSuffix: string; statLabel: string;
    title: string; content: string; note: string;
    accent: string; accentBg: string; accentBorder: string;
    rotate: string;
}

/* ── TRAIN CAROUSEL ── */
const ROW_1 = [...allCards.slice(0, 6), ...allCards.slice(0, 6)];
const ROW_2 = [...allCards.slice(5), ...allCards.slice(5)];

function TrainCard({ item, isHovered, onHover, onLeave }: {
    item: UnifiedCardItem;
    isHovered: boolean;
    onHover: () => void;
    onLeave: () => void;
}) {
    const tiltX = useSpring(0, { stiffness: 180, damping: 18 });
    const tiltY = useSpring(0, { stiffness: 180, damping: 18 });

    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        const el = e.currentTarget;
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        tiltY.set(((e.clientX - cx) / rect.width) * 14);
        tiltX.set(-((e.clientY - cy) / rect.height) * 10);
    }, [tiltX, tiltY]);

    const handleMouseLeave = useCallback(() => {
        tiltX.set(0);
        tiltY.set(0);
        onLeave();
    }, [tiltX, tiltY, onLeave]);

    return (
        <motion.div
            onMouseMove={handleMouseMove}
            onMouseEnter={onHover}
            onMouseLeave={handleMouseLeave}
            style={{
                rotateX: tiltX,
                rotateY: tiltY,
                transformStyle: 'preserve-3d',
                width: 220,
                flexShrink: 0,
                perspective: 800,
                background: item.accentBg,
                border: `1.5px dashed ${item.accentBorder}`,
                minHeight: 210,
            } as React.CSSProperties}
            animate={{
                scale: isHovered ? 1.06 : 1,
                zIndex: isHovered ? 20 : 1,
                boxShadow: isHovered
                    ? `0 20px 50px ${item.accent}33, 0 4px 16px ${item.accent}22`
                    : '0 2px 8px rgba(0,0,0,0.06)',
            }}
            transition={{ scale: { type: 'spring', stiffness: 320, damping: 24 } }}
            className="group relative rounded-2xl p-5 overflow-hidden cursor-default flex flex-col"
        >
            {/* Corner arc */}
            <svg className="absolute top-0 right-0 w-12 h-12 pointer-events-none" viewBox="0 0 60 60" fill="none" aria-hidden="true">
                <path d="M60 0 C40 0,0 20,0 60" stroke={item.accent} strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.22" />
            </svg>

            {/* Sticky note */}
            <div className="absolute top-2.5 right-2.5">
                <StickyNote text={item.note} />
            </div>

            {/* Icon */}
            <motion.div
                className="mb-3 w-9 h-9 flex items-center justify-center rounded-xl shrink-0"
                style={{ background: `${item.accent}18`, color: item.accent }}
                animate={{ rotate: isHovered ? 12 : 0, scale: isHovered ? 1.15 : 1 }}
                transition={{ type: 'spring', stiffness: 300 }}
            >
                {item.icon}
            </motion.div>

            {/* Stat */}
            <div className="mb-2">
                <H className="text-2xl font-bold leading-none" style={{ color: item.accent }}>
                    {item.stat}<span className="text-base">{item.statSuffix}</span>
                </H>
                <H className="block text-[9px] uppercase tracking-wider mt-0.5" style={{ color: T.textSoft }}>
                    {item.statLabel}
                </H>
            </div>

            <h3 className="text-[13px] font-bold mb-1.5" style={{ color: T.text, fontFamily: SANS }}>{item.title}</h3>
            <p className="text-[11px] leading-relaxed flex-1" style={{ color: T.textMid, fontFamily: SANS }}>{item.content}</p>

            {/* Animated shimmer on hover */}
            {isHovered && (
                <motion.div
                    className="absolute inset-0 pointer-events-none rounded-2xl"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{
                        background: `linear-gradient(115deg, transparent 20%, ${item.accent}12 50%, transparent 80%)`,
                    }}
                />
            )}

            <WiggleLine
                color={item.accent}
                className={`w-full h-2.5 mt-3 transition-opacity duration-300 ${isHovered ? 'opacity-70' : 'opacity-25'}`}
            />
        </motion.div>
    );
}

function TrainRow({
    cards,
    direction,
    speed,
    paused,
}: {
    cards: UnifiedCardItem[];
    direction: 'left' | 'right';
    speed: number;
    paused: boolean;
    sectionBg: string;
}) {
    const x = useMotionValue(0);
    const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
    const CARD_W = 220 + 16;
    const HALF = cards.length / 2;
    const LOOP_W = HALF * CARD_W;

    useAnimationFrame((_, delta) => {
        if (paused && hoveredIdx !== null) return;
        const velocity = direction === 'left' ? -speed : speed;
        let next = x.get() + (velocity * delta) / 1000;

        if (direction === 'left' && next <= -LOOP_W) next += LOOP_W;
        if (direction === 'right' && next >= 0) next -= LOOP_W;

        x.set(next);
    });

    return (
        <div className="relative" style={{ paddingTop: 12, paddingBottom: 12 }}>
            {/* Scroll track */}
            <div style={{ overflow: 'visible' }}>
                <motion.div
                    style={{ x, display: 'flex', gap: 16, willChange: 'transform' }}
                >
                    {cards.map((item, i) => (
                        <TrainCard
                            key={i}
                            item={item}
                            isHovered={hoveredIdx === i}
                            onHover={() => setHoveredIdx(i)}
                            onLeave={() => setHoveredIdx(null)}
                        />
                    ))}
                </motion.div>
            </div>
        </div>
    );
}

function TrainCarousel({ sectionBg }: { sectionBg: string }) {
    const [paused, setPaused] = useState(false);

    return (
        <div
            className="relative -mx-6 md:-mx-12 lg:-mx-16"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
        >
            {/* Rail track decoration — top */}
            <div className="relative mb-1">
                <svg className="w-full" height="6" style={{ opacity: 0.12 }}>
                    <line x1="0" y1="3" x2="100%" y2="3" stroke="#15803d" strokeWidth="1.5" strokeDasharray="12 8" />
                </svg>
            </div>

            <div className="flex flex-col gap-4 py-2">
                {/* Row 1 — scrolls left */}
                <TrainRow
                    cards={ROW_1}
                    direction="left"
                    speed={paused ? 18 : 52}
                    paused={paused}
                    sectionBg={sectionBg}
                />

                {/* Divider track */}
                <div className="relative flex items-center gap-3 px-6 md:px-12 lg:px-16">
                    <motion.div
                        className="flex-1 h-px"
                        style={{ background: 'repeating-linear-gradient(to right, rgba(21,128,61,0.2) 0, rgba(21,128,61,0.2) 12px, transparent 12px, transparent 22px)' }}
                        animate={{ backgroundPositionX: ['0px', '-34px'] }}
                        transition={{ duration: 1.4, repeat: Infinity, ease: 'linear' }}
                    />
                    <span style={{ fontFamily: SANS, fontSize: 10, color: 'rgba(0,0,0,0.22)', letterSpacing: '0.18em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                        ✦ what sets us apart ✦
                    </span>
                    <motion.div
                        className="flex-1 h-px"
                        style={{ background: 'repeating-linear-gradient(to right, rgba(21,128,61,0.2) 0, rgba(21,128,61,0.2) 12px, transparent 12px, transparent 22px)' }}
                        animate={{ backgroundPositionX: ['0px', '34px'] }}
                        transition={{ duration: 1.4, repeat: Infinity, ease: 'linear' }}
                    />
                </div>

                {/* Row 2 — scrolls right */}
                <TrainRow
                    cards={ROW_2}
                    direction="right"
                    speed={paused ? 14 : 42}
                    paused={paused}
                    sectionBg={sectionBg}
                />
            </div>

            {/* Rail track decoration — bottom */}
            <div className="relative mt-1">
                <svg className="w-full" height="6" style={{ opacity: 0.12 }}>
                    <line x1="0" y1="3" x2="100%" y2="3" stroke="#15803d" strokeWidth="1.5" strokeDasharray="12 8" />
                </svg>
            </div>

            {/* Hover hint */}
            <motion.div
                className="absolute bottom-3 right-6 md:right-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: paused ? 0 : 1 }}
                transition={{ duration: 0.4 }}
            >
                <span style={{ fontFamily: SANS, fontSize: 10, color: 'rgba(0,0,0,0.28)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                    hover to slow
                </span>
            </motion.div>
        </div>
    );
}


/* ── MAIN ── */
export default function HAWDsection() {
    // ── Change this value to match your actual page/section background color ──
    // e.g. '#ffffff', '#fafaf9', '#f8f7f4', etc.
    const SECTION_BG = '#ffffff';

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400;700&family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,700;1,700&display=swap');
            `}</style>

            <section
                className="relative overflow-hidden py-16 md:py-24"
                style={{ background: SECTION_BG }}
            >

                {/* ambient doodles */}
                <Sparkle color="#15803d" className="absolute top-10 left-[2%] w-6 h-6 opacity-20 rotate-12 pointer-events-none" />
                <CircleDoodle color="#f59e0b" className="absolute top-20 right-[2%] w-10 h-10 opacity-15 -rotate-6 pointer-events-none" />
                <Sparkle color="#8b5cf6" className="absolute bottom-16 left-[3%] w-5 h-5 opacity-15 pointer-events-none" />
                <CircleDoodle color="#15803d" className="absolute bottom-8 right-[3%] w-7 h-7 opacity-10 rotate-3 pointer-events-none" />

                <div className="relative max-w-screen-xl mx-auto px-6 md:px-12 lg:px-16">

                    {/* ── TOP ROW ── */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start mb-12">

                        {/* LEFT */}
                        <div>
                            <motion.div
                                initial={{ opacity: 0, y: 16, rotate: -2 }}
                                whileInView={{ opacity: 1, y: 0, rotate: -1.5 }}
                                viewport={{ once: true }}
                                className="flex items-center gap-2 mb-4"
                            >
                                <div style={{
                                    background: 'rgba(21,128,61,0.09)',
                                    border: '2px dashed #15803d',
                                    borderRadius: 10,
                                    padding: '8px 18px',
                                    transform: 'rotate(-1.5deg)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 8,
                                }}>
                                    <StarDoodle size={14} color="#15803d" />
                                    <span style={{
                                        fontFamily: HAND,
                                        fontSize: 15,
                                        color: '#15803d',
                                        fontWeight: 700,
                                        letterSpacing: '0.05em',
                                    }}>
                                        What Sets Us Apart
                                    </span>
                                    <StarDoodle size={14} color="#15803d" />
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, x: -14 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="flex items-center gap-2 mb-4"
                            >
                                <span className="text-base">✨</span>
                                <H className="text-sm font-bold tracking-wide" style={{ color: T.green }}>The Complete Solution</H>
                                <svg viewBox="0 0 120 10" fill="none" className="w-14 h-3 opacity-50">
                                    <path d="M0 5 C25 1,50 9,75 5 S125 1,150 5" stroke={T.green} strokeWidth="2" strokeLinecap="round" fill="none" />
                                </svg>
                            </motion.div>

                            <motion.h2
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.07 }}
                                className="font-playfair text-3xl md:text-5xl font-black mb-5 leading-tight"
                                style={{ color: T.text }}
                            >
                                One Scoop.{' '}
                                <span className="relative inline-block">
                                    <span className="gradient-text italic">Complete Daily Support.</span>
                                    <svg viewBox="0 0 220 10" fill="none" className="absolute -bottom-1 left-0 w-full" aria-hidden="true">
                                        <path d="M2 6 C55 1,130 9,180 5 S208 1,218 6"
                                            stroke={T.green} strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.5" />
                                    </svg>
                                </span>
                            </motion.h2>

                            <motion.p
                                initial={{ opacity: 0, y: 12 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.13 }}
                                className="text-sm leading-relaxed mb-8 max-w-sm"
                                style={{ color: T.textMid, fontFamily: SANS }}
                            >
                                Designed for professionals, women, and busy parents. All 15+ essential micronutrients to bridge the gap between volume and vitality.
                                Zero sugar, zero compromises.
                            </motion.p>

                            {/* ingredient panel */}
                            <motion.div
                                initial={{ opacity: 0, y: 16 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.18 }}
                                className="relative rounded-2xl p-5 -rotate-[0.5deg]"
                                style={{ background: T.greenBg, border: `1.5px dashed ${T.greenBorder}` }}
                            >
                                <svg className="absolute top-0 right-0 w-12 h-12 pointer-events-none" viewBox="0 0 50 50" fill="none" aria-hidden="true">
                                    <path d="M50 0 C30 0,0 20,0 50" stroke={T.green} strokeWidth="1.5" fill="none" opacity="0.2" />
                                </svg>

                                <div className="flex items-center gap-3 mb-4">
                                    <span className="text-sm font-bold" style={{ fontFamily: SERIF, color: T.text }}>What&apos;s actually inside</span>
                                    <StickyNote text="per 40g" />
                                </div>

                                <div className="flex flex-col gap-2">
                                    {ingredients.map((ing, i) => <IngredientRow key={i} {...ing} index={i} />)}
                                </div>

                                <div className="flex items-center gap-2 mt-4 pt-3"
                                    style={{ borderTop: `1px dashed ${T.greenBorder}` }}>
                                    <DoodleCheck color={T.green} className="w-4 h-4" />
                                    <span className="text-xs font-semibold" style={{ fontFamily: SANS, color: T.greenDark }}>
                                        21 total ingredients, 0 fillers
                                    </span>
                                </div>
                            </motion.div>
                        </div>

                        {/* RIGHT */}
                        <div className="flex flex-col gap-5">

                            {/* cost comparison */}
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.15 }}
                                className="relative rounded-2xl p-6 rotate-[0.5deg]"
                                style={{ background: 'rgba(0,0,0,0.03)', border: '1.5px dashed rgba(0,0,0,0.1)' }}
                            >
                                <div className="flex items-center justify-between mb-5">
                                    <span className="text-sm font-bold" style={{ fontFamily: SERIF, color: T.text }}>
                                        Supplements you&apos;d need separately
                                    </span>
                                    <span style={{ fontFamily: SANS, background: '#fda4af', color: '#7f1d1d' }}
                                        className="text-[10px] font-bold px-2.5 py-0.5 rounded -rotate-1 shadow shrink-0 border border-pink-300/50">
                                        vs Plainfuel
                                    </span>
                                </div>

                                <div className="flex flex-col gap-3 mb-6">
                                    {supplements.map((s, i) => <SupplementBar key={i} {...s} index={i} />)}
                                </div>

                                {/* total vs all-in-1 */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="rounded-xl p-4 text-center"
                                        style={{ background: 'rgba(219,39,119,0.07)', border: '1.5px dashed rgba(219,39,119,0.3)' }}>
                                        <span className="block text-2xl font-bold" style={{ fontFamily: SERIF, color: '#be185d' }}>₹7,300</span>
                                        <span className="text-[10px] block mt-0.5" style={{ fontFamily: SANS, color: T.textSoft }}>/ month separately</span>
                                    </div>

                                    <div className="rounded-xl p-4 text-center relative"
                                        style={{ background: T.greenBg, border: `1.5px solid ${T.greenBorder}` }}>
                                        <svg className="absolute pointer-events-none"
                                            style={{ inset: '-6px', width: 'calc(100% + 12px)', height: 'calc(100% + 12px)' }}
                                            preserveAspectRatio="none" viewBox="0 0 130 70" fill="none" aria-hidden="true">
                                            <path d="M7 10 C35 2,95 2,122 8 S130 22,128 52 S122 66,90 67 S24 68,7 62 S0 50,2 32 S4 17,7 10Z"
                                                stroke={T.green} strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.6" />
                                        </svg>
                                        <span className="block text-2xl font-bold italic" style={{ fontFamily: SERIF, color: T.greenDark }}>All-in-1</span>
                                        <span className="text-[10px] block mt-0.5" style={{ fontFamily: SANS, color: T.textSoft }}>Plainfuel blend</span>
                                    </div>
                                </div>

                                <span className="block text-center text-[11px] mt-4 italic" style={{ fontFamily: SANS, color: T.textFaint }}>
                                    Recommended intake vs available income.
                                </span>
                            </motion.div>

                            {/* RDA bars panel */}
                            <motion.div
                                initial={{ opacity: 0, y: 16 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.25 }}
                                className="rounded-2xl p-6 -rotate-[0.5deg]"
                                style={{ background: 'rgba(0,0,0,0.025)', border: '1px dashed rgba(0,0,0,0.08)' }}
                            >
                                <div className="flex items-center justify-between mb-5">
                                    <span className="text-sm font-bold" style={{ fontFamily: SERIF, color: T.textMid }}>
                                        % RDA covered per serving
                                    </span>
                                    <StickyNote text="per 40g scoop" />
                                </div>
                                <div className="flex items-end gap-4 justify-between">
                                    {rdaBars.map((b, i) => <RdaBar key={i} {...b} index={i} />)}
                                </div>
                            </motion.div>
                        </div>
                    </div>

                    {/* ── TRAIN CAROUSEL ── */}
                    <TrainCarousel sectionBg={SECTION_BG} />
                </div>
            </section>
        </>
    );
}