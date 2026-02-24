---
phase: 02-core-wizard-kalkulator
plan: 03
subsystem: ui
tags: [react-pdf, pdf-export, wizard, i18n, zustand, shadcn, lucide]

# Dependency graph
requires:
  - phase: 02-core-wizard-kalkulator/02-02
    provides: WizardPage shell with RoomsStep, DimensionsStep, FloatingSummary, step navigation
  - phase: 02-core-wizard-kalkulator/02-01
    provides: Types, Zustand store, calc engine, formatPLN, i18n keys, shadcn components
provides:
  - WorksStep with 7 predefined work types per room (toggle, unit price, auto-quantity)
  - CustomWorkForm for user-defined works per room
  - SummaryStep with per-room breakdown and net/VAT/gross totals
  - PDF export standard and tabular formats with Polish diacritics via Roboto TTF
  - Complete 4-step wizard flow (rooms -> dimensions -> works -> summary -> PDF)
affects: [03-auth-cloud-save]

# Tech tracking
tech-stack:
  added: ["@react-pdf/renderer (PDF generation)", "Roboto TTF from CDN (Polish characters)"]
  patterns: ["PDF translations as plain object props (no hooks in PDF worker)", "ICON_MAP pattern reused for room type icons"]

key-files:
  created:
    - src/components/wizard/WorksStep.tsx
    - src/components/wizard/WorkRow.tsx
    - src/components/wizard/CustomWorkForm.tsx
    - src/components/wizard/SummaryStep.tsx
    - src/components/pdf/pdf-fonts.ts
    - src/components/pdf/EstimatePdf.tsx
    - src/components/pdf/EstimatePdfTabular.tsx
    - src/components/pdf/PdfDownloadButton.tsx
  modified:
    - src/pages/WizardPage.tsx

key-decisions:
  - "PDF translations passed as plain Record<string,string> props -- @react-pdf/renderer renders in worker thread, cannot use React hooks/context"
  - "Roboto TTF from cdnjs CDN -- supports Polish diacritics, lighter than bundling font files"
  - "STEPS array in WizardPage now contains all 4 components -- no more placeholders"

patterns-established:
  - "PDF i18n pattern: pre-resolve t() calls in parent component, pass as translations prop to PDF components"
  - "WorkRow pattern: Switch + auto-quantity + price input + computed cost per work type"

# Metrics
duration: 4min
completed: 2026-02-24
---

# Phase 2 Plan 3: WorksStep + SummaryStep + PDF Export Summary

**Complete wizard works step with 7 predefined work types, custom works, summary breakdown with net/VAT/gross, and PDF export (standard + tabular) with Roboto font for Polish diacritics**

## Performance

- **Duration:** 4 min
- **Started:** 2026-02-24T09:34:35Z
- **Completed:** 2026-02-24T09:38:33Z
- **Tasks:** 2
- **Files modified:** 9

## Accomplishments
- WorksStep renders 7 predefined work types per room with Switch toggle, unit price input, auto-calculated quantity from dimensions, and computed cost
- CustomWorkForm allows adding/removing user-defined works with name, unit, quantity, and price per room
- SummaryStep shows per-room work breakdown table with quantity, unit price, and cost, plus net/VAT/gross totals
- PDF export in standard (list) and tabular (table) formats with Roboto TTF font for full Polish character support
- All 4 wizard steps are real components -- complete flow from rooms to PDF export

## Task Commits

Each task was committed atomically:

1. **Task 1: WorksStep with predefined + custom works** - `a32984e` (feat)
2. **Task 2: SummaryStep + PDF export standard/tabular** - `41d387a` (feat)

## Files Created/Modified
- `src/components/wizard/WorkRow.tsx` - Single work row with switch toggle, auto-quantity, price input, cost display
- `src/components/wizard/CustomWorkForm.tsx` - Form to add/remove custom works per room with unit selector
- `src/components/wizard/WorksStep.tsx` - Step 3: renders 7 predefined works + custom works per room with subtotals
- `src/components/wizard/SummaryStep.tsx` - Step 4: per-room breakdown table, totals card, PDF format selector + download
- `src/components/pdf/pdf-fonts.ts` - Roboto TTF font registration from CDN for Polish diacritics
- `src/components/pdf/EstimatePdf.tsx` - Standard PDF layout with room sections, work rows, totals
- `src/components/pdf/EstimatePdfTabular.tsx` - Tabular PDF with column headers, alternating rows, merged room cells
- `src/components/pdf/PdfDownloadButton.tsx` - PDFDownloadLink wrapper with pre-resolved i18n translations
- `src/pages/WizardPage.tsx` - All 4 steps in STEPS array, no placeholders remain

## Decisions Made
- PDF translations passed as plain `Record<string, string>` props because @react-pdf/renderer renders in a worker thread that cannot use React hooks or context (useTranslation would fail)
- Roboto TTF from cdnjs CDN chosen for Polish diacritics support -- TTF format required (not WOFF2)
- All 4 steps now in STEPS array in WizardPage, eliminating conditional placeholder rendering

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- Phase 2 is now COMPLETE: full wizard flow from room selection through PDF export
- Guest mode calculator works end-to-end without authentication
- Ready for Phase 3: Auth + Cloud Save (login, save/load estimates, RLS)
- WizardPage chunk is ~1.7MB (due to @react-pdf/renderer) -- code-splitting could be addressed in Phase 3 or as optimization pass

## Self-Check: PASSED

All 9 key files verified present. Both task commits (a32984e, 41d387a) verified in git log.

---
*Phase: 02-core-wizard-kalkulator*
*Completed: 2026-02-24*
