'use client';

import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';

export default function PrivacyPolicy({ onNavigate }: { onNavigate?: (view: string) => void } = {}) {
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
            Privacy Policy
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
              Introduction
            </h2>
            <p className="text-gray-700 leading-relaxed">
              PlainFuel (&quot;we,&quot; &quot;us,&quot; &quot;our,&quot; or &quot;Company&quot;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services, including any related applications, sales, marketing, or events.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Please read this Privacy Policy carefully. If you do not agree with our policies and practices, please do not use our services.
            </p>
          </motion.section>

          {/* Section 2 */}
          <motion.section variants={itemVariants} className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <span className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</span>
              Information We Collect
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Personal Information You Provide</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Name, email address, and phone number</li>
                  <li>Shipping and billing addresses</li>
                  <li>Payment card information (processed securely)</li>
                  <li>Account login credentials</li>
                  <li>Communication preferences</li>
                  <li>Product reviews and feedback</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Information Automatically Collected</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>IP address and browser type</li>
                  <li>Pages visited and time spent on our website</li>
                  <li>Cookies and similar tracking technologies</li>
                  <li>Device information and operating system</li>
                  <li>Referring URLs and search queries</li>
                </ul>
              </div>
            </div>
          </motion.section>

          {/* Section 3 */}
          <motion.section variants={itemVariants} className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <span className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</span>
              How We Use Your Information
            </h2>
            <p className="text-gray-700 leading-relaxed">We use the information we collect to:</p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Process and fulfill your orders</li>
              <li>Send you promotional materials and newsletters (with your consent)</li>
              <li>Respond to your inquiries and customer service requests</li>
              <li>Improve our website and services</li>
              <li>Prevent fraudulent transactions and enhance security</li>
              <li>Comply with legal obligations</li>
              <li>Conduct market research and analytics</li>
              <li>Personalize your shopping experience</li>
            </ul>
          </motion.section>

          {/* Section 4 */}
          <motion.section variants={itemVariants} className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <span className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">4</span>
              Data Sharing and Disclosure
            </h2>
            <p className="text-gray-700 leading-relaxed">
              We do not sell, rent, or trade your personal information to third parties. However, we may share your information with:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li><strong>Service Providers:</strong> Payment processors, shipping partners, email service providers</li>
              <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
              <li><strong>Business Transfers:</strong> In the event of a merger or acquisition</li>
              <li><strong>Analytics Partners:</strong> To understand usage patterns and improve services</li>
            </ul>
          </motion.section>

          {/* Section 5 */}
          <motion.section variants={itemVariants} className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <span className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">5</span>
              Security of Your Information
            </h2>
            <p className="text-gray-700 leading-relaxed">
              We implement appropriate technical and organizational measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction. These measures include:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>SSL encryption for sensitive data transmission</li>
              <li>Secure payment gateway integration</li>
              <li>Regular security audits and updates</li>
              <li>Limited access to personal information by authorized personnel</li>
              <li>Password protection and account verification</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              While we strive to protect your information, no method of transmission over the Internet is completely secure. We cannot guarantee absolute security.
            </p>
          </motion.section>

          {/* Section 6 */}
          <motion.section variants={itemVariants} className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <span className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">6</span>
              Cookies and Tracking Technologies
            </h2>
            <p className="text-gray-700 leading-relaxed">
              We use cookies, web beacons, and similar tracking technologies to enhance your experience. Cookies help us remember your preferences, track your usage, and provide personalized content. You can adjust your browser settings to refuse cookies, but this may limit your ability to use some features of our website.
            </p>
          </motion.section>

          {/* Section 7 */}
          <motion.section variants={itemVariants} className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <span className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">7</span>
              Your Rights and Choices
            </h2>
            <p className="text-gray-700 leading-relaxed">Depending on your location, you may have the right to:</p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Access the personal information we hold about you</li>
              <li>Request correction of inaccurate information</li>
              <li>Request deletion of your information</li>
              <li>Opt-out of marketing communications</li>
              <li>Request portability of your data</li>
              <li>Lodge complaints with relevant authorities</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              To exercise these rights, please contact us at privacy@plainfuel.com.
            </p>
          </motion.section>

          {/* Section 8 */}
          <motion.section variants={itemVariants} className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <span className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">8</span>
              Retention of Information
            </h2>
            <p className="text-gray-700 leading-relaxed">
              We retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required by law. When information is no longer needed, we securely delete or anonymize it.
            </p>
          </motion.section>

          {/* Section 9 */}
          <motion.section variants={itemVariants} className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <span className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">9</span>
              Third-Party Links
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Our website may contain links to third-party websites. We are not responsible for the privacy practices of these external sites. Please review their privacy policies before providing any personal information.
            </p>
          </motion.section>

          {/* Section 10 */}
          <motion.section variants={itemVariants} className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <span className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">10</span>
              Changes to This Privacy Policy
            </h2>
            <p className="text-gray-700 leading-relaxed">
              We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. We will notify you of significant changes by posting the updated policy on our website and updating the &quot;Last updated&quot; date.
            </p>
          </motion.section>

          {/* Contact Section */}
          <motion.section variants={itemVariants} className="border-t pt-8 space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">Contact Us</h2>
            <p className="text-gray-700 leading-relaxed">
              If you have questions about this Privacy Policy or our privacy practices, please contact us at:
            </p>
            <div className="bg-green-50 p-6 rounded-lg space-y-2">
              <p className="text-gray-900"><strong>PlainFuel Privacy Team</strong></p>
              <p className="text-gray-700">Email: privacy@plainfuel.com</p>
              <p className="text-gray-700">Website: www.plainfuel.com</p>
              <p className="text-gray-700">Response time: We aim to respond within 30 days</p>
            </div>
          </motion.section>
        </motion.div>
      </motion.div>
      </div>
    </div>
  );
}
