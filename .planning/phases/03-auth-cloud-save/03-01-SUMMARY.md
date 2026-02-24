---
phase: 03-auth-cloud-save
plan: 01
subsystem: auth
tags: [supabase, pkce, zustand, rls, postgres]

requires:
  - phase: 02-core-wizard-kalkulator
    provides: "Room type, wizard store, App.tsx with RouterProvider"
provides:
  - "Supabase client singleton with PKCE flow"
  - "Auth store (user, session, isLoading)"
  - "Database types (Database, QuoteData)"
  - "AuthInit component syncing auth state"
  - "SQL schema reference for quotes table with RLS"
affects: [03-02, 03-03]

tech-stack:
  added: ["@supabase/supabase-js 2.97.0"]
  patterns: ["PKCE auth flow for HashRouter compatibility", "Non-persisted Zustand store for auth (Supabase manages session)", "AuthInit wrapper preventing flash of unauthed content"]

key-files:
  created:
    - "src/lib/supabase.ts"
    - "src/stores/auth-store.ts"
    - "src/types/database.ts"
    - "src/components/auth/AuthInit.tsx"
    - ".env.example"
    - "supabase/schema.sql"
  modified:
    - "src/App.tsx"

key-decisions:
  - "PKCE flow (not implicit) -- avoids hash fragment conflict with HashRouter"
  - "Auth store NOT persisted -- Supabase manages its own session in localStorage"
  - "AuthInit shows loading spinner during initial session check"
  - "Env var validation throws clear error if missing (not silent fail)"

patterns-established:
  - "Supabase client import from @/lib/supabase"
  - "Auth state via useAuthStore hook"
  - "AuthInit wraps RouterProvider in App.tsx"

duration: 2min
completed: 2026-02-24
---

# Phase 3 Plan 01: Supabase Foundation Summary

**Supabase client with PKCE flow, Zustand auth store, database types for quotes table, AuthInit listener wrapping App**

## Performance

- **Duration:** 2 min
- **Started:** 2026-02-24T12:15:00Z
- **Completed:** 2026-02-24T12:18:55Z
- **Tasks:** 2 (task 3 is user checkpoint — deferred)
- **Files modified:** 9

## Accomplishments
- Supabase client singleton with PKCE flow configured (critical for HashRouter)
- Auth store with user/session/isLoading state (not persisted — Supabase handles session)
- Database types matching quotes table schema with QuoteData type
- AuthInit component listening to onAuthStateChange, preventing flash of unauthed content
- SQL schema reference file with RLS policies ready for user to run

## Task Commits

1. **Task 1: Install Supabase SDK + create client, auth store, database types, schema** - `35b8fb7` (feat)
2. **Task 2: Create AuthInit component and wire into App.tsx** - `747037e` (feat)
3. **Task 3: User configures Supabase project** - DEFERRED (checkpoint: user will configure at end of phase)

## Files Created/Modified
- `src/lib/supabase.ts` - Supabase client singleton with PKCE, env var validation
- `src/stores/auth-store.ts` - Zustand auth store (user, session, isLoading)
- `src/types/database.ts` - Database interface with quotes table Row/Insert/Update types
- `src/components/auth/AuthInit.tsx` - Auth state listener with loading spinner
- `src/App.tsx` - Wrapped RouterProvider with AuthInit
- `.env.example` - Template for required env vars (committed)
- `.env.local` - Actual env vars with placeholder anon key (not committed)
- `supabase/schema.sql` - Reference SQL: quotes table, RLS policies, index, trigger

## Decisions Made
- PKCE flow chosen over implicit to avoid hash fragment conflict with HashRouter
- Auth store not persisted (Supabase manages session in its own localStorage key)
- AuthInit renders loading spinner during initial session check (prevents FOUC)
- Env var validation throws at module load time if vars are missing

## Deviations from Plan

None - plan executed exactly as written.

## User Setup Required

**Supabase project configuration deferred to end of phase.** User needs to:
1. Set `VITE_SUPABASE_ANON_KEY` in `.env.local`
2. Run `supabase/schema.sql` in Supabase SQL Editor
3. Enable email auth with autoconfirm
4. Add redirect URLs

## Next Phase Readiness
- Supabase client ready for auth UI (Plan 02)
- Auth store ready for UserMenu and form components
- Database types ready for estimates CRUD (Plan 03)

---
*Phase: 03-auth-cloud-save*
*Completed: 2026-02-24*
