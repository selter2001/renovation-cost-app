---
phase: 03-auth-cloud-save
plan: 02
subsystem: auth
tags: [supabase, auth-ui, forms, i18n, react-router, shadcn, tabs]

requires:
  - phase: 03-auth-cloud-save
    plan: 01
    provides: "Supabase client singleton, auth store, AuthInit component"
provides:
  - "Login form with email+password sign-in via Supabase"
  - "Sign-up form with email+password registration"
  - "Password reset request form"
  - "Update password form (post-reset link)"
  - "LoginPage with tab switching (login/signup)"
  - "UserMenu component (guest login button / authenticated dropdown)"
  - "Auth routes: /login, /reset-password, /update-password"
  - "Full PL/EN i18n for all auth UI"
affects: [03-03]

tech-stack:
  added: ["@radix-ui/react-label", "@radix-ui/react-tabs", "@radix-ui/react-separator"]
  patterns: ["Glassmorphism auth cards (bg-card/80 backdrop-blur-md)", "Lazy-loaded auth pages with skeleton fallback", "Dynamic i18n key mapping for Supabase auth errors (as never assertion)"]

key-files:
  created:
    - "src/components/auth/LoginForm.tsx"
    - "src/components/auth/SignUpForm.tsx"
    - "src/components/auth/ResetPasswordForm.tsx"
    - "src/components/auth/UpdatePasswordForm.tsx"
    - "src/components/auth/UserMenu.tsx"
    - "src/pages/LoginPage.tsx"
    - "src/pages/ResetPasswordPage.tsx"
    - "src/pages/UpdatePasswordPage.tsx"
    - "src/components/ui/label.tsx"
    - "src/components/ui/tabs.tsx"
    - "src/components/ui/separator.tsx"
  modified:
    - "src/router/index.tsx"
    - "src/components/layout/Navbar.tsx"
    - "src/i18n/locales/pl/common.json"
    - "src/i18n/locales/en/common.json"

key-decisions:
  - "Dynamic i18n key mapping for auth errors uses 'as never' assertion (consistent with project pattern from 02-02)"
  - "Auth pages lazy-loaded with dedicated AuthPageSkeleton fallback"
  - "UserMenu navigates via react-router useNavigate (not href) for SPA behavior"
  - "shadcn components created manually due to CLI alias resolution bug (@/ -> literal directory)"

patterns-established:
  - "Auth form pattern: controlled inputs + supabase.auth.* + loading state + i18n error mapping"
  - "UserMenu pattern: isLoading -> Skeleton, no user -> Login button, user -> DropdownMenu"
  - "Auth page layout: centered Card with glassmorphism (bg-card/80 backdrop-blur-md border-border/50 shadow-xl)"

duration: 4min
completed: 2026-02-24
---

# Phase 3 Plan 02: Auth UI Summary

**Complete auth UI with login/signup tabs, password reset flow, UserMenu dropdown in Navbar, and full PL/EN i18n**

## Performance

- **Duration:** 4 min
- **Started:** 2026-02-24T12:21:44Z
- **Completed:** 2026-02-24T12:26:30Z
- **Tasks:** 2
- **Files modified:** 17

## Accomplishments
- Four auth form components (login, signup, reset password, update password) with Supabase integration
- LoginPage with glassmorphism card and shadcn Tabs for login/signup switching
- UserMenu component dynamically showing login button (guest) or user dropdown (authenticated)
- Navbar updated to use live UserMenu in both desktop and mobile views
- Three new lazy-loaded routes with skeleton fallbacks
- Full i18n coverage: all auth labels, buttons, messages, and errors in PL and EN

## Task Commits

1. **Task 1: Create auth form components + pages + routes + i18n keys** - `0c48f5a` (feat)
2. **Task 2: Create UserMenu and integrate into Navbar** - `ac352b9` (feat)

## Files Created/Modified
- `src/components/auth/LoginForm.tsx` - Email+password sign-in form with error mapping
- `src/components/auth/SignUpForm.tsx` - Registration form with password confirmation
- `src/components/auth/ResetPasswordForm.tsx` - Password reset email request with success state
- `src/components/auth/UpdatePasswordForm.tsx` - New password form with auto-redirect on success
- `src/components/auth/UserMenu.tsx` - Adaptive auth menu (skeleton/login/dropdown)
- `src/pages/LoginPage.tsx` - Login/signup page with tabs, redirects if already authenticated
- `src/pages/ResetPasswordPage.tsx` - Reset password page with back-to-login link
- `src/pages/UpdatePasswordPage.tsx` - Update password page (reached via reset email link)
- `src/router/index.tsx` - Added /login, /reset-password, /update-password routes
- `src/components/layout/Navbar.tsx` - Replaced placeholder buttons with UserMenu
- `src/i18n/locales/pl/common.json` - Added auth.* i18n keys (Polish)
- `src/i18n/locales/en/common.json` - Added auth.* i18n keys (English)
- `src/components/ui/label.tsx` - shadcn Label component
- `src/components/ui/tabs.tsx` - shadcn Tabs component
- `src/components/ui/separator.tsx` - shadcn Separator component

## Decisions Made
- Dynamic i18n key mapping for Supabase auth errors uses `as never` type assertion -- consistent with pattern established in 02-02 for strict TypeScript with i18n
- shadcn CLI wrote components to literal `@/` directory instead of `src/` due to alias resolution bug -- components were created manually with standard shadcn source code
- Auth pages use dedicated `AuthPageSkeleton` (simpler than wizard skeleton) for lazy loading
- UserMenu uses `useNavigate` from react-router for SPA navigation instead of `<a href>` links

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed TypeScript strict i18n key typing for dynamic error mapping**
- **Found during:** Task 1 (LoginForm and SignUpForm)
- **Issue:** `mapAuthError()` returns `string` but `t()` expects typed i18n key union -- TypeScript rejects dynamic string
- **Fix:** Added `as never` assertion on mapped error key (established project pattern from 02-02)
- **Files modified:** `src/components/auth/LoginForm.tsx`, `src/components/auth/SignUpForm.tsx`
- **Verification:** `tsc --noEmit` passes
- **Committed in:** `0c48f5a` (Task 1 commit)

**2. [Rule 3 - Blocking] Created shadcn components manually due to CLI bug**
- **Found during:** Task 1 (installing label, tabs, separator)
- **Issue:** `shadcn add` wrote files to literal `@/components/ui/` directory instead of resolving the alias to `src/components/ui/`
- **Fix:** Created `label.tsx`, `tabs.tsx`, `separator.tsx` manually with standard shadcn New York source code, removed rogue `@/` directory
- **Files modified:** `src/components/ui/label.tsx`, `src/components/ui/tabs.tsx`, `src/components/ui/separator.tsx`
- **Verification:** Build succeeds, components render correctly
- **Committed in:** `0c48f5a` (Task 1 commit)

---

**Total deviations:** 2 auto-fixed (1 bug, 1 blocking)
**Impact on plan:** Both fixes necessary for type safety and build correctness. No scope creep.

## Issues Encountered
None beyond the deviations documented above.

## Next Phase Readiness
- Auth UI complete, ready for estimates CRUD (Plan 03)
- UserMenu already includes "My Estimates" link navigating to `/estimates` (page to be created in Plan 03)
- All Supabase auth methods wired: signInWithPassword, signUp, resetPasswordForEmail, updateUser, signOut

## Self-Check: PASSED

All 12 created files verified present. Both task commits (0c48f5a, ac352b9) verified in git log.

---
*Phase: 03-auth-cloud-save*
*Completed: 2026-02-24*
