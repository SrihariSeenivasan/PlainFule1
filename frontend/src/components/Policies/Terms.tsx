'use client';

import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';

export default function Terms({ onNavigate }: { onNavigate?: (view: string) => void } = {}) {
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
            Terms of Service
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
              Acceptance of Terms
            </h2>
            <p className="text-gray-700 leading-relaxed">
              By accessing and using the PlainFuel website, mobile application, and services, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
            </p>
            <p className="text-gray-700 leading-relaxed">
              These Terms of Service may be updated periodically without notice. Your continued use of the PlainFuel services following the posting of revised Terms means that you accept and agree to the changes.
            </p>
          </motion.section>

          {/* Section 2 */}
          <motion.section variants={itemVariants} className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <span className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</span>
              Use License
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Permission is granted to temporarily download one copy of the materials (information or software) from PlainFuel for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Modify or copy the materials</li>
              <li>Use the materials for any commercial purpose or for any public display</li>
              <li>Attempt to reverse engineer any software contained on PlainFuel</li>
              <li>Remove any copyright or other proprietary notations from the materials</li>
              <li>Transfer the materials to another person or &quot;mirror&quot; the materials on any other server</li>
              <li>Use automated tools or scripts to scrape content from our website</li>
            </ul>
          </motion.section>

          {/* Section 3 */}
          <motion.section variants={itemVariants} className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <span className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</span>
              User Accounts
            </h2>
            <p className="text-gray-700 leading-relaxed">
              To use certain features of PlainFuel, you may be required to create an account. You agree to:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Provide accurate, truthful information during registration</li>
              <li>Keep your password confidential and secure</li>
              <li>Not share your account with others or allow unauthorized access</li>
              <li>Be responsible for all activities under your account</li>
              <li>Update account information as needed</li>
              <li>Notify us immediately of any unauthorized use</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              PlainFuel reserves the right to suspend or terminate any account that violates these terms.
            </p>
          </motion.section>

          {/* Section 4 */}
          <motion.section variants={itemVariants} className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <span className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">4</span>
              Product Information & Pricing
            </h2>
            <p className="text-gray-700 leading-relaxed">
              PlainFuel strives to provide accurate product descriptions and pricing. However, we do not warrant that product descriptions, pricing, or other website content is accurate, complete, or error-free.
            </p>
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <p className="text-blue-900 text-sm">
                <strong>Pricing:</strong> We reserve the right to change prices at any time. Promotional pricing is valid only during specified periods. We reserve the right to refuse service or cancel orders.
              </p>
            </div>
          </motion.section>

          {/* Section 5 */}
          <motion.section variants={itemVariants} className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <span className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">5</span>
              Age Requirement
            </h2>
            <p className="text-gray-700 leading-relaxed">
              You must be at least 18 years of age to make purchases from PlainFuel. By using our services and making purchases, you represent and warrant that you are at least 18 years old and of legal age to form a binding contract under the laws of your place of residence.
            </p>
          </motion.section>

          {/* Section 6 */}
          <motion.section variants={itemVariants} className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <span className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">6</span>
              Product Disclaimer & Health Warning
            </h2>
            <p className="text-gray-700 leading-relaxed">
              <strong>These products are not intended to diagnose, treat, cure, or prevent any disease.</strong>
            </p>
            <p className="text-gray-700 leading-relaxed">
              All product information, testimonials, and claims are for informational purposes only. PlainFuel does not make any health or medical claims regarding its products. Always consult with a healthcare professional before starting any new supplement regimen, especially if you:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Are pregnant or nursing</li>
              <li>Have any medical conditions</li>
              <li>Are taking medications or other supplements</li>
              <li>Are allergic to any ingredients</li>
            </ul>
          </motion.section>

          {/* Section 7 */}
          <motion.section variants={itemVariants} className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <span className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">7</span>
              Intellectual Property Rights
            </h2>
            <p className="text-gray-700 leading-relaxed">
              All content on PlainFuel, including but not limited to text, images, logos, graphics, and software, is the property of PlainFuel or its content suppliers and is protected by copyright, trademark, and other intellectual property laws. You may not:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Reproduce or distribute any content without permission</li>
              <li>Use our trademarks without authorization</li>
              <li>Create derivative works from our content</li>
              <li>Use content for commercial purposes</li>
            </ul>
          </motion.section>

          {/* Section 8 */}
          <motion.section variants={itemVariants} className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <span className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">8</span>
              User Content & Reviews
            </h2>
            <p className="text-gray-700 leading-relaxed">
              You retain ownership of any content you submit (reviews, comments, etc.), but grant PlainFuel a worldwide, non-exclusive, royalty-free license to use, edit, and display your content. By submitting content, you agree that:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Your content is accurate and truthful</li>
              <li>Your content does not violate anyone&apos;s rights</li>
              <li>Your content does not contain spam or promotional content</li>
              <li>Your content does not contain offensive or inappropriate material</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              PlainFuel reserves the right to remove content that violates these terms without notice.
            </p>
          </motion.section>

          {/* Section 9 */}
          <motion.section variants={itemVariants} className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <span className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">9</span>
              Limitation of Liability
            </h2>
            <p className="text-gray-700 leading-relaxed">
              In no event shall PlainFuel, its directors, employees, or agents be liable for any indirect, incidental, special, consequential, or punitive damages, including lost profits, even if advised of the possibility of such damages. Our liability shall not exceed the amount you paid for products purchased.
            </p>
          </motion.section>

          {/* Section 10 */}
          <motion.section variants={itemVariants} className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <span className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">10</span>
              Indemnification
            </h2>
            <p className="text-gray-700 leading-relaxed">
              You agree to indemnify and hold harmless PlainFuel and its officers, directors, employees, and agents from any claims, damages, losses, or expenses (including legal fees) arising from:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Your violation of these Terms of Service</li>
              <li>Your use of our services</li>
              <li>Your infringement of any intellectual property rights</li>
              <li>Any content you submit</li>
            </ul>
          </motion.section>

          {/* Section 11 */}
          <motion.section variants={itemVariants} className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <span className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">11</span>
              Third-Party Links
            </h2>
            <p className="text-gray-700 leading-relaxed">
              PlainFuel may contain links to third-party websites. We are not responsible for the content, accuracy, or practices of these external sites. Your use of third-party websites is at your own risk and governed by their terms of service.
            </p>
          </motion.section>

          {/* Section 12 */}
          <motion.section variants={itemVariants} className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <span className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">12</span>
              Governing Law
            </h2>
            <p className="text-gray-700 leading-relaxed">
              These Terms of Service and all related policies are governed by and construed in accordance with the laws of the United States, and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
            </p>
          </motion.section>

          {/* Section 13 */}
          <motion.section variants={itemVariants} className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <span className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">13</span>
              Dispute Resolution
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Any disputes arising from your use of PlainFuel shall first be addressed through our customer support team. If resolution cannot be reached, disputes shall be resolved through binding arbitration in accordance with the rules of the American Arbitration Association.
            </p>
          </motion.section>

          {/* Section 14 */}
          <motion.section variants={itemVariants} className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <span className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">14</span>
              Entire Agreement
            </h2>
            <p className="text-gray-700 leading-relaxed">
              These Terms of Service, along with our Privacy Policy and other policies, constitute the entire agreement between you and PlainFuel regarding your use of our services and supersede all prior or contemporaneous communications.
            </p>
          </motion.section>

          {/* Contact Section */}
          <motion.section variants={itemVariants} className="border-t pt-8 space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">Questions About Our Terms?</h2>
            <p className="text-gray-700 leading-relaxed">
              If you have any questions about these Terms of Service, please contact us:
            </p>
            <div className="bg-green-50 p-6 rounded-lg space-y-2">
              <p className="text-gray-900"><strong>PlainFuel Legal Team</strong></p>
              <p className="text-gray-700">Email: legal@plainfuel.com</p>
              <p className="text-gray-700">Address: PlainFuel Inc., USA</p>
              <p className="text-gray-700">Phone: 1-800-PLAINFUEL</p>
            </div>
          </motion.section>
        </motion.div>
      </motion.div>
      </div>
    </div>
  );
}
