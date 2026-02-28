'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import SketchHighlight from '../SketchHighlight';

export default function Herosection() {
    return (
        <section className="relative min-h-[90vh] flex items-center overflow-hidden py-20 bg-[var(--background)]">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[var(--green-glow)] rounded-full blur-[120px] -mr-64 -mt-64 opacity-50" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[var(--green-glow)] rounded-full blur-[100px] -ml-48 -mb-48 opacity-30" />

            <div className="max-w-screen-xl mx-auto px-6 md:px-12 relative z-10 w-full">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Left: Info & Motto */}
                    <div className="order-2 lg:order-1">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="tag-pill mb-6"
                        >
                            Our Mission
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="font-playfair text-5xl md:text-7xl font-black mb-6 leading-tight"
                        >
                            The Motto: <br />
                            <SketchHighlight type="underline" delay={0.6}>
                                <span className="gradient-text">Bridge the Gap.</span>
                            </SketchHighlight>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="text-lg md:text-xl text-[var(--foreground)]/60 mb-10 max-w-lg leading-relaxed"
                        >
                            We identified the precise nutritional deficits in the modern Indian diet.
                            PlainFuel isn't just another supplement; it's the missing piece of your daily nutrition,
                            packaged in a precise, invisible daily pouch.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                        >
                            <button className="group glass-green px-8 py-4 rounded-full font-bold flex items-center gap-3 hover:bg-[var(--green-mid)] transition-all duration-300">
                                EXPLORE OUR STORY
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </motion.div>
                    </div>

                    {/* Right: Product Image */}
                    <div className="order-1 lg:order-2 flex justify-center">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                            viewport={{ once: true }}
                            transition={{ type: "spring", damping: 15 }}
                            className="relative w-full max-w-md aspect-square"
                        >
                            <div className="absolute inset-0 bg-gradient-to-tr from-[var(--green-mid)]/20 to-transparent rounded-full blur-2xl" />
                            <Image
                                src="/images/product_premium.png"
                                alt="Plainfuel Product"
                                fill
                                className="object-contain float-anim"
                            />
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}
