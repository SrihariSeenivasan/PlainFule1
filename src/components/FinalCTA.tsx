'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import Image from 'next/image';

export default function FinalCTA() {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end end'] });
    const productScale = useTransform(scrollYProgress, [0, 0.6], [0.85, 1]);
    const productY = useTransform(scrollYProgress, [0, 0.6], [40, 0]);

    return (
        <section id="buy" ref={ref} className="overflow-hidden">

            {/* CTA Section */}
            <div className="bg-[#3a6b35] text-white py-24 md:py-32 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#3a6b35] via-[#2d5429] to-[#3a6b35]" />
                <div className="absolute inset-0 opacity-5">
                    <Image src="/images/ingredients.png" alt="" fill className="object-cover" />
                </div>

                <div className="max-w-6xl mx-auto px-6 md:px-10 flex flex-col lg:flex-row items-center gap-16 relative z-10">

                    {/* Product */}
                    <motion.div style={{ scale: productScale, y: productY }}
                        className="flex-shrink-0">
                        <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 4 }}
                            className="relative w-[240px] h-[320px] md:w-[320px] md:h-[420px]">
                            <Image src="/images/product.png" alt="Plainfuel" fill className="object-contain drop-shadow-2xl" />
                        </motion.div>
                    </motion.div>

                    {/* Content */}
                    <div className="flex-1 text-center lg:text-left">
                        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60 mb-6">Start Your Balance</p>
                            <h2 className="font-playfair text-4xl md:text-6xl font-bold leading-tight mb-6">
                                Return to balance. <br />Today.
                            </h2>
                            <p className="text-lg text-white/70 max-w-lg mb-8">
                                One scoop. One minute. Every day. That&apos;s all it takes to bridge the nutritional gap.
                            </p>

                            {/* Price Box */}
                            <div className="inline-block bg-white/10 rounded-2xl p-6 border border-white/10 mb-8">
                                <div className="flex items-baseline gap-3">
                                    <span className="font-playfair text-4xl font-bold">₹599</span>
                                    <span className="text-white/50 line-through">₹899</span>
                                    <span className="bg-white/20 text-xs font-bold px-2 py-1 rounded-full">33% OFF</span>
                                </div>
                                <p className="text-white/50 text-sm mt-2">30 servings • Free shipping</p>
                            </div>

                            <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                                <motion.button whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}
                                    className="inline-flex items-center gap-2 bg-white text-[#3a6b35] font-bold px-10 py-4 rounded-full shadow-xl hover:shadow-2xl transition-shadow text-lg">
                                    Buy Now
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                                </motion.button>
                            </div>

                            {/* Trust */}
                            <div className="flex flex-wrap gap-6 mt-8 text-white/40 text-xs font-medium uppercase tracking-wider justify-center lg:justify-start">
                                <span>30-day guarantee</span>
                                <span>•</span>
                                <span>Free shipping</span>
                                <span>•</span>
                                <span>Lab tested</span>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* FAQ Quick */}
            <div className="bg-[#fafaf7] py-16 md:py-24">
                <div className="max-w-3xl mx-auto px-6 md:px-10">
                    <h3 className="font-playfair text-3xl font-bold text-[#171717] text-center mb-12">Quick answers</h3>
                    {[
                        { q: 'Is this a meal replacement?', a: 'No. Plainfuel is a meal completer — it adds what your regular food misses.' },
                        { q: 'Why not 100% of daily nutrients?', a: 'Because your food already provides some. We only fill the gap, intentionally.' },
                        { q: 'What does it taste like?', a: 'Neutral. It blends into your oats, batter, smoothie, or atta without changing the taste.' },
                        { q: 'Is it safe for daily use?', a: 'Yes. Lab tested, FSSAI approved, made with real food ingredients. No artificial anything.' },
                    ].map((faq, i) => (
                        <motion.div key={i}
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.08 }}
                            className="border-b border-black/5 py-6">
                            <p className="font-semibold text-[#171717] text-lg">{faq.q}</p>
                            <p className="text-[#171717]/50 mt-2">{faq.a}</p>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-[#171717] text-white">
                <div className="max-w-6xl mx-auto px-6 md:px-10 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
                    <span className="font-playfair text-xl font-bold">Plainfuel</span>
                    <div className="flex gap-8 text-sm text-white/40">
                        <a href="#" className="hover:text-white transition-colors">Instagram</a>
                        <a href="#" className="hover:text-white transition-colors">Twitter</a>
                        <a href="#" className="hover:text-white transition-colors">Email</a>
                    </div>
                    <p className="text-xs text-white/20">© 2026 Plainfuel. All rights reserved.</p>
                </div>
            </footer>
        </section>
    );
}
