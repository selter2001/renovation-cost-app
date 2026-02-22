---
phase: 01-foundation-design-system
plan: 01
subsystem: infrastructure
tags: [vite, react19, typescript, tailwind-v4, shadcn-ui, i18next, react-router, hash-router, theme, dark-mode, fouc, fontsource]
requires: []
provides:
  - Dzialajacy projekt Vite 6 + React 19 + TypeScript z budowaniem i lintowaniem
  - Tailwind v4 z @tailwindcss/vite plugin i aliasami @/*
  - shadcn/ui New York style z Button komponentem
  - ThemeProvider z persystencja dark/light/system w localStorage
  - Anti-FOUC inline script zsynchronizowany z ThemeProvider
  - i18next PL/EN z LanguageDetector i persystencja w localStorage
  - createHashRouter z Layout + HomePage
  - Fonty Inter i Montserrat Variable zaladowane lokalnie
affects: [02-ui-foundation, 03-auth-cloud]
tech-stack:
  added:
    - vite@6.4.1
    - react@19.2.4
    - react-dom@19.2.4
    - typescript@5.8.3
    - tailwindcss@4.2.0
    - "@tailwindcss/vite@4.2.0"
    - "@vitejs/plugin-react@4.7.0"
    - react-router@7.13.0
    - i18next@25.8.13
    - react-i18next@15.7.4
    - i18next-browser-languagedetector@8.2.1
    - "@fontsource-variable/inter@5.2.8"
    - "@fontsource-variable/montserrat@5.2.8"
    - class-variance-authority@0.7.1
    - clsx@2.1.1
    - tailwind-merge@3.5.0
    - lucide-react@0.575.0
    - radix-ui (przez shadcn)
    - eslint@9.39.3
  patterns:
    - Vite base path /przerobka/ dla GitHub Pages deployment
    - Aliasy TypeScript @/* -> src/*
    - Anti-FOUC pattern z inline script + ThemeProvider (te same klucze localStorage)
    - i18n side-effect import przed App w main.tsx
    - HashRouter zamiast BrowserRouter (kompatybilnosc GitHub Pages)
    - CSS variables dla light/dark theme w index.css
key-files:
  created:
    - package.json
    - vite.config.ts
    - tsconfig.json
    - tsconfig.app.json
    - tsconfig.node.json
    - index.html
    - eslint.config.js
    - components.json
    - src/vite-env.d.ts
    - src/index.css
    - src/lib/utils.ts
    - src/components/ui/button.tsx
    - src/components/theme-provider.tsx
    - src/i18n/index.ts
    - "src/i18n/@types/i18next.d.ts"
    - src/i18n/locales/pl/common.json
    - src/i18n/locales/en/common.json
    - src/router/index.tsx
    - src/pages/HomePage.tsx
    - src/main.tsx
    - src/App.tsx
  modified:
    - .gitignore
key-decisions:
  - "ESLint v9.39.3 zablokowany -- v10 niezgodny z eslint-plugin-react (PR #3979)"
  - "Projekt stworzony recznie zamiast przez Vite CLI -- CLI wymaga pustego katalogu i interakcji"
  - "shadcn CLI tworzy pliki pod @/ zamiast src/ -- plik przeniesiony recznie do src/components/ui/"
  - "Deklaracje typow dla @fontsource-variable dodane w vite-env.d.ts (brak typow w pakietach)"
  - "favicon.svg href zmieniony z /przerobka/favicon.svg na /favicon.svg (Vite dodaje base path automatycznie)"
patterns-established:
  - "localStorage klucz 'renocost-theme' (nie 'vite-ui-theme') -- unikalna nazwa per-app"
  - "localStorage klucz 'renocost-lng' -- unikalna nazwa per-app"
  - "Kolejnosc importow w main.tsx: fonty -> i18n -> CSS -> komponenty"
duration: 4min
completed: 2026-02-22
---

# Phase 01 Plan 01: Scaffold Projektu RenoCost -- Summary

**Fundament techniczny projektu: Vite 6 + React 19 + TypeScript + Tailwind v4 + shadcn/ui z dark mode bez FOUC, i18n PL/EN z persystencja i HashRouter dla GitHub Pages.**

## Performance

- **Duration:** 4 minuty
- **Started:** 2026-02-22T11:07:01Z
- **Completed:** 2026-02-22T11:11:45Z
- **Tasks:** 2/2
- **Files created:** 21
- **Files modified:** 1

## Accomplishments

1. **Projekt Vite 6 + React 19 + TypeScript** -- stworzony recznie (CLI wymaga pustego katalogu), buduje sie bez bledow (`pnpm build`), lint przechodzi bez bledow (`pnpm lint`).
2. **Tailwind v4** -- zainstalowany z `@tailwindcss/vite` plugin (nie PostCSS), klasy aplikowane, CSS variables dla light/dark theme.
3. **shadcn/ui New York style** -- components.json stworzony recznie (CLI problemy z Tailwind v4 detekcja), Button komponent dodany i przeniesiony do prawidlowej lokalizacji.
4. **Dark mode bez FOUC** -- inline script w index.html czyta `localStorage["renocost-theme"]` przed hydracją React i dodaje klase `.dark` na `<html>`. ThemeProvider uzywa tego samego klucza.
5. **i18n PL/EN** -- i18next z LanguageDetector, klucz `renocost-lng`, fallback do polskiego, type-safe przez module augmentation.
6. **HashRouter** -- `createHashRouter` z Layout + HomePage, URL zawiera `/#/`, kompatybilny z GitHub Pages.
7. **Fonty lokalne** -- Inter i Montserrat Variable z `@fontsource-variable` (brak requestow do Google Fonts CDN).
8. **Aliasy @/** -- `tsconfig.app.json` i `vite.config.ts` skonfigurowane razem.

## Task Commits

| Task | Nazwa | Commit | Kluczowe pliki |
|------|-------|--------|----------------|
| 1 | Scaffold projektu i konfiguracja narzedzi | `5bbbce8` | package.json, vite.config.ts, tsconfig.*, index.html, eslint.config.js, components.json, src/index.css, src/lib/utils.ts, src/components/ui/button.tsx |
| 2 | Theme system, i18n, routing i fonty | `fe7e2cd` | src/main.tsx, src/App.tsx, src/components/theme-provider.tsx, src/i18n/*, src/router/index.tsx, src/pages/HomePage.tsx |

## Files Created/Modified

**Created (21 plikow):**
- `package.json` -- zaleznosci projektu z React 19, Tailwind v4, react-router, i18next
- `vite.config.ts` -- base: "/przerobka/", @tailwindcss/vite plugin, aliasy @/*
- `tsconfig.json` / `tsconfig.app.json` / `tsconfig.node.json` -- konfiguracja TS z paths
- `index.html` -- entry point z anti-FOUC script
- `eslint.config.js` -- ESLint v9 z eslint-plugin-react-hooks i react-refresh
- `components.json` -- shadcn/ui New York, Tailwind v4 CSS, aliasy
- `src/vite-env.d.ts` -- typy Vite + deklaracje dla @fontsource-variable
- `src/index.css` -- @import "tailwindcss", CSS variables light/dark
- `src/lib/utils.ts` -- cn() helper (clsx + tailwind-merge)
- `src/components/ui/button.tsx` -- shadcn Button z CVA
- `src/components/theme-provider.tsx` -- ThemeProvider + useTheme hook
- `src/i18n/index.ts` -- i18next init z LanguageDetector
- `src/i18n/@types/i18next.d.ts` -- module augmentation dla type safety
- `src/i18n/locales/pl/common.json` -- polskie tlumaczenia
- `src/i18n/locales/en/common.json` -- angielskie tlumaczenia
- `src/router/index.tsx` -- createHashRouter z Layout + HomePage
- `src/pages/HomePage.tsx` -- placeholder z useTranslation
- `src/main.tsx` -- entry point z prawidlowa kolejnoscia importow
- `src/App.tsx` -- RouterProvider

**Modified (1 plik):**
- `.gitignore` -- dodano .env*, .pnpm-store, *.tsbuildinfo

## Decisions Made

| Decyzja | Uzasadnienie |
|---------|--------------|
| Projekt stworzony recznie zamiast przez Vite CLI | CLI wymaga pustego katalogu lub interakcji, niemozliwe w warunkach automatycznego wykonania |
| ESLint v9.39.3 (nie v10) | eslint-plugin-react niezgodny z ESLint v10 -- komentarz w eslint.config.js |
| shadcn CLI plik przeniesiony recznie | CLI tworzy @/components/ zamiast src/components/ -- znany problem z aliasami |
| Deklaracje typow w vite-env.d.ts | @fontsource-variable pakiety nie maja typow TS -- Rule 1 auto-fix |
| favicon.svg href: /favicon.svg | Vite dodaje base path automatycznie -- /przerobka/favicon.svg powoduje podwojenie sciezki |

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Brak deklaracji typow dla @fontsource-variable**
- **Found during:** Task 2 -- pierwsza proba `pnpm build`
- **Issue:** TypeScript nie znajdowal typow dla `@fontsource-variable/inter` i `@fontsource-variable/montserrat` -- blad TS2307
- **Fix:** Dodano deklaracje `declare module "@fontsource-variable/inter"` w `src/vite-env.d.ts`
- **Files modified:** `src/vite-env.d.ts`
- **Commit:** `5bbbce8` (w ramach Task 1 commit)

**2. [Rule 3 - Blocking] Vite CLI nie mogl zainicjalizowac projektu**
- **Found during:** Task 1 -- Vite CLI pyta interaktywnie o nadpisanie katalogu
- **Issue:** `pnpm create vite@latest . -- --template react-ts` anulowalo sie z "Operation cancelled" bo katalog nie byl pusty
- **Fix:** Uzyto tymczasowego katalogu, ale scaffold byl vanilla JS (nie react-ts). Stworzono strukture projektu recznie na podstawie standardowego szablonu Vite React-TS.
- **Files created:** Wszystkie pliki projektu stworzone recznie

**3. [Rule 1 - Bug] shadcn CLI tworzy pliki pod @/ zamiast src/**
- **Found during:** Task 1 -- shadcn add button stworzyl plik w `/Users/.../przerobka/@/components/ui/button.tsx`
- **Issue:** shadcn CLI nie rozpoznal aliasu @/ jako src/ i stworzyl dosłowny katalog "@/"
- **Fix:** Plik przeniesiony recznie z `@/components/ui/button.tsx` do `src/components/ui/button.tsx`, katalog `@/` usuniety
- **Files modified:** `src/components/ui/button.tsx` (przeniesiony)

**4. [Rule 1 - Bug] Podwojna sciezka favicon w index.html**
- **Found during:** Task 1 -- weryfikacja dev servera
- **Issue:** `href="/przerobka/favicon.svg"` plus Vite base path `/przerobka/` = `/przerobka/przerobka/favicon.svg`
- **Fix:** Zmieniono na `href="/favicon.svg"` -- Vite dodaje base path automatycznie do statycznych assetow w HTML
- **Files modified:** `index.html`

## Issues Encountered

- pnpm nie bylo zainstalowane globalnie -- zainstalowano przez `npm install -g pnpm`
- Vite CLI (create vite@latest) nie dziala nieinteraktywnie w niepustym katalogu -- rozwiazano przez reczne tworzenie projektu

## Next Phase Readiness

Phase 02 (UI Foundation) moze sie rozpoczac. Wszystkie fundamenty sa gotowe:
- Tailwind v4 gotowy do uzycia klas
- shadcn/ui gotowy -- Button dziala, latwo dodac kolejne komponenty
- ThemeProvider dostepny przez `useTheme` hook
- i18next dostepny przez `useTranslation` hook
- Router gotowy -- dodac trasy przez `src/router/index.tsx`
- Aliasy @/* dzialaja w calym projekcie

## Self-Check: PASSED

Wszystkie pliki istnieja:
- package.json: FOUND
- vite.config.ts: FOUND
- index.html: FOUND
- src/components/theme-provider.tsx: FOUND
- src/i18n/index.ts: FOUND
- src/i18n/@types/i18next.d.ts: FOUND
- src/router/index.tsx: FOUND
- src/index.css: FOUND
- src/components/ui/button.tsx: FOUND
- src/main.tsx: FOUND

Commity istnieja:
- 5bbbce8: chore(01-01): scaffold projektu i konfiguracja narzedzi
- fe7e2cd: feat(01-01): theme system, i18n, routing i strona glowna
