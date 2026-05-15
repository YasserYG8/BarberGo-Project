# BarberGo — Documentation Technique

> **Auteur :** Yasser Gombra — ISET Nabeul  
> **Date :** Mai 2026

---

## Sommaire

1. [Introduction](#1-introduction)
2. [Architecture Technique](#2-architecture-technique)
3. [Backend — Laravel API](#3-backend--laravel-api)
4. [Frontend — Next.js](#4-frontend--nextjs)
5. [Base de Données](#5-base-de-données)
6. [Fonctionnalités](#6-fonctionnalités)
7. [Système de Notifications](#7-système-de-notifications)
8. [Sécurité & Authentification](#8-sécurité--authentification)
9. [Interface Utilisateur](#9-interface-utilisateur)
10. [Routes API](#10-routes-api)

---

## 1. Introduction

### 1.1 Contexte du projet

BarberGo est une application web full-stack moderne conçue pour connecter les coiffeurs avec leurs clients à travers une expérience de réservation numérique fluide. La plateforme répond au besoin croissant de digitalisation dans le secteur des soins personnels en offrant un système intuitif de prise de rendez-vous, de gestion de profils professionnels et de facturation automatisée.

### 1.2 Objectifs

- Développer une plateforme de réservation responsive avec contrôle d'accès basé sur les rôles (Client, Coiffeur, Admin).
- Implémenter une authentification sécurisée par jetons API (Laravel Sanctum).
- Fournir une génération automatisée de factures PDF pour les réservations terminées.
- Construire un tableau de bord administratif pour la gestion et la validation des coiffeurs.

### 1.3 Périmètre

Ce document couvre l'architecture du système, la conception de la base de données, l'implémentation des fonctionnalités, et l'aperçu de l'interface utilisateur. L'application cible les navigateurs de bureau et mobiles avec une interface responsive en mode sombre de style glassmorphique.

---

## 2. Architecture Technique

### 2.1 Pile Technologique

| Couche | Technologie | Rôle |
|--------|------------|------|
| Frontend | Next.js 14 (App Router) | Rendu côté serveur, routage, UI |
| Style | Tailwind CSS 3.4 | Design responsive utility-first |
| État | Zustand + Persist Middleware | Gestion d'état d'authentification |
| Backend | Laravel 11 (PHP 8.2) | API RESTful, logique métier |
| Auth | Laravel Sanctum | Authentification par jetons API |
| BDD | MySQL | Stockage relationnel |
| Validation | Zod (frontend) + FormRequest (backend) | Validation des données |
| Icônes | Lucide React | Bibliothèque d'icônes SVG |
| Formulaires | React Hook Form | Gestion des formulaires |
| PDF | DomPDF (via InvoiceService) | Génération de factures |

### 2.2 Architecture Globale

```
┌──────────────────────┐         ┌──────────────────────┐
│   FRONTEND (Next.js) │  HTTP   │   BACKEND (Laravel)  │
│   localhost:3000      │◄───────►│   localhost:8000      │
│                      │  JSON   │                      │
│  • App Router        │         │  • RESTful API       │
│  • Zustand Store     │         │  • Sanctum Auth      │
│  • Tailwind CSS      │         │  • Eloquent ORM      │
│  • TypeScript        │         │  • DomPDF            │
└──────────────────────┘         └──────────┬───────────┘
                                            │
                                   ┌────────▼────────┐
                                   │     MySQL       │
                                   │   Database      │
                                   └─────────────────┘
```

---

## 3. Backend — Laravel API

**Répertoire :** `mini Projet laravel/barbergo/`

### 3.1 Structure du Projet

```
app/
├── Enums/
│   ├── BookingStatus.php      # pending, confirmed, on_way, arrived, in_progress, done, cancelled
│   ├── GenderTarget.php       # male, female, both
│   └── Role.php               # admin, hairdresser, client
├── Http/
│   └── Controllers/
│       ├── AuthController.php          # Register, Login, Logout, Profile, Email Verification
│       ├── AdminController.php         # Dashboard stats, User/Hairdresser management
│       ├── AvailabilityController.php  # CRUD disponibilités
│       ├── BookingController.php       # Création, statut, annulation réservations
│       ├── HairdresserController.php   # Profil coiffeur, listing
│       ├── InvoiceController.php       # Téléchargement PDF facture
│       ├── ReviewController.php        # Avis clients
│       └── ServiceController.php       # CRUD services coiffeur
├── Models/
│   ├── User.php            # Utilisateur (name, email, role, phone, address, avatar, gender)
│   ├── Hairdresser.php     # Profil coiffeur (bio, photo, rating, is_validated)
│   ├── Service.php         # Service (name, price, duration_minutes, gender_target)
│   ├── Availability.php    # Disponibilité (day_of_week, start_time, end_time)
│   ├── Booking.php         # Réservation (client_id, hairdresser_id, address, booking_date, total, status)
│   ├── BookingService.php  # Table pivot booking ↔ service
│   ├── Invoice.php         # Facture (booking_id, total, pdf_path, generated_at)
│   └── Review.php          # Avis (client_id, hairdresser_id, rating, comment)
├── Notifications/
│   ├── AccountValidated.php
│   ├── AccountRejected.php
│   ├── BookingConfirmed.php
│   ├── BookingCancelled.php
│   ├── BookingDone.php
│   ├── HairdresserOnTheWay.php
│   ├── NewBookingReceived.php
│   └── VerifyEmailNotification.php
└── Services/
    ├── BookingService.php         # Logique métier réservations
    ├── InvoiceService.php         # Génération PDF facture
    └── NotificationService.php    # Dispatch des notifications
```

### 3.2 Relations entre Modèles

```
User (1) ──── (1) Hairdresser
User (1) ──── (N) Booking (as client)
User (1) ──── (N) Review (as client)

Hairdresser (1) ──── (N) Service
Hairdresser (1) ──── (N) Availability
Hairdresser (1) ──── (N) Booking
Hairdresser (1) ──── (N) Review

Booking (N) ──── (N) Service  (via booking_services pivot)
Booking (1) ──── (1) Invoice
```

### 3.3 Enums

**BookingStatus** : `pending` → `confirmed` → `on_way` → `arrived` → `in_progress` → `done` | `cancelled`

**Role** : `admin` | `hairdresser` | `client`

**GenderTarget** : `male` | `female` | `both`

---

## 4. Frontend — Next.js

**Répertoire :** `barbergo-frontend - laravel/`

### 4.1 Structure du Projet

```
src/
├── app/
│   ├── (auth)/
│   │   ├── layout.tsx             # Layout auth pages
│   │   └── register/page.tsx      # Inscription
│   ├── (dashboard)/
│   │   ├── layout.tsx             # Layout dashboard (Sidebar)
│   │   ├── admin/
│   │   │   ├── page.tsx           # Dashboard admin (stats)
│   │   │   ├── bookings/page.tsx  # Liste réservations (filtres mois/année)
│   │   │   ├── professionals/     # Gestion coiffeurs
│   │   │   └── users/             # Gestion utilisateurs
│   │   ├── client/                # Dashboard client
│   │   └── hairdresser/
│   │       ├── page.tsx           # Dashboard coiffeur
│   │       ├── availability/      # Gestion disponibilités
│   │       ├── services/          # Gestion services
│   │       └── profile/           # Profil coiffeur
│   ├── hairdressers/[id]/         # Page publique coiffeur
│   ├── globals.css                # Styles globaux (glassmorphism, dark theme)
│   ├── layout.tsx                 # Root layout
│   └── page.tsx                   # Landing page
├── components/
│   ├── dashboard/
│   │   ├── ClientBookingFlow.tsx        # Flux de réservation client
│   │   ├── HairdresserAvailability.tsx  # Gestion disponibilités
│   │   ├── HairdresserServices.tsx      # Gestion services
│   │   └── Sidebar.tsx                  # Navigation latérale
│   ├── layout/                          # Header, Footer, etc.
│   └── ui/
│       ├── avatar.tsx    ├── badge.tsx    ├── button.tsx
│       ├── card.tsx      ├── input.tsx    ├── label.tsx
│       ├── select.tsx    ├── skeleton.tsx └── toaster.tsx
├── lib/
│   ├── api.ts             # Client HTTP (fetchAPI wrapper avec Sanctum token)
│   ├── utils.ts           # Utilitaires (cn, classNames)
│   └── domain/
│       ├── admin.ts       # Fonctions API admin
│       ├── bookings.ts    # Fonctions API réservations
│       ├── profile.ts     # Fonctions API profil
│       └── reviews.ts     # Fonctions API avis
├── store/
│   ├── useAuthStore.ts    # État auth (Zustand + persist)
│   └── useSidebarStore.ts # État sidebar
└── types/
    └── index.ts           # Interfaces TypeScript (miroir des entités Laravel)
```

### 4.2 Dépendances Principales

| Package | Version | Rôle |
|---------|---------|------|
| next | 14.2.35 | Framework React SSR |
| react | ^18 | Bibliothèque UI |
| zustand | ^5.0.13 | Gestion d'état |
| tailwindcss | ^3.4.1 | Framework CSS |
| lucide-react | ^1.14.0 | Icônes |
| zod | ^4.4.3 | Validation de schéma |
| react-hook-form | ^7.75.0 | Formulaires |
| axios | ^1.16.0 | Client HTTP |
| class-variance-authority | ^0.7.1 | Variantes de composants |

### 4.3 Gestion d'État (Zustand)

Le store `useAuthStore` gère :
- `user` : Données utilisateur courant
- `token` : Jeton Sanctum
- `isAuthenticated` : Booléen de connexion
- Persistance via `localStorage` (middleware `persist`)

---

## 5. Base de Données

### 5.1 Schéma des Migrations

| Table | Colonnes Clés |
|-------|--------------|
| `users` | id, name, email, password, role, phone, address, avatar, gender, email_verified_at |
| `hairdressers` | id, user_id (FK), bio, photo, rating, is_validated |
| `services` | id, hairdresser_id (FK), name, price, duration_minutes, gender_target |
| `availabilities` | id, hairdresser_id (FK), day_of_week, start_time, end_time |
| `bookings` | id, client_id (FK→users), hairdresser_id (FK), address, booking_date, total, status |
| `booking_services` | booking_id (FK), service_id (FK) — *table pivot* |
| `reviews` | id, client_id (FK→users), hairdresser_id (FK), rating, comment |
| `invoices` | id, booking_id (FK), total, pdf_path, generated_at |
| `personal_access_tokens` | Sanctum token storage |

### 5.2 Diagramme Entité-Relation

```
┌──────────┐    1:1    ┌──────────────┐    1:N    ┌──────────┐
│  users   │──────────►│ hairdressers │──────────►│ services │
│          │           │              │           └──────────┘
│ • name   │           │ • bio        │    1:N    ┌───────────────┐
│ • email  │           │ • rating     │──────────►│availabilities │
│ • role   │           │ • is_valid.  │           └───────────────┘
│ • phone  │           └──────┬───────┘
│ • avatar │                  │ 1:N
│ • gender │                  ▼
└────┬─────┘           ┌──────────┐    N:N    ┌──────────┐
     │ 1:N             │ bookings │◄─────────►│ services │
     └────────────────►│          │           └──────────┘
        (as client)    │ • status │    1:1    ┌──────────┐
                       │ • total  │──────────►│ invoices │
                       │ • date   │           └──────────┘
                       └────┬─────┘
                            │ (via hairdresser)
                       ┌────▼─────┐
                       │ reviews  │
                       │ • rating │
                       │ • comment│
                       └──────────┘
```

---

## 6. Fonctionnalités

### 6.1 Par Rôle

#### Client
- Inscription / Connexion avec vérification email
- Parcourir les coiffeurs (recherche par nom, filtre par service)
- Sélectionner des services (filtre par genre : homme/femme/tous)
- Réserver un rendez-vous (date, heure, adresse + géolocalisation)
- Suivre le statut en temps réel (pending → confirmed → on_way → done)
- Annuler une réservation (uniquement si statut `pending`)
- Télécharger la facture PDF (après `done`)
- Laisser un avis (étoiles + commentaire)

#### Coiffeur
- Inscription avec profil coiffeur auto-créé
- Modifier son profil (bio, photo)
- Gérer ses services (CRUD : nom, prix, durée, genre cible)
- Gérer ses disponibilités (jour de la semaine + créneaux horaires)
- Voir ses réservations entrantes
- Mettre à jour le statut : `confirmed` → `on_way` → `arrived` → `in_progress` → `done`
- Attente de validation admin avant d'être visible aux clients

#### Admin
- Dashboard avec statistiques (utilisateurs, coiffeurs, réservations, CA, bénéfice plateforme 13.5%)
- Valider / Rejeter les coiffeurs (avec notification email)
- Gérer les utilisateurs (liste, suppression, changement de rôle)
- Voir toutes les réservations (avec filtres par mois/année, recherche, tri par date)

### 6.2 Cycle de Vie d'une Réservation

```
Client crée    Coiffeur        Coiffeur        Coiffeur         Coiffeur        Coiffeur
la réservation  confirme        en route        arrivé           en cours         terminé
     │              │              │               │                │               │
     ▼              ▼              ▼               ▼                ▼               ▼
  PENDING ──► CONFIRMED ──► ON_WAY ──► ARRIVED ──► IN_PROGRESS ──► DONE
     │                                                                │
     │ (client annule)                                                │
     ▼                                                                ▼
  CANCELLED                                                    Invoice créée
                                                               automatiquement
```

### 6.3 Système de Facturation

1. Quand le statut passe à `done`, une `Invoice` est auto-créée via `Invoice::firstOrCreate`
2. Le client ou le coiffeur peut télécharger le PDF via `GET /api/invoices/{bookingId}/pdf`
3. Le PDF est généré dynamiquement par `InvoiceService` (DomPDF)
4. Commission plateforme : **13.5%** du total

---

## 7. Système de Notifications

| Notification | Déclencheur | Destinataire |
|-------------|-------------|-------------|
| `NewBookingReceived` | Client crée une réservation | Coiffeur |
| `BookingConfirmed` | Coiffeur confirme | Client |
| `HairdresserOnTheWay` | Statut → `on_way` | Client |
| `BookingDone` | Statut → `done` | Client |
| `BookingCancelled` | Client annule | Coiffeur |
| `AccountValidated` | Admin valide le coiffeur | Coiffeur |
| `AccountRejected` | Admin rejette le coiffeur | Coiffeur |
| `VerifyEmailNotification` | Envoi vérification email | Utilisateur |

---

## 8. Sécurité & Authentification

### 8.1 Laravel Sanctum

- Authentification par **jetons Bearer** (Personal Access Tokens)
- Chaque login révoque les anciens tokens pour des sessions propres
- Le token est stocké côté frontend dans `localStorage` via Zustand persist

### 8.2 Middleware de Rôle

Les routes sont protégées par middleware `role:{role}` :
- `role:client` — Réservations, avis
- `role:hairdresser` — Services, disponibilités, mise à jour statut
- `role:admin` — Dashboard, gestion utilisateurs/coiffeurs

### 8.3 Rate Limiting

| Groupe | Limite |
|--------|--------|
| Auth (`throttle:auth`) | 10 req/min/IP |
| API (`throttle:api`) | 60 req/min/user |
| PDF (`throttle:pdf`) | 5 req/min/user |

### 8.4 Vérification Email

- URL signée temporaire (60 min) via `URL::temporarySignedRoute`
- Redirection vers le frontend après vérification avec query `?verified=1`

---

## 9. Interface Utilisateur

### 9.1 Design System

- **Thème :** Mode sombre (dark mode) avec palette `stone` de Tailwind
- **Accent :** Or/Ambre (`amber-400`, `amber-500`) — style luxe/premium
- **Effets :** Glassmorphism, backdrop-blur, transitions douces
- **Typographie :** Font heading personnalisée + polices système
- **Composants UI :** Bibliothèque interne (`components/ui/`) — Button, Card, Badge, Input, Select, Avatar, Toaster, Skeleton

### 9.2 Navigation (Sidebar)

La sidebar adapte ses liens selon le rôle :

| Rôle | Liens |
|------|-------|
| Client | Overview, Book a Service, Profile |
| Coiffeur | Overview, My Services, Availability, Profile |
| Admin | Overview, Professionals, Recent Bookings, Users |

### 9.3 Composants Clés

| Composant | Description |
|-----------|-------------|
| `ClientBookingFlow` | Flux complet de réservation : annuaire → sélection pro → services → détails → résumé → confirmation |
| `HairdresserAvailability` | Gestion des créneaux horaires par jour de la semaine |
| `HairdresserServices` | CRUD services avec prix, durée et filtre genre |
| `Sidebar` | Navigation contextuelle par rôle avec animation |
| `StatusBadge` | Badge coloré selon le statut de réservation |

---

## 10. Routes API

### Auth

| Méthode | Route | Auth | Description |
|---------|-------|------|-------------|
| POST | `/api/auth/register` | Non | Inscription |
| POST | `/api/auth/login` | Non | Connexion |
| POST | `/api/auth/logout` | Oui | Déconnexion |
| GET | `/api/auth/me` | Oui | Profil utilisateur |
| PUT | `/api/auth/me` | Oui | Mise à jour profil |
| POST | `/api/auth/profile-picture` | Oui | Upload photo de profil |
| POST | `/api/auth/send-verification-email` | Oui | Envoyer email vérification |
| GET | `/api/auth/verify-email/{id}/{hash}` | Non | Callback vérification |

### Coiffeurs

| Méthode | Route | Auth | Description |
|---------|-------|------|-------------|
| GET | `/api/hairdressers` | Non | Liste coiffeurs |
| GET | `/api/hairdressers/me` | Coiffeur | Mon profil coiffeur |
| PUT | `/api/hairdressers/update` | Coiffeur | Modifier mon profil |
| GET | `/api/hairdressers/{id}` | Non | Détails d'un coiffeur |
| GET | `/api/hairdressers/{id}/services` | Non | Services d'un coiffeur |
| GET | `/api/hairdressers/{id}/availabilities` | Non | Disponibilités d'un coiffeur |
| GET | `/api/hairdressers/{id}/reviews` | Non | Avis sur un coiffeur |

### Services & Disponibilités

| Méthode | Route | Auth | Description |
|---------|-------|------|-------------|
| POST | `/api/services` | Coiffeur | Ajouter un service |
| PUT | `/api/services/{id}` | Coiffeur | Modifier un service |
| DELETE | `/api/services/{id}` | Coiffeur | Supprimer un service |
| POST | `/api/availabilities` | Coiffeur | Ajouter un créneau |
| DELETE | `/api/availabilities/{id}` | Coiffeur | Supprimer un créneau |

### Réservations

| Méthode | Route | Auth | Description |
|---------|-------|------|-------------|
| POST | `/api/bookings` | Client | Créer une réservation |
| GET | `/api/bookings/my` | Oui | Mes réservations |
| PATCH | `/api/bookings/{id}/status` | Coiffeur | Mettre à jour le statut |
| DELETE | `/api/bookings/{id}` | Client | Annuler (si pending) |

### Avis & Factures

| Méthode | Route | Auth | Description |
|---------|-------|------|-------------|
| POST | `/api/reviews` | Client | Laisser un avis |
| GET | `/api/invoices/{bookingId}/pdf` | Oui | Télécharger facture PDF |

### Admin

| Méthode | Route | Auth | Description |
|---------|-------|------|-------------|
| GET | `/api/admin/dashboard` | Admin | Statistiques globales |
| GET | `/api/admin/hairdressers` | Admin | Liste coiffeurs |
| PATCH | `/api/admin/hairdressers/{id}/validate` | Admin | Valider un coiffeur |
| PATCH | `/api/admin/hairdressers/{id}/reject` | Admin | Rejeter un coiffeur |
| GET | `/api/admin/bookings` | Admin | Toutes les réservations |
| GET | `/api/admin/users` | Admin | Tous les utilisateurs |
| DELETE | `/api/admin/users/{id}` | Admin | Supprimer un utilisateur |
| PATCH | `/api/admin/users/{id}/role` | Admin | Changer le rôle |

---

> **BarberGo** — Plateforme de réservation de coiffeurs à domicile  
> Full-stack : Next.js 14 + Laravel 11 + MySQL  
> © 2026 Yasser Gombra — ISET Nabeul
