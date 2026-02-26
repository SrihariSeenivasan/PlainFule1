'use client';

import { motion } from 'framer-motion';

export default function PhilosophyImpact() {
    return (
        <section className="bg-[#171717] text-white py-24 md:py-32 overflow-hidden relative">
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            <div className="max-w-4xl mx-auto px-6 md:px-10 text-center">
                <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#7cb342] mb-8">Our Philosophy</p>

                    <div className="space-y-8">
                        <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
                            className="font-playfair text-3xl md:text-5xl text-white/40 leading-tight">
                            Today, every brand screams &ldquo;clean.&rdquo;
                        </motion.p>
                        <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
                            className="font-playfair text-3xl md:text-5xl text-white/60 leading-tight">
                            Clean should be the bare minimum.
                        </motion.p>
                        <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.4 }}
                            className="font-playfair text-4xl md:text-6xl text-white font-bold leading-tight">
                            Clean alone is <span className="text-[#7cb342]">not enough.</span>
                        </motion.p>
                    </div>

                    <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.6 }}
                        className="mt-16 pt-16 border-t border-white/10">
                        <h2 className="font-playfair text-6xl md:text-8xl lg:text-[10rem] font-bold tracking-tighter leading-none">
                            <span className="text-[#7cb342]">Balance</span> is.
                        </h2>
                        <p className="mt-8 text-lg md:text-xl text-white/50 max-w-xl mx-auto">
                            And Plainfuel exists to make that balance simple, affordable, and practical — <span className="text-white font-medium">once and for all.</span>
                        </p>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}
