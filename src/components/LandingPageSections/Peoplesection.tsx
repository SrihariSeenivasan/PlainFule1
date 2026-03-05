'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StarDoodle, Sparkle, CircleDoodle as DoodleCircle, WiggleLine } from '@/components/Elements/SvgDoodles';

/* ── IMAGES grouped by category ── */
const CATEGORIES: Record<string, { src: string; alt: string }[]> = {
    'Doctors 👨‍⚕️': [
        { src: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=600&q=80', alt: 'Doctor consulting' },
        { src: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=600&q=80', alt: 'Healthcare professional' },
        { src: 'https://images.unsplash.com/photo-1666214280557-f1b5022eb634?w=600&q=80', alt: 'Medical consultation' },
        { src: 'https://images.unsplash.com/photo-1651008376811-b90baee60c1f?w=600&q=80', alt: 'Doctor patient care' },
    ],
    'Gym 💪': [
        { src: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600&q=80', alt: 'Gym workout' },
        { src: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=80', alt: 'Weight training' },
        { src: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&q=80', alt: 'Boxing' },
        { src: 'https://images.unsplash.com/photo-1581009146145-b5ef050c149a?w=600&q=80', alt: 'Crossfit' },
    ],
    'Yoga 🧘': [
        { src: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&q=80', alt: 'Yoga practice' },
        { src: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&q=80', alt: 'Meditation' },
        { src: 'https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?w=600&q=80', alt: 'Stretching' },
        { src: 'https://images.unsplash.com/photo-1545389336-cf090694435e?w=600&q=80', alt: 'Wellness' },
    ],
    'Parents 👨‍👩‍👧': [
        { src: 'https://images.unsplash.com/photo-1597245363058-7e2e0e8bfc01?w=600&q=80', alt: 'Family time' },
        { src: 'https://images.unsplash.com/photo-1602526432604-029a709e131c?w=600&q=80', alt: 'Parenting' },
        { src: 'https://images.unsplash.com/photo-1476703993599-0035a21b17a9?w=600&q=80', alt: 'Family activity' },
        { src: 'https://images.unsplash.com/photo-1491013516836-7db643ee125a?w=600&q=80', alt: 'Parent child bond' },
    ],
    'Couples 💑': [
        { src: 'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?w=600&q=80', alt: 'Couple wellness' },
        { src: 'https://images.unsplash.com/photo-1609852234838-147db6815968?w=600&q=80', alt: 'Couple exercising' },
        { src: 'https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=600&q=80', alt: 'Couple hiking' },
        { src: 'https://images.unsplash.com/photo-1522163182402-834f871fd851?w=600&q=80', alt: 'Couple portrait' },
    ],
    'Business 💼': [
        { src: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=600&q=80', alt: 'Business professional' },
        { src: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&q=80', alt: 'Business meeting' },
        { src: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=600&q=80', alt: 'Entrepreneur' },
        { src: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&q=80', alt: 'Corporate team' },
    ],
    'Office 🖥️': [
        { src: 'https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?w=600&q=80', alt: 'Office worker' },
        { src: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=600&q=80', alt: 'Desk work' },
        { src: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=600&q=80', alt: 'Computer work' },
        { src: 'https://images.unsplash.com/photo-1568992687947-868a62a9f521?w=600&q=80', alt: 'Office environment' },
    ],
    'Runners 🏃': [
        { src: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80', alt: 'Running' },
        { src: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=600&q=80', alt: 'Morning run' },
        { src: 'https://images.unsplash.com/photo-1461897104016-0b3b00b1f082?w=600&q=80', alt: 'Sprint' },
        { src: 'https://images.unsplash.com/photo-1594911772125-07fc7a2d8d9f?w=600&q=80', alt: 'Trail running' },
    ],
    'Seniors 👴': [
        { src: 'https://images.unsplash.com/photo-1447005497901-b3e9ee359928?w=600&q=80', alt: 'Senior wellness' },
        { src: 'https://images.unsplash.com/photo-1556889882-733f5e428b66?w=600&q=80', alt: 'Active seniors' },
        { src: 'https://images.unsplash.com/photo-1517070208541-6ddc4d3efbcb?w=600&q=80', alt: 'Senior health' },
        { src: 'https://images.unsplash.com/photo-1475503572774-15a45e5d60b9?w=600&q=80', alt: 'Older people' },
    ],
    'Patients 🏥': [
        { src: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=600&q=80', alt: 'Healthcare' },
        { src: 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=600&q=80', alt: 'Recovery' },
        { src: 'https://images.unsplash.com/photo-1581595219315-a187dd40c322?w=600&q=80', alt: 'Treatment' },
        { src: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&q=80', alt: 'Medical care' },
    ],
    'Everyday 🌟': [
        { src: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600&q=80', alt: 'Nutrition' },
        { src: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=600&q=80', alt: 'Healthy living' },
        { src: 'https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?w=600&q=80', alt: 'Daily wellness' },
        { src: 'https://images.unsplash.com/photo-1493770348161-369560ae357d?w=600&q=80', alt: 'Lifestyle' },
    ],
};

const ALL_IMAGES = Object.entries(CATEGORIES).flatMap(([cat, imgs]) =>
    imgs.map(img => ({ ...img, category: cat }))
);

const SLOT_CATEGORIES = [
    'Doctors 👨‍⚕️', 'Gym 💪', 'Parents 👨‍👩‍👧', 'Couples 💑', 'Yoga 🧘',
    'Business 💼', 'Gym 💪', 'Runners 🏃', 'Office 🖥️', 'Yoga 🧘',
    'Seniors 👴', 'Patients 🏥',
];

const SLOT_ACCENTS = [
    '#ef4444', '#22c55e', '#f59e0b',
    '#ec4899', '#8b5cf6', '#3b82f6',
    '#22c55e', '#f59e0b', '#06b6d4',
    '#8b5cf6', '#a16207', '#06b6d4',
];

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

function DoodleArrow({ color = '#f59e0b', className = '' }: { color?: string; className?: string }) {
    return (
        <svg viewBox="0 0 40 24" fill="none" className={className} aria-hidden="true">
            <path d="M2 12 C12 4,26 4,36 11" stroke={color} strokeWidth="2" strokeLinecap="round" fill="none" />
            <path d="M28 5 L37 12 L28 18" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>
    );
}

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
        <span
            className={`inline-block font-bold px-3 py-1 rounded shadow-md ${rotate} select-none whitespace-nowrap border border-yellow-300/60`}
            style={{ fontFamily: "'Caveat', cursive", background: '#fef08a', color: '#1a1a1a', fontSize: '22px', fontWeight: 800 }}>
            {text}
        </span>
    );
}

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
                        <div style={{
                            position: 'absolute', inset: 0,
                            background: 'linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, transparent 40%, transparent 60%, rgba(0,0,0,0.25) 100%)',
                        }} />
                    </motion.div>
                </AnimatePresence>

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

            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <DoodleBorderOverlay color={accent} />
            </div>

            {/* category label — bigger and bolder */}
            <div className="absolute top-2 left-2 z-20">
                <span
                    style={{
                        fontFamily: "'Caveat', cursive",
                        background: accent,
                        color: '#1a1a1a',
                        fontSize: '14px',
                        fontWeight: 800,
                        padding: '3px 10px',
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

            <div className="absolute bottom-2 left-2 right-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <H style={{ fontSize: '13px', fontWeight: 700, color: 'rgba(255,255,255,0.9)' }}>{img.alt}</H>
            </div>
        </div>
    );
}

const stats = [
    { value: '50K+', label: 'active users',  accent: '#15803d' },
    { value: '4.9★', label: 'avg rating',    accent: '#f59e0b' },
    { value: '21',   label: 'ingredients',   accent: '#8b5cf6' },
    { value: '0',    label: 'fillers added', accent: '#ec4899' },
];

const SLOT_COUNT = 12;

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
            <style>{`@import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400;700;900&display=swap');`}</style>

            <section className="relative overflow-hidden bg-[var(--background)] py-20 md:py-28">

                <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.03]" aria-hidden="true">
                    <defs>
                        <pattern id="dotgrid" x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse">
                            <circle cx="2" cy="2" r="1.5" fill="#15803d" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#dotgrid)" />
                </svg>

                <Sparkle  color="#15803d" className="absolute top-10 left-[2%] w-7 h-7 opacity-20 rotate-12 pointer-events-none" />
                <DoodleCircle color="#f59e0b" className="absolute top-24 right-[2%] w-12 h-12 opacity-15 -rotate-6 pointer-events-none" />
                <Sparkle  color="#8b5cf6" className="absolute bottom-24 left-[3%] w-5 h-5 opacity-15 pointer-events-none" />
                <DoodleCircle color="#15803d" className="absolute bottom-10 right-[4%] w-9 h-9 opacity-10 rotate-3 pointer-events-none" />

                <div className="relative max-w-screen-xl mx-auto px-6 md:px-12 lg:px-16">

                    {/* ── HEADING ── */}
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                        className="text-center mb-12"
                    >
                        {/* eyebrow — bigger */}
                        <div className="flex items-center justify-center gap-3 mb-4">
                            <StarDoodle size={18} color="#15803d" />
                            <H style={{ fontSize: '20px', fontWeight: 800, color: '#15803d' }}>
                                Real People · Real Results
                            </H>
                            <StarDoodle size={18} color="#15803d" />
                        </div>

                        {/* main heading */}
                        <H
                            className="block font-bold leading-tight mb-4"
                            style={{ fontSize: 'clamp(2.8rem, 6vw, 5rem)', color: '#0a0a0a', lineHeight: 1.05 }}
                        >
                            Put health in{' '}
                            <span className="relative inline-block">
                                <span style={{ color: '#15803d', fontStyle: 'italic' }}>your hands.</span>
                                <svg viewBox="0 0 280 14" fill="none" className="absolute -bottom-1 left-0 w-full" aria-hidden="true">
                                    <path d="M2 8 C55 2,150 12,220 7 S265 2,278 8"
                                        stroke="#15803d" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.45" />
                                    <path d="M10 11 C70 7,160 13,240 10"
                                        stroke="#15803d" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.2" />
                                </svg>
                            </span>
                        </H>

                        {/* subtext — bigger, black, bold */}
                        <H
                            className="block font-bold mb-6 max-w-xl mx-auto leading-snug"
                            style={{ fontSize: 'clamp(1.25rem, 2.5vw, 1.6rem)', color: '#1a1a1a' }}
                        >
                            From first-time cyclists to firefighters, parents to athletes —
                            Plainfuel fits every lifestyle.
                        </H>

                        {/* sticky note — bigger */}
                        <div className="flex items-center justify-center gap-2">
                            <StickyNote text="50,000+ people & counting 🎉" rotate="-rotate-1" />
                            <DoodleArrow color="#f59e0b" className="w-10 h-6 rotate-12" />
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
                                className="text-center rounded-2xl py-5 px-3 border border-dashed transition-all cursor-default"
                                style={{
                                    background: `${s.accent}08`,
                                    borderColor: `${s.accent}35`,
                                    transform: `rotate(${i % 2 === 0 ? -0.8 : 0.8}deg)`,
                                }}
                            >
                                {/* stat value — big */}
                                <H style={{ fontSize: '2.4rem', fontWeight: 900, color: s.accent, display: 'block', lineHeight: 1 }}>{s.value}</H>
                                {/* stat label — bigger and dark */}
                                <H style={{ fontSize: '16px', fontWeight: 800, color: '#1a1a1a', display: 'block', marginTop: '6px' }}>{s.label}</H>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* ── CATEGORY KEY — bigger pills ── */}
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
                                    border: `1.5px dashed ${SLOT_ACCENTS[i % SLOT_ACCENTS.length]}70`,
                                    fontSize: '18px',
                                    fontWeight: 800,
                                    padding: '4px 14px',
                                    borderRadius: 999,
                                    transform: `rotate(${i % 2 === 0 ? -1 : 1}deg)`,
                                    display: 'inline-block',
                                }}
                            >
                                {cat}
                            </span>
                        ))}
                       
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
                            <WiggleLine color="rgba(21,128,61,0.25)" className="flex-1 h-3" />
                            <H style={{ fontSize: '25px', fontWeight: 700, color: '#333', whiteSpace: 'nowrap' }}>✦ join the movement ✦</H>
                            <WiggleLine color="rgba(21,128,61,0.25)" className="flex-1 h-3" />
                        </div>

                        {/* CTA subtext — bigger and dark */}
                        <H style={{ display: 'block', fontSize: '1.35rem', fontWeight: 800, color: '#1a1a1a', marginBottom: '20px' }}>
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
                                        fill="#15803d" />
                                </svg>
                                <H style={{ position: 'relative', zIndex: 10, fontSize: '2rem', fontWeight: 900, color: '#fff' }}>
                                    Start Your Cycle 🚀
                                </H>
                            </motion.button>

                            <div className="flex items-center gap-2">
                                <StickyNote text="no commitment!" rotate="rotate-1" />
                                <DoodleArrow color="#15803d" className="w-7 h-4 -rotate-12" />
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>
        </>
    );
}