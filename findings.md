# Findings

## Schema and capabilities
- `clients` has `name`, `code`, `domain`, `default_locale`.
- `report_type_templates` has `name`, `description`, `category`, `granularity_id`, `is_active`.
- `report_page_templates` stores page templates with unique `(report_type_template_id, page_key)` and `(report_type_template_id, page_order)`.
- `client_report_type_access` exists for client-to-template enablement.
- `client_reports` exists for client-to-report assignment.

## Existing admin coverage
- Existing pages:
  - `/admin/clients` (read-only list)
  - `/admin/report-types` (read-only list)
  - `/admin/templates` (global template CRUD)
  - `/admin/reports` (analytics)
- Missing dedicated UX flows:
  - client access mapping UI
  - client report assignment UI
  - report-type-specific page manager
  - create/edit flows for clients and report types

## Implemented in this session
- `app/admin/clients/page.tsx` now supports:
  - create/edit/delete
  - search/filter/sort
  - relation counts (template access + report assignment)
  - guarded delete when reports are assigned
- `app/admin/report-types/page.tsx` now supports:
  - create/edit/delete with usage guard
  - filter by category/granularity/active
  - manage-pages deep link per type
- Added dedicated report-type pages manager:
  - `app/admin/report-types/[reportTypeId]/pages/page.tsx`
  - add/edit/delete and move up/down order
- Added client template access manager:
  - `app/admin/client-access/page.tsx`
  - dual-list add/remove interaction
- Added client report assignment manager:
  - `app/admin/client-reports/page.tsx`
  - assign published reports + filtered listing + unassign
- Updated sidebar navigation:
  - `app/admin/layout.tsx` includes `Client Access` and `Client Reports`.
- Added reusable confirmation submit control:
  - `components/ui/confirm-submit-dialog-button.tsx`
  - modal dialog UX for destructive admin actions (delete/unassign/remove access).
- Added reusable create/edit dialog shell:
  - `components/ui/form-dialog.tsx`
  - used for create/edit flows in clients, report types, report-type pages, and report assignment.
- Added active navigation highlighting:
  - `components/portal/nav-link.tsx`
  - integrated in `components/portal/app-shell.tsx`.
- Added compact row action menu primitive:
  - `components/ui/row-actions.tsx`
  - applied in clients and report-types list actions.
- Added reusable data-grid primitives:
  - `components/ui/data-grid.tsx`
  - applied to clients directory and client-reports assignment table for consistent table structure.
- Extended data-grid adoption to report types catalog:
  - `app/admin/report-types/page.tsx`
  - now uses the same table primitives and action pattern.
- Report types catalog is now grouped by category for better scanability.

## Latest updates
- Removed standalone `/admin/templates` route and navigation link.
- Template management is now centralized under:
  - `/admin/report-types/[reportTypeId]/pages`
- Added migration for page-template asset fields:
  - `supabase/migrations/20260227_report_page_template_assets.sql`
  - columns: `readme_markdown` (text), `sample_data` (jsonb)
- Added upload support per page template:
  - HTML file (`.html`)
  - README file (`.md`)
  - sample data file (`.json`)
  - with textarea fallback and JSON validation.
- Added migration for client granularity mapping:
  - `supabase/migrations/20260227_client_granularity_access.sql`
  - join table `client_granularity_access` with RLS admin policy.
- Added admin client-granularity management page:
  - `app/admin/client-granularity/page.tsx`
  - multi-select granularities per client with replace-save server action.
- Added admin client-entities CRUD page:
  - `app/admin/client-entities/page.tsx`
  - grouped view by allowed granularities for selected client.
  - create/edit/delete flows restricted to configured client granularities.
- Updated admin navigation with:
  - `/admin/client-granularity`
  - `/admin/client-entities`
- Updated README route list for new pages.

## Constraints
- Current schema does not include `deleted_at` for soft delete, so delete behavior must be hard delete or guarded delete.

## New task discovery (client branding)
- `clients` currently stores `name`, `code`, `domain`, `default_locale`, but no branding fields.
- `/admin/clients` create/edit forms currently manage only name/code/domain/default locale.
- Report HTML rendering happens in `app/reports/[reportId]/page.tsx` using `renderTemplate(html, content)` where placeholders resolve via flattened object keys.
- Best insertion point for branding data is the render payload before calling `renderTemplate`, so templates can use extra placeholders without changing storage for report page content.

## Client branding implementation
- Added migration `supabase/migrations/20260228_client_branding.sql`:
  - `clients.logo_url` (`text`, nullable)
  - `clients.color_palette` (`jsonb`, non-null default with keys `primary`, `secondary`, `accent`, `background`, `text`)
- Updated `/admin/clients`:
  - create/edit actions now persist `logo_url` + `color_palette`
  - create/edit forms include logo URL and color picker inputs
  - client directory table now shows branding preview (logo + swatches)
- Updated report render path (`app/reports/[reportId]/page.tsx`):
  - loads client branding with page data
  - injects extra template payload keys:
    - `client.logo_url`, `client.color_palette.*`, and other client metadata
    - `theme.*` color aliases
    - `branding.logo_url` + `branding.*` color aliases
- Existing templates remain compatible because original page content is preserved and branding keys are additive.
