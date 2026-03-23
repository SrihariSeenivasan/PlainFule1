'use client';

import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';

const FD = "'Playfair Display', Georgia, serif";
const FS = "'DM Sans', 'Helvetica Neue', sans-serif";
const G = '#15803d';
const BG = '#fdfaf3';

export default function AboutPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div id="about" style={{ minHeight: '100vh', background: BG, fontFamily: FS }}>
      <Navbar />
      
      <div style={{ paddingTop: 100, padding: '48px 24px' }}>
        <motion.div
          className="max-w-4xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Header */}
          <motion.div variants={itemVariants} style={{ marginBottom: 48, textAlign: 'center' }}>
            <h1 style={{
              fontFamily: FD,
              fontSize: 'clamp(32px, 5vw, 48px)',
              fontWeight: 800,
              color: '#1a1a1a',
              margin: '0 0 12px',
              lineHeight: 1.1,
            }}>
              About PlainFuel
            </h1>
            <p style={{
              fontSize: 18,
              color: '#666',
              marginBottom: 0,
              lineHeight: 1.6,
            }}>
              Our mission and story
            </p>
          </motion.div>

          {/* Introduction */}
          <motion.div
            variants={itemVariants}
            style={{
              background: 'white',
              borderRadius: 12,
              padding: 32,
              marginBottom: 32,
              border: `2px dashed rgba(21,128,61,0.2)`,
              boxShadow: '2px 3px 0 rgba(21,128,61,0.1)',
            }}
          >
            <p style={{
              fontSize: 16,
              lineHeight: 1.8,
              color: '#333',
              margin: 0,
            }}>
              <strong>Placeholder content for About page.</strong> This section introduces PlainFuel and our commitment to providing high-quality, science-backed nutritional supplements. Share your brand story, values, and what makes your products unique.
            </p>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: 24,
              marginBottom: 48,
            }}
          >
            {[
              { title: 'Quality', description: 'Placeholder: Describe your quality standards and certifications.' },
              { title: 'Innovation', description: 'Placeholder: Explain your research and development approach.' },
              { title: 'Transparency', description: 'Placeholder: Share your commitment to transparency and honesty.' },
              { title: 'Sustainability', description: 'Placeholder: Discuss your environmental and social responsibility.' },
            ].map((feature, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                style={{
                  background: 'white',
                  borderRadius: 12,
                  padding: 24,
                  border: `2px dashed rgba(21,128,61,0.2)`,
                  boxShadow: '2px 3px 0 rgba(21,128,61,0.08)',
                }}
              >
                <h3 style={{
                  fontFamily: FD,
                  fontSize: 22,
                  fontWeight: 700,
                  color: G,
                  margin: '0 0 12px',
                }}>
                  {feature.title}
                </h3>
                <p style={{
                  fontSize: 14,
                  lineHeight: 1.6,
                  color: '#666',
                  margin: 0,
                }}>
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>

          {/* Team Section */}
          <motion.div
            variants={itemVariants}
            style={{
              background: 'white',
              borderRadius: 12,
              padding: 32,
              marginBottom: 32,
              border: `2px dashed rgba(21,128,61,0.2)`,
              boxShadow: '2px 3px 0 rgba(21,128,61,0.1)',
            }}
          >
            <h2 style={{
              fontFamily: FD,
              fontSize: 28,
              fontWeight: 700,
              color: '#1a1a1a',
              marginBottom: 20,
            }}>
              Our Team
            </h2>
            <p style={{
              fontSize: 16,
              lineHeight: 1.8,
              color: '#333',
              margin: 0,
            }}>
              Placeholder: Tell your visitors about the team behind PlainFuel. Share team member bios, expertise, and what drives your team to create exceptional products.
            </p>
          </motion.div>

          {/* CTA */}
          <motion.div
            variants={itemVariants}
            style={{
              textAlign: 'center',
              paddingTop: 24,
            }}
          >
            <motion.a
              href="/products"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                display: 'inline-block',
                padding: '12px 32px',
                background: G,
                color: '#fff',
                textDecoration: 'none',
                borderRadius: 12,
                fontFamily: FD,
                fontSize: 16,
                fontWeight: 700,
                border: `2px solid ${G}`,
                boxShadow: '3px 4px 0 rgba(21,128,61,0.3)',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
              }}
            >
              Explore Our Products
            </motion.a>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
