'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Activity, FlaskConical, Layers, Shield } from 'lucide-react';

const nutrients = [
    { icon: Activity, label: 'Complete Protein', value: '100% Amino Profile', pct: 100 },
    { icon: Layers, label: 'Dietary Fibre', value: '5–6g per serve', pct: 70 },
    { icon: Shield, label: 'Micronutrients', value: '30–50% RDI', pct: 50 },
    { icon: FlaskConical, label: 'B-Complex', value: 'Metabolic Support', pct: 65 },
];

const certs = ['ISO-9001', 'FSSAI Certified', 'Vegan Label', 'Non-GMO'];

export default function MacroOrbit() {
    return (
        <section id="inside" className="bg-[#050505] section-pad relative overflow-hidden">

            {/* Background glow */}
            <div className="absolute bottom-0 right-0 w-[600px] h-[600px] rounded-full blur-[120px]"
                style={{ background: 'radial-gradient(circle, rgba(58,107,53,0.15) 0%, transparent 70%)' }} />

            <div className="max-w-screen-xl mx-auto px-6 md:px-12 relative z-10">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="flex flex-col md:flex-row items-start md:items-end justify-between mb-16 gap-8"
                >
                    <div>
                        <div className="tag-pill mb-6">Engineering the Scoop</div>
                        <h2 className="font-playfair text-5xl md:text-7xl font-black text-white leading-[0.9] tracking-tight">
                            Inside the<br />
                            <span className="font-playfair italic text-white/20">Precision.</span>
                        </h2>
                    </div>
                    <p className="text-white/35 text-lg font-light leading-relaxed max-w-sm md:text-right">
                        A formulation that doesn&apos;t add volume — it addresses the specific clinical gaps of the modern individual.
                    </p>
                </motion.div>

                {/* Main grid */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 mb-5">

                    {/* Left: Big visual card */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.96 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="lg:col-span-3 glass rounded-3xl overflow-hidden relative min-h-[400px] group"
                    >
                        <Image
                            src="/images/scoop.png"
                            alt="Engineering"
                            fill
                            className="object-cover opacity-25 grayscale group-hover:opacity-35 group-hover:scale-105 transition-all duration-1000"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-10">
                            <h3 className="font-playfair text-4xl font-bold text-white mb-3">Bio-Baseline Completer</h3>
                            <p className="text-white/35 text-base font-light leading-relaxed max-w-sm">
                                Optimized for absorption. Every milligram mapped to a biological need. No fillers, no noise.
                            </p>
                        </div>
                    </motion.div>

                    {/* Right: nutrient bars */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.15 }}
                        className="lg:col-span-2 flex flex-col gap-4"
                    >
                        {nutrients.map((n, i) => {
                            const Icon = n.icon;
                            return (
                                <div key={i} className="glass rounded-2xl p-6 flex-1 min-h-[80px]">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            <Icon className="w-5 h-5 text-[#7cb342]" />
                                            <span className="text-white font-bold text-sm">{n.label}</span>
                                        </div>
                                        <span className="text-[#7cb342] font-black text-sm">{n.pct}%</span>
                                    </div>
                                    <div className="h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
                                        <motion.div
                                            initial={{ width: 0 }}
                                            whileInView={{ width: `${n.pct}%` }}
                                            viewport={{ once: true }}
                                            transition={{ duration: 1.2, delay: 0.3 + i * 0.1 }}
                                            className="h-full rounded-full"
                                            style={{ background: 'linear-gradient(90deg, #3a6b35, #7cb342)' }}
                                        />
                                    </div>
                                    <p className="text-white/25 text-xs mt-2 font-light">{n.value}</p>
                                </div>
                            );
                        })}
                    </motion.div>
                </div>

                {/* Cert strip */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                    className="glass rounded-2xl px-8 py-5 flex flex-wrap items-center justify-between gap-4"
                >
                    <div className="flex items-center gap-4">
                        <FlaskConical className="w-8 h-8 text-[#7cb342]" />
                        <div>
                            <h4 className="text-white font-bold">Clinical Lab Standard</h4>
                            <p className="text-white/25 text-xs uppercase tracking-widest font-bold">100% Transparency Labeling</p>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        {certs.map(cert => (
                            <span key={cert} className="text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full border text-white/30 border-white/10 hover:border-[#7cb342]/40 hover:text-white/70 transition-all">
                                {cert}
                            </span>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
