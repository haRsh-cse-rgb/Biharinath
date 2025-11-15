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
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const searchParams = useSearchParams();
  const userId = searchParams.get('userId');

  useEffect(() => {
    const fetchOrders = async () => {
      setError(null);
      try {
        const url = userId ? `/api/orders?userId=${userId}` : '/api/orders';
        const response = await fetch(url);
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
          throw new Error(errorData.error || `Failed to fetch orders: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Handle both array and object responses
        const ordersArray = Array.isArray(data) ? data : (data.orders || []);
        
        setAllOrders(ordersArray);
        setOrders(ordersArray);
      } catch (error: any) {
        console.error('Failed to fetch orders:', error);
        setError(error.message || 'Failed to load orders');
        setAllOrders([]);
        setOrders([]);
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
    <div className="min-h-screen bg-gray-50 pt-24 pb-20 md:pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 mb-8">
          <Link href={userId ? "/admin/customers" : "/admin"}>
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">
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
        ) : error ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-red-600 font-semibold mb-2">Error loading orders</p>
              <p className="text-sm text-gray-600 mb-4">{error}</p>
              <Button
                variant="outline"
                onClick={() => {
                  setLoading(true);
                  setError(null);
                  const url = userId ? `/api/orders?userId=${userId}` : '/api/orders';
                  fetch(url)
                    .then(res => res.json())
                    .then(data => {
                      const ordersArray = Array.isArray(data) ? data : (data.orders || []);
                      setAllOrders(ordersArray);
                      setOrders(ordersArray);
                    })
                    .catch(err => {
                      setError(err.message || 'Failed to load orders');
                    })
                    .finally(() => setLoading(false));
                }}
              >
                Retry
              </Button>
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
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-base sm:text-lg">Order #<span className="text-xs sm:text-sm font-normal">{order.orderNumber}</span></h3>
                        <p className="text-sm text-gray-600">{order.shippingAddress?.fullName || 'N/A'}</p>
                        {order.userId?.email && (
                          <p className="text-xs text-gray-500 truncate">{order.userId.email}</p>
                        )}
                        <p className="text-sm text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString('en-IN')}
                        </p>
                      </div>
                      <div className="text-left sm:text-right">
                        <p className="font-bold text-lg">₹{order.totalAmount}</p>
                        <Badge className="mt-1">{order.status}</Badge>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Link href={`/admin/orders/${order._id}`} className="flex-1 sm:flex-initial">
                        <Button variant="outline" size="sm" className="w-full sm:w-auto">
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </Button>
                      </Link>
                      <Link href={`/admin/orders/${order._id}/invoice`} target="_blank" className="flex-1 sm:flex-initial">
                        <Button variant="outline" size="sm" className="w-full sm:w-auto">
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
