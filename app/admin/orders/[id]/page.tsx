"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ShoppingCart, User, MapPin, CreditCard } from 'lucide-react';
import Link from 'next/link';

export default function OrderDetailsPage({ params }: { params: { id: string } }) {
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await fetch(`/api/orders/${params.id}`);
        const data = await response.json();
        setOrder(data);
      } catch (error) {
        console.error('Failed to fetch order details:', error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchOrderDetails();
    }
  }, [params.id]);

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center mb-8">
          <Link href="/admin/orders">
            <Button variant="ghost" size="sm" className="mr-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Orders
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Order Details</h1>
        </div>

        {loading ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-gray-500">Loading order details...</p>
            </CardContent>
          </Card>
        ) : !order ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-gray-500">Order not found</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>Order #{order.orderNumber}</span>
                  <Badge>{order.status}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p><strong>Order Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
                <p><strong>Total Amount:</strong> ₹{order.totalAmount}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center"><ShoppingCart className="mr-2 h-5 w-5" /> Items</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="divide-y divide-gray-200">
                  {order.items && order.items.map((item: any) => (
                    <li key={item.productId._id} className="py-4 flex justify-between items-center">
                      <div>
                        <p className="font-semibold">{item.productId.name}</p>
                        <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                      </div>
                      <p className="font-semibold">₹{item.price}</p>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center"><User className="mr-2 h-5 w-5" /> Customer</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p><strong>Name:</strong> {order.shippingAddress?.fullName || 'N/A'}</p>
                <p><strong>Email:</strong> {order.user?.email}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center"><MapPin className="mr-2 h-5 w-5" /> Shipping Address</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1">
                <p>{order.shippingAddress?.addressLine1 || 'N/A'}</p>
                {order.shippingAddress?.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
                <p>{order.shippingAddress?.city || 'N/A'}, {order.shippingAddress?.state || 'N/A'} {order.shippingAddress?.postalCode || 'N/A'}</p>
                <p>{order.shippingAddress?.country || 'N/A'}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center"><CreditCard className="mr-2 h-5 w-5" /> Payment</CardTitle>
              </CardHeader>
              <CardContent>
                <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
                <p><strong>Payment Status:</strong> <Badge>{order.paymentStatus}</Badge></p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}