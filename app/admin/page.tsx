"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Package, ShoppingCart, Users, Calendar, Database } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';

interface Stats {
  products: number;
  orders: number;
  customers: number;
  bookings: number;
}

interface Order {
  _id: string;
  orderNumber: string;
  totalAmount: number;
  status: string;
  user?: { fullName: string; email: string };
  createdAt: string;
}

interface Booking {
  _id: string;
  visitDate: string;
  status: string;
  numberOfPeople: number;
  user?: { fullName: string; email: string };
}

export default function AdminDashboard() {
  const { toast } = useToast();
  const [seeding, setSeeding] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stats>({
    products: 0,
    orders: 0,
    customers: 0,
    bookings: 0,
  });
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [pendingBookings, setPendingBookings] = useState<Booking[]>([]);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/admin/stats');
      if (res.ok) {
        const data = await res.json();
        setStats(data.stats);
        setRecentOrders(data.recentOrders || []);
        setPendingBookings(data.pendingBookings || []);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statsCards = [
    { title: 'Total Products', value: stats.products, icon: Package, href: '/admin/products', color: 'bg-blue-500' },
    { title: 'Total Orders', value: stats.orders, icon: ShoppingCart, href: '/admin/orders', color: 'bg-green-500' },
    { title: 'Customers', value: stats.customers, icon: Users, href: '/admin/customers', color: 'bg-purple-500' },
    { title: 'Bookings', value: stats.bookings, icon: Calendar, href: '/admin/bookings', color: 'bg-orange-500' }
  ];

  const handleSeedDatabase = async () => {
    if (!confirm('This will delete all existing data and create sample data. Are you sure?')) {
      return;
    }

    setSeeding(true);
    try {
      const response = await fetch('/api/seed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: 'Database seeded successfully!',
          description: `Created ${data.data.users} users, ${data.data.products} products, ${data.data.orders} orders, and more.`,
        });
      } else {
        throw new Error(data.details || 'Failed to seed database');
      }
      fetchStats();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to seed database',
        variant: 'destructive'
      });
    } finally {
      setSeeding(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <Button
            onClick={handleSeedDatabase}
            disabled={seeding}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Database className="mr-2 h-4 w-4" />
            {seeding ? 'Seeding Database...' : 'Seed Database'}
          </Button>
        </div>

        <Card className="mb-8 bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Database className="mr-2 h-5 w-5 text-blue-600" />
              Database Management
            </CardTitle>
            <CardDescription>
              Click the button above to populate your MongoDB database with sample data including users, products, orders, bookings, reviews, and more.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <p><strong>Sample data includes:</strong></p>
              <ul className="list-disc list-inside space-y-1 text-gray-600">
                <li>4 Users (1 admin, 3 customers) - All passwords: password123</li>
                <li>6 Categories with 12 Products</li>
                <li>3 Bookings (farm visit appointments)</li>
                <li>3 Coupons (WELCOME10, ORGANIC20, FLAT100)</li>
                <li>2 Orders with full order history</li>
                <li>3 Product Reviews</li>
                <li>2 Shipping Addresses</li>
                <li>1 Active Shopping Cart</li>
              </ul>
              <p className="text-red-600 font-medium mt-4">Warning: This will delete all existing data!</p>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsCards.map((stat) => (
            <Link key={stat.title} href={stat.href}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </CardTitle>
                  <div className={`${stat.color} p-2 rounded-lg`}>
                    <stat.icon className="h-5 w-5 text-white" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {loading ? '...' : stat.value}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="text-gray-500">Loading...</p>
              ) : recentOrders.length === 0 ? (
                <p className="text-gray-500">No recent orders</p>
              ) : (
                <div className="space-y-3">
                  {recentOrders.map((order) => (
                    <div key={order._id} className="flex items-center justify-between border-b pb-3 last:border-0">
                      <div>
                        <p className="font-semibold text-sm">{order.orderNumber}</p>
                        <p className="text-xs text-gray-500">{order.user?.fullName || 'N/A'}</p>
                        <p className="text-xs text-gray-400">{formatDate(order.createdAt)}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-green-600">{formatCurrency(order.totalAmount)}</p>
                        <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700">
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pending Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="text-gray-500">Loading...</p>
              ) : pendingBookings.length === 0 ? (
                <p className="text-gray-500">No pending bookings</p>
              ) : (
                <div className="space-y-3">
                  {pendingBookings.map((booking) => (
                    <div key={booking._id} className="flex items-center justify-between border-b pb-3 last:border-0">
                      <div>
                        <p className="font-semibold text-sm">{booking.user?.fullName || 'N/A'}</p>
                        <p className="text-xs text-gray-500">{booking.user?.email || 'N/A'}</p>
                        <p className="text-xs text-gray-400">{formatDate(booking.visitDate)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold">{booking.numberOfPeople} people</p>
                        <span className="text-xs px-2 py-1 rounded-full bg-orange-100 text-orange-700">
                          {booking.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
