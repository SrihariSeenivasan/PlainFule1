'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { 
    Users, Heart, Microscope, Sparkles, 
    Activity, ShieldCheck, Target, Award,
    Stethoscope, Briefcase, Footprints, Baby,
    GraduationCap, Sun
} from 'lucide-react';
import Image from 'next/image';

/* ── Design Tokens (Glacier Scientific) ── */
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
    glass: 'rgba(255, 255, 255, 0.75)',
    border: 'rgba(0, 0, 0, 0.05)',
};

const FONTS = {
    main: "'Montserrat', sans-serif",
    accent: "'Caveat', cursive",
};

/* ── DATA ── */
const CATEGORIES: Record<string, { src: string; alt: string; icon: any }[]> = {
    'Medical & Health': [
        { src: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800&q=80', alt: 'Doctor', icon: <Stethoscope size={12} /> },
        { src: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=800&q=80', alt: 'Healthcare', icon: <Stethoscope size={12} /> },
        { src: 'https://images.unsplash.com/photo-1532187875605-1838dca89129?w=800&q=80', alt: 'Clinical Researcher', icon: <Microscope size={12} /> },
    ],
    'Active Parents': [
        { src: '/images/people/parents.png', alt: 'Family Nutrition', icon: <Baby size={12} /> },
        { src: 'https://images.unsplash.com/photo-1591333139245-2b4115e2917c?w=800&q=80', alt: 'Parenting Energy', icon: <Baby size={12} /> },
        { src: 'https://images.unsplash.com/photo-1476703993599-0035a21b17a9?w=800&q=80', alt: 'Active Family', icon: <Heart size={12} /> },
    ],
    'Farmer & Worker': [
        { src: '/images/people/field.png', alt: 'Agricultural Specialist', icon: <Sun size={12} /> },
        { src: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=800&q=80', alt: 'Worker Endurance', icon: <Footprints size={12} /> },
        { src: 'https://images.unsplash.com/photo-1533610996843-855b4121404c?w=800&q=80', alt: 'Field Logistics', icon: <Footprints size={12} /> },
    ],
    'Elite Athletes': [
        { src: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80', alt: 'Gym Athlete', icon: <Activity size={12} /> },
        { src: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80', alt: 'Endurance Runner', icon: <Activity size={12} /> },
        { src: 'https://images.unsplash.com/photo-1461897104016-0b3b00b1f082?w=800&q=80', alt: 'Sprinter Peak', icon: <Activity size={12} /> },
    ],
    'Professionals': [
        { src: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&q=80', alt: 'Professional Leader', icon: <Briefcase size={12} /> },
        { src: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&q=80', alt: 'Business Executive', icon: <Briefcase size={12} /> },
        { src: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=800&q=80', alt: 'Mental Focus', icon: <ShieldCheck size={12} /> },
    ],
    'Golden Years': [
        { src: '/images/people/senior.png', alt: 'Active Senior', icon: <Heart size={12} /> },
        { src: 'https://images.unsplash.com/photo-1517070208541-6ddc4d3efbcb?w=800&q=80', alt: 'Senior Vitality', icon: <Users size={12} /> },
        { src: 'https://images.unsplash.com/photo-1447005497901-b3e9ee359928?w=800&q=80', alt: 'Healthy Aging', icon: <Users size={12} /> },
    ],
    'Students & Youth': [
        { src: '/images/people/student.png', alt: 'Mental Alertness', icon: <GraduationCap size={12} /> },
        { src: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&q=80', alt: 'Learning Focus', icon: <GraduationCap size={12} /> },
    ],
    'Wellness Seekers': [
        { src: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80', alt: 'Yoga Practitioner', icon: <Sparkles size={12} /> },
        { src: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80', alt: 'Internal Peace', icon: <Sparkles size={12} /> },
    ],
};

const ALL_IMAGES = Object.entries(CATEGORIES).flatMap(([cat, imgs]) =>
    imgs.map(img => ({ ...img, category: cat }))
);

const SLOT_CATEGORIES = [
    'Medical & Health', 'Active Parents', 'Farmer & Worker', 'Elite Athletes', 'Professionals',
    'Golden Years', 'Students & Youth', 'Wellness Seekers', 'Farmer & Worker', 'Active Parents',
];

const SLOT_ACCENTS = [
    C.leaf, C.gold, C.forest, C.mid, C.gold,
    C.leaf, C.forest, C.mid, C.gold, C.leaf,
];

/* ── COMPONENTS ── */

function ImageCell({ imageIndex, isChanging, slotIndex, style }: any) {
    const img = ALL_IMAGES[imageIndex % ALL_IMAGES.length];
    const accent = SLOT_ACCENTS[slotIndex % SLOT_ACCENTS.length];

    return (
        <div style={{ ...style, position: 'relative' }}>
            <div style={{ 
                position: 'absolute', inset: 0, 
                borderRadius: 24, 
                overflow: 'hidden',
                background: C.offwhite, // Better loading background
                border: `1px solid ${C.white}80`,
                boxShadow: '0 8px 32px rgba(0,0,0,0.04)',
                backdropFilter: 'blur(8px)',
                transition: 'all 0.4s ease'
            }}>
                <AnimatePresence mode="wait">
                    <motion.div
                        key={imageIndex}
                        initial={{ opacity: 0, scale: 1.05 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.6 }}
                        style={{ position: 'absolute', inset: 0 }}
                    >
                        <Image 
                            src={img.src} 
                            alt={img.alt} 
                            fill 
                            style={{ objectFit: 'cover' }} 
                            unoptimized={true} // Bypasses slow processing during dev
                            priority={slotIndex < 3} // Priority for top row
                        />
                        <div style={{
                            position: 'absolute', inset: 0,
                            background: `linear-gradient(to top, ${C.ink}40 0%, transparent 60%)`,
                        }} />
                    </motion.div>
                </AnimatePresence>

                <AnimatePresence>
                    {isChanging && (
                        <motion.div
                            initial={{ opacity: 0.4 }} animate={{ opacity: 0 }} exit={{ opacity: 0 }}
                            transition={{ duration: 0.7 }}
                            style={{ position: 'absolute', inset: 0, background: `${accent}20`, zIndex: 8 }}
                        />
                    )}
                </AnimatePresence>
            </div>

            {/* Premium Category Badge */}
            <div style={{ position: 'absolute', top: 12, left: 12, zIndex: 10 }}>
                <div style={{ 
                    display: 'flex', alignItems: 'center', gap: 6,
                    padding: '4px 10px', borderRadius: 100,
                    background: C.white, 
                    border: `1px solid ${C.border}`,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
                    backdropFilter: 'blur(10px)'
                }}>
                    <span style={{ color: accent, display: 'flex' }}>{img.icon}</span>
                    <span style={{ fontFamily: FONTS.main, fontSize: 8, fontWeight: 900, textTransform: 'uppercase', color: C.forest, letterSpacing: '0.1em' }}>{img.category}</span>
                </div>
            </div>
            
            {/* Subtle "Little Doodle" accent */}
            <div style={{ position: 'absolute', bottom: 12, left: 12, zIndex: 10, opacity: 0.6 }}>
                 <svg width="24" height="6" viewBox="0 0 24 6" fill="none">
                    <path d="M2 4 C8 2, 16 2, 22 4" stroke={accent} strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
                 </svg>
            </div>
        </div>
    );
}

export default function PeopleSection() {
    const containerRef = useRef(null);
    const inView = useInView(containerRef, { once: true });
    
    // Image Cycling States
    const SLOT_COUNT = 10;
    const [slots, setSlots] = useState<number[]>(() => 
        // Initial setup ensuring no duplicates if possible
        Array.from({ length: SLOT_COUNT }, (_, i) => {
             const cat = SLOT_CATEGORIES[i];
             const catImgs = ALL_IMAGES.map((img, idx) => ({img, idx})).filter(o => o.img.category === cat);
             // Pick a random one from this category
             return catImgs[i % catImgs.length].idx;
        })
    );
    const [flashingSlot, setFlashingSlot] = useState<number | null>(null);

    useEffect(() => {
        const cycle = () => {
            const delay = 5000 + Math.random() * 3000; // Slower cycle for better stability
            const timeout = setTimeout(() => {
                setSlots(prev => {
                    const idx = Math.floor(Math.random() * SLOT_COUNT);
                    const next = [...prev];
                    const cat = SLOT_CATEGORIES[idx];
                    const catImgs = ALL_IMAGES.map((img, i) => ({img, i})).filter(o => o.img.category === cat);
                    
                    // Filter out any image already shown in ANY slot
                    const currentlyShown = new Set(prev);
                    const uniqueOptions = catImgs.filter(o => !currentlyShown.has(o.i));
                    
                    // If we have unique options, take one. Else take any from category that isn't the SAME as this slot.
                    let targetImg;
                    if (uniqueOptions.length > 0) {
                        targetImg = uniqueOptions[Math.floor(Math.random() * uniqueOptions.length)];
                    } else {
                        targetImg = catImgs.length > 1 ? catImgs.find(o => o.i !== prev[idx]) : catImgs[0];
                    }

                    if (targetImg) {
                        next[idx] = targetImg.i;
                        setFlashingSlot(idx);
                        setTimeout(() => setFlashingSlot(null), 800);
                    }
                    return next;
                });
                cycle();
            }, delay);
            return () => clearTimeout(timeout);
        };
        cycle();
    }, []);

    return (
        <section ref={containerRef} style={{ background: C.white, padding: '160px 0', position: 'relative', overflow: 'hidden' }}>
            
            <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 40px', position: 'relative', zIndex: 1 }}>
                
                <div style={{ textAlign: 'center', marginBottom: 80 }}>
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={inView ? { opacity: 1, scale: 1 } : {}} transition={{ duration: 0.6 }} style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '8px 20px', borderRadius: 100, background: C.offwhite, border: `1px solid ${C.border}`, marginBottom: 24 }}>
                        <Users size={14} color={C.gold} />
                        <span style={{ fontFamily: FONTS.main, fontSize: 10, fontWeight: 900, textTransform: 'uppercase', color: C.forest, letterSpacing: '0.2em' }}>Universal Adoption</span>
                    </motion.div>
                    <motion.h2 initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.1 }} style={{ fontFamily: FONTS.main, fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 900, color: C.ink, margin: 0, letterSpacing: '-0.04em' }}>
                        One Scoop. For <span style={{ position: 'relative', display: 'inline-block' }}>
                            Everyone.
                            <svg viewBox="0 0 160 12" fill="none" style={{ position: 'absolute', bottom: -8, left: 0, width: '100%', opacity: 0.3 }}>
                                <path d="M4 8 C40 2, 120 2, 156 8" stroke={C.leaf} strokeWidth="3" strokeLinecap="round" />
                            </svg>
                        </span>
                    </motion.h2>
                    <motion.p initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.2 }} style={{ fontFamily: FONTS.main, fontSize: 18, color: C.silver, marginTop: 24, maxWidth: 800, margin: '24px auto 0' }}>From clinicians to farmers, parents to elite students—PlainFuel is designed to bridges the systemic nutrient gap in every field of life.</motion.p>
                </div>

                <div className="discovery-grid">
                    <ImageCell imageIndex={slots[0]} isChanging={flashingSlot === 0} slotIndex={0} style={{ gridColumn: '1 / 3', gridRow: '1 / 3' }} />
                    <ImageCell imageIndex={slots[1]} isChanging={flashingSlot === 1} slotIndex={1} style={{ gridColumn: '3', gridRow: '1' }} />
                    <ImageCell imageIndex={slots[2]} isChanging={flashingSlot === 2} slotIndex={2} style={{ gridColumn: '4', gridRow: '1' }} />
                    <ImageCell imageIndex={slots[3]} isChanging={flashingSlot === 3} slotIndex={3} style={{ gridColumn: '5', gridRow: '1 / 3' }} />
                    <ImageCell imageIndex={slots[4]} isChanging={flashingSlot === 4} slotIndex={4} style={{ gridColumn: '3', gridRow: '2' }} />
                    <ImageCell imageIndex={slots[5]} isChanging={flashingSlot === 5} slotIndex={5} style={{ gridColumn: '4', gridRow: '2' }} />
                    <ImageCell imageIndex={slots[6]} isChanging={flashingSlot === 6} slotIndex={6} style={{ gridColumn: '1', gridRow: '3' }} />
                    <ImageCell imageIndex={slots[7]} isChanging={flashingSlot === 7} slotIndex={7} style={{ gridColumn: '2', gridRow: '3' }} />
                    <ImageCell imageIndex={slots[8]} isChanging={flashingSlot === 8} slotIndex={8} style={{ gridColumn: '3 / 5', gridRow: '3' }} />
                    <ImageCell imageIndex={slots[9]} isChanging={flashingSlot === 9} slotIndex={9} style={{ gridColumn: '5', gridRow: '3' }} />
                </div>

                <div style={{ marginTop: 80, display: 'flex', justifyContent: 'center', gap: 64, flexWrap: 'wrap' }}>
                     {[
                        { label: 'Clinically Validated', icon: <Microscope size={18} /> },
                        { label: 'Widespread Community Trust', icon: <Heart size={18} /> },
                        { label: 'Adaptable Daily Habit', icon: <Award size={18} /> }
                     ].map((t, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, color: C.forest, fontFamily: FONTS.main, fontSize: 12, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                            <span style={{ color: C.gold }}>{t.icon}</span>
                            {t.label}
                        </div>
                     ))}
                </div>

            </div>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&family=Caveat:wght@600;700&display=swap');
                .discovery-grid {
                    display: grid;
                    grid-template-columns: repeat(5, 1fr);
                    grid-template-rows: repeat(3, 180px);
                    gap: 16px;
                }
                @media (max-width: 1024px) {
                    .discovery-grid {
                        grid-template-columns: repeat(2, 1fr);
                        grid-template-rows: auto;
                    }
                    .discovery-grid > div {
                        grid-column: span 1 !important;
                        grid-row: span 1 !important;
                        aspect-ratio: 1/1;
                    }
                }
            `}</style>
        </section>
    );
}