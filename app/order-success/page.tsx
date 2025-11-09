"use client";

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Download, Home, Package } from 'lucide-react';
import Link from 'next/link';

interface Order {
  _id: string;
  orderNumber: string;
  items: {
    productName: string;
    productImage: string;
    unitPrice: number;
    quantity: number;
    totalPrice: number;
  }[];
  shippingAddress: {
    fullName: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postalCode: string;
  };
  subtotal: number;
  shippingAmount: number;
  taxAmount: number;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  status: string;
  createdAt: string;
}

export default function OrderSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  const orderId = searchParams.get('orderId');

  useEffect(() => {
    if (!orderId) {
      router.push('/');
      return;
    }

    fetchOrderDetails();
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      const res = await fetch(`/api/orders/${orderId}`);
      if (res.ok) {
        const data = await res.json();
        setOrder(data);
      }
    } catch (error) {
      console.error('Failed to fetch order:', error);
    } finally {
      setLoading(false);
    }
  };

  const downloadInvoice = () => {
    if (!order) return;

    const invoiceContent = `
BIHARINATH ORGANIC FARMS
Invoice

Order Number: ${order.orderNumber}
Date: ${new Date(order.createdAt).toLocaleDateString('en-IN')}

Shipping Address:
${order.shippingAddress.fullName}
${order.shippingAddress.addressLine1}
${order.shippingAddress.addressLine2 || ''}
${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.postalCode}
Phone: ${order.shippingAddress.phone}

Items:
${order.items.map(item => `${item.productName} - ₹${item.unitPrice} x ${item.quantity} = ₹${item.totalPrice}`).join('\n')}

Subtotal: ₹${order.subtotal}
Shipping: ₹${order.shippingAmount}
Tax: ₹${order.taxAmount}
Total: ₹${order.totalAmount}

Payment Method: ${order.paymentMethod === 'razorpay' ? 'Online Payment' : 'Cash on Delivery'}
Payment Status: ${order.paymentStatus}

Thank you for shopping with us!
    `;

    const blob = new Blob([invoiceContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Invoice-${order.orderNumber}.txt`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-white pt-24 pb-12 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          <p className="mt-4 text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-white pt-24 pb-12">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold mb-4">Order not found</h1>
          <Link href="/">
            <Button className="bg-green-600 hover:bg-green-700">
              <Home className="mr-2 h-4 w-4" />
              Go to Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-20 w-20 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h1>
          <p className="text-lg text-gray-600">
            Thank you for your order. We'll send you a confirmation email shortly.
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Order Details</span>
              <span className="text-green-600 text-lg">#{order.orderNumber}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Order Date</p>
                <p className="font-semibold">{new Date(order.createdAt).toLocaleDateString('en-IN')}</p>
              </div>
              <div>
                <p className="text-gray-600">Payment Method</p>
                <p className="font-semibold">
                  {order.paymentMethod === 'razorpay' ? 'Online Payment' : 'Cash on Delivery'}
                </p>
              </div>
              <div>
                <p className="text-gray-600">Payment Status</p>
                <p className="font-semibold capitalize">{order.paymentStatus}</p>
              </div>
              <div>
                <p className="text-gray-600">Order Status</p>
                <p className="font-semibold capitalize">{order.status}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Items Ordered</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {order.items.map((item, index) => (
                <div key={index} className="flex items-center space-x-4 pb-4 border-b last:border-b-0">
                  <img
                    src={item.productImage}
                    alt={item.productName}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold">{item.productName}</h3>
                    <p className="text-sm text-gray-600">
                      ₹{item.unitPrice} x {item.quantity}
                    </p>
                  </div>
                  <div className="font-semibold">₹{item.totalPrice}</div>
                </div>
              ))}
            </div>

            <div className="mt-6 space-y-2 border-t pt-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span>₹{order.subtotal}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Shipping</span>
                <span>{order.shippingAmount === 0 ? 'FREE' : `₹${order.shippingAmount}`}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tax</span>
                <span>₹{order.taxAmount}</span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t pt-2">
                <span>Total</span>
                <span className="text-green-600">₹{order.totalAmount}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Shipping Address</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm space-y-1">
              <p className="font-semibold">{order.shippingAddress.fullName}</p>
              <p>{order.shippingAddress.addressLine1}</p>
              {order.shippingAddress.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
              <p>
                {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.postalCode}
              </p>
              <p className="text-gray-600">Phone: {order.shippingAddress.phone}</p>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            onClick={downloadInvoice}
            variant="outline"
            className="flex-1"
          >
            <Download className="mr-2 h-4 w-4" />
            Download Invoice
          </Button>
          <Link href="/orders" className="flex-1">
            <Button variant="outline" className="w-full">
              <Package className="mr-2 h-4 w-4" />
              View All Orders
            </Button>
          </Link>
          <Link href="/" className="flex-1">
            <Button className="w-full bg-green-600 hover:bg-green-700">
              <Home className="mr-2 h-4 w-4" />
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
