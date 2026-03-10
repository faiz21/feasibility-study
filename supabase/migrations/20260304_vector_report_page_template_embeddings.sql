-- Vector (pgvector) support for retrieving page-template generation guidance
-- Notes:
-- - `embedding` dimension must match your embedding model output.
--   Defaulted to 1536 (common for many 1.5k-dim embedding models).

create extension if not exists vector;

create table if not exists public.report_page_template_embeddings (
  id uuid primary key default gen_random_uuid(),
  report_page_template_id uuid not null references public.report_page_templates(id) on delete cascade,
  instruction text not null,
  format jsonb not null default '{}'::jsonb,
  embedding vector(1536) not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Avoid duplicates (same instruction+format for a template)
create unique index if not exists report_page_template_embeddings_tpl_hash_uq
  on public.report_page_template_embeddings (
    report_page_template_id,
    md5(instruction || '|' || format::text)
  );

-- Vector similarity index (cosine distance)
create index if not exists report_page_template_embeddings_embedding_ivfflat
  on public.report_page_template_embeddings
  using ivfflat (embedding vector_cosine_ops)
  with (lists = 100);

alter table public.report_page_template_embeddings enable row level security;

create policy "admin_all_report_page_template_embeddings"
  on public.report_page_template_embeddings
  for all
  using (public.is_admin())
  with check (public.is_admin());

