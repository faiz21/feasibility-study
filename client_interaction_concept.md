# Client-Side App Concept (Reader Experience)

## Objective
Build a client-facing report reader app focused on:
- secure company-scoped access
- clear report discovery
- smooth multi-page reading
- measurable engagement and ratings

## Target User
- **Client/Reader user** (not admin)
- Logs in and consumes reports assigned to their company/client account.

## End-to-End Flow

1. **Login + Domain Match**
   - User logs in.
   - System matches user email domain with company domain.
   - If matched, continue to client app.
   - If not matched, show access error/help guidance.

2. **Landing: Accessible Report Types**
   - Show report type cards the user can access via `client_report_type_access`.
   - Each card includes:
     - report type name
     - short description/category
     - number of reports available for this client

3. **Report List by Selected Type**
   - On card click, open report list filtered by selected report type.
   - Show report cards/list with:
     - entity name
     - publish status (reader sees published only)
     - last update / publish date

4. **Report Reading View**
   - On report click, open report reader.
   - Render report content from report pages (`report_pages`) + templates.

5. **Multi-Page Navigation UX**
   - Right-side page navigation rail.
   - Default state: compact circles with page code.
   - Hover state: expands/reveals page name for easier navigation.
   - Click to jump page; keep smooth transitions.

6. **Reading Analytics + Rating**
   - Track reading progress and engagement:
     - page open
     - time spent
     - completion
   - Add rating/review at report end.
   - Store data for report performance analysis.

## Functional Scope

### Access Control
- Enforce domain/company match on login.
- Enforce report visibility by client assignment/access.
- Reader role only; no admin controls in this app.

### Discovery Layer
- Report type landing page (cards).
- Report list page (filtered by selected type).
- Empty states for no accessible types/reports.

### Reading Layer
- Page-by-page rendered report.
- Right rail page navigation (compact → hover reveal).
- Resume support (optional next phase).

### Feedback Layer
- Rating submission (1–5 + optional comment).
- Reading activity logging for analytics.

## UX Requirements
- Fast first paint for report pages.
- Sticky right navigation on desktop.
- Mobile fallback navigation (drawer/bottom sheet).
- Clear state indicators:
  - current page
  - completed pages
  - unrated/rated status

## Suggested Development Plan

### Phase 1 — Auth & Access
- Implement domain-match check after login.
- Add guarded redirect and error states.

### Phase 2 — Landing & Report Type Cards
- Build client landing page.
- Query `client_report_type_access` + report counts.

### Phase 3 — Report List
- Build report list by selected report type.
- Only show client-accessible published reports.

### Phase 4 — Reader + Right Nav
- Build report reader with rendered pages.
- Implement right-side compact/hover-expand navigation.

### Phase 5 — Analytics + Rating
- Log reading interactions.
- Add review/rating submission flow.

### Phase 6 — Hardening
- Loading/empty/error states.
- Performance pass and QA on desktop/mobile.

## Success Criteria
- Reader can discover and open relevant reports in ≤3 clicks.
- Navigation across report pages is intuitive and fast.
- Engagement + ratings are captured reliably for analytics.
