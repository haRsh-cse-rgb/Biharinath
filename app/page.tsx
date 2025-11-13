"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/products/ProductCard';
import { Product, Category } from '@/types';
import { ArrowRight, ShoppingBag, Truck, Shield, HeadphonesIcon, Calendar, Leaf, Sprout, Heart, Users } from 'lucide-react';
import { PageTitle } from '@/components/layout/PageTitle';

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const { scrollY } = useScroll();

  const heroY = useTransform(scrollY, [0, 500], [0, 150]);
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);

  useEffect(() => {
    fetchFeaturedProducts();
    fetchCategories();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const response = await fetch('/api/products?featured=true');
      const data = await response.json();
      if (Array.isArray(data)) {
        setFeaturedProducts(data.slice(0, 8));
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      const data = await response.json();
      if (Array.isArray(data)) {
        setCategories(data.slice(0, 6));
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  return (
    <>
      <PageTitle title="Home" />
      <div className="overflow-hidden">
      <motion.section
        className="relative h-screen flex items-center justify-center bg-gradient-to-br from-green-600 via-green-700 to-green-900"
        style={{ y: heroY }}
      >
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/2132250/pexels-photo-2132250.jpeg?auto=compress&cs=tinysrgb&w=1920')] bg-cover bg-center opacity-30"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/40 to-transparent"></div>

        <motion.div
          className="relative z-10 text-center px-4 max-w-4xl mx-auto"
          style={{ opacity: heroOpacity }}
        >
          <motion.div
            className="flex items-center justify-center mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <div className="relative h-20 w-20 md:h-24 md:w-24 rounded-full overflow-hidden border-4 border-white shadow-lg">
              <Image
                src="/logo.jpeg"
                alt="Biharinath Organic Farms"
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          </motion.div>

          <motion.h1
            className="text-5xl md:text-7xl font-bold text-white mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Pure. Natural. Organic.
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl text-white/90 mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Farm-fresh organic products from Biharinath, delivered to your doorstep
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Link href="/products">
              <Button size="lg" className="bg-green-600 text-white hover:bg-green-700 text-lg px-8">
                Shop Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/book-visit">
              <Button size="lg" variant="outline" className="bg-transparent text-white border-white hover:bg-white/20 text-lg px-8">
                Book Farm Visit
                <Calendar className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1.5 h-3 bg-white rounded-full mt-2"></div>
          </div>
        </div>
      </motion.section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Leaf, title: '100% Organic', desc: 'Certified organic produce' },
              { icon: Sprout, title: 'Farm Fresh', desc: 'Directly from our farms' },
              { icon: Heart, title: 'Chemical Free', desc: 'No pesticides or chemicals' },
              { icon: Users, title: 'Family Farms', desc: 'Supporting local farmers' },
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                  <feature.icon className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Shop by Category
            </h2>
            <p className="text-xl text-gray-600">
              Explore our curated collections
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, index) => (
              <motion.div
                key={category._id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link href={`/categories/${category.slug}`}>
                  <div className="relative h-64 rounded-lg overflow-hidden group cursor-pointer">
                    {category.image ? (
                      <>
                        <Image
                          src={category.image}
                          alt={category.name}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                          unoptimized
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                      </>
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-green-700 group-hover:scale-110 transition-transform duration-500"></div>
                    )}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <h3 className="text-3xl font-bold text-white drop-shadow-lg">{category.name}</h3>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Featured Products
            </h2>
            <p className="text-xl text-gray-600">
              Hand-picked favorites just for you
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product, index) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>

          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Link href="/products">
              <Button size="lg" className="bg-green-600 text-white hover:bg-green-700">
                View All Products
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-green-600 to-green-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold mb-6">
              Experience Farm-to-Table Freshness
            </h2>
            <p className="text-xl mb-8 text-white/90">
              Visit our organic farms and see how we grow your food with care and dedication
            </p>
            <Link href="/book-visit">
              <Button size="lg" className="bg-white text-green-700 hover:bg-green-50 text-lg px-8">
                Schedule Farm Visit
                <Calendar className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
    </>
  );
}
