/* ═══════════════════════════════════════════
   BarberGo — TypeScript Types
   Mirrors Spring Boot backend entities & DTOs
   All fields use camelCase to match Java JSON
   All enums use UPPERCASE to match Java enums
   ═══════════════════════════════════════════ */

// ─── Enums ───
export type Role = 'ADMIN' | 'HAIRDRESSER' | 'CLIENT';

export type BookingStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'ON_WAY'
  | 'ARRIVED'
  | 'IN_PROGRESS'
  | 'DONE'
  | 'CANCELLED';

export type GenderTarget = 'MALE' | 'FEMALE' | 'BOTH';

export type DayOfWeek =
  | 'MONDAY'
  | 'TUESDAY'
  | 'WEDNESDAY'
  | 'THURSDAY'
  | 'FRIDAY'
  | 'SATURDAY'
  | 'SUNDAY';

// ─── Auth DTOs (mirrors AuthResponse.java) ───
export interface AuthResponse {
  token: string;
  id: number;
  fullName: string;
  email: string;
  role: Role;
}

// ─── User Entity ───
export interface User {
  id: number;
  fullName: string;
  email: string;
  phone?: string;
  address?: string;
  role: Role;
  profilePicture?: string;
  enabled: boolean;
}

export interface UserProfileResponse {
  id: number;
  fullName: string;
  email: string;
  phone?: string;
  address?: string;
  role: Role;
  emailVerified?: boolean;
}

// ─── HairdresserResponse DTO ───
export interface HairdresserResponse {
  id: number;
  fullName: string;
  bio?: string;
  specialty?: string;
  averageRating?: number;
  validatedByAdmin: boolean;
  profilePicture?: string;
}

// ─── Hairdresser Entity (full, from admin endpoints) ───
export interface Hairdresser {
  id: number;
  user: User;
  bio?: string;
  specialty?: string;
  validatedByAdmin: boolean;
  averageRating?: number;
  services?: Service[];
  availabilities?: Availability[];
}

// ─── Service Entity ───
export interface Service {
  id: number;
  name: string;
  description?: string;
  price: number;
  durationMinutes: number;
  genderTarget: GenderTarget;
}

// ─── Availability Entity ───
export interface Availability {
  id: number;
  dayOfWeek: DayOfWeek;
  startTime: string;   // "HH:mm:ss"
  endTime: string;     // "HH:mm:ss"
}

// ─── BookingService join entity ───
export interface BookingServiceItem {
  id: number;
  service: Service;
}

// ─── Review Entity ───
export interface Review {
  id: number;
  rating: number;
  comment?: string;
  createdAt: string;
}

// ─── Invoice Entity ───
export interface Invoice {
  id: number;
  invoiceNumber: string;
  issuedAt: string;
  amount: number;
  pdfPath: string;
}

// ─── Booking Entity ───
export interface Booking {
  id: number;
  client: User;
  hairdresser: Hairdresser;
  bookingDate: string;       // ISO datetime
  status: BookingStatus;
  address: string;
  totalPrice: number;
  bookingServices?: BookingServiceItem[];
  invoice?: Invoice;
  review?: Review;
}

// ─── Request DTOs ───
export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
  role: 'CLIENT' | 'HAIRDRESSER';
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface UpdateProfileRequest {
  fullName?: string;
  phone?: string;
  address?: string;
}

export interface BookingRequest {
  hairdresserId: number;
  bookingDate: string;       // ISO datetime
  address: string;
  serviceIds: number[];
}

export interface ReviewRequest {
  bookingId: number;
  rating: number;
  comment?: string;
}

export interface ServiceRequest {
  name: string;
  description?: string;
  price: number;
  durationMinutes: number;
  genderTarget: GenderTarget;
}

export interface AvailabilityRequest {
  dayOfWeek: DayOfWeek;
  startTime: string;  // "HH:mm:ss"
  endTime: string;    // "HH:mm:ss"
}

// ─── Admin Dashboard Stats ───
export interface DashboardStats {
  totalUsers: number;
  totalHairdressers: number;
  totalBookings: number;
  totalRevenue: number;
  [key: string]: unknown;
}
