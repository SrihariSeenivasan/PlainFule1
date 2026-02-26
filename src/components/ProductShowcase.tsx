'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import Image from 'next/image';

export default function ProductShowcase() {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
    const imgScale = useTransform(scrollYProgress, [0, 0.5], [0.8, 1.05]);
    const imgRotate = useTransform(scrollYProgress, [0, 0.5, 1], [-3, 0, 3]);

    return (
        <section ref={ref} id="how-it-works" className="bg-[#fafaf7] py-24 md:py-32 overflow-hidden">
            <div className="max-w-6xl mx-auto px-6 md:px-10">

                <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                    className="text-center mb-20">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#3a6b35] mb-4">How It Works</p>
                    <h2 className="font-playfair text-4xl md:text-6xl font-bold text-[#171717] leading-tight">
                        Balance in <span className="text-[#3a6b35]">three steps.</span>
                    </h2>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6">
                    {[
                        { step: '01', title: 'Add one scoop', desc: 'To your morning dosa batter, oats, smoothie, or roti atta.', img: '/images/scoop.png' },
                        { step: '02', title: 'Eat as usual', desc: 'No taste change. No special prep. It fits into what you already eat.', img: '/images/lifestyle.png' },
                        { step: '03', title: 'Stay complete', desc: 'Your daily meal now covers protein, fibre, and micronutrient gaps.', img: '/images/product.png' },
                    ].map((s, i) => (
                        <motion.div key={s.step}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.15, duration: 0.6 }}
                            whileHover={{ y: -8 }}
                            className="group rounded-3xl overflow-hidden bg-white border border-black/5 shadow-sm hover:shadow-xl transition-all duration-500">

                            {/* Image */}
                            <div className="relative h-56 overflow-hidden">
                                <Image src={s.img} alt={s.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                                <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
                                <span className="absolute top-4 left-4 bg-[#3a6b35] text-white text-xs font-bold px-3 py-1.5 rounded-full">{s.step}</span>
                            </div>

                            {/* Text */}
                            <div className="p-6 md:p-8">
                                <h3 className="font-playfair text-2xl font-bold text-[#171717] mb-3">{s.title}</h3>
                                <p className="text-[#171717]/50 leading-relaxed">{s.desc}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
