
'use client';

import { motion } from 'framer-motion';
import MainLayout from '@/components/MainLayout';
import { F_SIZE, BRAND } from "@/lib/typography";

export default function PaymentPolicy() {
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
    <MainLayout background="#ffffff">
      <div className="py-12 px-4" style={{ paddingTop: 100 }}>
        <motion.div
          className="max-w-4xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h1 style={{ fontSize: F_SIZE.xl, fontFamily: "'Montserrat', sans-serif", color: BRAND.espresso }} className="font-extrabold mb-4 tracking-tight">
              Payment Policy
            </h1>
            <p style={{ fontSize: F_SIZE.lg, fontFamily: "'Montserrat', sans-serif", color: BRAND.espresso, opacity: 0.8 }} className="font-medium">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </motion.div>

          {/* Content */}
          <motion.div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 space-y-8">
            {/* Section 1 */}
            <motion.section variants={itemVariants} className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <span className="w-8 h-8 style={{ backgroundColor: BRAND.burgundy }} text-white rounded-full flex items-center justify-center text-sm font-bold">1</span>
                Accepted Payment Methods
              </h2>
              <p style={{ fontSize: F_SIZE.md, fontFamily: "'Montserrat', sans-serif", color: BRAND.espresso }} className="text-gray-700 leading-relaxed font-medium opacity-80">
                Plainfuel accepts the following payment methods:
              </p>
              <ul style={{ fontSize: F_SIZE.md, fontFamily: "'Montserrat', sans-serif", color: BRAND.espresso }} className="list-disc list-inside text-gray-700 space-y-2 font-medium opacity-80">
                <li>Credit Cards (Visa, Mastercard, American Express)</li>
                <li>Debit Cards</li>
                <li>Digital Wallets (Apple Pay, Google Pay)</li>
                <li>Bank Transfers</li>
                <li>UPI (in select regions)</li>
              </ul>
            </motion.section>

            {/* Section 2 */}
            <motion.section variants={itemVariants} className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <span className="w-8 h-8 style={{ backgroundColor: BRAND.burgundy }} text-white rounded-full flex items-center justify-center text-sm font-bold">2</span>
                Payment Security
              </h2>
              <p style={{ fontSize: F_SIZE.md, fontFamily: "'Montserrat', sans-serif", color: BRAND.espresso }} className="text-gray-700 leading-relaxed font-medium opacity-80">
                All transactions on Plainfuel are processed through secure, encrypted channels. We do not store your credit card information. All payment processing is handled by industry-leading payment gateways that comply with PCI DSS standards.
              </p>
            </motion.section>

            {/* Section 3 */}
            <motion.section variants={itemVariants} className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <span className="w-8 h-8 style={{ backgroundColor: BRAND.burgundy }} text-white rounded-full flex items-center justify-center text-sm font-bold">3</span>
                Billing & Invoicing
              </h2>
              <p style={{ fontSize: F_SIZE.md, fontFamily: "'Montserrat', sans-serif", color: BRAND.espresso }} className="text-gray-700 leading-relaxed font-medium opacity-80">
                Invoices will be sent to the email address provided during checkout. You can also access your invoices from your user dashboard. Invoices are typically generated within 24 hours of payment completion.
              </p>
            </motion.section>

            {/* Section 4 */}
            <motion.section variants={itemVariants} className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <span className="w-8 h-8 style={{ backgroundColor: BRAND.burgundy }} text-white rounded-full flex items-center justify-center text-sm font-bold">4</span>
                Subscription Billing
              </h2>
              <p style={{ fontSize: F_SIZE.md, fontFamily: "'Montserrat', sans-serif", color: BRAND.espresso }} className="text-gray-700 leading-relaxed font-medium opacity-80">
                If you have an active subscription, your payment method will be automatically charged on the renewal date. You will receive a reminder email 3 days before your billing date. You can update or change your payment method from your account settings at any time.
              </p>
            </motion.section>

            {/* Section 5 */}
            <motion.section variants={itemVariants} className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <span className="w-8 h-8 style={{ backgroundColor: BRAND.burgundy }} text-white rounded-full flex items-center justify-center text-sm font-bold">5</span>
                Failed Payments
              </h2>
              <p style={{ fontSize: F_SIZE.md, fontFamily: "'Montserrat', sans-serif", color: BRAND.espresso }} className="text-gray-700 leading-relaxed font-medium opacity-80">
                If a payment fails, we will attempt to charge your payment method again up to 3 times over a 5-day period. If all attempts fail, your subscription will be suspended until payment is successfully processed. Please update your payment information to reactivate your subscription.
              </p>
            </motion.section>

            {/* Section 6 */}
            <motion.section variants={itemVariants} className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <span className="w-8 h-8 style={{ backgroundColor: BRAND.burgundy }} text-white rounded-full flex items-center justify-center text-sm font-bold">6</span>
                Currency & Taxes
              </h2>
              <p style={{ fontSize: F_SIZE.md, fontFamily: "'Montserrat', sans-serif", color: BRAND.espresso }} className="text-gray-700 leading-relaxed font-medium opacity-80">
                Prices are displayed in your local currency based on your location. Applicable taxes may be added at checkout depending on your jurisdiction. We will provide a full breakdown of costs before you complete your purchase.
              </p>
            </motion.section>

            {/* Section 7 */}
            <motion.section variants={itemVariants} className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <span className="w-8 h-8 style={{ backgroundColor: BRAND.burgundy }} text-white rounded-full flex items-center justify-center text-sm font-bold">7</span>
                Disputes & Chargebacks
              </h2>
              <p style={{ fontSize: F_SIZE.md, fontFamily: "'Montserrat', sans-serif", color: BRAND.espresso }} className="text-gray-700 leading-relaxed font-medium opacity-80">
                If you have a legitimate payment dispute, please contact our support team before initiating a chargeback. We will work with you to resolve the issue promptly. Chargebacks may result in additional fees and suspension of your account.
              </p>
            </motion.section>

            {/* Section 8 */}
            <motion.section variants={itemVariants} className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <span className="w-8 h-8 style={{ backgroundColor: BRAND.burgundy }} text-white rounded-full flex items-center justify-center text-sm font-bold">8</span>
                Contact Us
              </h2>
              <p style={{ fontSize: F_SIZE.md, fontFamily: "'Montserrat', sans-serif", color: BRAND.espresso }} className="text-gray-700 leading-relaxed font-medium opacity-80">
                For payment-related questions or concerns, please contact our support team:
              </p>
              <div className="bg-[#EFE9E1] border-l-4  p-4 rounded">
                <p className="text-gray-900 font-semibold mb-2">Plainfuel Customer Support</p>
                <p className="text-gray-700">Email: support@plainfuel.com</p>
                <p className="text-gray-700">Hours: Monday - Friday, 9 AM - 5 PM EST</p>
              </div>
            </motion.section>
          </motion.div>
        </motion.div>
      </div>
    </MainLayout>
  );
}




