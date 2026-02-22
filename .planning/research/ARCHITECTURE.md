# Architecture Research

**Domain:** Wizard-style renovation cost calculator SPA
**Researched:** 2026-02-22
**Confidence:** HIGH

## Standard Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                         UI Layer (React)                            │
│  ┌───────────┐  ┌───────────┐  ┌───────────┐  ┌───────────┐       │
│  │  Wizard    │  │  Floating  │  │  Auth      │  │  Settings  │      │
│  │  Steps     │  │  Cost Bar  │  │  Views     │  │  (theme/   │      │
│  │  (pages)   │  │  (sticky)  │  │  (login/   │  │   i18n)    │      │
│  │            │  │            │  │   signup)  │  │            │      │
│  └─────┬─────┘  └─────┬─────┘  └─────┬──────┘  └─────┬──────┘      │
│        │              │              │               │              │
├────────┴──────────────┴──────────────┴───────────────┴──────────────┤
│                   State Layer (Zustand store)                       │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌────────────┐    │
│  │  Wizard    │  │  Calc      │  │  Auth      │  │  UI        │    │
│  │  Slice     │  │  Slice     │  │  Slice     │  │  Slice     │    │
│  │ (steps,   │  │ (rooms,   │  │ (session, │  │ (theme,   │    │
│  │  nav)     │  │  prices,  │  │  user)    │  │  lang)    │    │
│  │            │  │  totals)  │  │            │  │            │    │
│  └────────────┘  └────────────┘  └────────────┘  └────────────┘    │
├─────────────────────────────────────────────────────────────────────┤
│                  Calculation Engine (pure functions)                 │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │  calculateRoomCost() | calculateTotalCost() | formatQuote() │   │
│  └──────────────────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────────────────┤
│                  Services Layer (side effects)                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │
│  │  Supabase    │  │  PDF Export  │  │  i18n        │              │
│  │  Client      │  │  Service     │  │  Config      │              │
│  └──────────────┘  └──────────────┘  └──────────────┘              │
└─────────────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

| Component | Responsibility | Typical Implementation |
|-----------|----------------|------------------------|
| WizardShell | Manages step navigation, AnimatePresence transitions, progress bar | Container component wrapping step pages |
| StepRooms | Room selection/addition UI (step 1) | Form with room cards, add/remove |
| StepDimensions | Per-room dimension inputs (step 2) | Dynamic form fields per room |
| StepWorkTypes | Work type selection per room (step 3) | Checkbox grid with price hints |
| StepSummary | Full cost breakdown, edit links, export (step 4) | Read-only summary + action buttons |
| FloatingCostBar | Persistent bottom bar showing running total | Sticky/fixed element, reads derived state |
| AuthGuard | Route protection for quote saving | HOC or wrapper checking auth state |
| ThemeProvider | CSS variable class toggling (dark/light) | Context + localStorage persistence |
| I18nProvider | Language initialization, namespace loading | react-i18next I18nextProvider wrapper |
| SupabaseProvider | Auth session listener, client singleton | Context providing supabase client |

## Recommended Project Structure

```
src/
├── app/                        # Application shell
│   ├── App.tsx                 # Root: providers, router
│   ├── Router.tsx              # HashRouter, route definitions
│   └── providers/              # All providers (theme, i18n, auth, query)
│       ├── ThemeProvider.tsx
│       ├── I18nProvider.tsx
│       └── SupabaseProvider.tsx
├── features/                   # Feature modules (vertical slices)
│   ├── wizard/                 # Core wizard feature
│   │   ├── components/         # WizardShell, ProgressBar, StepNav
│   │   ├── steps/              # StepRooms, StepDimensions, StepWorkTypes, StepSummary
│   │   ├── hooks/              # useWizardNavigation, useStepValidation
│   │   └── types.ts            # WizardStep, Room, WorkType interfaces
│   ├── calculator/             # Calculation engine
│   │   ├── engine.ts           # Pure calculation functions
│   │   ├── prices.ts           # Price catalog / constants
│   │   ├── hooks/              # useTotalCost, useRoomCost (derived)
│   │   └── types.ts            # CostBreakdown, PriceEntry interfaces
│   ├── auth/                   # Authentication feature
│   │   ├── components/         # LoginForm, SignupForm, AuthGuard
│   │   ├── hooks/              # useAuth, useSession
│   │   └── types.ts
│   ├── quotes/                 # Quote persistence (Supabase)
│   │   ├── components/         # QuotesList, QuoteDetail
│   │   ├── hooks/              # useSaveQuote, useLoadQuote
│   │   └── types.ts
│   └── export/                 # PDF export feature
│       ├── components/         # ExportButton, PrintPreview
│       ├── templates/          # PDF layout template component
│       └── hooks/              # useExportPDF
├── shared/                     # Shared across features
│   ├── components/             # Button, Input, Card, Modal, FloatingBar
│   ├── hooks/                  # useLocalStorage, useMediaQuery
│   ├── layouts/                # MainLayout, WizardLayout
│   └── types/                  # Global type definitions
├── store/                      # Zustand store
│   ├── index.ts                # Combined bound store
│   ├── wizardSlice.ts          # Step state, navigation
│   ├── calcSlice.ts            # Rooms, dimensions, work types, prices
│   ├── authSlice.ts            # Session, user profile
│   └── uiSlice.ts              # Theme, language, sidebar state
├── lib/                        # External service configs
│   ├── supabase.ts             # Supabase client singleton
│   ├── i18n.ts                 # i18next configuration
│   └── pdf.ts                  # jsPDF + html2canvas setup
├── locales/                    # Translation files
│   ├── pl/
│   │   ├── common.json         # Shared UI strings
│   │   ├── wizard.json         # Wizard-specific strings
│   │   └── export.json         # Export-specific strings
│   └── en/
│       ├── common.json
│       ├── wizard.json
│       └── export.json
├── styles/                     # Global styles
│   ├── globals.css             # CSS variables (theme tokens)
│   └── animations.css          # Framer Motion keyframes (if needed)
├── main.tsx                    # Entry point
└── vite-env.d.ts               # Vite types
```

### Structure Rationale

- **features/:** Vertical slicing by domain (wizard, calculator, auth, quotes, export). Each feature is self-contained with its own components, hooks, and types. This prevents cross-feature coupling and makes the build order obvious -- features can be built independently.
- **store/:** Single Zustand store with slices, co-located in one directory. Slices can read each other via `get()` (e.g., calcSlice reads wizardSlice step data). Middleware (persist, devtools) applied only at the combined store level.
- **shared/:** Reusable UI primitives and utility hooks. No business logic here -- only presentational components and generic utilities.
- **lib/:** Third-party service configuration. Each external dependency has one initialization file. Components never import from SDKs directly -- they go through lib/ or store/ or feature hooks.
- **locales/:** Namespaced translation files (common, wizard, export). Loaded lazily per namespace via i18next-http-backend to avoid loading all translations upfront.

## Architectural Patterns

### Pattern 1: Zustand Slices with Derived Calculations

**What:** Split Zustand store into domain slices. Calculation results are **derived** (computed from store state), never stored as state. Use `useMemo` or Zustand selectors to recompute totals whenever rooms/dimensions/workTypes change.
**When to use:** Always. This is the core pattern for the entire app.
**Trade-offs:** Simpler than Redux. No provider wrapper needed. Slices can cross-reference via `get()`. Trade-off: less structure/ceremony than Redux -- team must self-enforce slice boundaries.

**Example:**
```typescript
// store/calcSlice.ts
import { StateCreator } from 'zustand';
import { BoundStore } from './index';
import { Room, WorkType } from '../features/wizard/types';

export interface CalcSlice {
  rooms: Room[];
  addRoom: (room: Room) => void;
  removeRoom: (id: string) => void;
  updateRoomDimensions: (id: string, width: number, height: number) => void;
  setRoomWorkTypes: (roomId: string, workTypes: WorkType[]) => void;
}

export const createCalcSlice: StateCreator<BoundStore, [], [], CalcSlice> = (set) => ({
  rooms: [],
  addRoom: (room) => set((state) => ({ rooms: [...state.rooms, room] })),
  removeRoom: (id) => set((state) => ({ rooms: state.rooms.filter(r => r.id !== id) })),
  updateRoomDimensions: (id, width, height) =>
    set((state) => ({
      rooms: state.rooms.map(r => r.id === id ? { ...r, width, height } : r),
    })),
  setRoomWorkTypes: (roomId, workTypes) =>
    set((state) => ({
      rooms: state.rooms.map(r => r.id === roomId ? { ...r, workTypes } : r),
    })),
});
```

```typescript
// features/calculator/engine.ts -- PURE FUNCTIONS, no React, no state
import { Room, PriceCatalog, CostBreakdown } from './types';

export function calculateRoomCost(room: Room, prices: PriceCatalog): number {
  const area = room.width * room.height;
  return room.workTypes.reduce((sum, wt) => {
    const unitPrice = prices[wt.id]?.pricePerM2 ?? 0;
    return sum + area * unitPrice;
  }, 0);
}

export function calculateTotalCost(rooms: Room[], prices: PriceCatalog): CostBreakdown {
  const roomCosts = rooms.map(room => ({
    roomId: room.id,
    roomName: room.name,
    cost: calculateRoomCost(room, prices),
  }));
  return {
    rooms: roomCosts,
    total: roomCosts.reduce((sum, rc) => sum + rc.cost, 0),
  };
}
```

```typescript
// features/calculator/hooks/useTotalCost.ts -- derived, never stored
import { useMemo } from 'react';
import { useBoundStore } from '../../../store';
import { calculateTotalCost } from '../engine';
import { PRICE_CATALOG } from '../prices';

export function useTotalCost() {
  const rooms = useBoundStore((state) => state.rooms);
  return useMemo(() => calculateTotalCost(rooms, PRICE_CATALOG), [rooms]);
}
```

### Pattern 2: AnimatePresence Wizard Transitions

**What:** Wrap wizard step content in Framer Motion's `AnimatePresence` with `mode="wait"`. Each step is a `motion.div` keyed by step index. The exiting step fully animates out before the entering step begins.
**When to use:** For all wizard step transitions. Direction-aware (slide left on "next", slide right on "back").
**Trade-offs:** `mode="wait"` adds ~200-300ms per transition (exit + enter). Feels polished but slightly slower than instant swap. Use `mode="sync"` with absolute positioning only if you need cross-fade.

**Example:**
```typescript
// features/wizard/components/WizardShell.tsx
import { AnimatePresence, motion } from 'framer-motion';

const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 100 : -100,
    opacity: 0,
  }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({
    x: direction > 0 ? -100 : 100,
    opacity: 0,
  }),
};

function WizardShell() {
  const { currentStep, direction } = useBoundStore(
    (s) => ({ currentStep: s.currentStep, direction: s.direction })
  );
  const StepComponent = STEP_COMPONENTS[currentStep];

  return (
    <AnimatePresence mode="wait" custom={direction}>
      <motion.div
        key={currentStep}
        custom={direction}
        variants={variants}
        initial="enter"
        animate="center"
        exit="exit"
        transition={{ duration: 0.25, ease: 'easeInOut' }}
      >
        <StepComponent />
      </motion.div>
    </AnimatePresence>
  );
}
```

### Pattern 3: Theme via CSS Variables + Class Toggle

**What:** Define all color tokens as CSS custom properties in `:root` (light) and `.dark` (dark). Toggle the `dark` class on `<html>`. Tailwind v4 maps these variables to utilities via `@theme`. Persist preference in localStorage. Inject synchronous script in `index.html <head>` to prevent flash of wrong theme (FOUWT).
**When to use:** Always for this project. Two themes (light/dark) with CSS variables scale cleanly.
**Trade-offs:** Slightly more setup than Tailwind's `dark:` prefix approach, but avoids duplicating every color class with `dark:` variants. Components stay theme-agnostic.

**Example:**
```css
/* styles/globals.css */
:root {
  --color-bg: #ffffff;
  --color-surface: #f8f9fa;
  --color-text: #1a1a2e;
  --color-primary: #2563eb;
  --color-accent: #10b981;
  --color-border: #e2e8f0;
}

.dark {
  --color-bg: #0f172a;
  --color-surface: #1e293b;
  --color-text: #e2e8f0;
  --color-primary: #3b82f6;
  --color-accent: #34d399;
  --color-border: #334155;
}
```

```html
<!-- index.html: prevent FOUWT -->
<script>
  (function() {
    const theme = localStorage.getItem('theme');
    if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    }
  })();
</script>
```

### Pattern 4: i18n with Namespaced Lazy Loading

**What:** Use react-i18next with i18next-http-backend to load translation namespaces on demand. Split translations by feature (common, wizard, export). Use the `useTranslation('wizard')` hook with namespace parameter. Fallback language: `pl` (primary audience).
**When to use:** From the start. Namespace splitting prevents loading all strings at once.
**Trade-offs:** Slightly more complex setup than a single JSON file, but essential for performance when the app grows. Namespace loading adds a brief async moment -- handle with Suspense fallback.

**Example:**
```typescript
// lib/i18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpBackend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(HttpBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'pl',
    supportedLngs: ['pl', 'en'],
    ns: ['common', 'wizard', 'export'],
    defaultNS: 'common',
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
    interpolation: { escapeValue: false },
  });

export default i18n;
```

## Data Flow

### Core Wizard Data Flow

```
User Input (step form)
    ↓
Zustand action (e.g., addRoom, updateRoomDimensions)
    ↓
Store state update (rooms[], workTypes[])
    ↓ (selector subscription)
    ├──→ Step component re-renders (shows updated form)
    └──→ FloatingCostBar re-renders
              ↓
         useTotalCost() hook
              ↓
         calculateTotalCost() [pure function]
              ↓
         Derived CostBreakdown → rendered in bar
```

### Step Navigation Flow

```
User clicks "Next" / "Back"
    ↓
Validation check (per-step schema, optional)
    ↓ (pass)
wizardSlice.goToStep(n) → updates currentStep + direction
    ↓
AnimatePresence detects key change
    ↓
Exit animation (current step slides out)
    ↓
Enter animation (next step slides in)
```

### Quote Save Flow

```
User clicks "Save Quote" (StepSummary)
    ↓
AuthGuard check → if not logged in → redirect to login
    ↓ (authenticated)
useSaveQuote() hook
    ↓
Serialize wizard state (rooms + costs + metadata)
    ↓
supabase.from('quotes').insert(quoteData)
    ↓
Success → show confirmation + quote ID
Error → show error toast + retry option
```

### PDF Export Flow

```
User clicks "Export PDF" (StepSummary)
    ↓
useExportPDF() hook
    ↓
Render hidden <PrintPreview /> component (ref)
    ↓
html2canvas captures ref → canvas
    ↓
jsPDF creates PDF from canvas image
    ↓
Browser triggers download (quote-{date}.pdf)
```

### Key Data Flows

1. **Calculation pipeline:** Room data in store → pure `calculateTotalCost()` → derived hook `useTotalCost()` → FloatingCostBar + StepSummary. Calculations never stored -- always recomputed. This eliminates sync bugs between "stored total" and "actual total."

2. **Theme + i18n:** Both are "global UI state" managed in `uiSlice` (for Zustand-level tracking) but the actual switching mechanism lives outside React: theme toggles a CSS class on `<html>`, i18n changes via `i18n.changeLanguage()`. Components react automatically (CSS variables repaint, `useTranslation` re-renders).

3. **Auth session:** Supabase `onAuthStateChange` listener (set up once in `SupabaseProvider`) pushes session updates to `authSlice`. Components read auth state from store, never directly from Supabase client.

## Scaling Considerations

| Scale | Architecture Adjustments |
|-------|--------------------------|
| MVP (~100 users) | Single Zustand store, static price catalog in code, GitHub Pages hosting. No optimization needed. |
| Growth (~10K users) | Move price catalog to Supabase table (admin can update prices without deploy). Add Supabase RLS policies. Consider edge caching for static assets. |
| Scale (~100K+ users) | Split calculation engine into Web Worker if step forms become heavy. Move PDF generation to Supabase Edge Function (server-side). Add analytics events. |

### Scaling Priorities

1. **First bottleneck:** Price catalog management. Hardcoded prices require redeployment to update. Solution: move to Supabase table with admin UI (can be deferred to post-MVP).
2. **Second bottleneck:** PDF generation on low-end mobile devices. html2canvas is CPU-intensive. Solution: move to server-side generation via Supabase Edge Function or defer with loading indicator.

## Anti-Patterns

### Anti-Pattern 1: Storing Calculated Totals in State

**What people do:** Store `totalCost` in Zustand alongside rooms/dimensions, update it with a separate action every time input changes.
**Why it's wrong:** Creates sync bugs. If someone adds a room but forgets to call `recalculateTotals()`, the displayed total is stale. Two sources of truth for the same data.
**Do this instead:** Derive totals via pure functions in hooks (`useTotalCost`). The total is always computed from current rooms state. Zero sync bugs. React's useMemo handles caching.

### Anti-Pattern 2: Monolithic Wizard Component

**What people do:** Put all 4 steps in a single component with conditional rendering (`if (step === 1) return <div>...</div>`), accumulating 500+ lines.
**Why it's wrong:** Unmaintainable, impossible to test individual steps, all step logic loaded at once, AnimatePresence cannot animate transitions between inline conditionals.
**Do this instead:** Each step is its own component file. WizardShell maps step index to component. AnimatePresence keys on step index for smooth transitions.

### Anti-Pattern 3: Direct Supabase Calls in Components

**What people do:** Call `supabase.from('quotes').insert(...)` directly inside onClick handlers in components.
**Why it's wrong:** Scatters data access logic across the codebase. Makes testing difficult (must mock Supabase everywhere). No single place to handle errors or retries.
**Do this instead:** Create feature hooks (`useSaveQuote`, `useLoadQuote`) that encapsulate Supabase calls. Components call hooks. Hooks handle loading/error states. Supabase client is initialized once in `lib/supabase.ts`.

### Anti-Pattern 4: One Giant Translation File

**What people do:** Put all strings in a single `translation.json` per language, growing to thousands of keys.
**Why it's wrong:** Loaded entirely on first render. Grows unmanageably. No lazy loading possible.
**Do this instead:** Namespace per feature (`common.json`, `wizard.json`, `export.json`). Use `i18next-http-backend` to load namespaces on demand. Only `common` loaded upfront; `wizard` loaded when entering wizard.

### Anti-Pattern 5: BrowserRouter on GitHub Pages

**What people do:** Use `BrowserRouter` (clean URLs like `/wizard/step1`) and wonder why routes 404 on page refresh.
**Why it's wrong:** GitHub Pages is static hosting. It does not rewrite all routes to `index.html`. Any path not matching a real file returns 404.
**Do this instead:** Use `HashRouter`. URLs become `/#/wizard/step1`. Works perfectly on GitHub Pages with zero configuration. Alternatively, copy `index.html` to `404.html` in the build step (hackier, less reliable).

## Integration Points

### External Services

| Service | Integration Pattern | Notes |
|---------|---------------------|-------|
| Supabase Auth | `onAuthStateChange` listener in provider, session stored in Zustand `authSlice` | Use `@supabase/supabase-js` createClient once in `lib/supabase.ts`. Social auth (Google) optional. |
| Supabase Database | Feature hooks call `supabase.from('quotes')` for CRUD | RLS policies: users can only read/write their own quotes. |
| GitHub Pages | Static deploy via `gh-pages` npm package or GitHub Actions | HashRouter required. `base` path in `vite.config.ts` must match repo name. |

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| Wizard Steps <-> Store | Zustand selectors + actions | Steps read from and write to `calcSlice`. No direct step-to-step communication. |
| FloatingCostBar <-> Calculator | `useTotalCost()` hook (derived) | Bar is read-only. Never writes to store. Pure consumer of derived state. |
| Auth <-> Quotes | `authSlice` provides `userId` for quote ownership | Quotes feature checks `authSlice.session` before Supabase calls. |
| PDF Export <-> Wizard | Export reads final state from store | Export feature is completely decoupled. Reads store state, renders its own template, generates PDF. |
| Theme/i18n <-> All Components | CSS variables (theme), `useTranslation` hook (i18n) | Global. No prop drilling. Theme changes repaint via CSS. Language changes trigger re-render via i18next. |

## Build Order (Dependencies)

Suggested implementation order based on architectural dependencies:

```
Phase 1: Foundation (no feature depends on these -- everything depends on them)
  ├── Vite + React + TypeScript scaffold
  ├── HashRouter setup
  ├── Zustand store skeleton (empty slices)
  ├── Tailwind + CSS variables (theme tokens)
  ├── i18n configuration (react-i18next)
  └── Shared UI components (Button, Input, Card)

Phase 2: Core Wizard (depends on: foundation)
  ├── WizardShell + AnimatePresence transitions
  ├── Step components (Rooms → Dimensions → WorkTypes → Summary)
  ├── calcSlice + wizardSlice (populated)
  ├── Calculation engine (pure functions)
  └── FloatingCostBar (derived from calcSlice)

Phase 3: Polish + Persistence (depends on: wizard working)
  ├── Supabase client setup
  ├── Auth flow (login/signup/guard)
  ├── Quote save/load
  ├── PDF export
  └── Theme toggle + language switcher UI
```

This order ensures each phase produces a working increment: Phase 1 = empty shell that compiles and routes; Phase 2 = functional calculator without persistence; Phase 3 = full product with auth and export.

## Sources

- [Zustand Slices Pattern - Official Docs](https://zustand.docs.pmnd.rs/guides/slices-pattern) -- HIGH confidence
- [Zustand GitHub - Slices Pattern Guide](https://github.com/pmndrs/zustand/blob/main/docs/guides/slices-pattern.md) -- HIGH confidence
- [Motion (Framer Motion) - AnimatePresence](https://motion.dev/docs/react-animate-presence) -- HIGH confidence
- [Build UI - Multistep Wizard (Framer Motion Recipes)](https://buildui.com/courses/framer-motion-recipes/multistep-wizard) -- MEDIUM confidence
- [React Docs - You Might Not Need an Effect (Derived State)](https://react.dev/learn/you-might-not-need-an-effect) -- HIGH confidence
- [React Docs - useMemo](https://react.dev/reference/react/useMemo) -- HIGH confidence
- [Tailwind CSS - Dark Mode](https://tailwindcss.com/docs/dark-mode) -- HIGH confidence
- [react-i18next - Introduction](https://react.i18next.com/) -- HIGH confidence
- [Supabase Docs - Auth with React](https://supabase.com/docs/guides/auth/quickstarts/react) -- HIGH confidence
- [Supabase Docs - User Sessions](https://supabase.com/docs/guides/auth/sessions) -- HIGH confidence
- [Build a Multi-Step Form with React Hook Form](https://claritydev.net/blog/build-a-multistep-form-with-react-hook-form) -- MEDIUM confidence
- [Zustand Architecture Patterns at Scale (Brainhub)](https://brainhub.eu/library/zustand-architecture-patterns-at-scale) -- MEDIUM confidence
- [html2pdf.js - Client-side HTML-to-PDF](https://ekoopmans.github.io/html2pdf.js/) -- MEDIUM confidence
- [jsPDF - GitHub](https://github.com/parallax/jsPDF) -- HIGH confidence
- [GitHub Pages SPA Routing Discussion](https://github.com/orgs/community/discussions/36010) -- HIGH confidence

---
*Architecture research for: Renovation cost calculator wizard SPA*
*Researched: 2026-02-22*
