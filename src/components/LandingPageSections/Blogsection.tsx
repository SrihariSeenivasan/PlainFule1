'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, ArrowUpRight, BookOpen } from 'lucide-react';

const blogs = [
    {
        id: 1,
        title: "The Indian Diet Gap: What's Missing in Your Thali?",
        excerpt: "Analyzing the nutritional profile of common Indian meals and identifying consistent micronutrient gaps.",
        date: "Oct 24, 2025",
        image: "/images/ingredients.png",
        tag: "Nutrition",
        accent: "#7ee8a2",
        annotation: "eye opener!",
        featured: true,
    },
    {
        id: 2,
        title: "The Science of Bioavailability: Not All Vitamins are Equal.",
        excerpt: "Why the form of the vitamin you consume matters more than the amount on the label.",
        date: "Oct 12, 2025",
        image: "/images/scoop.png",
        tag: "Science",
        accent: "#ffd3b6",
        annotation: "must read!",
        featured: false,
    },
    {
        id: 3,
        title: "Gut Health & Immunity: The Microbiome Connection.",
        excerpt: "How the trillions of bacteria in your gut dictate everything from mood to metabolism.",
        date: "Sep 30, 2025",
        image: "/images/ingredients.png",
        tag: "Gut Health",
        accent: "#c4b5fd",
        annotation: "game changer!",
        featured: false,
    },
];

/* ── SVG Doodle Atoms ── */

function WiggleLine({ color = 'currentColor', className = '' }: { color?: string; className?: string }) {
    return (
        <svg viewBox="0 0 200 10" fill="none" className={className} aria-hidden="true">
            <path d="M0 5 C25 1,50 9,75 5 S125 1,150 5 S180 9,200 5" stroke={color} strokeWidth="2" strokeLinecap="round" fill="none" />
        </svg>
    );
}

function Sparkle({ color = 'currentColor', className = '' }: { color?: string; className?: string }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
            <path d="M12 2 L13.5 10 L22 12 L13.5 14 L12 22 L10.5 14 L2 12 L10.5 10 Z" stroke={color} strokeWidth="1.5" strokeLinejoin="round" fill="none" />
        </svg>
    );
}

function CircleDoodle({ color = 'currentColor', className = '' }: { color?: string; className?: string }) {
    return (
        <svg viewBox="0 0 60 60" fill="none" className={className} aria-hidden="true">
            <path d="M30 6 C46 5,55 16,54 30 S44 55,29 55 S5 44,5 29 S14 5,30 6Z" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" />
        </svg>
    );
}

function DoodleArrowDown({ color = 'currentColor', className = '' }: { color?: string; className?: string }) {
    return (
        <svg viewBox="0 0 20 28" fill="none" className={className} aria-hidden="true">
            <path d="M10 2 C8 8,12 14,9 22" stroke={color} strokeWidth="2" strokeLinecap="round" fill="none" />
            <path d="M5 18 L9 24 L14 19" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>
    );
}

function DoodleBorder({ color, className = '' }: { color: string; className?: string }) {
    return (
        <svg
            className={`absolute pointer-events-none ${className}`}
            style={{ inset: '-6px', width: 'calc(100% + 12px)', height: 'calc(100% + 12px)' }}
            preserveAspectRatio="none"
            viewBox="0 0 300 200"
            fill="none"
            aria-hidden="true"
        >
            <path
                d="M6 12 C70 4,220 4,294 10 S300 40,298 158 S292 196,250 197 S70 198,14 195 S2 168,2 100 S3 18,6 12Z"
                stroke={color}
                strokeWidth="2.2"
                fill="none"
                strokeDasharray="6 3"
                strokeLinecap="round"
            />
        </svg>
    );
}

/* ── Annotation sticky note ── */
function Annotation({ text }: { text: string }) {
    return (
        <div className="flex flex-col items-end gap-0 pointer-events-none select-none">
            <span
                style={{ fontFamily: "'Caveat', cursive", background: '#fef08a', color: '#713f12' }}
                className="text-[11px] font-bold px-2.5 py-0.5 rounded rotate-2 shadow-md"
            >
                {text}
            </span>
            <DoodleArrowDown color="#ca8a04" className="w-3.5 h-4 mr-1" />
        </div>
    );
}

interface Blog {
    id: number;
    title: string;
    excerpt: string;
    date: string;
    image: string;
    tag: string;
    accent: string;
    annotation: string;
    featured: boolean;
}

/* ── Featured (large) card ── */
function FeaturedCard({ blog }: { blog: Blog }) {
    return (
        <motion.article
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="group cursor-pointer -rotate-[0.5deg] hover:rotate-0 transition-transform duration-500"
        >
            {/* image */}
            <div className="relative mb-5">
                <DoodleBorder color={blog.accent} className="z-10 opacity-50 group-hover:opacity-90 transition-opacity duration-300" />
                <div className="relative aspect-[16/9] rounded-2xl overflow-hidden">
                    <Image
                        src={blog.image}
                        alt={blog.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 55vw"
                        className="object-cover group-hover:scale-[1.04] transition-transform duration-700"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                    {/* bottom-left caption on image */}
                    <div className="absolute bottom-4 left-4 z-10">
                        <span
                            style={{ fontFamily: "'Caveat', cursive" }}
                            className="text-white/80 text-sm font-bold tracking-wide"
                        >
                            Featured Story
                        </span>
                    </div>
                </div>

                {/* tag */}
                <div className="absolute top-3 left-3 z-20">
                    <span
                        style={{ fontFamily: "'Caveat', cursive", background: blog.accent, color: '#1a1a1a' }}
                        className="inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-full -rotate-2 shadow"
                    >
                        #{blog.tag}
                    </span>
                </div>

                {/* annotation */}
                <div className="absolute top-2 right-3 z-20">
                    <Annotation text={blog.annotation} />
                </div>
            </div>

            {/* meta */}
            <div className="flex items-center gap-2 mb-2.5">
                <Calendar className="w-3 h-3 text-[var(--green-bright)]" />
                <span style={{ fontFamily: "'Caveat', cursive" }} className="text-[var(--green-bright)] text-xs font-bold">{blog.date}</span>
                <span className="w-1 h-1 rounded-full bg-white/20" />
                <span style={{ fontFamily: "'Caveat', cursive" }} className="text-white/35 text-xs font-bold">Research Paper</span>
            </div>

            <h3 className="text-lg md:text-xl font-bold leading-snug mb-2 group-hover:text-[var(--green-bright)] transition-colors">
                {blog.title}
            </h3>
            <p className="text-[var(--foreground)]/40 text-sm leading-relaxed mb-4">{blog.excerpt}</p>

            <WiggleLine color={blog.accent} className="w-full h-3 opacity-25 group-hover:opacity-60 transition-opacity" />
        </motion.article>
    );
}

/* ── Small (stacked) card ── */
function SmallCard({ blog, index }: { blog: Blog; index: number }) {
    return (
        <motion.article
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.12, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="group cursor-pointer flex gap-4 items-start rotate-[0.5deg] hover:rotate-0 transition-transform duration-500"
        >
            {/* thumbnail */}
            <div className="relative shrink-0 w-[110px] sm:w-[130px]">
                <DoodleBorder color={blog.accent} className="z-10 opacity-40 group-hover:opacity-80 transition-opacity duration-300" />
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden">
                    <Image
                        src={blog.image}
                        alt={blog.title}
                        fill
                        sizes="130px"
                        className="object-cover group-hover:scale-[1.05] transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                </div>

                {/* annotation on thumbnail */}
                <div className="absolute -top-1 -right-1 z-20">
                    <Annotation text={blog.annotation} />
                </div>
            </div>

            {/* text */}
            <div className="flex-1 min-w-0 pt-1">
                <div className="flex items-center gap-1.5 mb-1.5">
                    <span
                        style={{ fontFamily: "'Caveat', cursive", background: blog.accent, color: '#1a1a1a' }}
                        className="inline-block text-[9px] font-bold px-2 py-0.5 rounded-full -rotate-1 shadow-sm"
                    >
                        #{blog.tag}
                    </span>
                </div>

                <h3 className="text-sm font-bold leading-snug mb-1.5 group-hover:text-[var(--green-bright)] transition-colors line-clamp-2">
                    {blog.title}
                </h3>
                <p className="text-[var(--foreground)]/35 text-xs leading-relaxed line-clamp-2 mb-2">
                    {blog.excerpt}
                </p>

                <div className="flex items-center gap-1.5">
                    <Calendar className="w-2.5 h-2.5 text-[var(--green-bright)]" />
                    <span style={{ fontFamily: "'Caveat', cursive" }} className="text-[var(--green-bright)] text-[10px] font-bold">{blog.date}</span>
                </div>

                <WiggleLine color={blog.accent} className="w-full h-2 mt-2 opacity-20 group-hover:opacity-50 transition-opacity" />
            </div>
        </motion.article>
    );
}

/* ── Main section ── */
export default function Blogsection() {
    const [featured, ...rest] = blogs;

    return (
        <>
            <style>{`@import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400;700&display=swap');`}</style>

            <section className="relative overflow-hidden bg-[var(--background)] py-16 md:py-24">

                {/* ambient decorations */}
                <Sparkle color="#7ee8a2" className="absolute top-10 left-[2%] w-5 h-5 opacity-20 rotate-12 pointer-events-none" />
                <CircleDoodle color="#ffd3b6" className="absolute top-16 right-[2%] w-9 h-9 opacity-15 -rotate-6 pointer-events-none" />
                <Sparkle color="#c4b5fd" className="absolute bottom-14 left-[3%] w-4 h-4 opacity-20 pointer-events-none" />
                <CircleDoodle color="#7ee8a2" className="absolute bottom-8 right-[3%] w-7 h-7 opacity-10 rotate-3 pointer-events-none" />

                <div className="relative max-w-screen-xl mx-auto px-6 md:px-12 lg:px-16">

                    {/* ── Header row ── */}
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
                        <div>
                            <motion.div
                                initial={{ opacity: 0, x: -14 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="flex items-center gap-2 mb-3"
                            >
                                <BookOpen className="w-3.5 h-3.5 text-[var(--green-bright)]" />
                                <span style={{ fontFamily: "'Caveat', cursive" }} className="text-[var(--green-bright)] text-sm font-bold tracking-wide">
                                    The Library
                                </span>
                                <WiggleLine color="var(--green-bright)" className="w-16 h-3 opacity-50" />
                            </motion.div>

                            <motion.h2
                                initial={{ opacity: 0, y: 18 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.07 }}
                                className="font-playfair text-3xl md:text-5xl font-black leading-tight"
                            >
                                Deep Dives{' '}
                                <span className="relative inline-block">
                                    <span className="text-[var(--foreground)]/25">&amp; Discoveries.</span>
                                    <svg viewBox="0 0 240 10" fill="none" className="absolute -bottom-1 left-0 w-full" aria-hidden="true">
                                        <path d="M2 6 C50 1,120 9,170 5 S210 1,238 6" stroke="var(--green-bright)" strokeWidth="2.5" strokeLinecap="round" fill="none" className="opacity-40" />
                                    </svg>
                                </span>
                            </motion.h2>
                        </div>

                        {/* CTA */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="shrink-0"
                        >
                            <Link
                                href="/blog"
                                className="group relative inline-flex items-center gap-2 px-7 py-3.5 font-black text-[10px] uppercase tracking-widest transition-transform hover:scale-105"
                            >
                                <svg
                                    className="absolute inset-0 w-full h-full pointer-events-none"
                                    preserveAspectRatio="none"
                                    viewBox="0 0 170 46"
                                    fill="none"
                                    aria-hidden="true"
                                >
                                    <path
                                        d="M5 8 C48 2,122 2,165 7 S170 18,168 34 S162 43,130 44 S38 45,8 42 S1 35,2 23 S3 13,5 8Z"
                                        fill="var(--foreground)"
                                    />
                                </svg>
                                <span className="relative z-10 text-[var(--background)]">Read All Articles</span>
                                <ArrowUpRight className="relative z-10 w-3 h-3 text-[var(--background)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                            </Link>
                        </motion.div>
                    </div>

                    {/* ── Content: featured left + stacked right ── */}
                    <div className="grid grid-cols-1 lg:grid-cols-[55fr_45fr] gap-10 lg:gap-14 items-start">

                        {/* featured big card */}
                        <FeaturedCard blog={featured} />

                        {/* right column: 2 stacked small cards */}
                        <div className="flex flex-col gap-8 lg:gap-10 lg:pt-2">
                            {rest.map((blog, i) => (
                                <SmallCard key={blog.id} blog={blog} index={i} />
                            ))}

                            {/* decorative note */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.3 }}
                                className="flex items-center gap-3 mt-2"
                            >
                                <WiggleLine color="var(--green-bright)" className="flex-1 h-3 opacity-15" />
                                <span
                                    style={{ fontFamily: "'Caveat', cursive" }}
                                    className="text-white/20 text-xs tracking-wide whitespace-nowrap"
                                >
                                    ✦ more stories soon ✦
                                </span>
                                <WiggleLine color="var(--green-bright)" className="flex-1 h-3 opacity-15" />
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}