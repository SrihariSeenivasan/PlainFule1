'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { BRAND, BRAND_DARK, BRAND_LIGHT, CREAM, GridBg, GreenTag, SectionStyles, FadeUp } from './shared';

const ingredients = [
  { label: 'Protein', detail: '25g whey · complete amino profile', emoji: '💪' },
  { label: 'Fiber', detail: '6g for digestion', emoji: '🌿' },
  { label: 'Vitamins', detail: 'B-complex · D3 · C', emoji: '☀️' },
  { label: 'Minerals', detail: 'Calcium · Magnesium · Zinc · Selenium', emoji: '🦴' },
  { label: 'Enzymes', detail: 'Digestive enzymes for absorption', emoji: '🔬' },
];

export default function WhatContains() {
  return (
    <section style={{ background: '#f5f5ee', minHeight: '100vh', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'clamp(48px,6vw,100px) clamp(20px,5vw,80px)' }}>
      <SectionStyles />
      <GridBg />
      <div style={{ position: 'absolute', top: '10%', right: '6%', width: 150, height: 150, borderRadius: '50%', background: BRAND, opacity: 0.07, filter: 'blur(30px)' }} />

      <div style={{ maxWidth: 1100, width: '100%', position: 'relative', zIndex: 2 }}>
        <FadeUp>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}><GreenTag>✦ WHAT'S INSIDE</GreenTag></div>
            <h2 style={{ fontFamily: "'Permanent Marker', cursive", fontSize: 'clamp(2rem,4vw,3.2rem)', color: BRAND_DARK, margin: '0 0 8px' }}>
              Each serving gives you:
            </h2>
            <p style={{ fontFamily: "'Kalam', cursive", fontSize: 16, fontWeight: 700, color: BRAND, margin: 0 }}>
              Everything radiating from one single scoop.
            </p>
          </div>
        </FadeUp>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 48, alignItems: 'start' }}>
          {/* Left — Jar */}
          <FadeUp delay={0.1}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <svg viewBox="0 0 160 190" style={{ width: 160 }}>
                <motion.rect x="16" y="12" width="128" height="24" rx="7"
                  fill={BRAND_LIGHT} stroke={BRAND_DARK} strokeWidth="3.5"
                  initial={{ pathLength: 0, opacity: 0 }} whileInView={{ pathLength: 1, opacity: 1 }} viewport={{ once: true }}
                  transition={{ duration: 0.5 }} />
                <motion.path d="M 28,36 L 18,172 L 142,172 L 132,36 Z"
                  fill={BRAND_LIGHT} stroke={BRAND_DARK} strokeWidth="3.5"
                  initial={{ pathLength: 0, opacity: 0 }} whileInView={{ pathLength: 1, opacity: 1 }} viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.4 }} />
                <motion.rect x="42" y="82" width="76" height="56" rx="6"
                  fill="#fff" stroke={BRAND} strokeWidth="2.5"
                  initial={{ pathLength: 0, opacity: 0 }} whileInView={{ pathLength: 1, opacity: 1 }} viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: 0.9 }} />
                <motion.text x="80" y="105" textAnchor="middle" fill={BRAND_DARK}
                  style={{ fontFamily: "'Permanent Marker',cursive", fontSize: 9, fontWeight: 700, letterSpacing: '0.08em' }}
                  initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 1.4 }}>
                  PLAIN
                </motion.text>
                <motion.text x="80" y="120" textAnchor="middle" fill={BRAND}
                  style={{ fontFamily: "'Permanent Marker',cursive", fontSize: 9, fontWeight: 700 }}
                  initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 1.5 }}>
                  FUEL
                </motion.text>
                {/* Radiating dashes */}
                {[-55, -27, 0, 27, 55].map((angle, i) => {
                  const rad = (angle * Math.PI) / 180;
                  return (
                    <motion.line key={i}
                      x1={80 + 55 * Math.cos(rad - Math.PI / 2)} y1={104 + 55 * Math.sin(rad - Math.PI / 2)}
                      x2={80 + 72 * Math.cos(rad - Math.PI / 2)} y2={104 + 72 * Math.sin(rad - Math.PI / 2)}
                      stroke={BRAND} strokeWidth="2.5" strokeLinecap="round" strokeDasharray="3 4"
                      initial={{ pathLength: 0, opacity: 0 }} whileInView={{ pathLength: 1, opacity: 0.6 }} viewport={{ once: true }}
                      transition={{ delay: 1.6 + i * 0.1, duration: 0.4 }} />
                  );
                })}
              </svg>
              <p style={{ fontFamily: "'Permanent Marker', cursive", fontSize: 18, color: BRAND_DARK, marginTop: 8, textAlign: 'center' }}>PlainFuel</p>
              <p style={{ fontFamily: "'Kalam', cursive", fontSize: 13, fontWeight: 700, color: BRAND, opacity: 0.8, textAlign: 'center' }}>daily nutrition scoop</p>
            </div>
          </FadeUp>

          {/* Right — Ingredient cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
            {ingredients.slice(0, 4).map((item, idx) => (
              <motion.div
                key={item.label}
                className="pf2-card"
                style={{ transform: `rotate(${idx % 2 === 0 ? -0.5 : 0.8}deg)` }}
                initial={{ opacity: 0, x: idx % 2 === 0 ? -30 : 30, y: 20 }}
                whileInView={{ opacity: 1, x: 0, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: 0.15 * idx, type: 'spring', stiffness: 160 }}
              >
                <div className="pf2-card-inner" style={{ padding: '16px 16px 16px 40px', display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                  <span style={{ fontSize: 28, lineHeight: 1, flexShrink: 0, marginTop: 2 }}>{item.emoji}</span>
                  <div>
                    <p style={{ fontFamily: "'Permanent Marker', cursive", fontSize: 20, color: BRAND_DARK, margin: '0 0 4px' }}>{item.label}</p>
                    <p style={{ fontFamily: "'Kalam', cursive", fontSize: 13, fontWeight: 700, color: BRAND, margin: 0, lineHeight: 1.5 }}>{item.detail}</p>
                  </div>
                </div>
              </motion.div>
            ))}
            {/* 5th card spans full width */}
            <motion.div
              className="pf2-card" style={{ gridColumn: 'span 2', transform: 'rotate(0.3deg)' }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.65, type: 'spring' }}
            >
              <div className="pf2-card-inner" style={{ padding: '16px 16px 16px 40px', display: 'flex', gap: 14, alignItems: 'center' }}>
                <span style={{ fontSize: 28, lineHeight: 1, flexShrink: 0 }}>{ingredients[4].emoji}</span>
                <div>
                  <p style={{ fontFamily: "'Permanent Marker', cursive", fontSize: 20, color: BRAND_DARK, margin: '0 0 4px' }}>{ingredients[4].label}</p>
                  <p style={{ fontFamily: "'Kalam', cursive", fontSize: 13, fontWeight: 700, color: BRAND, margin: 0 }}>{ingredients[4].detail}</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
