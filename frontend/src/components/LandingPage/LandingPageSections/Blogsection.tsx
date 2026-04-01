'use client';

import { motion, useInView } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { 
    Calendar, BookOpen, ArrowRight, Bookmark, ChevronRight, 
    LucideIcon
} from 'lucide-react';
import { useRef } from 'react';
import { F_SIZE, FONTS, BRAND } from '@/lib/typography';


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
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '6px 16px', borderRadius: 100, background: BRAND.white, border: `1px solid ${BRAND.primary}15`, backdropFilter: 'blur(10px)' }}>
            {Icon && <Icon size={12} color={BRAND.primaryDark} />}
            <span style={{ fontSize: F_SIZE.sm, fontWeight: 900, color: BRAND.primary, letterSpacing: '0.15em', textTransform: 'uppercase', fontFamily: FONTS.main }}>{text}</span>
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
                background: isLarge ? 'transparent' : `${BRAND.white}80`,
                backdropFilter: isLarge ? 'none' : 'blur(20px)',
                border: isLarge ? 'none' : `1px solid ${BRAND.white}60`,
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
                <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to top, ${BRAND.primary}50 0%, transparent 50%)` }} />
                <div style={{ position: 'absolute', top: 16, left: 16 }}>
                     <div style={{ background: BRAND.white, padding: '4px 12px', borderRadius: 100, fontFamily: FONTS.main, fontSize: F_SIZE.sm, fontWeight: 900, color: BRAND.primary, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{blog.tag}</div>
                </div>
            </div>

            {/* Content Wrapper */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: isLarge ? 16 : 8, flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <Calendar size={14} color={BRAND.textMuted} />
                    <span style={{ fontFamily: FONTS.main, fontSize: F_SIZE.sm, fontWeight: 700, color: BRAND.textMuted }}>{blog.date}</span>
                    <span style={{ width: 1, height: 12, background: BRAND.border }} />
                    <span style={{ fontFamily: FONTS.main, fontSize: F_SIZE.sm, fontWeight: 800, color: BRAND.primary }}>{blog.readTime}</span>
                </div>

                <h3 style={{
                    fontFamily: FONTS.main,
                    fontSize: isLarge ? F_SIZE.lg : F_SIZE.md,
                    fontWeight: 900,
                    color: BRAND.text,
                    margin: 0,
                    lineHeight: 1.2,
                    letterSpacing: '-0.025em'
                }}>{blog.title}</h3>

                <p style={{
                    fontFamily: FONTS.main,
                    fontSize: isLarge ? F_SIZE.md : F_SIZE.sm,
                    color: BRAND.textMuted,
                    lineHeight: 1.6,
                    margin: 0,
                    display: '-webkit-box',
                    WebkitLineClamp: isLarge ? 3 : 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                }}>{blog.excerpt}</p>

                <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: 8, fontFamily: FONTS.main, fontSize: F_SIZE.sm, fontWeight: 800, color: BRAND.primaryDark }}>
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
        <section ref={sectionRef} style={{ padding: '32px 0', background: BRAND.white, position: 'relative', overflow: 'hidden' }}>
            
            {/* Ambient Background Atmosphere */}
            <div style={{ position: 'absolute', top: '15%', left: '-5%', width: '40vw', height: '40vw', background: `radial-gradient(circle, ${BRAND.primary}03 0%, transparent 70%)`, pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', bottom: '15%', right: '-5%', width: '40vw', height: '40vw', background: `radial-gradient(circle, ${BRAND.primaryDark}03 0%, transparent 70%)`, pointerEvents: 'none' }} />

            <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 40px', position: 'relative', zIndex: 1 }}>
                
                {/* ── HEADER ROW ── */}
                <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 32, flexWrap: 'wrap', gap: 40 }}>
                    <div style={{ maxWidth: 640 }}>
                        <SectionBadge text="Research Library" icon={BookOpen} />
                        <h2 style={{ fontFamily: FONTS.main, fontSize: F_SIZE.xl, fontWeight: 900, color: BRAND.text, lineHeight: 1.1, letterSpacing: '-0.04em', margin: '12px 0 0' }}>
                            Our  <span style={{ color: BRAND.primaryDark }}>Insights</span>
                        </h2>
                    </div>

                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Link href="/blog" style={{
                            display: 'flex', alignItems: 'center', gap: 12, padding: '12px 24px', borderRadius: 16,
                            background: BRAND.primary, color: BRAND.white, fontFamily: FONTS.main, fontSize: F_SIZE.sm, fontWeight: 900,
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
                        <div style={{ paddingBottom: 24, borderBottom: `1px solid ${BRAND.border}`, display: 'flex', alignItems: 'center', gap: 12, color: BRAND.textMuted, fontFamily: FONTS.main, fontSize: F_SIZE.sm, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                            <Bookmark size={14} color={BRAND.primaryDark} />
                            Trending Peer Reviews
                        </div>
                        {rest.map((blog, i) => (
                            <ClinicalBlogCard key={blog.id} blog={blog} index={i + 1} size="small" />
                        ))}
                        
                        <div style={{ marginTop: 'auto', padding: '20px', borderRadius: 24, background: BRAND.light, border: `1px solid ${BRAND.primary}05`, textAlign: 'center' }}>
                            <p style={{ fontFamily: FONTS.accent, fontSize: F_SIZE.lg, color: BRAND.primaryDark, margin: 0, fontWeight: 700 }}>✦ More clinical data arriving weekly ✦</p>
                        </div>
                    </div>

                </div>

            </div>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&family=Caveat:wght@600;700&display=swap');
                
                .blog-grid {
                    display: grid;
                    grid-template-columns: minmax(0, 55fr) 45fr;
                    gap: 32px;
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
                    gap: 16px;
                }

                @media (max-width: 1024px) {
                    .blog-grid {
                        grid-template-columns: 1fr;
                        gap: 24px;
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





