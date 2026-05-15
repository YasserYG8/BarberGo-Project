# BarberGo API - Postman Testing Guide

This document contains all the endpoints, HTTP methods, headers, and body payloads you need to test the BarberGo API directly in Postman.

## 🛠️ Global Setup in Postman
For all protected routes, you must add the following Header in Postman:
- **Key:** `Authorization`
- **Value:** `Bearer YOUR_ACCESS_TOKEN_HERE` (Replace with the token you get from the Login endpoint)

- **Key:** `Accept`
- **Value:** `application/json`

---

## 1. Authentication (No Token Required)

### 📌 Register a Client
- **Method:** `POST`
- **URL:** `http://localhost:8000/api/auth/register`
- **Body (raw / JSON):**
```json
{
  "name": "Jane Client",
  "email": "jane.client@example.com",
  "password": "password12",
  "password_confirmation": "password12",
  "role": "client",
  "phone": "+212600000001",
  "address": "123 Rue Hassan II, Casablanca",
  "gender": "female"
}
```

### 📌 Register a Hairdresser
- **Method:** `POST`
- **URL:** `http://localhost:8000/api/auth/register`
- **Body (raw / JSON):**
```json
{
  "name": "Ali Coiffeur",
  "email": "ali.barber@example.com",
  "password": "password12",
  "password_confirmation": "password12",
  "role": "hairdresser",
  "phone": "+212600000002",
  "address": "456 Blvd Zerktouni, Casablanca",
  "gender": "male"
}
```

### 📌 Login
- **Method:** `POST`
- **URL:** `http://localhost:8000/api/auth/login`
- **Body (raw / JSON):**
```json
{
  "email": "jane.client@example.com",
  "password": "password12"
}
```
*(Copy the token from the response for the endpoints below)*

---

## 2. Public Endpoints (No Token Required)

### 📌 List Hairdressers
- **Method:** `GET`
- **URL:** `http://localhost:8000/api/hairdressers`
- **Body:** *None*

### 📌 Get Specific Hairdresser
- **Method:** `GET`
- **URL:** `http://localhost:8000/api/hairdressers/1`
- **Body:** *None*

---

## 3. Hairdresser Profile & Services (Token + Role: Hairdresser)

### 📌 Update Hairdresser Profile
- **Method:** `PUT`
- **URL:** `http://localhost:8000/api/hairdressers/1`
- **Body (raw / JSON):**
```json
{
  "bio": "10 ans d'expérience, spécialiste dégradés et barbe.",
  "photo": "https://example.com/photos/ali.jpg"
}
```

### 📌 Create a Service
- **Method:** `POST`
- **URL:** `http://localhost:8000/api/services`
- **Body (raw / JSON):**
```json
{
  "name": "Coupe homme",
  "price": 120.00,
  "duration_minutes": 45,
  "gender_target": "male"
}
```

### 📌 Add Availability Slot
- **Method:** `POST`
- **URL:** `http://localhost:8000/api/availabilities`
- **Body (raw / JSON):**
```json
{
  "day_of_week": "sat",
  "start_time": "09:00",
  "end_time": "18:00"
}
```

---

## 4. Bookings (Token Required)

### 📌 Create Booking (Role: Client)
- **Method:** `POST`
- **URL:** `http://localhost:8000/api/bookings`
- **Body (raw / JSON):**
```json
{
  "hairdresser_id": 1,
  "address": "10 Rue des Fleurs, Rabat",
  "booking_date": "2026-05-10T14:30:00",
  "service_ids": [1, 2]
}
```

### 📌 View My Bookings (Role: Client or Hairdresser)
- **Method:** `GET`
- **URL:** `http://localhost:8000/api/bookings/my`
- **Body:** *None*

### 📌 Update Booking Status (Role: Hairdresser)
- **Method:** `PATCH`
- **URL:** `http://localhost:8000/api/bookings/1/status`
- **Body (raw / JSON):**
```json
{
  "status": "confirmed"
}
```
*(Other statuses: `on_way`, `arrived`, `in_progress`, `done`, `cancelled`)*

---

## 5. Reviews & Invoices (Token Required)

### 📌 Create Review (Role: Client)
- **Method:** `POST`
- **URL:** `http://localhost:8000/api/reviews`
- **Body (raw / JSON):**
```json
{
  "hairdresser_id": 1,
  "rating": 5,
  "comment": "Excellent service à domicile, ponctuel et pro."
}
```

### 📌 Download Invoice PDF
- **Method:** `GET`
- **URL:** `http://localhost:8000/api/invoices/1/pdf`
- **Body:** *None*

---

## 6. Admin Endpoints (Token + Role: Admin)

### 📌 Validate a Hairdresser
- **Method:** `PATCH`
- **URL:** `http://localhost:8000/api/admin/hairdressers/1/validate`
- **Body:** *None*

### 📌 View Admin Dashboard Stats
- **Method:** `GET`
- **URL:** `http://localhost:8000/api/admin/dashboard`
- **Body:** *None*
