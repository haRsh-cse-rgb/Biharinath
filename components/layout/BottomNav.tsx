"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, ShoppingBag, Grid3x3, ShoppingCart, User, Package } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';

export function BottomNav() {
  const pathname = usePathname();
  const { user } = useAuth();
  const [cartItemsCount, setCartItemsCount] = useState(0);

  const loadCartCount = async () => {
    if (!user?._id) {
      setCartItemsCount(0);
      return;
    }
    try {
      const res = await fetch(`/api/cart?userId=${user._id}`);
      if (res.ok) {
        const data = await res.json();
        const count = (data?.items || []).reduce((sum: number, it: any) => sum + (it.quantity || 0), 0);
        setCartItemsCount(count);
      }
    } catch {
      // Ignore errors
    }
  };

  useEffect(() => {
    loadCartCount();
    
    // Listen for cart update events
    const handleCartUpdate = () => {
      loadCartCount();
    };
    
    window.addEventListener('cart:updated', handleCartUpdate);
    
    return () => {
      window.removeEventListener('cart:updated', handleCartUpdate);
    };
  }, [user]);

  // Don't show bottom nav on admin pages or auth pages
  if (pathname?.startsWith('/admin') || pathname?.startsWith('/auth')) {
    return null;
  }

  const navItems = [
    {
      href: '/',
      icon: Home,
      label: 'Home',
      active: pathname === '/',
    },
    {
      href: '/products',
      icon: ShoppingBag,
      label: 'Products',
      active: pathname?.startsWith('/products') || pathname?.startsWith('/product/'),
    },
    {
      href: '/categories',
      icon: Grid3x3,
      label: 'Categories',
      active: pathname?.startsWith('/categories'),
    },
    {
      href: '/cart',
      icon: ShoppingCart,
      label: 'Cart',
      active: pathname === '/cart',
      badge: cartItemsCount > 0 ? cartItemsCount : undefined,
    },
    {
      href: user ? '/account' : '/auth/login',
      icon: user ? User : User,
      label: 'Account',
      active: pathname?.startsWith('/account') || pathname?.startsWith('/orders') || pathname?.startsWith('/profile') || pathname?.startsWith('/wishlist') || pathname?.startsWith('/bookings'),
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg safe-area-bottom">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.active;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                isActive
                  ? 'text-green-600'
                  : 'text-gray-500 hover:text-green-600'
              }`}
            >
              <div className="relative">
                <Icon className={`h-6 w-6 ${isActive ? 'text-green-600' : ''}`} />
                {item.badge && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
                  >
                    {item.badge > 99 ? '99+' : item.badge}
                  </Badge>
                )}
              </div>
              <span className={`text-xs mt-1 ${isActive ? 'font-semibold' : 'font-medium'}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

