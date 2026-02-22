# Phase 1: Foundation + Design System - Research

**Researched:** 2026-02-22
**Domain:** React + Vite + TypeScript scaffold, shadcn/ui design system, dark mode, i18n (react-i18next), GitHub Pages deployment
**Confidence:** HIGH (core stack verified via official docs and WebFetch; ESLint blocker verified via official ESLint blog)

---

## Summary

Phase 1 buduje kompletny fundament aplikacji RenoCost: scaffold Vite + React + TypeScript z Tailwind CSS v4, system komponentow shadcn/ui (glassmorphism), ciemny/jasny motyw bez FOUC, dwujezyczny interfejs PL/EN z persystencja, nawigacja responsywna (mobile-first) oraz potok CI/CD na GitHub Pages przez GitHub Actions.

Kluczowe odkrycie badawcze: **ESLint v10.0.0 zostal wydany w lutym 2026 i jest niekompatybilny z `eslint-plugin-react` v7.37.5** (oficjalnie potwierdzono). Blad `getFilename is not a function` blokuje lintowanie. Obejsciem jest pozostanie na ESLint v9 (ostatnia stabilna: v9.39.3). Tailwind v4 zostal wydany i shadcn/ui go juz wspiera -- nowe projekty powinny startowac bezposrednio z Tailwind v4 + shadcn CLI.

React Router v7 zmienil lokalizacje importu: zamiast `react-router-dom` uzywa sie pakietu `react-router`. `createHashRouter` jest dostepny i oficjalnie udokumentowany w API v7 -- dobry wybor dla GitHub Pages (brak potrzeby obslugi 404 fallback po stronie serwera).

**Rekomendacja wiodaca:** Uruchom projekt przez `pnpm create vite` + Tailwind v4 + shadcn CLI, utrzymaj ESLint na v9.x, uzyj `createHashRouter` z `react-router` (nie `react-router-dom`), dodaj inline skrypt anti-FOUC w `index.html` przed hydracją Reacta.

---

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Vite | `^6.x` (latest) | Build tool + dev server | Najszybszy HMR, oficjalnie wspierany przez shadcn CLI |
| React | `^19.x` | UI framework | Nowsze projekty shadcn uruchamiane z React 19 |
| TypeScript | `^5.x` | Type safety | Wymagany przez shadcn CLI |
| Tailwind CSS | `^4.x` | Utility CSS | shadcn/ui oficjalnie wspiera Tailwind v4; nowe projekty startuja od v4 |
| shadcn/ui | latest CLI | Komponentowa biblioteka UI | Copy-paste komponenty z pelna kontrola kodu, Radix UI primitives |
| `react-router` | `^7.x` | Routing (pakiet scalony) | v7 scalil `react-router` i `react-router-dom` w jeden pakiet |
| `i18next` | `^23.x` | Core i18n engine | Standard dla React i18n |
| `react-i18next` | `^14.x` | React bindings dla i18next | Hooks `useTranslation`, `<Trans>` |
| `i18next-browser-languagedetector` | `^8.x` | Detekcja jezyka + localStorage | Automatyczna persystencja wyboru jezyka |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `@fontsource-variable/inter` | latest | Self-hosted Inter variable font | Zamiast Google Fonts CDN -- brak requesta zewnetrznego, GDPR |
| `@fontsource-variable/montserrat` | latest | Self-hosted Montserrat variable font | Alternatywa dla Inter lub dla naglowkow |
| `@types/node` | latest | Typy Node.js dla vite.config.ts | Wymagany do uzywania `path.resolve` |
| `lucide-react` | latest | Ikony (instaluje sie z shadcn) | Automatycznie dodawany przez shadcn CLI |
| ESLint | `^9.x` (NIE v10) | Linting | v10 incompatybilny z eslint-plugin-react -- zostac na v9! |
| `@eslint/compat` | latest | Compat wrapper dla starszych pluginow | Pomaga gdy plugin nie jest gotowy na flat config |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| `@fontsource-variable/inter` | Google Fonts CDN `<link>` | CDN szybsze do wczytania cached, ale zewnetrzne zaleznoscib + potencjalny GDPR |
| `createHashRouter` | BrowserRouter + 404.html trick | 404 trick dziala, ale wymaga kopiowania index.html do 404.html w kazdym buildzie; HashRouter prostszy |
| GitHub Actions deploy | `gh-pages` npm package | `gh-pages` package prostszy, ale Actions daje wiecej kontroli i integruje z CI |
| Tailwind CSS v4 | Tailwind CSS v3 | v3 nadal dziala ze starszymi komponentami shadcn, ale nowe projekty powinny startowac od v4 |

**Installation (core):**
```bash
pnpm create vite@latest renocost -- --template react-ts
cd renocost
pnpm add tailwindcss @tailwindcss/vite
pnpm add -D @types/node
pnpm dlx shadcn@latest init
pnpm add react-router
pnpm add i18next react-i18next i18next-browser-languagedetector
pnpm add @fontsource-variable/inter @fontsource-variable/montserrat
```

---

## Architecture Patterns

### Recommended Project Structure

```
src/
├── components/
│   ├── ui/              # shadcn wygenerowane komponenty (Button, etc.)
│   ├── layout/          # Navbar, Layout, MobileMenu
│   └── theme-provider.tsx   # ThemeProvider + useTheme hook
├── i18n/
│   ├── index.ts         # i18next init (uzyty jako side-effect import)
│   ├── locales/
│   │   ├── pl/
│   │   │   └── common.json
│   │   └── en/
│   │       └── common.json
│   └── @types/
│       └── i18next.d.ts # Module augmentation dla type safety
├── pages/
│   └── HomePage.tsx     # Placeholder strona glowna
├── router/
│   └── index.tsx        # createHashRouter config
├── main.tsx
├── App.tsx
└── index.css            # @import "tailwindcss"; + CSS variables
```

### Pattern 1: HashRouter Setup (GitHub Pages)

**What:** Uzycie `createHashRouter` zamiast `createBrowserRouter` pozwala na SPA routing na GitHub Pages bez konfiguracji po stronie serwera.
**When to use:** Zawsze, gdy hosujesz na GitHub Pages (statyczny hosting bez mozliwosci konfiguracji serwera).
**Example:**
```typescript
// Source: https://reactrouter.com/api/data-routers/createHashRouter
import { createHashRouter, RouterProvider } from "react-router";
import { Layout } from "@/components/layout/Layout";
import { HomePage } from "@/pages/HomePage";

const router = createHashRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      // fazy 2 i 3 dodaja tu kolejne trasy
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
```

### Pattern 2: ThemeProvider bez FOUC

**What:** Tema (ciemny/jasny) musi byc zastosowana zanim React sie wyrenderuje, inaczej widac "blink" (FOUC). Wymagane jest inline `<script>` w `index.html`.
**When to use:** Zawsze przy dark mode z localStorage.

**Krok 1 -- Inline script w `index.html`** (przed `</head>`):
```html
<!-- Source: https://notanumber.in/blog/fixing-react-dark-mode-flickering -->
<script>
  try {
    const theme = localStorage.getItem("vite-ui-theme");
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
    const effectiveTheme = theme === "system" || !theme ? systemTheme : theme;
    document.documentElement.classList.add(effectiveTheme);
  } catch (e) {}
</script>
```

**Krok 2 -- ThemeProvider (React Context):**
```typescript
// Source: https://ui.shadcn.com/docs/dark-mode/vite
// Plik: src/components/theme-provider.tsx
import { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light" | "system";

interface ThemeProviderState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeProviderContext = createContext<ThemeProviderState | undefined>(undefined);

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "vite-ui-theme",
}: {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
}) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  );

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
      root.classList.add(systemTheme);
      return;
    }

    root.classList.add(theme);
  }, [theme]);

  return (
    <ThemeProviderContext.Provider
      value={{
        theme,
        setTheme: (theme) => {
          localStorage.setItem(storageKey, theme);
          setTheme(theme);
        },
      }}
    >
      {children}
    </ThemeProviderContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeProviderContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
}
```

**Krok 3 -- Owinac App w ThemeProvider:**
```typescript
// main.tsx
root.render(
  <StrictMode>
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <App />
    </ThemeProvider>
  </StrictMode>
);
```

### Pattern 3: i18next Setup z TypeScript i localStorage

**What:** Inicjalizacja i18next z detekcja jezyka z localStorage, persystencja wyboru, type safety przez module augmentation.
**When to use:** Zawsze, od startu projektu (retrofitting kosztowny).

```typescript
// Plik: src/i18n/index.ts
// Source: https://react.i18next.com/latest/typescript
//         https://github.com/i18next/i18next-browser-languageDetector
import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import pl from "./locales/pl/common.json";
import en from "./locales/en/common.json";

export const resources = {
  pl: { common: pl },
  en: { common: en },
} as const;

i18next
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "pl",
    defaultNS: "common",
    supportedLngs: ["pl", "en"],
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
      lookupLocalStorage: "i18nextLng",
    },
    interpolation: {
      escapeValue: false, // React escapuje juz sam
    },
  });

export default i18next;
```

```typescript
// Plik: src/i18n/@types/i18next.d.ts
// Zapewnia type safety: t("nav.language") zamiast t("any.string")
import "i18next";
import { resources } from "../index";

declare module "i18next" {
  interface CustomTypeOptions {
    defaultNS: "common";
    resources: (typeof resources)["pl"];
  }
}
```

```typescript
// main.tsx -- import jako side effect przed App
import "./i18n/index";
```

### Pattern 4: Vite config dla GitHub Pages

**What:** Ustawienie `base` w vite.config.ts na nazwe repozytorium pozwala na poprawne serwowanie assetow z podkatalogu GitHub Pages.
**When to use:** Gdy aplikacja deployowana jest pod `https://user.github.io/repo-name/`.

```typescript
// vite.config.ts
// Source: https://vite.dev/guide/static-deploy#github-pages
import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  base: "/renocost/", // <-- NAZWA REPOZYTORIUM
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
```

### Pattern 5: Glassmorphism z Tailwind v4

**What:** Glassmorphism przy uzyciu wbudowanych klas Tailwind. Najkluczowniejsze: `backdrop-blur-*`, `bg-*/50`, `border border-white/20`.
**When to use:** Navbar, karty, modalne -- wszelkie elementy "pywajace" nad tlem.

```tsx
// Przykladowy glassmorphism card
// Source: https://tailwindcss.com/docs/backdrop-filter-blur
<div className="
  rounded-2xl
  border border-white/20 dark:border-white/10
  bg-white/60 dark:bg-slate-900/60
  backdrop-blur-md
  shadow-lg shadow-black/5
  p-6
">
  {children}
</div>
```

```tsx
// Glassmorphism navbar
<nav className="
  sticky top-0 z-50
  border-b border-white/20 dark:border-slate-700/50
  bg-white/70 dark:bg-slate-900/70
  backdrop-blur-lg
  supports-[backdrop-filter]:bg-white/60
">
  {/* ... */}
</nav>
```

### Pattern 6: Responsywna nawigacja (desktop + mobile Sheet)

**What:** Desktop: poziomy navbar z linkami. Mobile: hamburger -> Sheet (shadcn) ze szuflada z nawigacja.
**When to use:** Zawsze przy mobile-first designie.

```tsx
// Plik: src/components/layout/Navbar.tsx (szkielet)
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { ModeToggle } from "@/components/theme-toggle";
import { LanguageToggle } from "@/components/language-toggle";

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-lg">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <span className="font-bold text-xl">RenoCost</span>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-4">
          <LanguageToggle />
          <ModeToggle />
          {/* Placeholder: UserMenu */}
        </div>

        {/* Mobile nav */}
        <div className="flex md:hidden items-center gap-2">
          <LanguageToggle />
          <ModeToggle />
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent>
              {/* Mobile links */}
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
```

### Pattern 7: GitHub Actions deployment workflow

```yaml
# .github/workflows/deploy.yml
# Source: https://vite.dev/guide/static-deploy#github-pages
name: Deploy to GitHub Pages

on:
  push:
    branches: ["main"]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: true

jobs:
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v5
      - uses: actions/setup-node@v6
        with:
          node-version: lts/*
          cache: "npm"
      - run: npm ci
      - run: npm run build
      - uses: actions/configure-pages@v5
      - uses: actions/upload-pages-artifact@v4
        with:
          path: "./dist"
      - uses: actions/deploy-pages@v4
        id: deployment
```

### Anti-Patterns to Avoid

- **BrowserRouter na GitHub Pages:** GitHub Pages zwraca 404 dla tras innych niz `/`. Uzyj `createHashRouter`.
- **Theme w useState bez inline script:** Powoduje FOUC (blink) na kazdym odswiezeniu strony. Zawsze dodaj `<script>` w `<head>` index.html.
- **import z `react-router-dom` w v7:** W React Router v7 wszystko importuje sie z `react-router`. `react-router-dom` to aliasowany re-export, ale oficjalnie zalecany jest bezposredni import.
- **ESLint v10 z eslint-plugin-react:** Powoduje crash `getFilename is not a function`. Pozostan na ESLint v9.
- **Google Fonts CDN zamiast fontsource:** Zewnetrzne zapytanie sieciowe, potencjalne opoznienie renderowania, kwestie GDPR.
- **Inicjalizacja i18next w komponencie:** i18next.init() musi byc wywolane przed renderem drzewa React (side-effect import w main.tsx).
- **Brak `storageKey` w ThemeProvider:** Jezeli wiele aplikacji uzywaloby tego samego klucza localStorage ("vite-ui-theme" to default), moze dochodzic do kolizji. Dla produkcji lepiej uzyc unikalnego klucza jak "renocost-theme".

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Komponenty UI (Button, Modal, Dropdown) | Wlasne stylowane komponenty | shadcn/ui | Radix UI zapewnia dostepnosc, ARIA, focus management -- obsluga klawiatury jest trudna do poprawnej implementacji |
| Dark mode toggle | Wlasny kontekst z media query | ThemeProvider z shadcn docs + inline anti-FOUC script | Edge case'y: SSR hydration, system preference change po zaladowaniu strony |
| Detekcja jezyka przegladarki | `navigator.language` reczne parsowanie | `i18next-browser-languagedetector` | Obsluguje kolejnosc `pl-PL` -> `pl` -> `en`, konfigurowalny fallback |
| CSS klasy iconek | Wlasne SVG lub ikonki inline | `lucide-react` (juz w shadcn) | Tree-shakeable, spójny styl, 1000+ ikon |
| Deploy pipeline | Reczne `git push gh-pages` | GitHub Actions workflow | Automatyczny, powtarzalny, nie wymaga lokalnych kluczy SSH |

**Key insight:** Glassmorphism jest prosto osiagalny przez samo Tailwind (`backdrop-blur-md`, `bg-white/60`, `border border-white/20`) -- NIE buduj wlasnych CSS klas dla glass effect.

---

## Common Pitfalls

### Pitfall 1: ESLint v10 niekompatybilny z eslint-plugin-react (POTWIERDZONE -- AKTYWNY BLOKER)

**What goes wrong:** `npm create vite` z domyslnym szablonem moze zainstalowac ESLint v10 (wydany luty 2026). Uruchomienie lintera powoduje `TypeError: contextOrFilename.getFilename is not a function`.
**Why it happens:** ESLint v10 usunął `context.getFilename()` z API -- eslint-plugin-react v7.37.5 nadal go uzywa. Plugin ma otwarty PR fix (#3979), ale bez opublikowanej wersji.
**How to avoid:**
1. Przed instalacja sprawdz wersje ESLint: `npm show eslint version`
2. Pinuj ESLint do v9.x w package.json: `"eslint": "^9.39.3"`
3. Jezeli ESLint v10 sie zainstalowal: `npm install eslint@^9.39.3 --save-dev`
**Warning signs:** Blad `getFilename is not a function` w konsoli przy uruchomieniu `eslint` lub `npm run lint`.

### Pitfall 2: Brak `base` w vite.config.ts -- biala strona na GitHub Pages

**What goes wrong:** Po deploymencie aplikacja laduje index.html ale JavaScript/CSS nie laduje sie. Konsola pokazuje 404 dla `/assets/index-xxx.js`.
**Why it happens:** Vite domyslnie buduje assety ze sciezka `/assets/...`. GitHub Pages serwuje z `/renocost/assets/...`. Bez `base: "/renocost/"` sciezki sa bledne.
**How to avoid:** Ustaw `base: "/<REPO_NAME>/"` w vite.config.ts PRZED pierwszym deployem.
**Warning signs:** Biala strona po deploymencie, 404 w Network tab DevTools dla `.js` i `.css` plikow.

### Pitfall 3: Jezyk resetuje sie po odswiezeniu strony

**What goes wrong:** Uzytkownik zmienia jezyk na EN, odswierza -- aplikacja wraca do PL.
**Why it happens:** Brak konfiguracji `caches: ["localStorage"]` w languagedetector. Domyslnie jezyk nie jest cachowany.
**How to avoid:** W konfiguracji detection ustaw `caches: ["localStorage"]` i `lookupLocalStorage: "i18nextLng"`.
**Warning signs:** `localStorage.getItem("i18nextLng")` zwraca `null` po zmianie jezyka.

### Pitfall 4: FOUC przy dark mode (migniecie bialego tla)

**What goes wrong:** Na krotko widac jasne tlo zanim React sie zaladuje i zastosuje klase `.dark`.
**Why it happens:** React hydration nastepuje po parsowaniu DOM. Jezeli tylko JavaScript ustawia klase ciemnego motywu, jest za pozno.
**How to avoid:** Dodaj synchroniczny `<script>` w `<head>` index.html ktory czyta localStorage i natychmiast dodaje klase `.dark` do `<html>`.
**Warning signs:** Widoczne migniecie jasnego tla przy odswiezeniu strony z ustawionym trybem ciemnym.

### Pitfall 5: `import from 'react-router-dom'` w React Router v7

**What goes wrong:** Kod kompiluje sie i dziala (re-eksport), ale jest niezgodny z oficjalna dokumentacja v7 i moze powodowac problemy z bundle splitting.
**Why it happens:** Wiekszosc tutoriali jest sprzed v7 i uzywa `react-router-dom`.
**How to avoid:** W v7 importuj zawsze z `react-router`. Nie instaluj `react-router-dom` oddzielnie.
**Warning signs:** `peerDependencies` ostrzezenie lub dwa osobne pakiety react-router w node_modules.

### Pitfall 6: Tailwind CSS v4 wymaga `@tailwindcss/vite` zamiast PostCSS plugin

**What goes wrong:** Uzytkownik instaluje Tailwind jak w v3 (`tailwind.config.js` + PostCSS plugin) -- klasy nie dzialaja.
**Why it happens:** Tailwind v4 zmienil architekture: teraz uzywa dedykowanego pluginu Vite (`@tailwindcss/vite`) a nie PostCSS.
**How to avoid:** `pnpm add tailwindcss @tailwindcss/vite`, a w vite.config.ts dodaj `tailwindcss()` do plugins. Zamiast `tailwind.config.js` konfiguracja przechodzi przez `@theme` w CSS.
**Warning signs:** Klasy Tailwind nie sa aplikowane, brak output CSS.

### Pitfall 7: shadcn init failuje po Tailwind v4 update

**What goes wrong:** `npx shadcn@latest init` wyrzuca blad ze nie moze zweryfikowac instalacji Tailwind -- bo szuka `tailwind.config.js` ktory nie istnieje w v4.
**Why it happens:** Znany bug shadcn CLI z walidacja Tailwind v4 (issue #6446).
**How to avoid:** Sprawdz aktualna wersje shadcn CLI (`npx shadcn@latest --version`) przed uruchomieniem. Jezeli blad wystapi, mozna recznie stworzyc `components.json` lub uzyc `--force` flag.
**Warning signs:** Blad "Could not find Tailwind CSS config" podczas `shadcn init`.

---

## Code Examples

Verified patterns from official sources:

### Pelna konfiguracja tsconfig.json dla sciezek `@/*`

```json
// Source: https://ui.shadcn.com/docs/installation/vite
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### CSS Variables dla glassmorphism palette (granat + grafit + akcent)

```css
/* src/index.css */
/* Source: https://ui.shadcn.com/docs/theming + UI-02 requirement */
@import "tailwindcss";

@theme inline {
  /* Kolory bazowe -- granat (navy) / grafit */
  --color-navy-900: oklch(20% 0.08 250);
  --color-navy-800: oklch(25% 0.1 250);
  --color-navy-700: oklch(30% 0.1 250);
  --color-graphite-800: oklch(22% 0.02 260);
  --color-graphite-700: oklch(28% 0.02 260);

  /* Akcent -- zywy blekit lub szmaragd */
  --color-accent: oklch(60% 0.2 200); /* szmaragd */
  --color-accent-hover: oklch(55% 0.22 200);
}

:root {
  --background: hsl(0 0% 98%);
  --foreground: hsl(222 47% 11%);
  --muted: hsl(210 40% 96%);
  --border: hsl(214 32% 91%);
}

.dark {
  --background: hsl(222 47% 6%);
  --foreground: hsl(210 40% 98%);
  --muted: hsl(217 33% 17%);
  --border: hsl(217 33% 20%);
}
```

### Language Toggle komponent

```tsx
// src/components/language-toggle.tsx
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";

export function LanguageToggle() {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const next = i18n.language.startsWith("pl") ? "en" : "pl";
    i18n.changeLanguage(next);
    // i18next-browser-languagedetector automatycznie zapisze do localStorage
  };

  return (
    <Button variant="ghost" size="sm" onClick={toggleLanguage}>
      {i18n.language.startsWith("pl") ? "EN" : "PL"}
    </Button>
  );
}
```

### Przykladowy plik tlumaczen PL

```json
// src/i18n/locales/pl/common.json
{
  "nav": {
    "logo": "RenoCost",
    "language": "Jezyk",
    "theme": {
      "toggle": "Zmien motyw",
      "light": "Jasny",
      "dark": "Ciemny",
      "system": "Systemowy"
    },
    "userMenu": "Menu uzytkownika"
  },
  "home": {
    "title": "Kalkulator Kosztow Remontu",
    "subtitle": "Wycen remont pokoj po pokoju"
  }
}
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `import from 'react-router-dom'` | `import from 'react-router'` | React Router v7 (2024) | Jeden pakiet zamiast dwoch; v7 scalil oba |
| Tailwind v3 + `tailwind.config.js` + PostCSS | Tailwind v4 + `@tailwindcss/vite` plugin | Tailwind v4 (2025) | Brak pliku konfiguracyjnego JS; konfiguracja w CSS przez `@theme` |
| shadcn z Tailwind v3 + React 18 | shadcn z Tailwind v4 + React 19 | 2025 | Nowe projekty startuja z v4; stare projekty nadal wspierane |
| ESLint legacy `.eslintrc` | ESLint flat config `eslint.config.js` | ESLint v9 (required), v10 (only) | v10 calkowicie usunal legacy config |
| `eslint-plugin-react` z ESLint v10 | ESLint v9.x (tymczasowo) | Luty 2026 | v10 niekompatybilny -- zostac na v9 |
| `@tailwindcss/vite` Tailwind v4 new | Zastapilo `@tailwindcss/postcss` | Tailwind v4 | Szybszy build, natywna integracja z Vite |

**Deprecated/outdated:**
- `react-router-dom` jako oddzielny pakiet: w v7 nie jest potrzebny, wszystko z `react-router`
- `tailwind.config.js`: zastapiony przez `@theme` directive w CSS
- `tailwindcss-animate`: zastapiony przez `tw-animate-css` w shadcn/Tailwind v4
- ESLint v10 z React plugin: aktywnie broken (luty 2026), poczekaj na fix

---

## Open Questions

1. **Nazwa repozytorium GitHub dla `base` w vite.config.ts**
   - What we know: `base` musi byc ustawiony na `/<repo-name>/` dla GitHub Pages subdirectory deploy
   - What's unclear: Nie znamy docelowej nazwy repozytorium
   - Recommendation: Planner powinien dodac jako zadanie: "Ustaw `base` w vite.config.ts po wyborze nazwy repo, PRZED pierwszym deployem". Alternatywnie: jezeli repo to `username.github.io`, base = `/`.

2. **ESLint v10 -- kiedy eslint-plugin-react bedzie kompatybilny**
   - What we know: PR #3979 jest otwarty (stan: luty 2026). Brak opublikowanej wersji fix.
   - What's unclear: Harmonogram publikacji patcha.
   - Recommendation: Pinuj ESLint do `^9.39.3` w package.json. Dodaj komentarz TODO z linkiem do issue. Sprawdz status w momencie startu Phase 2.

3. **pnpm vs npm w GitHub Actions**
   - What we know: Oficjalny workflow Vite uzywa `npm ci` + `actions/setup-node@v6 cache: 'npm'`. pnpm wymaga dodatkowego kroku setup (`pnpm/action-setup`).
   - What's unclear: Uzytkownik preferuje pnpm lokalnie -- czy Actions tez powinien uzywac pnpm?
   - Recommendation: Planner moze ustawic pnpm w Actions (standardowy pattern istnieje), ale npm jest prostszy. Decyzja nie blokuje fazy.

4. **Nazwa klucza localStorage dla motywu i jezyka**
   - What we know: shadcn docs uzywa `"vite-ui-theme"` jako domyslny storageKey; i18next uzywa `"i18nextLng"`.
   - What's unclear: Czy uzytkownik chce niestandardowe klucze per-aplikacja.
   - Recommendation: Uzyj `"renocost-theme"` i `"renocost-lng"` dla jasnosci. Planner moze zdecydowac.

---

## Sources

### Primary (HIGH confidence)

- `https://ui.shadcn.com/docs/installation/vite` -- pelny tutorial setup shadcn z Vite (zweryfikowany WebFetch)
- `https://ui.shadcn.com/docs/dark-mode/vite` -- ThemeProvider + ModeToggle implementacja (zweryfikowany WebFetch)
- `https://ui.shadcn.com/docs/tailwind-v4` -- zmiany w shadcn dla Tailwind v4 (zweryfikowany WebFetch)
- `https://vite.dev/guide/static-deploy#github-pages` -- oficjalny Vite guide dla GitHub Pages deploy z Actions YAML (zweryfikowany WebFetch)
- `https://reactrouter.com/api/data-routers/createHashRouter` -- API createHashRouter v7 (zweryfikowany WebFetch)
- `https://eslint.org/blog/2026/02/eslint-v10.0.0-released/` -- oficjalny blog ESLint v10 (zweryfikowany WebFetch)
- `https://github.com/jsx-eslint/eslint-plugin-react/issues/3977` -- potwierdzenie niekompatybilnosci eslint-plugin-react z ESLint v10 (zweryfikowany WebFetch)
- `https://www.i18next.com/overview/typescript` -- module augmentation pattern TypeScript (zweryfikowany WebFetch)
- `https://github.com/i18next/i18next-browser-languageDetector/blob/master/README.md` -- konfiguracja detection options (zweryfikowany WebFetch)
- `https://tailwindcss.com/docs/backdrop-filter-blur` -- klasy backdrop-blur Tailwind v4 (zweryfikowany WebFetch)
- `https://notanumber.in/blog/fixing-react-dark-mode-flickering` -- inline script anti-FOUC (zweryfikowany WebFetch)
- `https://react.i18next.com/latest/typescript` -- wymagania wersji i18next dla TypeScript (zweryfikowany WebFetch)

### Secondary (MEDIUM confidence)

- WebSearch "ESLint v10 React TypeScript plugin compatibility 2025 2026" -- potwierdzono przez 3 zrodla (blog ESLint + GitHub issue + ESLint migration guide)
- WebSearch "shadcn/ui Vite setup 2025" -- zgodny z oficjalna dokumentacja
- WebSearch "React Router v7 createHashRouter import" -- zgodny z oficjalnym API reference

### Tertiary (LOW confidence)

- Glassmorphism pattern z Tailwind (klasy) -- wnioskowanie z oficjalnej dokumentacji Tailwind, nie z dedykowanego poradnika shadcn
- Konkretne wartosci kolorow (oklch dla granat/grafit) -- opracowane na podstawie wymogow UI-02, niezweryfikowane z konkretnym brand guideline uzytkownika

---

## Metadata

**Confidence breakdown:**
- Standard stack (versje bibliotek): HIGH -- zweryfikowane przez oficjalne docs i WebFetch
- ESLint blocker: HIGH -- zweryfikowane przez oficjalny blog ESLint + GitHub issue plugin
- Architecture (project structure): HIGH -- standardowy pattern dla shadcn/Vite/React
- Dark mode / FOUC: HIGH -- zweryfikowane przez shadcn docs + dedykowany artykul
- i18n setup: HIGH -- zweryfikowane przez oficjalne i18next docs
- GitHub Pages deploy: HIGH -- zweryfikowane przez oficjalny Vite guide
- Glassmorphism CSS values: MEDIUM -- wnioskowanie z Tailwind docs, konkretne wartosci kolorow LOW (zaleza od decyzji designerskich)
- Pitfalls: HIGH (ESLint, base path, FOUC) / MEDIUM (pozostale)

**Research date:** 2026-02-22
**Valid until:** 2026-03-22 (30 dni) -- z wyjatkiem ESLint plugin compatibility: sprawdz status przy starcie Phase 1 (moze byc fix opublikowany)
