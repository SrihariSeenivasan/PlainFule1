'use client';

import { motion } from 'framer-motion';
import { Play, Star, Quote } from 'lucide-react';

const videos = [1, 2, 3, 4];
const reviews = [
    {
        name: "Dr. Anirudh Sharma",
        role: "Sports Nutritionist",
        text: "Finally, a product that doesn't hide behind 'proprietary blends'. The transparency is as clean as the formula.",
        rating: 5
    },
    {
        name: "Priya Mehta",
        role: "Marathon Runner",
        text: "I added it to my morning chai, and I literally couldn't taste it. My energy levels have been rock solid ever since.",
        rating: 5
    }
];

export default function Peoplesection() {
    return (
        <section className="section-pad bg-[var(--dark-2)]">
            <div className="max-w-screen-xl mx-auto px-6 md:px-12">
                <div className="text-center mb-20">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="tag-pill mb-6 mx-auto"
                    >
                        Voices of Delta
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="font-playfair text-4xl md:text-6xl font-black mb-6"
                    >
                        Real Stories. <span className="text-[var(--foreground)]/30">Real Science.</span>
                    </motion.h2>
                </div>

                {/* Video Carousel/Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
                    {videos.map((vid, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="relative aspect-[9/16] bg-[var(--dark-3)] rounded-[2rem] overflow-hidden group cursor-pointer border border-white/5"
                        >
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />
                            <div className="absolute inset-0 flex items-center justify-center z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                                    <Play className="w-8 h-8 fill-white text-white translate-x-1" />
                                </div>
                            </div>
                            <div className="absolute bottom-6 left-6 z-20">
                                <p className="text-sm font-bold">User Story #{vid}</p>
                                <p className="text-[10px] uppercase text-white/40">Verified Customer</p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Reviews */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {reviews.map((review, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.2 }}
                            className="glass p-10 rounded-[3rem] relative"
                        >
                            <Quote className="absolute top-10 right-10 w-12 h-12 text-[var(--green-bright)]/10" />
                            <div className="flex gap-1 mb-6">
                                {[...Array(review.rating)].map((_, star) => (
                                    <Star key={star} className="w-4 h-4 fill-[var(--green-bright)] text-[var(--green-bright)]" />
                                ))}
                            </div>
                            <p className="text-xl md:text-2xl font-medium leading-relaxed mb-8 italic">
                                "{review.text}"
                            </p>
                            <div>
                                <h4 className="font-bold text-lg">{review.name}</h4>
                                <p className="text-sm text-[var(--foreground)]/40 font-semibold uppercase tracking-widest">{review.role}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
