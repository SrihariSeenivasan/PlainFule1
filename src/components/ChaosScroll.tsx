'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

export default function ChaosScroll() {
    return (
        <section id="story" className="relative bg-[#171717] text-white overflow-hidden">
            {/* Full-width lifestyle image band */}
            <div className="relative h-[50vh] md:h-[60vh]">
                <Image src="/images/lifestyle.png" alt="Using Plainfuel" fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-b from-[#171717]/60 via-transparent to-[#171717]" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                        className="font-playfair text-4xl md:text-6xl font-bold text-white text-center px-6 drop-shadow-lg max-w-3xl leading-tight">
                        Your daily food was never broken. It was just <span className="text-[#7cb342]">incomplete.</span>
                    </motion.p>
                </div>
            </div>

            {/* The Story — editorial grid */}
            <div className="max-w-6xl mx-auto px-6 md:px-10 py-24 md:py-32">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-12">

                    {/* Left — Main story */}
                    <div className="md:col-span-7">
                        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#7cb342] mb-6">The Problem</p>
                            <h2 className="font-playfair text-4xl md:text-5xl font-bold leading-tight mb-8">
                                The internet told us our food was broken. But it was only half the truth.
                            </h2>
                            <div className="space-y-6 text-white/60 text-lg leading-relaxed">
                                <p>First, everyone said Indian diets lack protein. Not false — but not the whole story either.</p>
                                <p>Then fibre became the villain. An adult needs 25-40g per day. Most of us get less than half.</p>
                                <p>Then micronutrients. Then gut health. Every few months, a new trend, a new deficiency scare, a new product to buy.</p>
                                <p className="text-white font-medium text-xl">The real problem was never one nutrient. It was the <span className="text-[#7cb342]">overall imbalance.</span></p>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right — Stats side */}
                    <div className="md:col-span-5 space-y-6">
                        {[
                            { num: '73%', label: 'of Indians are protein deficient', color: 'border-red-500/30 bg-red-500/10' },
                            { num: '<15g', label: 'average daily fibre intake (vs 25-40g needed)', color: 'border-amber-500/30 bg-amber-500/10' },
                            { num: '76%', label: 'lack adequate Vitamin D', color: 'border-blue-500/30 bg-blue-500/10' },
                            { num: '4+', label: 'supplements most people buy separately', color: 'border-purple-500/30 bg-purple-500/10' },
                        ].map((s, i) => (
                            <motion.div key={s.label}
                                initial={{ opacity: 0, x: 30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className={`p-6 rounded-2xl border ${s.color}`}>
                                <p className="font-playfair text-4xl font-bold text-white">{s.num}</p>
                                <p className="text-white/50 text-sm mt-2">{s.label}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
