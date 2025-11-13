"use client";

import { PageTitle } from '@/components/layout/PageTitle';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Shield, Lock, Cookie, Mail, MapPin } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <>
      <PageTitle title="Privacy Policy" />
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
                <Shield className="h-16 w-16" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
              <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
                Last updated on November 13, 2025
              </p>
            </motion.div>
          </div>
        </section>

        {/* Privacy Policy Content */}
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
                    <p className="text-lg mb-4">
                      This privacy policy sets out how <strong>BIHARINATH ORGANIC FARMS PRIVATE LIMITED</strong> uses and protects any information that you give <strong>BIHARINATH ORGANIC FARMS PRIVATE LIMITED</strong> when you visit their website and/or agree to purchase from them.
                    </p>
                    <p className="text-lg mb-4">
                      <strong>BIHARINATH ORGANIC FARMS PRIVATE LIMITED</strong> is committed to ensuring that your privacy is protected. Should we ask you to provide certain information by which you can be identified when using this website, and then you can be assured that it will only be used in accordance with this privacy statement.
                    </p>
                    <p className="text-lg">
                      <strong>BIHARINATH ORGANIC FARMS PRIVATE LIMITED</strong> may change this policy from time to time by updating this page. You should check this page from time to time to ensure that you adhere to these changes.
                    </p>
                  </div>

                  <div className="border-t pt-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                      <Lock className="h-6 w-6 mr-2 text-green-600" />
                      Information We Collect
                    </h2>
                    <p className="text-lg mb-4">We may collect the following information:</p>
                    <ul className="list-disc list-inside space-y-2 ml-4 text-lg">
                      <li>Name</li>
                      <li>Contact information including email address</li>
                      <li>Demographic information such as postcode, preferences and interests, if required</li>
                      <li>Other information relevant to customer surveys and/or offers</li>
                    </ul>
                  </div>

                  <div className="border-t pt-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                      <Mail className="h-6 w-6 mr-2 text-green-600" />
                      What We Do With The Information We Gather
                    </h2>
                    <p className="text-lg mb-4">
                      We require this information to understand your needs and provide you with a better service, and in particular for the following reasons:
                    </p>
                    <ul className="list-disc list-inside space-y-2 ml-4 text-lg">
                      <li>Internal record keeping.</li>
                      <li>We may use the information to improve our products and services.</li>
                      <li>We may periodically send promotional emails about new products, special offers or other information which we think you may find interesting using the email address which you have provided.</li>
                      <li>From time to time, we may also use your information to contact you for market research purposes. We may contact you by email, phone, fax or mail. We may use the information to customise the website according to your interests.</li>
                    </ul>
                    <p className="text-lg mt-4">
                      We are committed to ensuring that your information is secure. In order to prevent unauthorised access or disclosure we have put in suitable measures.
                    </p>
                  </div>

                  <div className="border-t pt-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                      <Cookie className="h-6 w-6 mr-2 text-green-600" />
                      How We Use Cookies
                    </h2>
                    <p className="text-lg mb-4">
                      A cookie is a small file which asks permission to be placed on your computer's hard drive. Once you agree, the file is added and the cookie helps analyze web traffic or lets you know when you visit a particular site. Cookies allow web applications to respond to you as an individual. The web application can tailor its operations to your needs, likes and dislikes by gathering and remembering information about your preferences.
                    </p>
                    <p className="text-lg mb-4">
                      We use traffic log cookies to identify which pages are being used. This helps us analyze data about webpage traffic and improve our website in order to tailor it to customer needs. We only use this information for statistical analysis purposes and then the data is removed from the system.
                    </p>
                    <p className="text-lg mb-4">
                      Overall, cookies help us provide you with a better website, by enabling us to monitor which pages you find useful and which you do not. A cookie in no way gives us access to your computer or any information about you, other than the data you choose to share with us.
                    </p>
                    <p className="text-lg">
                      You can choose to accept or decline cookies. Most web browsers automatically accept cookies, but you can usually modify your browser setting to decline cookies if you prefer. This may prevent you from taking full advantage of the website.
                    </p>
                  </div>

                  <div className="border-t pt-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                      <Shield className="h-6 w-6 mr-2 text-green-600" />
                      Controlling Your Personal Information
                    </h2>
                    <p className="text-lg mb-4">
                      You may choose to restrict the collection or use of your personal information in the following ways:
                    </p>
                    <ul className="list-disc list-inside space-y-2 ml-4 text-lg mb-4">
                      <li>whenever you are asked to fill in a form on the website, look for the box that you can click to indicate that you do not want the information to be used by anybody for direct marketing purposes</li>
                      <li>if you have previously agreed to us using your personal information for direct marketing purposes, you may change your mind at any time by writing to or emailing us at <a href="mailto:biharinath.org.farm@gmail.com" className="text-green-600 hover:underline">biharinath.org.farm@gmail.com</a></li>
                    </ul>
                    <p className="text-lg mb-4">
                      We will not sell, distribute or lease your personal information to third parties unless we have your permission or are required by law to do so. We may use your personal information to send you promotional information about third parties which we think you may find interesting if you tell us that you wish this to happen.
                    </p>
                    <p className="text-lg">
                      If you believe that any information we are holding on you is incorrect or incomplete, please write to <strong>C/o Uttam Kumar Sarkar, Gurunank Pally, Prem Nagar, Asansol Bazar, Bardhaman, Barabani, West Bengal, India 713301, SB Gorai Road SO, WEST BENGAL 713301</strong> or contact us at <a href="mailto:biharinath.org.farm@gmail.com" className="text-green-600 hover:underline">biharinath.org.farm@gmail.com</a> as soon as possible. We will promptly correct any information found to be incorrect.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-16 bg-gray-50">
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
                        If you have any questions about this Privacy Policy, please contact us:
                      </p>
                      <p className="text-gray-700 mb-2">
                        <strong>Address:</strong><br />
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

