"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Star, Upload, X, Loader2, MessageSquare, Edit, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface Review {
  _id: string;
  userId: {
    _id: string;
    fullName: string;
    email: string;
  };
  rating: number;
  title?: string;
  comment: string;
  images?: string[];
  createdAt: string;
}

interface ProductReviewsProps {
  productId: string;
}

export function ProductReviews({ productId }: ProductReviewsProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [allReviews, setAllReviews] = useState<Review[]>([]); // Store all reviews for stats
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const [reviewForm, setReviewForm] = useState({
    rating: 0,
    title: '',
    comment: '',
    images: [] as string[],
  });

  const [hoveredStar, setHoveredStar] = useState(0);
  const [previewImages, setPreviewImages] = useState<string[]>([]);

  useEffect(() => {
    fetchAllReviews();
  }, [productId, user?._id]);

  useEffect(() => {
    fetchReviews();
  }, [productId, selectedRating, user?._id]);

  const fetchAllReviews = async () => {
    try {
      const res = await fetch(`/api/reviews?productId=${productId}`);
      if (res.ok) {
        const data = await res.json();
        // Sort reviews: user's own review first, then by date (newest first)
        const sorted = (data || []).sort((a: Review, b: Review) => {
          const aIsOwn = user && a.userId?._id?.toString() === user._id?.toString();
          const bIsOwn = user && b.userId?._id?.toString() === user._id?.toString();
          
          if (aIsOwn && !bIsOwn) return -1;
          if (!aIsOwn && bIsOwn) return 1;
          
          // If both are own or both are not, sort by date (newest first)
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
        setAllReviews(sorted);
      }
    } catch (error) {
      console.error('Failed to fetch all reviews:', error);
    }
  };

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const url = selectedRating 
        ? `/api/reviews?productId=${productId}&rating=${selectedRating}`
        : `/api/reviews?productId=${productId}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        // Sort reviews: user's own review first, then by date (newest first)
        const sorted = (data || []).sort((a: Review, b: Review) => {
          const aIsOwn = user && a.userId?._id?.toString() === user._id?.toString();
          const bIsOwn = user && b.userId?._id?.toString() === user._id?.toString();
          
          if (aIsOwn && !bIsOwn) return -1;
          if (!aIsOwn && bIsOwn) return 1;
          
          // If both are own or both are not, sort by date (newest first)
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
        setReviews(sorted);
      }
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        try {
          const fd = new FormData();
          fd.append('file', file);
          const res = await fetch('/api/upload', { method: 'POST', body: fd });
          
          if (!res.ok) {
            const errorData = await res.json().catch(() => ({ error: 'Upload failed' }));
            throw new Error(errorData.error || `Failed to upload ${file.name}`);
          }
          
          const data = await res.json();
          if (!data.url) {
            throw new Error(`No URL returned for ${file.name}`);
          }
          return data.url as string;
        } catch (error: any) {
          console.error(`Error uploading ${file.name}:`, error);
          toast({ 
            title: `Failed to upload ${file.name}`, 
            description: error.message || 'Upload failed',
            variant: 'destructive' 
          });
          return null;
        }
      });
      
      const uploadedUrls = await Promise.all(uploadPromises);
      const validUrls = uploadedUrls.filter((url): url is string => !!url);

      if (validUrls.length > 0) {
        setReviewForm(prev => ({
          ...prev,
          images: [...prev.images, ...validUrls],
        }));
        setPreviewImages(prev => [...prev, ...validUrls]);
        toast({ title: `${validUrls.length} image(s) uploaded successfully!` });
      }
    } catch (error: any) {
      console.error('Upload error:', error);
      toast({ 
        title: 'Error uploading images', 
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive' 
      });
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const removeImage = (index: number) => {
    setReviewForm(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
    setPreviewImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: 'Please login',
        description: 'You need to login to submit a review',
        variant: 'destructive',
      });
      return;
    }

    if (reviewForm.rating === 0) {
      toast({
        title: 'Rating required',
        description: 'Please select a rating',
        variant: 'destructive',
      });
      return;
    }

    if (!reviewForm.comment.trim()) {
      toast({
        title: 'Comment required',
        description: 'Please write a review comment',
        variant: 'destructive',
      });
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          rating: reviewForm.rating,
          title: reviewForm.title,
          comment: reviewForm.comment,
          images: reviewForm.images,
        }),
      });

      if (res.ok) {
        toast({ title: 'Review submitted successfully!' });
        setIsReviewDialogOpen(false);
        setReviewForm({ rating: 0, title: '', comment: '', images: [] });
        setPreviewImages([]);
        fetchAllReviews();
        fetchReviews();
      } else {
        const errorData = await res.json();
        toast({
          title: 'Failed to submit review',
          description: errorData.error || 'Please try again',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to submit review',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditReview = (review: Review) => {
    setEditingReview(review);
    setReviewForm({
      rating: review.rating,
      title: review.title || '',
      comment: review.comment,
      images: review.images || [],
    });
    setPreviewImages(review.images || []);
    setIsEditDialogOpen(true);
  };

  const handleUpdateReview = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingReview) return;

    if (reviewForm.rating === 0) {
      toast({
        title: 'Rating required',
        description: 'Please select a rating',
        variant: 'destructive',
      });
      return;
    }

    if (!reviewForm.comment.trim()) {
      toast({
        title: 'Comment required',
        description: 'Please write a review comment',
        variant: 'destructive',
      });
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`/api/reviews/${editingReview._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rating: reviewForm.rating,
          title: reviewForm.title,
          comment: reviewForm.comment,
          images: reviewForm.images,
        }),
      });

      if (res.ok) {
        toast({ title: 'Review updated successfully!' });
        setIsEditDialogOpen(false);
        setEditingReview(null);
        setReviewForm({ rating: 0, title: '', comment: '', images: [] });
        setPreviewImages([]);
        fetchAllReviews();
        fetchReviews();
      } else {
        const errorData = await res.json();
        toast({
          title: 'Failed to update review',
          description: errorData.error || 'Please try again',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update review',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm('Are you sure you want to delete this review? This action cannot be undone.')) {
      return;
    }

    setDeleting(reviewId);
    try {
      const res = await fetch(`/api/reviews/${reviewId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        toast({ title: 'Review deleted successfully!' });
        fetchAllReviews();
        fetchReviews();
      } else {
        const errorData = await res.json();
        toast({
          title: 'Failed to delete review',
          description: errorData.error || 'Please try again',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete review',
        variant: 'destructive',
      });
    } finally {
      setDeleting(null);
    }
  };

  const averageRating = allReviews.length > 0
    ? allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length
    : 0;

  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: allReviews.filter(r => r.rating === rating).length,
    percentage: allReviews.length > 0 
      ? (allReviews.filter(r => r.rating === rating).length / allReviews.length) * 100 
      : 0,
  }));

  const displayedReviews = showAll ? reviews : reviews.slice(0, 5);

  return (
    <Card className="mt-8">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl mb-2">Customer Reviews</CardTitle>
            {allReviews.length > 0 && (
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-5 w-5 ${
                        star <= Math.round(averageRating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-lg font-semibold ml-2">
                  {averageRating.toFixed(1)} ({allReviews.length} {allReviews.length === 1 ? 'review' : 'reviews'})
                </span>
              </div>
            )}
          </div>
          {user && (
            <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-green-600 hover:bg-green-700">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Write a Review
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Write a Review</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmitReview} className="space-y-4">
                  <div>
                    <Label>Rating *</Label>
                    <div className="flex items-center gap-2 mt-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                          onMouseEnter={() => setHoveredStar(star)}
                          onMouseLeave={() => setHoveredStar(0)}
                          className="focus:outline-none"
                        >
                          <Star
                            className={`h-8 w-8 transition-colors ${
                              star <= (hoveredStar || reviewForm.rating)
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        </button>
                      ))}
                      {reviewForm.rating > 0 && (
                        <span className="ml-2 text-sm text-gray-600">
                          {reviewForm.rating} {reviewForm.rating === 1 ? 'star' : 'stars'}
                        </span>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="review-title">Title (Optional)</Label>
                    <Input
                      id="review-title"
                      value={reviewForm.title}
                      onChange={(e) => setReviewForm({ ...reviewForm, title: e.target.value })}
                      placeholder="Give your review a title"
                    />
                  </div>

                  <div>
                    <Label htmlFor="review-comment">Review *</Label>
                    <Textarea
                      id="review-comment"
                      required
                      value={reviewForm.comment}
                      onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                      placeholder="Share your experience with this product..."
                      rows={5}
                    />
                  </div>

                  <div>
                    <Label>Upload Images (Optional)</Label>
                    <div className="mt-2 space-y-3">
                      <label className="flex items-center justify-center w-full px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-green-500 transition-colors">
                        {uploading ? (
                          <div className="flex items-center gap-2">
                            <Loader2 className="h-5 w-5 animate-spin" />
                            <span>Uploading...</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <Upload className="h-5 w-5" />
                            <span>Upload Images</span>
                          </div>
                        )}
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          disabled={uploading}
                        />
                      </label>
                      {previewImages.length > 0 && (
                        <div className="flex flex-wrap gap-3">
                          {previewImages.map((img, index) => (
                            <div key={index} className="relative group">
                              <img
                                src={img}
                                alt={`Review ${index + 1}`}
                                className="w-24 h-24 object-cover rounded-lg border-2 border-gray-200"
                              />
                              <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsReviewDialogOpen(false);
                        setReviewForm({ rating: 0, title: '', comment: '', images: [] });
                        setPreviewImages([]);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" className="bg-green-600 hover:bg-green-700" disabled={submitting}>
                      {submitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        'Submit Review'
                      )}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-8">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-green-600" />
            <p className="mt-2 text-gray-600">Loading reviews...</p>
          </div>
        ) : allReviews.length === 0 ? (
            <div className="text-center py-8">
              <MessageSquare className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-lg text-gray-600 mb-4">No reviews yet</p>
              {user ? (
                <Button
                  onClick={() => setIsReviewDialogOpen(true)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Be the first to review
                </Button>
              ) : (
                <p className="text-sm text-gray-500">Login to write a review</p>
              )}
            </div>
        ) : reviews.length === 0 ? (
            <div className="text-center py-8">
              <MessageSquare className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-lg text-gray-600 mb-4">No reviews found for this filter</p>
              <Button
                variant="outline"
                onClick={() => setSelectedRating(null)}
                className="border-green-600 text-green-600 hover:bg-green-50"
              >
                Show All Reviews
              </Button>
            </div>
        ) : (
          <>
            {/* Rating Filter */}
            <div className="mb-6 pb-6 border-b">
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={selectedRating === null ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedRating(null)}
                >
                  All ({allReviews.length})
                </Button>
                {ratingDistribution.map(({ rating, count }) => (
                  <Button
                    key={rating}
                    variant={selectedRating === rating ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedRating(rating)}
                  >
                    {rating} Star{rating !== 1 ? 's' : ''} ({count})
                  </Button>
                ))}
              </div>
            </div>

            {/* Reviews List */}
            <div className="space-y-6">
              {displayedReviews.map((review) => {
                const isOwnReview = user && review.userId?._id?.toString() === user._id?.toString();
                return (
                  <div key={review._id} className="border-b pb-6 last:border-0">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-semibold">{review.userId?.fullName || 'Anonymous'}</p>
                          <div className="flex items-center">
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
                          </div>
                        </div>
                        {review.title && (
                          <p className="font-medium text-gray-900 mb-1">{review.title}</p>
                        )}
                        <p className="text-sm text-gray-500">
                          {new Date(review.createdAt).toLocaleDateString('en-IN', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </p>
                      </div>
                      {isOwnReview && (
                        <div className="flex items-center gap-2 ml-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditReview(review)}
                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteReview(review._id)}
                            disabled={deleting === review._id}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            {deleting === review._id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      )}
                    </div>
                    <p className="text-gray-700 mb-3 whitespace-pre-wrap">{review.comment}</p>
                    {review.images && review.images.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {review.images.map((img, idx) => (
                          <div key={idx} className="relative w-24 h-24">
                            <Image
                              src={img}
                              alt={`Review image ${idx + 1}`}
                              fill
                              className="object-cover rounded-lg border border-gray-200"
                              unoptimized
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Show More/Less Button */}
            {reviews.length > 5 && (
              <div className="mt-6 text-center">
                <Button
                  variant="outline"
                  onClick={() => setShowAll(!showAll)}
                  className="border-green-600 text-green-600 hover:bg-green-50"
                >
                  {showAll ? 'Show Less' : `Show All Reviews (${reviews.length})`}
                </Button>
              </div>
            )}
          </>
        )}

        {/* Edit Review Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Your Review</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleUpdateReview} className="space-y-4">
              <div>
                <Label>Rating *</Label>
                <div className="flex items-center gap-2 mt-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                      onMouseEnter={() => setHoveredStar(star)}
                      onMouseLeave={() => setHoveredStar(0)}
                      className="focus:outline-none"
                    >
                      <Star
                        className={`h-8 w-8 transition-colors ${
                          star <= (hoveredStar || reviewForm.rating)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                  {reviewForm.rating > 0 && (
                    <span className="ml-2 text-sm text-gray-600">
                      {reviewForm.rating} {reviewForm.rating === 1 ? 'star' : 'stars'}
                    </span>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="edit-review-title">Title (Optional)</Label>
                <Input
                  id="edit-review-title"
                  value={reviewForm.title}
                  onChange={(e) => setReviewForm({ ...reviewForm, title: e.target.value })}
                  placeholder="Give your review a title"
                />
              </div>

              <div>
                <Label htmlFor="edit-review-comment">Review *</Label>
                <Textarea
                  id="edit-review-comment"
                  required
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                  placeholder="Share your experience with this product..."
                  rows={5}
                />
              </div>

              <div>
                <Label>Upload Images (Optional)</Label>
                <div className="mt-2 space-y-3">
                  <label className="flex items-center justify-center w-full px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-green-500 transition-colors">
                    {uploading ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span>Uploading...</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Upload className="h-5 w-5" />
                        <span>Upload Images</span>
                      </div>
                    )}
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={uploading}
                    />
                  </label>
                  {previewImages.length > 0 && (
                    <div className="flex flex-wrap gap-3">
                      {previewImages.map((img, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={img}
                            alt={`Review ${index + 1}`}
                            className="w-24 h-24 object-cover rounded-lg border-2 border-gray-200"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsEditDialogOpen(false);
                    setEditingReview(null);
                    setReviewForm({ rating: 0, title: '', comment: '', images: [] });
                    setPreviewImages([]);
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-green-600 hover:bg-green-700" disabled={submitting}>
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    'Update Review'
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}

