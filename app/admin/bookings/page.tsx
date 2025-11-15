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
    <div className="min-h-screen bg-gray-50 pt-24 pb-20 md:pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 mb-8">
          <Link href="/admin">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Back</span>
            </Button>
          </Link>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">Manage Bookings</h1>
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
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-base sm:text-lg">{booking.fullName}</h3>
                      <p className="text-sm text-gray-600 truncate">{booking.email}</p>
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
                        <p className="text-sm mt-2 break-words">
                          <span className="font-medium">Notes:</span> {booking.notes}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col items-start sm:items-end space-y-2 w-full sm:w-auto flex-shrink-0">
                      <Badge className="self-start sm:self-end">{booking.status}</Badge>
                      {booking.status === 'pending' && (
                        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                          <Button 
                            size="sm" 
                            className="bg-green-600 hover:bg-green-700 w-full sm:w-auto"
                            onClick={() => handleApprove(booking._id)}
                            disabled={processingId === booking._id}
                          >
                            <Check className="mr-1 h-4 w-4" />
                            {processingId === booking._id ? 'Processing...' : 'Approve'}
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="text-red-600 w-full sm:w-auto"
                            onClick={() => handleReject(booking._id)}
                            disabled={processingId === booking._id}
                          >
                            <X className="mr-1 h-4 w-4" />
                            {processingId === booking._id ? 'Processing...' : 'Reject'}
                          </Button>
                        </div>
                      )}
                      {booking.status === 'rejected' && booking.rejectionReason && (
                        <div className="text-sm text-red-600 mt-2 break-words max-w-full sm:max-w-xs">
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
