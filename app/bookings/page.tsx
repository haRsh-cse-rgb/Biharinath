"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Users, Mail, Phone, MapPin } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

export default function BookingsPage() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!user?.email) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const res = await fetch(`/api/bookings?email=${encodeURIComponent(user.email)}`);
        if (res.ok) {
          const data = await res.json();
          setBookings(data || []);
        }
      } catch (error) {
        console.error('Failed to fetch bookings:', error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user?.email]);

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { className: string; label: string }> = {
      pending: { className: 'bg-yellow-600', label: 'Pending' },
      approved: { className: 'bg-green-600', label: 'Approved' },
      rejected: { className: 'bg-red-600', label: 'Rejected' },
      completed: { className: 'bg-blue-600', label: 'Completed' },
      cancelled: { className: 'bg-gray-600', label: 'Cancelled' },
    };

    const config = statusConfig[status] || { className: 'bg-gray-600', label: status };
    return (
      <Badge className={config.className}>{config.label}</Badge>
    );
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-12 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please login to view your bookings</h1>
          <Link href="/auth/login">
            <Button className="bg-green-600 hover:bg-green-700">Login</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">My Bookings</h1>
          <Link href="/book-visit">
            <Button className="bg-green-600 hover:bg-green-700">
              <Calendar className="mr-2 h-4 w-4" />
              Book a Visit
            </Button>
          </Link>
        </div>

        {loading ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-gray-600">Loading bookings...</p>
            </CardContent>
          </Card>
        ) : bookings.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">No bookings yet</h2>
              <p className="text-gray-600 mb-6">Book a visit to our organic farm to see your bookings here</p>
              <Link href="/book-visit">
                <Button className="bg-green-600 hover:bg-green-700">Book a Visit</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking: any) => (
              <Card key={booking._id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-green-600" />
                        Booking #{booking.bookingNumber}
                      </CardTitle>
                      <p className="text-sm text-gray-500 mt-1">
                        Booked on {new Date(booking.createdAt).toLocaleDateString('en-IN')}
                      </p>
                    </div>
                    {getStatusBadge(booking.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <div>
                          <p className="text-sm text-gray-600">Preferred Date</p>
                          <p className="font-semibold">
                            {new Date(booking.preferredDate).toLocaleDateString('en-IN', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <div>
                          <p className="text-sm text-gray-600">Time Slot</p>
                          <p className="font-semibold">{booking.preferredTimeSlot}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-gray-500" />
                        <div>
                          <p className="text-sm text-gray-600">Number of Guests</p>
                          <p className="font-semibold">{booking.numberOfGuests}</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-gray-500" />
                        <div>
                          <p className="text-sm text-gray-600">Email</p>
                          <p className="font-semibold">{booking.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-gray-500" />
                        <div>
                          <p className="text-sm text-gray-600">Phone</p>
                          <p className="font-semibold">{booking.phone}</p>
                        </div>
                      </div>
                      {booking.notes && (
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Notes</p>
                          <p className="text-sm">{booking.notes}</p>
                        </div>
                      )}
                      {booking.rejectionReason && booking.status === 'rejected' && (
                        <div className="bg-red-50 p-3 rounded">
                          <p className="text-sm text-red-800">
                            <strong>Rejection Reason:</strong> {booking.rejectionReason}
                          </p>
                        </div>
                      )}
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

