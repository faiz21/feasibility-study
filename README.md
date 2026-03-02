# Multi-Tenant Report Portal

Next.js + Supabase application for secure, role-based report delivery.

## Features
- Magic-link authentication with Supabase
- Role-based access (`admin`, `client`)
- Multi-tenant data isolation via Supabase RLS
- Admin analytics pages
- Client branding management (logo + color palette) for template theming
- Admin template content management (create/edit/delete `report_page_templates`)
- Report activity tracking, resume state, and ratings
- Localization support (`en`, `id`, `ja`)

## Tech Stack
- Next.js App Router
- TypeScript
- Supabase Auth + Postgres (`@supabase/ssr`)
- Tailwind CSS

## Prerequisites
- Node.js 20+
- npm
- Supabase project with schema migrations applied

## Setup
1. Install dependencies:
```bash
npm install
```

2. Create `.env.local` from `.env.example`:
```bash
cp .env.example .env.local
```

3. Set Supabase values in `.env.local`:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `NEXT_PUBLIC_ADMIN_LOGIN_EMAIL` (must match admin user email in Supabase Auth for admin password login)

4. Run dev server:
```bash
npm run dev
```

## Database
Apply migration files in `supabase/migrations`, especially:
- `supabase/migrations/20260227_multitenant_report_portal.sql`
- `supabase/migrations/20260227_portal_schema_updates.sql`
- `supabase/migrations/20260228_client_branding.sql`

## Auth Flow
- Portal login sends magic link with callback to `/auth/confirm`.
- `/auth/confirm` handles Supabase verification and redirects to `/auth/post-login`.
- `/auth/post-login` checks actual role from `profiles` and routes:
  - `admin` -> `/admin/reports`
  - `client` -> `/reports`

## Portal Login Rules (Current)
In `components/portal/magic-link-login-form.tsx`:
- If role is `admin`, user must enter static password: `admin@machinevision.global`.
- If role is `client` (shown as `User` in UI), user must enter `position`.
- Metadata sent to Supabase:
  - admin: `{ role_hint: "admin" }`
  - client/user: `{ role_hint: "client", position: "..." }`

## Admin Routes
- `/admin/clients`
- `/admin/clients` now also manages:
  - client granularities
  - client report type access
  - client entities
  - report sync checker (+ green additions / - red removals)
- `/admin/report-types`
- `/admin/reports`
- `/admin/reports/[reportId]`

## Quality Checks
Lint full app:
```bash
npm run lint
```

Lint a specific area:
```bash
npx eslint app/admin/client-entities/page.tsx
```

Reports route smoke checks (requires app running on `BASE_URL`, default `http://localhost:3000`):
```bash
npm run smoke:reports
```

Optional authenticated checks:
- `AUTH_COOKIE` = browser session cookie string
- `REPORT_TYPE_ID` = report type UUID/ID
- `REPORT_ID` = report UUID/ID

Example:
```bash
BASE_URL=http://localhost:3000 AUTH_COOKIE='sb-...=...' REPORT_TYPE_ID='<type-id>' REPORT_ID='<report-id>' npm run smoke:reports
```

## Notes
- Role hint in login metadata is not authorization; authorization is enforced by `profiles.role` and RLS.
- Static admin password in client code is insecure and visible in browser bundles; prefer server-side validation for production.
- For client entity × report access auto-generation via upsert, apply migration: `supabase/migrations/20260227_reports_entity_template_unique.sql`.
