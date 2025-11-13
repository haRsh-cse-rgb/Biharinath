"use client";

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Eye, ArrowLeft, Search } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function AdminOrdersContent() {
  const [orders, setOrders] = useState<any[]>([]);
  const [allOrders, setAllOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const searchParams = useSearchParams();
  const userId = searchParams.get('userId');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const url = userId ? `/api/orders?userId=${userId}` : '/api/orders';
        const response = await fetch(url);
        const data = await response.json();
        setAllOrders(data);
        setOrders(data);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userId]);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setOrders(allOrders);
      return;
    }

    const filtered = allOrders.filter((order: any) => {
      const orderNumber = order.orderNumber?.toLowerCase() || '';
      const customerName = order.shippingAddress?.fullName?.toLowerCase() || '';
      const customerEmail = order.userId?.email?.toLowerCase() || '';
      const search = searchTerm.toLowerCase();

      return (
        orderNumber.includes(search) ||
        customerName.includes(search) ||
        customerEmail.includes(search)
      );
    });

    setOrders(filtered);
  }, [searchTerm, allOrders]);

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center mb-8">
          <Link href={userId ? "/admin/customers" : "/admin"}>
            <Button variant="ghost" size="sm" className="mr-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">
            {userId ? 'Customer Orders' : 'Manage Orders'}
          </h1>
        </div>

        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search by order number, customer name, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {loading ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-gray-500">Loading orders...</p>
            </CardContent>
          </Card>
        ) : orders.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-gray-500">
                {searchTerm ? 'No orders found matching your search' : 'No orders yet'}
              </p>
              {searchTerm && (
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => setSearchTerm('')}
                >
                  Clear Search
                </Button>
              )}
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

export default function AdminOrdersPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 pt-24 pb-12 flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    }>
      <AdminOrdersContent />
    </Suspense>
  );
}
