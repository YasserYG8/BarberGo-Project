import { fetchAPI } from "@/lib/api";
import type { HairdresserResponse, UpdateProfileRequest, UserProfileResponse } from "@/types";

interface HairdresserUpdateRequest {
  bio?: string;
  specialty?: string;
}

export async function getMyUserProfile(): Promise<UserProfileResponse> {
  return fetchAPI<UserProfileResponse>("/auth/me");
}

export async function updateMyUserProfile(payload: UpdateProfileRequest): Promise<UserProfileResponse> {
  return fetchAPI<UserProfileResponse>("/auth/me", {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function getMyHairdresserProfile(): Promise<HairdresserResponse> {
  return fetchAPI<HairdresserResponse>("/hairdressers/me");
}

export async function updateMyHairdresserProfile(
  hairdresserId: number,
  payload: HairdresserUpdateRequest
): Promise<HairdresserResponse> {
  return fetchAPI<HairdresserResponse>(`/hairdressers/${hairdresserId}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function uploadProfilePicture(file: File): Promise<{ profilePicture: string }> {
  const formData = new FormData();
  formData.append('file', file);
  return fetchAPI<{ profilePicture: string }>('/auth/profile-picture', {
    method: 'POST',
    body: formData,
  });
}

export async function sendVerificationEmail(): Promise<{ message: string }> {
  return fetchAPI<{ message: string }>("/auth/send-verification-email", {
    method: "POST",
  });
}
