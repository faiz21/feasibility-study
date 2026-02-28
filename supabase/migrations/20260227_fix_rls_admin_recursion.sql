-- Fix RLS recursion causing "stack depth limit exceeded" on admin writes.
-- Root cause: `is_admin()` queried `profiles` while `profiles` policies also referenced `is_admin()`.
-- Making helper functions SECURITY DEFINER avoids recursive policy evaluation.

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles p
    where p.user_id = auth.uid()
      and p.role = 'admin'
  );
$$;

create or replace function public.user_client_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select p.client_id
  from public.profiles p
  where p.user_id = auth.uid();
$$;

create or replace function public.can_access_report(rid uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.reports r
    join public.report_entities e on e.id = r.entity_id
    join public.client_reports cr on cr.report_id = r.id
    where r.id = rid
      and (
        public.is_admin()
        or (
          r.status = 'published'
          and cr.client_id = public.user_client_id()
        )
      )
  );
$$;
