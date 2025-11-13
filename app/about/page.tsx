"use client";

import { useState } from 'react';
import Image from 'next/image';
import { PageTitle } from '@/components/layout/PageTitle';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Leaf, Users, Heart, Award, Sprout, Shield } from 'lucide-react';

export default function AboutPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Dummy gallery images - replace with actual images later
  const galleryImages = [
    'https://images.pexels.com/photos/1072824/pexels-photo-1072824.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/1072824/pexels-photo-1072824.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/2132250/pexels-photo-2132250.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/2132250/pexels-photo-2132250.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/1072824/pexels-photo-1072824.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/2132250/pexels-photo-2132250.jpeg?auto=compress&cs=tinysrgb&w=800',
  ];

  const values = [
    {
      icon: Leaf,
      title: '100% Organic',
      description: 'We are committed to growing only certified organic produce without any harmful chemicals or pesticides.',
    },
    {
      icon: Heart,
      title: 'Farm Fresh',
      description: 'Our products are harvested at peak ripeness and delivered fresh to your doorstep.',
    },
    {
      icon: Users,
      title: 'Community First',
      description: 'We support local farmers and work closely with our community to promote sustainable agriculture.',
    },
    {
      icon: Award,
      title: 'Quality Assured',
      description: 'Every product undergoes strict quality checks to ensure you receive only the best.',
    },
    {
      icon: Sprout,
      title: 'Sustainable Farming',
      description: 'We practice sustainable farming methods that protect the environment for future generations.',
    },
    {
      icon: Shield,
      title: 'Trusted Brand',
      description: 'Years of experience and thousands of satisfied customers make us a trusted name in organic farming.',
    },
  ];

  return (
    <>
      <PageTitle title="About Us" />
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
                <Image
                  src="/logo.jpeg"
                  alt="Biharinath Organic Farms Logo"
                  width={150}
                  height={150}
                  className="rounded-full border-4 border-white shadow-lg"
                  unoptimized
                />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">About Biharinath Organic Farms</h1>
              <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
                Growing healthy, organic produce with love and dedication since our founding
              </p>
            </motion.div>
          </div>
        </section>

        {/* About Content Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Our Story</h2>
                <div className="space-y-4 text-gray-700 text-lg leading-relaxed">
                  <p>
                    Biharinath Organic Farms was founded with a simple mission: to provide fresh, healthy, 
                    and chemical-free organic produce to families across the region. What started as a small 
                    family farm has grown into a trusted name in organic agriculture.
                  </p>
                  <p>
                    Our journey began with a deep commitment to sustainable farming practices and a passion 
                    for growing food the natural way. We believe that everyone deserves access to fresh, 
                    nutritious produce that is free from harmful pesticides and chemicals.
                  </p>
                  <p>
                    Today, we continue to uphold our founding principles while expanding our reach to serve 
                    more families. Every product we grow is a testament to our dedication to quality, 
                    sustainability, and the health of our customers and the environment.
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="relative h-96 rounded-lg overflow-hidden shadow-xl"
              >
                <Image
                  src="https://images.pexels.com/photos/2132250/pexels-photo-2132250.jpeg?auto=compress&cs=tinysrgb&w=1200"
                  alt="Our Farm"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Values</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                The principles that guide everything we do
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {values.map((value, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="h-full hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                        <value.icon className="h-8 w-8 text-green-600" />
                      </div>
                      <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                      <p className="text-gray-600">{value.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Image Gallery Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Farm Gallery</h2>
              <p className="text-xl text-gray-600">
                Take a look at our beautiful farm and the organic produce we grow
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {galleryImages.map((image, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="relative h-64 rounded-lg overflow-hidden cursor-pointer group"
                  onClick={() => setSelectedImage(image)}
                >
                  <Image
                    src={image}
                    alt={`Farm image ${index + 1}`}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors"></div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-16 bg-gradient-to-br from-green-600 to-green-800 text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Mission</h2>
              <p className="text-xl md:text-2xl text-white/90 leading-relaxed">
                To provide fresh, healthy, and sustainable organic produce while supporting local communities 
                and protecting our environment for future generations. We are committed to transparency, 
                quality, and the well-being of everyone who chooses to trust us with their food.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Image Modal */}
        {selectedImage && (
          <div
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <div className="relative max-w-5xl w-full h-full">
              <Image
                src={selectedImage}
                alt="Gallery image"
                fill
                className="object-contain"
                unoptimized
              />
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 text-white bg-black/50 hover:bg-black/70 rounded-full p-2 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

