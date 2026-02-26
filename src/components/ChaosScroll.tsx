'use client';

import { motion } from 'framer-motion';
import { AlertTriangle, Dna, Leaf, Shell } from 'lucide-react';

const gaps = [
    {
        icon: AlertTriangle,
        stat: '73%',
        label: 'Market Deficiency',
        title: 'Protein Myth.',
        body: 'The Indian diet is high in refined carbs that block protein absorption. We fix both gaps simultaneously.',
        accent: '#ef4444',
        bg: 'rgba(239,68,68,0.06)',
        border: 'rgba(239,68,68,0.12)',
    },
    {
        icon: Shell,
        stat: '<15g',
        label: 'Daily Average',
        title: 'Fibre Void.',
        body: 'Metabolic health starts in the gut. Without 30g+ of daily fibre, nutrients you eat can\'t be processed.',
        accent: '#f59e0b',
        bg: 'rgba(245,158,11,0.06)',
        border: 'rgba(245,158,11,0.12)',
    },
    {
        icon: Dna,
        stat: '76%',
        label: 'Clinical Gap',
        title: 'Bone Density.',
        body: 'Massive Vitamin D and Magnesium gaps lead to silent long-term decay. We provide the exact RDI delta.',
        accent: '#3b82f6',
        bg: 'rgba(59,130,246,0.06)',
        border: 'rgba(59,130,246,0.12)',
    },
    {
        icon: Leaf,
        stat: '1 Scoop',
        label: 'The Solution',
        title: 'Metabolic Gap.',
        body: 'Supplement stacking causes habit fatigue. Plainfuel integrates all gaps into your existing meal, invisibly.',
        accent: '#7cb342',
        bg: 'rgba(122,195,66,0.06)',
        border: 'rgba(122,195,66,0.15)',
    },
];

export default function ChaosScroll() {
    return (
        <section id="investigation" className="bg-[#050505] section-pad">
            <div className="max-w-screen-xl mx-auto px-6 md:px-12">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="mb-20"
                >
                    <div className="tag-pill mb-6">Sector 01: The Investigation</div>
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                        <h2 className="font-playfair text-5xl md:text-7xl font-black text-white leading-[0.9] tracking-tight">
                            Solving the<br />
                            <span className="font-playfair italic text-white/20">Biological Gap.</span>
                        </h2>
                        <p className="text-white/35 text-lg font-light leading-relaxed max-w-xs md:text-right">
                            Four critical deficiencies hiding in the modern Indian diet — identified, mapped, solved.
                        </p>
                    </div>
                </motion.div>

                {/* Cards grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {gaps.map((gap, i) => {
                        const Icon = gap.icon;
                        return (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.7, delay: i * 0.1 }}
                                className="group relative rounded-3xl p-8 overflow-hidden cursor-pointer transition-all duration-500 hover:-translate-y-1"
                                style={{ background: gap.bg, border: `1px solid ${gap.border}` }}
                            >
                                {/* Glow */}
                                <div className="absolute -bottom-10 -right-10 w-48 h-48 rounded-full blur-3xl opacity-0 group-hover:opacity-40 transition-opacity duration-700"
                                    style={{ background: gap.accent }} />

                                <div className="flex items-start justify-between mb-8">
                                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
                                        style={{ background: `${gap.accent}18`, border: `1px solid ${gap.accent}30` }}>
                                        <Icon className="w-6 h-6" style={{ color: gap.accent }} />
                                    </div>
                                    <div className="text-right">
                                        <div className="font-playfair text-4xl font-black text-white">{gap.stat}</div>
                                        <div className="text-[10px] uppercase tracking-widest font-black mt-1" style={{ color: gap.accent }}>{gap.label}</div>
                                    </div>
                                </div>

                                <h3 className="font-playfair text-3xl font-bold text-white mb-3">{gap.title}</h3>
                                <p className="text-white/40 text-base leading-relaxed font-light group-hover:text-white/60 transition-colors">{gap.body}</p>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
