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
import { F_SIZE, BRAND, FONTS } from '@/lib/typography';

/* ── CATEGORY SYSTEM ── */
const CATEGORIES: any = {
    'Physical Demand': [
        { id: 'farmer-1', src: 'https://images.unsplash.com/photo-1595841696677-6489ff3f8cd1?w=800&q=80', alt: 'Farmer working', title: 'Farmers & Workers', icon: <Sun size={14} color={BRAND.burgundy} /> },
        { id: 'athlete-1', src: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80', alt: 'Athlete training', title: 'Athletes', icon: <Activity size={14} color={BRAND.burgundy} /> },
        { id: 'worker-1', src: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=80', alt: 'Tech worker', title: 'Professionals', icon: <Briefcase size={14} color={BRAND.burgundy} /> },
    ],
    'Mental Performance': [
        { id: 'student-1', src: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&q=80', alt: 'Student studying', title: 'Students', icon: <GraduationCap size={14} color={BRAND.burgundy} /> },
        { id: 'pro-1', src: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=80', alt: 'Manager', title: 'Managers', icon: <Briefcase size={14} color={BRAND.burgundy} /> },
        { id: 'creative-1', src: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&q=80', alt: 'Writer', title: 'Creatives', icon: <Sparkles size={14} color={BRAND.burgundy} /> },
    ],
    'Family Growth': [
        { id: 'parent-1', src: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?w=800&q=80', alt: 'Parents', title: 'Parents', icon: <Baby size={14} color={BRAND.burgundy} /> },
        { id: 'child-1', src: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&q=80', alt: 'Child health', title: 'Children', icon: <Baby size={14} color={BRAND.burgundy} /> },
        { id: 'family-1', src: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=800&q=80', alt: 'Family', title: 'Families', icon: <Users size={14} color={BRAND.burgundy} /> },
    ],
    'Longevity': [
        { id: 'senior-1', src: 'https://images.unsplash.com/photo-1515377553641-5b868e6584c6?w=800&q=80', alt: 'Senior', title: 'Seniors', icon: <Heart size={14} color={BRAND.burgundy} /> },
        { id: 'senior-2', src: 'https://images.unsplash.com/photo-1581579438747-1dc8c18782c1?w=800&q=80', alt: 'Active Senior', title: 'Active Aging', icon: <Footprints size={14} color={BRAND.burgundy} /> },
    ],
    'Women’s Health': [
        { id: 'women-1', src: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&q=80', alt: 'Woman', title: 'Women', icon: <Heart size={14} color={BRAND.burgundy} /> },
        { id: 'women-2', src: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&q=80', alt: 'Portrait', title: 'Wellness', icon: <ShieldCheck size={14} color={BRAND.burgundy} /> },
    ],
};

const ALL_IMAGES = Object.entries(CATEGORIES).flatMap(([cat, imgs]: any) =>
    imgs.map((img: any) => ({ ...img, category: cat }))
);

const SLOT_CATEGORIES = [
    'Physical Demand', 'Mental Performance', 'Family Growth', 'Longevity', 'Women’s Health',
    'Family Growth', 'Physical Demand', 'Mental Performance', 'Women’s Health', 'Longevity'
];

function ImageCell({ image, index }: { image: any, index: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.05 }}
            style={{ position: 'relative', aspectRatio: '4/5', borderRadius: 24, overflow: 'hidden', background: BRAND.cream, border: `1px solid ${BRAND.espresso}10` }}
        >
            <AnimatePresence mode="wait">
                <motion.div
                    key={image.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8 }}
                    style={{ position: 'absolute', inset: 0 }}
                >
                    <Image src={image.src} alt={image.alt} fill style={{ objectFit: 'cover' }} unoptimized />
                </motion.div>
            </AnimatePresence>

            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 60%)' }} />

            <div style={{ position: 'absolute', bottom: 12, left: 12, right: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 8px', borderRadius: 100, background: BRAND.white, width: 'fit-content', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                    {image.icon}
                    <span style={{ fontSize: 10, fontWeight: 900, color: BRAND.espresso, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{image.category}</span>
                </div>
            </div>
        </motion.div>
    );
}

export default function PeopleSection() {
    const sectionRef = useRef(null);
    const inView = useInView(sectionRef, { once: true });
    const [slots, setSlots] = useState<any[]>(() =>
        SLOT_CATEGORIES.map(cat => ALL_IMAGES.find(i => i.category === cat))
    );

    useEffect(() => {
        const interval = setInterval(() => {
            setSlots(prev => {
                const next = [...prev];
                const idx = Math.floor(Math.random() * next.length);
                const cat = SLOT_CATEGORIES[idx];
                const imgs = ALL_IMAGES.filter(i => i.category === cat);
                next[idx] = imgs[Math.floor(Math.random() * imgs.length)];
                return next;
            });
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <section ref={sectionRef} style={{ background: BRAND.white, padding: '60px 24px' }}>
            <div style={{ maxWidth: 1200, margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: 56 }}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={inView ? { opacity: 1, y: 0 } : {}}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '6px 16px', borderRadius: 100, background: BRAND.cream, border: `1px solid ${BRAND.espresso}10`, marginBottom: 24 }}
                    >
                        <Sparkles size={14} color={BRAND.burgundy} />
                        <span style={{ fontSize: F_SIZE.sm, fontWeight: 900, color: BRAND.espresso, letterSpacing: '0.1em', textTransform: 'uppercase' }}>For Every Life Stage</span>
                    </motion.div>
                    <h2 style={{ fontFamily: FONTS.main, fontSize: F_SIZE.xl, fontWeight: 900, color: BRAND.espresso, margin: 0 }}>One Sachet. <span style={{ color: BRAND.burgundy }}>For Everyone</span>.</h2>
                </div>

                <div className="people-grid">
                    {slots.map((img, i) => (
                        <ImageCell key={img.id + i} image={img} index={i} />
                    ))}
                </div>
            </div>

            <style>{`
                .people-grid {
                    display: grid;
                    grid-template-columns: repeat(5, 1fr);
                    gap: 16px;
                }
                @media (max-width: 1024px) {
                    .people-grid { grid-template-columns: repeat(4, 1fr); }
                }
                @media (max-width: 768px) {
                    .people-grid { grid-template-columns: repeat(2, 1fr); }
                }
            `}</style>
        </section>
    );
}
