"use client";

import { PageTitle } from '@/components/layout/PageTitle';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, MessageSquare } from 'lucide-react';

export default function ContactPage() {
  return (
    <>
      <PageTitle title="Contact Us" />
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
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Get in Touch</h1>
              <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
                We'd love to hear from you. Reach out to us with any questions or inquiries.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Contact Information Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Address Card */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                      <MapPin className="h-8 w-8 text-green-600" />
                    </div>
                    <CardTitle className="text-2xl">Our Address</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 text-lg leading-relaxed">
                      Biharinath Village<br />
                      District: Sample District<br />
                      State: Bihar<br />
                      India - 123456
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Phone Card */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                      <Phone className="h-8 w-8 text-green-600" />
                    </div>
                    <CardTitle className="text-2xl">Phone Number</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 text-lg">
                      <a href="tel:+919876543210" className="hover:text-green-600 transition-colors">
                        +91 98765 43210
                      </a>
                    </p>
                    <p className="text-gray-500 text-sm mt-2">
                      Monday - Saturday: 9:00 AM - 6:00 PM
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Email Card */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                      <Mail className="h-8 w-8 text-green-600" />
                    </div>
                    <CardTitle className="text-2xl">Email Address</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 text-lg">
                      <a 
                        href="mailto:info@biharinathorganicfarm.com" 
                        className="hover:text-green-600 transition-colors break-all"
                      >
                        info@biharinathorganicfarm.com
                      </a>
                    </p>
                    <p className="text-gray-500 text-sm mt-2">
                      We typically respond within 24 hours
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Additional Information Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Contact Information</h2>
              <p className="text-xl text-gray-600">
                Choose the best way to reach us
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Business Hours */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <Card>
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <Clock className="h-6 w-6 text-green-600" />
                      <CardTitle>Business Hours</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 text-gray-700">
                      <div className="flex justify-between">
                        <span className="font-medium">Monday - Friday:</span>
                        <span>9:00 AM - 6:00 PM</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Saturday:</span>
                        <span>9:00 AM - 4:00 PM</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Sunday:</span>
                        <span>Closed</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Customer Support */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <Card>
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <MessageSquare className="h-6 w-6 text-green-600" />
                      <CardTitle>Customer Support</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 text-gray-700">
                      <p>
                        Our customer support team is available to help you with:
                      </p>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li>Product inquiries</li>
                        <li>Order status</li>
                        <li>Farm visit bookings</li>
                        <li>General questions</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Map Section Placeholder */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="text-center mb-8"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Find Us</h2>
              <p className="text-xl text-gray-600">
                Visit our farm location
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-gray-200 rounded-lg h-96 flex items-center justify-center"
            >
              <p className="text-gray-500 text-lg">Map will be integrated here</p>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
}

