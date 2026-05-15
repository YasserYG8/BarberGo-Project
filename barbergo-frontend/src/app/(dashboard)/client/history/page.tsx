"use client";

import { useCallback, useEffect, useState } from "react";
import { viewBookingInvoice, getMyBookings } from "@/lib/domain/bookings";
import { createReview } from "@/lib/domain/reviews";
import { useToast } from "@/components/ui/toaster";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/badge";
import { RowSkeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Calendar, MapPin, Eye, Star } from "lucide-react";
import type { Booking, ReviewRequest } from "@/types";

export default function ClientHistory() {
  const { toast } = useToast();
  
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  // Review state
  const [reviewingId, setReviewingId] = useState<number | null>(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  const fetchBookings = useCallback(async () => {
    try {
      const data = await getMyBookings();
      setBookings(data || []);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to load bookings";
      toast(message, "error");
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handleViewInvoice = async (bookingId: number) => {
    try {
      await viewBookingInvoice(bookingId);
      toast("Invoice opened", "success");
    } catch {
      toast("Failed to view invoice", "error");
    }
  };

  const submitReview = async (bookingId: number) => {
    setSubmittingReview(true);
    try {
      await createReview({
        bookingId,
        rating: reviewRating,
        comment: reviewComment || undefined,
      } satisfies ReviewRequest);
      toast("Review submitted! Thank you.", "success");
      setReviewingId(null);
      setReviewRating(5);
      setReviewComment("");
      fetchBookings();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to submit review";
      toast(message, "error");
    } finally {
      setSubmittingReview(false);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString(undefined, {
      weekday: "short", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
    });
  };

  const historyBookings = bookings.filter((booking) => ["DONE", "CANCELLED"].includes(booking.status));

  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h1 className="font-heading text-3xl font-bold text-stone-50">
          Booking <span className="text-gradient-gold">History</span>
        </h1>
        <p className="text-stone-400 mt-1">Review your past appointments and leave feedback.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Completed & Cancelled</CardTitle>
          <CardDescription>Your appointment history</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3"><RowSkeleton /><RowSkeleton /></div>
          ) : historyBookings.length === 0 ? (
            <p className="text-center py-6 text-stone-500">No past bookings found.</p>
          ) : (
            <div className="space-y-4">
              {historyBookings.map((booking) => (
                <div key={booking.id}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-stone-800 bg-stone-900/40">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <p className="font-heading font-bold text-lg text-stone-100">{booking.hairdresser?.user?.fullName || "Professional"}</p>
                        <StatusBadge status={booking.status} />
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm text-stone-400">
                        <span className="flex items-center gap-1"><Calendar className="size-3.5" />{formatDate(booking.bookingDate)}</span>
                        <span className="flex items-center gap-1"><MapPin className="size-3.5" />{booking.address}</span>
                      </div>
                    </div>

                    <div className="mt-4 sm:mt-0 sm:ml-6 flex flex-col items-end gap-2">
                      <p className="text-xl font-heading font-bold text-gradient-gold">{Number(booking.totalPrice).toFixed(2)} TND</p>
                      {booking.status === "DONE" && (
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleViewInvoice(booking.id)}>
                            <Eye className="size-3.5" /> View Invoice
                          </Button>
                          {!booking.review && (
                            <Button variant="secondary" size="sm" onClick={() => setReviewingId(reviewingId === booking.id ? null : booking.id)}>
                              <Star className="size-3.5" /> Review
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Inline Review */}
                  {reviewingId === booking.id && (
                    <div className="ml-4 mt-2 p-4 rounded-xl border border-stone-800 bg-stone-900 animate-scale-in">
                      <h4 className="text-sm font-semibold text-stone-300 mb-3">Leave a Review</h4>
                      <div className="flex items-center gap-1 mb-3">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button key={star} type="button" onClick={() => setReviewRating(star)} className="transition-transform hover:scale-110">
                            <Star className={`size-6 ${star <= reviewRating ? "text-amber-500 fill-amber-500" : "text-stone-600"}`} />
                          </button>
                        ))}
                        <span className="text-sm text-stone-400 ml-2">{reviewRating}/5</span>
                      </div>
                      <Input placeholder="Write a comment (optional)" value={reviewComment} onChange={(e) => setReviewComment(e.target.value)} className="mb-3" />
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => submitReview(booking.id)} disabled={submittingReview}>
                          {submittingReview ? "Submitting..." : "Submit Review"}
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => setReviewingId(null)}>Cancel</Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
