"use client";

import { useCallback, useEffect, useState } from "react";
import { getAdminBookings, getAdminDashboardStats } from "@/lib/domain/admin";
import { useAuthStore } from "@/store/useAuthStore";
import { useToast } from "@/components/ui/toaster";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StatSkeleton } from "@/components/ui/skeleton";
import { Users, CalendarCheck, DollarSign } from "lucide-react";
import type { Booking, DashboardStats } from "@/types";

export default function AdminDashboard() {
  const { user } = useAuthStore();
  const { toast } = useToast();

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const loadDashboardData = useCallback(async () => {
    try {
      const [statsRes, bookingsRes] = await Promise.allSettled([
        getAdminDashboardStats(),
        getAdminBookings(),
      ]);

      if (statsRes.status === "fulfilled") setStats(statsRes.value);
      if (bookingsRes.status === "fulfilled") setBookings(bookingsRes.value || []);
    } catch {
      toast("Failed to load dashboard data", "error");
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  const statCards = [
    { label: "Total Users", value: stats?.totalUsers ?? "—", icon: Users, color: "text-blue-400" },
    { label: "Total Bookings", value: stats?.totalBookings ?? "—", icon: CalendarCheck, color: "text-emerald-400" },
    { label: "Total Sales", value: stats?.totalSales != null ? `${(stats.totalSales as number).toFixed(2)} TND` : "—", icon: DollarSign, color: "text-violet-400" },
    { label: "Platform Profit", value: stats?.totalRevenue != null ? `${stats.totalRevenue.toFixed(2)} TND` : "—", icon: DollarSign, color: "text-amber-400" },
  ];

  // Profit Chart Data
  const doneBookings = bookings.filter((b) => b.status === "DONE");
  const profitByDate = doneBookings.reduce((acc, booking) => {
    const date = new Date(booking.bookingDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    acc[date] = (acc[date] || 0) + (booking.totalPrice * 0.10);
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.entries(profitByDate)
    .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime())
    .map(([date, profit]) => ({ date, profit }));
  
  const maxProfit = Math.max(...chartData.map((d) => d.profit), 10);

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header */}
      <div>
        <h1 className="font-heading text-3xl font-bold text-stone-50">
          Admin <span className="text-gradient-gold">Overview</span>
        </h1>
        <p className="text-stone-400 mt-1">Welcome, {user?.fullName}. Here&apos;s your platform overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {loading
          ? Array(4).fill(0).map((_, i) => <StatSkeleton key={i} />)
          : statCards.map((stat) => (
              <Card key={stat.label} className="hover:border-stone-700 transition-colors">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
                      {stat.label}
                    </span>
                    <stat.icon className={`size-5 ${stat.color}`} />
                  </div>
                  <p className="text-2xl font-heading font-bold text-stone-100">{stat.value}</p>
                </CardContent>
              </Card>
            ))}
      </div>

      {/* Profit Chart */}
      {chartData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="size-5 text-amber-500" />
              Platform Profit Over Time
            </CardTitle>
            <CardDescription>Daily commission earned (10% per booking)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-2 h-56 w-full overflow-x-auto pb-6 pt-8">
              {chartData.map((data, i) => (
                <div key={i} className="flex flex-col items-center justify-end h-full min-w-[40px] group flex-1 relative">
                  <div 
                    className="w-full bg-gradient-to-t from-amber-500/10 to-amber-500/40 hover:to-amber-400/60 border border-amber-500/40 rounded-t-md transition-all relative"
                    style={{ height: `${(data.profit / maxProfit) * 100}%`, minHeight: '4px' }}
                  >
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-stone-800 text-stone-200 text-xs px-2 py-1 rounded shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10 border border-stone-700">
                      {data.profit.toFixed(2)} TND
                    </div>
                  </div>
                  <span className="text-[10px] text-stone-500 absolute -bottom-5 w-full text-center truncate">
                    {data.date}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
