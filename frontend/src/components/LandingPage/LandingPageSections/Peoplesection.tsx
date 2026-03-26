'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import {
    Users, Heart, Microscope, Sparkles,
    Activity, ShieldCheck, Award,
    Stethoscope, Briefcase, Footprints, Baby,
    GraduationCap, Sun
} from 'lucide-react';
import Image from 'next/image';

/* ── DESIGN TOKENS ── */
const C = {
    forest: '#0a3d1f',
    deep: '#071a0d',
    mid: '#14532d',
    leaf: '#16a34a',
    ink: '#070d08',
    white: '#ffffff',
    offwhite: '#fafafa',
    gold: '#854d0e',
    silver: '#64748b',
    border: 'rgba(0, 0, 0, 0.05)',
};

const FONTS = {
    main: "'Montserrat', sans-serif",
};

/* ── FIXED CATEGORY SYSTEM ── */
const CATEGORIES = {
    'High Physical Demand': [
        {
            id: 'farmer-1',
            src: '/images/people/field.png',
            alt: 'Farmer working',
            title: 'Farmers & Workers',
            description: 'Energy for long physical labor',
            icon: <Sun size={12} />,
        },
        {
            id: 'athlete-1',
            src: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80',
            alt: 'Athlete training',
            title: 'Athletes',
            description: 'Endurance and recovery',
            icon: <Activity size={12} />,
        },
    ],

    'Mental Performance': [
        {
            id: 'student-1',
            src: '/images/people/student.png',
            alt: 'Student studying',
            title: 'Students',
            description: 'Focus and memory',
            icon: <GraduationCap size={12} />,
        },
        {
            id: 'professional-1',
            src: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&q=80',
            alt: 'Professional working',
            title: 'Professionals',
            description: 'Clarity and productivity',
            icon: <Briefcase size={12} />,
        },
    ],

    'Family & Growth': [
        {
            id: 'parent-1',
            src: '/images/people/parents.png',
            alt: 'Parents',
            title: 'Parents',
            description: 'Balanced nutrition',
            icon: <Baby size={12} />,
        },
        {
            id: 'child-1',
            src: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&q=80',
            alt: 'Child health',
            title: 'Children',
            description: 'Growth & immunity',
            icon: <Baby size={12} />,
        },
    ],

    'Aging & Longevity': [
        {
            id: 'senior-1',
            src: '/images/people/senior.png',
            alt: 'Senior',
            title: 'Seniors',
            description: 'Healthy aging',
            icon: <Heart size={12} />,
        },
    ],

    'Recovery & Low Energy': [
        {
            id: 'recovery-1',
            src: 'https://images.unsplash.com/photo-1584515933487-779824d29309?w=800&q=80',
            alt: 'Recovery',
            title: 'Recovery',
            description: 'Rebuild strength',
            icon: <ShieldCheck size={12} />,
        },
    ],

    'General Daily Nutrition': [
        {
            id: 'adult-1',
            src: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&q=80',
            alt: 'Adult',
            title: 'Everyday Adults',
            description: 'Daily nutrition support',
            icon: <Users size={12} />,
        },
    ],

    'Women’s Health': [
        {
            id: 'women-1',
            src: '/images/people/women.png',
            alt: 'Woman',
            title: 'Women',
            description: 'Hormonal & iron support',
            icon: <Heart size={12} />,
        },
    ],
};

/* ── FLATTEN ── */
const ALL_IMAGES = Object.entries(CATEGORIES).flatMap(([cat, imgs]) =>
    imgs.map(img => ({ ...img, category: cat }))
);

/* ── SLOT CONFIG ── */
const SLOT_COUNT = 10;

const SLOT_CATEGORIES = [
    'High Physical Demand',
    'Mental Performance',
    'Family & Growth',
    'Aging & Longevity',
    'Recovery & Low Energy',
    'General Daily Nutrition',
    'Women’s Health',
    'Mental Performance',
    'High Physical Demand',
    'General Daily Nutrition',
];

/* ── COMPONENT ── */

function ImageCell({ image, isChanging, style }: any) {
    return (
        <div style={{ ...style, position: 'relative' }}>
            <div style={{
                position: 'absolute',
                inset: 0,
                borderRadius: 24,
                overflow: 'hidden',
                background: C.offwhite,
            }}>
                <AnimatePresence mode="wait">
                    <motion.div
                        key={image.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        style={{ position: 'absolute', inset: 0 }}
                    >
                        <Image
                            src={image.src}
                            alt={image.alt}
                            fill
                            style={{ objectFit: 'cover' }}
                            unoptimized
                        />
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Badge */}
            <div style={{ position: 'absolute', top: 10, left: 10 }}>
                <div style={{
                    padding: '4px 10px',
                    borderRadius: 100,
                    background: C.white,
                    fontSize: 10,
                    fontWeight: 800
                }}>
                    {image.category}
                </div>
            </div>
        </div>
    );
}

/* ── MAIN ── */

export default function PeopleSection() {
    const containerRef = useRef(null);
    const inView = useInView(containerRef, { once: true });

    const [slots, setSlots] = useState<any[]>(() =>
        SLOT_CATEGORIES.map(cat => {
            const imgs = ALL_IMAGES.filter(i => i.category === cat);
            return imgs[0]; // Avoid Math.random() during initial render for hydration sync
        })
    );

    useEffect(() => {
        const interval = setInterval(() => {
            setSlots(prev => {
                const next = [...prev];
                const idx = Math.floor(Math.random() * SLOT_COUNT);
                const cat = SLOT_CATEGORIES[idx];
                const imgs = ALL_IMAGES.filter(i => i.category === cat);

                next[idx] = imgs[Math.floor(Math.random() * imgs.length)];
                return next;
            });
        }, 4000);

        return () => clearInterval(interval);
    }, []);

    return (
        <section ref={containerRef} style={{ padding: '120px 0' }}>
            <div style={{ maxWidth: 1200, margin: '0 auto' }}>

                <h2 style={{
                    textAlign: 'center',
                    fontFamily: FONTS.main,
                    fontWeight: 900,
                    fontSize: '3rem'
                }}>
                    One Scoop. For Everyone.
                </h2>

                <div className="grid">
                    {slots.map((img, i) => (
                        <ImageCell key={img.id + i} image={img} />
                    ))}
                </div>

            </div>

            <style>{`
        .grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 16px;
          margin-top: 60px;
        }
      `}</style>
        </section>
    );
}