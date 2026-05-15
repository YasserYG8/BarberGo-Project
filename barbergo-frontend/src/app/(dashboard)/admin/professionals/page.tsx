"use client";

import { useCallback, useEffect, useState } from "react";
import { getAdminHairdressers, setHairdresserValidation } from "@/lib/domain/admin";
import { useToast } from "@/components/ui/toaster";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RowSkeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { ShieldCheck, ShieldX, Search } from "lucide-react";
import type { Hairdresser } from "@/types";

export default function AdminProfessionals() {
  const { toast } = useToast();
  const [hairdressers, setHairdressers] = useState<Hairdresser[]>([]);
  const [loading, setLoading] = useState(true);
  const [validatingId, setValidatingId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const loadData = useCallback(async () => {
    try {
      const res = await getAdminHairdressers();
      setHairdressers(res || []);
    } catch {
      toast("Failed to load professionals", "error");
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const toggleValidation = async (hairdresserId: number, validate: boolean) => {
    setValidatingId(hairdresserId);
    try {
      await setHairdresserValidation(hairdresserId, validate);
      toast(validate ? "Hairdresser approved!" : "Hairdresser rejected", validate ? "success" : "info");
      loadData();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to update validation";
      toast(message, "error");
    } finally {
      setValidatingId(null);
    }
  };

  const filteredHairdressers = hairdressers.filter((h) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    const name = h.user?.fullName?.toLowerCase() || "";
    const email = h.user?.email?.toLowerCase() || "";
    const specialty = h.specialty?.toLowerCase() || "";
    return name.includes(term) || email.includes(term) || specialty.includes(term);
  });

  const pendingHairdressers = filteredHairdressers.filter((h) => !h.validatedByAdmin);

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold text-stone-50">
            Professionals <span className="text-gradient-gold">Management</span>
          </h1>
          <p className="text-stone-400 mt-1">Approve and manage hairdressers on the platform.</p>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-stone-500" />
          <Input 
            placeholder="Search professionals..." 
            className="pl-9 bg-stone-900 border-stone-800"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Pending Validations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldCheck className="size-5 text-amber-500" />
            Pending Approvals
          </CardTitle>
          <CardDescription>
            Hairdressers waiting for admin validation ({pendingHairdressers.length})
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3"><RowSkeleton /><RowSkeleton /></div>
          ) : pendingHairdressers.length === 0 ? (
            <div className="text-center py-8 border border-dashed border-stone-700 rounded-xl">
              <ShieldCheck className="size-8 text-stone-600 mx-auto mb-3" />
              <p className="text-stone-400 font-medium">All caught up!</p>
              <p className="text-stone-500 text-sm mt-1">No pending approvals at this time.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingHairdressers.map((h) => (
                <div
                  key={h.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-amber-600/20 bg-amber-600/5"
                >
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-full bg-amber-600/10 border border-amber-600/20 flex items-center justify-center">
                      <span className="text-sm font-bold text-amber-400">
                        {h.user?.fullName?.charAt(0) || "?"}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-stone-100">{h.user?.fullName}</p>
                      <p className="text-sm text-stone-500">{h.user?.email} • {h.specialty || "General"}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-3 sm:mt-0">
                    <Button
                      size="sm"
                      onClick={() => toggleValidation(h.id, true)}
                      disabled={validatingId === h.id}
                    >
                      <ShieldCheck className="size-3.5" />
                      Approve
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => toggleValidation(h.id, false)}
                      disabled={validatingId === h.id}
                    >
                      <ShieldX className="size-3.5" />
                      Reject
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* All Hairdressers */}
      <Card>
        <CardHeader>
          <CardTitle>All Professionals</CardTitle>
          <CardDescription>
            {searchTerm ? `Found ${filteredHairdressers.length} professionals` : `${hairdressers.length} registered hairdressers`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3"><RowSkeleton /><RowSkeleton /><RowSkeleton /></div>
          ) : filteredHairdressers.length === 0 ? (
            <p className="text-center py-6 text-stone-500">No hairdressers found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-stone-800 text-stone-500 uppercase text-xs tracking-wider">
                    <th className="text-left py-3 px-4">Name</th>
                    <th className="text-left py-3 px-4">Email</th>
                    <th className="text-left py-3 px-4">Specialty</th>
                    <th className="text-center py-3 px-4">Rating</th>
                    <th className="text-center py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredHairdressers.map((h) => (
                    <tr key={h.id} className="border-b border-stone-800/50 hover:bg-stone-800/20 transition-colors">
                      <td className="py-3 px-4 font-medium text-stone-200">{h.user?.fullName}</td>
                      <td className="py-3 px-4 text-stone-400">{h.user?.email}</td>
                      <td className="py-3 px-4 text-stone-400">{h.specialty || "—"}</td>
                      <td className="py-3 px-4 text-center text-stone-300">
                        {h.averageRating?.toFixed(1) || "—"}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${
                            h.validatedByAdmin
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                              : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                          }`}
                        >
                          {h.validatedByAdmin ? "Approved" : "Pending"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
