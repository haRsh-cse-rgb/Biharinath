"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { PageTitle } from '@/components/layout/PageTitle';

export default function CartPage() {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchCartItems();
  }, [user]);

  const fetchCartItems = async () => {
    if (!user?._id) return;
    
    try {
      const response = await fetch(`/api/cart?userId=${user._id}`);
      if (response.ok) {
        const data = await response.json();
        setCartItems(data.items || []);
      }
    } catch (error) {
      console.error('Error fetching cart items:', error);
      toast({
        title: 'Error',
        description: 'Failed to load cart items',
        variant: 'destructive',
      });
    }
  };

  const updateQuantity = async (itemId: string, delta: number) => {
    const item = cartItems.find(i => i._id === itemId);
    if (!item || !user?._id) return;
    const nextQty = Math.max(1, (item.quantity || 1) + delta);
    try {
      const res = await fetch('/api/cart', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user._id,
          productId: item.productId?._id || item.productId,
          quantity: nextQty,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setCartItems(data.items || []);
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('cart:updated'));
        }
      }
    } catch (e) {
      // ignore
    }
  };

  const removeItem = async (itemId: string) => {
    const item = cartItems.find(i => i._id === itemId);
    if (!item || !user?._id) return;
    try {
      const res = await fetch(`/api/cart?userId=${user._id}&productId=${item.productId?._id || item.productId}`, { method: 'DELETE' });
      if (res.ok) {
        const data = await res.json();
        setCartItems(data.items || []);
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('cart:updated'));
        }
      }
    } catch (e) {
      // ignore
    }
  };

  const subtotal = cartItems.reduce((sum, item) => {
    const price = Number(item.productId?.price) || 0;
    const quantity = Number(item.quantity) || 0;
    return sum + price * quantity;
  }, 0);
  const tax = Number(subtotal) * 0.05;
  const shipping = Number(subtotal) > 999 ? 0 : 50;
  const total = Number(subtotal) + Number(tax) + Number(shipping);

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <ShoppingBag className="h-24 w-24 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Add some organic products to get started</p>
          <Button asChild className="bg-green-600 hover:bg-green-700">
            <Link href="/products">Browse Products</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <PageTitle title="Shopping Cart" />
      <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-6">
                {cartItems.map((item) => (
                  <div key={item._id} className="flex items-center space-x-4 py-4 border-b last:border-0">
                    <div className="relative h-24 w-24 flex-shrink-0">
                      <Image 
                        src={item.productId?.images?.[0] || '/placeholder-image.jpg'} 
                        alt={item.productId?.name || 'Product'} 
                        fill 
                        unoptimized
                        className="object-cover rounded" 
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{item.productId?.name || 'Product'}</h3>
                      <p className="text-gray-600">
                        ₹{Number(item.productId?.price) || 0} per {item.productId?.unit || 'unit'}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm" onClick={() => updateQuantity(item._id, -1)}>
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-12 text-center font-semibold">{Number(item.quantity) || 0}</span>
                      <Button variant="outline" size="sm" onClick={() => updateQuantity(item._id, 1)}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="text-right w-24">
                      <p className="font-bold">
                        ₹{((Number(item.productId?.price) || 0) * (Number(item.quantity) || 0)).toFixed(2)}
                      </p>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => removeItem(item._id)}>
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax (5%)</span>
                    <span>₹{tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
                  </div>
                  <div className="border-t pt-3 flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="text-green-600">₹{total.toFixed(2)}</span>
                  </div>
                </div>
                <Button asChild className="w-full mt-6 bg-green-600 hover:bg-green-700">
                  <Link href="/checkout">Proceed to Checkout</Link>
                </Button>
                <Button asChild variant="outline" className="w-full mt-2">
                  <Link href="/products">Continue Shopping</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
