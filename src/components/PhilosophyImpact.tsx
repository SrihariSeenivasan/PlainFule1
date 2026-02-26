'use client';

import { motion } from 'framer-motion';

export default function PhilosophyImpact() {
    return (
        <section className="bg-[#0a0a0a] section-pad relative overflow-hidden">
            {/* Large background text */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
                <span className="font-playfair text-[25vw] font-black text-white/[0.025] leading-none whitespace-nowrap">PURITY</span>
            </div>

            {/* Green glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full blur-[120px]"
                style={{ background: 'radial-gradient(ellipse, rgba(58,107,53,0.2) 0%, transparent 70%)' }} />

            <div className="max-w-4xl mx-auto px-6 md:px-12 relative z-10 text-center">

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                >
                    <div className="tag-pill mb-10 mx-auto" style={{ display: 'inline-flex' }}>The Manifest</div>
                </motion.div>

                <motion.h2
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.9, delay: 0.1 }}
                    className="font-playfair text-5xl md:text-8xl font-black text-white leading-[0.9] tracking-tight mb-10"
                >
                    Clean is{' '}
                    <span className="font-playfair italic text-white/20">not enough.</span>
                    <br />
                    Efficiency{' '}
                    <span style={{ background: 'linear-gradient(135deg, #7cb342, #3a6b35)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>is.</span>
                </motion.h2>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left border-t pt-10 mt-10"
                    style={{ borderColor: 'rgba(255,255,255,0.06)' }}
                >
                    <p className="text-white/60 text-lg font-light leading-relaxed">
                        We don&apos;t build for the trend. We build for the long-term metabolism of the modern individual.
                    </p>
                    <p className="text-white/30 text-base leading-relaxed font-light">
                        Plainfuel is the result of stripping away the supplement industry&apos;s noise. No megadoses. No fillers. Just the exact delta between your plate and your potential.
                    </p>
                </motion.div>

                {/* Glow line */}
                <motion.div
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, delay: 0.4 }}
                    className="h-px mt-16"
                    style={{ background: 'linear-gradient(90deg, transparent, #7cb342, transparent)', transformOrigin: 'left' }}
                />
            </div>
        </section>
    );
}
