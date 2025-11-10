"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Heart, ShoppingCart } from 'lucide-react';

export default function WishlistPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?._id) return;
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/wishlist?userId=${user._id}`);
        if (res.ok) {
          const data = await res.json();
          setItems(data.items || []);
        }
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user?._id]);

  const [busyIds, setBusyIds] = useState<string[]>([]);

  const toggle = async (productId: string) => {
    if (!user?._id) return;
    if (busyIds.includes(productId)) return;
    setBusyIds((prev) => [...prev, productId]);
    const res = await fetch('/api/wishlist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user._id, productId }),
    });
    if (res.ok) {
      const data = await res.json();
      setItems(data.items || []);
    }
    setBusyIds((prev) => prev.filter((id) => id !== productId));
  };

  const addToCart = async (productId: string) => {
    if (!user) return;
    const res = await fetch('/api/cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user._id, productId, quantity: 1 }),
    });
    if (res.ok) {
      toast({ title: 'Added to cart' });
      if (typeof window !== 'undefined') window.dispatchEvent(new Event('cart:updated'));
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-8">My Wishlist</h1>

        {loading ? (
          <div className="text-center py-20">Loading...</div>
        ) : items.length === 0 ? (
          <div className="text-center py-20">
            <p className="mb-4">Your wishlist is empty.</p>
            <Button asChild>
              <Link href="/products">Browse Products</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((it) => (
              <Card key={it._id}>
                <CardContent className="p-4">
                  <Link href={`/products/${it.productId?.slug || ''}`}>
                    <div className="relative h-48 bg-gray-100 rounded overflow-hidden">
                      <Image
                        src={it.productId?.images?.[0] || '/placeholder.png'}
                        alt={it.productId?.name || 'Product'}
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    </div>
                    <div className="mt-3 font-semibold">{it.productId?.name}</div>
                    <div className="text-gray-600">₹{it.productId?.price}</div>
                  </Link>
                  <div className="flex space-x-2 mt-4">
                    <Button className="flex-1" onClick={() => addToCart(it.productId?._id)}>
                      <ShoppingCart className="h-4 w-4 mr-2" /> Add to Cart
                    </Button>
                    <Button variant="outline" onClick={() => toggle(it.productId?._id)} disabled={busyIds.includes(it.productId?._id)}>
                      <Heart className="h-4 w-4 fill-red-600 text-red-600" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

