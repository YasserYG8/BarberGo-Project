"use client";

import { useCallback, useEffect, useState } from "react";
import { downloadBookingInvoice, viewBookingInvoice, getMyBookings, updateBookingStatus } from "@/lib/domain/bookings";
import { useAuthStore } from "@/store/useAuthStore";
import { useToast } from "@/components/ui/toaster";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { StatusBadge } from "@/components/ui/badge";
import { RowSkeleton } from "@/components/ui/skeleton";
import { Calendar, MapPin, Download, Eye, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Booking, BookingStatus } from "@/types";

const STATUS_FLOW: BookingStatus[] = [
  "PENDING", "CONFIRMED", "ON_WAY", "ARRIVED", "IN_PROGRESS", "DONE", "CANCELLED"
];

export default function HairdresserDashboard() {
  const { user } = useAuthStore();
  const { toast } = useToast();
  
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

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

  const updateStatus = async (bookingId: number, newStatus: BookingStatus) => {
    setUpdatingId(bookingId);
    try {
      await updateBookingStatus(bookingId, newStatus);
      toast("Status updated successfully", "success");
      await fetchBookings();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to update status";
      toast(message, "error");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDownloadInvoice = async (bookingId: number) => {
    try {
      await downloadBookingInvoice(bookingId);
      toast("Invoice downloaded", "success");
    } catch {
      toast("Failed to download invoice", "error");
    }
  };

  const handleViewInvoice = async (bookingId: number) => {
    try {
      await viewBookingInvoice(bookingId);
      toast("Invoice opened", "success");
    } catch {
      toast("Failed to view invoice", "error");
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString(undefined, {
      weekday: "short", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
    });
  };

  const activeBookings = bookings.filter((b) => !["DONE", "CANCELLED"].includes(b.status));
  const historyBookings = bookings.filter((b) => ["DONE", "CANCELLED"].includes(b.status));

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header */}
      <div>
        <h1 className="font-heading text-3xl font-bold text-stone-50">
          Professional <span className="text-gradient-gold">Dashboard</span>
        </h1>
        <p className="text-stone-400 mt-1">Welcome back, {user?.fullName}. Manage your business below.</p>
      </div>

      {/* Active Appointments */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings2 className="size-5 text-amber-500" />
            Active Appointments
          </CardTitle>
          <CardDescription>Manage ongoing and upcoming jobs</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              <RowSkeleton /><RowSkeleton /><RowSkeleton />
            </div>
          ) : activeBookings.length === 0 ? (
            <div className="text-center py-10 border border-dashed border-stone-700 rounded-xl">
              <Calendar className="size-8 text-stone-600 mx-auto mb-3" />
              <p className="text-stone-400 font-medium">No active appointments</p>
              <p className="text-stone-500 text-sm mt-1">New bookings will appear here when clients book your services.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {activeBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="p-4 rounded-xl border border-stone-800 bg-stone-800/30 hover:bg-stone-800/50 transition-colors"
                >
                  <div className="flex flex-col lg:flex-row justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <p className="font-heading font-bold text-lg text-stone-100">
                          {booking.client?.fullName || "Client"}
                        </p>
                        <StatusBadge status={booking.status} />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-stone-400">
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
                      <p className="text-lg font-heading font-bold text-gradient-gold mt-3">
                        {Number(booking.totalPrice).toFixed(2)} TND
                      </p>
                    </div>

                    {/* Status Updater */}
                    <div className="flex flex-col gap-2 lg:w-48 justify-center border-t lg:border-t-0 lg:border-l border-stone-800 pt-4 lg:pt-0 lg:pl-6">
                      <label className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
                        Update Status
                      </label>
                      <Select
                        disabled={updatingId === booking.id}
                        value={booking.status}
                        onValueChange={(val) => updateStatus(booking.id, val as BookingStatus)}
                      >
                        {STATUS_FLOW.map((s) => (
                          <option key={s} value={s}>
                            {s.replace("_", " ")}
                          </option>
                        ))}
                      </Select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* History */}
      {historyBookings.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent History</CardTitle>
            <CardDescription>Completed and cancelled appointments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {historyBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-stone-800/50 bg-stone-900/30"
                >
                  <div className="flex items-center gap-3">
                    <p className="font-medium text-stone-300">{booking.client?.fullName || "Client"}</p>
                    <StatusBadge status={booking.status} />
                    <span className="text-sm text-stone-500">{formatDate(booking.bookingDate)}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-2 sm:mt-0">
                    <span className="font-semibold text-stone-300">{Number(booking.totalPrice).toFixed(2)} TND</span>
                    {booking.status === "DONE" && (
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleViewInvoice(booking.id)}>
                          <Eye className="size-3.5" /> View
                        </Button>
                        <Button variant="secondary" size="sm" onClick={() => handleDownloadInvoice(booking.id)}>
                          <Download className="size-3.5" /> Download
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
