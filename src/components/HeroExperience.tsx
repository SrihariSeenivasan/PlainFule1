'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { ArrowRight, Star } from 'lucide-react';
import SketchHighlight from './SketchHighlight';

export default function HeroExperience() {
    return (
        <section className="relative min-h-screen bg-[#FAF9F6] flex items-center overflow-hidden">

            {/* Background radial glow */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full"
                    style={{ background: 'radial-gradient(circle, rgba(58,107,53,0.12) 0%, transparent 70%)' }} />
                <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full"
                    style={{ background: 'radial-gradient(circle, rgba(122,195,66,0.05) 0%, transparent 70%)' }} />
            </div>

            {/* Grid pattern */}
            <div className="absolute inset-0 z-0 opacity-[0.05]"
                style={{ backgroundImage: 'linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)', backgroundSize: '80px 80px' }} />

            <div className="max-w-screen-xl mx-auto px-6 md:px-12 pt-28 pb-16 relative z-10 w-full">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center min-h-[calc(100vh-7rem)]">

                    {/* Left: Copy */}
                    <div>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.1 }}
                            className="tag-pill mb-8"
                        >
                            <span className="w-1.5 h-1.5 rounded-full bg-[#7cb342] pulse-dot" />
                            Now Taking Pre-Orders
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.9, delay: 0.2 }}
                            className="font-playfair text-[4rem] md:text-[5.5rem] lg:text-[6.5rem] font-black leading-[0.88] tracking-tight text-[#121812] mb-8"
                        >
                            The{' '}
                            <SketchHighlight type="circle" delay={1.2}>
                                <span className="font-playfair italic" style={{ background: 'linear-gradient(135deg, #7cb342, #3a6b35)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                                    Delta.
                                </span>
                            </SketchHighlight>
                            <br />
                            <span className="text-[#121812]/20">Complete.</span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.35 }}
                            className="text-xl text-[#121812]/50 font-light leading-relaxed mb-12 max-w-md"
                        >
                            One invisible scoop. 26 micronutrients. The precise gap between what your Indian diet gives you and what your body actually needs — bridged.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.5 }}
                            className="flex flex-wrap items-center gap-4 mb-14"
                        >
                            <a href="#buy"
                                className="group inline-flex items-center gap-3 bg-gradient-to-r from-[#3a6b35] to-[#4a8540] text-white px-8 py-4 rounded-full font-bold text-sm uppercase tracking-[0.1em] shadow-[0_8px_30px_rgba(58,107,53,0.4)] hover:shadow-[0_8px_40px_rgba(122,195,66,0.4)] hover:-translate-y-0.5 transition-all duration-200">
                                Pre-Order Now
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </a>
                            <a href="#investigation"
                                className="inline-flex items-center gap-2 text-[#121812]/40 hover:text-[#121812] text-sm font-semibold tracking-wide transition-colors">
                                See the science
                                <span className="text-[#7cb342]">↓</span>
                            </a>
                        </motion.div>

                        {/* Trust bar */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 1, delay: 0.7 }}
                            className="flex flex-wrap items-center gap-6"
                        >
                            {['FSSAI Certified', 'Zero Fillers', '26 Micronutrients', 'Lab Verified'].map((tag, i) => (
                                <div key={i} className="flex items-center gap-2">
                                    <div className="w-1 h-1 rounded-full bg-[#7cb342]" />
                                    <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#121812]/30">{tag}</span>
                                </div>
                            ))}
                        </motion.div>
                    </div>

                    {/* Right: Product Visual */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 1.1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        className="relative flex justify-center lg:justify-end"
                    >
                        <div className="relative w-[280px] md:w-[360px] lg:w-[420px] aspect-[3/4]">
                            {/* Glow ring */}
                            <div className="absolute inset-[-20%] rounded-full opacity-40"
                                style={{ background: 'radial-gradient(circle, rgba(58,107,53,0.35) 0%, transparent 70%)' }} />

                            {/* Product image */}
                            <div className="float-anim relative w-full h-full">
                                <Image
                                    src="/images/product_premium.png"
                                    alt="Plainfuel — The Meal Completer"
                                    fill
                                    className="object-contain filter brightness-[1.1] contrast-[1.05]"
                                    priority
                                />
                            </div>

                            {/* Floating badge — rating */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.8 }}
                                className="absolute top-8 -left-8 glass rounded-2xl px-5 py-4 shadow-xl"
                            >
                                <div className="flex items-center gap-2 mb-1">
                                    {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 fill-[#7cb342] text-[#7cb342]" />)}
                                </div>
                                <p className="text-[#121812] text-sm font-bold">4.9/5</p>
                                <p className="text-[#121812]/40 text-[10px]">Early adopters</p>
                            </motion.div>

                            {/* Floating badge — price */}
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 1 }}
                                className="absolute bottom-12 -right-8 glass-green rounded-2xl px-5 py-4 shadow-xl"
                            >
                                <p className="text-[10px] uppercase tracking-widest text-[#7cb342] font-black mb-1">Launch Price</p>
                                <p className="text-[#121812] text-2xl font-black">₹599</p>
                                <p className="text-[#121812]/30 text-xs line-through">₹899</p>
                            </motion.div>
                        </div>
                    </motion.div>

                </div>
            </div>

            {/* Bottom fade */}
            <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-[#FAF9F6] to-transparent z-10" />
        </section>
    );
}
