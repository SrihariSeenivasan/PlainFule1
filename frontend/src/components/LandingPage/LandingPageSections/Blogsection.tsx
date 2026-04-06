'use client';

import { motion, useInView } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { 
    Calendar, BookOpen, ArrowRight, Bookmark, ChevronRight, 
    LucideIcon, Loader
} from 'lucide-react';
import { useRef, useState, useEffect } from 'react';
import { F_SIZE, FONTS, BRAND } from '@/lib/typography';
import { getBlogs } from '@/lib/blogApi';


interface BlogDisplay {
    id: number;
    title: string;
    excerpt: string;
    date: string;
    image: string;
    tag: string;
    slug: string;
    featured: boolean;
    readTime: string;
}

function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function formatReadTime(readTime?: number): string {
    if (!readTime) return '5 min read';
    return `${readTime} min read`;
}

/* ── SUB-COMPONENTS ── */

function SectionBadge({ text, icon: Icon }: { text: string; icon?: LucideIcon }) {
    return (
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '6px 16px', borderRadius: 100, background: BRAND.white, border: `1px solid ${BRAND.primary}15`, backdropFilter: 'blur(10px)' }}>
            {Icon && <Icon size={12} color={BRAND.primaryDark} />}
            <span style={{ fontSize: F_SIZE.sm, fontWeight: 900, color: BRAND.primary, letterSpacing: '0.15em', textTransform: 'uppercase'}}>{text}</span>
        </div>
    );
}

function ClinicalBlogCard({ blog, index, size = 'large' }: { blog: BlogDisplay; index: number; size?: 'large' | 'small' }) {
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
                gap: 'clamp(12px, 3vw, 24px)',
                cursor: 'pointer',
                borderRadius: 24,
                padding: 'clamp(12px, 3vw, 20px)',
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
                     <div style={{ background: BRAND.white, padding: '4px 12px', borderRadius: 100, fontSize: F_SIZE.sm, fontWeight: 900, color: BRAND.primary, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{blog.tag}</div>
                </div>
            </div>

            {/* Content Wrapper */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: isLarge ? 16 : 8, flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <Calendar size={14} color={BRAND.textMuted} />
                    <span style={{ fontSize: F_SIZE.sm, fontWeight: 700, color: BRAND.textMuted }}>{blog.date}</span>
                    <span style={{ width: 1, height: 12, background: BRAND.border }} />
                    <span style={{ fontSize: F_SIZE.sm, fontWeight: 800, color: BRAND.primary }}>{blog.readTime}</span>
                </div>

                <h3 style={{
                    fontSize: isLarge ? F_SIZE.lg : F_SIZE.md,
                    fontWeight: 900,
                    color: BRAND.text,
                    margin: 0,
                    lineHeight: 1.2,
                    letterSpacing: '-0.025em'
                }}>{blog.title}</h3>

                <p style={{
                    fontSize: isLarge ? F_SIZE.md : F_SIZE.sm,
                    color: BRAND.textMuted,
                    lineHeight: 1.6,
                    margin: 0,
                    display: '-webkit-box',
                    WebkitLineClamp: isLarge ? 3 : 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                }}>{blog.excerpt}</p>

                <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: 8, fontSize: F_SIZE.sm, fontWeight: 800, color: BRAND.primaryDark }}>
                    READ MORE <ArrowRight size={14} />
                </div>
            </div>
        </motion.article>
    );
}

/* ── MAIN SECTION ── */
export default function Blogsection() {
    const sectionRef = useRef(null);
    const inView = useInView(sectionRef, { once: true, margin: '-100px' });
    const [blogs, setBlogs] = useState<BlogDisplay[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                setLoading(true);
                setError(null);
                
                // Fetch published blogs, limit to 3 for the section
                const response = await getBlogs(1, 3);
                
                // Transform API blogs to display format
                const transformedBlogs: BlogDisplay[] = response.data
                    .filter(blog => blog.status === 'PUBLISHED')
                    .map((blog, index) => ({
                        id: blog.id,
                        title: blog.title,
                        slug: blog.slug,
                        excerpt: blog.excerpt || '',
                        date: formatDate(blog.publishedAt || blog.createdAt),
                        image: blog.featuredImage || '/images/ingredients.png',
                        tag: blog.tags[0]?.name || 'Insights',
                        featured: index === 0,
                        readTime: formatReadTime(blog.readTime),
                    }));
                
                setBlogs(transformedBlogs);
            } catch (err) {
                console.error('Failed to fetch blogs:', err);
                setError('Unable to load blogs');
                // Fallback to empty state
                setBlogs([]);
            } finally {
                setLoading(false);
            }
        };

        fetchBlogs();
    }, []);

    const [featured, ...rest] = blogs;

    return (
        <section ref={sectionRef} style={{ padding: 'clamp(30px, 8vw, 60px) 0', background: BRAND.white, position: 'relative', overflow: 'hidden' }}>
            
            {/* Ambient Background Atmosphere */}
            <div style={{ position: 'absolute', top: '15%', left: '-5%', width: '40vw', height: '40vw', background: `radial-gradient(circle, ${BRAND.primary}03 0%, transparent 70%)`, pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', bottom: '15%', right: '-5%', width: '40vw', height: '40vw', background: `radial-gradient(circle, ${BRAND.primaryDark}03 0%, transparent 70%)`, pointerEvents: 'none' }} />

            <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 20px', position: 'relative', zIndex: 1 }}>
                
                {/* ── HEADER ROW ── */}
                <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 'clamp(20px, 4vw, 32px)', flexWrap: 'wrap', gap: 'clamp(20px, 5vw, 40px)' }}>
                    <div style={{ maxWidth: 640 }}>
                        <SectionBadge text="Research Library" icon={BookOpen} />
                        <h2 style={{ fontSize: F_SIZE.xl, fontWeight: 900, color: BRAND.text, lineHeight: 1.1, letterSpacing: '-0.04em', margin: '12px 0 0' }}>
                            Our  <span style={{ color: BRAND.primaryDark }}>Insights</span>
                        </h2>
                    </div>

                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Link href="/blog" style={{
                            display: 'flex', alignItems: 'center', gap: 12, padding: '12px 24px', borderRadius: 16,
                            background: BRAND.primary, color: BRAND.white, fontSize: F_SIZE.sm, fontWeight: 900,
                            textTransform: 'uppercase', letterSpacing: '0.15em', boxShadow: '0 20px 40px rgba(10,61,31,0.15)'
                        }}>
                            Read ALL Insights <ChevronRight size={16} />
                        </Link>
                    </motion.div>
                </div>

                {/* ── CONTENT GRID ── */}
                {loading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400, gap: 12 }}>
                        <Loader size={24} color={BRAND.primary} className="animate-spin" />
                        <span style={{ fontSize: F_SIZE.md, color: BRAND.textMuted, fontWeight: 700 }}>Loading blogs...</span>
                    </div>
                ) : blogs.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px 20px', background: BRAND.light, borderRadius: 24 }}>
                        <p style={{ fontSize: F_SIZE.md, color: BRAND.textMuted, fontWeight: 700, margin: 0 }}>No published blogs available yet</p>
                    </div>
                ) : (
                    <div className="blog-grid">
                        
                        {/* Featured Article */}
                        <div className="featured-column">
                            <Link href={`/blog/${featured.slug}`} style={{ textDecoration: 'none' }}>
                                <ClinicalBlogCard blog={featured} index={0} size="large" />
                            </Link>
                        </div>

                        {/* Secondary List */}
                        <div className="list-column">
                            <div style={{ paddingBottom: 24, borderBottom: `1px solid ${BRAND.border}`, display: 'flex', alignItems: 'center', gap: 12, color: BRAND.textMuted, fontSize: F_SIZE.sm, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                                <Bookmark size={14} color={BRAND.primaryDark} />
                                Trending Peer Reviews
                            </div>
                            {rest.map((blog, i) => (
                                <Link key={blog.id} href={`/blog/${blog.slug}`} style={{ textDecoration: 'none' }}>
                                    <ClinicalBlogCard blog={blog} index={i + 1} size="small" />
                                </Link>
                            ))}
                            
                            <div style={{ marginTop: 'auto', padding: '20px', borderRadius: 24, background: BRAND.light, border: `1px solid ${BRAND.primary}05`, textAlign: 'center' }}>
                                <p style={{ fontFamily: FONTS.accent, fontSize: F_SIZE.lg, color: BRAND.primaryDark, margin: 0, fontWeight: 700 }}>✦ More clinical data arriving weekly ✦</p>
                            </div>
                        </div>

                    </div>
                )}

            </div>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&family=Caveat:wght@600;700&display=swap');
                
                .blog-grid {
                    display: grid;
                    grid-template-columns: minmax(0, 55fr) 45fr;
                    gap: clamp(16px, 4vw, 32px);
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
                    width: clamp(100px, 20vw, 140px);
                    aspect-ratio: 1/1;
                }
                
                .list-column {
                    display: flex;
                    flex-direction: column;
                    gap: clamp(12px, 3vw, 16px);
                }

                @media (max-width: 1024px) {
                    .blog-grid {
                        grid-template-columns: 1fr;
                        gap: clamp(12px, 4vw, 24px);
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





