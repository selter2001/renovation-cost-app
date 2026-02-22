# Stack Research

**Domain:** Kalkulator kosztow remontu — SPA z wizard UI, glassmorphism, eksportem PDF
**Researched:** 2026-02-22
**Confidence:** HIGH

---

## Recommended Stack

### Core Technologies

| Technology | Version | Purpose | Why Recommended | Confidence |
|------------|---------|---------|-----------------|------------|
| React | ^19.2.4 | UI framework | Standard branzy, React 19 stabilny od grudnia 2024, usuniety forwardRef (prostszy kod), lepsze wsparcie dla Server Components (nieuzywane tu, ale ekosystem jest w pelni kompatybilny) | HIGH |
| Vite | ^7.3.1 | Build tool + dev server | Oficjalny naslednik CRA (deprecjonowany luty 2025). Vite 7 wymaga Node 20.19+, cold start <300ms, HMR w mikrosekundach. Rolldown dostepny eksperymentalnie, ale jeszcze nie domyslny | HIGH |
| TypeScript | ^5.7 | Type safety | Standard w 2026 — kazda zalecana biblioteka ma wbudowane typy. Zod v4 generuje typy bezposrednio ze schematow, co eliminuje duplikacje | HIGH |
| Tailwind CSS | ^4.2.0 | Utility-first styling | v4 wydany 22.01.2025 — zero konfiguracji, 5x szybsze peine buildy, 100x szybsze inkrementalne. Natywne wsparcie dla glassmorphism przez `backdrop-blur-*`, `bg-white/10`, cascade layers | HIGH |
| React Router | ^7.13.0 | Client-side routing | v7 stabilny, laczenie SPA-first + Remix patterns. Import uproszczony do `react-router` (bez `-dom`). Basename + SPA fallback rozwiazuje routing na GitHub Pages | HIGH |

### Backend as a Service

| Technology | Version | Purpose | Why Recommended | Confidence |
|------------|---------|---------|-----------------|------------|
| @supabase/supabase-js | ^2.97.0 | Auth + baza danych + storage | Izomorficzny klient JS. Auth (email/social), PostgreSQL (wyceny), Storage (eksport PDF). Darmowy tier wystarczajacy na MVP. Dropped Node 18 w v2.79.0, ale w SPA to bez znaczenia | HIGH |

### State Management

| Technology | Version | Purpose | Why Recommended | Confidence |
|------------|---------|---------|-----------------|------------|
| Zustand | ^5.0.11 | Globalny stan aplikacji | Prostszy niz Redux Toolkit, zero boilerplate, module-first (idealne dla SPA). Wizard state (biezacy krok, zebrane dane) + konfiguracja (motyw, jezyk). 5643 projektow w npm. Selektory minimalizuja re-rendery | HIGH |

### Forms & Validation

| Technology | Version | Purpose | Why Recommended | Confidence |
|------------|---------|---------|-----------------|------------|
| React Hook Form | ^7.71.2 | Zarzadzanie formularzami | Najlepsza wydajnosc dla wizard-style forms — uncontrolled inputs + refs = zero re-renderow na keystroke. Natywny multi-step pattern. 40M+ pobranzaz tygodniowo | HIGH |
| Zod | ^4.3.6 | Schema validation | TypeScript-first, generuje typy ze schematow (jedno zrodlo prawdy). `refine()` i `superRefine()` dla custom walidacji (np. metraraz > 0, VAT 8% vs 23%). zodResolver wykrywa automatycznie Zod v3/v4 | HIGH |
| @hookform/resolvers | ^5.2.2 | Adapter RHF + Zod | Oficjalny bridge miedzy React Hook Form a Zod. Wspiera Zod v4. Jeden import: `zodResolver` | HIGH |

### Internationalization (i18n)

| Technology | Version | Purpose | Why Recommended | Confidence |
|------------|---------|---------|-----------------|------------|
| i18next | ^25.8.11 | Core i18n engine | 6.3M+ pobranzaz/tydzien, 9.8K stars. Namespace support (lazy-loading tlumaczen per krok wizard). Fallback logic, detekcja jezyka przegladarki, pluralizacja ICU | HIGH |
| react-i18next | ^16.5.4 | React bindings | `useTranslation()` hook — naturalny w React. Komponent `<Trans>` dla interpolacji z JSX. ~22KB razem z i18next (akceptowalne) | HIGH |

### Animation

| Technology | Version | Purpose | Why Recommended | Confidence |
|------------|---------|---------|-----------------|------------|
| motion | ^12.34.3 | Animacje UI | Dawniej "framer-motion", rebrand na "motion" (listopad 2024). Import: `motion/react`. Drop-in replacement, ta sama API. Layout animations, `AnimatePresence` (wizard transitions), `useScroll`, hardware-accelerated w v12.34+ | HIGH |

### PDF Export

| Technology | Version | Purpose | Why Recommended | Confidence |
|------------|---------|---------|-----------------|------------|
| @react-pdf/renderer | ^4.3.2 | Generowanie PDF client-side | React-first: budowanie PDF jako komponenty JSX. Flexbox layout, style CSS. Prawdziwy tekst (nie screenshot jak jsPDF+html2canvas). Idealne dla kosztorysu — tabele, naglowki, logo. 860K+/tydzien | HIGH |

### Sound Effects

| Technology | Version | Purpose | Why Recommended | Confidence |
|------------|---------|---------|-----------------|------------|
| use-sound | ^5.0.0 | Micro-interaction sounds | Hook React od Josh W. Comeau. ~1KB gzip + async Howler (10KB). Sprite support (jeden plik, wiele dzwiekow). Volume, playbackRate. Ostatnia aktualizacja II.2025 | MEDIUM |

### Dark/Light Mode

| Technology | Version | Purpose | Why Recommended | Confidence |
|------------|---------|---------|-----------------|------------|
| (Tailwind CSS natywny) | — | Przelaczanie motywow | Tailwind v4 ma wbudowane `dark:` variants. Strategia `class` na `<html>` + Zustand store + `localStorage` persistence. Nie potrzeba dodatkowej biblioteki | HIGH |

### UI Components

| Technology | Version | Purpose | Why Recommended | Confidence |
|------------|---------|---------|-----------------|------------|
| shadcn/ui | latest CLI | Baza komponentow (dialog, select, toast, slider) | NIE jest biblioteka — to generator kopiujacy komponenty do projektu. Pelna kontrola nad kodem. Tailwind v4 + React 19 ready. OKLCH kolory, `data-slot` atrybuty. Glassmorphism mozna nalozyc na wygenerowane komponenty | HIGH |
| Radix UI Primitives | (przez shadcn) | Accessible primitives | Headless, ARIA-compliant. shadcn/ui uzywa Radix pod spodem. Nie instaluj osobno — shadcn zarzadza tym | HIGH |

### Development Tools

| Tool | Version | Purpose | Notes |
|------|---------|---------|-------|
| Vitest | ^4.0.18 | Unit + component testing | Natywna integracja z Vite, 10-20x szybszy niz Jest. v8 coverage wbudowane | HIGH |
| @testing-library/react | latest | Component testing | User-centric assertions, standard w ekosystemie React | HIGH |
| ESLint | ^10.0.0 | Linting | v10 wydany 20.02.2026. Flat config (`eslint.config.ts`). typescript-eslint + eslint-plugin-react | MEDIUM |
| Prettier | latest | Code formatting | Integracja z Tailwind v4 przez `prettier-plugin-tailwindcss` | HIGH |
| gh-pages | latest | Deployment | Automatyczny deploy `dist/` na GitHub Pages branch | HIGH |

---

## Installation

```bash
# Scaffold projektu
npm create vite@latest przerobka-kalkulator -- --template react-ts
cd przerobka-kalkulator

# Core dependencies
npm install react-router zustand react-hook-form @hookform/resolvers zod

# Supabase
npm install @supabase/supabase-js

# i18n
npm install i18next react-i18next

# Animation
npm install motion

# PDF export
npm install @react-pdf/renderer

# Sound
npm install use-sound

# UI components (shadcn/ui — instalacja przez CLI)
npx shadcn@latest init

# Dev dependencies
npm install -D tailwindcss @tailwindcss/vite vitest @testing-library/react @testing-library/jest-dom
npm install -D eslint @eslint/js typescript-eslint eslint-plugin-react-hooks
npm install -D prettier prettier-plugin-tailwindcss
npm install -D gh-pages
```

### Konfiguracja Vite dla GitHub Pages

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/przerobka-kalkulator/', // nazwa repo na GitHub
})
```

### Konfiguracja React Router z basename

```typescript
// main.tsx
import { BrowserRouter } from 'react-router'

<BrowserRouter basename="/przerobka-kalkulator/">
  <App />
</BrowserRouter>
```

---

## Alternatives Considered

| Category | Recommended | Alternative | Why Not Alternative |
|----------|-------------|-------------|---------------------|
| Build tool | Vite 7 | Vite 8 beta (Rolldown) | v8 w beta — stabilnosc ważniejsza niz marginalny zysk wydajnosci. Migracja latwa gdy v8 stabilny |
| State mgmt | Zustand | Jotai | Jotai lepszy dla atomic/fine-grained state. Wizard to centralized flow — Zustand bardziej naturalny. Mniejsza krzywa uczenia |
| State mgmt | Zustand | Redux Toolkit | RTK to overkill dla SPA tego rozmiaru. Zustand robi to samo bez boilerplate (slices, reducers, middleware) |
| Forms | React Hook Form | TanStack Form | TanStack Form mlodszy, mniejszy ekosystem. RHF ma dojrzaly multi-step pattern i 40M+/tydz pobranzaz |
| Forms | React Hook Form | Formik | Formik controlled = re-rendery na keystroke. RHF uncontrolled = lepsza wydajnosc. Formik mniej aktywnie rozwijany |
| Validation | Zod v4 | Yup | Yup nie generuje typow TS. Zod = jedno zrodlo prawdy (schema -> typy). v4 jeszcze szybszy parser |
| Routing | React Router 7 | TanStack Router | TanStack Router ma lepsza type-safety, ale RR7 jest prostszy, ma wieksza baze wiedzy, i SPA fallback na GitHub Pages jest dobrze udokumentowany |
| CSS | Tailwind v4 | CSS Modules | Tailwind szybsze prototypowanie, wbudowane responsive breakpoints, `dark:` variants. Glassmorphism w utility classes jest czytelniejszy niz custom CSS |
| PDF | @react-pdf/renderer | jsPDF + html2canvas | jsPDF+html2canvas robi screenshot DOM = rozmazany tekst, brak szukalnosci. @react-pdf generuje prawdziwy PDF z tekstem, tabelami, flexbox layout |
| PDF | @react-pdf/renderer | react-to-pdf | react-to-pdf pod spodem uzywa html2canvas — te same problemy co jsPDF approach |
| Animation | motion (framer) | react-spring | motion ma prostsza API, AnimatePresence (wizard transitions), layout animations. react-spring bardziej niskopoziomowy |
| i18n | react-i18next | react-intl (FormatJS) | react-intl wymaga wrappera `<IntlProvider>`, mniej flexowny namespace lazy-loading. react-i18next ma hook-first API naturalny dla React |
| Sound | use-sound | Web Audio API raw | use-sound abstrahuje Howler.js, obsluguje sprite, volume, rate. Raw Web Audio = duzo boilerplate |
| Components | shadcn/ui | MUI (Material UI) | MUI narzuca Material Design estetykke — konflikt z glassmorphism. shadcn daje pelna kontrole stylow |
| Components | shadcn/ui | Chakra UI | Chakra przeszla na Ark UI w v3, breaking changes. shadcn bardziej stabilny, Tailwind-native |

---

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| Create React App (CRA) | Oficjalnie deprecated (luty 2025). Brak aktywnego rozwoju, wolne buildy, brak ESM | Vite 7 |
| Formik | Controlled inputs = re-rendery na keystroke. Wolniejszy development | React Hook Form |
| Redux (plain) | Massive boilerplate, overkill dla SPA tego rozmiaru | Zustand |
| CSS-in-JS (styled-components, emotion) | Runtime overhead, problemy z SSR (nieistotne tu, ale ekosystem odchodzi). Tailwind szybszy | Tailwind CSS v4 |
| MUI / Material UI | Narzuca Material Design — nie da sie zrobic glassmorphism bez walki z frameworkiem | shadcn/ui + Tailwind |
| jsPDF + html2canvas | Screenshot-based PDF = rozmazany tekst, brak searchability, problemy ze stylami | @react-pdf/renderer |
| Next.js | Overkill — projekt wymaga static hosting (GitHub Pages). Next wymaga Node.js serwera lub eksport statyczny z ograniczeniami | Vite SPA |
| framer-motion (stary package) | Rebrandowany na "motion". Stary package nadal dziala, ale nowy jest lzejszy i aktywniej rozwijany | motion (import z `motion/react`) |
| ESLint 9 (legacy config) | Flat config jest standardem od v9. Legacy `.eslintrc` deprecated | ESLint 10 + flat config |

---

## Stack Patterns by Variant

**Jezeli PDF ma miec polskie znaki (PLN, ZL, s, c, z itp.):**
- @react-pdf/renderer obsluguje custom fonts (registerFont). Zaladuj font z polskimi znakami (np. Inter, Roboto) w formacie TTF
- jsPDF tez to obsluguje, ale wymaga recenzego encodowania fontow

**Jezeli wizard ma wiecej niz 7 krokow:**
- Rozważ lazy-loading komponentow kroków przez `React.lazy()` + `Suspense`
- i18next namespace per krok — laduj tlumaczenia on-demand

**Jezeli offline-first jest priorytetem (pozniej):**
- Dodaj `vite-plugin-pwa` (Workbox) — service worker cache
- Zustand persist middleware juz zapisuje stan do localStorage

**Jezeli potrzebne testy E2E:**
- Playwright (nie Cypress) — szybszy, lepsze wsparcie multi-browser
- Ale E2E to pozniejsza faza, nie MVP

---

## Version Compatibility

| Package A | Compatible With | Notes |
|-----------|-----------------|-------|
| Vite ^7.3 | React ^19.2 | Oficjalnie wspierane. `@vitejs/plugin-react` |
| Vite ^7.3 | Tailwind ^4.2 | Przez `@tailwindcss/vite` plugin (nie PostCSS) |
| Vite ^7.3 | Vitest ^4.0 | Natywna kompatybilnosc — Vitest 4 wspiera Vite 7 |
| React ^19.2 | motion ^12.34 | Pelne wsparcie React 19, concurrent rendering |
| React ^19.2 | shadcn/ui | shadcn zaktualizowany dla React 19 (bez forwardRef) |
| React Hook Form ^7.71 | Zod ^4.3 | Przez @hookform/resolvers ^5.2 z zodResolver (auto-detect v3/v4) |
| Tailwind ^4.2 | shadcn/ui | Oficjalnie wspierane, @theme directive, OKLCH |
| Zustand ^5.0 | React ^19.2 | v5 usunelo deprecated API, pelen support React 19 |
| i18next ^25.8 | react-i18next ^16.5 | Kompatybilne — react-i18next to warstwa nad i18next |
| @react-pdf/renderer ^4.3 | React ^19.2 | Weryfikacja potrzebna — MEDIUM confidence. Przetestowac na poczatku |
| ESLint ^10.0 | typescript-eslint | v10 wydany 20.02.2026 — sprawdzic kompatybilnosc pluginow |

---

## Deployment na GitHub Pages

### Strategia SPA Fallback

GitHub Pages nie obsluguje SPA routing natywnie (404 na refresh). Rozwiazanie:

1. **Kopiowanie `index.html` jako `404.html`** w procesie buildu
2. **Script w `package.json`:**

```json
{
  "scripts": {
    "build": "vite build",
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

3. **GitHub Actions (preferowane):**

```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
      - run: npm ci
      - run: npm run build
      - run: cp dist/index.html dist/404.html
      - uses: peaceiris/actions-gh-pages@v4
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

### Alternatywa: HashRouter

Jezeli SPA fallback sprawia problemy, `HashRouter` z React Router eliminuje problem calkowicie (URL z `#`). Mniej estetyczne, ale 100% niezawodne na GitHub Pages.

---

## Sources

- [Vite 7 Announcement](https://vite.dev/blog/announcing-vite7) — Node 20.19+, Rolldown, browser targets (VERIFIED via WebFetch)
- [Vite Releases](https://vite.dev/releases) — v7.3.1 latest stable, v8 beta (WebSearch)
- [React 19.2 Blog](https://react.dev/blog/2025/10/01/react-19-2) — React 19.2.4 latest (WebSearch)
- [Tailwind CSS v4.0 Blog](https://tailwindcss.com/blog/tailwindcss-v4) — zero-config, performance (WebSearch)
- [React Router v7 Docs](https://reactrouter.com/) — simplified imports, SPA support (WebSearch)
- [Supabase JS SDK npm](https://www.npmjs.com/package/@supabase/supabase-js) — v2.97.0 (WebSearch)
- [Zustand npm](https://www.npmjs.com/package/zustand) — v5.0.11 (WebSearch)
- [React Hook Form npm](https://www.npmjs.com/package/react-hook-form) — v7.71.2 (WebSearch)
- [Zod v4 Release Notes](https://zod.dev/v4) — v4.3.6 (WebSearch)
- [@hookform/resolvers npm](https://www.npmjs.com/package/@hookform/resolvers) — v5.2.2, Zod v4 support (WebSearch)
- [i18next npm](https://www.npmjs.com/package/i18next) — v25.8.11 (WebSearch)
- [react-i18next npm](https://www.npmjs.com/package/react-i18next) — v16.5.4 (WebSearch)
- [Motion Upgrade Guide](https://motion.dev/docs/react-upgrade-guide) — rebrand z framer-motion na motion (WebSearch)
- [framer-motion npm](https://www.npmjs.com/package/framer-motion) — v12.34.3 (WebSearch)
- [@react-pdf/renderer npm](https://www.npmjs.com/package/@react-pdf/renderer) — v4.3.2 (WebSearch)
- [use-sound GitHub](https://github.com/joshwcomeau/use-sound) — v5.0.0 (WebSearch)
- [shadcn/ui Tailwind v4](https://ui.shadcn.com/docs/tailwind-v4) — React 19 + Tailwind v4 ready (WebSearch)
- [Vitest npm](https://www.npmjs.com/package/vitest) — v4.0.18 (WebSearch)
- [ESLint v10 Release](https://eslint.org/) — flat config standard (WebSearch)
- [PDF Libraries Comparison 2025](https://dmitriiboikov.com/posts/2025/01/pdf-generation-comarison/) — @react-pdf vs jsPDF (WebSearch)
- [Zustand vs Jotai Comparison](https://betterstack.com/community/guides/scaling-nodejs/zustand-vs-redux-toolkit-vs-jotai/) — (WebSearch)

---
*Stack research for: Kalkulator kosztow remontu SPA*
*Researched: 2026-02-22*
