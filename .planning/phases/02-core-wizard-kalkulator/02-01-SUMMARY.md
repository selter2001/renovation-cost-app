---
phase: 02-core-wizard-kalkulator
plan: 01
subsystem: data, state, calc
tags: [zustand, immer, typescript, i18n, shadcn, react-pdf, motion]

# Dependency graph
requires:
  - phase: 01-foundation-design-system
    provides: "Vite + React 19 + TS + Tailwind v4 + shadcn + i18n + routing"
provides:
  - "TypeScript types: Room, RoomType, WorkType, CustomWork, WizardState, PREDEFINED_WORKS, ROOM_TYPES"
  - "Zustand store useWizardStore with immer + persist (localStorage key: renocost-wizard-v1)"
  - "Calc engine: calcWorkCost, calcRoomTotal, calcNetTotal, calcGrossFromNet, calcRoomNetArea, getWorkQuantity"
  - "PLN formatter: formatPLN, parseInputToGrosze"
  - "shadcn components: progress, skeleton, card, input, switch, badge, dialog"
  - "i18n keys PL/EN: wizard, rooms, dimensions, works, summary"
affects: [02-02, 02-03, 03-01, 03-02]

# Tech tracking
tech-stack:
  added: [zustand@5.0.11, immer@11.1.4, motion@12.34.3, "@react-pdf/renderer@4.3.2", use-sound@5.0.0]
  patterns: [zustand-immer-persist, integer-arithmetic-grosze, pure-calc-functions]

key-files:
  created:
    - src/types/wizard.ts
    - src/stores/wizard-store.ts
    - src/lib/calc.ts
    - src/lib/format.ts
    - src/components/ui/progress.tsx
    - src/components/ui/skeleton.tsx
    - src/components/ui/card.tsx
    - src/components/ui/input.tsx
    - src/components/ui/switch.tsx
    - src/components/ui/badge.tsx
    - src/components/ui/dialog.tsx
  modified:
    - package.json
    - pnpm-lock.yaml
    - src/i18n/locales/pl/common.json
    - src/i18n/locales/en/common.json

key-decisions:
  - "CustomWork includes unitPrice field directly (not just quantity) for self-contained cost calculation"
  - "Store partialize excludes currentStep -- wizard always starts at step 0 after refresh"
  - "calcCustomWorkCost takes full CustomWork object (unitPrice on the work itself, not separate)"

patterns-established:
  - "Zustand store with immer + persist: create<Store>()(persist(immer((set) => ...)))"
  - "Integer arithmetic for currency: all prices/costs in grosze (1 PLN = 100 groszy)"
  - "Pure calc functions: no side effects, import types, return numbers"
  - "localStorage key convention: renocost-{feature}-v{version}"

# Metrics
duration: 4min
completed: 2026-02-24
---

# Phase 2 Plan 01: Data Foundation Summary

**Zustand store with immer+persist for wizard state, integer-based calc engine on grosze, TypeScript types for Room/Work/CustomWork, and 60+ i18n keys PL/EN**

## Performance

- **Duration:** 4 min
- **Started:** 2026-02-24T08:55:19Z
- **Completed:** 2026-02-24T08:59:07Z
- **Tasks:** 3
- **Files created:** 11
- **Files modified:** 4

## Accomplishments

- Installed all Phase 2 dependencies: zustand, immer, motion, @react-pdf/renderer (v4.3.2 React 19 compatible), use-sound
- Created 7 shadcn UI components (progress, skeleton, card, input, switch, badge, dialog) and moved from literal @/ to src/
- Built complete TypeScript type system: Room, RoomType, WorkType, CustomWork, WizardState with 7 predefined room types and 7 predefined work types
- Implemented Zustand store with immer+persist middleware, full CRUD for rooms/works/customWorks, VAT rate toggle, and localStorage persistence
- Built pure calculation engine on integer arithmetic (grosze): room net area, work quantity from dimensions, work/room/net/VAT/gross totals
- Added formatPLN (Intl.NumberFormat) and parseInputToGrosze for currency I/O
- Extended i18n with 60+ keys across wizard, rooms, dimensions, works, and summary sections in both PL and EN

## Task Commits

Each task was committed atomically:

1. **Task 1: Install dependencies and shadcn components** - `0c48448` (chore)
2. **Task 2: Types, Zustand store and calculations** - `0269c1b` (feat)
3. **Task 3: i18n keys for wizard** - `8db9cf3` (feat)

## Files Created/Modified

- `src/types/wizard.ts` - Room, RoomType, WorkType, CustomWork, WizardState types + PREDEFINED_WORKS, ROOM_TYPES constants
- `src/stores/wizard-store.ts` - Zustand store with immer+persist, CRUD actions for rooms/works/customWorks, VAT, reset
- `src/lib/calc.ts` - Pure calc functions: calcRoomNetArea, getWorkQuantity, calcWorkCost, calcCustomWorkCost, calcRoomTotal, calcNetTotal, calcVat, calcGrossFromNet
- `src/lib/format.ts` - formatPLN (Intl.NumberFormat PLN) and parseInputToGrosze
- `src/components/ui/progress.tsx` - shadcn progress bar component
- `src/components/ui/skeleton.tsx` - shadcn skeleton loader component
- `src/components/ui/card.tsx` - shadcn card component
- `src/components/ui/input.tsx` - shadcn input component
- `src/components/ui/switch.tsx` - shadcn switch toggle component
- `src/components/ui/badge.tsx` - shadcn badge component
- `src/components/ui/dialog.tsx` - shadcn dialog/modal component
- `package.json` - Added zustand, immer, motion, @react-pdf/renderer, use-sound
- `pnpm-lock.yaml` - Updated lockfile
- `src/i18n/locales/pl/common.json` - Added wizard/rooms/dimensions/works/summary keys (PL)
- `src/i18n/locales/en/common.json` - Added wizard/rooms/dimensions/works/summary keys (EN)

## Decisions Made

- **CustomWork includes unitPrice:** The plan's CustomWork interface lacked unitPrice. Added it directly on CustomWork so calcCustomWorkCost is self-contained without needing a separate price lookup.
- **Static import in calc.ts:** Replaced planned dynamic require() with static ESM import of PREDEFINED_WORKS since there's no circular dependency -- calc.ts imports types from wizard.ts which is a leaf module.
- **Store partialize excludes currentStep:** Wizard always resumes at step 0 after page refresh, per plan specification. Only rooms and vatRate persist.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Replaced require() with static ESM import in calc.ts**
- **Found during:** Task 2 (calc.ts implementation)
- **Issue:** Initial implementation used `require()` for PREDEFINED_WORKS import which would fail in Vite ESM bundling
- **Fix:** Changed to standard static import since there are no circular dependencies between calc.ts and wizard.ts
- **Files modified:** src/lib/calc.ts
- **Verification:** pnpm build passes, TypeScript type-check passes
- **Committed in:** 0269c1b (Task 2 commit)

**2. [Rule 2 - Missing Critical] Added unitPrice field to CustomWork interface**
- **Found during:** Task 2 (types + calc implementation)
- **Issue:** Plan's CustomWork interface had quantity but no unitPrice -- calcCustomWorkCost would have no price to multiply
- **Fix:** Added `unitPrice: number` field to CustomWork, calcCustomWorkCost uses `work.unitPrice` directly
- **Files modified:** src/types/wizard.ts, src/lib/calc.ts
- **Verification:** Type system is consistent, calc functions work correctly
- **Committed in:** 0269c1b (Task 2 commit)

---

**Total deviations:** 2 auto-fixed (1 bug, 1 missing critical)
**Impact on plan:** Both fixes necessary for correctness. No scope creep.

## Issues Encountered

- shadcn CLI created files under literal `@/components/ui/` directory instead of `src/components/ui/` -- known issue, handled by moving files and deleting @/ directory as planned.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- All types, store, calc functions, and i18n keys ready for wizard UI implementation (02-02)
- @react-pdf/renderer v4.3.2 confirmed compatible with React 19
- motion library installed and ready for wizard step animations
- 7 new shadcn components available for wizard UI

## Self-Check: PASSED

- All 6 key files verified present
- All 3 task commits verified in git log (0c48448, 0269c1b, 8db9cf3)

---
*Phase: 02-core-wizard-kalkulator*
*Completed: 2026-02-24*
