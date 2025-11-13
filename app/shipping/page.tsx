"use client";

import { PageTitle } from '@/components/layout/PageTitle';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Truck, Package, Clock, MapPin, Shield, AlertCircle } from 'lucide-react';

export default function ShippingPage() {
  const shippingMethods = [
    {
      icon: Truck,
      title: "Standard Shipping",
      duration: "5-7 business days",
      cost: "₹50 - ₹150",
      description: "Standard shipping for most locations. Items are carefully packaged to ensure freshness."
    },
    {
      icon: Package,
      title: "Express Shipping",
      duration: "2-3 business days",
      cost: "₹150 - ₹300",
      description: "Faster delivery option for urgent orders. Available in select locations."
    },
    {
      icon: Clock,
      title: "Same Day Delivery",
      duration: "Same day (if ordered before 12 PM)",
      cost: "₹200 - ₹400",
      description: "Available in select areas. Order before 12 PM for same-day delivery."
    }
  ];

  const shippingInfo = [
    {
      title: "Processing Time",
      items: [
        "Orders are typically processed within 1-2 business days",
        "Processing time may be longer during peak seasons or holidays",
        "You'll receive an email confirmation once your order is shipped",
        "Orders placed on weekends will be processed on the next business day"
      ]
    },
    {
      title: "Delivery Areas",
      items: [
        "We deliver across India",
        "Delivery times vary by location",
        "Remote areas may take longer to receive orders",
        "Some locations may have limited shipping options"
      ]
    },
    {
      title: "Packaging",
      items: [
        "All items are carefully packaged to maintain freshness",
        "Perishable items are shipped with appropriate cooling materials",
        "Fragile items are protected with extra padding",
        "We use eco-friendly packaging materials when possible"
      ]
    }
  ];

  return (
    <>
      <PageTitle title="Shipping Information" />
      <div className="min-h-screen bg-gray-50 pt-24 pb-12">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-green-600 to-green-800 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex justify-center mb-6">
                <Truck className="h-16 w-16" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Shipping Information</h1>
              <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
                Fast, reliable delivery to your doorstep
              </p>
            </motion.div>
          </div>
        </section>

        {/* Shipping Methods Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Shipping Options</h2>
              <p className="text-xl text-gray-600">
                Choose the delivery option that works best for you
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {shippingMethods.map((method, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="h-full hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                        <method.icon className="h-8 w-8 text-green-600" />
                      </div>
                      <CardTitle className="text-2xl">{method.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2 text-gray-700">
                          <Clock className="h-5 w-5 text-green-600" />
                          <span className="font-semibold">Duration:</span>
                          <span>{method.duration}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-gray-700">
                          <Package className="h-5 w-5 text-green-600" />
                          <span className="font-semibold">Cost:</span>
                          <span>{method.cost}</span>
                        </div>
                        <p className="text-gray-600 mt-4">{method.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Shipping Information Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Shipping Details</h2>
              <p className="text-xl text-gray-600">
                Everything you need to know about our shipping process
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {shippingInfo.map((info, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="h-full">
                    <CardHeader>
                      <CardTitle className="text-xl">{info.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {info.items.map((item, itemIndex) => (
                          <li key={itemIndex} className="flex items-start space-x-2">
                            <MapPin className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-700">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Tracking Section */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Card>
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <Shield className="h-6 w-6 text-green-600" />
                    <CardTitle className="text-2xl">Order Tracking</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 text-gray-700">
                  <p>
                    Once your order is shipped, you'll receive a tracking number via email and SMS. 
                    You can use this tracking number to:
                  </p>
                  <ul className="list-disc list-inside space-y-2">
                    <li>Track your order in real-time on our website or the courier's website</li>
                    <li>Get updates about your delivery status</li>
                    <li>Know the expected delivery date and time</li>
                    <li>Receive notifications about any delivery attempts</li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>

        {/* Important Notes Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Card className="border-2 border-blue-200 bg-blue-50">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <AlertCircle className="h-6 w-6 text-blue-600" />
                    <CardTitle className="text-2xl text-blue-900">Important Notes</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 text-gray-700">
                  <div>
                    <p className="font-semibold mb-2">Delivery Address</p>
                    <p>Please ensure your delivery address is correct and complete. We are not responsible for delays or failed deliveries due to incorrect addresses.</p>
                  </div>
                  <div>
                    <p className="font-semibold mb-2">Delivery Attempts</p>
                    <p>Our courier partners will make up to 2 delivery attempts. If delivery fails, you'll be contacted to reschedule or pick up from the nearest courier facility.</p>
                  </div>
                  <div>
                    <p className="font-semibold mb-2">Damaged Items</p>
                    <p>If you receive a damaged item, please contact us immediately with photos. We'll arrange for a replacement or refund as appropriate.</p>
                  </div>
                  <div>
                    <p className="font-semibold mb-2">Holiday Shipping</p>
                    <p>Shipping times may be extended during holidays and peak seasons. We recommend placing orders early to ensure timely delivery.</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Questions About Shipping?
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Our customer service team can help you with shipping inquiries and delivery updates.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/contact"
                  className="inline-flex items-center justify-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Contact Us
                </a>
                <a
                  href="mailto:info@biharinathorganicfarm.com"
                  className="inline-flex items-center justify-center px-6 py-3 bg-white text-green-600 border-2 border-green-600 rounded-lg hover:bg-green-50 transition-colors"
                >
                  Send Email
                </a>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
}

