# Admin Flow Concept

This document explains how admin access works end-to-end in this project.

## 1) Entry and Authentication

### Login screen
- Route: `/login`
- UI component: `components/portal/magic-link-login-form.tsx`
- Role choice:
  - `Admin`: password login
  - `User` (client): magic-link login

### Admin login behavior
- Admin must enter static password: `admin@machinevision.global`.
- App uses Supabase password auth (`signInWithPassword`) with admin email from:
  - `NEXT_PUBLIC_ADMIN_LOGIN_EMAIL` (preferred), or
  - fallback `admin@machinevision.global`.
- On success, app redirects directly to `/admin/reports`.

## 2) Post-Login Role Resolution

### Role source of truth
- Role is enforced from `public.profiles.role`, not frontend metadata.
- Allowed roles: `admin`, `client`.

### Post-login routing
- Route: `app/auth/post-login/page.tsx`
- Behavior:
  - ensures authenticated user exists
  - initializes `profiles` row when missing
  - redirects:
    - `admin` -> `/admin/reports`
    - `client` -> `/reports`

## 3) Admin Route Protection

### Server-side guard
- File: `lib/portal/auth.ts`
- Function: `requireRole("admin")`
- Used by all admin pages to block non-admin users.

### Admin pages
- `app/admin/layout.tsx` (shared admin shell and nav)
- `app/admin/reports/page.tsx` (report analytics summary)
- `app/admin/reports/[reportId]/page.tsx` (report analytics detail)
- `app/admin/clients/page.tsx` (clients overview)
- `app/admin/report-types/page.tsx` (report type templates overview)
- `app/admin/templates/page.tsx` (report page template CRUD)

## 4) Data and Permission Model

### Schema and RLS
- Main migration: `supabase/migrations/20260227_multitenant_report_portal.sql`
- Updates: `supabase/migrations/20260227_portal_schema_updates.sql`

### Key rules
- `profiles` table links each auth user to app role.
- RLS helper `is_admin()` checks whether current user role is `admin`.
- Admin policies grant full access to admin-managed tables.
- Client policies restrict data to assigned client/report scope.

## 5) Admin Template Management Flow

### CRUD flow
- Page: `app/admin/templates/page.tsx`
- Uses server actions:
  - `createTemplate`
  - `updateTemplate`
  - `deleteTemplate`
- All server actions call `requireRole("admin")` before DB writes.
- Uses `revalidatePath("/admin/templates")` after mutations.

## 6) Error and Recovery Paths

- Auth callback route: `app/auth/confirm/route.ts`
  - handles both `code` and `token_hash` OTP patterns.
- Error display route: `/auth/error`.
- Common admin login failure causes:
  - Supabase auth user email mismatch
  - wrong password
  - profile role not `admin`

## 7) Operational Checklist (Admin)

1. Create auth user in Supabase (`admin@machinevision.global`).
2. Set user password to `admin@machinevision.global` (current requirement).
3. Ensure `public.profiles.role = 'admin'` for that user.
4. Set `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
   - `NEXT_PUBLIC_ADMIN_LOGIN_EMAIL=admin@machinevision.global`
5. Start app and login as Admin.

---

Security note: static admin password in client-side code is acceptable only for temporary/internal usage. Production should move admin credential checks to a secure server-side flow.
