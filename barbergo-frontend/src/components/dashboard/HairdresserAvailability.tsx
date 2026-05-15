"use client";

import { useCallback, useEffect, useState } from "react";
import { fetchAPI } from "@/lib/api";
import { useToast } from "@/components/ui/toaster";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { RowSkeleton } from "@/components/ui/skeleton";
import { Plus, X, Calendar } from "lucide-react";
import type { Availability, DayOfWeek } from "@/types";

const DAYS: { value: DayOfWeek; label: string; short: string }[] = [
  { value: "MONDAY", label: "Monday", short: "Mon" },
  { value: "TUESDAY", label: "Tuesday", short: "Tue" },
  { value: "WEDNESDAY", label: "Wednesday", short: "Wed" },
  { value: "THURSDAY", label: "Thursday", short: "Thu" },
  { value: "FRIDAY", label: "Friday", short: "Fri" },
  { value: "SATURDAY", label: "Saturday", short: "Sat" },
  { value: "SUNDAY", label: "Sunday", short: "Sun" },
];

export function HairdresserAvailability() {
  const { toast } = useToast();
  const [availabilities, setAvailabilities] = useState<Availability[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  const [newAvailability, setNewAvailability] = useState({
    dayOfWeek: "MONDAY" as DayOfWeek,
    startTime: "09:00",
    endTime: "17:00",
  });

  const fetchMyAvailabilities = useCallback(async () => {
    try {
      const meRes = await fetchAPI<{ id: number }>("/hairdressers/me");
      if (meRes?.id) {
        const data = await fetchAPI<Availability[]>(`/hairdressers/${meRes.id}/availabilities`);
        setAvailabilities(data || []);
      }
    } catch {
      toast("Failed to load availability", "error");
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchMyAvailabilities();
  }, [fetchMyAvailabilities]);

  const handleAddAvailability = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await fetchAPI("/availabilities", {
        method: "POST",
        body: JSON.stringify({
          dayOfWeek: newAvailability.dayOfWeek,
          startTime: newAvailability.startTime + ":00", 
          endTime: newAvailability.endTime + ":00",
        }),
      });
      toast("Availability added!", "success");
      setNewAvailability((prev) => ({ ...prev, startTime: "09:00", endTime: "17:00" }));
      fetchMyAvailabilities();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to add availability";
      toast(message, "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteAvailability = async () => {
    if (!deleteConfirmId) return;
    try {
      await fetchAPI(`/availabilities/${deleteConfirmId}`, { method: "DELETE" });
      toast("Slot removed", "success");
      fetchMyAvailabilities();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to remove slot";
      toast(message, "error");
    } finally {
      setDeleteConfirmId(null);
    }
  };

  return (
    <>
      {deleteConfirmId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-stone-900 border border-stone-800 rounded-xl shadow-2xl p-6 w-full max-w-sm animate-in zoom-in-95 duration-200">
            <h3 className="text-lg font-bold text-stone-100 mb-2">Remove Time Slot</h3>
            <p className="text-stone-400 text-sm mb-6">Are you sure you want to remove this availability slot?</p>
            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={() => setDeleteConfirmId(null)}>Cancel</Button>
              <Button variant="destructive" onClick={handleDeleteAvailability}>Remove</Button>
            </div>
          </div>
        </div>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-slide-up">
      <div className="lg:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Plus className="size-5 text-amber-500" />
              Add Time Slot
            </CardTitle>
            <CardDescription>Set a new working shift</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddAvailability} className="space-y-4">
              <div className="space-y-2">
                <Label>Day of Week</Label>
                <Select
                  value={newAvailability.dayOfWeek}
                  onValueChange={(val) =>
                    setNewAvailability({ ...newAvailability, dayOfWeek: val as DayOfWeek })
                  }
                >
                  {DAYS.map((day) => (
                    <option key={day.value} value={day.value}>
                      {day.label}
                    </option>
                  ))}
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Start Time</Label>
                  <Input
                    required
                    type="time"
                    value={newAvailability.startTime}
                    onChange={(e) =>
                      setNewAvailability({ ...newAvailability, startTime: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>End Time</Label>
                  <Input
                    required
                    type="time"
                    value={newAvailability.endTime}
                    onChange={(e) =>
                      setNewAvailability({ ...newAvailability, endTime: e.target.value })
                    }
                  />
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? "Adding..." : "Add Slot"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-2">
        {loading ? (
          <div className="space-y-3">
            <RowSkeleton /><RowSkeleton /><RowSkeleton />
          </div>
        ) : availabilities.length === 0 ? (
          <Card>
            <CardContent className="py-10 text-center">
              <Calendar className="size-8 text-stone-600 mx-auto mb-3" />
              <p className="text-stone-400 font-medium">No working hours set</p>
              <p className="text-stone-500 text-sm mt-1">Add time slots to let clients know when you&apos;re available.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {DAYS.map((day) => {
              const slots = availabilities.filter((a) => a.dayOfWeek === day.value);
              if (slots.length === 0) return null;

              return (
                <Card key={day.value} className="hover:border-stone-700 transition-colors">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <span className="size-2 rounded-full bg-amber-500" />
                      {day.label}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {slots.map((slot) => (
                      <div
                        key={slot.id}
                        className="flex justify-between items-center bg-stone-800/50 border border-stone-700/50 p-2.5 rounded-lg text-sm"
                      >
                        <span className="text-stone-300">
                          {slot.startTime?.substring(0, 5)} — {slot.endTime?.substring(0, 5)}
                        </span>
                        <button
                          onClick={() => setDeleteConfirmId(slot.id)}
                          className="p-1 rounded hover:bg-red-500/10 text-stone-500 hover:text-red-400 transition-colors"
                        >
                          <X className="size-4" />
                        </button>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
    </>
  );
}
