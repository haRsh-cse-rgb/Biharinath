"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const businessInfo = {
  name: 'Biharinath Organic Farms',
  addressLine1: 'Add Address Line 1',
  addressLine2: 'Add Address Line 2',
  phone: 'Add phone number',
  email: 'Add business email',
  gstin: 'GSTIN / Tax ID',
  notes: 'Thank you for shopping with us!',
};

export default function AdminInvoicePage({ params }: { params: { id: string } }) {
  const [order, setOrder] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/orders/${params.id}`);
        if (res.ok) {
          const data = await res.json();
          setOrder(data);
        } else {
          router.replace('/admin/orders');
        }
      } finally {
        setLoading(false);
      }
    };
    if (params.id) {
      fetchOrder();
    }
  }, [params.id, router]);

  const printInvoice = () => {
    window.print();
  };

  if (loading || !order) {
    return (
      <div className="min-h-screen bg-white pt-10 px-6">
        <p>Loading invoice...</p>
      </div>
    );
  }

  const orderDate = new Date(order.createdAt).toLocaleDateString('en-IN');
  const subtotal = order.subtotal ?? order.items?.reduce((sum: number, item: any) => sum + (item.totalPrice ?? item.unitPrice * item.quantity), 0);
  const shippingAmount = order.shippingAmount ?? 0;
  const taxAmount = order.taxAmount ?? 0;
  const totalAmount = order.totalAmount ?? subtotal + shippingAmount + taxAmount;

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 print:bg-white print:py-0">
      <div className="max-w-3xl mx-auto space-y-6 print:max-w-full">
        <div className="flex justify-between items-center print:hidden">
          <h1 className="text-2xl font-bold">Invoice</h1>
          <Button onClick={printInvoice}>Print</Button>
        </div>

        <Card className="shadow print:shadow-none print:border-0">
          <CardContent className="p-8 print:p-6">
            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6 mb-8">
              <div>
                <h2 className="text-xl font-semibold">{businessInfo.name}</h2>
                <p className="text-sm text-gray-600">{businessInfo.addressLine1}</p>
                <p className="text-sm text-gray-600">{businessInfo.addressLine2}</p>
                <p className="text-sm text-gray-600">Phone: {businessInfo.phone}</p>
                <p className="text-sm text-gray-600">Email: {businessInfo.email}</p>
                <p className="text-sm text-gray-600">GSTIN: {businessInfo.gstin}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Invoice #</p>
                <p className="text-xs sm:text-sm font-semibold break-words">{order.orderNumber}</p>
                <p className="text-sm text-gray-500 mt-2">Date</p>
                <p className="text-sm font-medium">{orderDate}</p>
                <p className="text-sm text-gray-500 mt-2">Payment Status</p>
                <p className="text-sm font-medium capitalize">{order.paymentStatus}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="font-semibold mb-2 text-lg">Bill To</h3>
                <p className="text-sm font-medium">{order.shippingAddress?.fullName || order.userId?.fullName}</p>
                {order.shippingAddress?.phone && <p className="text-sm text-gray-600">Phone: {order.shippingAddress.phone}</p>}
                {order.userId?.email && <p className="text-sm text-gray-600">Email: {order.userId.email}</p>}
                <p className="text-sm text-gray-600 mt-2">
                  {order.shippingAddress?.addressLine1}<br />
                  {order.shippingAddress?.addressLine2 && <>{order.shippingAddress.addressLine2}<br /></>}
                  {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.postalCode}
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2 text-lg">Ship To</h3>
                <p className="text-sm text-gray-600">
                  {order.shippingAddress?.addressLine1}<br />
                  {order.shippingAddress?.addressLine2 && <>{order.shippingAddress.addressLine2}<br /></>}
                  {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.postalCode}
                </p>
              </div>
            </div>

            <table className="w-full text-sm border border-gray-200 mb-6">
              <thead className="bg-gray-100">
                <tr>
                  <th className="text-left px-4 py-2 border-b border-gray-200">Item</th>
                  <th className="text-left px-4 py-2 border-b border-gray-200">Qty</th>
                  <th className="text-left px-4 py-2 border-b border-gray-200">Unit Price</th>
                  <th className="text-left px-4 py-2 border-b border-gray-200">Total</th>
                </tr>
              </thead>
              <tbody>
                {order.items?.map((item: any) => {
                  const name = item.productName || item.productId?.name;
                  const unitPrice = item.unitPrice ?? 0;
                  const total = item.totalPrice ?? unitPrice * item.quantity;
                  return (
                    <tr key={item.productId?._id || name}>
                      <td className="px-4 py-2 border-b border-gray-100">
                        <p className="font-medium">{name}</p>
                        {item.variant && (
                          <p className="text-xs text-gray-500">{JSON.stringify(item.variant)}</p>
                        )}
                      </td>
                      <td className="px-4 py-2 border-b border-gray-100">{item.quantity}</td>
                      <td className="px-4 py-2 border-b border-gray-100">₹{unitPrice}</td>
                      <td className="px-4 py-2 border-b border-gray-100">₹{total}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <div className="flex justify-end mb-6">
              <div className="w-full md:w-1/2 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span>{shippingAmount === 0 ? 'FREE' : `₹${shippingAmount}`}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span>₹{taxAmount}</span>
                </div>
                <div className="flex justify-between font-semibold border-t pt-2 text-base">
                  <span>Total</span>
                  <span>₹{totalAmount}</span>
                </div>
              </div>
            </div>

            <p className="text-sm text-gray-600 mt-8">{businessInfo.notes}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

