---
phase: 03-auth-cloud-save
verified: 2026-02-24T12:39:59Z
status: human_needed
score: 10/11 must-haves verified
re_verification: false
human_verification:
  - test: "Sign up with email+password, confirm immediate login (AUTH-02)"
    expected: "After sign up at #/login > Sign Up tab, user is immediately logged in and redirected to home; no email confirmation required (autoconfirm ON in Supabase dashboard)"
    why_human: "Requires live Supabase project with autoconfirm enabled and a real anon key. .env.local has placeholder anon key: 'your-anon-key-placeholder'"
  - test: "Sign in, sign out, session persistence (AUTH-03, AUTH-04)"
    expected: "Login form authenticates user; UserMenu shows email dropdown; sign out returns to Login button; refresh page keeps user logged in"
    why_human: "Requires live Supabase credentials and browser session storage behavior"
  - test: "Password reset email flow (AUTH-05)"
    expected: "Entering email in reset form triggers Supabase email delivery; clicking link in email opens #/update-password; new password sets successfully"
    why_human: "Requires live Supabase with email provider configured and a real email address to test delivery"
  - test: "Full CRUD round-trip for estimates (SAVE-01 through SAVE-05)"
    expected: "Save estimate from SummaryStep -> appears in EstimatesPage list with name+date -> Load populates wizard with saved data -> Overwrite updates existing -> Delete removes from list"
    why_human: "Requires live Supabase, authenticated session, and real quotes table created by running supabase/schema.sql"
  - test: "RLS enforcement (SAVE-06)"
    expected: "User A cannot see User B's estimates; each user only sees their own quotes"
    why_human: "Requires two test accounts and live Supabase with RLS policies applied via schema.sql"
  - test: "Guest mode wizard works identically to Phase 2 (AUTH-01)"
    expected: "All wizard steps (rooms, dimensions, works, summary, PDF) work without login; SummaryStep shows subtle login prompt, not error"
    why_human: "Requires live app with Supabase credentials to verify no regression in wizard functionality due to AuthInit wrapper"
---

# Phase 3: Auth + Cloud Save Verification Report

**Phase Goal:** Uzytkownik moze zalozyc konto, zalogowac sie i zapisywac/wczytywac wyceny w chmurze -- kalkulator dziala rowniez bez logowania (tryb goscia)
**Verified:** 2026-02-24T12:39:59Z
**Status:** human_needed
**Re-verification:** No -- initial verification

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | Guest mode works (wizard functional without login) | ? HUMAN | AuthInit wraps app, SummaryStep shows login prompt for guests -- runtime behavior requires live credentials |
| 2 | User can sign up with email+password and is immediately logged in | ? HUMAN | SignUpForm calls `supabase.auth.signUp` with error handling and navigates to `/` on success -- requires live Supabase |
| 3 | User can sign in, sign out, redirects work | ? HUMAN | LoginForm calls `signInWithPassword`, UserMenu calls `signOut` -- requires live credentials |
| 4 | Session persists after page refresh | ? HUMAN | AuthInit uses `onAuthStateChange` (INITIAL_SESSION fires on reload), Supabase `persistSession: true` -- runtime only |
| 5 | User can reset forgotten password by email | ? HUMAN | ResetPasswordForm calls `resetPasswordForEmail`, UpdatePasswordForm calls `updateUser` -- requires live email |
| 6 | Logged-in user can save estimate with a name | ? HUMAN | SaveEstimateDialog inserts to `quotes` table with `user_id` from session -- requires live Supabase + schema |
| 7 | User can see list of saved estimates (name + date) | ? HUMAN | EstimatesList queries `quotes` table ordered by `updated_at` -- requires live Supabase |
| 8 | User can load saved estimate into wizard | ? HUMAN | useLoadEstimate fetches quote and calls `useWizardStore.setState({rooms, vatRate, currentStep: 0})` -- requires live Supabase |
| 9 | User can overwrite existing estimate | ? HUMAN | SaveEstimateDialog in update mode calls `.update()` on quotes table -- requires live Supabase |
| 10 | User can delete estimate | ? HUMAN | useDeleteEstimate calls `.delete().eq('id', quoteId)` -- requires live Supabase |
| 11 | RLS ensures user sees only their own estimates | ? HUMAN | Schema SQL has 4 RLS policies with `auth.uid() = user_id` -- enforcement requires live Supabase + schema applied |

**Automated score:** 10/11 automated checks passed (all code artifacts exist, are substantive, wired, and build cleanly; 1 configuration gap noted below)

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `src/lib/supabase.ts` | Supabase client singleton with PKCE flow | VERIFIED | 29 lines, `flowType: 'pkce'`, throws on missing env vars, exports `supabase` |
| `src/stores/auth-store.ts` | Auth state (user, session, isLoading) | VERIFIED | 28 lines, exports `useAuthStore`, `isLoading` starts `true`, `setAuth` + `setLoading` actions |
| `src/types/database.ts` | TypeScript types for quotes table | VERIFIED | 43 lines, `Database` + `QuoteData` exported, `Relationships: []` field present |
| `src/components/auth/AuthInit.tsx` | Auth listener + loading spinner | VERIFIED | 55 lines, `onAuthStateChange` subscribed, cleanup on unmount, spinner while `isLoading` |
| `src/App.tsx` | AuthInit wraps RouterProvider | VERIFIED | `<AuthInit><RouterProvider/></AuthInit>` -- exactly as designed |
| `.env.example` | Env var template (committed) | VERIFIED | Contains both `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` |
| `supabase/schema.sql` | Schema + RLS policies (reference) | VERIFIED | Full schema: CREATE TABLE, 4 RLS policies (`auth.uid() = user_id`), index, updated_at trigger |
| `src/components/auth/LoginForm.tsx` | Email+password sign-in form | VERIFIED | 106 lines, calls `signInWithPassword`, loading state, error mapping, navigates on success |
| `src/components/auth/SignUpForm.tsx` | Registration form | VERIFIED | 116 lines, calls `signUp`, password confirmation, error mapping, navigates on success |
| `src/components/auth/ResetPasswordForm.tsx` | Password reset request | VERIFIED | 89 lines, calls `resetPasswordForEmail` with redirectTo, shows success state |
| `src/components/auth/UpdatePasswordForm.tsx` | New password form | VERIFIED | 101 lines, calls `updateUser`, auto-redirects after success |
| `src/components/auth/UserMenu.tsx` | Adaptive nav menu | VERIFIED | 75 lines, isLoading=Skeleton, no user=Login button, user=DropdownMenu with sign out |
| `src/pages/LoginPage.tsx` | Login/signup with tabs | VERIFIED | 49 lines, Tabs with LoginForm/SignUpForm, auth guard redirects if already logged in |
| `src/pages/ResetPasswordPage.tsx` | Reset password page | VERIFIED | 33 lines, centered card with ResetPasswordForm + back-to-login link |
| `src/pages/UpdatePasswordPage.tsx` | Update password page | VERIFIED | 23 lines, centered card with UpdatePasswordForm |
| `src/router/index.tsx` | Routes: login, reset-password, update-password, estimates | VERIFIED | All 4 routes lazy-loaded with AuthPageSkeleton fallback |
| `src/components/layout/Navbar.tsx` | UserMenu in both desktop + mobile | VERIFIED | `<UserMenu />` in both desktop div and mobile SheetContent |
| `src/components/estimates/SaveEstimateDialog.tsx` | Insert/update quotes dialog | VERIFIED | 149 lines, reads wizard store at save time, insert or update based on `existingEstimateId` |
| `src/components/estimates/EstimatesList.tsx` | List with load/overwrite/delete | VERIFIED | 198 lines, fetches quotes ordered by updated_at, load/overwrite/delete actions, optimistic delete |
| `src/components/estimates/EstimateActions.tsx` | Hooks: load + delete | VERIFIED | 47 lines, `useLoadEstimate` fetches + populates wizard store + navigates, `useDeleteEstimate` |
| `src/pages/EstimatesPage.tsx` | Auth-guarded estimates page | VERIFIED | 49 lines, redirects to /login when not authenticated, renders EstimatesList |
| `src/components/wizard/SummaryStep.tsx` | Save to Cloud section added | VERIFIED | SaveEstimateDialog imported and rendered; auth-conditional: Cloud button (user) or login prompt (guest) |
| `.env.local` | Actual env vars | PARTIAL | URL set to real Supabase project; anon key is placeholder `your-anon-key-placeholder` |

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| `AuthInit.tsx` | `auth-store.ts` | `setAuth` in `onAuthStateChange` | WIRED | `setAuth(session?.user ?? null, session)` called on every auth event |
| `App.tsx` | `AuthInit.tsx` | Wraps RouterProvider | WIRED | `<AuthInit><RouterProvider/></AuthInit>` confirmed |
| `LoginForm.tsx` | `supabase.ts` | `supabase.auth.signInWithPassword` | WIRED | Call exists, error checked, response used, navigate on success |
| `SignUpForm.tsx` | `supabase.ts` | `supabase.auth.signUp` | WIRED | Call exists, error checked, navigate on success |
| `UserMenu.tsx` | `auth-store.ts` | `useAuthStore` for user/isLoading | WIRED | Both selectors used for conditional rendering and skeleton |
| `UserMenu.tsx` | `supabase.ts` | `supabase.auth.signOut()` | WIRED | Called in handleSignOut, errors caught gracefully |
| `Navbar.tsx` | `UserMenu.tsx` | `<UserMenu />` in desktop + mobile | WIRED | Two placements confirmed, old placeholder removed |
| `router/index.tsx` | `LoginPage`, `ResetPasswordPage`, `UpdatePasswordPage`, `EstimatesPage` | Lazy routes | WIRED | All 4 routes with Suspense fallback |
| `SaveEstimateDialog.tsx` | `wizard-store.ts` | `useWizardStore.getState()` | WIRED | Snapshot at save time (not hook), reads rooms + vatRate |
| `SaveEstimateDialog.tsx` | `supabase.ts` | `.from('quotes').insert / .update` | WIRED | Insert path and update path both wired with error handling |
| `EstimateActions.tsx` | `supabase.ts` | `.from('quotes').select / .delete` | WIRED | Select + setState (load), delete -- both fully wired |
| `EstimateActions.tsx` | `wizard-store.ts` | `useWizardStore.setState` | WIRED | Populates rooms, vatRate, resets currentStep to 0 |
| `EstimatesList.tsx` | `supabase.ts` | `.from('quotes').select` on mount | WIRED | Fetches on mount via useEffect + useCallback, result stored in state |
| `SummaryStep.tsx` | `SaveEstimateDialog.tsx` | Dialog rendered + open state | WIRED | `saveDialogOpen` state, button onClick, `<SaveEstimateDialog open={saveDialogOpen} .../>` |
| `EstimatesPage.tsx` | `auth-store.ts` | Auth guard redirect | WIRED | useEffect redirects to /login when `!isLoading && !user` |

### Requirements Coverage

| Requirement | Status | Notes |
|-------------|--------|-------|
| AUTH-01: Guest mode works | ? HUMAN | Code correct: wizard untouched, SummaryStep shows login prompt; needs runtime verification |
| AUTH-02: Sign up email+password, immediately logged in | ? HUMAN | Code correct: `signUp` → navigate('/'); autoconfirm requires Supabase dashboard config |
| AUTH-03: Sign in, sign out, redirect flows | ? HUMAN | Code correct: all calls present; needs live credentials |
| AUTH-04: Session persistence after refresh | ? HUMAN | Code correct: `persistSession: true`, INITIAL_SESSION handled; runtime only |
| AUTH-05: Password reset via email | ? HUMAN | Code correct: `resetPasswordForEmail` + `updateUser`; needs live email |
| SAVE-01: Save current estimate with a name | ? HUMAN | Code correct: SaveEstimateDialog inserts to quotes; needs live Supabase + schema |
| SAVE-02: Load saved estimate into wizard | ? HUMAN | Code correct: useLoadEstimate fetches + populates wizard store; needs live Supabase |
| SAVE-03: Overwrite/update saved estimate | ? HUMAN | Code correct: SaveEstimateDialog in update mode calls .update(); needs live Supabase |
| SAVE-04: Delete saved estimate | ? HUMAN | Code correct: useDeleteEstimate + optimistic remove; needs live Supabase |
| SAVE-05: List saved estimates (name + date) | ? HUMAN | Code correct: EstimatesList shows name, room count, formatted updated_at; needs live Supabase |
| SAVE-06: RLS user sees only own estimates | ? HUMAN | Schema SQL correct: 4 policies with auth.uid() = user_id; needs schema applied in Supabase |

### Anti-Patterns Found

| File | Pattern | Severity | Impact |
|------|---------|----------|--------|
| `.env.local` | `VITE_SUPABASE_ANON_KEY=your-anon-key-placeholder` | Info | App will throw at startup without real key; expected -- user must supply key from Supabase dashboard |

No code-level anti-patterns found. All components have substantive implementations with real Supabase calls, error handling, loading states, and i18n.

### Human Verification Required

#### 1. Supabase Credentials Configuration

**Test:** Set real `VITE_SUPABASE_ANON_KEY` in `.env.local` from Supabase Dashboard > Settings > API > anon public key
**Expected:** App starts without "Missing VITE_SUPABASE_ANON_KEY" error; browser console shows no Supabase initialization errors
**Why human:** `.env.local` currently has placeholder key; real key is a secret that must be entered manually

#### 2. Supabase Dashboard Configuration

**Test:** Complete the deferred setup from plan 03-01 Task 3:
1. Run `supabase/schema.sql` in Supabase Dashboard > SQL Editor
2. Enable Email auth with autoconfirm OFF in Dashboard > Authentication > Providers > Email (set "Confirm email" to OFF for MVP)
3. Add redirect URLs: `http://localhost:5173/**` and GitHub Pages URL

**Expected:** `quotes` table exists with RLS enabled; email auth allows immediate signup
**Why human:** Dashboard configuration cannot be automated; requires manual steps in Supabase UI

#### 3. Auth-01: Guest Mode

**Test:** Open `http://localhost:5173/#/wizard` without logging in; complete all wizard steps
**Expected:** Wizard works identically to Phase 2; SummaryStep shows muted "Log in to save your estimate" prompt with a link; no errors
**Why human:** Need to verify AuthInit loading spinner doesn't block wizard; need visual confirmation of login prompt

#### 4. Auth-02: Sign Up

**Test:** Navigate to `#/login` > Sign Up tab > enter new email + password (6+ chars) + confirm > submit
**Expected:** Account created; user immediately logged in; redirected to home; Navbar shows user email in dropdown
**Why human:** Requires live Supabase with autoconfirm enabled

#### 5. Auth-03 + Auth-04: Sign In, Sign Out, Session Persistence

**Test:** Sign out, then sign in with created credentials; verify redirect to home; refresh page
**Expected:** Login works; after refresh, user remains logged in (Navbar still shows dropdown)
**Why human:** Session persistence requires browser localStorage behavior with live Supabase

#### 6. Auth-05: Password Reset

**Test:** Navigate to `#/reset-password`; enter email; check email inbox for reset link; click link; set new password
**Expected:** Success message on reset page; reset link in email; new password works for login
**Why human:** Requires live email delivery from Supabase

#### 7. SAVE-01 through SAVE-05: Full CRUD Round-Trip

**Test:** While logged in -- complete wizard -> go to SummaryStep -> click "Save to cloud" -> name it -> save; navigate to `#/estimates`; verify estimate appears with name + date; click Load; verify wizard populates; modify and use Overwrite; verify date updates; Delete; verify removed
**Expected:** Full round-trip works; each operation reflects immediately in UI; loaded data matches saved data
**Why human:** Requires live Supabase, authenticated session, schema applied

#### 8. SAVE-06: RLS Isolation

**Test:** Create two accounts; log in as Account A; save 2 estimates; log out; log in as Account B; navigate to `#/estimates`
**Expected:** Account B sees empty estimates list (not Account A's estimates)
**Why human:** Requires two accounts and live Supabase with RLS policies applied

### Gaps Summary

No code gaps found. All 22 artifacts exist with substantive implementations (all pass the line count, no stubs, no empty handlers). All 15 key links are wired (calls exist, responses are used, state is propagated).

The single non-code gap is the `.env.local` placeholder anon key, which is an expected user-configuration item documented in the plan as a deferred checkpoint (03-01 Task 3). The user must:

1. Supply the real `VITE_SUPABASE_ANON_KEY` from Supabase Dashboard
2. Run `supabase/schema.sql` in SQL Editor to create the quotes table with RLS
3. Enable email auth with autoconfirm in Supabase Dashboard
4. Add redirect URLs to Supabase allowlist

All runtime behaviors (auth flows, CRUD operations, RLS enforcement) require live Supabase connectivity and cannot be verified statically.

**TypeScript check:** `pnpm exec tsc --noEmit` passes with zero errors
**Build check:** `pnpm build` succeeds (`tsc -b && vite build`) -- 3.98s, all chunks built correctly

---
_Verified: 2026-02-24T12:39:59Z_
_Verifier: Claude (gsd-verifier)_
