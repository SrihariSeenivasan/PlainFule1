'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/* ─────────────────────────────────────
   22 images — uses Unsplash for demo.
   Replace these URLs with your own images.
───────────────────────────────────── */
const ALL_IMAGES = [
    { src: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600&q=80', alt: 'Gym workout' },
    { src: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80', alt: 'Running' },
    { src: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600&q=80', alt: 'Healthy food' },
    { src: 'https://images.unsplash.com/photo-1594737625785-a6cbdabd333c?w=600&q=80', alt: 'Cycling' },
    { src: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&q=80', alt: 'Yoga' },
    { src: 'https://images.unsplash.com/photo-1547919307-1ecb10702e6f?w=600&q=80', alt: 'Family meal' },
    { src: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=80', alt: 'Weight training' },
    { src: 'https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=600&q=80', alt: 'Hiking' },
    { src: 'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=600&q=80', alt: 'Smoothie' },
    { src: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&q=80', alt: 'Meditation' },
    { src: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=600&q=80', alt: 'Boxing' },
    { src: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=600&q=80', alt: 'Morning run' },
    { src: 'https://images.unsplash.com/photo-1607962837359-5e7e89f86776?w=600&q=80', alt: 'Nutrition' },
    { src: 'https://images.unsplash.com/photo-1599058917765-a780eda07a3e?w=600&q=80', alt: 'Stretching' },
    { src: 'https://images.unsplash.com/photo-1584466977773-e625c37cdd50?w=600&q=80', alt: 'Swimming' },
    { src: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=600&q=80', alt: 'Group fitness' },
    { src: 'https://images.unsplash.com/photo-1593079831268-3381b0db4a77?w=600&q=80', alt: 'Meal prep' },
    { src: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=600&q=80', alt: 'Crossfit' },
    { src: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&q=80', alt: 'Dance workout' },
    { src: 'https://images.unsplash.com/photo-1577221084712-45b0445d2b00?w=600&q=80', alt: 'Outdoor workout' },
    { src: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=600&q=80', alt: 'Supplement' },
    { src: 'https://images.unsplash.com/photo-1548690312-e3b507d8c110?w=600&q=80', alt: 'Athlete' },
];

/* ─────────────────────────────────────
   GRID LAYOUT — 11 cells like reference
   Each cell has a fixed slot index 0–10
───────────────────────────────────── */

const SLOT_COUNT = 12;

/* ─────────────────────────────────────
   SINGLE IMAGE CELL
───────────────────────────────────── */
interface CellProps {
    imageIndex: number;
    isChanging: boolean;
    style: React.CSSProperties;
}

function ImageCell({ imageIndex, isChanging, style }: CellProps) {
    const img = ALL_IMAGES[imageIndex % ALL_IMAGES.length];

    return (
        <div
            style={{
                ...style,
                position: 'relative',
                overflow: 'hidden',
                borderRadius: 12,
                background: '#e8e8e8',
            }}
        >
            <AnimatePresence mode="wait">
                <motion.div
                    key={imageIndex}
                    initial={{ opacity: 0, scale: 1.08, filter: 'blur(12px)' }}
                    animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, scale: 0.96, filter: 'blur(8px)' }}
                    transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                    style={{ position: 'absolute', inset: 0 }}
                >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={img.src}
                        alt={img.alt}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    />
                    {/* subtle dark overlay */}
                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.04)' }} />
                </motion.div>
            </AnimatePresence>

            {/* Flash highlight when changing */}
            <AnimatePresence>
                {isChanging && (
                    <motion.div
                        initial={{ opacity: 0.5 }}
                        animate={{ opacity: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.6 }}
                        style={{
                            position: 'absolute',
                            inset: 0,
                            background: 'rgba(34,197,94,0.1)',
                            borderRadius: 12,
                            pointerEvents: 'none',
                            zIndex: 10,
                        }}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}

/* ─────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────── */
export default function PeopleSection() {
    // Each slot stores which image index it's currently showing
    const [slots, setSlots] = useState<number[]>(() =>
        Array.from({ length: SLOT_COUNT }, (_, i) => i % ALL_IMAGES.length)
    );

    // Track which slot is currently flashing
    const [flashingSlot, setFlashingSlot] = useState<number | null>(null);

    // Pool of image indices not currently shown
    const usedRef = useRef<Set<number>>(new Set());

    useEffect(() => {
        // Initialize used set
        usedRef.current = new Set(slots);

        const getNextImage = (currentSlots: number[]): number => {
            const used = new Set(currentSlots);
            const unused = Array.from({ length: ALL_IMAGES.length }, (_, i) => i).filter(
                (i) => !used.has(i)
            );
            if (unused.length > 0) {
                return unused[Math.floor(Math.random() * unused.length)];
            }
            // All images used — pick least recently used
            return Math.floor(Math.random() * ALL_IMAGES.length);
        };

        // Cycle: every 1.8–3.2s, swap a random slot with a new image
        let timeoutId: ReturnType<typeof setTimeout>;

        const cycle = () => {
            const delay = 1800 + Math.random() * 1400; // 1.8s – 3.2s

            timeoutId = setTimeout(() => {
                setSlots((prev) => {
                    const slotIndex = Math.floor(Math.random() * SLOT_COUNT);
                    const nextImage = getNextImage(prev);
                    const next = [...prev];
                    next[slotIndex] = nextImage;
                    setFlashingSlot(slotIndex);
                    setTimeout(() => setFlashingSlot(null), 700);
                    return next;
                });
                cycle(); // schedule next
            }, delay);
        };

        cycle();
        return () => clearTimeout(timeoutId);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <section
            style={{
                background: '#F5F5F5',
                padding: '80px 40px',
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}
        >
            {/* Heading */}
            <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                style={{ textAlign: 'center', marginBottom: 48 }}
            >
                <p
                    style={{
                        color: '#22c55e',
                        fontSize: '0.7rem',
                        fontWeight: 800,
                        letterSpacing: '0.35em',
                        textTransform: 'uppercase',
                        marginBottom: 16,
                    }}
                >
                    Real People · Real Results
                </p>
                <h2
                    style={{
                        fontFamily: "'Playfair Display', Georgia, serif",
                        fontSize: 'clamp(2.2rem, 5vw, 3.8rem)',
                        fontWeight: 900,
                        color: '#000',
                        lineHeight: 1.08,
                        margin: 0,
                    }}
                >
                    Put health in{' '}
                    <span style={{ color: '#22c55e', fontStyle: 'italic' }}>your hands.</span>
                </h2>
                <p
                    style={{
                        color: 'rgba(0,0,0,0.5)',
                        fontSize: '1rem',
                        marginTop: 16,
                        maxWidth: 480,
                        margin: '16px auto 0',
                        lineHeight: 1.6,
                    }}
                >
                    From first-time cyclists to firefighters, parents to athletes — Plainfuel
                    fits every lifestyle.
                </p>
            </motion.div>

            {/* Grid */}
            <motion.div
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(5, 1fr)',
                    gridTemplateRows: 'repeat(3, 220px)',
                    gap: 10,
                    width: '100%',
                    maxWidth: 1200,
                }}
            >
                {/* Cell 0 — col 1, rows 1-2 (tall) */}
                <ImageCell
                    imageIndex={slots[0]}
                    isChanging={flashingSlot === 0}
                    style={{ gridColumn: '1', gridRow: '1 / 3' }}
                />

                {/* Cell 1 — col 2, row 1 */}
                <ImageCell
                    imageIndex={slots[1]}
                    isChanging={flashingSlot === 1}
                    style={{ gridColumn: '2', gridRow: '1' }}
                />

                {/* Cell 2 — col 3, row 1 */}
                <ImageCell
                    imageIndex={slots[2]}
                    isChanging={flashingSlot === 2}
                    style={{ gridColumn: '3', gridRow: '1' }}
                />

                {/* Cell 3 — col 4, rows 1-2 (tall) */}
                <ImageCell
                    imageIndex={slots[3]}
                    isChanging={flashingSlot === 3}
                    style={{ gridColumn: '4', gridRow: '1 / 3' }}
                />

                {/* Cell 4 — col 5, row 1 */}
                <ImageCell
                    imageIndex={slots[4]}
                    isChanging={flashingSlot === 4}
                    style={{ gridColumn: '5', gridRow: '1' }}
                />

                {/* Cell 5 — col 2, row 2 */}
                <ImageCell
                    imageIndex={slots[5]}
                    isChanging={flashingSlot === 5}
                    style={{ gridColumn: '2', gridRow: '2' }}
                />

                {/* Cell 6 — col 3, row 2 */}
                <ImageCell
                    imageIndex={slots[6]}
                    isChanging={flashingSlot === 6}
                    style={{ gridColumn: '3', gridRow: '2' }}
                />

                {/* Cell 7 — col 5, row 2 */}
                <ImageCell
                    imageIndex={slots[7]}
                    isChanging={flashingSlot === 7}
                    style={{ gridColumn: '5', gridRow: '2' }}
                />

                {/* Cell 8 — col 1, row 3 */}
                <ImageCell
                    imageIndex={slots[8]}
                    isChanging={flashingSlot === 8}
                    style={{ gridColumn: '1', gridRow: '3' }}
                />

                {/* Cell 9 — col 2-3, row 3 (wide) */}
                <ImageCell
                    imageIndex={slots[9]}
                    isChanging={flashingSlot === 9}
                    style={{ gridColumn: '2 / 4', gridRow: '3' }}
                />

                {/* Cell 10 — col 4, row 3 */}
                <ImageCell
                    imageIndex={slots[10]}
                    isChanging={flashingSlot === 10}
                    style={{ gridColumn: '4', gridRow: '3' }}
                />

                {/* Cell 11 — col 5, row 3 */}
                <ImageCell
                    imageIndex={slots[11]}
                    isChanging={flashingSlot === 11}
                    style={{ gridColumn: '5', gridRow: '3' }}
                />
            </motion.div>

            {/* Bottom CTA */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                style={{ marginTop: 48, textAlign: 'center' }}
            >
                <p
                    style={{
                        color: 'rgba(0,0,0,0.45)',
                        fontSize: '0.8rem',
                        letterSpacing: '0.2em',
                        textTransform: 'uppercase',
                        marginBottom: 20,
                    }}
                >
                    Join thousands who fuel smarter
                </p>
                <motion.button
                    whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(34,197,94,0.4)' }}
                    whileTap={{ scale: 0.97 }}
                    style={{
                        background: '#22c55e',
                        color: '#000',
                        border: 'none',
                        borderRadius: 999,
                        padding: '14px 36px',
                        fontSize: '0.85rem',
                        fontWeight: 900,
                        letterSpacing: '0.2em',
                        textTransform: 'uppercase',
                        cursor: 'pointer',
                    }}
                >
                    Start Your Cycle
                </motion.button>
            </motion.div>
        </section>
    );
}