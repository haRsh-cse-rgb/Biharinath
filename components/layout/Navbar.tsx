"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { ShoppingCart, User, Search, Menu, X, LogOut, Package, MapPin, Settings, Leaf, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';

export function Navbar() {
  const { user, signOut, isAdmin } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [cartItemsCount, setCartItemsCount] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
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
        // ignore count errors in navbar
      }
    };

    loadCartCount();

    const onCartUpdated = () => loadCartCount();
    window.addEventListener('cart:updated', onCartUpdated as any);
    return () => {
      window.removeEventListener('cart:updated', onCartUpdated as any);
    };
  }, [user?._id]);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 bg-green-700 shadow-md"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          <Link
            href="/"
            className="flex items-center space-x-2 text-white"
          >
            <Leaf className="h-8 w-8" />
            <span className="text-xl md:text-2xl font-bold">Biharinath Organic Farms</span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/products"
              className="text-white hover:text-green-200 transition-colors"
            >
              Products
            </Link>
            <Link
              href="/categories"
              className="text-white hover:text-green-200 transition-colors"
            >
              Categories
            </Link>
            <Link
              href="/book-visit"
              className="text-white hover:text-green-200 transition-colors"
            >
              Book Site Visit
            </Link>
          </div>

          <div className="flex items-center space-x-2 md:space-x-4">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:text-green-200 hover:bg-green-600"
            >
              <Search className="h-5 w-5" />
            </Button>

            <Link href="/cart">
              <Button
                variant="ghost"
                size="icon"
                className="relative text-white hover:text-green-200 hover:bg-green-600"
              >
                <ShoppingCart className="h-5 w-5" />
                {cartItemsCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                    {cartItemsCount}
                  </Badge>
                )}
              </Button>
            </Link>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:text-green-200 hover:bg-green-600"
                  >
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <div className="px-2 py-1.5 text-sm font-medium">
                    {user?.fullName || user?.email || 'User'}
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/orders" className="cursor-pointer">
                      <Package className="mr-2 h-4 w-4" />
                      Orders
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/wishlist" className="cursor-pointer">
                      <Heart className="mr-2 h-4 w-4" />
                      Wishlist
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/bookings" className="cursor-pointer">
                      <MapPin className="mr-2 h-4 w-4" />
                      Bookings
                    </Link>
                  </DropdownMenuItem>
                  {isAdmin && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/admin" className="cursor-pointer">
                          <Settings className="mr-2 h-4 w-4" />
                          Admin Panel
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => signOut()} className="cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/auth/login">
                <Button
                  size="sm"
                  className="bg-white text-green-700 hover:bg-green-50"
                >
                  Sign In
                </Button>
              </Link>
            )}

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-white hover:text-green-200 hover:bg-green-600"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-green-800 border-t border-green-600 shadow-lg">
          <div className="px-4 py-4 space-y-3">
            <Link
              href="/products"
              className="block py-2 text-white hover:text-green-200"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Products
            </Link>
            <Link
              href="/categories"
              className="block py-2 text-white hover:text-green-200"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Categories
            </Link>
            <Link
              href="/book-visit"
              className="block py-2 text-white hover:text-green-200"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Book Site Visit
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
