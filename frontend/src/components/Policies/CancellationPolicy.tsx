'use client';

import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';

export default function CancellationPolicy({ onNavigate }: { onNavigate?: (view: string) => void } = {}) {
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white">
      <Navbar onNavigate={onNavigate} />
      <div className="py-12 px-4" style={{ paddingTop: 100 }}>
        <motion.div
          className="max-w-4xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Cancellation Policy
            </h1>
            <p className="text-gray-600 text-lg">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </motion.div>

          {/* Content */}
          <motion.div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 space-y-8">
            {/* Section 1 */}
            <motion.section variants={itemVariants} className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <span className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</span>
                Cancellation Rights
              </h2>
              <p className="text-gray-700 leading-relaxed">
                At Plainfuel, we understand that circumstances change. You have the right to cancel your subscription or order within 14 days of purchase. This policy applies to all digital and physical products ordered through our platform.
              </p>
            </motion.section>

            {/* Section 2 */}
            <motion.section variants={itemVariants} className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <span className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</span>
                How to Cancel
              </h2>
              <p className="text-gray-700 leading-relaxed">
                To cancel your order or subscription:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Contact our customer support team at support@plainfuel.com</li>
                <li>Provide your order number or subscription ID</li>
                <li>State your reason for cancellation (optional)</li>
                <li>We will process your cancellation within 2 business days</li>
              </ul>
            </motion.section>

            {/* Section 3 */}
            <motion.section variants={itemVariants} className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <span className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</span>
                Refunds
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Once your cancellation is processed, refunds will be issued to your original payment method within 5-7 business days. Please note that subscription cancellations are effective immediately, but you may continue to have access until the end of your current billing period.
              </p>
            </motion.section>

            {/* Section 4 */}
            <motion.section variants={itemVariants} className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <span className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">4</span>
                Exceptions
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Cancellations cannot be processed for orders already shipped or delivered, unless they qualify under our Return Policy. Digital downloads cannot be cancelled after purchase.
              </p>
            </motion.section>

            {/* Section 5 */}
            <motion.section variants={itemVariants} className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <span className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">5</span>
                Contact Us
              </h2>
              <p className="text-gray-700 leading-relaxed">
                If you have questions about our cancellation policy, please reach out to our support team:
              </p>
              <div className="bg-green-50 border-l-4 border-green-600 p-4 rounded">
                <p className="text-gray-900 font-semibold mb-2">Plainfuel Customer Support</p>
                <p className="text-gray-700">Email: support@plainfuel.com</p>
                <p className="text-gray-700">Hours: Monday - Friday, 9 AM - 5 PM EST</p>
              </div>
            </motion.section>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
