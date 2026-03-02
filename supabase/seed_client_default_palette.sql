-- Reset all client color palettes to the Machine Vision standard palette.
-- Safe to run multiple times.

begin;

alter table public.clients
  add column if not exists theme_tokens jsonb not null default '{}'::jsonb;

-- Keep future client inserts aligned with the MV default palette.
alter table public.clients
  alter column color_palette set default jsonb_build_object(
    'primary', '#1E40AF',
    'secondary', '#64748B',
    'accent', '#0EA5E9',
    'background', '#F8FAFC',
    'text', '#0F172A'
  );

alter table public.clients
  alter column theme_tokens set default jsonb_build_object(
    '$schema', 'https://design-tokens.org/schema.json',
    'name', 'client-default-theme',
    'version', '1.0.0',
    'tokens', jsonb_build_object(
      'color', jsonb_build_object(
        'primary', jsonb_build_object('$type', 'color', '$value', '#1E40AF'),
        'primary-foreground', jsonb_build_object('$type', 'color', '$value', '#FFFFFF'),
        'secondary', jsonb_build_object('$type', 'color', '$value', '#64748B'),
        'secondary-foreground', jsonb_build_object('$type', 'color', '$value', '#FFFFFF'),
        'accent', jsonb_build_object('$type', 'color', '$value', '#0EA5E9'),
        'accent-foreground', jsonb_build_object('$type', 'color', '$value', '#FFFFFF'),
        'background', jsonb_build_object('$type', 'color', '$value', '#F8FAFC'),
        'foreground', jsonb_build_object('$type', 'color', '$value', '#0F172A'),
        'card', jsonb_build_object('$type', 'color', '$value', '#FFFFFF'),
        'card-foreground', jsonb_build_object('$type', 'color', '$value', '{color.foreground}'),
        'muted', jsonb_build_object('$type', 'color', '$value', '#F1F5F9'),
        'muted-foreground', jsonb_build_object('$type', 'color', '$value', '#475569'),
        'border', jsonb_build_object('$type', 'color', '$value', '#E2E8F0'),
        'input', jsonb_build_object('$type', 'color', '$value', '#FFFFFF'),
        'ring', jsonb_build_object('$type', 'color', '$value', '{color.primary}'),
        'success', jsonb_build_object('$type', 'color', '$value', '#16A34A'),
        'success-foreground', jsonb_build_object('$type', 'color', '$value', '#FFFFFF'),
        'warning', jsonb_build_object('$type', 'color', '$value', '#F59E0B'),
        'warning-foreground', jsonb_build_object('$type', 'color', '$value', '#111827'),
        'critical', jsonb_build_object('$type', 'color', '$value', '#DC2626'),
        'critical-foreground', jsonb_build_object('$type', 'color', '$value', '#FFFFFF'),
        'info', jsonb_build_object('$type', 'color', '$value', '#2563EB'),
        'info-foreground', jsonb_build_object('$type', 'color', '$value', '#FFFFFF'),
        'cover-background', jsonb_build_object('$type', 'color', '$value', '{color.primary}'),
        'cover-overlay', jsonb_build_object('$type', 'color', '$value', 'rgba(0,0,0,0.4)'),
        'cover-title', jsonb_build_object('$type', 'color', '$value', '#FFFFFF'),
        'cover-subtitle', jsonb_build_object('$type', 'color', '$value', '#E2E8F0'),
        'section-title', jsonb_build_object('$type', 'color', '$value', '{color.foreground}'),
        'section-body', jsonb_build_object('$type', 'color', '$value', '{color.muted-foreground}'),
        'kpi-value', jsonb_build_object('$type', 'color', '$value', '{color.primary}'),
        'kpi-label', jsonb_build_object('$type', 'color', '$value', '{color.muted-foreground}'),
        'chart-grid', jsonb_build_object('$type', 'color', '$value', '#E5E7EB'),
        'chart-axis', jsonb_build_object('$type', 'color', '$value', '#6B7280'),
        'chart-series-1', jsonb_build_object('$type', 'color', '$value', '{color.primary}'),
        'chart-series-2', jsonb_build_object('$type', 'color', '$value', '#10B981'),
        'chart-series-3', jsonb_build_object('$type', 'color', '$value', '#F59E0B'),
        'table-header', jsonb_build_object('$type', 'color', '$value', '{color.muted}'),
        'table-row', jsonb_build_object('$type', 'color', '$value', '{color.card}'),
        'table-border', jsonb_build_object('$type', 'color', '$value', '{color.border}'),
        'tag-background', jsonb_build_object('$type', 'color', '$value', '{color.accent}'),
        'tag-foreground', jsonb_build_object('$type', 'color', '$value', '{color.accent-foreground}'),
        'disabled-background', jsonb_build_object('$type', 'color', '$value', '#E5E7EB'),
        'disabled-foreground', jsonb_build_object('$type', 'color', '$value', '#9CA3AF')
      )
    )
  );

-- Normalize existing clients to the same default palette.
update public.clients
set color_palette = jsonb_build_object(
  'primary', '#1E40AF',
  'secondary', '#64748B',
  'accent', '#0EA5E9',
  'background', '#F8FAFC',
  'text', '#0F172A'
);

update public.clients
set theme_tokens = jsonb_build_object(
  '$schema', 'https://design-tokens.org/schema.json',
  'name', 'client-default-theme',
  'version', '1.0.0',
  'tokens', jsonb_build_object(
    'color', jsonb_build_object(
      'primary', jsonb_build_object('$type', 'color', '$value', '#1E40AF'),
      'primary-foreground', jsonb_build_object('$type', 'color', '$value', '#FFFFFF'),
      'secondary', jsonb_build_object('$type', 'color', '$value', '#64748B'),
      'secondary-foreground', jsonb_build_object('$type', 'color', '$value', '#FFFFFF'),
      'accent', jsonb_build_object('$type', 'color', '$value', '#0EA5E9'),
      'accent-foreground', jsonb_build_object('$type', 'color', '$value', '#FFFFFF'),
      'background', jsonb_build_object('$type', 'color', '$value', '#F8FAFC'),
      'foreground', jsonb_build_object('$type', 'color', '$value', '#0F172A'),
      'card', jsonb_build_object('$type', 'color', '$value', '#FFFFFF'),
      'card-foreground', jsonb_build_object('$type', 'color', '$value', '{color.foreground}'),
      'muted', jsonb_build_object('$type', 'color', '$value', '#F1F5F9'),
      'muted-foreground', jsonb_build_object('$type', 'color', '$value', '#475569'),
      'border', jsonb_build_object('$type', 'color', '$value', '#E2E8F0'),
      'input', jsonb_build_object('$type', 'color', '$value', '#FFFFFF'),
      'ring', jsonb_build_object('$type', 'color', '$value', '{color.primary}'),
      'success', jsonb_build_object('$type', 'color', '$value', '#16A34A'),
      'success-foreground', jsonb_build_object('$type', 'color', '$value', '#FFFFFF'),
      'warning', jsonb_build_object('$type', 'color', '$value', '#F59E0B'),
      'warning-foreground', jsonb_build_object('$type', 'color', '$value', '#111827'),
      'critical', jsonb_build_object('$type', 'color', '$value', '#DC2626'),
      'critical-foreground', jsonb_build_object('$type', 'color', '$value', '#FFFFFF'),
      'info', jsonb_build_object('$type', 'color', '$value', '#2563EB'),
      'info-foreground', jsonb_build_object('$type', 'color', '$value', '#FFFFFF'),
      'cover-background', jsonb_build_object('$type', 'color', '$value', '{color.primary}'),
      'cover-overlay', jsonb_build_object('$type', 'color', '$value', 'rgba(0,0,0,0.4)'),
      'cover-title', jsonb_build_object('$type', 'color', '$value', '#FFFFFF'),
      'cover-subtitle', jsonb_build_object('$type', 'color', '$value', '#E2E8F0'),
      'section-title', jsonb_build_object('$type', 'color', '$value', '{color.foreground}'),
      'section-body', jsonb_build_object('$type', 'color', '$value', '{color.muted-foreground}'),
      'kpi-value', jsonb_build_object('$type', 'color', '$value', '{color.primary}'),
      'kpi-label', jsonb_build_object('$type', 'color', '$value', '{color.muted-foreground}'),
      'chart-grid', jsonb_build_object('$type', 'color', '$value', '#E5E7EB'),
      'chart-axis', jsonb_build_object('$type', 'color', '$value', '#6B7280'),
      'chart-series-1', jsonb_build_object('$type', 'color', '$value', '{color.primary}'),
      'chart-series-2', jsonb_build_object('$type', 'color', '$value', '#10B981'),
      'chart-series-3', jsonb_build_object('$type', 'color', '$value', '#F59E0B'),
      'table-header', jsonb_build_object('$type', 'color', '$value', '{color.muted}'),
      'table-row', jsonb_build_object('$type', 'color', '$value', '{color.card}'),
      'table-border', jsonb_build_object('$type', 'color', '$value', '{color.border}'),
      'tag-background', jsonb_build_object('$type', 'color', '$value', '{color.accent}'),
      'tag-foreground', jsonb_build_object('$type', 'color', '$value', '{color.accent-foreground}'),
      'disabled-background', jsonb_build_object('$type', 'color', '$value', '#E5E7EB'),
      'disabled-foreground', jsonb_build_object('$type', 'color', '$value', '#9CA3AF')
    )
  )
);

commit;
