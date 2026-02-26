'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useScroll, useTransform, motion, useMotionValueEvent } from 'framer-motion';
import { useRef, useState, useMemo, Suspense } from 'react';
import * as THREE from 'three';
import Image from 'next/image';

function ProductMesh({ scrollProgress }: { scrollProgress: number }) {
    const meshRef = useRef<THREE.Mesh>(null);
    const groupRef = useRef<THREE.Group>(null);

    // Scroll-driven animations
    const targetRotY = useMemo(() => scrollProgress * Math.PI * 3, [scrollProgress]);
    const targetRotX = useMemo(() => Math.sin(scrollProgress * Math.PI * 2) * 0.3, [scrollProgress]);
    const targetScale = useMemo(() => 0.7 + scrollProgress * 0.5, [scrollProgress]);
    const targetPosY = useMemo(() => Math.sin(scrollProgress * Math.PI) * 0.5, [scrollProgress]);

    useFrame((_state, delta) => {
        if (!groupRef.current) return;
        // Smooth interpolation for buttery feel
        groupRef.current.rotation.y += (targetRotY - groupRef.current.rotation.y) * delta * 3;
        groupRef.current.rotation.x += (targetRotX - groupRef.current.rotation.x) * delta * 3;
        const s = groupRef.current.scale.x + (targetScale - groupRef.current.scale.x) * delta * 3;
        groupRef.current.scale.set(s, s, s);
        groupRef.current.position.y += (targetPosY - groupRef.current.position.y) * delta * 3;
    });

    return (
        <group ref={groupRef}>
            {/* Product Pack — Rounded Box */}
            <mesh ref={meshRef} castShadow>
                <boxGeometry args={[1.6, 2.4, 0.8, 4, 4, 4]} />
                <meshPhysicalMaterial
                    color="#2d2d2d"
                    metalness={0.1}
                    roughness={0.3}
                    clearcoat={0.8}
                    clearcoatRoughness={0.2}
                    envMapIntensity={1}
                />
            </mesh>

            {/* Label Strip on Front */}
            <mesh position={[0, 0, 0.401]}>
                <planeGeometry args={[1.3, 1.8]} />
                <meshPhysicalMaterial
                    color="#3a6b35"
                    metalness={0}
                    roughness={0.6}
                />
            </mesh>

            {/* Top stripe */}
            <mesh position={[0, 0.7, 0.402]}>
                <planeGeometry args={[1.3, 0.25]} />
                <meshPhysicalMaterial color="#ffffff" metalness={0} roughness={0.8} />
            </mesh>

            {/* Accent Line */}
            <mesh position={[0, -0.3, 0.403]}>
                <planeGeometry args={[1, 0.04]} />
                <meshPhysicalMaterial color="#7cb342" metalness={0.3} roughness={0.4} />
            </mesh>

            {/* Seal on top */}
            <mesh position={[0, 1.25, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.3, 0.3, 0.1, 16]} />
                <meshPhysicalMaterial color="#3a6b35" metalness={0.2} roughness={0.4} />
            </mesh>
        </group>
    );
}

function Scene({ scrollProgress }: { scrollProgress: number }) {
    return (
        <>
            <ambientLight intensity={0.4} />
            <directionalLight position={[5, 5, 5]} intensity={1.2} castShadow />
            <directionalLight position={[-3, 3, -3]} intensity={0.4} color="#7cb342" />
            <pointLight position={[0, -3, 3]} intensity={0.5} color="#f5e6c8" />
            <spotLight position={[0, 8, 0]} angle={0.3} penumbra={0.8} intensity={0.8} />
            <ProductMesh scrollProgress={scrollProgress} />
        </>
    );
}

export default function Product3DShowcase() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [progress, setProgress] = useState(0);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start start', 'end end'],
    });

    useMotionValueEvent(scrollYProgress, 'change', (v) => setProgress(v));

    // Text reveals at scroll milestones
    const step1Op = useTransform(scrollYProgress, [0.05, 0.15], [0, 1]);
    const step2Op = useTransform(scrollYProgress, [0.25, 0.35], [0, 1]);
    const step3Op = useTransform(scrollYProgress, [0.45, 0.55], [0, 1]);
    const step4Op = useTransform(scrollYProgress, [0.65, 0.75], [0, 1]);
    const step5Op = useTransform(scrollYProgress, [0.85, 0.95], [0, 1]);

    const step1Y = useTransform(scrollYProgress, [0.05, 0.15], [30, 0]);
    const step2Y = useTransform(scrollYProgress, [0.25, 0.35], [30, 0]);
    const step3Y = useTransform(scrollYProgress, [0.45, 0.55], [30, 0]);
    const step4Y = useTransform(scrollYProgress, [0.65, 0.75], [30, 0]);
    const step5Y = useTransform(scrollYProgress, [0.85, 0.95], [30, 0]);

    // Progress bar
    const barWidth = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

    const steps = [
        { opacity: step1Op, y: step1Y, label: 'Step 01', title: 'Open the pack', desc: 'Premium, resealable packaging keeps it fresh.' },
        { opacity: step2Op, y: step2Y, label: 'Step 02', title: 'Take one scoop', desc: 'The perfect amount — designed to complement, not overload.' },
        { opacity: step3Op, y: step3Y, label: 'Step 03', title: 'Mix into food', desc: 'Oats, dosa batter, roti atta, smoothie — your choice.' },
        { opacity: step4Op, y: step4Y, label: 'Step 04', title: 'Eat as usual', desc: 'No taste change. No extra steps. Just better nutrition.' },
        { opacity: step5Op, y: step5Y, label: 'Result', title: 'Stay complete', desc: 'Protein + Fibre + Micronutrients. Every single day.' },
    ];

    return (
        <section ref={containerRef} id="how-it-works" className="relative h-[500vh] bg-gradient-to-b from-[#fafaf7] to-[#f0ede8]">
            <div className="sticky top-0 h-screen flex overflow-hidden">

                {/* Left: 3D Product Canvas */}
                <div className="flex-1 relative">
                    <Canvas camera={{ position: [0, 0, 5], fov: 45 }} className="!absolute inset-0">
                        <Suspense fallback={null}>
                            <Scene scrollProgress={progress} />
                        </Suspense>
                    </Canvas>

                    {/* Progress ring at bottom */}
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3">
                        <div className="w-32 h-1 bg-black/10 rounded-full overflow-hidden">
                            <motion.div style={{ width: barWidth }} className="h-full bg-[#3a6b35] rounded-full" />
                        </div>
                        <span className="text-xs font-medium text-[#171717]/40">Scroll to explore</span>
                    </div>
                </div>

                {/* Right: Step Text Reveals */}
                <div className="w-[40%] hidden lg:flex flex-col justify-center px-12 relative">
                    {steps.map((step, i) => (
                        <motion.div key={i}
                            style={{ opacity: step.opacity, y: step.y }}
                            className="absolute inset-y-0 left-0 right-0 flex flex-col justify-center px-12"
                        >
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#3a6b35] mb-4">{step.label}</p>
                            <h3 className="font-playfair text-4xl md:text-5xl font-bold text-[#171717] leading-tight mb-4">{step.title}</h3>
                            <p className="text-lg text-[#171717]/50 leading-relaxed max-w-md">{step.desc}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Mobile: Step overlay */}
                <div className="lg:hidden absolute bottom-24 inset-x-0 text-center px-6">
                    {steps.map((step, i) => (
                        <motion.div key={i} style={{ opacity: step.opacity, y: step.y }} className="absolute inset-x-0 bottom-0 px-6">
                            <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-black/5 mx-auto max-w-sm">
                                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#3a6b35] mb-2">{step.label}</p>
                                <h3 className="font-playfair text-2xl font-bold text-[#171717] mb-2">{step.title}</h3>
                                <p className="text-sm text-[#171717]/50">{step.desc}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
