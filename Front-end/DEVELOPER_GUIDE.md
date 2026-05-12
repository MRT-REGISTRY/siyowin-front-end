# Developer Guide — User flows & events

## Mock roles & credentials (seeded)

- Student
  - Email: student@siyowin.lk
  - Password: password123
  - Role: student

- Teacher
  - Email: teacher@siyowin.lk
  - Password: password123
  - Role: teacher

- Admin
  - Email: admin@siyowin.lk
  - Password: password123
  - Role: admin

- Super Admin
  - Email: superadmin@siyowin.lk
  - Password: password123
  - Role: super-admin

These users are defined in `Back-end/src/data/seed.ts` and the demo password is `password123`.

---

## Overview

This guide explains how authentication and user state flow between the Front-end and Back-end, and what happens internally when users sign in, are validated, and access protected pages.

## Frontend: where things start

- Login UI: `Front-end/components/LmsLoginModal.tsx`
  - Presents role selection (student / teacher / admin) then email/password form.
  - On submit calls `login()` from `Front-end/utils/api.ts`.

- `login()` performs a POST to `/api/auth/login` (proxied by `NEXT_PUBLIC_API_URL` or `http://localhost:4000/api`).

- On successful response the frontend:
  - Stores `siyowin_token` in localStorage (JWT token).
  - Stores `siyowin_user` in localStorage (public user object).
  - Redirects user to the role dashboard via `getDashboardPathForRole()`.

Local storage keys:
- `siyowin_token` — the JWT returned by backend.
- `siyowin_user` — JSON stringified public user object.

## Backend: login and token issuance

- Endpoint: `POST /api/auth/login` implemented in `Back-end/src/routes/auth.routes.ts`.
  - Request body: `{ email, password, role? }` (role optional; used to assert role on login).
  - Flow:
    1. `repo.findUserByEmail(email)` to locate user (uses Supabase or in-memory `store` fallback).
    2. `bcrypt.compareSync(password, user.passwordHash)` verifies password.
    3. If a role was provided, the backend checks the user's role and rejects if mismatch.
    4. JWT is generated with `jwt.sign({ sub: user.id, role: user.role }, env.jwtSecret, { expiresIn: env.jwtExpiresIn })`.
    5. Response: `{ token, user: publicUser(user) }` where `publicUser` strips sensitive fields.

## Token validation & protected routes

- Protected routes use middleware `requireAuth` in `Back-end/src/middleware/auth.ts`:
  - Reads `Authorization: Bearer <token>` header.
  - Verifies token with `jwt.verify(token, env.jwtSecret)`.
  - Loads full user via `repo.findUserById(payload.sub)` and attaches `req.user = publicUser(user)`.
  - On failure returns `401`.

- Role-restricted routes can use `requireRoles(...roles)` which checks `req.user.role` and returns `403` if not allowed.

- Frontend uses `AuthGate` (`Front-end/components/auth/AuthGate.tsx`) for client-side route protection:
  - Reads token & user from localStorage.
  - Calls `GET /api/auth/me` (which uses `requireAuth`) to validate token and refresh user role check.
  - Redirects or clears session on failure.

## Where user/profile data comes from

- Primary source: Supabase `app_users` table (queried in `repo` methods).
- Fallback: in-memory `store` seeded in `Back-end/src/data/seed.ts` (useful for local dev without a DB).

Mapping and shaping:
- `repo.findUserByEmail` and `repo.findUserById` return mapped users with `studentId` / `teacherId` fields and `passwordHash` available only to server.
- `publicUser(user)` returns the public shape saved to the frontend.

## Events & things that happen (step-by-step)

1. User clicks LMS Login -> selects role -> fills email/password -> submits.
2. Frontend `login()` POSTs to `/api/auth/login`.
3. Backend authenticates user, returns `{ token, user }`.
4. Frontend stores `siyowin_token` and `siyowin_user` and redirects to dashboard.
5. On protected pages, `AuthGate` uses `apiGet('/auth/me')` to confirm token validity.
6. Backend middleware `requireAuth` verifies JWT and attaches `req.user`.
7. Routes guarded with `requireRoles` block unauthorized roles with `403`.
8. When user signs out (or token invalid), frontend clears session keys via `clearSession()`.

## Seeding and local setup notes

- Backend scripts (from `Back-end/package.json`):

```bash
cd Back-end
npm install
# Start in dev (watch)
npm run dev
```

- Environment variables (see `Back-end/.env.example`):
  - `PORT`, `CORS_ORIGIN`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SECRET_KEY`, `SUPABASE_JWT_SECRET`.

## Useful file references

- Auth routes: [Back-end/src/routes/auth.routes.ts](Back-end/src/routes/auth.routes.ts#L1)
- Auth middleware: [Back-end/src/middleware/auth.ts](Back-end/src/middleware/auth.ts#L1)
- In-memory seed & demo users: [Back-end/src/data/seed.ts](Back-end/src/data/seed.ts#L1)
- Repo (db + fallback): [Back-end/src/data/repository.ts](Back-end/src/data/repository.ts#L1)
- Frontend API helpers: [Front-end/utils/api.ts](Front-end/utils/api.ts#L1)
- Frontend login modal: [Front-end/components/LmsLoginModal.tsx](Front-end/components/LmsLoginModal.tsx#L1)
- Frontend auth guard: [Front-end/components/auth/AuthGate.tsx](Front-end/components/auth/AuthGate.tsx#L1)

---

If you want, I can:
- add a short diagram of the POST /auth/login & token lifecycle, or
- add curl examples for login and calling a protected endpoint.
