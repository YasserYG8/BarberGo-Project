"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/dashboard/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, user } = useAuthStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isAuthenticated) {
      router.push("/login");
    }
  }, [mounted, isAuthenticated, router]);

  // Prevent hydration mismatch
  if (!mounted) return null;

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="relative flex min-h-screen bg-stone-950 overflow-hidden pt-20">
      <div className="soft-grid pointer-events-none absolute inset-0 opacity-20" />
      <div className="absolute left-0 top-20 h-72 w-72 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
      
      <Sidebar />
      
      <div className="flex-1 w-full transition-all duration-300 min-w-0">
        <main className="w-full max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}
