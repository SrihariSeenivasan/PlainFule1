'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { CheckCircle2, Droplets, Target, Wind } from 'lucide-react';
import SketchHighlight from './SketchHighlight';

const stats = [
    { val: '26', label: 'Micronutrients', icon: CheckCircle2 },
    { val: '100%', label: 'Clean Label', icon: Wind },
    { val: '0', label: 'Fillers', icon: Droplets },
    { val: '1', label: 'Scoop Daily', icon: Target },
];

export default function BalanceTransition() {
    return (
        <section className="bg-[var(--background)] section-pad relative overflow-hidden">

            {/* Background */}
            <div className="absolute inset-0">
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full"
                    style={{ background: 'radial-gradient(circle, rgba(58,107,53,0.12) 0%, transparent 70%)' }} />
            </div>

            <div className="max-w-screen-xl mx-auto px-6 md:px-12 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">

                    {/* Left: Product visual */}
                    <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.9 }}
                        className="relative"
                    >
                        <div className="relative w-full max-w-[400px] mx-auto aspect-[4/5]">
                            {/* Glow */}
                            <div className="absolute inset-0 rounded-full blur-3xl"
                                style={{ background: 'radial-gradient(circle, rgba(58,107,53,0.25) 0%, transparent 70%)' }} />

                            <Image
                                src="/images/product_premium.png"
                                alt="Plainfuel Solution"
                                fill
                                className="object-contain relative z-10 filter brightness-[1.1]"
                            />

                            {/* Floating cards */}
                            <motion.div
                                animate={{ y: [0, -10, 0] }}
                                transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                                className="absolute -top-6 -right-6 glass rounded-2xl px-5 py-4 z-20 shadow-xl"
                            >
                                <div className="flex items-center gap-3">
                                    <Target className="w-5 h-5 text-[#7cb342]" />
                                    <div>
                                        <p className="text-[10px] uppercase tracking-widest text-[#7cb342] font-black">Target</p>
                                        <p className="text-[var(--foreground)] font-bold text-sm">Bio-Baseline</p>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div
                                animate={{ y: [0, 10, 0] }}
                                transition={{ repeat: Infinity, duration: 4, delay: 0.8, ease: 'easeInOut' }}
                                className="absolute -bottom-6 -left-6 glass-green rounded-2xl px-5 py-4 z-20 shadow-xl"
                            >
                                <div className="flex items-center gap-3">
                                    <Droplets className="w-5 h-5 text-[#7cb342]" />
                                    <div>
                                        <p className="text-[10px] uppercase tracking-widest text-[#7cb342] font-black">Purity</p>
                                        <p className="text-[var(--foreground)] font-bold text-sm">Zero Fillers</p>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* Right: Copy */}
                    <motion.div
                        initial={{ opacity: 0, x: 40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.9, delay: 0.15 }}
                    >
                        <div className="tag-pill mb-8">The Biological Completion</div>

                        <h2 className="font-playfair text-5xl md:text-7xl font-black text-[var(--foreground)] leading-[0.9] tracking-tight mb-8">
                            The exact<br />
                            <span className="font-playfair italic text-[var(--foreground)]/20">delta,</span>{' '}
                            <SketchHighlight type="circle" delay={1} color="#053b05">
                                <span style={{ background: 'linear-gradient(135deg, #7cb342, #053b05)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>solved.</span>
                            </SketchHighlight>
                        </h2>

                        <p className="text-[var(--foreground)]/50 text-lg font-light leading-relaxed mb-14 max-w-md">
                            We meticulously mapped the nutritional gaps of the modern Indian habit. Plainfuel is the result — a surgical addition to your day that changes nothing about your taste, but everything about your longevity.
                        </p>

                        {/* Stats */}
                        <div className="grid grid-cols-2 gap-4">
                            {stats.map((stat, i) => {
                                const Icon = stat.icon;
                                return (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: 0.3 + i * 0.1 }}
                                        className="glass rounded-2xl p-6"
                                    >
                                        <Icon className="w-5 h-5 text-[#7cb342] mb-3 opacity-50" />
                                        <p className="font-playfair text-4xl font-black text-[var(--foreground)] mb-1">{stat.val}</p>
                                        <p className="text-[10px] uppercase tracking-widest text-[#7cb342] font-black">{stat.label}</p>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
