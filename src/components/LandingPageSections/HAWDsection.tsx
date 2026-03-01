'use client';

import { motion } from 'framer-motion';
import { Target, Leaf, Sparkles, UserCheck } from 'lucide-react';

/* ── THEME: all colors tuned for light background ── */
const T = {
    text:        '#1a1a1a',
    textMid:     '#444444',
    textSoft:    '#777777',
    textFaint:   '#aaaaaa',
    green:       '#22c55e',
    greenDark:   '#15803d',
    greenBg:     'rgba(34,197,94,0.08)',
    greenBorder: 'rgba(34,197,94,0.30)',
    cardBg:      'rgba(0,0,0,0.03)',
    cardBorder:  'rgba(0,0,0,0.09)',
    panelBg:     'rgba(0,0,0,0.025)',
};

/* ── DATA ── */
const differentiators = [
    {
        icon: <Target className="w-5 h-5" />,
        title: 'Precision Dosage',
        stat: '21', statSuffix: ' ingredients',
        statLabel: 'calibrated for Indian diet',
        content: 'Our formula targets the specific dietary gaps in typical Indian meals — not generic Western bodies.',
        accent: '#16a34a', accentBg: 'rgba(22,163,74,0.08)', accentBorder: 'rgba(22,163,74,0.25)',
        rotate: '-rotate-1', note: 'no guesswork!',
    },
    {
        icon: <Leaf className="w-5 h-5" />,
        title: 'Zero Filler Ethics',
        stat: '100%', statSuffix: '',
        statLabel: 'active ingredients',
        content: 'Most supplements are 80% maltodextrin. We use 100% active ingredients. Every milligram is functional.',
        accent: '#d97706', accentBg: 'rgba(217,119,6,0.08)', accentBorder: 'rgba(217,119,6,0.25)',
        rotate: 'rotate-1', note: 'zero junk!',
    },
    {
        icon: <Sparkles className="w-5 h-5" />,
        title: 'Invisible Utility',
        stat: '0 mg', statSuffix: '',
        statLabel: 'taste or texture added',
        content: 'Tasteless and textureless. Mix into anything without changing the flavour of your favourite foods.',
        accent: '#7c3aed', accentBg: 'rgba(124,58,237,0.08)', accentBorder: 'rgba(124,58,237,0.25)',
        rotate: '-rotate-[0.5deg]', note: 'mix anywhere!',
    },
    {
        icon: <UserCheck className="w-5 h-5" />,
        title: 'Bio-Identical Forms',
        stat: '≥65%', statSuffix: '',
        statLabel: 'RDA covered per serving',
        content: 'Methylcobalamin B12, Calcium Citrate, Zinc Gluconate — forms your body recognises and absorbs fast.',
        accent: '#db2777', accentBg: 'rgba(219,39,119,0.08)', accentBorder: 'rgba(219,39,119,0.25)',
        rotate: 'rotate-[0.5deg]', note: 'absorbed fast!',
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
    { label: 'Creatine',     cost: '₹800',   pct: 20,  accent: '#16a34a' },
];

const rdaBars = [
    { label: 'B12',   pct: 77, color: '#16a34a' },
    { label: 'B6',    pct: 70, color: '#d97706' },
    { label: 'Folic', pct: 73, color: '#7c3aed' },
    { label: 'D3',    pct: 66, color: '#db2777' },
    { label: 'Vit C', pct: 62, color: '#16a34a' },
    { label: 'B1',    pct: 61, color: '#d97706' },
    { label: 'Biotin',pct: 65, color: '#7c3aed' },
];

/* ── SVG ATOMS ── */
function WiggleLine({ color = '#22c55e', className = '' }: { color?: string; className?: string }) {
    return (
        <svg viewBox="0 0 200 10" fill="none" className={className} aria-hidden="true">
            <path d="M0 5 C25 1,50 9,75 5 S125 1,150 5 S180 9,200 5"
                stroke={color} strokeWidth="2" strokeLinecap="round" fill="none" />
        </svg>
    );
}
function Sparkle2({ color = '#22c55e', className = '' }: { color?: string; className?: string }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
            <path d="M12 2 L13.5 10 L22 12 L13.5 14 L12 22 L10.5 14 L2 12 L10.5 10 Z"
                stroke={color} strokeWidth="1.5" strokeLinejoin="round" fill="none" />
        </svg>
    );
}
function DoodleCircle({ color = '#22c55e', className = '' }: { color?: string; className?: string }) {
    return (
        <svg viewBox="0 0 60 60" fill="none" className={className} aria-hidden="true">
            <path d="M30 6 C46 5,55 16,54 30 S44 55,29 55 S5 44,5 29 S14 5,30 6Z"
                stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" />
        </svg>
    );
}
function DoodleCheck({ color = '#22c55e', className = '' }: { color?: string; className?: string }) {
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
        <span style={{ fontFamily: "'Caveat', cursive", ...style }} className={className}>
            {children}
        </span>
    );
}

function StickyNote({ text }: { text: string }) {
    return (
        <span style={{ fontFamily: "'Caveat', cursive", background: '#fef08a', color: '#713f12' }}
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
                <H className="text-[11px] font-bold truncate" style={{ color: T.textMid }}>{name}</H>
            </div>
            <div className="flex items-center gap-2 shrink-0">
                <H className="text-[10px]" style={{ color: T.textSoft }}>{qty}</H>
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                    style={{
                        fontFamily: "'Caveat', cursive",
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
            <H className="text-[11px] font-bold w-20 text-right shrink-0" style={{ color: T.textMid }}>
                {label}
            </H>
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
                    <H className="text-[10px] font-bold" style={{ color: accent }}>{cost}</H>
                </motion.div>
            </div>
        </motion.div>
    );
}

function RdaBar({ label, pct, color, index }: {
    label: string; pct: number; color: string; index: number;
}) {
    return (
        <div className="flex flex-col items-center gap-1.5">
            <H className="text-[10px] font-bold" style={{ color }}>{pct}%</H>
            <div className="relative w-7 h-20 flex items-end rounded-full overflow-hidden"
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
            <H className="text-[9px] font-bold text-center leading-tight" style={{ color: T.textSoft }}>{label}</H>
        </div>
    );
}

interface CardItem {
    icon: React.ReactNode;
    title: string; stat: string; statSuffix: string; statLabel: string; content: string;
    accent: string; accentBg: string; accentBorder: string;
    rotate: string; note: string;
}

function DoodleCard({ item, index }: { item: CardItem; index: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 26, scale: 0.96 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ y: -5, rotate: 0 }}
            className={`group relative rounded-2xl p-5 overflow-hidden cursor-default transition-all duration-500 ${item.rotate}`}
            style={{ background: item.accentBg, border: `1.5px dashed ${item.accentBorder}` }}
        >
            {/* corner squiggle */}
            <svg className="absolute top-0 right-0 w-14 h-14 pointer-events-none" viewBox="0 0 60 60" fill="none" aria-hidden="true">
                <path d="M60 0 C40 0,0 20,0 60" stroke={item.accent} strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.25" />
            </svg>

            {/* sticky note */}
            <div className="absolute top-3 right-3"><StickyNote text={item.note} /></div>

            {/* icon */}
            <motion.div
                className="mb-4 w-10 h-10 flex items-center justify-center rounded-xl"
                style={{ background: `${item.accent}18`, color: item.accent }}
                whileHover={{ rotate: 15, scale: 1.1 }}
                transition={{ type: 'spring', stiffness: 300 }}
            >
                {item.icon}
            </motion.div>

            {/* stat */}
            <div className="mb-3">
                <H className="text-3xl font-bold leading-none" style={{ color: item.accent }}>
                    {item.stat}<span className="text-lg">{item.statSuffix}</span>
                </H>
                <H className="block text-[10px] uppercase tracking-wider mt-0.5" style={{ color: T.textSoft }}>
                    {item.statLabel}
                </H>
            </div>

            <h3 className="text-sm font-bold mb-2" style={{ color: T.text }}>{item.title}</h3>
            <p className="text-xs leading-relaxed" style={{ color: T.textMid }}>{item.content}</p>

            <WiggleLine color={item.accent} className="w-full h-3 mt-4 opacity-30 group-hover:opacity-70 transition-opacity" />
        </motion.div>
    );
}

/* ── MAIN ── */
export default function HAWDsection() {
    return (
        <>
            <style>{`@import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400;700&display=swap');`}</style>

            <section className="relative overflow-hidden bg-[var(--background)] py-16 md:py-24">

                {/* ambient doodles */}
                <Sparkle2 color="#22c55e" className="absolute top-10 left-[2%] w-6 h-6 opacity-20 rotate-12 pointer-events-none" />
                <DoodleCircle color="#f59e0b" className="absolute top-20 right-[2%] w-10 h-10 opacity-15 -rotate-6 pointer-events-none" />
                <Sparkle2 color="#8b5cf6" className="absolute bottom-16 left-[3%] w-5 h-5 opacity-15 pointer-events-none" />
                <DoodleCircle color="#22c55e" className="absolute bottom-8 right-[3%] w-7 h-7 opacity-10 rotate-3 pointer-events-none" />

                <div className="relative max-w-screen-xl mx-auto px-6 md:px-12 lg:px-16">

                    {/* ── TOP ROW ── */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start mb-12">

                        {/* LEFT */}
                        <div>
                            <motion.div
                                initial={{ opacity: 0, x: -14 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="flex items-center gap-2 mb-4"
                            >
                                <span className="text-base">✏️</span>
                                <H className="text-sm font-bold tracking-wide" style={{ color: T.green }}>The Delta Edge</H>
                                <WiggleLine color={T.green} className="w-14 h-3 opacity-50" />
                            </motion.div>

                            <motion.h2
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.07 }}
                                className="font-playfair text-3xl md:text-5xl font-black mb-5 leading-tight"
                                style={{ color: T.text }}
                            >
                                How We{' '}
                                <span className="relative inline-block">
                                    <span className="gradient-text italic">Truly Differ.</span>
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
                                style={{ color: T.textMid }}
                            >
                                The health industry is loud, but often empty. We chose to be silent but effective.
                                While others market &apos;superfoods&apos;, we focus on clinical data and dietary truth.
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
                                    <H className="text-sm font-bold" style={{ color: T.text }}>What&apos;s actually inside</H>
                                    <StickyNote text="per 40g" />
                                </div>

                                <div className="flex flex-col gap-2">
                                    {ingredients.map((ing, i) => <IngredientRow key={i} {...ing} index={i} />)}
                                </div>

                                <div className="flex items-center gap-2 mt-4 pt-3"
                                    style={{ borderTop: `1px dashed ${T.greenBorder}` }}>
                                    <DoodleCheck color={T.green} className="w-4 h-4" />
                                    <H className="text-xs font-bold" style={{ color: T.greenDark }}>
                                        21 total ingredients, 0 fillers
                                    </H>
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
                                    <H className="text-sm font-bold" style={{ color: T.text }}>
                                        Supplements you&apos;d need separately
                                    </H>
                                    <span style={{ fontFamily: "'Caveat', cursive", background: '#fda4af', color: '#7f1d1d' }}
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
                                        <H className="block text-2xl font-bold" style={{ color: '#be185d' }}>₹7,300</H>
                                        <H className="text-[10px] block mt-0.5" style={{ color: T.textSoft }}>/ month separately</H>
                                    </div>

                                    <div className="rounded-xl p-4 text-center relative"
                                        style={{ background: T.greenBg, border: `1.5px solid ${T.greenBorder}` }}>
                                        {/* hand-drawn circle */}
                                        <svg className="absolute pointer-events-none"
                                            style={{ inset: '-6px', width: 'calc(100% + 12px)', height: 'calc(100% + 12px)' }}
                                            preserveAspectRatio="none" viewBox="0 0 130 70" fill="none" aria-hidden="true">
                                            <path d="M7 10 C35 2,95 2,122 8 S130 22,128 52 S122 66,90 67 S24 68,7 62 S0 50,2 32 S4 17,7 10Z"
                                                stroke={T.green} strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.6" />
                                        </svg>
                                        <H className="block text-2xl font-bold" style={{ color: T.greenDark }}>All-in-1</H>
                                        <H className="text-[10px] block mt-0.5" style={{ color: T.textSoft }}>Plainfuel blend</H>
                                    </div>
                                </div>

                                <H className="block text-center text-[11px] mt-4 italic" style={{ color: T.textFaint }}>
                                    Recommended intake vs available income.
                                </H>
                            </motion.div>

                            {/* RDA bars */}
                            <motion.div
                                initial={{ opacity: 0, y: 16 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.25 }}
                                className="rounded-2xl p-5 -rotate-[0.5deg]"
                                style={{ background: 'rgba(0,0,0,0.025)', border: '1px dashed rgba(0,0,0,0.08)' }}
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <H className="text-xs font-bold" style={{ color: T.textMid }}>
                                        % RDA covered per serving
                                    </H>
                                    <StickyNote text="per 40g scoop" />
                                </div>
                                <div className="flex items-end gap-3 justify-between">
                                    {rdaBars.map((b, i) => <RdaBar key={i} {...b} index={i} />)}
                                </div>
                            </motion.div>
                        </div>
                    </div>

                    {/* divider */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="flex items-center gap-4 mb-10"
                    >
                        <WiggleLine color="rgba(34,197,94,0.3)" className="flex-1 h-3" />
                        <H className="text-xs whitespace-nowrap" style={{ color: T.textFaint }}>✦ what sets us apart ✦</H>
                        <WiggleLine color="rgba(34,197,94,0.3)" className="flex-1 h-3" />
                    </motion.div>

                    {/* 4 cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        {differentiators.map((item, i) => <DoodleCard key={i} item={item} index={i} />)}
                    </div>
                </div>
            </section>
        </>
    );
}