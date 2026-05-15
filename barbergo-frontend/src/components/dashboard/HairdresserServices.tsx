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
import { Plus, Trash2, Clock, DollarSign, Edit } from "lucide-react";
import type { Service, GenderTarget } from "@/types";

export function HairdresserServices() {
  const { toast } = useToast();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  const [formState, setFormState] = useState({
    id: null as number | null,
    name: "",
    price: "",
    durationMinutes: "",
    genderTarget: "BOTH" as GenderTarget,
  });

  const [submitting, setSubmitting] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  const fetchMyServices = useCallback(async () => {
    try {
      const meRes = await fetchAPI<{ id: number }>("/hairdressers/me");
      if (meRes?.id) {
        const servicesData = await fetchAPI<Service[]>(`/hairdressers/${meRes.id}/services`);
        setServices(servicesData || []);
      }
    } catch {
      toast("Failed to load services", "error");
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchMyServices();
  }, [fetchMyServices]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (formState.id) {
        // Edit Mode
        await fetchAPI(`/services/${formState.id}`, {
          method: "PUT",
          body: JSON.stringify({
            name: formState.name,
            price: parseFloat(formState.price),
            durationMinutes: parseInt(formState.durationMinutes, 10),
            genderTarget: formState.genderTarget,
          }),
        });
        toast("Service updated successfully!", "success");
      } else {
        // Add Mode
        await fetchAPI("/services", {
          method: "POST",
          body: JSON.stringify({
            name: formState.name,
            price: parseFloat(formState.price),
            durationMinutes: parseInt(formState.durationMinutes, 10),
            genderTarget: formState.genderTarget,
          }),
        });
        toast("Service added successfully!", "success");
      }
      
      setFormState({ id: null, name: "", price: "", durationMinutes: "", genderTarget: "BOTH" });
      fetchMyServices();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to save service";
      toast(message, "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditClick = (service: Service) => {
    setFormState({
      id: service.id,
      name: service.name,
      price: service.price.toString(),
      durationMinutes: service.durationMinutes.toString(),
      genderTarget: service.genderTarget || "BOTH",
    });
    // Scroll to form smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteService = async () => {
    if (!deleteConfirmId) return;
    try {
      await fetchAPI(`/services/${deleteConfirmId}`, { method: "DELETE" });
      toast("Service deleted", "success");
      fetchMyServices();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to delete service";
      toast(message, "error");
    } finally {
      setDeleteConfirmId(null);
    }
  };

  const cancelEdit = () => {
    setFormState({ id: null, name: "", price: "", durationMinutes: "", genderTarget: "BOTH" });
  };

  return (
    <>
      {deleteConfirmId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-stone-900 border border-stone-800 rounded-xl shadow-2xl p-6 w-full max-w-sm animate-in zoom-in-95 duration-200">
            <h3 className="text-lg font-bold text-stone-100 mb-2">Delete Service</h3>
            <p className="text-stone-400 text-sm mb-6">Are you sure you want to delete this service? This action cannot be undone.</p>
            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={() => setDeleteConfirmId(null)}>Cancel</Button>
              <Button variant="destructive" onClick={handleDeleteService}>Delete</Button>
            </div>
          </div>
        </div>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-slide-up">
      {/* Service Form */}
      <div className="lg:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              {formState.id ? <Edit className="size-5 text-amber-500" /> : <Plus className="size-5 text-amber-500" />}
              {formState.id ? "Edit Service" : "New Service"}
            </CardTitle>
            <CardDescription>{formState.id ? "Update service details" : "Create a new service offering"}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Service Name</Label>
                <Input
                  required
                  placeholder="e.g. Classic Haircut"
                  value={formState.name}
                  onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Price (TND)</Label>
                  <Input
                    required
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="50.00"
                    value={formState.price}
                    onChange={(e) => setFormState({ ...formState, price: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Duration (min)</Label>
                  <Input
                    required
                    type="number"
                    min="5"
                    placeholder="30"
                    value={formState.durationMinutes}
                    onChange={(e) => setFormState({ ...formState, durationMinutes: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Target Gender</Label>
                <Select
                  value={formState.genderTarget}
                  onValueChange={(val) =>
                    setFormState({ ...formState, genderTarget: val as GenderTarget })
                  }
                >
                  <option value="BOTH">Both</option>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                </Select>
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="flex-1" disabled={submitting}>
                  {submitting ? "Saving..." : formState.id ? "Save Changes" : "Add Service"}
                </Button>
                {formState.id && (
                  <Button type="button" variant="outline" onClick={cancelEdit}>
                    Cancel
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Services List */}
      <div className="lg:col-span-2 space-y-3">
        {loading ? (
          <>
            <RowSkeleton /><RowSkeleton /><RowSkeleton />
          </>
        ) : services.length === 0 ? (
          <Card>
            <CardContent className="py-10 text-center">
              <DollarSign className="size-8 text-stone-600 mx-auto mb-3" />
              <p className="text-stone-400 font-medium">No services yet</p>
              <p className="text-stone-500 text-sm mt-1">Add your first service using the form.</p>
            </CardContent>
          </Card>
        ) : (
          services.map((service) => (
            <Card key={service.id} className="hover:border-stone-700 transition-colors">
              <div className="flex items-center justify-between p-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-stone-100">{service.name}</h3>
                  <div className="flex items-center gap-4 mt-1 text-sm text-stone-400">
                    <span className="flex items-center gap-1">
                      <Clock className="size-3.5" />
                      {service.durationMinutes} min
                    </span>
                    <span className="capitalize">{service.genderTarget?.toLowerCase()}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-bold text-amber-400">{Number(service.price).toFixed(2)} TND</span>
                  <div className="flex items-center gap-2">
                    <Button variant="secondary" size="sm" onClick={() => handleEditClick(service)}>
                      <Edit className="size-3.5" />
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => setDeleteConfirmId(service.id)}>
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
    </>
  );
}
