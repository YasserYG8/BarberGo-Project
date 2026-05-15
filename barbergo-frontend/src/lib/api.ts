/* ═══════════════════════════════════════════
   BarberGo — API Client
   Handles auth header injection, error typing,
   rate-limit handling, and PDF downloads.
   ═══════════════════════════════════════════ */

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8121/api';

function getErrorMessage(errorData: unknown, status: number): string {
  if (typeof errorData === 'string' && errorData.trim().length > 0) {
    return errorData;
  }

  if (errorData && typeof errorData === 'object') {
    const maybeMessage = (errorData as { message?: unknown }).message;
    if (typeof maybeMessage === 'string' && maybeMessage.trim().length > 0) {
      return maybeMessage;
    }

    if (maybeMessage && typeof maybeMessage === 'object') {
      const fieldMessages = Object.values(maybeMessage)
        .filter((value): value is string => typeof value === 'string' && value.trim().length > 0);

      if (fieldMessages.length > 0) {
        return fieldMessages.join(', ');
      }
    }
  }

  return `Request failed with status ${status}`;
}

/**
 * Core fetch wrapper — injects JWT, handles errors.
 * The Spring Boot backend returns data directly (no wrapper),
 * so this function returns the parsed JSON as-is.
 */
export async function fetchAPI<T = unknown>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const headers: HeadersInit = {};

  // Only add application/json if the body is not FormData
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  // Inject JWT from zustand persisted store (client-side only)
  if (typeof window !== 'undefined') {
    try {
      const authStorage = localStorage.getItem('auth-storage');
      if (authStorage) {
        const { state } = JSON.parse(authStorage);
        if (state?.token) {
          headers['Authorization'] = `Bearer ${state.token}`;
        }
      }
    } catch {
      // Silently fail — user not authenticated
    }
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      ...headers,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);

    if (response.status === 429) {
      throw new APIError('Rate limit exceeded. Please try again later.', 429);
    }
    if (response.status === 401) {
      const msg = getErrorMessage(errorData, response.status);
      throw new APIError(msg !== 'Request failed with status 401' ? msg : 'Authentication required. Please check your credentials.', 401);
    }
    if (response.status === 403) {
      throw new APIError('You do not have permission to perform this action.', 403);
    }

    throw new APIError(getErrorMessage(errorData, response.status), response.status);
  }

  // Handle empty responses (204 No Content, DELETE)
  const text = await response.text();
  return text ? JSON.parse(text) : (null as T);
}

/**
 * Download a PDF blob from the API (for invoices).
 */
export async function downloadPDF(endpoint: string, filename: string): Promise<void> {
  const headers: HeadersInit = {
    Accept: 'application/pdf',
  };

  if (typeof window !== 'undefined') {
    try {
      const authStorage = localStorage.getItem('auth-storage');
      if (authStorage) {
        const { state } = JSON.parse(authStorage);
        if (state?.token) {
          headers['Authorization'] = `Bearer ${state.token}`;
        }
      }
    } catch {
      // Not authenticated
    }
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, { headers });

  if (!response.ok) {
    throw new APIError('Failed to download PDF', response.status);
  }

  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

/**
 * Open a PDF blob in a new browser tab.
 */
export async function viewPDF(endpoint: string): Promise<void> {
  const headers: HeadersInit = {
    Accept: 'application/pdf',
  };

  if (typeof window !== 'undefined') {
    try {
      const authStorage = localStorage.getItem('auth-storage');
      if (authStorage) {
        const { state } = JSON.parse(authStorage);
        if (state?.token) {
          headers['Authorization'] = `Bearer ${state.token}`;
        }
      }
    } catch {
      // Not authenticated
    }
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, { headers });

  if (!response.ok) {
    throw new APIError('Failed to view PDF', response.status);
  }

  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  window.open(url, '_blank');
  // Optional: URL.revokeObjectURL(url) could be called, but opening in a new tab might require it to be kept alive slightly longer.
}

/**
 * Custom API error with status code.
 */
export class APIError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = 'APIError';
    this.status = status;
  }
}
