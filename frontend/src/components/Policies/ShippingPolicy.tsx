'use client';

import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';

export default function ShippingPolicy({ onNavigate }: { onNavigate?: (view: string) => void } = {}) {
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
            Shipping Policy
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
              Shipping Methods & Rates
            </h2>
            <p className="text-gray-700 leading-relaxed">
              PlainFuel offers multiple shipping options to meet your needs. Shipping rates are calculated based on your location, order weight, and selected delivery method.
            </p>
            <div className="space-y-3">
              <div className="border-l-4 border-green-600 pl-4">
                <h3 className="font-semibold text-gray-900">Standard Shipping (5-7 Business Days)</h3>
                <p className="text-gray-700">Economical option for non-urgent orders. Free shipping on orders over $50.</p>
              </div>
              <div className="border-l-4 border-green-600 pl-4">
                <h3 className="font-semibold text-gray-900">Express Shipping (2-3 Business Days)</h3>
                <p className="text-gray-700">Faster delivery for time-sensitive orders. Flat rate of $9.99.</p>
              </div>
              <div className="border-l-4 border-green-600 pl-4">
                <h3 className="font-semibold text-gray-900">Overnight Shipping (Next Business Day)</h3>
                <p className="text-gray-700">Premium option for urgent deliveries. Flat rate of $24.99.</p>
              </div>
            </div>
          </motion.section>

          {/* Section 2 */}
          <motion.section variants={itemVariants} className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <span className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</span>
              Delivery Timeline
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Processing time is 1-2 business days from order placement. Shipping times begin after processing is complete. Please note that delivery times are estimates and not guarantees.
            </p>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-900">
                <strong>Note:</strong> Orders placed on weekends or holidays are processed on the next business day. During high-demand periods, processing times may be extended.
              </p>
            </div>
          </motion.section>

          {/* Section 3 */}
          <motion.section variants={itemVariants} className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <span className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</span>
              Shipping Address Requirements
            </h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>We ship to all addresses within the continental United States</li>
              <li>International shipping available to select countries</li>
              <li>Please ensure your address is accurate and complete</li>
              <li>We cannot ship to P.O. boxes for certain products</li>
              <li>PO boxes are accepted for Standard and Express shipping methods</li>
              <li>Overnight shipping is not available to P.O. boxes</li>
            </ul>
          </motion.section>

          {/* Section 4 */}
          <motion.section variants={itemVariants} className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <span className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">4</span>
              Order Tracking
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Once your order ships, you will receive a confirmation email with a tracking number. You can use this tracking number to monitor your package&apos;s progress through our carrier&apos;s website. We use reliable carriers including UPS, FedEx, and USPS.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Tracking information is typically available within 24 hours of shipment.
            </p>
          </motion.section>

          {/* Section 5 */}
          <motion.section variants={itemVariants} className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <span className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">5</span>
              Lost or Damaged Shipments
            </h2>
            <p className="text-gray-700 leading-relaxed">
              If your package arrives damaged or does not arrive within the estimated delivery window, please contact us immediately at support@plainfuel.com with:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Order number and tracking information</li>
              <li>Photos of the damaged packaging or product (if applicable)</li>
              <li>Description of the issue</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              We will work with the carrier to investigate and resolve the issue. Most claims are resolved within 7-10 business days.
            </p>
          </motion.section>

          {/* Section 6 */}
          <motion.section variants={itemVariants} className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <span className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">6</span>
              Signature Requirements
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Standard and Express shipping do not require signatures. However, Overnight and certain high-value shipments may require adult signature upon delivery. The carrier will attempt delivery up to 3 times before returning the package.
            </p>
          </motion.section>

          {/* Section 7 */}
          <motion.section variants={itemVariants} className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <span className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">7</span>
              International Shipping
            </h2>
            <p className="text-gray-700 leading-relaxed">
              We ship to select countries worldwide. International orders typically take 7-21 business days depending on destination. International shipping costs and delivery times will be calculated at checkout.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Customers are responsible for any customs duties, taxes, or import fees that may apply to international orders.
            </p>
          </motion.section>

          {/* Section 8 */}
          <motion.section variants={itemVariants} className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <span className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">8</span>
              Free Shipping
            </h2>
            <p className="text-gray-700 leading-relaxed">
              <strong>Eligibility:</strong> Free standard shipping is available on orders totaling $50 or more (before taxes and excluding shipping costs).
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Free shipping applies to continental U.S. addresses only</li>
              <li>Promotional free shipping codes may apply to orders under $50</li>
              <li>Free shipping cannot be combined with other discounts unless specified</li>
              <li>International orders do not qualify for free shipping</li>
            </ul>
          </motion.section>

          {/* Section 9 */}
          <motion.section variants={itemVariants} className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <span className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">9</span>
              Shipping Delays
            </h2>
            <p className="text-gray-700 leading-relaxed">
              While we strive to meet all shipping timelines, unforeseen circumstances such as weather events, carrier delays, or high order volumes may cause delays. In such cases, we will notify you via email if your shipment experiences an unexpected delay.
            </p>
          </motion.section>

          {/* Section 10 */}
          <motion.section variants={itemVariants} className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <span className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">10</span>
              Address Changes
            </h2>
            <p className="text-gray-700 leading-relaxed">
              If you need to change your shipping address, please contact us immediately after placing your order. Address changes can only be made if the order hasn&apos;t shipped yet. Once a package is in transit, delivery address changes may not be possible.
            </p>
          </motion.section>

          {/* Contact Section */}
          <motion.section variants={itemVariants} className="border-t pt-8 space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">Questions About Shipping?</h2>
            <p className="text-gray-700 leading-relaxed">
              If you have any questions about our shipping policy, please don&apos;t hesitate to reach out:
            </p>
            <div className="bg-green-50 p-6 rounded-lg space-y-2">
              <p className="text-gray-900"><strong>PlainFuel Customer Support</strong></p>
              <p className="text-gray-700">Email: support@plainfuel.com</p>
              <p className="text-gray-700">Phone: 1-800-PLAINFUEL</p>
              <p className="text-gray-700">Hours: Monday-Friday, 9 AM - 5 PM EST</p>
            </div>
          </motion.section>
        </motion.div>
      </motion.div>
      </div>
    </div>
  );
}
