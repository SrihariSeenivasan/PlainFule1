'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import Image from 'next/image';

export default function BalanceTransition() {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
    const productScale = useTransform(scrollYProgress, [0, 0.5], [0.85, 1]);
    const productY = useTransform(scrollYProgress, [0, 0.5], [60, 0]);

    return (
        <section ref={ref} className="relative bg-[#f4f1ec] overflow-hidden">

            {/* SOLUTION — Full width + Product */}
            <div className="max-w-6xl mx-auto px-6 md:px-10 py-24 md:py-32">

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                    {/* Product with scroll animation */}
                    <motion.div style={{ scale: productScale, y: productY }}
                        className="relative flex items-center justify-center order-2 lg:order-1">
                        <div className="absolute w-[380px] h-[380px] md:w-[500px] md:h-[500px] rounded-full bg-[#3a6b35]/5 blur-[60px]" />
                        <div className="relative w-[280px] h-[360px] md:w-[380px] md:h-[480px]">
                            <Image src="/images/product.png" alt="Plainfuel" fill className="object-contain drop-shadow-2xl" />
                        </div>
                    </motion.div>

                    {/* Text */}
                    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                        className="order-1 lg:order-2">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#3a6b35] mb-6">The Solution</p>
                        <h2 className="font-playfair text-4xl md:text-6xl font-bold text-[#171717] leading-tight mb-8">
                            Everything your meals miss. <span className="text-[#3a6b35]">In one scoop.</span>
                        </h2>
                        <p className="text-lg text-[#171717]/60 leading-relaxed mb-10">
                            Instead of buying 4 separate supplements, Plainfuel brings protein, fibre, and essential micronutrients together — in meaningful, balanced amounts.
                        </p>

                        {/* Feature list */}
                        <div className="space-y-5">
                            {[
                                { icon: '🥩', label: 'Complete Protein', desc: 'Full amino acid profile for daily muscle needs' },
                                { icon: '🌾', label: '6g Fibre Per Serve', desc: 'Towards your 25-40g daily requirement' },
                                { icon: '💊', label: '~40% Micronutrients', desc: 'Vitamin D3, B-complex, magnesium, calcium' },
                                { icon: '⚡', label: 'Balanced Macros', desc: 'No excess — designed to complement your meals' },
                            ].map((f, i) => (
                                <motion.div key={f.label}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className="flex items-start gap-4 group">
                                    <span className="text-2xl mt-0.5 group-hover:scale-110 transition-transform">{f.icon}</span>
                                    <div>
                                        <p className="font-semibold text-[#171717]">{f.label}</p>
                                        <p className="text-sm text-[#171717]/50">{f.desc}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.5 }}
                            className="mt-10 inline-flex items-center gap-2 bg-[#3a6b35]/10 text-[#3a6b35] text-sm font-semibold px-5 py-2.5 rounded-full">
                            Not 100% — because your food already provides some ☝️
                        </motion.div>
                    </motion.div>
                </div>
            </div>

            {/* Ingredient Image Band */}
            <div className="relative h-[40vh] md:h-[50vh]">
                <Image src="/images/ingredients.png" alt="Natural ingredients" fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-b from-[#f4f1ec] via-transparent to-[#fafaf7]" />
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-md rounded-full px-6 py-3 shadow-lg">
                    <p className="text-sm font-semibold text-[#171717]">Real ingredients. No artificial anything. 🌿</p>
                </div>
            </div>
        </section>
    );
}
