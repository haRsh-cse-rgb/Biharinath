"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Star, Check, X, Loader2, MessageSquare, ArrowLeft, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AdminReview {
  _id: string;
  rating: number;
  title?: string;
  comment: string;
  images?: string[];
  isApproved: boolean;
  createdAt: string;
  userId?: {
    fullName?: string;
    email?: string;
  };
  productId?: {
    _id: string;
    name: string;
    slug: string;
    images?: string[];
    price?: number;
  };
}

const statusOptions = [
  { label: 'Pending Approval', value: 'pending' },
  { label: 'Approved', value: 'approved' },
  { label: 'All', value: 'all' },
];

export default function AdminReviewsPage() {
  const { toast } = useToast();
  const [reviews, setReviews] = useState<AdminReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('pending');
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    fetchReviews();
  }, [status]);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/reviews?status=${status}`);
      if (!res.ok) {
        throw new Error('Failed to fetch reviews');
      }
      const data = await res.json();
      setReviews(data || []);
    } catch (error: any) {
      console.error('Failed to fetch reviews:', error);
      toast({
        title: 'Error fetching reviews',
        description: error.message || 'Please try again',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (reviewId: string) => {
    setProcessingId(reviewId);
    try {
      const res = await fetch('/api/admin/reviews', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reviewId, action: 'approve' }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to approve review');
      }
      toast({ title: 'Review approved successfully' });
      fetchReviews();
    } catch (error: any) {
      toast({
        title: 'Failed to approve review',
        description: error.message || 'Please try again',
        variant: 'destructive',
      });
    } finally {
      setProcessingId(null);
    }
  };

  const handleDelete = async (reviewId: string) => {
    if (!confirm('Delete this review permanently?')) {
      return;
    }
    setProcessingId(reviewId);
    try {
      const res = await fetch(`/api/admin/reviews?id=${reviewId}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to delete review');
      }
      toast({ title: 'Review deleted successfully' });
      fetchReviews();
    } catch (error: any) {
      toast({
        title: 'Failed to delete review',
        description: error.message || 'Please try again',
        variant: 'destructive',
      });
    } finally {
      setProcessingId(null);
    }
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8">
          <Link href="/admin">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Back</span>
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold">Manage Reviews</h1>
            <p className="text-gray-600 text-sm sm:text-base">
              Approve or delete product reviews submitted by customers
            </p>
          </div>
          <div className="w-full sm:w-60">
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {loading ? (
          <Card>
            <CardContent className="py-12 text-center text-gray-500">
              <Loader2 className="h-6 w-6 animate-spin mx-auto mb-3 text-green-600" />
              Loading reviews...
            </CardContent>
          </Card>
        ) : reviews.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-gray-500">
              <MessageSquare className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              No reviews found for this filter
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <Card key={review._id}>
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col lg:flex-row gap-4">
                    <div className="flex gap-4 flex-1">
                      <div className="hidden sm:block">
                        <div className="h-20 w-20 relative rounded-lg overflow-hidden bg-gray-100">
                          <Image
                            src={
                              review.productId?.images?.[0] ||
                              '/placeholder-image.jpg'
                            }
                            alt={review.productId?.name || 'Product'}
                            fill
                            className="object-cover"
                          />
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <Link
                            href={
                              review.productId
                                ? `/products/${review.productId.slug}`
                                : '#'
                            }
                            className="font-semibold text-lg hover:text-green-600 transition-colors"
                          >
                            {review.productId?.name || 'Product'}
                          </Link>
                          <Badge
                            variant={review.isApproved ? 'default' : 'secondary'}
                            className={
                              review.isApproved
                                ? 'bg-green-600'
                                : 'bg-yellow-100 text-yellow-700'
                            }
                          >
                            {review.isApproved ? 'Approved' : 'Pending'}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-4 w-4 ${
                                star <= review.rating
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                          <span className="text-sm text-gray-500">
                            {formatDate(review.createdAt)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 mb-2">
                          {review.userId?.fullName || 'Unknown user'} •{' '}
                          {review.userId?.email || 'No email'}
                        </p>
                        {review.title && (
                          <p className="font-medium text-gray-900 mb-1">
                            {review.title}
                          </p>
                        )}
                        <p className="text-gray-700 whitespace-pre-wrap">
                          {review.comment}
                        </p>
                        {review.images && review.images.length > 0 && (
                          <div className="flex flex-wrap gap-3 mt-3">
                            {review.images.map((img, idx) => (
                              <div
                                key={idx}
                                className="relative w-20 h-20 rounded-lg overflow-hidden border"
                              >
                                <Image
                                  src={img}
                                  alt={`Review image ${idx + 1}`}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row lg:flex-col gap-2 lg:w-48">
                      {!review.isApproved && (
                        <Button
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => handleApprove(review._id)}
                          disabled={processingId === review._id}
                        >
                          {processingId === review._id ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin mr-2" />
                              Approving...
                            </>
                          ) : (
                            <>
                              <Check className="h-4 w-4 mr-2" />
                              Approve
                            </>
                          )}
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        className="text-red-600 hover:text-red-700"
                        onClick={() => handleDelete(review._id)}
                        disabled={processingId === review._id}
                      >
                        {processingId === review._id ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            Deleting...
                          </>
                        ) : (
                          <>
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </>
                        )}
                      </Button>
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

