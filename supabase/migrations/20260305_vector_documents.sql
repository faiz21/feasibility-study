-- Generic pgvector "documents" table + similarity search function (Supabase-style)
-- Matches the standard pattern:
-- - extension lives in `extensions` schema
-- - embedding column uses `extensions.vector(1536)`
--
-- Change the vector dimension (1536) if your embedding model differs.

create schema if not exists extensions;

-- Enable the pgvector extension to work with embedding vectors
create extension if not exists vector with schema extensions;

-- If the extension already exists in a different schema, relocate it to `extensions`
do $$
begin
  if exists (select 1 from pg_extension where extname = 'vector') then
    if (select n.nspname
        from pg_extension e
        join pg_namespace n on n.oid = e.extnamespace
        where e.extname = 'vector') <> 'extensions' then
      execute 'alter extension vector set schema extensions';
    end if;
  end if;
end;
$$;

-- Create a table to store your documents
create table if not exists public.documents (
  id bigserial primary key,
  content text, -- corresponds to Document.pageContent
  metadata jsonb, -- corresponds to Document.metadata
  embedding extensions.vector(1536) -- 1536 works for OpenAI embeddings, change if needed
);

-- Create a function to search for documents
create or replace function public.match_documents (
  query_embedding extensions.vector(1536),
  match_count int default null,
  filter jsonb default '{}'
) returns table (
  id bigint,
  content text,
  metadata jsonb,
  similarity float
)
language plpgsql
as $$
#variable_conflict use_column
begin
  return query
  select
    id,
    content,
    metadata,
    1 - (documents.embedding <=> query_embedding) as similarity
  from public.documents as documents
  where documents.metadata @> filter
  order by documents.embedding <=> query_embedding
  limit match_count;
end;
$$;

