'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SketchHighlightProps {
    children: React.ReactNode;
    type?: 'circle' | 'underline' | 'box';
    color?: string;
    className?: string;
    delay?: number;
}

export default function SketchHighlight({
    children,
    type = 'circle',
    color = '#7cb342',
    className,
    delay = 0.5
}: SketchHighlightProps) {
    return (
        <span className={cn("relative inline-block px-1", className)}>
            <span className="relative z-10">{children}</span>
            <svg
                className="absolute inset-x-[-15%] inset-y-[-20%] w-[130%] h-[140%] pointer-events-none z-0"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
            >
                {type === 'circle' && (
                    <motion.path
                        d="M 5,50 C 5,15 95,15 95,50 C 95,85 5,85 10,55"
                        fill="none"
                        stroke={color}
                        strokeWidth="2"
                        strokeLinecap="round"
                        initial={{ pathLength: 0, opacity: 0 }}
                        whileInView={{ pathLength: 1, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay }}
                    />
                )}
                {type === 'underline' && (
                    <motion.path
                        d="M 5,90 C 25,95 75,85 95,92"
                        fill="none"
                        stroke={color}
                        strokeWidth="3"
                        strokeLinecap="round"
                        initial={{ pathLength: 0, opacity: 0 }}
                        whileInView={{ pathLength: 1, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, ease: 'easeOut', delay }}
                    />
                )}
                {type === 'box' && (
                    <motion.path
                        d="M 5,5 L 95,8 L 92,95 L 8,92 L 5,12"
                        fill="none"
                        stroke={color}
                        strokeWidth="2"
                        strokeLinecap="round"
                        initial={{ pathLength: 0, opacity: 0 }}
                        whileInView={{ pathLength: 1, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.5, ease: 'easeInOut', delay }}
                    />
                )}
            </svg>
        </span>
    );
}
