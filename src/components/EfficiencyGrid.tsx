'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Star } from 'lucide-react';

const reviews = [
    {
        name: 'Amaan Bakali',
        role: 'Owner & Coach, CrossFit Third Eye',
        quote: 'Finally a truly delicious and quality protein powder.',
        img: '/images/user1.png',
        stars: 5,
    },
    {
        name: 'Prerna Maarvikurne',
        role: 'Student, Oberoi International',
        quote: "It's so tasty, I didn't even feel like I was having a supplement.",
        img: '/images/user2.png',
        stars: 5,
    },
    {
        name: 'Shailin Suvarna',
        role: 'Antal International, India Partner',
        quote: 'Found my go-to daily ritual. Simple and effective.',
        img: '/images/user3.png',
        stars: 5,
    },
    {
        name: 'Arjun Singh',
        role: 'Partnerships, Thought Over Design',
        quote: 'Tastes like it\'s been freshly squeezed. Blends into everything.',
        img: '/images/user4.png',
        stars: 5,
    },
];

export default function EfficiencyGrid() {
    return (
        <section className="bg-[#050505] section-pad relative overflow-hidden">
            <div className="max-w-screen-xl mx-auto px-6 md:px-12">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="flex flex-col md:flex-row items-start md:items-end justify-between mb-16 gap-8"
                >
                    <div>
                        <div className="tag-pill mb-6">Real People. Real Results.</div>
                        <h2 className="font-playfair text-5xl md:text-7xl font-black text-white leading-[0.9] tracking-tight">
                            Real people.<br />
                            <span className="font-playfair italic text-white/20">Real love.</span>
                        </h2>
                    </div>
                    <div className="text-right">
                        <p className="font-playfair text-5xl font-black text-[#7cb342]">4.9</p>
                        <div className="flex justify-end gap-1 my-2">
                            {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-[#7cb342] text-[#7cb342]" />)}
                        </div>
                        <p className="text-white/25 text-sm">Average rating</p>
                    </div>
                </motion.div>

                {/* Review cards grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {reviews.map((r, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.7, delay: i * 0.1 }}
                            className="group glass rounded-3xl p-6 flex flex-col gap-6 hover:border-[rgba(122,195,66,0.2)] transition-all duration-500"
                        >
                            {/* Stars */}
                            <div className="flex gap-1">
                                {[...Array(r.stars)].map((_, s) => (
                                    <Star key={s} className="w-3.5 h-3.5 fill-[#7cb342] text-[#7cb342]" />
                                ))}
                            </div>

                            {/* Quote */}
                            <p className="text-white/70 text-base font-light leading-relaxed flex-1">
                                &ldquo;{r.quote}&rdquo;
                            </p>

                            {/* Avatar */}
                            <div className="relative w-full aspect-square rounded-2xl overflow-hidden">
                                <Image
                                    src={r.img}
                                    alt={r.name}
                                    fill
                                    className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent opacity-60" />
                            </div>

                            {/* Name */}
                            <div>
                                <p className="text-white font-bold text-sm">{r.name}</p>
                                <p className="text-white/25 text-xs mt-1 leading-snug">{r.role}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
