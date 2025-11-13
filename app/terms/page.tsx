"use client";

import { PageTitle } from '@/components/layout/PageTitle';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { FileText, AlertCircle, Scale, Mail, MapPin } from 'lucide-react';

export default function TermsPage() {
  return (
    <>
      <PageTitle title="Terms & Conditions" />
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
                <FileText className="h-16 w-16" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Terms & Conditions</h1>
              <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
                Last updated on November 13, 2025
              </p>
            </motion.div>
          </div>
        </section>

        {/* Terms Content */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Card>
                <CardContent className="p-8 md:p-12 space-y-8 text-gray-700 leading-relaxed">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                      <Scale className="h-6 w-6 mr-2 text-green-600" />
                      Definitions
                    </h2>
                    <p className="text-lg mb-4">
                      For the purpose of these Terms and Conditions, The term "we", "us", "our" used anywhere on this page shall mean <strong>BIHARINATH ORGANIC FARMS PRIVATE LIMITED</strong>, whose registered/operational office is <strong>C/o Uttam Kumar Sarkar, Gurunank Pally, Prem Nagar, Asansol Bazar, Bardhaman, Barabani, West Bengal, India 713301, SB Gorai Road SO, WEST BENGAL 713301</strong>. "you", "your", "user", "visitor" shall mean any natural or legal person who is visiting our website and/or agreed to purchase from us.
                    </p>
                    <p className="text-lg">
                      Your use of the website and/or purchase from us are governed by following Terms and Conditions:
                    </p>
                  </div>

                  <div className="border-t pt-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Website Content</h2>
                    <p className="text-lg mb-4">
                      The content of the pages of this website is subject to change without notice.
                    </p>
                    <p className="text-lg mb-4">
                      Neither we nor any third parties provide any warranty or guarantee as to the accuracy, timeliness, performance, completeness or suitability of the information and materials found or offered on this website for any particular purpose. You acknowledge that such information and materials may contain inaccuracies or errors and we expressly exclude liability for any such inaccuracies or errors to the fullest extent permitted by law.
                    </p>
                    <p className="text-lg">
                      Your use of any information or materials on our website and/or product pages is entirely at your own risk, for which we shall not be liable. It shall be your own responsibility to ensure that any products, services or information available through our website and/or product pages meet your specific requirements.
                    </p>
                  </div>

                  <div className="border-t pt-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Intellectual Property</h2>
                    <p className="text-lg mb-4">
                      Our website contains material which is owned by or licensed to us. This material includes, but are not limited to, the design, layout, look, appearance and graphics. Reproduction is prohibited other than in accordance with the copyright notice, which forms part of these terms and conditions.
                    </p>
                    <p className="text-lg mb-4">
                      All trademarks reproduced in our website which are not the property of, or licensed to, the operator are acknowledged on the website.
                    </p>
                    <p className="text-lg">
                      Unauthorized use of information provided by us shall give rise to a claim for damages and/or be a criminal offense.
                    </p>
                  </div>

                  <div className="border-t pt-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">External Links</h2>
                    <p className="text-lg mb-4">
                      From time to time our website may also include links to other websites. These links are provided for your convenience to provide further information.
                    </p>
                    <p className="text-lg">
                      You may not create a link to our website from another website or document without <strong>BIHARINATH ORGANIC FARMS PRIVATE LIMITED</strong>'s prior written consent.
                    </p>
                  </div>

                  <div className="border-t pt-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                      <AlertCircle className="h-6 w-6 mr-2 text-green-600" />
                      Legal Jurisdiction
                    </h2>
                    <p className="text-lg mb-4">
                      Any dispute arising out of use of our website and/or purchase with us and/or any engagement with us is subject to the laws of India.
                    </p>
                    <p className="text-lg">
                      We, shall be under no liability whatsoever in respect of any loss or damage arising directly or indirectly out of the decline of authorization for any Transaction, on Account of the Cardholder having exceeded the preset limit mutually agreed by us with our acquiring bank from time to time.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>

        {/* Important Notice Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Card className="border-2 border-yellow-200 bg-yellow-50">
                <CardContent className="p-8">
                  <div className="flex items-start space-x-4">
                    <AlertCircle className="h-6 w-6 text-yellow-600 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-xl font-bold text-yellow-900 mb-2">Important Notice</h3>
                      <p className="text-gray-700 mb-4">
                        These Terms and Conditions may be updated from time to time. We encourage you to review this page periodically to stay informed about any changes. Your continued use of our website and services after any modifications to these terms constitutes your acceptance of the updated terms.
                      </p>
                      <p className="text-gray-700">
                        If you have any questions about these Terms and Conditions, please contact us using the information provided below.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Card>
                <CardContent className="p-8">
                  <div className="flex items-start space-x-4">
                    <MapPin className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Contact Us</h3>
                      <p className="text-gray-700 mb-2">
                        If you have any questions about these Terms and Conditions, please contact us:
                      </p>
                      <p className="text-gray-700 mb-2">
                        <strong>Registered/Operational Office:</strong><br />
                        BIHARINATH ORGANIC FARMS PRIVATE LIMITED<br />
                        C/o Uttam Kumar Sarkar<br />
                        Gurunank Pally, Prem Nagar<br />
                        Asansol Bazar, Bardhaman<br />
                        Barabani, West Bengal, India 713301<br />
                        SB Gorai Road SO, WEST BENGAL 713301
                      </p>
                      <p className="text-gray-700">
                        <strong>Email:</strong>{' '}
                        <a href="mailto:biharinath.org.farm@gmail.com" className="text-green-600 hover:underline">
                          biharinath.org.farm@gmail.com
                        </a>
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
}

