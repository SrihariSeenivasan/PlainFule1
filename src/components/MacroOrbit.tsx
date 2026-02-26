'use client';

import { motion } from 'framer-motion';

const items = [
    { icon: '🥩', label: 'Protein', value: 'Complete amino acid profile', pct: 100, fill: 'bg-red-400' },
    { icon: '🌾', label: 'Fibre', value: '5-6g per serve', pct: 70, fill: 'bg-green-500' },
    { icon: '💊', label: 'Vitamin D3', value: '~40% daily needs', pct: 40, fill: 'bg-amber-400' },
    { icon: '🧬', label: 'B-Complex', value: '~40% daily needs', pct: 40, fill: 'bg-blue-400' },
    { icon: '🦴', label: 'Calcium', value: '~30% daily needs', pct: 30, fill: 'bg-purple-400' },
    { icon: '⚡', label: 'Magnesium', value: '~35% daily needs', pct: 35, fill: 'bg-teal-400' },
];

export default function MacroOrbit() {
    return (
        <section id="whats-inside" className="bg-[#171717] text-white py-24 md:py-32 overflow-hidden">
            <div className="max-w-6xl mx-auto px-6 md:px-10">

                <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                    className="text-center mb-16 md:mb-20">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#7cb342] mb-4">What&apos;s Inside</p>
                    <h2 className="font-playfair text-4xl md:text-6xl font-bold leading-tight max-w-3xl mx-auto">
                        Designed to <span className="text-[#7cb342]">complement,</span> not replace.
                    </h2>
                    <p className="mt-6 text-lg text-white/50 max-w-xl mx-auto">
                        Each nutrient at a meaningful level — not random megadoses. Because your food already provides some.
                    </p>
                </motion.div>

                {/* Nutrient bars */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl mx-auto">
                    {items.map((item, i) => (
                        <motion.div key={item.label}
                            initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.08 }}
                            className="bg-white/5 rounded-2xl p-6 border border-white/5 hover:border-white/10 transition-colors group">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl group-hover:scale-110 transition-transform">{item.icon}</span>
                                    <div>
                                        <p className="font-semibold text-white">{item.label}</p>
                                        <p className="text-xs text-white/40">{item.value}</p>
                                    </div>
                                </div>
                                <span className="text-sm font-bold text-white/60">{item.pct}%</span>
                            </div>
                            {/* Progress bar */}
                            <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    whileInView={{ width: `${item.pct}%` }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 1, delay: 0.3 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                                    className={`h-full rounded-full ${item.fill}`}
                                />
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Callout */}
                <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
                    className="mt-16 text-center">
                    <div className="inline-flex items-center gap-2 bg-white/5 text-white/60 text-sm font-medium px-5 py-3 rounded-full border border-white/10">
                        ☝️ Not 100% — because your food already provides some
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
