"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check, X, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await fetch('/api/bookings');
      const data = await response.json();
      setBookings(data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (bookingId: string) => {
    setProcessingId(bookingId);
    try {
      const response = await fetch(`/api/admin/bookings?id=${bookingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'approved' }),
      });

      if (response.ok) {
        const updatedBooking = await response.json();
        setBookings(bookings.map(booking => 
          booking._id === bookingId ? updatedBooking : booking
        ));
      } else {
        console.error('Failed to approve booking');
      }
    } catch (error) {
      console.error('Error approving booking:', error);
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (bookingId: string) => {
    const rejectionReason = prompt('Please provide a reason for rejection:');
    if (!rejectionReason) return;

    setProcessingId(bookingId);
    try {
      const response = await fetch(`/api/admin/bookings?id=${bookingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          status: 'rejected',
          rejectionReason: rejectionReason 
        }),
      });

      if (response.ok) {
        const updatedBooking = await response.json();
        setBookings(bookings.map(booking => 
          booking._id === bookingId ? updatedBooking : booking
        ));
      } else {
        console.error('Failed to reject booking');
      }
    } catch (error) {
      console.error('Error rejecting booking:', error);
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center mb-8">
          <Link href="/admin">
            <Button variant="ghost" size="sm" className="mr-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Manage Bookings</h1>
        </div>

        {loading ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-gray-500">Loading bookings...</p>
            </CardContent>
          </Card>
        ) : bookings.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-gray-500">No bookings yet</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking: any) => (
              <Card key={booking._id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{booking.fullName}</h3>
                      <p className="text-sm text-gray-600">{booking.email}</p>
                      <p className="text-sm text-gray-600">{booking.phone}</p>
                      <p className="text-sm mt-2">
                        <span className="font-medium">Date:</span> {new Date(booking.preferredDate).toLocaleDateString()}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Time:</span> {booking.preferredTimeSlot}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Guests:</span> {booking.numberOfGuests}
                      </p>
                      {booking.notes && (
                        <p className="text-sm mt-2">
                          <span className="font-medium">Notes:</span> {booking.notes}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      <Badge>{booking.status}</Badge>
                      {booking.status === 'pending' && (
                        <div className="flex space-x-2">
                          <Button 
                            size="sm" 
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => handleApprove(booking._id)}
                            disabled={processingId === booking._id}
                          >
                            <Check className="mr-1 h-4 w-4" />
                            {processingId === booking._id ? 'Processing...' : 'Approve'}
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="text-red-600"
                            onClick={() => handleReject(booking._id)}
                            disabled={processingId === booking._id}
                          >
                            <X className="mr-1 h-4 w-4" />
                            {processingId === booking._id ? 'Processing...' : 'Reject'}
                          </Button>
                        </div>
                      )}
                      {booking.status === 'rejected' && booking.rejectionReason && (
                        <div className="text-sm text-red-600 mt-2">
                          <span className="font-medium">Reason:</span> {booking.rejectionReason}
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
