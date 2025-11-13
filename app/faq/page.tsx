"use client";

import { PageTitle } from '@/components/layout/PageTitle';
import { Card, CardContent } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { motion } from 'framer-motion';
import { HelpCircle } from 'lucide-react';

export default function FAQPage() {
  const faqs = [
    {
      question: "What makes your products organic?",
      answer: "Our products are certified organic, meaning they are grown without the use of synthetic pesticides, fertilizers, or genetically modified organisms (GMOs). We follow strict organic farming practices that are verified by certification bodies to ensure the highest quality and purity of our produce."
    },
    {
      question: "How do I place an order?",
      answer: "You can place an order through our website by browsing our products, adding items to your cart, and proceeding to checkout. You'll need to create an account or sign in to complete your purchase. We accept various payment methods including credit/debit cards and online payment gateways."
    },
    {
      question: "What is your delivery time?",
      answer: "Delivery times vary depending on your location. Typically, orders are processed within 1-2 business days and delivered within 3-7 business days. For specific delivery estimates, please check during checkout or contact our customer service team."
    },
    {
      question: "Do you offer farm visits?",
      answer: "Yes! We offer farm visits where you can see our organic farming practices firsthand. You can book a visit through our 'Book Site Visit' page. We recommend booking in advance as slots fill up quickly, especially during peak seasons."
    },
    {
      question: "What is your return policy?",
      answer: "We accept returns within 7 days of delivery for unopened and unused products in their original packaging. If you receive damaged or incorrect items, please contact us immediately and we'll arrange for a replacement or refund. For more details, please visit our Returns & Refunds page."
    },
    {
      question: "Are your products fresh?",
      answer: "Absolutely! We harvest our produce at peak ripeness and ensure it reaches you as fresh as possible. Our products are stored in optimal conditions and shipped using appropriate packaging to maintain freshness during transit."
    },
    {
      question: "Do you ship nationwide?",
      answer: "Yes, we ship our products across India. Shipping charges and delivery times may vary based on your location. You can check shipping options and costs during checkout."
    },
    {
      question: "How should I store the products?",
      answer: "Most of our fresh produce should be stored in a cool, dry place or refrigerated as appropriate. Specific storage instructions are provided with each product. Generally, vegetables should be kept in the refrigerator, while some items like potatoes and onions should be stored in a cool, dark place."
    },
    {
      question: "Can I customize my order?",
      answer: "While we offer a wide variety of products, customization options may vary. For special requests or bulk orders, please contact our customer service team, and we'll do our best to accommodate your needs."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept various payment methods including credit cards, debit cards, UPI, net banking, and digital wallets. All payments are processed through secure payment gateways to ensure your financial information is protected."
    },
    {
      question: "Do you offer discounts or promotions?",
      answer: "Yes, we regularly offer discounts and promotions on our products. You can subscribe to our newsletter to stay updated on special offers, seasonal discounts, and new product launches. We also offer loyalty rewards for regular customers."
    },
    {
      question: "How can I track my order?",
      answer: "Once your order is shipped, you'll receive a tracking number via email and SMS. You can use this tracking number on our website or the courier's website to track your order's status in real-time."
    }
  ];

  return (
    <>
      <PageTitle title="FAQ" />
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
                <HelpCircle className="h-16 w-16" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Frequently Asked Questions</h1>
              <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
                Find answers to common questions about our products and services
              </p>
            </motion.div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Card>
                <CardContent className="p-6">
                  <Accordion type="single" collapsible className="w-full">
                    {faqs.map((faq, index) => (
                      <AccordionItem key={index} value={`item-${index}`}>
                        <AccordionTrigger className="text-left text-lg font-semibold">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-gray-700 leading-relaxed">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>

        {/* Still Have Questions Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Still Have Questions?
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Can't find the answer you're looking for? Please reach out to our friendly support team.
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

