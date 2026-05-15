"use client";

import { useCallback, useEffect, useState } from "react";
import { getAdminBookings } from "@/lib/domain/admin";
import { useToast } from "@/components/ui/toaster";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/badge";
import { RowSkeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Calendar, MapPin, Search } from "lucide-react";
import type { Booking } from "@/types";

export default function AdminBookings() {
  const { toast } = useToast();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const loadData = useCallback(async () => {
    try {
      const res = await getAdminBookings();
      setBookings(res || []);
    } catch {
      toast("Failed to load bookings", "error");
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString(undefined, {
      month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
    });
  };

  const filteredBookings = bookings.filter((booking) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    const clientName = booking.client?.fullName?.toLowerCase() || "";
    const proName = booking.hairdresser?.user?.fullName?.toLowerCase() || "";
    const address = booking.address?.toLowerCase() || "";
    return clientName.includes(term) || proName.includes(term) || address.includes(term);
  });

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold text-stone-50">
            Platform <span className="text-gradient-gold">Bookings</span>
          </h1>
          <p className="text-stone-400 mt-1">View all recent booking history across the platform.</p>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-stone-500" />
          <Input 
            placeholder="Search by name or address..." 
            className="pl-9 bg-stone-900 border-stone-800"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Bookings</CardTitle>
          <CardDescription>
            {searchTerm ? `Found ${filteredBookings.length} results` : `Total of ${bookings.length} bookings recorded`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3"><RowSkeleton /><RowSkeleton /><RowSkeleton /></div>
          ) : filteredBookings.length === 0 ? (
            <p className="text-center py-6 text-stone-500">No bookings found.</p>
          ) : (
            <div className="space-y-3">
              {filteredBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-stone-800/50 bg-stone-800/20 hover:bg-stone-800/40 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-sm">
                      <p className="text-stone-200 font-medium">
                        {booking.client?.fullName || "Client"} → {booking.hairdresser?.user?.fullName || "Barber"}
                      </p>
                      <div className="flex items-center gap-3 text-stone-500 text-xs mt-1">
                        <span className="flex items-center gap-1 bg-stone-900/50 px-2 py-0.5 rounded-md border border-stone-800">
                          <Calendar className="size-3" />
                          {formatDate(booking.bookingDate)}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="size-3" />
                          {booking.address}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 mt-3 sm:mt-0 bg-stone-900/80 px-3 py-1.5 rounded-lg border border-stone-800">
                    <div className="flex flex-col items-end">
                      <span className="text-xs text-stone-500 uppercase tracking-wider">Total</span>
                      <span className="text-sm font-semibold text-stone-200">
                        {Number(booking.totalPrice).toFixed(2)} TND
                      </span>
                    </div>
                    <div className="h-8 w-px bg-stone-800 mx-2"></div>
                    <StatusBadge status={booking.status} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
