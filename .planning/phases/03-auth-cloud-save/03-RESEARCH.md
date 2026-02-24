# Phase 3: Auth + Cloud Save - Research

**Researched:** 2026-02-24
**Domain:** Supabase Auth (email/password) + Supabase Database (JSONB quotes) + RLS + SPA integration
**Confidence:** HIGH

## Summary

Phase 3 adds authentication and cloud persistence to the existing static-SPA renovation calculator. The core challenge is integrating Supabase Auth with a HashRouter-based GitHub Pages SPA. The app already uses `createHashRouter` (React Router 7), which conflicts with Supabase's default implicit auth flow (both use the URL `#` fragment). The solution is to use PKCE flow with `flowType: 'pkce'` in the Supabase client config, combined with custom email templates that pass `token_hash` as a query parameter instead of using `ConfirmationURL` (which puts tokens in fragments).

The existing Zustand store with `persist` middleware already handles guest mode -- the wizard works identically without auth. Phase 3 adds an auth store (separate from wizard store), a Supabase client singleton, auth UI (login/signup/reset forms), and CRUD operations for saving estimates as JSONB in a `quotes` table with RLS policies scoped to `auth.uid()`.

The project mentions an existing Supabase project (`nirhjivalmvuvxxbkjwk`) with `profiles` and `quotes` tables already set up. We should verify and reuse this schema, only adding RLS policies if missing.

**Primary recommendation:** Use `@supabase/supabase-js` v2 with `flowType: 'pkce'`, store auth state in a separate Zustand store (not persisted to localStorage), and serialize the entire `WizardState` (rooms + vatRate) as JSONB in the `quotes` table. Enable email autoconfirm to avoid the email confirmation redirect problem entirely (simplest approach for an MVP), or customize email templates with `token_hash` for proper email verification.

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| @supabase/supabase-js | ^2.97.0 | Auth + Database client | Official Supabase JS SDK. Isomorphic, works in browser. Handles session management in localStorage, token refresh, auth state events. Already listed in project's initial research |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| (Zustand - already installed) | ^5.0.11 | Auth state management | Store user/session state. Separate auth store from wizard store |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| @supabase/supabase-js directly | @supabase/ssr | @supabase/ssr is for SSR frameworks (Next.js, Remix). Uses cookies. NOT needed for client-only SPA on GitHub Pages. supabase-js with localStorage is correct for this project |
| Zustand auth store | React Context for auth | Context causes full subtree re-renders on auth state change. Zustand selectors are more efficient. Project already uses Zustand everywhere |
| Email autoconfirm ON | Email verification with PKCE | Autoconfirm is simpler (no redirect handling), but means unverified emails can create accounts. For a renovation calculator MVP, autoconfirm is acceptable |

**Installation:**
```bash
npm install @supabase/supabase-js
```

No other new dependencies needed. React Router, Zustand, i18next, shadcn/ui are already installed.

## Architecture Patterns

### Recommended Project Structure (new files for Phase 3)

```
src/
├── lib/
│   └── supabase.ts              # Supabase client singleton (NEW)
├── stores/
│   ├── wizard-store.ts          # EXISTING - unchanged
│   └── auth-store.ts            # Auth state: user, session, loading (NEW)
├── components/
│   ├── auth/                    # Auth UI components (NEW)
│   │   ├── AuthGuard.tsx        # Wrapper: redirects to login if not authed
│   │   ├── LoginForm.tsx        # Email + password sign-in form
│   │   ├── SignUpForm.tsx        # Email + password registration form
│   │   ├── ResetPasswordForm.tsx # Request password reset
│   │   ├── UpdatePasswordForm.tsx # Set new password (after reset link)
│   │   └── UserMenu.tsx         # Navbar dropdown: login/signup/logout/my estimates
│   ├── estimates/               # Saved estimates UI (NEW)
│   │   ├── EstimatesList.tsx    # List of saved estimates (name + date)
│   │   ├── SaveEstimateDialog.tsx # Dialog to name and save current estimate
│   │   └── EstimateActions.tsx  # Load/delete/overwrite actions
│   └── layout/
│       └── Navbar.tsx           # EXISTING - add UserMenu integration
├── pages/
│   ├── LoginPage.tsx            # Login/signup page (NEW)
│   ├── ResetPasswordPage.tsx    # Password reset page (NEW)
│   ├── UpdatePasswordPage.tsx   # Update password after reset link (NEW)
│   └── EstimatesPage.tsx        # My saved estimates page (NEW)
├── router/
│   └── index.tsx                # EXISTING - add auth routes
└── i18n/
    └── locales/
        ├── pl/common.json       # EXISTING - add auth/estimates keys
        └── en/common.json       # EXISTING - add auth/estimates keys
```

### Pattern 1: Supabase Client Singleton

**What:** Create the Supabase client once in `lib/supabase.ts`. All components access it via import. Never create multiple clients.
**When to use:** Always. Multiple clients = multiple auth listeners = state inconsistency.
**Example:**

```typescript
// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY env vars')
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    flowType: 'pkce',           // CRITICAL: avoids hash fragment conflict with HashRouter
    detectSessionInUrl: true,   // auto-exchange auth code from email links
    persistSession: true,       // store session in localStorage (default)
    autoRefreshToken: true,     // auto-refresh before expiry (default)
  },
})
```

### Pattern 2: Auth Store (Zustand, NOT persisted)

**What:** Separate Zustand store for auth state. NOT persisted to localStorage -- Supabase manages its own session persistence. The store reflects Supabase's auth state via `onAuthStateChange`.
**When to use:** Always for auth. Avoids dual persistence (Zustand persist + Supabase localStorage).

```typescript
// src/stores/auth-store.ts
import { create } from 'zustand'
import type { User, Session } from '@supabase/supabase-js'

interface AuthState {
  user: User | null
  session: Session | null
  isLoading: boolean         // true until initial session check completes
  setAuth: (user: User | null, session: Session | null) => void
  setLoading: (loading: boolean) => void
}

export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  session: null,
  isLoading: true,
  setAuth: (user, session) => set({ user, session, isLoading: false }),
  setLoading: (isLoading) => set({ isLoading }),
}))
```

### Pattern 3: Auth Initialization in App Root

**What:** Initialize auth listener once in a top-level component (App.tsx or a dedicated AuthProvider). Use `onAuthStateChange` to sync Supabase session to Zustand store. This fires `INITIAL_SESSION` immediately, then subsequent events as they occur.
**When to use:** Always. Must be set up before any auth-dependent UI renders.

```typescript
// In App.tsx or a dedicated AuthInit component
import { useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/auth-store'

function AuthInit({ children }: { children: React.ReactNode }) {
  const setAuth = useAuthStore((s) => s.setAuth)

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        // IMPORTANT: keep callback synchronous, no await
        setAuth(session?.user ?? null, session)
      }
    )
    return () => subscription.unsubscribe()
  }, [setAuth])

  return <>{children}</>
}
```

### Pattern 4: Guest Mode (AUTH-01)

**What:** The wizard works without auth. The existing Zustand persist middleware already provides this. Phase 3 only ADDS auth-gated features (save/load estimates). The wizard itself requires zero changes.
**When to use:** Always. The guest experience is the Phase 2 experience, unchanged.

**Implementation:** No changes to `wizard-store.ts`. The "Save" button in SummaryStep checks auth state: if not logged in, shows a prompt to log in (not a forced redirect). Loading an estimate from cloud populates the wizard store with the loaded data.

### Pattern 5: Saving Estimates as JSONB

**What:** Serialize the WizardState (rooms + vatRate) as a JSONB column in the `quotes` table. The user provides a name for each estimate.
**When to use:** For SAVE-01 through SAVE-05.

```typescript
// Saving an estimate
const wizardState = useWizardStore.getState()
const { rooms, vatRate } = wizardState

const { data, error } = await supabase
  .from('quotes')
  .insert({
    user_id: session.user.id,
    name: estimateName,
    data: { rooms, vatRate },  // JSONB - entire wizard state
  })
  .select()
  .single()

// Loading an estimate
const { data: quote } = await supabase
  .from('quotes')
  .select('*')
  .eq('id', quoteId)
  .single()

// Populate wizard store with loaded data
const { rooms, vatRate } = quote.data as WizardState
useWizardStore.setState({ rooms, vatRate, currentStep: 0 })
```

### Anti-Patterns to Avoid

- **Persisting auth state in Zustand persist middleware:** Supabase already persists sessions in localStorage. Double-persisting creates stale state bugs when tokens expire.
- **Calling `getSession()` repeatedly:** Use `onAuthStateChange` once. Calling `getSession()` on every render wastes resources and can return stale tokens.
- **Using `service_role` key in frontend:** The `VITE_` prefix exposes it in the bundle. Only use `anon` key in client-side code.
- **Async operations inside `onAuthStateChange` callback:** Can cause deadlocks. Keep the callback synchronous. If async work is needed, use `setTimeout(() => { ... }, 0)`.
- **Combining implicit flow with HashRouter:** Both use URL `#` fragment -- they WILL conflict. Use PKCE flow.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Session management | Custom token storage/refresh | Supabase `persistSession` + `autoRefreshToken` | Token refresh logic is complex (race conditions, expiry edge cases). Supabase handles this |
| Password hashing | Any client-side hashing | Supabase Auth server | Password hashing must be server-side (bcrypt/argon2). Supabase does this |
| Email sending | Custom email service | Supabase built-in email (or custom SMTP) | Email delivery, verification tokens, rate limiting handled by Supabase |
| RLS policies | Client-side data filtering | Postgres RLS with `auth.uid()` | Client-side filtering is bypassable. RLS is enforced at database level |
| Session persistence | Manual localStorage + refresh logic | `@supabase/supabase-js` built-in persistence | The SDK handles localStorage key management, token refresh scheduling, cross-tab sync |

**Key insight:** Supabase Auth is a complete auth system. Don't wrap it in custom abstractions -- use it directly. The only abstraction needed is syncing Supabase events to the Zustand store.

## Common Pitfalls

### Pitfall 1: HashRouter + Implicit Flow Conflict

**What goes wrong:** Supabase's default implicit auth flow returns tokens in URL fragments (`#access_token=...`). HashRouter also uses fragments (`#/wizard`). When Supabase redirects after email confirmation or password reset, the fragment data collides with the router, causing either broken routing or lost auth tokens.
**Why it happens:** Both systems claim ownership of `window.location.hash`.
**How to avoid:** Configure Supabase client with `flowType: 'pkce'`. PKCE uses query parameters (`?code=...`) instead of fragments. Additionally, customize email templates to use `token_hash` query params.
**Warning signs:** Auth callbacks silently fail. User clicks email link but session is not established. HashRouter navigates to wrong route after clicking email link.

### Pitfall 2: Flash of Unauthenticated Content

**What goes wrong:** On page refresh, the app briefly shows "not logged in" UI before the session is restored from localStorage. User sees a login button flash to a user menu.
**Why it happens:** `onAuthStateChange` is async. The first event (`INITIAL_SESSION`) fires after React has already rendered.
**How to avoid:** Initialize `isLoading: true` in auth store. Show a skeleton/spinner while `isLoading` is true. Set `isLoading: false` only after `INITIAL_SESSION` event fires.
**Warning signs:** Login button flashing on page refresh when user is logged in. Protected routes briefly showing login redirect.

### Pitfall 3: RLS Not Enabled on Tables

**What goes wrong:** Without RLS, any client with the `anon` key can read ALL data in the table. The `anon` key is visible in the frontend bundle. This means any user's estimates are readable/writable by anyone.
**Why it happens:** Supabase tables have RLS disabled by default. Developers forget to enable it or create policies.
**How to avoid:** Enable RLS immediately after creating each table. Create separate SELECT/INSERT/UPDATE/DELETE policies. Test by logging in as user A and attempting to access user B's data.
**Warning signs:** `RLS disabled` badge in Supabase Dashboard. User can see other users' estimates.

### Pitfall 4: Deadlock in onAuthStateChange Callback

**What goes wrong:** Calling other Supabase auth methods (like `getUser()`) inside the `onAuthStateChange` callback causes a deadlock.
**Why it happens:** The callback is synchronous by design. Async Supabase calls inside it can create circular waits.
**How to avoid:** Keep the callback purely synchronous. Only update Zustand state. If you need async work, defer it: `setTimeout(async () => { ... }, 0)`.
**Warning signs:** App hangs on auth state change. Session never resolves. Infinite loading state.

### Pitfall 5: Password Reset with Email Rate Limiting

**What goes wrong:** Supabase's default email service has a rate limit of 2 emails per hour (for Confirm signup, Magic Link, Change Email, and Reset Password combined). Users testing password reset may hit this limit quickly.
**Why it happens:** Supabase's built-in email is for development/testing. Production apps need custom SMTP.
**How to avoid:** For MVP/demo, enable autoconfirm (no email confirmation needed for signUp). For production, configure custom SMTP in Supabase Dashboard (e.g., Resend, SendGrid, Mailgun). Document the rate limit in the app's help text.
**Warning signs:** "Email rate limit exceeded" errors. Users not receiving password reset emails.

### Pitfall 6: Losing Guest Data on Login

**What goes wrong:** User builds a full estimate as guest (stored in Zustand/localStorage). Then logs in or creates account. The wizard state is still in localStorage but not saved to cloud. If they navigate to "My Estimates," the current work-in-progress is not there.
**Why it happens:** No mechanism to migrate localStorage draft to cloud after auth.
**How to avoid:** After login, check if there's an active wizard state in localStorage. Offer to save it to cloud. The "Save" action in SummaryStep should work seamlessly regardless of when the user logged in.
**Warning signs:** User completes estimate, logs in, and can't find their work.

## Code Examples

### Supabase Client with PKCE and TypeScript

```typescript
// src/lib/supabase.ts
// Source: Supabase official docs + PKCE flow docs
import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

export const supabase = createClient<Database>(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
  {
    auth: {
      flowType: 'pkce',
      detectSessionInUrl: true,
      persistSession: true,
      autoRefreshToken: true,
    },
  }
)
```

### Sign Up, Sign In, Sign Out

```typescript
// Source: https://supabase.com/docs/guides/auth/passwords

// Sign up
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'securepassword',
  options: {
    emailRedirectTo: `${window.location.origin}${import.meta.env.BASE_URL}`,
  },
})
// If autoconfirm enabled: data.session is non-null (user logged in immediately)
// If autoconfirm disabled: data.session is null (user must verify email first)

// Sign in
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'securepassword',
})

// Sign out
const { error } = await supabase.auth.signOut()
```

### Password Reset Flow

```typescript
// Source: https://supabase.com/docs/guides/auth/passwords
// Source: https://supabase.com/docs/reference/javascript/auth-resetpasswordforemail

// Step 1: Request reset (sends email with link)
const { error } = await supabase.auth.resetPasswordForEmail(email, {
  redirectTo: `${window.location.origin}${import.meta.env.BASE_URL}#/update-password`,
})

// Step 2: Handle PASSWORD_RECOVERY event (in onAuthStateChange)
// When user clicks the email link, Supabase exchanges the token automatically (PKCE)
// The PASSWORD_RECOVERY event fires via onAuthStateChange
// Navigate user to update-password form

// Step 3: Update password
const { error } = await supabase.auth.updateUser({
  password: 'new_secure_password',
})
```

### Database Schema (SQL)

```sql
-- Quotes table for storing estimates
-- NOTE: Check if this table already exists in the Supabase project (nirhjivalmvuvxxbkjwk)
CREATE TABLE IF NOT EXISTS quotes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  data JSONB NOT NULL,                    -- { rooms: Room[], vatRate: 8 | 23 }
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;

-- RLS Policies: user can only access their own quotes
CREATE POLICY "Users can view own quotes"
  ON quotes FOR SELECT
  TO authenticated
  USING ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can insert own quotes"
  ON quotes FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can update own quotes"
  ON quotes FOR UPDATE
  TO authenticated
  USING ((SELECT auth.uid()) = user_id)
  WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can delete own quotes"
  ON quotes FOR DELETE
  TO authenticated
  USING ((SELECT auth.uid()) = user_id);

-- Index for fast lookups by user_id (RLS uses this in every query)
CREATE INDEX IF NOT EXISTS idx_quotes_user_id ON quotes(user_id);

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER quotes_updated_at
  BEFORE UPDATE ON quotes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();
```

### CRUD Operations for Estimates

```typescript
// Source: Supabase official JS docs

// List user's estimates (SAVE-05)
const { data: quotes, error } = await supabase
  .from('quotes')
  .select('id, name, created_at, updated_at')
  .order('updated_at', { ascending: false })
// RLS automatically filters to current user's quotes only

// Save new estimate (SAVE-01)
const { data, error } = await supabase
  .from('quotes')
  .insert({
    user_id: session.user.id,
    name: estimateName,
    data: { rooms, vatRate },
  })
  .select()
  .single()

// Load estimate (SAVE-02)
const { data: quote, error } = await supabase
  .from('quotes')
  .select('*')
  .eq('id', quoteId)
  .single()

// Update/overwrite estimate (SAVE-03)
const { error } = await supabase
  .from('quotes')
  .update({
    name: newName,
    data: { rooms, vatRate },
  })
  .eq('id', quoteId)

// Delete estimate (SAVE-04)
const { error } = await supabase
  .from('quotes')
  .delete()
  .eq('id', quoteId)
```

### TypeScript Types for Database

```typescript
// src/types/database.ts
// Generated via: npx supabase gen types typescript --project-id "nirhjivalmvuvxxbkjwk" > src/types/database.ts
// Or manually defined:

import type { WizardState } from './wizard'

export interface Database {
  public: {
    Tables: {
      quotes: {
        Row: {
          id: string
          user_id: string
          name: string
          data: { rooms: WizardState['rooms']; vatRate: WizardState['vatRate'] }
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          data: { rooms: WizardState['rooms']; vatRate: WizardState['vatRate'] }
          created_at?: string
          updated_at?: string
        }
        Update: {
          name?: string
          data?: { rooms: WizardState['rooms']; vatRate: WizardState['vatRate'] }
          updated_at?: string
        }
      }
    }
  }
}
```

### Environment Variables

```bash
# .env.local (NOT committed to git)
VITE_SUPABASE_URL=https://nirhjivalmvuvxxbkjwk.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...your-anon-key...
```

```typescript
// .env.example (committed to git, documents required vars)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Auth-Aware Navbar / UserMenu

```typescript
// Pseudocode for UserMenu in Navbar
function UserMenu() {
  const user = useAuthStore((s) => s.user)
  const isLoading = useAuthStore((s) => s.isLoading)

  if (isLoading) return <Skeleton className="h-8 w-20" />

  if (!user) {
    return (
      <Button onClick={() => navigate('#/login')}>
        {t('auth.login')}
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <User className="size-4" /> {user.email}
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => navigate('#/estimates')}>
          {t('auth.myEstimates')}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleSignOut}>
          {t('auth.logout')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| @supabase/auth-helpers-react | @supabase/supabase-js v2 directly (for SPAs) | 2024 | auth-helpers deprecated. Use supabase-js onAuthStateChange directly |
| @supabase/auth-helpers-* | @supabase/ssr (for SSR only) | 2024 | All framework-specific helpers consolidated into @supabase/ssr. NOT for SPAs |
| Implicit flow (default) | PKCE flow (recommended) | 2023 | PKCE is more secure, avoids URL fragment issues. Set `flowType: 'pkce'` |
| `getSession()` for current user | `onAuthStateChange` listener | 2024 | getSession reads from localStorage (can be tampered). onAuthStateChange is the canonical approach |

**Deprecated/outdated:**
- `@supabase/auth-helpers-react`: Deprecated. Use `@supabase/supabase-js` directly.
- `supabase.auth.session()`: Removed in v2. Use `supabase.auth.getSession()` or `onAuthStateChange`.
- Implicit flow as default for new projects: PKCE is now recommended for all OAuth clients including SPAs.

## Critical Design Decisions

### Decision 1: Email Autoconfirm (ON vs OFF)

**Option A (Recommended for MVP): Autoconfirm ON**
- Users can sign up and immediately use the app. No email verification step.
- Avoids the complex email redirect handling with HashRouter + PKCE.
- Risk: unverified emails can register. Acceptable for a renovation calculator (no sensitive data).
- Can always tighten later by turning autoconfirm OFF and adding email verification.

**Option B: Autoconfirm OFF (proper email verification)**
- Requires customizing email templates in Supabase to use `token_hash` query params.
- Email link format: `https://your-app.github.io/przerobka/#/auth/confirm?token_hash={{.TokenHash}}&type=email`
- App needs a `/auth/confirm` route that calls `supabase.auth.verifyOtp({ token_hash, type })`.
- More complex but more secure.

**Recommendation:** Start with autoconfirm ON for Phase 3 MVP. Add email verification in a future iteration if needed.

### Decision 2: Password Reset Redirect URL

With HashRouter, the `redirectTo` for password reset should point to a dedicated route:
```
https://your-username.github.io/przerobka/#/update-password
```

This URL must be added to Supabase's Redirect URLs allowlist in the dashboard.

The PKCE flow will pass the auth code as a query parameter that `supabase-js` can automatically detect and exchange (via `detectSessionInUrl: true`). Then `onAuthStateChange` fires with `PASSWORD_RECOVERY` event, and the app navigates to the update-password form.

**Caveat:** The interaction between HashRouter URLs and Supabase's `redirectTo` needs testing. Supabase may strip or misinterpret the `#` portion. If this is problematic, the alternative is to use a dedicated `token_hash`-based email template for password reset, similar to email confirmation.

### Decision 3: Storing Estimates Schema

Store the full `{ rooms, vatRate }` as a single JSONB `data` column. This is simpler than normalizing rooms/works into separate tables and allows the frontend to serialize/deserialize the exact Zustand state without transformation.

**Tradeoff:** Cannot query individual rooms or works via SQL. But for this app (user lists their own estimates, loads one at a time), JSONB is perfectly adequate. The only indexed queries are `user_id` (RLS) and `ORDER BY updated_at`.

## Open Questions

1. **Existing Supabase schema**
   - What we know: PROJECT.md references Supabase project `nirhjivalmvuvxxbkjwk` with `profiles` and `quotes` tables
   - What's unclear: Exact column definitions of existing tables. Whether RLS is already enabled. Whether the schema matches what we need.
   - Recommendation: Check existing schema in Supabase Dashboard before creating tables. Generate types with `npx supabase gen types typescript --project-id nirhjivalmvuvxxbkjwk`. Adapt schema if needed.

2. **HashRouter + PKCE redirect interaction**
   - What we know: PKCE uses query params (`?code=...`) instead of fragments. `detectSessionInUrl` should handle code exchange automatically.
   - What's unclear: Whether Supabase correctly follows a `redirectTo` URL that contains a `#` (hash route). The `#/update-password` portion may be stripped by the Supabase server when constructing the email link.
   - Recommendation: Test this early in implementation. If `redirectTo` with hash routes doesn't work, fall back to a simpler approach: all auth callbacks go to the root URL (`/przerobka/`), and `onAuthStateChange` detects the event type and navigates accordingly.

3. **Email sending limits**
   - What we know: Supabase built-in email is limited to 2 emails/hour (shared across all email types)
   - What's unclear: Whether the existing Supabase project has custom SMTP configured
   - Recommendation: Enable autoconfirm for MVP. Document that password reset emails are rate-limited. Configure custom SMTP later if needed.

4. **Supabase anon key and URL**
   - What we know: Project ID is `nirhjivalmvuvxxbkjwk`. Anon key is needed for client.
   - What's unclear: Whether the user has the anon key available or needs to retrieve it from the Supabase Dashboard.
   - Recommendation: Add `.env.local` with `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`. Add `.env.example` to git. Add `.env.local` to `.gitignore`.

## Sources

### Primary (HIGH confidence)
- [Supabase Auth with React Quickstart](https://supabase.com/docs/guides/auth/quickstarts/react) - React SPA auth setup, signUp/signIn patterns
- [Supabase Password-Based Auth](https://supabase.com/docs/guides/auth/passwords) - signUp, signInWithPassword, resetPasswordForEmail, updateUser
- [Supabase Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security) - RLS policies, auth.uid(), performance tips
- [Supabase Auth Sessions](https://supabase.com/docs/guides/auth/sessions) - Session lifecycle, token refresh, JWT expiration
- [Supabase onAuthStateChange](https://supabase.com/docs/reference/javascript/auth-onauthstatechange) - Event types, subscription cleanup, callback rules
- [Supabase PKCE Flow](https://supabase.com/docs/guides/auth/sessions/pkce-flow) - flowType config, code exchange, code verifier
- [Supabase Implicit Flow](https://supabase.com/docs/guides/auth/sessions/implicit-flow) - Fragment-based tokens, why it conflicts with hash routers
- [Supabase Redirect URLs](https://supabase.com/docs/guides/auth/redirect-urls) - URL allowlist, wildcard patterns, redirectTo config
- [Supabase Email Templates](https://supabase.com/docs/guides/auth/auth-email-templates) - Template variables, token_hash, custom link patterns
- [Supabase JSON/JSONB](https://supabase.com/docs/guides/database/json) - JSONB column usage, querying, performance
- [Supabase TypeScript Types](https://supabase.com/docs/guides/api/rest/generating-types) - Type generation from database schema

### Secondary (MEDIUM confidence)
- [Password Reset Flow Discussion #3360](https://github.com/orgs/supabase/discussions/3360) - Community patterns for password reset in SPAs
- [@supabase/supabase-js vs @supabase/ssr Discussion #28997](https://github.com/orgs/supabase/discussions/28997) - When to use which package
- [Supabase Zustand Integration Guide (Restack)](https://www.restack.io/docs/supabase-knowledge-supabase-zustand-integration) - Zustand + Supabase patterns
- [Hash fragment conflict Issue #455](https://github.com/supabase/gotrue-js/issues/455) - access_token in URL hash after OAuth/redirect
- [detectSessionInUrl with PKCE Issue #931](https://github.com/supabase/supabase-js/issues/931) - Config interaction between detectSessionInUrl and PKCE

### Tertiary (LOW confidence)
- [Supabase Auth email resend PKCE issue #42527](https://github.com/supabase/supabase/issues/42527) - auth.resend() may use implicit flow even when PKCE configured (potential gotcha)

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Supabase JS v2 is well-documented, stable, and the only option for this project
- Architecture: HIGH - Auth store + onAuthStateChange + CRUD patterns are well-established in Supabase ecosystem
- HashRouter + PKCE interaction: MEDIUM - PKCE avoids fragment conflict in theory, but redirect URL handling with hash routes needs runtime validation
- RLS policies: HIGH - Standard Postgres RLS patterns, well-documented
- Pitfalls: HIGH - Hash router conflict and auth state flash are well-known issues with documented solutions

**Research date:** 2026-02-24
**Valid until:** 2026-03-24 (stable domain, Supabase v2 is mature)
