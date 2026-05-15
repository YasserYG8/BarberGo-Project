import { downloadPDF, viewPDF, fetchAPI } from "@/lib/api";
import type { Booking, BookingStatus } from "@/types";

export async function getMyBookings(): Promise<Booking[]> {
  return fetchAPI<Booking[]>("/bookings/my");
}

export async function updateBookingStatus(bookingId: number, status: BookingStatus): Promise<Booking> {
  return fetchAPI<Booking>(`/bookings/${bookingId}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

export async function cancelBookingAsClient(bookingId: number): Promise<void> {
  await fetchAPI(`/bookings/${bookingId}`, {
    method: "DELETE",
  });
}

export async function downloadBookingInvoice(bookingId: number): Promise<void> {
  await downloadPDF(`/invoices/${bookingId}/pdf`, `invoice-${bookingId}.pdf`);
}

export async function viewBookingInvoice(bookingId: number): Promise<void> {
  await viewPDF(`/invoices/${bookingId}/pdf`);
}
