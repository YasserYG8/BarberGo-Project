# BarberGo Frontend Architecture

This document outlines the architecture, routing, dependencies, and design patterns for the BarberGo Next.js frontend application.

## 1. Tech Stack & Dependencies

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS (Vanilla CSS approach via utility classes)
- **Icons:** `lucide-react` (Lightweight, consistent SVG icons)
- **Forms & Validation:** `react-hook-form` + `zod` (For robust, type-safe client-side form validation)
- **Date Handling:** `date-fns` (For booking dates and availabilities)
- **State Management:** React Context API + Local React State (Sufficient for this scale, combined with Next.js Server Components for data)
- **HTTP Client:** Native `fetch` wrapper (`src/lib/api.ts`)

## 2. Directory Structure

```text
src/
├── app/                  # Next.js App Router (Pages, Layouts, API Routes)
│   ├── (auth)/           # Group for authentication routes (login, register)
│   ├── (dashboard)/      # Group for protected dashboard routes (client, hairdresser, admin)
│   ├── hairdressers/     # Public listings and individual profiles
│   ├── layout.tsx        # Root layout (Navigation, Footer, Providers)
│   └── page.tsx          # Landing page
├── components/           # Reusable UI components
│   ├── ui/               # Generic UI elements (Buttons, Inputs, Modals, Cards)
│   ├── layout/           # Navbar, Footer, Sidebar
│   └── features/         # Feature-specific components (e.g., BookingForm, ReviewList)
├── lib/                  # Utility functions and core logic
│   ├── api.ts            # API client wrapper handling auth & rate limits
│   └── utils.ts          # Helper functions (e.g., date formatting, currency formatting)
└── types/                # Global TypeScript definitions
    └── index.ts          # Mirrors of backend Entities and Enums
```

## 3. Routing Strategy

The application uses Next.js App Router conventions:

| Route | Description | Access Level |
| :--- | :--- | :--- |
| `/` | Landing page | Public |
| `/auth/login` | Login page | Public |
| `/auth/register` | Registration (Client & Hairdresser) | Public |
| `/hairdressers` | List of validated hairdressers | Public |
| `/hairdressers/[id]` | Hairdresser profile & services | Public |
| `/dashboard/client` | Client bookings & history | Private (Client) |
| `/dashboard/hairdresser` | Manage services, availability, bookings | Private (Hairdresser) |
| `/dashboard/admin` | Validate users, view stats | Private (Admin) |

## 4. API Integration & Data Fetching

- **Data Fetching Pattern:** We will leverage Next.js Server Components for SEO-critical public pages (like `/hairdressers`). For user-specific dashboards and interactive forms, we will use Client Components.
- **API Client:** The `src/lib/api.ts` handles the `Authorization` header injection automatically.
- **Rate Limiting:** The backend utilizes Bucket4j. The API client is configured to intercept `429 Too Many Requests` and gracefully inform the user.

## 5. Security & State

- **Authentication:** JWT is stored in `localStorage` (or HTTP-only cookies if we transition to Next.js middleware routing).
- **Protected Routes:** We will implement a Higher-Order Component (HOC) or a specialized layout wrapper to protect `/dashboard/*` routes based on the user's `Role`.

## 6. Design System Guidelines

- **Colors:** Predominantly clean whites/grays (`bg-gray-50`, `bg-white`) with a primary accent color (e.g., `text-blue-600`) for primary actions to establish trust and professionalism.
- **Typography:** `Inter` font for clean, modern readability.
- **Components:** Keep components modular and single-responsibility. Avoid complex inheritance; prefer composition.
