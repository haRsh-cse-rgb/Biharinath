"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Home, ArrowRight, Package } from 'lucide-react';

interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
}

interface ProductCount {
  [key: string]: number;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [productCounts, setProductCounts] = useState<ProductCount>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const [categoriesRes, productsRes] = await Promise.all([
        fetch('/api/categories'),
        fetch('/api/products')
      ]);

      if (categoriesRes.ok) {
        const categoriesData = await categoriesRes.json();
        setCategories(categoriesData);

        if (productsRes.ok) {
          const productsData = await productsRes.json();
          const counts: ProductCount = {};

          categoriesData.forEach((cat: Category) => {
            counts[cat._id] = productsData.filter(
              (product: any) => 
                product.categoryId?.toString() === cat._id || 
                product.categoryId === cat._id ||
                product.category?._id?.toString() === cat._id ||
                product.category === cat._id
            ).length;
          });

          setProductCounts(counts);
        }
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-4xl font-bold text-gray-900">Shop by Category</h1>
            <Link href="/">
              <Button variant="outline" size="sm">
                <Home className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
          <p className="text-lg text-gray-600">
            Browse our wide selection of fresh, organic products organized by category
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            <p className="mt-4 text-gray-600">Loading categories...</p>
          </div>
        ) : categories.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-xl text-gray-600 mb-4">No categories available yet</p>
              <Link href="/products">
                <Button className="bg-green-600 hover:bg-green-700">
                  Browse All Products
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category) => (
              <Link key={category._id} href={`/products?category=${category._id}`}>
                <Card className="group hover:shadow-2xl transition-all duration-300 overflow-hidden h-full">
                  <div className="relative h-56 bg-gradient-to-br from-green-100 to-green-50 overflow-hidden">
                    {category.image ? (
                      <Image
                        src={category.image}
                        alt={category.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="h-20 w-20 text-green-600 opacity-50" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <h2 className="text-2xl font-bold text-white mb-1">
                        {category.name}
                      </h2>
                      {/* <p className="text-sm text-white/90">
                        {productCounts[category._id] || 0} products available
                      </p> */}
                    </div>
                  </div>

                  <CardContent className="p-6">
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {category.description || `Explore our fresh ${category.name.toLowerCase()} selection`}
                    </p>
                    <div className="flex items-center text-green-600 font-semibold group-hover:text-green-700 transition-colors">
                      Browse Products
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}

        {!loading && categories.length > 0 && (
          <div className="mt-12 text-center">
            <Link href="/products">
              <Button size="lg" variant="outline" className="border-green-600 text-green-600 hover:bg-green-50">
                View All Products
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
