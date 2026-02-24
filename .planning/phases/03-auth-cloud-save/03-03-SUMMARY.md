---
phase: 03-auth-cloud-save
plan: 03
subsystem: database, ui
tags: [supabase, crud, zustand, react, i18n, cloud-save]

# Dependency graph
requires:
  - phase: 03-auth-cloud-save/03-01
    provides: Supabase client, auth store, Database type, QuoteData type
  - phase: 03-auth-cloud-save/03-02
    provides: Auth UI (LoginPage, UserMenu with /estimates link)
  - phase: 02-core-wizard-kalkulator
    provides: Wizard store (rooms, vatRate), SummaryStep, calc functions
provides:
  - SaveEstimateDialog for saving/overwriting estimates to Supabase
  - EstimatesList for browsing saved estimates with load/delete/overwrite
  - EstimateActions hooks (useLoadEstimate, useDeleteEstimate)
  - EstimatesPage with auth guard at /estimates route
  - Save to Cloud button in SummaryStep for authenticated users
  - Guest login prompt in SummaryStep (non-intrusive)
  - Full estimates i18n keys (PL + EN)
affects: []

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Supabase CRUD with typed Database interface and RLS"
    - "useWizardStore.getState() for snapshot reads outside React render"
    - "QuoteRow type assertion for Supabase select results"

key-files:
  created:
    - src/components/estimates/SaveEstimateDialog.tsx
    - src/components/estimates/EstimatesList.tsx
    - src/components/estimates/EstimateActions.tsx
    - src/pages/EstimatesPage.tsx
  modified:
    - src/components/wizard/SummaryStep.tsx
    - src/router/index.tsx
    - src/i18n/locales/pl/common.json
    - src/i18n/locales/en/common.json
    - src/types/database.ts

key-decisions:
  - "Database type updated: added Relationships field to quotes table to match Supabase v2.97 GenericSchema requirement"
  - "QuoteRow type assertion used for select('*') results due to tsc -b strict inference"
  - "EstimateActions as hooks module (useLoadEstimate, useDeleteEstimate) rather than inline in list"
  - "window.confirm() for delete confirmation -- keeps it simple per plan guidance"
  - "Optimistic delete: remove from local state immediately after successful API call"

patterns-established:
  - "Supabase CRUD pattern: typed Database interface with Relationships + QuoteRow assertion for selects"
  - "Auth-gated page pattern: useEffect redirect to /login when !user && !isLoading"
  - "Cloud save integration: Save to Cloud Card in SummaryStep with auth-conditional rendering"

# Metrics
duration: 5min
completed: 2026-02-24
---

# Phase 3 Plan 3: Estimates CRUD + Cloud Save Summary

**Full estimates CRUD (save, load, overwrite, delete) via Supabase with SaveEstimateDialog in SummaryStep and EstimatesPage at /estimates**

## Performance

- **Duration:** 5 min
- **Started:** 2026-02-24T12:30:09Z
- **Completed:** 2026-02-24T12:35:25Z
- **Tasks:** 2
- **Files modified:** 9

## Accomplishments
- Complete estimates CRUD: save, load, overwrite, delete via Supabase quotes table
- EstimatesPage with auth guard, glassmorphism card, list of saved estimates with actions
- Save to Cloud button in SummaryStep for authenticated users; subtle login prompt for guests
- All UI text translated PL/EN with 20+ i18n keys
- Lazy-loaded /estimates route (7.4 KB chunk)

## Task Commits

Each task was committed atomically:

1. **Task 1: Create estimates components, EstimatesPage, and route** - `b0596ad` (feat)
2. **Task 2: Wire Save to Cloud button into SummaryStep** - `2005e4f` (feat)

## Files Created/Modified
- `src/components/estimates/SaveEstimateDialog.tsx` - Dialog for naming and saving/overwriting estimates
- `src/components/estimates/EstimatesList.tsx` - List of saved estimates with load/overwrite/delete actions
- `src/components/estimates/EstimateActions.tsx` - Hooks: useLoadEstimate (fetch + populate wizard), useDeleteEstimate
- `src/pages/EstimatesPage.tsx` - Auth-guarded page with glassmorphism header and new estimate button
- `src/router/index.tsx` - Added /estimates lazy-loaded route
- `src/components/wizard/SummaryStep.tsx` - Added Save to Cloud section (auth-conditional)
- `src/i18n/locales/pl/common.json` - Added estimates namespace (20 keys)
- `src/i18n/locales/en/common.json` - Added estimates namespace (20 keys)
- `src/types/database.ts` - Added Relationships field to quotes table type

## Decisions Made
- Database type required `Relationships: []` field on quotes table to satisfy Supabase v2.97 GenericSchema -- without it, all table operations resolved to `never` type
- Used `QuoteRow` type assertion for `select('*')` results because `tsc -b` mode couldn't infer the row type from the query string
- EstimateActions extracted as hooks module for reusability, not inlined in EstimatesList
- Guest experience: subtle muted text with login link, not modal or blocker -- wizard remains fully functional without auth

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Database type incompatible with Supabase v2.97 GenericSchema**
- **Found during:** Task 1 (build verification)
- **Issue:** `Database['public']` type was missing `Relationships` field on quotes table, causing Supabase client to resolve all table operations as `never` type. `tsc -b` (build mode) caught this while `tsc --noEmit` did not.
- **Fix:** Added `Relationships: []` to quotes table type definition in database.ts
- **Files modified:** src/types/database.ts
- **Verification:** `pnpm build` succeeds, all Supabase operations properly typed
- **Committed in:** b0596ad (Task 1 commit)

**2. [Rule 1 - Bug] select('*') returns empty object type in tsc -b mode**
- **Found during:** Task 1 (build verification, after fix #1)
- **Issue:** Even with correct Database type, `supabase.from('quotes').select('*').single()` returned `{}` type in build mode, causing `data.data` property access error
- **Fix:** Used explicit `QuoteRow` type assertion: `const row = data as unknown as QuoteRow`
- **Files modified:** src/components/estimates/EstimateActions.tsx
- **Verification:** `pnpm build` succeeds, type-safe access to quote data
- **Committed in:** b0596ad (Task 1 commit)

---

**Total deviations:** 2 auto-fixed (1 blocking, 1 bug)
**Impact on plan:** Both fixes necessary for TypeScript build to succeed. No scope creep.

## Issues Encountered
None beyond the deviations documented above.

## User Setup Required

None for this plan specifically. Supabase project configuration (env vars, schema.sql, RLS policies) was deferred in 03-01 and remains a pending todo.

## Next Phase Readiness
- Phase 3 (Auth + Cloud Save) is now COMPLETE
- All 3 plans executed: Supabase infrastructure (03-01), Auth UI (03-02), Estimates CRUD (03-03)
- Full round-trip capability: create estimate -> save to cloud -> list saved -> load back -> overwrite -> delete
- Pending: Supabase project configuration (env vars, schema.sql execution, email auth setup)

## Self-Check: PASSED

- All 4 created files exist
- Both task commits found (b0596ad, 2005e4f)
- TypeScript compilation passes
- Production build succeeds

---
*Phase: 03-auth-cloud-save*
*Completed: 2026-02-24*
