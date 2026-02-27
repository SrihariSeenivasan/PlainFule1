'use client';

import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';
import SketchHighlight from './SketchHighlight';

const rows = [
    { theirs: 'Whey Protein Powder', ours: 'Protein Included' },
    { theirs: 'Fibre Supplement', ours: 'Fibre Included' },
    { theirs: 'Multivitamin Tablet', ours: 'Micronutrients Included' },
    { theirs: 'Mineral Capsules', ours: 'Minerals Included' },
    { theirs: '₹1,500–2,500 / month', ours: '₹599 / month' },
    { theirs: '4+ products to manage', ours: '1 scoop. Done.' },
];

export default function NotAnother() {
    return (
        <section className="bg-[#FAF9F6] section-pad relative overflow-hidden">
            <div className="max-w-screen-xl mx-auto px-6 md:px-12">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="mb-16"
                >
                    <div className="tag-pill mb-6">The Transformation</div>
                    <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8">
                        <h2 className="font-playfair text-5xl md:text-7xl font-black text-[#121812] leading-[0.9] tracking-tight">
                            The old vs.<br />
                            <SketchHighlight type="underline" delay={0.6}>
                                <span style={{ background: 'linear-gradient(135deg, #7cb342, #3a6b35)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}
                                    className="font-playfair italic">Plainfuel.</span>
                            </SketchHighlight>
                        </h2>
                        <p className="text-[#121812]/35 text-lg font-light leading-relaxed max-w-sm md:text-right">
                            Stop managing a pharmacy. Start living a habit.
                        </p>
                    </div>
                </motion.div>

                {/* Table headers */}
                <div className="grid grid-cols-2 gap-4 mb-4 max-w-3xl mx-auto">
                    <div className="rounded-2xl px-6 py-4 text-center" style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.12)' }}>
                        <span className="text-[11px] font-black uppercase tracking-[0.12em] text-red-400">Old Protocol</span>
                    </div>
                    <div className="rounded-2xl px-6 py-4 text-center" style={{ background: 'rgba(122,195,66,0.06)', border: '1px solid rgba(122,195,66,0.15)' }}>
                        <span className="text-[11px] font-black uppercase tracking-[0.12em] text-[#7cb342]">Plainfuel Protocol</span>
                    </div>
                </div>

                {/* Comparison rows */}
                <div className="max-w-3xl mx-auto space-y-3 mb-16">
                    {rows.map((row, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: i * 0.08 }}
                            className="grid grid-cols-2 gap-4"
                        >
                            <div className="rounded-2xl px-6 py-4 flex items-center gap-3"
                                style={{ background: 'rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.05)' }}>
                                <X className="w-4 h-4 text-red-500/40 flex-shrink-0" />
                                <span className="text-[#121812]/30 line-through text-sm">{row.theirs}</span>
                            </div>
                            <div className="rounded-2xl px-6 py-4 flex items-center gap-3"
                                style={{ background: 'rgba(122,195,66,0.05)', border: '1px solid rgba(122,195,66,0.12)' }}>
                                <Check className="w-4 h-4 text-[#7cb342] flex-shrink-0" />
                                <span className="text-[#7cb342] font-bold text-sm">{row.ours}</span>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Bottom two cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7 }}
                        className="rounded-3xl p-10"
                        style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.1)' }}
                    >
                        <div className="text-6xl mb-6">😮‍💨</div>
                        <h3 className="font-playfair text-3xl font-bold text-[#121812] mb-4">Friction Induced.</h3>
                        <p className="text-[#121812]/40 text-base font-light leading-relaxed">
                            Managing 4+ separate products — powders, tablets, capsules — leads to habit fatigue. Most people quit after 14 days.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7, delay: 0.1 }}
                        className="rounded-3xl p-10 group"
                        style={{ background: 'rgba(122,195,66,0.06)', border: '1px solid rgba(122,195,66,0.15)' }}
                    >
                        <div className="text-6xl mb-6">⚡</div>
                        <h3 className="font-playfair text-3xl font-bold text-[#121812] mb-4 group-hover:text-[#7cb342] transition-colors">Habit Integrated.</h3>
                        <p className="text-[#121812]/40 text-base font-light leading-relaxed group-hover:text-[#121812]/60 transition-colors">
                            Everything integrated into a single scoop. Zero cognitive load. Just a complete life, silently maintained.
                        </p>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
