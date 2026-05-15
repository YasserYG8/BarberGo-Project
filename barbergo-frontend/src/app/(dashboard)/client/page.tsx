"use client";

import { useCallback, useEffect, useState } from "react";
import { cancelBookingAsClient, getMyBookings } from "@/lib/domain/bookings";
import { useAuthStore } from "@/store/useAuthStore";
import { useToast } from "@/components/ui/toaster";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/badge";
import { RowSkeleton } from "@/components/ui/skeleton";
import { Calendar, MapPin, Search, XCircle } from "lucide-react";
import type { Booking } from "@/types";
import { useRouter } from "next/navigation";

export default function ClientDashboard() {
  const { user } = useAuthStore();
  const { toast } = useToast();
  const router = useRouter();
  
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelConfirmId, setCancelConfirmId] = useState<number | null>(null);

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

  const cancelBooking = async () => {
    if (!cancelConfirmId) return;
    try {
      await cancelBookingAsClient(cancelConfirmId);
      toast("Booking cancelled successfully", "success");
      fetchBookings();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to cancel booking";
      toast(message, "error");
    } finally {
      setCancelConfirmId(null);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString(undefined, {
      weekday: "short", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
    });
  };

  const activeBookings = bookings.filter((booking) => !["DONE", "CANCELLED"].includes(booking.status));

  return (
    <>
      {cancelConfirmId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-stone-900 border border-stone-800 rounded-xl shadow-2xl p-6 w-full max-w-sm animate-in zoom-in-95 duration-200">
            <h3 className="text-lg font-bold text-stone-100 mb-2">Cancel Booking</h3>
            <p className="text-stone-400 text-sm mb-6">Are you sure you want to cancel this booking? This action cannot be undone.</p>
            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={() => setCancelConfirmId(null)}>Keep Booking</Button>
              <Button variant="destructive" onClick={cancelBooking}>Yes, Cancel</Button>
            </div>
          </div>
        </div>
      )}
      <div className="space-y-6 animate-slide-up">
        {/* Header */}
        <div>
          <h1 className="font-heading text-3xl font-bold text-stone-50">
            Welcome back, <span className="text-gradient-gold">{user?.fullName}</span>
          </h1>
          <p className="text-stone-400 mt-1">Manage your upcoming appointments and see your overview.</p>
        </div>

        {/* Active Bookings */}
        <Card>
          <CardHeader>
            <CardTitle>Active Bookings</CardTitle>
            <CardDescription>Upcoming and in-progress appointments</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                <RowSkeleton /><RowSkeleton /><RowSkeleton />
              </div>
            ) : activeBookings.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-stone-700 rounded-xl">
                <Search className="size-8 text-stone-600 mx-auto mb-3" />
                <p className="text-stone-400 font-medium">No active bookings</p>
                <p className="text-stone-500 text-sm mt-1">Find a professional and schedule your next appointment.</p>
                <Button className="mt-4" onClick={() => router.push("/client/book")}>
                  Find a Barber
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {activeBookings.map((booking) => (
                  <div key={booking.id}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-stone-800 bg-stone-800/30 hover:bg-stone-800/50 transition-colors">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <p className="font-heading font-bold text-lg text-stone-100">
                            {booking.hairdresser?.user?.fullName || "Professional"}
                          </p>
                          <StatusBadge status={booking.status} />
                        </div>
                        <div className="flex flex-wrap gap-4 text-sm text-stone-400">
                          <span className="flex items-center gap-1">
                            <Calendar className="size-3.5" />
                            {formatDate(booking.bookingDate)}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="size-3.5" />
                            {booking.address}
                          </span>
                        </div>
                        {booking.bookingServices && booking.bookingServices.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {booking.bookingServices.map((bs) => (
                              <span key={bs.id} className="text-xs px-2 py-0.5 rounded-full bg-stone-800 text-stone-400 border border-stone-700">
                                {bs.service?.name}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="mt-4 sm:mt-0 sm:ml-6 flex flex-col items-end gap-2">
                        <p className="text-xl font-heading font-bold text-gradient-gold">
                          {Number(booking.totalPrice).toFixed(2)} TND
                        </p>
                        {booking.status === "PENDING" && (
                          <Button variant="destructive" size="sm" onClick={() => setCancelConfirmId(booking.id)}>
                            <XCircle className="size-3.5" /> Cancel
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
