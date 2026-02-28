-- Add client branding fields for report template theming.

alter table public.clients
  add column if not exists logo_url text;

alter table public.clients
  add column if not exists color_palette jsonb not null default jsonb_build_object(
    'primary', '#0f172a',
    'secondary', '#334155',
    'accent', '#0ea5e9',
    'background', '#ffffff',
    'text', '#0f172a'
  );
