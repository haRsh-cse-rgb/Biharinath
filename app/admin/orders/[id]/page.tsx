"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ShoppingCart, User, MapPin, CreditCard, X } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

export default function OrderDetailsPage({ params }: { params: { id: string } }) {
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

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
    <div className="min-h-screen bg-gray-50 pt-24 pb-20 md:pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 mb-8">
          <Link href="/admin/orders">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Back to Orders</span>
              <span className="sm:hidden">Back</span>
            </Button>
          </Link>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">Order Details</h1>
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
                <CardTitle className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
                  <span className="text-base sm:text-lg">Order #<span className="text-xs sm:text-sm font-normal">{order.orderNumber}</span></span>
                  <Badge className="flex-shrink-0">{order.status}</Badge>
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
                    <li key={item.productId?._id || item.productName} className="py-4 flex justify-between items-center">
                      <div>
                        <p className="font-semibold">{item.productName || item.productId?.name}</p>
                        <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">₹{item.totalPrice ?? (item.unitPrice * item.quantity)}</p>
                        <p className="text-xs text-gray-500">₹{item.unitPrice} x {item.quantity}</p>
                      </div>
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
                <p><strong>Name:</strong> {order.shippingAddress?.fullName || order.userId?.fullName || 'N/A'}</p>
                <p><strong>Email:</strong> {order.userId?.email || 'N/A'}</p>
                {order.userId?.phone && <p><strong>Phone:</strong> {order.userId.phone}</p>}
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
                <CardTitle className="flex items-center"><CreditCard className="mr-2 h-5 w-5" /> Payment & Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Payment Method</p>
                    <p className="font-medium capitalize">{order.paymentMethod}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Payment Status</p>
                    <select
                      className="w-full border rounded px-3 py-2"
                      value={order.paymentStatus}
                      onChange={(e) => setOrder({ ...order, paymentStatus: e.target.value })}
                    >
                      <option value="pending">pending</option>
                      <option value="completed">completed</option>
                      <option value="failed">failed</option>
                      <option value="refunded">refunded</option>
                    </select>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Order Status</p>
                  <select
                    className="w-full border rounded px-3 py-2"
                    value={order.status}
                    onChange={(e) => setOrder({ ...order, status: e.target.value })}
                  >
                    <option value="pending">pending</option>
                    <option value="processing">processing</option>
                    <option value="shipped">shipped</option>
                    <option value="out_for_delivery">out_for_delivery</option>
                    <option value="delivered">delivered</option>
                    <option value="cancelled">cancelled</option>
                    <option value="returned">returned</option>
                  </select>
                </div>
                <div className="flex justify-end gap-2">
                  {['pending', 'processing'].includes(order.status) && (
                    <Button
                      variant="outline"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      disabled={cancelling}
                      onClick={async () => {
                        if (!confirm('Are you sure you want to cancel this order?')) return;
                        setCancelling(true);
                        try {
                          const res = await fetch(`/api/orders/${params.id}/cancel`, {
                            method: 'POST',
                          });
                          if (res.ok) {
                            const data = await res.json();
                            setOrder(data.order);
                            toast({ title: 'Order cancelled successfully' });
                            router.refresh();
                          } else {
                            const error = await res.json();
                            toast({ title: 'Failed to cancel order', description: error.error, variant: 'destructive' });
                          }
                        } finally {
                          setCancelling(false);
                        }
                      }}
                    >
                      <X className="h-4 w-4 mr-1" />
                      {cancelling ? 'Cancelling...' : 'Cancel Order'}
                    </Button>
                  )}
                  <Button
                    className="bg-green-600 hover:bg-green-700"
                    disabled={saving}
                    onClick={async () => {
                      setSaving(true);
                      try {
                        const res = await fetch(`/api/orders/${params.id}`, {
                          method: 'PATCH',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ status: order.status, paymentStatus: order.paymentStatus }),
                        });
                        if (res.ok) {
                          const updated = await res.json();
                          setOrder(updated);
                          toast({ title: 'Order updated' });
                        } else {
                          toast({ title: 'Failed to update order', variant: 'destructive' });
                        }
                      } finally {
                        setSaving(false);
                      }
                    }}
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}