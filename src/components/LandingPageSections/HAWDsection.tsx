'use client';

import { motion } from 'framer-motion';
import { Target, Leaf, Sparkles, UserCheck } from 'lucide-react';

const differentiators = [
    {
        icon: <Target className="w-6 h-6" />,
        title: "Precision Dosage",
        content: "Unlike generic multivitamins, our formula is calibrated for the specific dietary gaps found in typical Indian meals."
    },
    {
        icon: <Leaf className="w-6 h-6" />,
        title: "Zero Filler Ethics",
        content: "Most supplements are 80% maltodextrin or silica. We use 100% active ingredients. Every milligram is functional."
    },
    {
        icon: <Sparkles className="w-6 h-6" />,
        title: "Invisible Utility",
        content: "Designed to be tasteless and textureless. Mix it into anything without altering the flavor profile of your favorite foods."
    },
    {
        icon: <UserCheck className="w-6 h-6" />,
        title: "Bio-Identical",
        content: "We use the exact forms of vitamins that your body recognizes and uses immediately, reducing waste and toxicity."
    }
];

export default function HAWDsection() {
    return (
        <section className="section-pad bg-[var(--background)] overflow-hidden">
            <div className="max-w-screen-xl mx-auto px-6 md:px-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                    <div>
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="tag-pill mb-6"
                        >
                            The Delta Edge
                        </motion.div>
                        <motion.h2
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="font-playfair text-4xl md:text-7xl font-black mb-8 leading-tight"
                        >
                            How We <br /><span className="gradient-text italic">Truly Differ.</span>
                        </motion.h2>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="text-[var(--foreground)]/50 text-lg leading-relaxed mb-12"
                        >
                            The health industry is loud, but often empty. We chose to be silent but effective.
                            While others focus on marketing &apos;superfoods&apos;, we focus on clinical data and dietary truth.
                        </motion.p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {differentiators.map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="glass-green p-8 rounded-3xl border-none relative overflow-hidden group"
                            >
                                <div className="absolute top-0 right-0 w-24 h-24 bg-[var(--green-bright)]/5 rounded-bl-full rotate-90" />
                                <div className="mb-6 w-12 h-12 bg-[var(--green-mid)] text-white flex items-center justify-center rounded-2xl group-hover:rotate-12 transition-transform">
                                    {item.icon}
                                </div>
                                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                                <p className="text-sm text-[var(--foreground)]/40 leading-relaxed italic">
                                    &quot;{item.content}&quot;
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
