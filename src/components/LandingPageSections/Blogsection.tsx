'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, ArrowUpRight } from 'lucide-react';

const blogs = [
    {
        id: 1,
        title: "The Indian Diet Gap: What's Missing in Your Thali?",
        excerpt: "Analyzing the nutritional profile of common Indian meals and identifying the consistent lack of specific micronutrients.",
        date: "Oct 24, 2025",
        image: "/images/ingredients.png"
    },
    {
        id: 2,
        title: "The Science of Bioavailability: Not All Vitamins are Created Equal.",
        excerpt: "Why the form of the vitamin you consume matters more than the amount you see on the label.",
        date: "Oct 12, 2025",
        image: "/images/scoop.png"
    }
];

export default function Blogsection() {
    return (
        <section className="section-pad bg-[var(--background)]">
            <div className="max-w-screen-xl mx-auto px-6 md:px-12">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
                    <div className="max-w-xl">
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            className="tag-pill mb-6"
                        >
                            The Library
                        </motion.div>
                        <motion.h2
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="font-playfair text-4xl md:text-7xl font-black"
                        >
                            Deep Dives <br />& <span className="text-[var(--foreground)]/30">Discoveries.</span>
                        </motion.h2>
                    </div>

                    <Link href="/blog" className="px-10 py-5 bg-[var(--foreground)] text-[var(--background)] rounded-full font-black text-sm uppercase tracking-widest hover:scale-105 transition-transform flex items-center gap-2">
                        READ ALL ARTICLES <ArrowUpRight className="w-4 h-4" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {blogs.map((blog, i) => (
                        <motion.article
                            key={blog.id}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.2 }}
                            className="group cursor-pointer"
                        >
                            <div className="relative aspect-[16/9] rounded-[2.5rem] overflow-hidden mb-8 border border-white/5">
                                <Image
                                    src={blog.image}
                                    alt={blog.title}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[var(--background)]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>

                            <div className="flex items-center gap-4 mb-4">
                                <span className="flex items-center gap-2 text-[var(--green-bright)] text-xs font-black uppercase tracking-widest">
                                    <Calendar className="w-4 h-4" />
                                    {blog.date}
                                </span>
                                <span className="w-1 h-1 rounded-full bg-white/20" />
                                <span className="text-white/40 text-xs font-bold uppercase tracking-widest">Research Paper</span>
                            </div>

                            <h3 className="text-3xl font-bold mb-4 group-hover:text-[var(--green-bright)] transition-colors leading-tight">
                                {blog.title}
                            </h3>
                            <p className="text-[var(--foreground)]/40 text-lg leading-relaxed mb-6">
                                {blog.excerpt}
                            </p>

                            <div className="h-[1px] w-full bg-white/5 group-hover:bg-[var(--green-bright)]/30 transition-colors" />
                        </motion.article>
                    ))}
                </div>
            </div>
        </section>
    );
}
