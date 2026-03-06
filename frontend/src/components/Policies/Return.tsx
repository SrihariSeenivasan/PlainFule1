'use client';

import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';

export default function ReturnPolicy({ onNavigate }: { onNavigate?: (view: string) => void } = {}) {
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
            Return & Refund Policy
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
              Our Return Guarantee
            </h2>
            <p className="text-gray-700 leading-relaxed">
              At PlainFuel, we stand behind our products with confidence. If you&apos;re not completely satisfied with your purchase, we offer a hassle-free return and refund policy designed with your peace of mind in mind.
            </p>
            <div className="bg-green-50 p-4 rounded-lg border border-green-200 mt-4">
              <p className="text-gray-900 font-semibold mb-2">✓ 30-Day Money-Back Guarantee</p>
              <p className="text-gray-700">
                We offer a full refund on returns within 30 days of purchase for unopened, unused products in original condition.
              </p>
            </div>
          </motion.section>

          {/* Section 2 */}
          <motion.section variants={itemVariants} className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <span className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</span>
              Eligibility for Returns
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              To be eligible for a return, your item must meet the following criteria:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Return request must be made within 30 days of purchase date</li>
              <li>Product must be unopened and unused</li>
              <li>Product must be in original, resellable condition</li>
              <li>Product must include all original packaging and documentation</li>
              <li>Original receipt or order number must be provided</li>
              <li>Product must not show signs of wear or damage</li>
            </ul>
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 mt-4">
              <p className="text-yellow-900 text-sm">
                <strong>Note:</strong> Opened or used products may be considered, but are subject to a 20% restocking fee. Vitamins and supplements that have been opened or used cannot be returned for health and safety reasons.
              </p>
            </div>
          </motion.section>

          {/* Section 3 */}
          <motion.section variants={itemVariants} className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <span className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</span>
              How to Initiate a Return
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Returning a product is easy! Follow these simple steps:
            </p>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">1</div>
                <div>
                  <h3 className="font-semibold text-gray-900">Contact Customer Support</h3>
                  <p className="text-gray-700">Email support@plainfuel.com with your order number and reason for return within 30 days</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">2</div>
                <div>
                  <h3 className="font-semibold text-gray-900">Receive Return Authorization</h3>
                  <p className="text-gray-700">We&apos;ll send you a return authorization number (RMA) and prepaid shipping label</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">3</div>
                <div>
                  <h3 className="font-semibold text-gray-900">Ship Your Return</h3>
                  <p className="text-gray-700">Package your item securely and ship using our provided label. Include your RMA number</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">4</div>
                <div>
                  <h3 className="font-semibold text-gray-900">Receive Your Refund</h3>
                  <p className="text-gray-700">Once received and inspected, we&apos;ll process your refund within 5-7 business days</p>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Section 4 */}
          <motion.section variants={itemVariants} className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <span className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">4</span>
              Refund Processing
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Here&apos;s what you can expect during the refund process:
            </p>
            <div className="space-y-3 mt-4">
              <div className="border-l-4 border-green-600 pl-4">
                <h3 className="font-semibold text-gray-900">Inspection (2-3 business days)</h3>
                <p className="text-gray-700">We inspect the returned item to verify it meets return conditions</p>
              </div>
              <div className="border-l-4 border-green-600 pl-4">
                <h3 className="font-semibold text-gray-900">Approval (1 business day)</h3>
                <p className="text-gray-700">Once approved, we process your refund request</p>
              </div>
              <div className="border-l-4 border-green-600 pl-4">
                <h3 className="font-semibold text-gray-900">Refund (5-7 business days)</h3>
                <p className="text-gray-700">Credit appears back to original payment method</p>
              </div>
            </div>
            <p className="text-gray-700 leading-relaxed mt-4">
              <strong>Total Processing Time:</strong> 8-14 business days from shipment receipt
            </p>
          </motion.section>

          {/* Section 5 */}
          <motion.section variants={itemVariants} className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <span className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">5</span>
              Refund Amounts
            </h2>
            <div className="space-y-3">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Full Refund (100%)</h3>
                <p className="text-gray-700">Unopened, unused products in original condition receive full refund including original shipping costs</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Partial Refund (80%)</h3>
                <p className="text-gray-700">Opened or used products (excluding vitamins) receive 80% refund due to 20% restocking fee and inability to resell</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">No Refund</h3>
                <p className="text-gray-700">Opened vitamins/supplements cannot be returned per health and safety regulations</p>
              </div>
            </div>
          </motion.section>

          {/* Section 6 */}
          <motion.section variants={itemVariants} className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <span className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">6</span>
              Returning Defective or Damaged Items
            </h2>
            <p className="text-gray-700 leading-relaxed">
              If you receive a defective or damaged item, we&apos;ll make it right! Follow these steps:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mt-4">
              <li>Contact us within 7 days of receiving the defective item</li>
              <li>Provide photos of the defect or damage</li>
              <li>We&apos;ll send you a free replacement or full refund immediately</li>
              <li>Return of the defective item is optional if under $25</li>
              <li>Shipping is free both ways for defective items</li>
            </ul>
          </motion.section>

          {/* Section 7 */}
          <motion.section variants={itemVariants} className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <span className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">7</span>
              Non-Returnable Items
            </h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              Unfortunately, the following items cannot be returned:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Clearance or final sale items (marked as such at time of purchase)</li>
              <li>Opened food items for health and safety reasons</li>
              <li>Custom or personalized orders</li>
              <li>Items purchased more than 30 days ago</li>
              <li>Items purchased during promotional sales (unless specifically stated)</li>
              <li>Gifts purchased without a receipt (store credit only)</li>
            </ul>
          </motion.section>

          {/* Section 8 */}
          <motion.section variants={itemVariants} className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <span className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">8</span>
              Exchanges
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Want to exchange an item for a different size, color, or product? We make exchanges easy! Simply follow our return process and place a new order, or contact customer support for assistance. If the new item costs more, you&apos;ll only pay the difference. If it costs less, we&apos;ll refund the difference.
            </p>
          </motion.section>

          {/* Section 9 */}
          <motion.section variants={itemVariants} className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <span className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">9</span>
              Return Shipping
            </h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Free return shipping provided via prepaid label</li>
              <li>Use the provided label for quickest processing</li>
              <li>Drop off at any authorized carrier location</li>
              <li>Track your return using the label number</li>
              <li>Keep your proof of shipment for your records</li>
            </ul>
          </motion.section>

          {/* Section 10 */}
          <motion.section variants={itemVariants} className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <span className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">10</span>
              Store Credit Alternative
            </h2>
            <p className="text-gray-700 leading-relaxed">
              As an alternative to refunds, we offer store credit with a 15% bonus! For example, a $100 return could become $115 in store credit. This is a great way to try other products while supporting PlainFuel.
            </p>
          </motion.section>

          {/* Contact Section */}
          <motion.section variants={itemVariants} className="border-t pt-8 space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">Need Help with Your Return?</h2>
            <p className="text-gray-700 leading-relaxed">
              Our customer service team is here to help make returns as easy as possible:
            </p>
            <div className="bg-green-50 p-6 rounded-lg space-y-3">
              <p className="text-gray-700"><strong>Email:</strong> support@plainfuel.com</p>
              <p className="text-gray-700"><strong>Phone:</strong> 1-800-PLAINFUEL</p>
              <p className="text-gray-700"><strong>Live Chat:</strong> Available on our website during business hours</p>
              <p className="text-gray-700"><strong>Hours:</strong> Monday-Friday, 9 AM - 5 PM EST</p>
              <p className="text-gray-700"><strong>Response Time:</strong> We aim to respond within 24 hours</p>
            </div>
          </motion.section>
        </motion.div>
      </motion.div>
      </div>
    </div>
  );
}
