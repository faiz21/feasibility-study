# Task Plan — Admin Master Data Management

## Goal
Implement admin master-data management flows for clients, report types, report template pages, client template access, and client report assignment.

## Phases
1. **Discovery & Scope** *(complete)*
   - Review current admin pages, schema, and reusable UI patterns
   - Map required UX flow to existing database model

2. **Admin Flow Build** *(complete)*
   - Add/upgrade pages for:
     - Clients management
     - Report types management
     - Report type page manager
     - Client access mapping
     - Client report assignment
   - Add server actions for create/edit/delete/assign/unassign

3. **Navigation + UX coherence** *(complete)*
   - Update admin sidebar links and page headers
   - Add empty/error states and destructive warnings

4. **Validation & Handoff** *(complete)*
   - Run lint
   - Capture outcomes and known gaps

## Decisions
- Use server actions inside route pages for fast implementation and SSR consistency.
- Use current schema (`client_report_type_access`, `client_reports`, `report_page_templates`) without adding breaking DB changes unless required.

## Errors Encountered
| Error | Attempt | Resolution |
|---|---|---|
| None yet | - | - |

---

# Task Plan — Client Branding In Report Templates

## Goal
Add client-level branding fields (logo + color palette) in client management and expose those values to report template rendering.

## Phases
1. **Discovery & Design** *(complete)*
   - Confirm current `clients` schema and admin client form fields
   - Confirm report render pipeline and template placeholder model

2. **Schema + Admin Client Updates** *(complete)*
   - Add migration for `clients.logo_url` and `clients.color_palette`
   - Extend `/admin/clients` create/edit actions + forms
   - Show branding preview in client table

3. **Template Render Branding Injection** *(complete)*
   - Load client branding in report detail page
   - Inject branding object into template render payload
   - Keep sensible defaults for missing branding

4. **Validation & Handoff** *(complete)*
   - Run lint for changed files
   - Update findings and progress logs

## Decisions
- Store palette as `jsonb` to keep one extensible field and avoid repeated migrations.
- Expose both `client.*` and `theme.*` placeholders to simplify HTML template authoring.

## Errors Encountered
| Error | Attempt | Resolution |
|---|---|---|
| None yet | - | - |
