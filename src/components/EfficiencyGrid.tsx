'use client';

import { motion } from 'framer-motion';

const reviews = [
    { name: 'Priya S.', role: 'Working Mom, Bangalore', text: "I used to buy protein powder, fibre supplements, AND a multivitamin. Plainfuel replaced all three. My monthly spend dropped by ₹2,000.", rating: 5 },
    { name: 'Arjun M.', role: 'Software Engineer, Hyderabad', text: "No weird taste, no extra steps. I just mix it into my morning oats. It's the easiest health upgrade I've made.", rating: 5 },
    { name: 'Dr. Kavitha R.', role: 'Nutritionist, Chennai', text: "What I love is the intentional dosing — not 100% of everything. It's designed to work WITH food, not replace it. That's rare.", rating: 5 },
    { name: 'Rohit K.', role: 'Fitness Enthusiast, Mumbai', text: "Finally a brand that's honest about what Indian diets actually need. Not another hyped protein brand.", rating: 5 },
];

export default function EfficiencyGrid() {
    return (
        <section className="bg-[#f4f1ec] py-24 md:py-32 overflow-hidden">
            <div className="max-w-6xl mx-auto px-6 md:px-10">

                <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                    className="text-center mb-16 md:mb-20">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#3a6b35] mb-4">Real People. Real Results.</p>
                    <h2 className="font-playfair text-4xl md:text-6xl font-bold text-[#171717] leading-tight">
                        Loved by <span className="text-[#3a6b35]">thousands.</span>
                    </h2>
                    <div className="mt-6 inline-flex items-center gap-2 bg-[#3a6b35]/10 text-[#3a6b35] text-sm font-semibold px-5 py-2.5 rounded-full">
                        ⭐ 4.8/5 average rating • 2,000+ happy customers
                    </div>
                </motion.div>

                {/* Review Cards — Masonry style */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {reviews.map((r, i) => (
                        <motion.div key={r.name}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            whileHover={{ y: -4 }}
                            className="bg-white rounded-3xl p-8 shadow-sm border border-black/5 hover:shadow-lg transition-all duration-500">

                            {/* Stars */}
                            <div className="flex gap-1 mb-5">
                                {Array.from({ length: r.rating }).map((_, j) => (
                                    <span key={j} className="text-amber-400 text-lg">★</span>
                                ))}
                            </div>

                            <p className="text-[#171717]/80 text-lg leading-relaxed mb-6">&ldquo;{r.text}&rdquo;</p>

                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-[#3a6b35]/10 flex items-center justify-center text-[#3a6b35] font-bold text-sm">
                                    {r.name.charAt(0)}
                                </div>
                                <div>
                                    <p className="font-semibold text-[#171717] text-sm">{r.name}</p>
                                    <p className="text-xs text-[#171717]/40">{r.role}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
