"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, ShoppingCart, Filter, Home } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export default function ProductsPage() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, [selectedCategory]);

  const fetchCategories = async () => {
    const res = await fetch('/api/categories');
    const data = await res.json();
    setCategories(data);
  };

  const fetchProducts = async () => {
    setLoading(true);
    let url = '/api/products?';
    if (selectedCategory !== 'all') url += `category=${selectedCategory}`;

    const res = await fetch(url);
    const data = await res.json();
    setProducts(data);
    setLoading(false);
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-4xl font-bold text-gray-900">Our Organic Products</h1>
            <Link href="/">
              <Button variant="outline" size="sm">
                <Home className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
          <p className="text-lg text-gray-600">Fresh, healthy, and naturally grown produce from Biharinath Organic Farm</p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full md:w-64">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat._id} value={cat._id}>{cat.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            <p className="mt-4 text-gray-600">Loading products...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <Card key={product._id} className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
                <Link href={`/products/${product.slug}`}>
                  <div className="relative h-64 bg-gray-100 overflow-hidden">
                    {product.images && product.images[0] ? (
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-green-100">
                        <span className="text-green-600">No Image</span>
                      </div>
                    )}
                    {product.compareAtPrice && (
                      <Badge className="absolute top-3 left-3 bg-red-500">
                        {Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)}% OFF
                      </Badge>
                    )}
                    {product.isFeatured && (
                      <Badge className="absolute top-3 right-3 bg-green-600">
                        Featured
                      </Badge>
                    )}
                  </div>
                </Link>

                <CardContent className="p-4">
                  <Link href={`/products/${product.slug}`}>
                    <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-green-600 transition-colors">
                      {product.name}
                    </h3>
                  </Link>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                    {product.description}
                  </p>
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl font-bold text-gray-900">
                      ₹{product.price}
                    </span>
                    {product.compareAtPrice && (
                      <span className="text-lg text-gray-400 line-through">
                        ₹{product.compareAtPrice}
                      </span>
                    )}
                    <span className="text-sm text-gray-500">/{product.unit}</span>
                  </div>
                </CardContent>

                <CardFooter className="p-4 pt-0">
                  <Button 
                    className="w-full bg-green-600 hover:bg-green-700" 
                    disabled={product.stockQuantity === 0}
                    onClick={async (e) => {
                      e.preventDefault();
                      if (!user) {
                        toast({
                          title: "Please login",
                          description: "You need to login to add items to cart",
                          variant: "destructive"
                        });
                        return;
                      }

                      try {
                        const response = await fetch('/api/cart', {
                          method: 'POST',
                          headers: {
                            'Content-Type': 'application/json',
                          },
                          body: JSON.stringify({
                            userId: user._id,
                            productId: product._id,
                            quantity: 1
                          }),
                        });

                        if (response.ok) {
                          toast({
                            title: "Added to cart",
                            description: `${product.name} has been added to your cart`,
                          });
                        } else {
                          toast({
                            title: "Error",
                            description: "Failed to add item to cart",
                            variant: "destructive"
                          });
                        }
                      } catch (error) {
                        toast({
                          title: "Error",
                          description: "Failed to add item to cart",
                          variant: "destructive"
                        });
                      }
                    }}
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    {product.stockQuantity === 0 ? 'Out of Stock' : 'Add to Cart'}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        {!loading && filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">No products found</p>
          </div>
        )}
      </div>
    </div>
  );
}
