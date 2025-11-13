"use client";

import { PageTitle } from '@/components/layout/PageTitle';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { RefreshCw, Package, AlertCircle, CheckCircle, Clock, Mail } from 'lucide-react';
import Link from 'next/link';

export default function ReturnsPage() {
  const returnSteps = [
    {
      icon: Package,
      title: "Package Your Item",
      description: "Place the item in its original packaging with all tags and labels attached."
    },
    {
      icon: Mail,
      title: "Contact Us",
      description: "Reach out to us via email or phone to initiate the return process."
    },
    {
      icon: RefreshCw,
      title: "Get Return Authorization",
      description: "We'll provide you with a return authorization number and shipping instructions."
    },
    {
      icon: CheckCircle,
      title: "Receive Refund",
      description: "Once we receive and inspect your return, we'll process your refund within 5-7 business days."
    }
  ];

  const refundPolicies = [
    {
      title: "Eligible Items",
      items: [
        "Items must be unopened and unused",
        "Original packaging must be intact",
        "All tags and labels must be attached",
        "Items must be returned within 7 days of delivery"
      ]
    },
    {
      title: "Non-Eligible Items",
      items: [
        "Perishable items (unless damaged or incorrect)",
        "Items without original packaging",
        "Items returned after 7 days",
        "Items damaged by customer misuse"
      ]
    },
    {
      title: "Refund Process",
      items: [
        "Refunds are processed within 5-7 business days",
        "Refund will be issued to the original payment method",
        "Shipping charges are non-refundable unless item is defective",
        "You'll receive an email confirmation once refund is processed"
      ]
    }
  ];

  return (
    <>
      <PageTitle title="Returns & Refunds" />
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
                <RefreshCw className="h-16 w-16" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Returns & Refunds</h1>
              <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
                We want you to be completely satisfied with your purchase
              </p>
            </motion.div>
          </div>
        </section>

        {/* Return Process Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How to Return an Item</h2>
              <p className="text-xl text-gray-600">
                Follow these simple steps to return your purchase
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {returnSteps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="relative"
                >
                  <Card className="h-full hover:shadow-lg transition-shadow">
                    <CardContent className="p-6 text-center">
                      <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4 mx-auto">
                        <step.icon className="h-8 w-8 text-green-600" />
                      </div>
                      <div className="absolute -top-4 -right-4 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">
                        {index + 1}
                      </div>
                      <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                      <p className="text-gray-600">{step.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Policies Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Return & Refund Policies</h2>
              <p className="text-xl text-gray-600">
                Important information about our return and refund process
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {refundPolicies.map((policy, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="h-full">
                    <CardHeader>
                      <CardTitle className="text-xl">{policy.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {policy.items.map((item, itemIndex) => (
                          <li key={itemIndex} className="flex items-start space-x-2">
                            <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
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

        {/* Important Information Section */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Card className="border-2 border-yellow-200 bg-yellow-50">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <AlertCircle className="h-6 w-6 text-yellow-600" />
                    <CardTitle className="text-2xl text-yellow-900">Important Information</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 text-gray-700">
                  <div className="flex items-start space-x-3">
                    <Clock className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold mb-1">Return Timeframe</p>
                      <p>All returns must be initiated within 7 days of delivery. Items returned after this period may not be eligible for refund.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Package className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold mb-1">Packaging Requirements</p>
                      <p>Items must be returned in their original packaging with all tags and labels. Items returned without original packaging may be subject to a restocking fee.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <RefreshCw className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold mb-1">Refund Processing</p>
                      <p>Refunds are typically processed within 5-7 business days after we receive and inspect the returned item. The refund will be issued to your original payment method.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Need Help with a Return?
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Our customer service team is here to assist you with any questions about returns or refunds.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Contact Us
                </Link>
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

