import { fetchAPI } from "@/lib/api";
import type { Review, ReviewRequest } from "@/types";

export async function createReview(payload: ReviewRequest): Promise<Review> {
  return fetchAPI<Review>("/reviews", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
