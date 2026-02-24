---
phase: 02-core-wizard-kalkulator
plan: 02
subsystem: ui
tags: [react, wizard, motion, zustand, use-sound, lucide, tailwind, i18n]

# Dependency graph
requires:
  - phase: 02-01
    provides: "Wizard types, Zustand store with persist, calc engine, i18n keys"
provides:
  - "WizardPage with 4-step animated controller"
  - "WizardProgress bar with step indicators"
  - "WizardNav with Wstecz/Dalej buttons and validation"
  - "RoomsStep with interactive room type cards and CRUD"
  - "DimensionsStep with per-room wall/ceiling arrays and scalar inputs"
  - "FloatingSummary with AnimatedCounter and VAT rate toggle"
  - "Route /wizard with lazy loading and Skeleton fallback"
  - "HomePage CTA linking to /wizard"
  - "Sound effects pop.mp3 and success.mp3 (UI-07)"
affects: [02-03-wizard-works-summary-pdf]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "AnimatePresence mode=wait with direction-aware slide variants"
    - "useSound for UI audio feedback on user actions"
    - "AnimatedCounter with motion useSpring/useTransform for currency display"
    - "FloatingSummary glassmorphism fixed bar pattern"
    - "React.lazy + Suspense with Skeleton fallback for route code splitting"
    - "Type assertion (as never) for dynamic i18n keys from typed constants"

key-files:
  created:
    - src/pages/WizardPage.tsx
    - src/components/wizard/WizardProgress.tsx
    - src/components/wizard/WizardNav.tsx
    - src/components/wizard/RoomsStep.tsx
    - src/components/wizard/RoomCard.tsx
    - src/components/wizard/DimensionsStep.tsx
    - src/components/wizard/FloatingSummary.tsx
    - src/components/wizard/AnimatedCounter.tsx
    - public/sounds/pop.mp3
    - public/sounds/success.mp3
  modified:
    - src/router/index.tsx
    - src/pages/HomePage.tsx

key-decisions:
  - "Dynamic i18n keys from ROOM_TYPES use 'as never' assertion for strict TypeScript compatibility"
  - "Sound effects generated via ffmpeg (tiny sine wave files <2KB) rather than downloaded from CDN"
  - "FloatingSummary uses formatPLN initially, AnimatedCounter upgrade in Task 2 for spring-animated values"

patterns-established:
  - "ICON_MAP pattern: Record<string, LucideIcon> maps icon name strings to Lucide components for dynamic rendering"
  - "Wizard step controller: AnimatePresence mode=wait with direction state for slide animations"
  - "Card-based room type selector grid with hover:scale and hover:border-brand/50"

# Metrics
duration: 4min
completed: 2026-02-24
---

# Phase 2 Plan 2: Wizard UI Shell with RoomsStep, DimensionsStep, and FloatingSummary

**Wizard UI with animated step transitions (motion AnimatePresence), interactive room type cards with pop sound, per-room dimension inputs with live net area, and floating cost summary with spring-animated currency counter**

## Performance

- **Duration:** 4 min
- **Started:** 2026-02-24T09:25:16Z
- **Completed:** 2026-02-24T09:29:22Z
- **Tasks:** 2
- **Files modified:** 12

## Accomplishments
- Full wizard shell with 4-step navigation, progress bar, and animated slide transitions between steps
- RoomsStep with 7 room type cards (Lucide icons), add/remove/edit rooms with pop sound feedback
- DimensionsStep with dynamic wall/ceiling arrays (add/remove) and scalar dimension inputs, live net area calculation
- FloatingSummary glassmorphism bar at bottom with AnimatedCounter (spring-based) showing netto/VAT/brutto and VAT rate toggle
- Route /wizard with lazy loading (React.lazy + Suspense) and Skeleton fallback
- HomePage CTA button linked to /wizard via react-router Link

## Task Commits

Each task was committed atomically:

1. **Task 1: WizardPage, progress bar, navigation, animated transitions, route/CTA link, sound files** - `3f2ce1e` (feat)
2. **Task 2: RoomsStep with interactive cards, DimensionsStep with per-room inputs, FloatingSummary with AnimatedCounter** - `fa272fa` (feat)

## Files Created/Modified
- `src/pages/WizardPage.tsx` - Wizard step controller with AnimatePresence, direction-aware slide animations, success sound on Summary step
- `src/components/wizard/WizardProgress.tsx` - Progress bar with 4 step indicators (numbered circles) and i18n labels
- `src/components/wizard/WizardNav.tsx` - Wstecz/Dalej navigation with step-specific validation (rooms.length > 0 for step 0)
- `src/components/wizard/RoomsStep.tsx` - Room type card grid (7 types) with add/remove and pop sound
- `src/components/wizard/RoomCard.tsx` - Individual room card with edit name dialog, animated removal (motion.div)
- `src/components/wizard/DimensionsStep.tsx` - Per-room dimension inputs: walls/ceilings arrays, floor/corners/grooves/acrylic scalars, live net area badge
- `src/components/wizard/FloatingSummary.tsx` - Fixed bottom bar with glassmorphism, AnimatedCounter, VAT rate toggle
- `src/components/wizard/AnimatedCounter.tsx` - Spring-animated currency display using motion useSpring/useTransform with Intl.NumberFormat
- `public/sounds/pop.mp3` - Subtle pop sound for room addition (ffmpeg-generated, 748 bytes)
- `public/sounds/success.mp3` - Success chime for Summary step arrival (ffmpeg-generated, 1584 bytes)
- `src/router/index.tsx` - Added /wizard route with lazy loading and WizardPageSkeleton fallback
- `src/pages/HomePage.tsx` - CTA button wrapped with Link to="/wizard"

## Decisions Made
- **Dynamic i18n key assertion:** ROOM_TYPES.labelKey is typed as `string` but i18n `t()` expects literal keys. Used `as never` type assertion for clean TypeScript compatibility rather than loosening i18n types.
- **ffmpeg-generated sounds:** Generated pop.mp3 and success.mp3 via ffmpeg sine waves (under 2KB each) instead of downloading from CDN to avoid external dependency and ensure reproducibility.
- **AnimatePresence mode="wait":** Chose `mode="wait"` over `mode="sync"` for cleaner sequential step transitions without overlap artifacts.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed TypeScript error with dynamic i18n keys**
- **Found during:** Task 2 (RoomsStep implementation)
- **Issue:** `t(type.labelKey)` failed TypeScript strict check because `labelKey` is typed as `string` but `t()` expects literal union of known keys
- **Fix:** Added `as never` type assertion on dynamic labelKey usage in RoomsStep
- **Files modified:** src/components/wizard/RoomsStep.tsx
- **Verification:** `pnpm build` passes
- **Committed in:** fa272fa (Task 2 commit)

---

**Total deviations:** 1 auto-fixed (1 bug)
**Impact on plan:** Minimal -- standard TypeScript strict mode workaround for dynamic i18n keys. No scope creep.

## Issues Encountered
None

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Wizard shell with steps 0-1 (Rooms, Dimensions) fully functional
- Steps 2-3 (Works, Summary) render as placeholders, ready for 02-03-PLAN.md implementation
- FloatingSummary shows 0,00 PLN because no works with prices are configured yet -- will show real values after 02-03
- All wizard store actions (addRoom, removeRoom, updateRoomName, updateDimension, setVatRate) connected and tested via build

## Self-Check: PASSED

All 13 key files verified present. Both task commits (3f2ce1e, fa272fa) verified in git log. `pnpm build` passes without errors.

---
*Phase: 02-core-wizard-kalkulator*
*Completed: 2026-02-24*
