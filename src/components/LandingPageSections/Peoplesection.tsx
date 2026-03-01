'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/* ── IMAGES grouped by category ── */
const CATEGORIES: Record<string, { src: string; alt: string }[]> = {
    'Athletes 💪': [
        { src: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600&q=80', alt: 'Gym workout' },
        { src: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=80', alt: 'Weight training' },
        { src: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=600&q=80', alt: 'Boxing' },
        { src: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=600&q=80', alt: 'Crossfit' },
    ],
    'Runners 🏃': [
        { src: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80', alt: 'Running' },
        { src: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=600&q=80', alt: 'Morning run' },
        { src: 'https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=600&q=80', alt: 'Hiking' },
        { src: 'https://images.unsplash.com/photo-1577221084712-45b0445d2b00?w=600&q=80', alt: 'Outdoor workout' },
    ],
    'Parents 🥗': [
        { src: 'https://images.unsplash.com/photo-1547919307-1ecb10702e6f?w=600&q=80', alt: 'Family meal' },
        { src: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600&q=80', alt: 'Healthy food' },
        { src: 'https://images.unsplash.com/photo-1593079831268-3381b0db4a77?w=600&q=80', alt: 'Meal prep' },
        { src: 'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=600&q=80', alt: 'Smoothie' },
    ],
    'Yogis 🧘': [
        { src: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&q=80', alt: 'Yoga' },
        { src: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&q=80', alt: 'Meditation' },
        { src: 'https://images.unsplash.com/photo-1599058917765-a780eda07a3e?w=600&q=80', alt: 'Stretching' },
        { src: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&q=80', alt: 'Dance workout' },
    ],
    'Cyclists 🚴': [
        { src: 'https://images.unsplash.com/photo-1594737625785-a6cbdabd333c?w=600&q=80', alt: 'Cycling' },
        { src: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=600&q=80', alt: 'Group fitness' },
        { src: 'https://images.unsplash.com/photo-1584466977773-e625c37cdd50?w=600&q=80', alt: 'Swimming' },
        { src: 'https://images.unsplash.com/photo-1548690312-e3b507d8c110?w=600&q=80', alt: 'Athlete' },
    ],
    'Everyday 🌟': [
        { src: 'https://images.unsplash.com/photo-1607962837359-5e7e89f86776?w=600&q=80', alt: 'Nutrition' },
        { src: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=600&q=80', alt: 'Supplement' },
        { src: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=600&q=80', alt: 'Active' },
        { src: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600&q=80', alt: 'Lifestyle' },
    ],
};

/* flatten for cycling */
const ALL_IMAGES = Object.entries(CATEGORIES).flatMap(([cat, imgs]) =>
    imgs.map(img => ({ ...img, category: cat }))
);

/* 12 slots, each pre-assigned a category */
const SLOT_CATEGORIES = [
    'Athletes 💪',  // 0  tall
    'Runners 🏃',   // 1
    'Parents 🥗',   // 2
    'Cyclists 🚴',  // 3  tall
    'Yogis 🧘',     // 4
    'Everyday 🌟',  // 5
    'Athletes 💪',  // 6
    'Runners 🏃',   // 7
    'Parents 🥗',   // 8
    'Yogis 🧘',     // 9  wide
    'Cyclists 🚴',  // 10
    'Everyday 🌟',  // 11
];

const SLOT_ACCENTS = [
    '#22c55e', '#f59e0b', '#ec4899',
    '#22c55e', '#8b5cf6', '#f59e0b',
    '#22c55e', '#f59e0b', '#ec4899',
    '#8b5cf6', '#22c55e', '#f59e0b',
];

/* ── SVG DOODLE ATOMS ── */
function WiggleLine({ color = '#22c55e', className = '' }: { color?: string; className?: string }) {
    return (
        <svg viewBox="0 0 200 10" fill="none" className={className} aria-hidden="true">
            <path d="M0 5 C25 1,50 9,75 5 S125 1,150 5 S180 9,200 5"
                stroke={color} strokeWidth="2" strokeLinecap="round" fill="none" />
        </svg>
    );
}

function Sparkle({ color = '#22c55e', className = '' }: { color?: string; className?: string }) {
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

function DoodleArrow({ color = '#f59e0b', className = '' }: { color?: string; className?: string }) {
    return (
        <svg viewBox="0 0 40 24" fill="none" className={className} aria-hidden="true">
            <path d="M2 12 C12 4,26 4,36 11" stroke={color} strokeWidth="2" strokeLinecap="round" fill="none" />
            <path d="M28 5 L37 12 L28 18" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>
    );
}

function DoodleBorderOverlay({ color }: { color: string }) {
    return (
        <svg
            className="absolute pointer-events-none z-10"
            style={{ inset: '-5px', width: 'calc(100% + 10px)', height: 'calc(100% + 10px)' }}
            preserveAspectRatio="none"
            viewBox="0 0 300 300"
            fill="none"
            aria-hidden="true"
        >
            <path
                d="M8 14 C80 5,210 5,292 12 S300 50,298 240 S290 295,240 297 S70 298,14 294 S2 260,3 150 S4 22,8 14Z"
                stroke={color} strokeWidth="2.5" fill="none"
                strokeDasharray="7 4" strokeLinecap="round" opacity="0.75"
            />
        </svg>
    );
}

/* Caveat handwritten wrapper */
function H({ children, className = '', style = {} }: {
    children: React.ReactNode; className?: string; style?: React.CSSProperties;
}) {
    return (
        <span style={{ fontFamily: "'Caveat', cursive", ...style }} className={className}>
            {children}
        </span>
    );
}

function StickyNote({ text, rotate = 'rotate-2' }: { text: string; rotate?: string }) {
    return (
        <span style={{ fontFamily: "'Caveat', cursive", background: '#fef08a', color: '#713f12' }}
            className={`inline-block text-[11px] font-bold px-2.5 py-0.5 rounded shadow-md ${rotate} select-none whitespace-nowrap border border-yellow-300/60`}>
            {text}
        </span>
    );
}

/* ── IMAGE CELL ── */
interface CellProps {
    imageIndex: number;
    isChanging: boolean;
    slotIndex: number;
    style: React.CSSProperties;
}

function ImageCell({ imageIndex, isChanging, slotIndex, style }: CellProps) {
    const img = ALL_IMAGES[imageIndex % ALL_IMAGES.length];
    const accent = SLOT_ACCENTS[slotIndex % SLOT_ACCENTS.length];
    const category = SLOT_CATEGORIES[slotIndex];

    return (
        <div style={{ ...style, position: 'relative' }} className="group">
            {/* image + transitions */}
            <div style={{ position: 'absolute', inset: 0, borderRadius: 14, overflow: 'hidden' }}>
                <AnimatePresence mode="wait">
                    <motion.div
                        key={imageIndex}
                        initial={{ opacity: 0, scale: 1.07, filter: 'blur(10px)' }}
                        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, scale: 0.95, filter: 'blur(6px)' }}
                        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                        style={{ position: 'absolute', inset: 0 }}
                    >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={img.src} alt={img.alt}
                            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                        {/* gradient for label readability */}
                        <div style={{
                            position: 'absolute', inset: 0,
                            background: 'linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, transparent 40%, transparent 60%, rgba(0,0,0,0.25) 100%)',
                        }} />
                    </motion.div>
                </AnimatePresence>

                {/* swap flash */}
                <AnimatePresence>
                    {isChanging && (
                        <motion.div
                            initial={{ opacity: 0.5 }} animate={{ opacity: 0 }} exit={{ opacity: 0 }}
                            transition={{ duration: 0.7 }}
                            style={{ position: 'absolute', inset: 0, background: `${accent}30`, zIndex: 8, pointerEvents: 'none' }}
                        />
                    )}
                </AnimatePresence>
            </div>

            {/* doodle border on hover */}
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <DoodleBorderOverlay color={accent} />
            </div>

            {/* category label — always visible on image */}
            <div className="absolute top-2 left-2 z-20">
                <span
                    style={{
                        fontFamily: "'Caveat', cursive",
                        background: accent,
                        color: '#1a1a1a',
                        fontSize: '10px',
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: 999,
                        display: 'inline-block',
                        transform: 'rotate(-1.5deg)',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                        whiteSpace: 'nowrap',
                    }}
                >
                    {category}
                </span>
            </div>

            {/* bottom label — image alt on hover */}
            <div className="absolute bottom-2 left-2 right-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <H className="text-[10px] font-bold" style={{ color: 'rgba(255,255,255,0.85)' }}>{img.alt}</H>
            </div>
        </div>
    );
}

/* ── STATS ── */
const stats = [
    { value: '50K+', label: 'active users',  accent: '#22c55e' },
    { value: '4.9★', label: 'avg rating',    accent: '#f59e0b' },
    { value: '21',   label: 'ingredients',   accent: '#8b5cf6' },
    { value: '0',    label: 'fillers added', accent: '#ec4899' },
];

const SLOT_COUNT = 12;

/* ── MAIN ── */
export default function PeopleSection() {
    const [slots, setSlots] = useState<number[]>(() =>
        Array.from({ length: SLOT_COUNT }, (_, i) => {
            const cat = SLOT_CATEGORIES[i];
            const catImgs = ALL_IMAGES.filter(img => img.category === cat);
            return ALL_IMAGES.indexOf(catImgs[i % catImgs.length]);
        })
    );
    const [flashingSlot, setFlashingSlot] = useState<number | null>(null);

    useEffect(() => {
        const getNextForSlot = (slotIdx: number, currentSlots: number[]): number => {
            const cat = SLOT_CATEGORIES[slotIdx];
            const catImgs = ALL_IMAGES
                .map((img, i) => ({ img, i }))
                .filter(({ img }) => img.category === cat);
            const currentImgIdx = currentSlots[slotIdx];
            const next = catImgs.find(({ i }) => i !== currentImgIdx);
            return next ? next.i : catImgs[0].i;
        };

        let timeoutId: ReturnType<typeof setTimeout>;
        const cycle = () => {
            const delay = 2000 + Math.random() * 1500;
            timeoutId = setTimeout(() => {
                setSlots(prev => {
                    const slotIndex = Math.floor(Math.random() * SLOT_COUNT);
                    const next = [...prev];
                    next[slotIndex] = getNextForSlot(slotIndex, prev);
                    setFlashingSlot(slotIndex);
                    setTimeout(() => setFlashingSlot(null), 700);
                    return next;
                });
                cycle();
            }, delay);
        };
        cycle();
        return () => clearTimeout(timeoutId);
    }, []);

    return (
        <>
            <style>{`@import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400;700&display=swap');`}</style>

            <section className="relative overflow-hidden bg-[var(--background)] py-20 md:py-28">

                {/* dot grid texture */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.03]" aria-hidden="true">
                    <defs>
                        <pattern id="dotgrid" x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse">
                            <circle cx="2" cy="2" r="1.5" fill="#22c55e" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#dotgrid)" />
                </svg>

                {/* ambient decorations */}
                <Sparkle  color="#22c55e" className="absolute top-10 left-[2%] w-7 h-7 opacity-20 rotate-12 pointer-events-none" />
                <DoodleCircle color="#f59e0b" className="absolute top-24 right-[2%] w-12 h-12 opacity-15 -rotate-6 pointer-events-none" />
                <Sparkle  color="#8b5cf6" className="absolute bottom-24 left-[3%] w-5 h-5 opacity-15 pointer-events-none" />
                <DoodleCircle color="#22c55e" className="absolute bottom-10 right-[4%] w-9 h-9 opacity-10 rotate-3 pointer-events-none" />

                <div className="relative max-w-screen-xl mx-auto px-6 md:px-12 lg:px-16">

                    {/* ── HEADING — all Caveat ── */}
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                        className="text-center mb-12"
                    >
                        {/* eyebrow */}
                        <div className="flex items-center justify-center gap-3 mb-4">
                            <WiggleLine color="#22c55e" className="w-14 h-3 opacity-50" />
                            <H className="text-base font-bold tracking-wide" style={{ color: '#22c55e' }}>
                                Real People · Real Results
                            </H>
                            <WiggleLine color="#22c55e" className="w-14 h-3 opacity-50" />
                        </div>

                        {/* main heading — Caveat, large */}
                        <H
                            className="block font-bold leading-tight mb-3"
                            style={{ fontSize: 'clamp(2.8rem, 6vw, 5rem)', color: '#1a1a1a', lineHeight: 1.05 }}
                        >
                            Put health in{' '}
                            <span className="relative inline-block">
                                <span style={{ color: '#22c55e', fontStyle: 'italic' }}>your hands.</span>
                                {/* hand-drawn underline */}
                                <svg viewBox="0 0 280 14" fill="none" className="absolute -bottom-1 left-0 w-full" aria-hidden="true">
                                    <path d="M2 8 C55 2,150 12,220 7 S265 2,278 8"
                                        stroke="#22c55e" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.45" />
                                    <path d="M10 11 C70 7,160 13,240 10"
                                        stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.2" />
                                </svg>
                            </span>
                        </H>

                        {/* sub text — Caveat */}
                        <H
                            className="block text-xl mb-5 max-w-lg mx-auto leading-snug"
                            style={{ color: '#666' }}
                        >
                            From first-time cyclists to firefighters, parents to athletes —
                            Plainfuel fits every lifestyle.
                        </H>

                        {/* sticky annotation */}
                        <div className="flex items-center justify-center gap-2">
                            <StickyNote text="50,000+ people & counting 🎉" rotate="-rotate-1" />
                            <DoodleArrow color="#f59e0b" className="w-9 h-5 rotate-12" />
                        </div>
                    </motion.div>

                    {/* ── STATS ── */}
                    <motion.div
                        initial={{ opacity: 0, y: 14 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12 max-w-2xl mx-auto"
                    >
                        {stats.map((s, i) => (
                            <motion.div
                                key={i}
                                whileHover={{ y: -4 }}
                                className="text-center rounded-2xl py-4 px-3 border border-dashed transition-all cursor-default"
                                style={{
                                    background: `${s.accent}08`,
                                    borderColor: `${s.accent}35`,
                                    transform: `rotate(${i % 2 === 0 ? -0.8 : 0.8}deg)`,
                                }}
                            >
                                <H className="text-3xl font-bold block" style={{ color: s.accent }}>{s.value}</H>
                                <H className="text-xs font-bold block mt-0.5" style={{ color: '#888' }}>{s.label}</H>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* ── CATEGORY KEY ── */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.15 }}
                        className="flex flex-wrap justify-center gap-2 mb-8"
                    >
                        {Object.keys(CATEGORIES).map((cat, i) => (
                            <span
                                key={i}
                                style={{
                                    fontFamily: "'Caveat', cursive",
                                    background: `${SLOT_ACCENTS[i % SLOT_ACCENTS.length]}18`,
                                    color: SLOT_ACCENTS[i % SLOT_ACCENTS.length],
                                    border: `1px dashed ${SLOT_ACCENTS[i % SLOT_ACCENTS.length]}50`,
                                    fontSize: '11px',
                                    fontWeight: 700,
                                    padding: '3px 10px',
                                    borderRadius: 999,
                                    transform: `rotate(${i % 2 === 0 ? -1 : 1}deg)`,
                                    display: 'inline-block',
                                }}
                            >
                                {cat}
                            </span>
                        ))}
                        <H className="text-xs self-center ml-1" style={{ color: '#aaa' }}>— images cycle automatically ✦</H>
                    </motion.div>

                    {/* ── IMAGE GRID ── */}
                    <motion.div
                        initial={{ opacity: 0, y: 32 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(5, 1fr)',
                            gridTemplateRows: 'repeat(3, 190px)',
                            gap: 10,
                            width: '100%',
                        }}
                    >
                        <ImageCell imageIndex={slots[0]}  isChanging={flashingSlot === 0}  slotIndex={0}  style={{ gridColumn: '1',   gridRow: '1 / 3' }} />
                        <ImageCell imageIndex={slots[1]}  isChanging={flashingSlot === 1}  slotIndex={1}  style={{ gridColumn: '2',   gridRow: '1' }} />
                        <ImageCell imageIndex={slots[2]}  isChanging={flashingSlot === 2}  slotIndex={2}  style={{ gridColumn: '3',   gridRow: '1' }} />
                        <ImageCell imageIndex={slots[3]}  isChanging={flashingSlot === 3}  slotIndex={3}  style={{ gridColumn: '4',   gridRow: '1 / 3' }} />
                        <ImageCell imageIndex={slots[4]}  isChanging={flashingSlot === 4}  slotIndex={4}  style={{ gridColumn: '5',   gridRow: '1' }} />
                        <ImageCell imageIndex={slots[5]}  isChanging={flashingSlot === 5}  slotIndex={5}  style={{ gridColumn: '2',   gridRow: '2' }} />
                        <ImageCell imageIndex={slots[6]}  isChanging={flashingSlot === 6}  slotIndex={6}  style={{ gridColumn: '3',   gridRow: '2' }} />
                        <ImageCell imageIndex={slots[7]}  isChanging={flashingSlot === 7}  slotIndex={7}  style={{ gridColumn: '5',   gridRow: '2' }} />
                        <ImageCell imageIndex={slots[8]}  isChanging={flashingSlot === 8}  slotIndex={8}  style={{ gridColumn: '1',   gridRow: '3' }} />
                        <ImageCell imageIndex={slots[9]}  isChanging={flashingSlot === 9}  slotIndex={9}  style={{ gridColumn: '2 / 4', gridRow: '3' }} />
                        <ImageCell imageIndex={slots[10]} isChanging={flashingSlot === 10} slotIndex={10} style={{ gridColumn: '4',   gridRow: '3' }} />
                        <ImageCell imageIndex={slots[11]} isChanging={flashingSlot === 11} slotIndex={11} style={{ gridColumn: '5',   gridRow: '3' }} />
                    </motion.div>

                    {/* ── CTA ── */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="mt-14 text-center"
                    >
                        <div className="flex items-center gap-4 mb-7 max-w-xs mx-auto">
                            <WiggleLine color="rgba(34,197,94,0.25)" className="flex-1 h-3" />
                            <H className="text-sm whitespace-nowrap" style={{ color: '#aaa' }}>✦ join the movement ✦</H>
                            <WiggleLine color="rgba(34,197,94,0.25)" className="flex-1 h-3" />
                        </div>

                        <H className="block text-lg mb-5" style={{ color: '#777' }}>
                            Join thousands who fuel smarter 🚀
                        </H>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.97 }}
                                className="relative inline-flex items-center gap-2 px-10 py-4 transition-transform"
                            >
                                <svg className="absolute inset-0 w-full h-full pointer-events-none"
                                    preserveAspectRatio="none" viewBox="0 0 210 56" fill="none" aria-hidden="true">
                                    <path d="M6 10 C58 2,152 2,204 9 S210 22,208 42 S202 54,162 55 S46 56,9 53 S1 44,2 28 S4 16,6 10Z"
                                        fill="#22c55e" />
                                </svg>
                                <H className="relative z-10 text-xl font-bold" style={{ color: '#000' }}>
                                    Start Your Cycle 🚀
                                </H>
                            </motion.button>

                            <div className="flex items-center gap-2">
                                <StickyNote text="no commitment!" rotate="rotate-1" />
                                <DoodleArrow color="#22c55e" className="w-7 h-4 -rotate-12" />
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>
        </>
    );
}