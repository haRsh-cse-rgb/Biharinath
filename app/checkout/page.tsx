"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Script from 'next/script';
import { ShoppingCart, CreditCard, Truck } from 'lucide-react';
import { PageTitle } from '@/components/layout/PageTitle';

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface CartItem {
  productId: {
    _id: string;
    name: string;
    images: string[];
    price: number;
  };
  quantity: number;
  // price is derived from productId.price
}

export default function CheckoutPage() {
  const { toast } = useToast();
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [step, setStep] = useState(1);

  const [shippingInfo, setShippingInfo] = useState({
    fullName: user?.fullName || '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
  });

  const [paymentMethod, setPaymentMethod] = useState('razorpay');

  useEffect(() => {
    if (!user) {
      router.push('/auth/login?redirect=/checkout');
      return;
    }
    fetchCart();
    fetchLastOrderAddress();
  }, [user]);

  const fetchCart = async () => {
    try {
      const res = await fetch(`/api/cart?userId=${user?._id}`);
      if (res.ok) {
        const data = await res.json();
        setCart(data.items || []);
      }
    } catch (error) {
      console.error('Failed to fetch cart:', error);
    }
  };

  const fetchLastOrderAddress = async () => {
    if (!user?._id) return;
    try {
      const res = await fetch(`/api/orders?userId=${user._id}`);
      if (res.ok) {
        const orders = await res.json();
        if (orders && orders.length > 0) {
          // Get the most recent order
          const lastOrder = orders[0];
          if (lastOrder.shippingAddress) {
            setShippingInfo({
              fullName: lastOrder.shippingAddress.fullName || user.fullName || '',
              phone: lastOrder.shippingAddress.phone || '',
              addressLine1: lastOrder.shippingAddress.addressLine1 || '',
              addressLine2: lastOrder.shippingAddress.addressLine2 || '',
              city: lastOrder.shippingAddress.city || '',
              state: lastOrder.shippingAddress.state || '',
              postalCode: lastOrder.shippingAddress.postalCode || '',
            });
          } else {
            // Fallback to user profile data
            setShippingInfo({
              fullName: user.fullName || '',
              phone: user.phone || '',
              addressLine1: '',
              addressLine2: '',
              city: '',
              state: '',
              postalCode: '',
            });
          }
        } else {
          // No previous orders, use user profile data
          setShippingInfo({
            fullName: user.fullName || '',
            phone: user.phone || '',
            addressLine1: '',
            addressLine2: '',
            city: '',
            state: '',
            postalCode: '',
          });
        }
      }
    } catch (error) {
      console.error('Failed to fetch last order:', error);
      // Fallback to user profile data
      setShippingInfo({
        fullName: user?.fullName || '',
        phone: user?.phone || '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        postalCode: '',
      });
    }
  };

  const calculateTotals = () => {
    const subtotal = cart.reduce((sum, item) => {
      const unitPrice = Number(item.productId?.price) || 0;
      const qty = Number(item.quantity) || 0;
      return sum + unitPrice * qty;
    }, 0);
    const shippingAmount = subtotal >= 500 ? 0 : 50;
    const taxAmount = Math.round(subtotal * 0.05);
    const totalAmount = subtotal + shippingAmount + taxAmount;

    return { subtotal, shippingAmount, taxAmount, totalAmount };
  };

  const { subtotal, shippingAmount, taxAmount, totalAmount } = calculateTotals();

  const handlePlaceOrder = async () => {
    if (!shippingInfo.fullName || !shippingInfo.phone || !shippingInfo.addressLine1 || !shippingInfo.city || !shippingInfo.state || !shippingInfo.postalCode) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all shipping address fields',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shippingAddress: shippingInfo,
          paymentMethod,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to create order');
      }

      if (paymentMethod === 'cod') {
        toast({
          title: 'Order Placed!',
          description: 'Your order has been placed successfully.',
        });
        setCart([]);
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('cart:updated'));
        }
        router.push(`/order-success?orderId=${data.orderId}`);
      } else {
        const options = {
          key: data.key,
          amount: data.amount * 100,
          currency: data.currency,
          name: 'Biharinath Organic Farms',
          description: `Order #${data.orderNumber}`,
          order_id: data.razorpayOrderId,
          handler: async function (response: any) {
            try {
              const verifyRes = await fetch('/api/payments/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  orderId: data.orderId,
                }),
              });

              const verifyData = await verifyRes.json();

              if (verifyRes.ok) {
                toast({
                  title: 'Payment Successful!',
                  description: 'Your order has been confirmed.',
                });
                setCart([]);
                if (typeof window !== 'undefined') {
                  window.dispatchEvent(new Event('cart:updated'));
                }
                router.push(`/order-success?orderId=${data.orderId}`);
              } else {
                throw new Error(verifyData.error);
              }
            } catch (error: any) {
              toast({
                title: 'Payment Verification Failed',
                description: error.message,
                variant: 'destructive',
              });
            }
          },
          prefill: {
            name: shippingInfo.fullName,
            contact: shippingInfo.phone,
          },
          theme: {
            color: '#16a34a',
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', function (response: any) {
          toast({
            title: 'Payment Failed',
            description: response.error.description,
            variant: 'destructive',
          });
        });
        rzp.open();
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to place order',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <>
      <PageTitle title="Checkout" />
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-white pt-24 pb-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-8 flex items-center">
            <ShoppingCart className="mr-3 h-8 w-8 text-green-600" />
            Checkout
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Card className={step >= 1 ? 'border-green-500' : ''}>
                <CardHeader className="bg-green-50">
                  <CardTitle className="flex items-center">
                    <Truck className="mr-2 h-5 w-5 text-green-600" />
                    1. Shipping Address
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name *</Label>
                      <Input
                        id="fullName"
                        required
                        value={shippingInfo.fullName}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, fullName: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        required
                        value={shippingInfo.phone}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, phone: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="addressLine1">Address Line 1 *</Label>
                    <Input
                      id="addressLine1"
                      required
                      value={shippingInfo.addressLine1}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, addressLine1: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="addressLine2">Address Line 2</Label>
                    <Input
                      id="addressLine2"
                      value={shippingInfo.addressLine2}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, addressLine2: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        required
                        value={shippingInfo.city}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, city: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State *</Label>
                      <Input
                        id="state"
                        required
                        value={shippingInfo.state}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, state: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="postalCode">Pincode *</Label>
                      <Input
                        id="postalCode"
                        required
                        value={shippingInfo.postalCode}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, postalCode: e.target.value })}
                      />
                    </div>
                  </div>
                  {step === 1 && (
                    <Button className="w-full bg-green-600 hover:bg-green-700" onClick={() => setStep(2)}>
                      Continue to Payment
                    </Button>
                  )}
                </CardContent>
              </Card>

              {step >= 2 && (
                <Card className="border-green-500">
                  <CardHeader className="bg-green-50">
                    <CardTitle className="flex items-center">
                      <CreditCard className="mr-2 h-5 w-5 text-green-600" />
                      2. Payment Method
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-4">
                    <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                      <div className="flex items-center space-x-2 p-4 border rounded-lg hover:border-green-500 transition-colors cursor-pointer">
                        <RadioGroupItem value="razorpay" id="razorpay" />
                        <Label htmlFor="razorpay" className="flex-1 cursor-pointer">
                          <div className="font-semibold">Online Payment</div>
                          <div className="text-sm text-gray-500">UPI, Cards, Net Banking, Wallets</div>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-4 border rounded-lg hover:border-green-500 transition-colors cursor-pointer">
                        <RadioGroupItem value="cod" id="cod" />
                        <Label htmlFor="cod" className="flex-1 cursor-pointer">
                          <div className="font-semibold">Cash on Delivery</div>
                          <div className="text-sm text-gray-500">Pay when you receive the order</div>
                        </Label>
                      </div>
                    </RadioGroup>
                  </CardContent>
                </Card>
              )}
            </div>

            <div>
              <Card className="sticky top-24">
                <CardHeader className="bg-green-50">
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {cart.map((item, index) => (
                      <div key={index} className="flex items-center space-x-3 pb-3 border-b">
                        <img
                          src={item.productId.images?.[0] || '/placeholder.png'}
                          alt={item.productId.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{item.productId.name}</p>
                          <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                        </div>
                        <p className="text-sm font-semibold">₹{(Number(item.productId?.price) || 0) * (Number(item.quantity) || 0)}</p>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2 pt-3 border-t">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal</span>
                      <span>₹{subtotal}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Shipping</span>
                      <span className={shippingAmount === 0 ? 'text-green-600 font-semibold' : ''}>
                        {shippingAmount === 0 ? 'FREE' : `₹${shippingAmount}`}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Tax (5%)</span>
                      <span>₹{taxAmount}</span>
                    </div>
                    <div className="border-t pt-3 flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span className="text-green-600">₹{totalAmount}</span>
                    </div>
                  </div>

                  {cart.length === 0 && (
                    <p className="text-center text-gray-500 py-4">Your cart is empty</p>
                  )}

                  {step === 2 && cart.length > 0 && (
                    <Button
                      className="w-full bg-green-600 hover:bg-green-700"
                      onClick={handlePlaceOrder}
                      disabled={loading}
                    >
                      {loading ? 'Processing...' : `Place Order - ₹${totalAmount}`}
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
