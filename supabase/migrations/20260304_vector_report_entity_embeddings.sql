-- Vector (pgvector) support for semantic search / RAG
-- Notes:
-- - `embedding` dimension must match your embedding model output.
--   Defaulted to 1536 (common for many 1.5k-dim embedding models).

create extension if not exists vector;

create table if not exists public.report_entity_embeddings (
  id uuid primary key default gen_random_uuid(),
  entity_id uuid not null references public.report_entities(id) on delete cascade,
  content text not null,
  embedding vector(1536) not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Helpful for paging and cleanup; avoids duplicate chunks per entity
create unique index if not exists report_entity_embeddings_entity_id_content_uq
  on public.report_entity_embeddings (entity_id, md5(content));

-- Vector similarity index (cosine distance)
-- Tune `lists` based on row count; higher lists improves recall but increases build cost.
create index if not exists report_entity_embeddings_embedding_ivfflat
  on public.report_entity_embeddings
  using ivfflat (embedding vector_cosine_ops)
  with (lists = 100);

alter table public.report_entity_embeddings enable row level security;

-- Start strict: admin-only access (aligns with other admin_* policies in this repo).
create policy "admin_all_report_entity_embeddings"
  on public.report_entity_embeddings
  for all
  using (public.is_admin())
  with check (public.is_admin());

