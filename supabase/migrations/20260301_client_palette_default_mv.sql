-- Align clients.color_palette default with the agreed MV token baseline.

alter table public.clients
  alter column color_palette set default jsonb_build_object(
    'primary', '#1E40AF',
    'secondary', '#64748B',
    'accent', '#0EA5E9',
    'background', '#F8FAFC',
    'text', '#0F172A'
  );
