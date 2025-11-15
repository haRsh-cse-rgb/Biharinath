"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { User, Package, Heart, Calendar, Settings, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

export default function AccountPage() {
  const { user, signOut, isAdmin } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
    toast({
      title: 'Signed out',
      description: 'You have been signed out successfully.',
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-20 md:pb-12 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="py-12 text-center">
            <User className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Please Sign In</h2>
            <p className="text-gray-600 mb-6">Sign in to access your account</p>
            <Link href="/auth/login">
              <Button className="bg-green-600 hover:bg-green-700">Sign In</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const accountMenuItems = [
    {
      title: 'My Profile',
      description: 'View and edit your profile information',
      icon: User,
      href: '/profile',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'My Orders',
      description: 'View your order history and track shipments',
      icon: Package,
      href: '/orders',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Wishlist',
      description: 'View your saved favorite products',
      icon: Heart,
      href: '/wishlist',
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
    {
      title: 'My Bookings',
      description: 'View and manage your farm visit bookings',
      icon: Calendar,
      href: '/bookings',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    ...(isAdmin ? [{
      title: 'Admin Panel',
      description: 'Manage products, orders, and settings',
      icon: Settings,
      href: '/admin',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    }] : []),
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-20 md:pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">My Account</h1>
          <p className="text-gray-600">Welcome back, {user.fullName || user.email}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {accountMenuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className={`${item.bgColor} p-3 rounded-lg`}>
                        <Icon className={`h-6 w-6 ${item.color}`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-1">{item.title}</h3>
                        <p className="text-sm text-gray-600">{item.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm text-gray-500">Full Name</p>
              <p className="font-medium">{user.fullName || 'Not set'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium">{user.email}</p>
            </div>
            {user.phone && (
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium">{user.phone}</p>
              </div>
            )}
            <div className="pt-4 border-t">
              <Button
                variant="outline"
                className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={handleSignOut}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

