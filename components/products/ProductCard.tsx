import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Heart } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const images = product.images as string[];
  const mainImage = images && images.length > 0 ? images[0] : '/placeholder-product.jpg';
  const discount = product.compareAtPrice
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

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
  };

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
      <Link href={`/products/${product.slug}`}>
        <div className="relative h-64 bg-gray-100 overflow-hidden">
          <Image
            src={mainImage}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
          />
          {discount > 0 && (
            <Badge className="absolute top-3 left-3 bg-red-500">
              {discount}% OFF
            </Badge>
          )}
          {product.isFeatured && (
            <Badge className="absolute top-3 right-3 bg-blue-600">
              Featured
            </Badge>
          )}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Badge variant="destructive" className="text-lg">Out of Stock</Badge>
            </div>
          )}
        </div>
      </Link>

      <CardContent className="p-4">
        <Link href={`/products/${product.slug}`}>
          <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {product.name}
          </h3>
        </Link>
        <p className="text-sm text-gray-600 line-clamp-2 mb-3">
          {product.description}
        </p>
        <div className="flex items-center space-x-2">
          <span className="text-2xl font-bold text-gray-900">
            ₹{product.price.toLocaleString()}
          </span>
          {product.compareAtPrice && (
            <span className="text-lg text-gray-400 line-through">
              ₹{product.compareAtPrice.toLocaleString()}
            </span>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex space-x-2">
        <Button
          className="flex-1"
          disabled={product.stock === 0}
          onClick={handleAddToCart}
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          Add to Cart
        </Button>
        <Button variant="outline" size="icon">
          <Heart className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
