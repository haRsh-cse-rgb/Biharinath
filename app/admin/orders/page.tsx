"use client";

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('/api/orders');
        const data = await response.json();
        setOrders(data);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center mb-8">
          <Link href="/admin">
            <Button variant="ghost" size="sm" className="mr-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Manage Orders</h1>
        </div>

        {loading ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-gray-500">Loading orders...</p>
            </CardContent>
          </Card>
        ) : orders.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-gray-500">No orders yet</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {orders.map((order: any) => (
              <Card key={order._id}>
                <CardContent className="p-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h3 className="font-semibold">Order #{order.orderNumber}</h3>
                      <p className="text-sm text-gray-600">{order.shippingAddress?.fullName || 'N/A'}</p>
                      {order.userId?.email && (
                        <p className="text-xs text-gray-500">{order.userId.email}</p>
                      )}
                      <p className="text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString('en-IN')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">₹{order.totalAmount}</p>
                      <Badge>{order.status}</Badge>
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/admin/orders/${order._id}`}>
                        <Button variant="outline" size="sm">
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </Button>
                      </Link>
                      <Link href={`/admin/orders/${order._id}/invoice`} target="_blank">
                        <Button variant="outline" size="sm">
                          Print Invoice
                        </Button>
                      </Link>
                    </div>
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
