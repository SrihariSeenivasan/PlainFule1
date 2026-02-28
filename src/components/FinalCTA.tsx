'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { ArrowRight, Instagram, Mail, Twitter } from 'lucide-react';
import SketchHighlight from './SketchHighlight';

const faqs = [
    { q: 'Is this a meal replacement?', a: 'Plainfuel is a completer. We provide the 20% your high-quality meals usually miss — not a replacement.' },
    { q: 'Why neutral taste?', a: 'Habit science. We integrated into your current meals so you don\'t have to change your palette.' },
    { q: 'Is it safe?', a: 'Standardized by pharmacists. FSSAI certified. No artificial fillers, megadoses or synthetics.' },
    { q: 'How do I use it?', a: 'One scoop in your morning oats, smoothie, or batter. It disappears instantly — no texture, no taste.' },
];

export default function FinalCTA() {
    return (
        <section id="buy" className="bg-[var(--background)]">

            {/* CTA Block */}
            <div className="relative overflow-hidden section-pad">
                {/* Background */}
                <div className="absolute inset-0">
                    <Image src="/images/hero-bg.png" alt="" fill className="object-cover opacity-[0.07] blur-xl" />
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(58,107,53,0.15) 0%, transparent 60%)' }} />
                </div>

                <div className="max-w-screen-xl mx-auto px-6 md:px-12 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">

                        {/* Left: Product */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.92 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1 }}
                            className="flex justify-center lg:justify-start"
                        >
                            <div className="relative w-[280px] md:w-[380px] aspect-[3/4]">
                                <div className="absolute inset-[-15%] rounded-full blur-3xl"
                                    style={{ background: 'radial-gradient(circle, rgba(58,107,53,0.3) 0%, transparent 70%)' }} />
                                <div className="float-anim relative w-full h-full">
                                    <Image
                                        src="/images/product_premium.png"
                                        alt="Order Plainfuel"
                                        fill
                                        className="object-contain filter brightness-[1.1]"
                                    />
                                </div>
                            </div>
                        </motion.div>

                        {/* Right: CTA copy */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.9, delay: 0.15 }}
                        >
                            <div className="tag-pill mb-8">The New Protocol</div>

                            <h2 className="font-playfair text-5xl md:text-7xl font-black text-[var(--foreground)] leading-[0.9] tracking-tight mb-8">
                                Begin the<br />
                                <SketchHighlight type="circle" color="#053b05" delay={1}>
                                    <span style={{ background: 'linear-gradient(135deg, #7cb342, #053b05)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}
                                        className="font-playfair italic">Completion.</span>
                                </SketchHighlight>
                            </h2>

                            <p className="text-[var(--foreground)]/50 text-lg font-light leading-relaxed mb-10 max-w-md">
                                Your biology doesn&apos;t wait for the right moment. Start bridging the gap today with the only precision habit built for urban life.
                            </p>

                            {/* Price card */}
                            <div className="glass-green rounded-3xl p-8 mb-10 inline-block w-full">
                                <div className="flex items-baseline gap-4 mb-3">
                                    <span className="font-playfair text-6xl font-black text-[var(--foreground)]">₹599</span>
                                    <span className="text-[var(--foreground)]/20 line-through text-2xl">₹899</span>
                                    <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full"
                                        style={{ background: '#053b05', color: '#fff' }}>33% OFF</span>
                                </div>
                                <p className="text-[#053b05] text-xs font-black uppercase tracking-widest">30 Servings • Free Shipping • Launch Price</p>
                            </div>

                            <motion.a
                                href="#"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="group inline-flex items-center gap-4 bg-gradient-to-r from-[#053b05] to-[#4a8540] text-white px-10 py-5 rounded-full font-bold text-sm uppercase tracking-[0.1em] shadow-[0_8px_40px_rgba(58,107,53,0.5)] hover:shadow-[0_8px_60px_rgba(122,195,66,0.4)] transition-all duration-300 mb-8 w-full justify-center md:w-auto md:justify-start"
                            >
                                Reserve Your Protocol
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </motion.a>

                            <div className="flex flex-wrap gap-6 text-[10px] font-black uppercase tracking-[0.12em] text-[var(--foreground)]/30">
                                <span>Risk Free</span>
                                <span>•</span>
                                <span>Dermatologically Safe</span>
                                <span>•</span>
                                <span>Lab Verified</span>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* FAQ Block */}
            <div className="border-t section-pad" style={{ borderColor: 'rgba(255,255,255,0.06)', background: 'var(--dark-2)' }}>
                <div className="max-w-screen-xl mx-auto px-6 md:px-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mb-12"
                    >
                        <div className="tag-pill mb-4">Biological Logic</div>
                        <h3 className="font-playfair text-4xl font-bold text-[var(--foreground)]">Common Questions</h3>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {faqs.map((faq, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="glass rounded-2xl p-7"
                            >
                                <p className="text-[var(--foreground)] font-bold text-base mb-3">{faq.q}</p>
                                <p className="text-[var(--foreground)]/50 text-sm font-light leading-relaxed">{faq.a}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="border-t py-10" style={{ borderColor: 'rgba(255,255,255,0.06)', background: 'var(--background)' }}>
                <div className="max-w-screen-xl mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white font-black text-sm"
                            style={{ background: 'linear-gradient(135deg, #053b05, #7cb342)' }}>P</div>
                        <span className="font-playfair text-xl font-bold text-[var(--foreground)] tracking-tight">Plainfuel</span>
                    </div>
                    <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest text-[var(--foreground)]/40">
                        <a href="#" className="hover:text-[#7cb342] transition-colors flex items-center gap-2">
                            <Instagram className="w-4 h-4" /> Instagram
                        </a>
                        <a href="#" className="hover:text-[#7cb342] transition-colors flex items-center gap-2">
                            <Twitter className="w-4 h-4" /> Twitter
                        </a>
                        <a href="#" className="hover:text-[#7cb342] transition-colors flex items-center gap-2">
                            <Mail className="w-4 h-4" /> Contact
                        </a>
                    </div>
                    <p className="text-[10px] font-mono text-[var(--foreground)]/20 uppercase tracking-widest">© 2026 Designed for Longevity.</p>
                </div>
            </footer>
        </section>
    );
}
