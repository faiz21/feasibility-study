# Client Granularity + Client Entity Management Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add an admin flow to manage client-to-granularity access (multi-select), then CRUD client entities grouped by those configured granularities.

**Architecture:** Add a new join table in Supabase (`client_granularity_access`) with RLS admin policies. Build two admin pages: one for configuring client granularity access and one for managing client entities grouped by selected granularity. Enforce server-side validation in actions so entity CRUD only uses allowed granularities per client.

**Tech Stack:** Next.js App Router (server components + server actions), Supabase Postgres + RLS, TypeScript, existing UI primitives (`Card`, `FormDialog`, `DataGrid`, confirm dialogs).

---

### Task 1: Add database support for client-granularity mapping

**Files:**
- Create: `supabase/migrations/20260227_client_granularity_access.sql`
- Modify: `findings.md`
- Modify: `progress.md`

**Step 1: Write a failing verification query (before migration)**

```sql
select count(*) from public.client_granularity_access;
```

Expected: error `relation "public.client_granularity_access" does not exist`.

**Step 2: Create migration with table + indexes + RLS**

```sql
create table if not exists public.client_granularity_access (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients(id) on delete cascade,
  granularity_id uuid not null references public.granularities(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (client_id, granularity_id)
);

create index if not exists idx_client_granularity_access_client
  on public.client_granularity_access (client_id);

create index if not exists idx_client_granularity_access_granularity
  on public.client_granularity_access (granularity_id);

alter table public.client_granularity_access enable row level security;

drop policy if exists "admin_all_client_granularity_access" on public.client_granularity_access;
create policy "admin_all_client_granularity_access"
  on public.client_granularity_access
  for all
  using (public.is_admin())
  with check (public.is_admin());
```

**Step 3: Run migration in Supabase and verify**

Run in SQL editor:

```sql
select count(*) from public.client_granularity_access;
```

Expected: query succeeds.

**Step 4: Commit**

```bash
git add supabase/migrations/20260227_client_granularity_access.sql
git commit -m "feat(db): add client granularity access mapping table"
```

---

### Task 2: Add admin route for client-granularity management

**Files:**
- Modify: `app/admin/layout.tsx`
- Create: `app/admin/client-granularity/page.tsx`

**Step 1: Add nav link**
- Add `Client Granularity` link in admin shell links.
- Ensure route is under `/admin/client-granularity`.

**Step 2: Build page shell**
- Add page with:
  - client selector
  - available granularities list with checkbox multi-select
  - save button
  - success/error banners

**Step 3: Add server action for upsert mapping**
- Action flow:
  1. `requireRole("admin")`
  2. read selected `client_id` and selected `granularity_ids[]`
  3. delete existing rows for client
  4. bulk insert selected rows
  5. `revalidatePath("/admin/client-granularity")`

**Step 4: Manual verification**
- Select client A, select 2 granularities, save.
- Reload page and verify selections persist.

**Step 5: Commit**

```bash
git add app/admin/layout.tsx app/admin/client-granularity/page.tsx
git commit -m "feat(admin): add client granularity management flow"
```

---

### Task 3: Add admin route for client-entity CRUD grouped by granularity

**Files:**
- Create: `app/admin/client-entities/page.tsx`
- Modify: `app/admin/layout.tsx`

**Step 1: Add nav link**
- Add `Client Entities` link to admin layout.

**Step 2: Add page filters**
- Client dropdown
- optional search by entity name
- load client’s allowed granularities from `client_granularity_access`

**Step 3: Render grouped table/list**
- Group entities by granularity label.
- Empty state per group: “No entities yet”.
- Overall empty state when client has no allowed granularities:
  - “Configure client granularity first.”

**Step 4: Add create/edit/delete UI**
- Create form fields:
  - `client_id` (selected client)
  - `granularity_id` (only allowed options)
  - `name` (required)
  - `description` (optional)
  - `photo_url` (optional)
  - `tags` (comma-separated optional)
- Edit form with same fields
- Delete with confirm dialog

**Step 5: Commit**

```bash
git add app/admin/layout.tsx app/admin/client-entities/page.tsx
git commit -m "feat(admin): add client entity management grouped by granularity"
```

---

### Task 4: Enforce server-side validation for allowed client granularities

**Files:**
- Modify: `app/admin/client-entities/page.tsx`

**Step 1: Write failing behavior check**
- Attempt create entity with a `granularity_id` not configured for selected client.
- Expected before fix: row is inserted (bad).

**Step 2: Implement validation in create/update actions**
- Before insert/update:
  - query `client_granularity_access` for `(client_id, granularity_id)`
  - if not found, redirect with error:
    - `"Selected granularity is not enabled for this client"`

**Step 3: Re-test behavior**
- Retry invalid create/update.
- Expected: blocked, row not persisted.

**Step 4: Commit**

```bash
git add app/admin/client-entities/page.tsx
git commit -m "fix(admin): enforce client granularity access on entity CRUD"
```

---

### Task 5: Improve UX consistency with existing admin patterns

**Files:**
- Modify: `app/admin/client-granularity/page.tsx`
- Modify: `app/admin/client-entities/page.tsx`

**Step 1: Align UI primitives**
- Use `PageHeader`, `StatCard`, `Card`, `FormDialog`, `ConfirmSubmitDialogButton`, `DataGrid`.

**Step 2: Add relation hints**
- On client entities page, show badges:
  - selected client
  - total allowed granularities
  - entity count

**Step 3: Add clear empty/error states**
- No clients
- No configured granularities for selected client
- No entities for a granularity

**Step 4: Commit**

```bash
git add app/admin/client-granularity/page.tsx app/admin/client-entities/page.tsx
git commit -m "refactor(admin): align client granularity and entities UX with design system"
```

---

### Task 6: Validation + docs update

**Files:**
- Modify: `README.md`
- Modify: `findings.md`
- Modify: `progress.md`

**Step 1: Run lint**

Run:

```bash
npx eslint app/admin/layout.tsx app/admin/client-granularity/page.tsx app/admin/client-entities/page.tsx
npm run lint
```

Expected: all pass.

**Step 2: Add README section**
- Add admin master-data module notes for:
  - `/admin/client-granularity`
  - `/admin/client-entities`
- Include requirement: configure client granularity before entity CRUD.

**Step 3: Manual smoke checklist**
- Create granularity mapping for a client.
- Create entity under allowed granularity.
- Confirm grouped rendering.
- Confirm invalid granularity insert is blocked.
- Update and delete entity.

**Step 4: Commit**

```bash
git add README.md findings.md progress.md
git commit -m "docs: add client granularity and client entities admin flow notes"
```

---

## Notes for implementer
- Prefer no new API routes; keep server actions in route files for consistency.
- Keep table/field naming in snake_case aligned with existing schema.
- Keep migrations additive; do not edit existing applied migrations.
- Avoid broad refactors outside admin flow scope (DRY/YAGNI).
