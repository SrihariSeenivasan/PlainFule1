'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

// ── Data ──────────────────────────────────────────────────────────────────────
const BAR_DATA = [8, 13, 18, 24, 32, 40, 48, 58, 68, 80, 90, 100];
const BAR_COLORS = ['rgba(34,197,94,0.55)', 'rgba(34,197,94,0.55)', 'rgba(34,197,94,0.55)', 'rgba(34,197,94,0.55)', 'rgba(217,119,6,0.65)', 'rgba(217,119,6,0.65)', 'rgba(217,119,6,0.65)', 'rgba(217,119,6,0.65)', 'rgba(220,38,38,0.75)', 'rgba(220,38,38,0.75)', 'rgba(220,38,38,0.75)', 'rgba(220,38,38,0.75)'];
const BAR_BORDERS = ['#22c55e', '#22c55e', '#22c55e', '#22c55e', '#d97706', '#d97706', '#d97706', '#d97706', '#dc2626', '#dc2626', '#dc2626', '#dc2626'];

const NUTRIENTS = [
    { sym: 'B12', name: 'Vitamin B12', role: 'Nerve health & energy', color: '#7c3aed', bg: 'rgba(245,243,255,0.9)', border: 'rgba(124,58,237,0.3)', pct: 30 },
    { sym: 'D3', name: 'Vitamin D3', role: 'Immunity & bone strength', color: '#d97706', bg: 'rgba(255,251,235,0.9)', border: 'rgba(217,119,6,0.3)', pct: 38 },
    { sym: 'Mg', name: 'Magnesium', role: 'Muscle & sleep quality', color: '#15803d', bg: 'rgba(240,253,244,0.9)', border: 'rgba(21,128,61,0.3)', pct: 44 },
    { sym: 'Ca', name: 'Calcium', role: 'Bone density & teeth', color: '#0284c7', bg: 'rgba(240,249,255,0.9)', border: 'rgba(2,132,199,0.3)', pct: 52 },
    { sym: 'Fe', name: 'Iron', role: 'Oxygen transport & focus', color: '#dc2626', bg: 'rgba(255,245,245,0.9)', border: 'rgba(220,38,38,0.3)', pct: 36 },
];

const TOTAL_SCENES = 5;

// ── Background image paths — replace with your actual images ─────────────────
// Drop your images in /public/images/why/ and rename to match, or change paths here
const BG_IMAGES = [
    '/images/why/bg-hook.png',        // Scene 0 — dark moody food/nature shot
    '/images/why/bg-slow.png',        // Scene 1 — calendar / time concept
    '/images/why/bg-diet.png',        // Scene 2 — Indian food plate
    '/images/why/bg-blood.png',       // Scene 3 — lab / health concept
    '/images/why/bg-payoff.png',      // Scene 4 — product hero / lifestyle
];

// Overlay opacity per scene (dark overlay so text stays readable)
const BG_OVERLAYS = [
    'rgba(36, 36, 36, 0.78)',      // Scene 0 — deep forest green
    'rgba(255, 255, 255, 0.82)',   // Scene 1 — cream (light scene)
    'rgba(255,254,240,0.80)',   // Scene 2 — cream (light scene)
    'rgba(255,254,240,0.82)',   // Scene 3 — cream (light scene)
    'rgba(120, 120, 120, 0.78)',      // Scene 4 — dark forest
];

// ── SVG Doodles ───────────────────────────────────────────────────────────────
function DoodleCircle({ size = 130, color = '#22c55e', opacity = 0.18, style = {} }) {
    return (
        <svg viewBox="0 0 100 100" width={size} height={size} aria-hidden
            style={{ display: 'block', pointerEvents: 'none', ...style }}>
            <ellipse cx="50" cy="50" rx="44" ry="42" fill="none" stroke={color}
                strokeWidth="3" strokeDasharray="7 5" strokeLinecap="round" opacity={opacity} />
        </svg>
    );
}
function DoodleStar({ size = 70, color = '#22c55e', opacity = 0.18, style = {} }) {
    return (
        <svg viewBox="0 0 100 100" width={size} height={size} aria-hidden
            style={{ display: 'block', pointerEvents: 'none', ...style }}>
            <polygon points="50,4 61,35 95,35 68,57 79,91 50,70 21,91 32,57 5,35 39,35"
                fill="none" stroke={color} strokeWidth="2.5" opacity={opacity} />
        </svg>
    );
}
function DoodleWiggle({ width = 110, color = '#22c55e', opacity = 0.28, style = {} }) {
    return (
        <svg viewBox="0 0 140 20" width={width} aria-hidden
            style={{ display: 'block', pointerEvents: 'none', ...style }}>
            <path d="M2,10 Q20,2 38,10 Q56,18 74,10 Q92,2 110,10 Q126,16 138,10"
                fill="none" stroke={color} strokeWidth="3.5" strokeLinecap="round" opacity={opacity} />
        </svg>
    );
}
function DoodleArrowRight({ width = 44, color = '#22c55e', style = {} }) {
    return (
        <svg viewBox="0 0 80 40" width={width} aria-hidden style={{ display: 'block', pointerEvents: 'none', ...style }}>
            <path d="M4,20 Q30,8 60,20" fill="none" stroke={color} strokeWidth="3.5" strokeLinecap="round" />
            <path d="M52,10 L64,20 L52,30" fill="none" stroke={color} strokeWidth="3.5"
                strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}
function DoodleUnderline({ color = '#22c55e' }) {
    return (
        <svg viewBox="0 0 300 16" preserveAspectRatio="none"
            style={{ position: 'absolute', bottom: -7, left: 0, width: '100%', height: 13, pointerEvents: 'none' }}>
            <path d="M4,10 Q75,4 150,8 Q225,12 296,6"
                fill="none" stroke={color} strokeWidth="5" strokeLinecap="round" />
        </svg>
    );
}
function CheckIcon({ color = '#15803d' }) {
    return (
        <svg viewBox="0 0 24 24" width={22} height={22} fill="none">
            <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" />
            <path d="M7,12 L11,16 L17,9" stroke={color} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}
function CrossIcon({ color = '#dc2626' }) {
    return (
        <svg viewBox="0 0 24 24" width={22} height={22} fill="none">
            <path d="M6,6 L18,18 M18,6 L6,18" stroke={color} strokeWidth="2.8" strokeLinecap="round" />
        </svg>
    );
}

// ── Scene 0 — Hook (dark bg, white text) ─────────────────────────────────────
function Scene0({ active }: { active: boolean }) {
    return (
        <div style={abs}>
            {/* doodles */}
            <div style={{ position: 'absolute', top: '8%', left: '5%' }}>
                <DoodleCircle size={180} color="#22c55e" opacity={0.22} />
            </div>
            <div style={{ position: 'absolute', bottom: '12%', right: '7%' }}>
                <DoodleStar size={100} color="#22c55e" opacity={0.2} />
            </div>
            <div style={{ position: 'absolute', top: '12%', right: '9%' }}>
                <DoodleWiggle width={130} color="#22c55e" opacity={0.3} />
            </div>

            <div style={{ textAlign: 'center', maxWidth: 680, position: 'relative' }}>
                {/* eyebrow */}
                <div style={{ ...row, justifyContent: 'center', gap: 10, marginBottom: 28 }}>
                    <svg viewBox="0 0 16 16" width={14} height={14}><circle cx="8" cy="8" r="5" fill="#22c55e" /></svg>
                    <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 13, color: '#22c55e', letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 600 }}>The real problem</span>
                </div>

                {/* headline */}
                <h1 style={{ fontFamily: "'Fraunces',serif", fontSize: 'clamp(2.8rem,6.5vw,5.2rem)', fontWeight: 900, color: '#fff', lineHeight: 1.06, letterSpacing: '-0.03em', marginBottom: 28 }}>
                    Why is{' '}
                    <span style={{ color: '#22c55e', fontStyle: 'italic', position: 'relative', display: 'inline-block' }}>
                        PlainFuel
                        <DoodleUnderline color="#22c55e" />
                    </span>
                    {' '}needed?
                </h1>

                <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 'clamp(17px,2.2vw,22px)', color: 'rgba(255,255,255,0.75)', lineHeight: 1.75, marginBottom: 44 }}>
                    Most people think deficiencies happen suddenly.<br />
                    <strong style={{ color: '#fff' }}>That's not true.</strong>
                </p>

                {/* scroll nudge */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, opacity: 0.6 }}>
                    <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, color: '#fff', letterSpacing: '0.18em', textTransform: 'uppercase' }}>scroll to discover</span>
                    <svg style={{ animation: 'pfBounce 1.3s ease-in-out infinite' }} viewBox="0 0 28 16" width={32} height={18}>
                        <path d="M4,4 Q14,2 22,8" fill="none" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" />
                        <path d="M17,3 L24,8 L17,13" fill="none" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
            </div>
        </div>
    );
}

// ── Scene 1 — Deficiencies build slowly (light bg) ───────────────────────────
function Scene1({ active }: { active: boolean }) {
    const [animated, setAnimated] = useState(false);
    useEffect(() => {
        if (active && !animated) {
            const t = setTimeout(() => setAnimated(true), 220);
            return () => clearTimeout(t);
        }
    }, [active]);

    return (
        <div style={abs}>
            <div style={{ position: 'absolute', top: '7%', right: '4%' }}>
                <DoodleCircle size={90} color="#15803d" opacity={0.15} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(28px,4vw,64px)', maxWidth: 960, width: '100%', alignItems: 'center' }} className="wpf-two-col">

                {/* left */}
                <div>
                    <div style={monoLabel}>01 — How deficiencies form</div>
                    <h2 style={sectionH}>
                        Deficiencies{' '}
                        <span style={{ color: '#15803d', fontStyle: 'italic' }}>build slowly</span>.
                    </h2>

                    {/* notepad */}
                    <div style={{ background: '#fffef0', border: '2.5px solid #0f4a23', borderRadius: 10, padding: '20px 22px 20px 36px', boxShadow: '5px 5px 0 #0f4a23', transform: 'rotate(-1.2deg)', position: 'relative', marginBottom: 24, overflow: 'hidden' }}>
                        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(transparent, transparent 26px, rgba(21,128,61,0.1) 26px, rgba(21,128,61,0.1) 27px)', backgroundPositionY: 34, pointerEvents: 'none' }} />
                        <div style={{ position: 'absolute', left: 26, top: 0, bottom: 0, width: 2, background: 'rgba(21,128,61,0.28)' }} />
                        <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 16, color: '#0f4a23', lineHeight: 1.82, fontWeight: 500, position: 'relative', zIndex: 1 }}>
                            They are the result of missing{' '}
                            <span style={{ background: '#dcfce7', padding: '2px 7px', borderRadius: 4, fontWeight: 700 }}>small amounts</span>
                            {' '}of nutrients every day for months.
                        </p>
                    </div>

                    <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 16, color: '#3a4a3c', lineHeight: 1.85, marginBottom: 22 }}>
                        Your body works on <strong style={{ color: '#0f4a23' }}>daily input</strong>. Just like missing homework every day leads to problems later, missing nutrients daily creates long-term gaps.
                    </p>

                    <div style={{ ...row, gap: 10, opacity: 0.65 }}>
                        <DoodleArrowRight width={46} color="#15803d" />
                        <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, color: '#15803d', letterSpacing: '0.13em', textTransform: 'uppercase' }}>compounds over time</span>
                    </div>
                </div>

                {/* right: bar chart */}
                <div style={{ background: 'rgba(255,255,255,0.88)', border: '1.5px solid #c8e6d0', borderRadius: 16, padding: '24px 22px 18px', backdropFilter: 'blur(4px)' }}>
                    <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, color: '#6b7a6e', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 600, marginBottom: 16 }}>Deficiency gap — 12 months</div>
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 150 }}>
                        {BAR_DATA.map((h, i) => (
                            <div key={i} style={{
                                flex: 1, borderRadius: '4px 4px 0 0',
                                background: BAR_COLORS[i],
                                border: `1.5px solid ${BAR_BORDERS[i]}`,
                                height: animated ? `${(h / 100) * 150}px` : 0,
                                transition: `height 0.6s cubic-bezier(0.22,1,0.36,1) ${i * 55}ms`,
                            }} />
                        ))}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 7 }}>
                        {['Jan', 'Jun', 'Dec'].map(m => <span key={m} style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, color: '#6b7a6e' }}>{m}</span>)}
                    </div>
                    <div style={{ display: 'flex', gap: 14, marginTop: 14, flexWrap: 'wrap' }}>
                        {[['Normal', 'rgba(34,197,94,0.55)', '#22c55e'], ['Warning', 'rgba(217,119,6,0.65)', '#d97706'], ['Critical', 'rgba(220,38,38,0.75)', '#dc2626']].map(([lbl, bg, bdr]) => (
                            <div key={lbl} style={{ ...row, gap: 6 }}>
                                <div style={{ width: 10, height: 10, borderRadius: 2, background: bg, border: `1.5px solid ${bdr}` }} />
                                <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, color: '#6b7a6e', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{lbl}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

// ── Scene 2 — Diet reality (light bg) ────────────────────────────────────────
function Scene2({ active }: { active: boolean }) {
    const haveItems = ['Carbohydrates', 'Fats'];
    const missingItems = ['Protein', 'Fiber', 'Essential Micronutrients'];

    return (
        <div style={abs}>
            <div style={{ position: 'absolute', top: '6%', left: '5%' }}>
                <DoodleStar size={90} color="#15803d" opacity={0.15} />
            </div>
            <div style={{ position: 'absolute', bottom: '7%', right: '5%' }}>
                <DoodleWiggle width={120} color="#0f4a23" opacity={0.18} />
            </div>

            <div style={{ maxWidth: 960, width: '100%' }}>
                <div style={{ textAlign: 'center', marginBottom: 40 }}>
                    <div style={monoLabel}>02 — The Indian diet reality</div>
                    <h2 style={sectionH}>
                        We focus on protein.<br />
                        <span style={{ color: '#dc2626', fontStyle: 'italic' }}>But nutrition is more.</span>
                    </h2>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 56px 1fr', gap: 20, alignItems: 'start' }} className="wpf-vs-grid">

                    {/* has */}
                    <div>
                        <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 12, color: '#15803d', letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 600, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                            <svg viewBox="0 0 14 14" width={13} height={13}><circle cx="7" cy="7" r="6" fill="#22c55e" /></svg>
                            Our diet has
                        </div>
                        {haveItems.map(item => (
                            <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 13, background: 'rgba(240,253,244,0.92)', border: '1.5px solid rgba(34,197,94,0.35)', borderRadius: 12, padding: '15px 18px', marginBottom: 12, backdropFilter: 'blur(4px)' }}>
                                <CheckIcon color="#15803d" />
                                <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 17, fontWeight: 600, color: '#0f4a23' }}>{item}</span>
                            </div>
                        ))}
                    </div>

                    {/* divider */}
                    <div className="wpf-vs-divider" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 5, paddingTop: 56 }}>
                        <div style={{ width: 1.5, height: 70, background: 'rgba(107,122,110,0.25)' }} />
                        <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 13, color: '#6b7a6e', letterSpacing: '0.1em' }}>vs</span>
                        <div style={{ width: 1.5, height: 70, background: 'rgba(107,122,110,0.25)' }} />
                    </div>

                    {/* lacks */}
                    <div>
                        <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 12, color: '#dc2626', letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 600, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                            <svg viewBox="0 0 14 14" width={13} height={13}><circle cx="7" cy="7" r="6" fill="#dc2626" /></svg>
                            Often lacks
                        </div>
                        {missingItems.map(item => (
                            <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 13, background: 'rgba(255,245,245,0.92)', border: '1.5px solid rgba(220,38,38,0.25)', borderRadius: 12, padding: '15px 18px', marginBottom: 12, backdropFilter: 'blur(4px)' }}>
                                <CrossIcon color="#dc2626" />
                                <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 17, fontWeight: 600, color: '#991b1b' }}>{item}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

// ── Scene 3 — Blood report (light bg) ────────────────────────────────────────
function Scene3({ active }: { active: boolean }) {
    const [animated, setAnimated] = useState(false);
    useEffect(() => {
        if (active && !animated) {
            const t = setTimeout(() => setAnimated(true), 260);
            return () => clearTimeout(t);
        }
    }, [active]);

    return (
        <div style={abs}>
            <div style={{ position: 'absolute', top: '5%', right: '5%' }}>
                <DoodleCircle size={130} color="#15803d" opacity={0.12} />
            </div>

            <div style={{ maxWidth: 900, width: '100%' }}>
                <div style={{ textAlign: 'center', marginBottom: 26 }}>
                    <div style={{ ...monoLabel, color: '#dc2626' }}>03 — Blood report reality</div>
                    <h2 style={sectionH}>
                        The real gaps are{' '}
                        <span style={{ color: '#dc2626', fontStyle: 'italic', position: 'relative', display: 'inline-block' }}>
                            not protein
                            <DoodleUnderline color="#dc2626" />
                        </span>.
                    </h2>
                </div>

                <div style={{ background: 'rgba(250,250,247,0.92)', border: '1.5px solid #c8e6d0', borderRadius: 20, padding: '26px 26px 22px', backdropFilter: 'blur(8px)', boxShadow: '0 8px 40px rgba(15,74,35,0.1)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22, flexWrap: 'wrap', gap: 10 }}>
                        <div>
                            <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, color: '#6b7a6e', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Blood report — common deficiencies</div>
                            <div style={{ fontFamily: "'Fraunces',serif", fontSize: 20, fontWeight: 700, color: '#111410', marginTop: 3 }}>India population study</div>
                        </div>
                        <div style={{ background: '#fff5f5', border: '1.5px solid rgba(220,38,38,0.35)', borderRadius: 7, padding: '6px 14px', fontFamily: "'DM Mono',monospace", fontSize: 11, color: '#dc2626', fontWeight: 600, letterSpacing: '0.08em' }}>
                            ⚠ Deficient
                        </div>
                    </div>

                    {NUTRIENTS.map((n, i) => (
                        <div key={n.sym} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 16px', borderRadius: 11, marginBottom: 10, background: n.bg, border: `1.5px solid ${n.border}` }}>
                            <div style={{ width: 46, height: 46, borderRadius: 10, background: n.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: `0 3px 10px ${n.color}55` }}>
                                <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 13, color: '#fff', fontWeight: 600 }}>{n.sym}</span>
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 15, fontWeight: 700, color: '#111410' }}>{n.name}</div>
                                <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: '#6b7a6e', marginTop: 1 }}>{n.role}</div>
                            </div>
                            <div className="wpf-bar-track" style={{ width: 110, flexShrink: 0 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                                    <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 9, color: '#6b7a6e', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Level</span>
                                    <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 9, color: '#dc2626', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Low</span>
                                </div>
                                <div style={{ height: 7, background: 'rgba(0,0,0,0.08)', borderRadius: 99, overflow: 'hidden' }}>
                                    <div style={{ height: '100%', borderRadius: 99, background: 'linear-gradient(90deg,#dc2626,#d97706)', width: animated ? `${n.pct}%` : 0, transition: `width 0.8s cubic-bezier(0.22,1,0.36,1) ${i * 110}ms` }} />
                                </div>
                            </div>
                        </div>
                    ))}

                    <div style={{ marginTop: 16, padding: '13px 18px', background: 'rgba(240,253,244,0.9)', borderRadius: 10, border: '1px solid rgba(34,197,94,0.35)', display: 'flex', alignItems: 'center', gap: 12 }}>
                        <svg viewBox="0 0 20 20" width={18} height={18} fill="none">
                            <circle cx="10" cy="10" r="8" stroke="#15803d" strokeWidth="2" />
                            <path d="M10 6v4M10 13h.01" stroke="#15803d" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                        <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: '#0f4a23' }}>
                            These are <strong>micronutrients</strong> — they play a critical role in how our body functions.
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ── Scene 4 — Payoff (dark bg, white text) ───────────────────────────────────
function Scene4({ active }: { active: boolean }) {
    return (
        <div style={abs}>
            <div style={{ position: 'absolute', top: '8%', left: '6%' }}>
                <DoodleCircle size={200} color="#22c55e" opacity={0.18} />
            </div>
            <div style={{ position: 'absolute', bottom: '10%', right: '7%' }}>
                <DoodleStar size={110} color="#22c55e" opacity={0.16} />
            </div>
            <div style={{ position: 'absolute', top: '28%', right: '4%' }}>
                <DoodleWiggle width={130} color="#22c55e" opacity={0.2} />
            </div>

            <div style={{ textAlign: 'center', maxWidth: 680, position: 'relative', zIndex: 2 }}>
                <div style={{ ...row, justifyContent: 'center', gap: 10, marginBottom: 26 }}>
                    <svg viewBox="0 0 16 16" width={14} height={14}><circle cx="8" cy="8" r="5" fill="#22c55e" /></svg>
                    <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 13, color: '#22c55e', letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 600 }}>The answer</span>
                </div>
                <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 'clamp(2.4rem,5.5vw,4.4rem)', fontWeight: 900, color: '#fff', lineHeight: 1.08, letterSpacing: '-0.025em', marginBottom: 24 }}>
                    One scoop.<br />
                    <span style={{ color: '#22c55e', fontStyle: 'italic' }}>Everything your body needs.</span>
                </h2>
                <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 'clamp(16px,2vw,20px)', color: 'rgba(255,255,255,0.7)', lineHeight: 1.8, marginBottom: 40 }}>
                    PlainFuel closes the gap — combining protein, fiber, and essential micronutrients in one daily system.
                </p>
                <a href="#order" style={{ display: 'inline-flex', alignItems: 'center', gap: 12, background: '#22c55e', color: '#0f4a23', fontFamily: "'DM Sans',sans-serif", fontSize: 15, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', padding: '16px 36px', borderRadius: 11, border: '2.5px solid rgba(255,255,255,0.3)', textDecoration: 'none', boxShadow: '6px 7px 0 rgba(0,0,0,0.22)' }}>
                    Start with PlainFuel
                    <svg viewBox="0 0 16 16" width={16} height={16} fill="none">
                        <path d="M3 8h10M8 3l5 5-5 5" stroke="#0f4a23" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </a>
            </div>
        </div>
    );
}

// ── Shared style constants ────────────────────────────────────────────────────
const abs = { position: 'absolute' as const, inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'clamp(32px,5vw,64px) clamp(28px,5vw,68px)' };
const row = { display: 'flex', alignItems: 'center' };
const monoLabel = { fontFamily: "'DM Mono',monospace", fontSize: 12, color: '#15803d', letterSpacing: '0.16em', textTransform: 'uppercase' as const, fontWeight: 600, marginBottom: 16 };
const sectionH = { fontFamily: "'Fraunces',serif", fontSize: 'clamp(1.9rem,3.4vw,3rem)', fontWeight: 900, color: '#111410', lineHeight: 1.1, letterSpacing: '-0.022em', marginBottom: 22 };

// ── Root ──────────────────────────────────────────────────────────────────────
export default function WhyPlainFuel() {
    const [current, setCurrent] = useState(0);
    const rootRef = useRef<HTMLDivElement>(null);
    const stageRef = useRef<HTMLDivElement>(null);
    const prevRef = useRef(-1);

    const getIdx = useCallback(() => {
        const root = rootRef.current;
        const stage = stageRef.current;
        if (!root || !stage) return 0;
        const scrolled = -root.getBoundingClientRect().top;
        const scrollH = root.scrollHeight - stage.offsetHeight;
        if (scrollH <= 0) return 0;
        const pct = Math.max(0, Math.min(0.9999, scrolled / scrollH));
        return Math.min(TOTAL_SCENES - 1, Math.floor(pct * TOTAL_SCENES));
    }, []);

    useEffect(() => {
        const onScroll = () => {
            const idx = getIdx();
            if (idx !== prevRef.current) {
                prevRef.current = idx;
                setCurrent(idx);
            }
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, [getIdx]);

    const goToScene = (i: number) => {
        const root = rootRef.current;
        const stage = stageRef.current;
        if (!root || !stage) return;
        const scrollH = root.scrollHeight - stage.offsetHeight;
        const target = (i / TOTAL_SCENES) * scrollH;
        window.scrollTo({ top: root.offsetTop + target, behavior: 'smooth' });
    };

    const sceneState = (i: number): 'active' | 'exit' | 'idle' => {
        if (i === current) return 'active';
        if (i === prevRef.current && i !== current) return 'exit';
        return 'idle';
    };

    const isDark = (i: number) => i === 0 || i === 4;
    const SceneComponents = [Scene0, Scene1, Scene2, Scene3, Scene4];

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,700;0,9..144,900;1,9..144,700;1,9..144,900&family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@500;600&display=swap');

        @keyframes pfBounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(7px)} }

        .wpf-scene {
          position: absolute;
          inset: 0;
          opacity: 0;
          transform: scale(0.86);
          transition: opacity 0.58s cubic-bezier(0.16,1,0.3,1),
                      transform 0.58s cubic-bezier(0.16,1,0.3,1);
          pointer-events: none;
          will-change: opacity, transform;
        }
        .wpf-scene.active  { opacity: 1; transform: scale(1);    pointer-events: auto; }
        .wpf-scene.exit    { opacity: 0; transform: scale(1.06); pointer-events: none; }

        .wpf-bg {
          position: absolute;
          inset: 0;
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          transition: opacity 0.5s ease;
        }
        .wpf-overlay {
          position: absolute;
          inset: 0;
        }

        @media (max-width: 700px) {
          .wpf-two-col { grid-template-columns: 1fr !important; }
          .wpf-vs-grid { grid-template-columns: 1fr !important; }
          .wpf-vs-divider { display: none !important; }
          .wpf-bar-track { display: none !important; }
        }
      `}</style>

            {/* 500vh scroll track */}
            <div ref={rootRef} style={{ position: 'relative', height: '500vh' }}>

                {/* Sticky viewport */}
                <div ref={stageRef} style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden' }}>

                    {/* Progress bar */}
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: 'rgba(255,255,255,0.15)', zIndex: 100 }}>
                        <div style={{ height: '100%', background: '#22c55e', width: `${((current + 1) / TOTAL_SCENES) * 100}%`, transition: 'width 0.35s ease' }} />
                    </div>

                    {/* Dot nav */}
                    <div style={{ position: 'absolute', right: 22, top: '50%', transform: 'translateY(-50%)', display: 'flex', flexDirection: 'column', gap: 9, zIndex: 50 }}>
                        {Array.from({ length: TOTAL_SCENES }, (_, i) => (
                            <button key={i} onClick={() => goToScene(i)} aria-label={`Scene ${i + 1}`}
                                style={{
                                    width: 9, height: 9, borderRadius: '50%',
                                    border: `2px solid ${isDark(current) ? 'rgba(255,255,255,0.7)' : '#15803d'}`,
                                    background: i === current ? (isDark(current) ? '#fff' : '#15803d') : 'transparent',
                                    transform: i === current ? 'scale(1.35)' : 'scale(1)',
                                    transition: 'all 0.3s', cursor: 'pointer', padding: 0,
                                }}
                            />
                        ))}
                    </div>

                    {/* Scene counter */}
                    <div style={{ position: 'absolute', bottom: 24, left: '50%', transform: 'translateX(-50%)', zIndex: 50 }}>
                        <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, color: isDark(current) ? 'rgba(255,255,255,0.5)' : 'rgba(15,74,35,0.45)', letterSpacing: '0.14em' }}>
                            {String(current + 1).padStart(2, '0')} / {String(TOTAL_SCENES).padStart(2, '0')}
                        </span>
                    </div>

                    {/* Scene layers */}
                    {SceneComponents.map((SceneComp, i) => {
                        const state = sceneState(i);
                        return (
                            <div key={i} className={`wpf-scene${state === 'active' ? ' active' : state === 'exit' ? ' exit' : ''}`}>
                                {/* Background image */}
                                <div
                                    className="wpf-bg"
                                    style={{ backgroundImage: `url('${BG_IMAGES[i]}')` }}
                                />
                                {/* Colour overlay */}
                                <div className="wpf-overlay" style={{ background: BG_OVERLAYS[i] }} />
                                {/* Content */}
                                <SceneComp active={i === current} />
                            </div>
                        );
                    })}

                </div>
            </div>
        </>
    );
}