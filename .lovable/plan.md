## Goal
Fix the 3 security findings by replacing the mock SSO/Zustand role system with real authentication and server-enforced authorization, and moving sensitive bundle data to the database.

## Step 1 — Enable Lovable Cloud
Provision backend (Postgres + Auth + auto-generated `src/integrations/supabase/client.ts`).

## Step 2 — Database schema (migration)
- `app_role` enum: `Platform Owner`, `Brand Design Lead`, `Creative Tech`, `IT Admin`, `Finance Stakeholder`, `Team Member`
- `profiles` (id → auth.users, name, email, brand, initials, last_active, status) — auto-created via trigger on signup
- `user_roles` (user_id, role) — separate table, never on profiles
- `has_role(_user_id, _role)` security definer function
- `products` (with admin_url, cost_monthly, seats, …) — sensitive
- `product_access` (user_id, product_id)
- `access_requests` (user_id, product_id, role_requested, …)
- RLS on every table:
  - `profiles`: each user reads own; Platform Owner / IT Admin read all
  - `user_roles`: user reads own; Platform Owner / IT Admin manage
  - `products`: only authenticated users; `admin_url` + `cost_monthly` restricted to Platform Owner / IT Admin / Finance Stakeholder via column-level policy (split into `products_public` view for the rest)
  - `product_access`, `access_requests`: user reads own; Platform Owner / IT Admin read all
- Trigger `handle_new_user()` to seed profile + default `Team Member` role

## Step 3 — Seed data
Insert the existing 10 products and 3 access requests into the DB so the UI keeps working. (Existing employee fixture rows are NOT seeded — real users will be created on signup.)

## Step 4 — Real authentication
- Rewrite `src/pages/LoginPage.tsx` to use `supabase.auth.signInWithPassword` + a signup flow (email/password), with `emailRedirectTo: window.location.origin`.
- Add `AuthProvider` (context) wrapping the app, that:
  - sets up `onAuthStateChange` BEFORE `getSession()`
  - exposes `{ session, user, roles, loading, signOut }`
- Replace `RouteGuard` to check `session` (redirect to `/login`) and verified `roles` from the DB (not Zustand) for path permissions.
- Remove role-switching UI from `AppHeader` (Zustand `setActiveRole`) — roles are now server-verified.
- Strip `currentUser` and `users` exports from `src/data/users.ts`; replace consumers with hooks that query the DB through the authenticated client.

## Step 5 — Refactor data consumers
- `useDataHooks.ts`: replace fixture reads with Supabase queries for products, profiles, access requests, product access.
- Pages affected: `DashboardPage`, `ProductsPage`, `ProductDetailPage` + tabs, `AccessPage`, `LicencesPage`, `ReportsPage`, `ResourcesPage` (resources stays static — it's just links).
- Keep mock licence/audit/integration/doc generators for now (they're synthetic, not sensitive) but key them off DB product ids.

## Step 6 — Security memory
Update `mem://security` documenting: real auth required, RLS enforces RBAC, no sensitive data in bundle, role-switching UI forbidden.

## Technical notes
- Auth defaults: email + password (Google can be added later from Cloud settings).
- The first signed-up user is auto-assigned `Team Member`; an admin promotes others via SQL or a future admin UI (out of scope here).
- Existing `currentUser.initials = "B"` and role memory rule ("Manual role selection in header is forbidden") are preserved.

## Scope explicitly excluded
- Custom email templates / branded auth emails (can be added later).
- Admin UI for managing roles and seeding employees (use SQL for now).
- Migrating synthetic licence/audit fixtures to DB.
