'use client';

import { useEffect, useRef, useState, ReactNode } from 'react';

// ── SVG doodles ───────────────────────────────────────────────────────────────
function PulseDot() {
    return (
        <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: '#22c55e', marginRight: 8, animation: 'pfPulse 2s ease-in-out infinite', verticalAlign: 'middle' }} />
    );
}

function CheckIcon({ color = '#15803d' }: { color?: string }) {
    return (
        <svg viewBox="0 0 16 16" width={14} height={14} fill="none" style={{ flexShrink: 0, marginTop: 3 }}>
            <circle cx="8" cy="8" r="7" fill={color} opacity="0.12" />
            <path d="M5 8.5l2 2 4-4" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function BulletItem({ children, accent }: { children: ReactNode; accent?: string }) {
    return (
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 18 }}>
            <CheckIcon color={accent || '#15803d'} />
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15.5, color: '#374151', lineHeight: 1.7, margin: 0 }}>
                {children}
            </p>
        </div>
    );
}

function Highlight({ children, color = '#dcfce7', text = '#0f4a23' }: { children: ReactNode; color?: string; text?: string }) {
    return (
        <span style={{
            background: color,
            color: text,
            fontWeight: 700,
            padding: '1px 7px',
            borderRadius: 5,
            display: 'inline',
        }}>{children}</span>
    );
}

// ── Video placeholder / slot ──────────────────────────────────────────────────
function VideoPanel() {
    return (
        <div style={{
            position: 'relative',
            width: '100%',
            aspectRatio: '9/16',
            maxHeight: 560,
            borderRadius: 20,
            overflow: 'hidden',
            border: '2.5px solid #0f4a23',
            boxShadow: '7px 8px 0 #0f4a23',
            background: '#0f4a23',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        }}>
            {/*
        Replace the div below with your <video> tag:
        <video src="..." autoPlay muted loop playsInline style={{ width:'100%',height:'100%',objectFit:'cover' }} />
      */}
            <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.35)', fontFamily: "'DM Mono',monospace", fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                <svg viewBox="0 0 48 48" width={44} height={44} style={{ display: 'block', margin: '0 auto 12px', opacity: 0.4 }}>
                    <circle cx="24" cy="24" r="22" fill="none" stroke="white" strokeWidth="2" />
                    <path d="M19 16l14 8-14 8V16z" fill="white" opacity="0.6" />
                </svg>
                Video goes here
            </div>

            {/* Corner badge */}
            <div style={{
                position: 'absolute', top: 16, left: 16,
                background: '#22c55e', borderRadius: 999,
                padding: '4px 12px',
                fontFamily: "'DM Mono',monospace", fontSize: 10, fontWeight: 700,
                color: '#0f4a23', letterSpacing: '0.12em', textTransform: 'uppercase',
            }}>
                PlainFuel
            </div>
        </div>
    );
}

// ── Text content panel ────────────────────────────────────────────────────────
function ContentPanel({ animated }: { animated: boolean }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 0, opacity: animated ? 1 : 0, transition: 'opacity 0.5s ease' }}>

            {/* Eyebrow */}
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 18 }}>
                <PulseDot />
                <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 10.5, color: '#15803d', letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 600 }}>The real question</span>
            </div>

            {/* Headline */}
            <h2 style={{
                fontFamily: "'Fraunces', serif",
                fontSize: 'clamp(1.6rem, 3vw, 2.6rem)',
                fontWeight: 900,
                color: '#111410',
                lineHeight: 1.1,
                letterSpacing: '-0.03em',
                marginBottom: 10,
            }}>
                Can we get{' '}
                <span style={{ color: '#15803d', fontStyle: 'italic', position: 'relative', display: 'inline-block' }}>
                    everything
                    <svg viewBox="0 0 240 14" preserveAspectRatio="none" height={10} style={{ position: 'absolute', bottom: -4, left: 0, width: '100%', pointerEvents: 'none' }}>
                        <path d="M4,9 Q60,3 120,7 Q180,11 236,5" fill="none" stroke="#22c55e" strokeWidth="4" strokeLinecap="round" />
                    </svg>
                </span>
                {' '}from food?
            </h2>

            {/* Subhead */}
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16, color: '#374151', lineHeight: 1.7, marginBottom: 28 }}>
                In theory, <strong style={{ color: '#0f4a23' }}>yes.</strong><br />
                In reality, it is <strong style={{ color: '#0f4a23' }}>difficult to do consistently.</strong>
            </p>

            {/* Divider with label */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                <div style={{ height: 1.5, flex: 1, background: 'linear-gradient(90deg,#15803d,transparent)', opacity: 0.18 }} />
                <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 9.5, color: '#6b7a6e', letterSpacing: '0.15em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>Let's look at simple examples</span>
                <div style={{ height: 1.5, flex: 1, background: 'linear-gradient(270deg,#15803d,transparent)', opacity: 0.18 }} />
            </div>

            {/* Bullet items */}
            <div style={{
                background: '#fafaf7',
                border: '1.5px solid rgba(15,74,35,0.12)',
                borderRadius: 14,
                padding: '20px 22px',
                marginBottom: 22,
            }}>
                <BulletItem>
                    <strong style={{ color: '#0f4a23' }}>Spinach</strong> is considered rich in iron — but to meet daily iron needs, you'd need around{' '}
                    <Highlight color="#fee2e2" text="#991b1b">600 grams every day</Highlight>
                </BulletItem>
                <BulletItem>
                    <strong style={{ color: '#0f4a23' }}>Ragi</strong> is rich in calcium — to meet daily calcium needs, you'd need around{' '}
                    <Highlight color="#fef3c7" text="#92400e">300 grams daily</Highlight>
                </BulletItem>
                <BulletItem>
                    <strong style={{ color: '#0f4a23' }}>Eggs</strong> provide Vitamin D3 — to meet daily requirements, you'd need{' '}
                    <Highlight color="#fef9c3" text="#713f12">15 or more eggs every day</Highlight>
                </BulletItem>
            </div>

            {/* Conclusion notepad strip */}
            <div style={{
                background: '#fffef0',
                border: '2px solid #0f4a23',
                borderRadius: 10,
                boxShadow: '4px 5px 0 #0f4a23',
                padding: '18px 20px 18px 28px',
                position: 'relative',
                overflow: 'hidden',
                transform: 'rotate(-0.4deg)',
                marginBottom: 24,
            }}>
                {/* Notepad lines */}
                <div style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(transparent, transparent 27px, rgba(21,128,61,0.08) 27px, rgba(21,128,61,0.08) 28px)', backgroundPositionY: 28, pointerEvents: 'none' }} />
                {/* Margin rule */}
                <div style={{ position: 'absolute', left: 16, top: 0, bottom: 0, width: 2, background: 'rgba(21,128,61,0.2)' }} />

                <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 9.5, color: '#15803d', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 600, marginBottom: 10, position: 'relative', zIndex: 1 }}>
                    The real insight
                </div>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15.5, color: '#0f4a23', lineHeight: 1.75, position: 'relative', zIndex: 1 }}>
                    This is not practical for most people.<br />
                    The problem is not{' '}
                    <span style={{ background: '#fee2e2', padding: '1px 6px', borderRadius: 4, fontWeight: 700, color: '#991b1b' }}>lack of knowledge</span>.<br />
                    The problem is{' '}
                    <span style={{ background: '#dcfce7', padding: '1px 6px', borderRadius: 4, fontWeight: 700 }}>consistency and practicality</span>.
                </p>
            </div>

            {/* PlainFuel CTA strip */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <svg viewBox="0 0 80 40" width={40} style={{ opacity: 0.45 }}>
                    <path d="M4,20 Q30,8 60,20" fill="none" stroke="#15803d" strokeWidth="3.5" strokeLinecap="round" />
                    <path d="M52,10 L64,20 L52,30" fill="none" stroke="#15803d" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 10.5, color: '#15803d', letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 600, opacity: 0.75 }}>PlainFuel bridges this gap</span>
                <svg viewBox="0 0 80 40" width={40} style={{ opacity: 0.45, transform: 'scaleX(-1)' }}>
                    <path d="M4,20 Q30,8 60,20" fill="none" stroke="#15803d" strokeWidth="3.5" strokeLinecap="round" />
                    <path d="M52,10 L64,20 L52,30" fill="none" stroke="#15803d" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </div>
        </div>
    );
}

// ── Root export ───────────────────────────────────────────────────────────────
export default function CanWeGetFromFoodVideo() {
    const [animated, setAnimated] = useState(false);
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const obs = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) { setAnimated(true); obs.disconnect(); }
        }, { threshold: 0.15 });
        if (sectionRef.current) obs.observe(sectionRef.current);
        return () => obs.disconnect();
    }, []);

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,900;1,9..144,700&family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@500;600&display=swap');

        @keyframes pfPulse { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(0.6);opacity:0.5} }
        @keyframes cfvFadeUp {
          from { opacity: 0; transform: translateY(22px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .cfv-section {
          background: #fafaf7;
          padding: clamp(48px,8vw,88px) clamp(24px,5vw,56px);
          position: relative;
          overflow: hidden;
        }
        .cfv-section::before {
          content: '';
          position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(21,128,61,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(21,128,61,0.04) 1px, transparent 1px);
          background-size: 44px 44px;
          pointer-events: none;
        }

        .cfv-grid {
          max-width: 1120px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: clamp(32px, 5vw, 64px);
          align-items: center;
        }

        .cfv-animate {
          opacity: 0;
          animation: cfvFadeUp 0.7s cubic-bezier(0.22,1,0.36,1) forwards;
        }
        .cfv-animate.delay-1 { animation-delay: 0.1s; }
        .cfv-animate.delay-2 { animation-delay: 0.25s; }

        @media (max-width: 780px) {
          .cfv-grid {
            grid-template-columns: 1fr !important;
          }
          .cfv-video-col {
            max-width: 340px;
            margin: 0 auto;
          }
        }
      `}</style>

            <section className="cfv-section" ref={sectionRef}>
                {/* Background doodles */}
                <svg style={{ position: 'absolute', top: '5%', left: '2%', width: 110, opacity: 0.08, pointerEvents: 'none' }} viewBox="0 0 100 100">
                    <ellipse cx="50" cy="50" rx="44" ry="42" fill="none" stroke="#15803d" strokeWidth="3" strokeDasharray="7 5" strokeLinecap="round" />
                </svg>
                <svg style={{ position: 'absolute', bottom: '5%', right: '2%', width: 80, opacity: 0.08, pointerEvents: 'none' }} viewBox="0 0 100 100">
                    <polygon points="50,4 61,35 95,35 68,57 79,91 50,70 21,91 32,57 5,35 39,35" fill="none" stroke="#15803d" strokeWidth="2.5" />
                </svg>

                <div className="cfv-grid">
                    {/* LEFT — video */}
                    <div className={`cfv-video-col ${animated ? 'cfv-animate delay-1' : ''}`} style={{ opacity: animated ? undefined : 0 }}>
                        <VideoPanel />
                    </div>

                    {/* RIGHT — text content */}
                    <div className={animated ? 'cfv-animate delay-2' : ''} style={{ opacity: animated ? undefined : 0 }}>
                        <ContentPanel animated={animated} />
                    </div>
                </div>
            </section>
        </>
    );
}