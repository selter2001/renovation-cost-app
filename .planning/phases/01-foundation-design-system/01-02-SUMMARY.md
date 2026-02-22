---
phase: 01-foundation-design-system
plan: 02
subsystem: ui
tags: [navbar, glassmorphism, theme-toggle, language-toggle, responsive, sheet, deploy, github-actions, hero]
requires:
  - phase: 01-01
    provides: ThemeProvider, useTheme, i18next, HashRouter, shadcn Button, Tailwind v4, fonty
provides:
  - Responsywna nawigacja z logo, przelacznikami jezyka i motywu, placeholder konta
  - ModeToggle (dark/light/system) z DropdownMenu
  - LanguageToggle (PL/EN toggle)
  - Layout wrapper z Navbar + Outlet
  - Hero sekcja z glassmorphism karta na stronie glownej
  - GitHub Actions deploy workflow (pnpm + GitHub Pages)
  - Kompletny design system — oklch palette, brand color, font-heading
affects: [02-core-wizard, 03-auth-cloud]
tech-stack:
  added:
    - shadcn dropdown-menu
    - shadcn sheet
  patterns:
    - Glassmorphism navbar (backdrop-blur-lg + bg-background/80)
    - Glassmorphism card (bg-card/80 + backdrop-blur-md)
    - Brand color (--color-brand) do akcentow
    - Anti-FOUC z data-theme-ready attribute (blokuje tranzycje CSS przy ladowaniu)
    - Responsive navbar (desktop inline, mobile hamburger + Sheet)
    - oklch palette zamiast hsl — profesjonalniejsze kolory
key-files:
  created:
    - src/components/layout/Navbar.tsx
    - src/components/layout/Layout.tsx
    - src/components/theme-toggle.tsx
    - src/components/language-toggle.tsx
    - src/components/ui/dropdown-menu.tsx
    - src/components/ui/sheet.tsx
    - .github/workflows/deploy.yml
  modified:
    - src/pages/HomePage.tsx
    - src/index.css
    - src/router/index.tsx
    - src/components/theme-provider.tsx
    - src/i18n/locales/pl/common.json
    - index.html
key-decisions:
  - "Paleta przeniesiona z hsl na oklch — lepszy gamut, profesjonalniejsze kolory"
  - "Brand color (--color-brand) zamiast primary dla akcentow — oddzielenie od shadcn defaults"
  - "Logo: ikonka R w kwadracie + tekst RenoCost z akcentem brand — widoczne w obu motywach"
  - "Anti-FOUC: data-theme-ready + inline style blokuje tranzycje przy ladowaniu, usuwany po 1. renderze"
  - "Wszystkie zmienne shadcn zarejestrowane w @theme inline — wymagane przez Tailwind v4"
patterns-established:
  - "Glassmorphism: backdrop-blur-lg + bg-background/80 + border-border/40 (navbar)"
  - "Glassmorphism card: bg-card/80 + backdrop-blur-md + border-border/50 + shadow-xl"
  - "Brand accent: bg-brand / text-brand-foreground — uzywac do CTA i wyroznikow"
  - "font-heading class: Montserrat Variable — dla naglowkow i logo"
  - "Responsive pattern: hidden md:flex (desktop) + flex md:hidden (mobile) + Sheet"
duration: 12min
completed: 2026-02-22
---

# Phase 01 Plan 02: UI Nawigacja + Deploy — Summary

**Responsywna nawigacja glassmorphism z przelacznikami jezyka/motywu, hero strona glowna z oklch palette i GitHub Actions deploy workflow**

## Performance

- **Duration:** ~12 min (w tym checkpoint + poprawki)
- **Started:** 2026-02-22T11:12:00Z
- **Completed:** 2026-02-22T19:40:00Z
- **Tasks:** 3/3 (2 auto + 1 checkpoint verified)
- **Files created:** 7
- **Files modified:** 6

## Accomplishments

1. **Responsywna nawigacja** — logo (ikonka R + tekst RenoCost), ModeToggle (3 opcje z DropdownMenu), LanguageToggle (Globe + PL/EN), placeholder konta (User icon). Desktop: inline. Mobile: hamburger + Sheet.
2. **Design system oklch** — cala paleta przeniesiona z hsl na oklch, zmienne shadcn zarejestrowane w @theme inline (wymagane przez Tailwind v4), brand color do akcentow.
3. **Hero strona glowna** — glassmorphism karta z tytulem, podtytulem, CTA w kolorze brand. Polskie znaki diakrytyczne.
4. **Anti-FOUC** — data-theme-ready blokuje tranzycje CSS przy ladowaniu strony, usuwany po pierwszym renderze React.
5. **GitHub Actions deploy** — workflow z pnpm, buduje i uploaduje do GitHub Pages. Wymaga recznego wlaczenia Pages w ustawieniach repo.

## Task Commits

| Task | Nazwa | Commit | Typ |
|------|-------|--------|-----|
| 1 | Komponenty nawigacji, przelaczniki, layout i strona glowna | `021dea4` | feat |
| 2 | GitHub Actions deploy workflow | `78942a2` | feat |
| CP | Checkpoint fixes — CSS theme, polskie znaki, FOUC | `98d1014` | fix |

## Files Created/Modified

**Created (7):**
- `src/components/layout/Navbar.tsx` — responsywna nawigacja z glassmorphism
- `src/components/layout/Layout.tsx` — layout wrapper z Navbar + Outlet
- `src/components/theme-toggle.tsx` — ModeToggle z DropdownMenu (light/dark/system)
- `src/components/language-toggle.tsx` — LanguageToggle z Globe icon (PL/EN)
- `src/components/ui/dropdown-menu.tsx` — shadcn DropdownMenu
- `src/components/ui/sheet.tsx` — shadcn Sheet (mobile menu)
- `.github/workflows/deploy.yml` — CI/CD do GitHub Pages z pnpm

**Modified (6):**
- `src/pages/HomePage.tsx` — hero sekcja z glassmorphism karta i brand CTA
- `src/index.css` — oklch palette, @theme inline z shadcn mappings, font variables
- `src/router/index.tsx` — Layout wrapper zamiast prostego div
- `src/components/theme-provider.tsx` — data-theme-ready cleanup po 1. renderze
- `src/i18n/locales/pl/common.json` — polskie znaki diakrytyczne
- `index.html` — anti-FOUC z data-theme-ready + inline style

## Decisions Made

| Decyzja | Uzasadnienie |
|---------|--------------|
| oklch zamiast hsl | Lepszy gamut kolorow, profesjonalniejsze gradienty |
| Brand color oddzielny od primary | shadcn primary jest uzywany do wielu elementow — brand do akcentow |
| data-theme-ready pattern | Blokowanie tranzycji CSS przy ladowaniu eliminuje mikro-FOUC |
| Wszystkie zmienne shadcn w @theme inline | Tailwind v4 generuje utility classes TYLKO dla zmiennych w @theme |
| shadcn DropdownMenu i Sheet | Gotowa dostepnosc (ARIA, focus management) vs budowanie od zera |

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Tailwind v4 nie generowal klas shadcn**
- **Found during:** Checkpoint — uzytkownik zglosil "slabo wyglada, logo nie widze"
- **Issue:** Zmienne CSS shadcn (--background, --primary, itd.) nie byly zarejestrowane w @theme inline — Tailwind v4 nie generowal klas bg-background, text-primary, from-primary
- **Fix:** Dodano pelne mapowanie --color-* w @theme inline, przeniesiono palette na oklch
- **Files modified:** src/index.css
- **Commit:** `98d1014`

**2. [Rule 1 - Bug] Logo niewidoczne — gradient z identycznych kolorow**
- **Found during:** Checkpoint
- **Issue:** from-primary to-ring byly identyczne kolory (oba hsl(222 47% 11%)) — gradient niewidoczny z text-transparent
- **Fix:** Logo zmienione na ikonke R (bg-brand) + tekst "RenoCost" z akcentem brand (bez clip-text)
- **Files modified:** src/components/layout/Navbar.tsx
- **Commit:** `98d1014`

**3. [Rule 1 - Bug] Brak polskich znakow diakrytycznych**
- **Found during:** Checkpoint
- **Issue:** Tlumaczenia PL mialy ASCII zamiast polskich znakow (Kosztow -> Kosztów, wycene -> wycenę)
- **Fix:** Poprawione wszystkie tlumaczenia PL
- **Files modified:** src/i18n/locales/pl/common.json
- **Commit:** `98d1014`

**4. [Rule 1 - Bug] Mikro-FOUC z tranzycjami CSS**
- **Found during:** Checkpoint
- **Issue:** ThemeProvider useEffect usuwał/dodawał klasy dark/light co triggerowało transition: background-color
- **Fix:** Anti-FOUC: data-theme-ready blokuje tranzycje przy ladowaniu, usuwany po requestAnimationFrame
- **Files modified:** index.html, src/components/theme-provider.tsx
- **Commit:** `98d1014`

---

**Total deviations:** 4 auto-fixed (4x Rule 1 - Bug, znalezione podczas checkpoint)
**Impact:** Krytyczne — bez fix #1 caly design system nie dzialal. Checkpoint uratował sytuacje.

## Issues Encountered

- shadcn CLI tworzy pliki pod @/ zamiast src/ — ten sam problem co w Plan 01, pliki przeniesione recznie
- GitHub Pages deploy workflow wymaga recznego wlaczenia Pages w ustawieniach repozytorium (Settings > Pages > Source: GitHub Actions)

## User Setup Required

None — no external service configuration required.
UWAGA: GitHub Pages wymaga recznego wlaczenia w Settings > Pages > Source: GitHub Actions.

## Next Phase Readiness

Phase 1 kompletna. Fundament gotowy do Phase 2:
- Nawigacja, przelaczniki, layout — gotowe
- Design system (oklch, glassmorphism, brand color) — ustawiony
- i18n PL/EN — dzialajacy, tlumaczenia z polskimi znakami
- Router — gotowy na dodawanie tras wizard
- Deploy pipeline — gotowy po wlaczeniu Pages

---
*Phase: 01-foundation-design-system*
*Completed: 2026-02-22*
