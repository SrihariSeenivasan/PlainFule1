'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

const comparisons = [
    { theirs: 'Whey Protein Powder', ours: '✓ Protein included' },
    { theirs: 'Fibre Supplement', ours: '✓ Fibre included' },
    { theirs: 'Multivitamin Tablet', ours: '✓ Micronutrients included' },
    { theirs: 'Mineral Capsules', ours: '✓ Minerals included' },
    { theirs: '₹2,500-3,500/month', ours: '₹599/month' },
    { theirs: '4+ products to manage', ours: '1 scoop. Done.' },
];

export default function NotAnother() {
    return (
        <section className="bg-[#fafaf7] py-24 md:py-32 overflow-hidden">
            <div className="max-w-6xl mx-auto px-6 md:px-10">

                <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                    className="text-center mb-16 md:mb-20">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#3a6b35] mb-4">The Comparison</p>
                    <h2 className="font-playfair text-4xl md:text-6xl font-bold text-[#171717] leading-tight max-w-3xl mx-auto">
                        The old way vs. <span className="text-[#3a6b35]">Plainfuel.</span>
                    </h2>
                </motion.div>

                {/* Comparison Table */}
                <div className="max-w-3xl mx-auto">
                    {/* Header */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="text-center bg-red-50 rounded-2xl py-4">
                            <p className="text-sm font-bold text-red-500 uppercase tracking-wider">Without Plainfuel</p>
                        </div>
                        <div className="text-center bg-[#3a6b35]/10 rounded-2xl py-4">
                            <p className="text-sm font-bold text-[#3a6b35] uppercase tracking-wider">With Plainfuel</p>
                        </div>
                    </div>

                    {/* Rows */}
                    {comparisons.map((c, i) => (
                        <motion.div key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.08 }}
                            className="grid grid-cols-2 gap-4 mb-2">
                            <div className="bg-white rounded-xl px-5 py-4 border border-black/5 text-center">
                                <p className="text-[#171717]/60 line-through decoration-red-300">{c.theirs}</p>
                            </div>
                            <div className="bg-white rounded-xl px-5 py-4 border border-[#3a6b35]/20 text-center">
                                <p className="text-[#3a6b35] font-semibold">{c.ours}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Before/After Visual */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-20">
                    <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                        className="relative rounded-3xl overflow-hidden h-72 md:h-80 bg-red-50 border border-red-100 flex items-center justify-center p-8">
                        <div className="text-center">
                            <p className="text-6xl mb-4">😵‍💫</p>
                            <p className="font-playfair text-2xl font-bold text-[#171717] mb-2">Managing 4+ products</p>
                            <p className="text-[#171717]/50">Protein powder, fibre tablets, multivitamin, mineral capsules...</p>
                        </div>
                    </motion.div>
                    <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                        className="relative rounded-3xl overflow-hidden h-72 md:h-80 bg-[#3a6b35]/5 border border-[#3a6b35]/10 flex items-center justify-center p-8">
                        <div className="text-center">
                            <div className="relative w-24 h-32 mx-auto mb-4">
                                <Image src="/images/product.png" alt="Plainfuel" fill className="object-contain" />
                            </div>
                            <p className="font-playfair text-2xl font-bold text-[#171717] mb-2">Just one scoop</p>
                            <p className="text-[#171717]/50">Everything together, balanced and practical.</p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
