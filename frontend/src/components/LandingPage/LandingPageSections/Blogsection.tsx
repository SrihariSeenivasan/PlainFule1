'use client';

import { motion, useInView } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { 
    Calendar, BookOpen, ArrowRight, Bookmark, ChevronRight, 
    LucideIcon
} from 'lucide-react';
import { useRef } from 'react';

/* ── Design Tokens (Glacier Elite) ── */
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

interface Blog {
    id: number;
    title: string;
    excerpt: string;
    date: string;
    image: string;
    tag: string;
    featured: boolean;
    readTime: string;
}

const blogs: Blog[] = [
    {
        id: 1,
        title: "The Indian Diet Gap: Biometric Deficits in Modern Life.",
        excerpt: "A clinical analysis of common Indian dietary patterns and the resulting microscopic gaps in daily nutritional baseline.",
        date: "Oct 24, 2025",
        image: "/images/ingredients.png",
        tag: "Biometrics",
        featured: true,
        readTime: "8 min read"
    },
    {
        id: 2,
        title: "Bioavailability: The Pharmacist's Guide to Absorption.",
        excerpt: "Why the molecular form of your micronutrients dictates systemic recovery more than simple dosage numbers.",
        date: "Oct 12, 2025",
        image: "/images/scoop.png",
        tag: "Bioavailability",
        featured: false,
        readTime: "5 min read"
    },
    {
        id: 3,
        title: "Microbiome Resilience & Systemic Immunity.",
        excerpt: "Understanding the gut-brain axis and how targeted fiber restoration supports metabolic consistency.",
        date: "Sep 30, 2025",
        image: "/images/ingredients.png",
        tag: "Meta-Health",
        featured: false,
        readTime: "6 min read"
    },
];

/* ── SUB-COMPONENTS ── */

function SectionBadge({ text, icon: Icon }: { text: string; icon?: LucideIcon }) {
    return (
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '6px 16px', borderRadius: 100, background: C.white, border: `1px solid ${C.forest}15`, backdropFilter: 'blur(10px)' }}>
            {Icon && <Icon size={12} color={C.gold} />}
            <span style={{ fontSize: 9, fontWeight: 900, color: C.forest, letterSpacing: '0.15em', textTransform: 'uppercase', fontFamily: FONTS.main }}>{text}</span>
        </div>
    );
}

function ClinicalBlogCard({ blog, index, size = 'large' }: { blog: Blog; index: number; size?: 'large' | 'small' }) {
    const isLarge = size === 'large';
    return (
        <motion.article
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: index * 0.1, ease: [0.165, 0.84, 0.44, 1] }}
            className={`blog-card ${isLarge ? 'card-large' : 'card-small'}`}
            style={{
                display: 'flex',
                gap: 24,
                cursor: 'pointer',
                borderRadius: 24,
                padding: '20px',
                background: isLarge ? 'transparent' : `${C.glass}`,
                backdropFilter: isLarge ? 'none' : 'blur(20px)',
                border: isLarge ? 'none' : `1px solid ${C.white}60`,
                transition: 'all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1)'
            }}
            whileHover={{ y: -5, boxShadow: isLarge ? 'none' : '0 20px 40px rgba(0,0,0,0.04)' }}
        >
            {/* Image Wrapper */}
            <div className="blog-image-wrapper" style={{
                position: 'relative',
                borderRadius: isLarge ? 32 : 16,
                overflow: 'hidden',
                flexShrink: 0
            }}>
                <Image src={blog.image} alt={blog.title} fill style={{ objectFit: 'cover' }} />
                <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to top, ${C.deep}50 0%, transparent 50%)` }} />
                <div style={{ position: 'absolute', top: 16, left: 16 }}>
                     <div style={{ background: C.white, padding: '4px 12px', borderRadius: 100, fontFamily: FONTS.main, fontSize: 9, fontWeight: 900, color: C.forest, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{blog.tag}</div>
                </div>
            </div>

            {/* Content Wrapper */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: isLarge ? 16 : 8, flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <Calendar size={14} color={C.silver} />
                    <span style={{ fontFamily: FONTS.main, fontSize: 11, fontWeight: 700, color: C.silver }}>{blog.date}</span>
                    <span style={{ width: 1, height: 12, background: C.border }} />
                    <span style={{ fontFamily: FONTS.main, fontSize: 11, fontWeight: 800, color: C.forest }}>{blog.readTime}</span>
                </div>

                <h3 style={{
                    fontFamily: FONTS.main,
                    fontSize: isLarge ? 24 : 16,
                    fontWeight: 900,
                    color: C.ink,
                    margin: 0,
                    lineHeight: 1.2,
                    letterSpacing: '-0.025em'
                }}>{blog.title}</h3>

                <p style={{
                    fontFamily: FONTS.main,
                    fontSize: isLarge ? 15 : 13,
                    color: C.silver,
                    lineHeight: 1.6,
                    margin: 0,
                    display: '-webkit-box',
                    WebkitLineClamp: isLarge ? 3 : 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                }}>{blog.excerpt}</p>

                <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: 8, fontFamily: FONTS.main, fontSize: 12, fontWeight: 800, color: C.leaf }}>
                    READ ANALYSIS <ArrowRight size={14} />
                </div>
            </div>
        </motion.article>
    );
}

/* ── MAIN SECTION ── */
export default function Blogsection() {
    const sectionRef = useRef(null);
    const inView = useInView(sectionRef, { once: true, margin: '-100px' });
    const [featured, ...rest] = blogs;

    return (
        <section ref={sectionRef} style={{ padding: '160px 0', background: C.white, position: 'relative', overflow: 'hidden' }}>
            
            {/* Ambient Background Atmosphere */}
            <div style={{ position: 'absolute', top: '15%', left: '-5%', width: '40vw', height: '40vw', background: `radial-gradient(circle, ${C.forest}03 0%, transparent 70%)`, pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', bottom: '15%', right: '-5%', width: '40vw', height: '40vw', background: `radial-gradient(circle, ${C.gold}03 0%, transparent 70%)`, pointerEvents: 'none' }} />

            <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 40px', position: 'relative', zIndex: 1 }}>
                
                {/* ── HEADER ROW ── */}
                <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 80, flexWrap: 'wrap', gap: 40 }}>
                    <div style={{ maxWidth: 640 }}>
                        <SectionBadge text="Research Library" icon={BookOpen} />
                        <h2 style={{ fontFamily: FONTS.main, fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 900, color: C.ink, lineHeight: 1.1, letterSpacing: '-0.04em', margin: '24px 0 0' }}>
                            Clinical Insights & <br /> <span style={{ color: C.leaf }}>Biometric Data.</span>
                        </h2>
                    </div>

                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Link href="/blog" style={{
                            display: 'flex', alignItems: 'center', gap: 12, padding: '16px 32px', borderRadius: 16,
                            background: C.forest, color: C.white, fontFamily: FONTS.main, fontSize: 11, fontWeight: 900,
                            textTransform: 'uppercase', letterSpacing: '0.15em', boxShadow: '0 20px 40px rgba(10,61,31,0.15)'
                        }}>
                            All Research Papers <ChevronRight size={16} />
                        </Link>
                    </motion.div>
                </div>

                {/* ── CONTENT GRID ── */}
                <div className="blog-grid">
                    
                    {/* Featured Article */}
                    <div className="featured-column">
                        <ClinicalBlogCard blog={featured} index={0} size="large" />
                    </div>

                    {/* Secondary List */}
                    <div className="list-column">
                        <div style={{ paddingBottom: 24, borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 12, color: C.silver, fontFamily: FONTS.main, fontSize: 10, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                            <Bookmark size={14} color={C.gold} />
                            Trending Peer Reviews
                        </div>
                        {rest.map((blog, i) => (
                            <ClinicalBlogCard key={blog.id} blog={blog} index={i + 1} size="small" />
                        ))}
                        
                        <div style={{ marginTop: 'auto', padding: '32px', borderRadius: 24, background: C.offwhite, border: `1px solid ${C.forest}05`, textAlign: 'center' }}>
                            <p style={{ fontFamily: FONTS.accent, fontSize: 22, color: C.gold, margin: 0, fontWeight: 700 }}>✦ More clinical data arriving weekly ✦</p>
                        </div>
                    </div>

                </div>

            </div>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&family=Caveat:wght@600;700&display=swap');
                
                .blog-grid {
                    display: grid;
                    grid-template-columns: minmax(0, 55fr) 45fr;
                    gap: 64px;
                }
                .blog-card.card-large {
                    flex-direction: column;
                }
                .blog-card.card-small {
                    flex-direction: row;
                }
                .blog-card.card-large .blog-image-wrapper {
                    width: 100%;
                    aspect-ratio: 16/9;
                }
                .blog-card.card-small .blog-image-wrapper {
                    width: 140px;
                    aspect-ratio: 1/1;
                }
                
                .list-column {
                    display: flex;
                    flex-direction: column;
                    gap: 32px;
                }

                @media (max-width: 1024px) {
                    .blog-grid {
                        grid-template-columns: 1fr;
                        gap: 48px;
                    }
                    .blog-card.card-small {
                        flex-direction: column;
                    }
                    .blog-card.card-small .blog-image-wrapper {
                        width: 100%;
                        aspect-ratio: 16/9;
                    }
                }
            `}</style>
        </section>
    );
}