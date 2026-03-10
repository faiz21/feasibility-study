# Client Feasibility Study Report Portal Concept

## 1. Purpose
Build a multi-tenant report portal where each client can access feasibility study reports in a controlled, trackable, multilingual workflow, while admins manage templates, entities, assignments, publication, and content quality.

## 2. Core Roles
| Role | Objective | Main Access |
|---|---|---|
| `admin` | Configure and operate report delivery across tenants | `/admin/*` |
| `client` | Consume assigned reports and provide page-level feedback | `/reports*` |
| `admin preview` | Validate client experience using client scope | `/reports*` (preview mode) |

## 3. Product Modules
| Module | Description |
|---|---|
| Authentication & Profile | Login, role resolution, domain-based client mapping, locale persistence |
| Tenant Management | Client master data, branding info, enabled granularities, report type access |
| Entity Management | Per-client report entities (plants/sites/units) with CRUD and CSV import |
| Report Type Templates | Reusable report type definitions and page template catalogs |
| Page Template Builder | Per-page HTML template + sample JSON contract + preview |
| Report Materialization & Sync | Generate/update reports for entities based on access matrix |
| Client Report Operations | Publish/draft state, content editing, markdown preview |
| AI Review (n8n) | EN-only chat refinement, score extraction, summary/notes capture |
| Client Report Reader | Single report reader, page navigation, locale rendering, resume |
| Telemetry & Analytics | Activity tracking, completion metrics, page ratings, admin dashboards |

## 4. Main User Journeys
1. Admin sets up client and access:
   Client profile -> enable granularities -> enable report types -> manage entities.
2. System syncs report assignments:
   Entity + access matrix -> materialized reports/pages.
3. Admin prepares report content:
   Per-page locale uploads (EN/ID/JA) + rendered preview + markdown preview.
4. Admin runs AI review:
   EN markdown chat with n8n -> updates sections -> finalize -> save markdown + scoring fields.
5. Client consumes report:
   Open assigned report -> navigate pages -> read localized content -> submit per-page rating.
6. System logs usage:
   Page open/scroll/time -> resume state -> analytics dashboards for admins.

## 5. Page Architecture
| Area | Key Pages |
|---|---|
| Public/Auth | `/`, `/login`, `/auth/*` |
| Admin Operations | `/admin/clients`, `/admin/client-access`, `/admin/client-granularity`, `/admin/client-entities` |
| Admin Template Ops | `/admin/report-types`, `/admin/report-types/[reportTypeId]/pages` |
| Admin Report Ops | `/admin/client-reports`, `/admin/client-reports/[reportId]/edit`, `/admin/client-reports/[reportId]/markdown-preview` |
| Admin Analytics | `/admin/reports`, `/admin/reports/[reportId]` |
| Client Portal | `/reports`, `/reports/[typeId]/[reportId]` |

## 6. Data Model Concept (High-Level)
| Domain | Main Tables |
|---|---|
| Identity & Tenant | `profiles`, `clients`, `granularities` |
| Template Layer | `report_type_templates`, `report_page_templates` |
| Report Layer | `report_entities`, `reports`, `report_pages`, `report_translations` |
| Access Layer | `client_report_type_access`, `client_granularity_access`, `client_reports` |
| Engagement Layer | `report_page_activity`, `report_resume`, `report_ratings`, `user_access_logs` |
| Editorial/Review | `raw_report`, `raw_report_id`, `raw_report_jp`, `overall`, `outline_alignment`, `writing_alignment`, `analysis_score`, `notes`, `page_summary` on `report_pages` |

## 7. API Surface (Current)
| API | Responsibility |
|---|---|
| `POST /api/profile/locale` | Update user locale |
| `POST /api/reports/[reportId]/activity` | Track read activity |
| `POST /api/reports/[reportId]/resume` | Save reading resume state |
| `POST /api/reports/[reportId]/rating` | Save per-page rating |
| `POST /api/admin/report-markdown-chat` | Proxy chat/finalize calls to n8n |
| `POST /api/admin/report-markdown-save` | Persist markdown + AI score fields |

## 8. Quality & Governance Rules
1. Report editing on admin side is per-page.
2. Locale content is file-based and isolated by EN/ID/JA columns.
3. AI review chat is EN-only on markdown preview.
4. Client access is tenant-scoped and role-protected.
5. Reader behavior is tracked for analytics and resume.

## 9. Target Outcome
The app provides a full operational loop:
template governance -> report generation -> editorial refinement -> multilingual delivery -> client feedback -> measurable engagement.


Compiled App Inventory (Current Codebase)

1) Roles
Role	Access Scope	Key Permissions
admin	/admin/*	Manage clients, entities, granularity access, template catalog, template pages, report syncing, report publish status, content editing, markdown AI review
client	/reports*	View assigned reports, switch locale, read per-page content, submit per-page ratings, activity/resume tracking
admin preview	/reports* via requireRole("client") fallback	Admin can preview as client tenant (read/testing mode behavior)
2) UI Pages (App Routes)
Path	Purpose
/	Landing + role-based redirect
/login	Main login entry
/protected	Protected sample page
/case-study	Case study renderer showcase
/design-system	Design system showcase
Auth Path	Purpose
/auth/login	Auth login page
/auth/sign-up	Sign up
/auth/sign-up-success	Post-sign-up confirmation
/auth/forgot-password	Password reset request
/auth/update-password	Password update flow
/auth/error	Auth error page
/auth/confirm	Auth confirmation route handler
Admin Path	Purpose
/admin/clients	Tenant management, branding/theme setup, sync checker
/admin/client-access	Client ↔ report type access control
/admin/client-granularity	Client ↔ granularity enablement
/admin/client-entities	Entity CRUD + CSV import
/admin/report-types	Report type template CRUD
/admin/report-types/[reportTypeId]/pages	Page template CRUD + preview/sample/template uploads
/admin/client-reports	Report assignments by entity, publish/edit/markdown preview actions
/admin/client-reports/[reportId]/edit	Per-page locale JSON upload + rendered preview
/admin/client-reports/[reportId]/markdown-preview	Per-page markdown preview + AI review chat (EN-only chat)
/admin/reports	Portfolio analytics overview
/admin/reports/[reportId]	Per-report analytics detail
Client Report Path	Purpose
/reports	Client report catalog by granularity/entity
/reports/[typeId]	Type context route
/reports/[typeId]/[reportId]	Report reader with page navigation + rating
3) API Modules
API Route	Function
/api/profile/locale	Persist user locale
/api/reports/[reportId]/activity	Track page time/scroll/completion
/api/reports/[reportId]/resume	Save resume cursor/page
/api/reports/[reportId]/rating	Upsert per-page rating/comment
/api/admin/report-markdown-chat	Admin proxy to n8n webhook
/api/admin/report-markdown-save	Persist markdown + AI score fields to report_pages
4) Core Feature Set
Multi-tenant auth with role-based route guarding.
Client-domain-based post-login tenant assignment.
Admin tenant operations (clients, entities, access, granularities).
Report type and page template management (HTML + sample JSON).
Report assignment/sync and publish-state operations.
Per-page multilingual content editing (EN/ID/JA).
Admin markdown preview with page selector and locale selector.
n8n AI review chat integration (EN chat, finalize flow, markdown save).
Client report reader with locale persistence and right-side page navigation.
Per-page engagement tracking (time, scroll, completion) + resume.
Per-page user ratings/comments + analytics dashboards.
5) Main Module Groups
Module Group	Key Files
Auth/Role guard	lib/portal/auth.ts, app/page.tsx, app/auth/post-login/page.tsx
Report rendering	lib/portal/template.ts, components/portal/report-viewer.tsx, app/reports/[typeId]/[reportId]/page.tsx
Portal shell/navigation	components/portal/app-shell.tsx, components/portal/nav-link.tsx, components/portal/language-switcher.tsx
Admin markdown AI tools	components/admin/report-markdown-chat-room.tsx, app/api/admin/report-markdown-chat/route.ts, app/api/admin/report-markdown-save/route.ts
Theme/tokens	lib/report-view-theme.ts, lib/client-theme.ts
Logging/access	lib/portal/logging.ts, user_access_logs policies/migrations
Supabase client/server	lib/supabase/server.ts, lib/supabase/client.ts
6) Data Model (Main Tables)
clients, profiles, granularities, report_type_templates, report_page_templates, report_entities, reports, report_pages, report_page_translations, client_reports, report_page_activity, report_resume, report_ratings, client_report_type_access, client_granularity_access, user_access_logs, internal_notes, page_notes.

report_pages is currently used by app logic for:

locale content JSON (en_content, id_content, ja_content)
markdown content (raw_report, raw_report_id, raw_report_jp)
AI review fields (overall, outline_alignment, writing_alignment, analysis_score, notes, page_summary)