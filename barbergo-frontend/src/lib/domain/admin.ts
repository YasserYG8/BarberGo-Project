import { fetchAPI } from "@/lib/api";
import type { Booking, DashboardStats, Hairdresser, User } from "@/types";

export async function getAdminDashboardStats(): Promise<DashboardStats> {
  return fetchAPI<DashboardStats>("/admin/dashboard");
}

export async function getAdminHairdressers(): Promise<Hairdresser[]> {
  return fetchAPI<Hairdresser[]>("/admin/hairdressers");
}

export async function getAdminBookings(): Promise<Booking[]> {
  return fetchAPI<Booking[]>("/admin/bookings");
}

export async function getAdminUsers(): Promise<User[]> {
  return fetchAPI<User[]>("/admin/users");
}

export async function setHairdresserValidation(hairdresserId: number, validatedByAdmin: boolean): Promise<Hairdresser> {
  return fetchAPI<Hairdresser>(`/admin/hairdressers/${hairdresserId}/validate`, {
    method: "PATCH",
    body: JSON.stringify({ validatedByAdmin }),
  });
}

export async function deleteAdminUser(userId: number): Promise<void> {
  return fetchAPI(`/admin/users/${userId}`, {
    method: "DELETE",
  });
}

export async function updateAdminUserRole(userId: number, role: string): Promise<User> {
  return fetchAPI<User>(`/admin/users/${userId}/role`, {
    method: "PATCH",
    body: JSON.stringify({ role }),
  });
}
