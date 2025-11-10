"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ShoppingCart, Heart, Truck, Shield, Package } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export default function ProductDetailPage() {
  const params = useParams();
  const { toast } = useToast();
  const { user } = useAuth();
  const [product, setProduct] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProduct();
  }, [params.slug]);

  const fetchProduct = async () => {
    const res = await fetch('/api/products');
    const products = await res.json();
    const found = products.find((p: any) => p.slug === params.slug);
    setProduct(found);
    setLoading(false);
  };

  const handleAddToCart = async () => {
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
          quantity: quantity
        }),
      });

      if (response.ok) {
        toast({
          title: "Added to cart",
          description: `${product.name} (x${quantity}) added to cart`,
        });
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('cart:updated'));
        }
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
  };

  const [wishlisted, setWishlisted] = useState(false);
  const [wishBusy, setWishBusy] = useState(false);

  useEffect(() => {
    const loadWishlistState = async () => {
      if (!user?._id || !product?._id) {
        setWishlisted(false);
        return;
      }
      try {
        const res = await fetch(`/api/wishlist?userId=${user._id}`);
        if (res.ok) {
          const data = await res.json();
          const ids = (data?.items || []).map((it: any) => (it.productId?._id || it.productId)?.toString());
          setWishlisted(ids.includes(product._id));
        }
      } catch {
        // ignore
      }
    };
    loadWishlistState();
  }, [user?._id, product?._id]);

  const toggleWishlist = async () => {
    if (!user) {
      toast({
        title: "Please login",
        description: "You need to login to use wishlist",
        variant: "destructive"
      });
      return;
    }
    if (wishBusy) return;
    try {
      setWishBusy(true);
      const res = await fetch('/api/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user._id, productId: product._id }),
      });
      if (res.ok) {
        const data = await res.json();
        const ids = (data?.items || []).map((it: any) => (it.productId?._id || it.productId)?.toString());
        const isNowWishlisted = ids.includes(product._id);
        setWishlisted(isNowWishlisted);
        toast({
          title: isNowWishlisted ? 'Added to Wishlist' : 'Removed from Wishlist',
          description: product.name,
        });
      }
    } catch {
      // ignore
    } finally {
      setWishBusy(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h1>
          <Button asChild>
            <a href="/products">Browse Products</a>
          </Button>
        </div>
      </div>
    );
  }

  const discount = product.compareAtPrice
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div className="relative h-96 lg:h-[600px] bg-gray-100 rounded-lg overflow-hidden">
            {product.images && product.images[0] ? (
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-green-100">
                <span className="text-green-600 text-xl">No Image</span>
              </div>
            )}
            {discount > 0 && (
              <Badge className="absolute top-4 left-4 bg-red-500 text-lg">
                {discount}% OFF
              </Badge>
            )}
          </div>

          <div>
            <div className="mb-4">
              {product.isFeatured && (
                <Badge className="bg-green-600 mb-2">Featured Product</Badge>
              )}
              {product.organic && (
                <Badge variant="outline" className="ml-2 mb-2 border-green-600 text-green-600">
                  100% Organic
                </Badge>
              )}
            </div>

            <h1 className="text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>

            <div className="flex items-baseline space-x-4 mb-6">
              <span className="text-4xl font-bold text-green-600">
                ₹{product.price}
              </span>
              {product.compareAtPrice && (
                <span className="text-2xl text-gray-400 line-through">
                  ₹{product.compareAtPrice}
                </span>
              )}
              <span className="text-xl text-gray-600">per {product.unit}</span>
            </div>

            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              {product.description}
            </p>

            <div className="border-t border-b border-gray-200 py-4 mb-6">
              <div className="flex items-center space-x-4">
                <span className="text-gray-700 font-medium">Quantity:</span>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    -
                  </Button>
                  <span className="text-xl font-semibold w-12 text-center">{quantity}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantity(Math.min(product.stockQuantity, quantity + 1))}
                  >
                    +
                  </Button>
                </div>
                <span className="text-sm text-gray-500">
                  ({product.stockQuantity} {product.unit} available)
                </span>
              </div>
            </div>

            <div className="flex space-x-4 mb-8">
              <Button
                size="lg"
                className="flex-1 bg-green-600 hover:bg-green-700 text-lg"
                onClick={handleAddToCart}
                disabled={product.stockQuantity === 0}
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                {product.stockQuantity === 0 ? 'Out of Stock' : 'Add to Cart'}
              </Button>
              <Button size="lg" variant="outline" className={`border-green-600 ${wishlisted ? 'text-red-600' : 'text-green-600'}`} onClick={toggleWishlist} disabled={wishBusy}>
                <Heart className={`h-5 w-5 ${wishlisted ? 'fill-red-600 text-red-600' : ''}`} />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <Truck className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <p className="text-sm font-medium">Free Delivery</p>
                  <p className="text-xs text-gray-500">On orders above ₹999</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Shield className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <p className="text-sm font-medium">100% Organic</p>
                  <p className="text-xs text-gray-500">Certified organic</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Package className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <p className="text-sm font-medium">Fresh Delivery</p>
                  <p className="text-xs text-gray-500">Farm to home</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {product.specifications && (
          <Card className="mb-8">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-4">Product Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="font-medium">SKU:</span> {product.sku}
                </div>
                <div>
                  <span className="font-medium">Category:</span> {product.categoryId?.name || 'Uncategorized'}
                </div>
                <div>
                  <span className="font-medium">Unit:</span> {product.unit}
                </div>
                <div>
                  <span className="font-medium">Availability:</span>{' '}
                  <span className={product.stockQuantity > 0 ? 'text-green-600' : 'text-red-600'}>
                    {product.stockQuantity > 0 ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
