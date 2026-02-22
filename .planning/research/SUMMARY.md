# Project Research Summary

**Project:** Kalkulator kosztow remontu (RenoCost)
**Domain:** Wizard-style renovation cost calculator — React SPA z glassmorphism, eksportem PDF i cloud save
**Researched:** 2026-02-22
**Confidence:** HIGH

## Executive Summary

RenoCost to kalkulator kosztow remontu skierowany do polskich wykonawcow i homeownerow, budowany jako single-page application na GitHub Pages. Badania pokazuja wyrazna luke na polskim rynku: zadne darmowe narzedzie nie laczy wizard UX, kalkulacji per-pokoj, eksportu PDF i zapisu w chmurze. Najblizszy konkurent (kalkulatorremontu.pl) kosztuje 199 PLN/rok i jest nadmiernie skomplikowany. Rekomendowany stos — React 19 + Vite 7 + Tailwind v4 + Zustand + Supabase — jest dojrzaly, w pelni kompatybilny wzajemnie i dobrze udokumentowany. Wszystkie wersje sa stabilne (nie beta), co minimalizuje ryzyko techniczne.

Rekomendowana architektura opiera sie na trzech warstwach: wizard UI (AnimatePresence + kroki jako osobne komponenty), silnik kalkulacji jako czyste funkcje (nigdy w state), oraz warstwa uslug (Supabase, PDF export, i18n). Kluczowa decyzja architektoniczna: obliczenia sa DERYWOWANE ze stanu, nigdy przechowywane — eliminuje to cala klase bugow synchronizacji. Stan wizard jest persystowany przez Zustand `persist` middleware do localStorage, co rozwiazuje problem utraty danych przy odswiezeniu.

Najwazniejsze ryzyka to: bledy arytmetyki zmiennoprzecinkowej przy sumowaniu kwot PLN (zapobieganie: obliczenia na groszach jako integerach), routing 404 na GitHub Pages (zapobieganie: HashRouter lub 404.html trick), oraz bezpieczenstwo Supabase (RLS musi byc wlaczone od poczatku na kazdej tabeli). I18n nalezy wbudowac od dnia pierwszego — retrofitting jest kosztowny. Projekt jest dobrze zdefiniowany z jasna hierarchia zaleznosci miedzy funkcjonalnosciami.

## Key Findings

### Recommended Stack

Stos jest optymalny dla SPA deployowanego na GitHub Pages bez serwera backendowego. React 19 + Vite 7 to standardowe scaffold dla nowych projektow (CRA oficjalnie deprecated w lutym 2025). Tailwind v4 (wydany 22.01.2025) ma natywne wsparcie dla glassmorphism przez `backdrop-blur-*` i `bg-white/10`, co eliminuje potrzebe custom CSS dla kluczowego elementu designu. Supabase darmowy tier pokrywa potrzeby MVP (auth + PostgreSQL + storage).

**Core technologies:**
- **React 19.2 + Vite 7**: UI framework + build tool — oficjalny naslednik CRA, cold start <300ms, HMR w mikrosekundach
- **TypeScript 5.7**: type safety — Zod v4 generuje typy ze schematow (jedno zrodlo prawdy, zero duplikacji)
- **Tailwind CSS v4.2**: styling — natywne glassmorphism, 5x szybsze buildy, `dark:` variants bez konfiguracji
- **Zustand 5**: stan globalny — zero boilerplate, persist middleware dla localStorage, idealne dla wizard state
- **React Hook Form 7 + Zod v4**: formularze + walidacja — uncontrolled inputs (zero re-renderow na keystroke), per-step schemas
- **Supabase JS v2.97**: auth + baza danych — darmowy tier dla MVP, RLS dla bezpieczenstwa, izomorficzny klient
- **motion v12 (framer-motion)**: animacje — AnimatePresence dla wizard transitions, layout animations
- **@react-pdf/renderer v4.3**: PDF — React-native PDF jako JSX komponenty, prawdziwy tekst (nie screenshot)
- **react-i18next v16 + i18next v25**: i18n — lazy-loading namespace per krok wizard, hook-first API
- **shadcn/ui**: komponenty — generator (nie biblioteka), pelna kontrola, React 19 + Tailwind v4 ready

Potencjalne ryzyko: `@react-pdf/renderer v4.3` z React 19 wymaga weryfikacji kompatybilnosci na poczatku projektu (MEDIUM confidence w tym miejscu).

### Expected Features

Polska konkurencja jest prymitywna — wiekszosc to proste formularze "m2 x standard = kwota". Luka rynkowa jest potwierdzona: darmowy wizard + cloud save + PDF nie istnieje w jednym polskim narzedziu.

**Must have (table stakes) — v1 launch:**
- Wizard krokowy (pokoje → wymiary → prace → podsumowanie) — kluczowy differentiator UX
- Definiowanie pokojow z predefiniowanymi ikonami (kuchnia, lazienka, salon...)
- Wymiary pokojow + auto-obliczanie m2 scian/sufitu/podlogi
- 7 predefiniowanych typow prac (malowanie, szpachlowanie, gruntowanie, narozniki, ochrona posadzki, bruzdy, akrylowanie)
- Kalkulacja: ilosc x cena, sumy per pokoj, netto + VAT (8% / 23%) + brutto
- Floating animated summary bar (differentiator — zadna polska aplikacja tego nie ma)
- Eksport PDF z profesjonalnym layoutem
- Responsywnosc mobile-first
- Tryb goscia bez rejestracji (localStorage fallback)
- i18n PL/EN od poczatku

**Should have (competitive) — v1.x po walidacji:**
- Autentykacja Supabase (email/haslo) — trigger: uzytkownicy pytaja "jak zapisac"
- Cloud save i historia wycen — trigger: uzytkownicy wracaja edytowac stare wyceny
- Custom work types (uzytkownik dodaje wlasny typ pracy) — trigger: feedback
- Tryb ciemny
- Mikro-interakcje dzwiekowe

**Defer (v2+):**
- Kopiowanie wycen jako szablony
- Eksport do Excel
- Udostepnianie wyceny linkiem
- Branding PDF (logo firmy)
- PWA z offline support

**Anti-features (nigdy nie budowac):** integracja ze sklepami z cenami materialow, AI do analizy opisu remontu, upload zdjec/wizualizacja, CRM/zarzadzanie projektami, platnosci online, mapa z cenami regionalnymi.

### Architecture Approach

Architektura to klasyczny 4-poziomowy SPA: UI Layer (React komponenty) → State Layer (Zustand slices) → Calculation Engine (czyste funkcje, zero zaleznos od React) → Services Layer (Supabase, PDF, i18n). Kluczowa zasada: kalkulacje sa zawsze derywowane ze stanu przez `useMemo`, nigdy przechowywane jako osobny stan. Projekt strukturyzowany jako feature modules (wizard, calculator, auth, quotes, export) z shared/ dla wspolnych komponentow. HashRouter na GitHub Pages (nie BrowserRouter — unika 404 na odswiezeniu bez hakow).

**Major components:**
1. **WizardShell** — orchestruje nawigacje krokow, AnimatePresence transitions, progress bar; czyta `wizardSlice`
2. **Calculation Engine (`features/calculator/engine.ts`)** — czyste funkcje `calculateRoomCost()` / `calculateTotalCost()`; zero importow React, w pelni testowalny
3. **FloatingCostBar** — sticky konsument derived state `useTotalCost()`; nigdy nie pisze do store
4. **Zustand Store (4 slices)** — `wizardSlice` (nawigacja), `calcSlice` (pokoje/prace/ceny), `authSlice` (sesja), `uiSlice` (motyw/jezyk); persist middleware na calcSlice
5. **SupabaseProvider** — singleton klient, `onAuthStateChange` listener pushujacy do `authSlice`
6. **PDF Export Feature** — czyta stan ze store, renderuje JSX template przez `@react-pdf/renderer`

**Build order z ARCHITECTURE.md:** Phase 1 = fundament (scaffold + routing + store skeleton + theme + i18n), Phase 2 = core wizard (steps + engine + FloatingBar), Phase 3 = polish + persistence (Supabase + auth + PDF).

### Critical Pitfalls

1. **Arytmetyka zmiennoprzecinkowa** — JavaScript IEEE 754 kumuluje bledy przy dziesiatkach operacji (0.1+0.2 != 0.3). Zapobieganie: wszystkie obliczenia na groszach (integer), formatowanie TYLKO w warstwie prezentacji przez `Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'PLN' })`. Zaimlementowac w Phase 1 zanim powstanie calculation engine.

2. **GitHub Pages 404 przy odswiezeniu** — static hosting nie obsluguje SPA routing. Zapobieganie: HashRouter (prostsze, niezawodne) lub kopiowanie `index.html` jako `404.html` w build script. Skonfigurowac w Phase 1. Ustawic `base: '/nazwa-repo/'` w `vite.config.ts` i `basename` w RouterProvider.

3. **Utrata danych formularza** — uzytkownik spedza 10-15 min na konfiguracji, zamyka karte = utrata wszystkiego. Zapobieganie: Zustand `persist` middleware na `calcSlice` (automatyczny zapis do localStorage). Implementowac ROWNOCZESNIE z budowa formularza, nie po fakcie.

4. **Supabase RLS wylaczone** — nowe tabele maja RLS off domyslnie; klucz `anon` widoczny w kodzie daje pelny dostep bez RLS. Zapobieganie: `ALTER TABLE ... ENABLE ROW LEVEL SECURITY` natychmiast po stworzeniu tabeli. Klucz `service_role` NIGDY w `VITE_*` env vars. Wdrozac przed pierwszym zapisem danych.

5. **Brak per-step walidacji** — walidacja tylko na ostatnim kroku = uzytkownik dostaje 12 bledow po 5 krokach. Zapobieganie: oddzielny schemat Zod na kazdy krok + `trigger()` z React Hook Form przed przejsciem dalej. Zaprojektowac w Phase 2 razem z krokami wizard.

**Dodatkowe istotne pitfalle:** polskie znaki w PDF (embedded font TTF wymagany), dark mode flash/FOUC (inline script w `<head>` przed React), glassmorphism lag na mobilach (max 2-3 elementy z backdrop-filter), floating summary zaslaniajace formularze na mobile (collapsible bottom sheet).

## Implications for Roadmap

Badania potwierdzaja 3-fazowy model z ARCHITECTURE.md. Kazda faza produkuje dzialajacy inkrement (compile → kalkulator bez auth → pelny produkt).

### Phase 1: Foundation
**Rationale:** Wszystko zalezy od foundationu. I18n musi byc od startu (retrofitting to HIGH cost wg PITFALLS.md). Routing, theme tokens i store skeleton musza poprzedzac budowe featurow. Arytmetyka walutowa musi byc ustalona ZANIM powstanie calculation engine.
**Delivers:** Pustа aplikacja ktora kompiluje sie, ma routing, theme (light/dark bez flash), i18n PL/EN, store skeleton i konwencje arytmetyki walutowej.
**Addresses:** Konfiguracja projektu, deployment na GitHub Pages, shared UI components (Button, Input, Card z glassmorphism).
**Avoids:** Routing 404 (HashRouter), Dark mode FOUC (inline script), floating-point errors (integer convention established), hardcoded strings (i18n keys od dnia 1).

### Phase 2: Core Wizard
**Rationale:** Calculation engine musi poprzedzac PDF (PDF czyta finalny stan). FloatingBar musi dzialac w trakcie wizard (nie po). Per-step walidacja musi byc wbudowana od razu, nie retrofitowana.
**Delivers:** Kompletny kalkulator bez kont — uzytkownik moze przejsc caly wizard, zobaczyc live summary, wyeksportowac PDF. To MVP do walidacji konceptu.
**Addresses (features):** Wizard krokowy, definiowanie pokojow z ikonami, wymiary + auto-obliczanie m2, 7 typow prac, kalkulacja netto/VAT/brutto, floating animated summary bar, eksport PDF, mobile-first responsive.
**Uses (stack):** React Hook Form + Zod (per-step schemas), Zustand calcSlice + wizardSlice, motion AnimatePresence, @react-pdf/renderer.
**Implements:** WizardShell, StepRooms, StepDimensions, StepWorkTypes, StepSummary, FloatingCostBar, Calculation Engine.
**Avoids:** Per-step validation pitfall (oddzielne Zod schemas), floating-point pitfall (integer arithmetic), monolithic wizard component anti-pattern (osobne pliki per step), stored calculations anti-pattern (derived via useMemo).

### Phase 3: Auth + Cloud Persistence
**Rationale:** Auth wymaga dzialajacego wizard (trzeba co zapisywac). Supabase RLS musi byc skonfigurowane PRZED pierwszym zapisem danych uzytkownikow. Ten blok dodaje persistencje do juz dzialajacego kalkulatora.
**Delivers:** Pelny produkt — logowanie, historia wycen, cloud save, tryb goscia z migracja do chmury po zalogowaniu.
**Addresses (features):** Autentykacja (email/haslo), cloud save, lista wycen z mozliwoscia edycji, tryb goscia (localStorage → Supabase po login).
**Uses (stack):** Supabase JS SDK, authSlice, SupabaseProvider, useSaveQuote/useLoadQuote hooks.
**Avoids:** RLS pitfall (wlaczone od razu), auth session flash (loading state), Supabase direct calls in components (feature hooks pattern), async in onAuthStateChange callback.

### Phase 4: Polish + Differentiators (v1.x)
**Rationale:** Po walidacji ze uzytkownikami faktycznie korzystaja z kalkulatora, dodajemy differentiatory nizszego priorytetu.
**Delivers:** Tryb ciemny, custom work types, mikro-interakcje dzwiekowe, ulepszone UI na podstawie feedbacku.
**Addresses:** Custom work types, dark mode, sound micro-interactions, accessibility improvements (prefers-reduced-motion).
**Avoids:** Glassmorphism mobile lag (ostroza przy backdrop-filter), floating summary na mobile (collapsible).

### Phase Ordering Rationale

- **i18n w Phase 1, nie pozniej** — PITFALLS.md: "Hardcoded strings zamiast i18n keys = HIGH recovery cost". Kazdy string musi byc kluczem od dnia 1.
- **Calculation engine przed PDF** — PDF czyta finalny stan kalkulatora. Bez dzialajacego engine nie ma co eksportowac.
- **Auth w Phase 3, nie 2** — FEATURES.md: autentykacja to trigger oparty na feedbacku uzytkownikow, nie warunek MVP. Tryb goscia wystarczy do walidacji konceptu.
- **FloatingBar razem z Wizard** — to kluczowy differentiator UX. Budowanie go osobno pozniej = trudna integracja z juz skonczonymi krokami.
- **Zustand persist od startu Phase 2** — nie mozna dodac "na koniec". Zmiana pozniej to MEDIUM recovery cost (Zustand store refactor).

### Research Flags

**Phases wymagajace glebszego researchu podczas planowania:**
- **Phase 2 (PDF):** Weryfikacja kompatybilnosci `@react-pdf/renderer v4.3` z React 19 na poczatku fazy. STACK.md oznacza to jako MEDIUM confidence. Przetestuj prosty "hello world" PDF przed pelna implementacja.
- **Phase 2 (Wizard transitions):** Delikatne kwestie wydajnosciowe `AnimatePresence mode="wait"` na wolnych urzadzeniach mobilnych — moze wymagac dostrojenia timing/duration.
- **Phase 3 (RLS policies):** Konkretne polityki Supabase (szczegolnie dla quotes table z RLS per user_id) wymagaja przetestowania — nie tylko wlaczenia RLS.

**Phases ze standardowymi wzorcami (skip research-phase):**
- **Phase 1:** Scaffold Vite + React + TypeScript + Tailwind v4 + HashRouter — dobrze udokumentowane, wzorzec powtarzany tysiace razy.
- **Phase 4:** Dark mode + custom types + sounds — wszystkie to niezalezne, dodatkowe funkcjonalnosci z dobrymi wzorcami.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Wszystkie wersje zweryfikowane przez npm/oficjalne blogi. Kompatybilnosc wzajemna potwierdzona (patrz tabela w STACK.md). Jedynym ryzykiem jest @react-pdf/renderer z React 19 — wymaga weryfikacji. |
| Features | MEDIUM | Analiza 12+ konkurentow (polskich i miedzynarodowych), ale bez bezposrednich testow uzytkownikow. Priorytetyzacja oparta na analizie rynku, nie na danych uzytkownikow. |
| Architecture | HIGH | Wzorce (Zustand slices, AnimatePresence wizard, derived calculations) potwierdzone przez oficjalna dokumentacje i wiele zrodel spolecznosciowych. Anti-patterns rowniez dobrze udokumentowane. |
| Pitfalls | HIGH | Kazdy pitfall potwierdzony przez wiele zrodel. Recovery costs realistycznie ocenione. Floating-point, GitHub Pages routing i Supabase RLS to pitfalle o najwyzszym priorytecie (HIGH impact, HIGH frequency). |

**Overall confidence: HIGH**

### Gaps to Address

- **@react-pdf/renderer + React 19 kompatybilnosc:** Zweryfikowac na poczatku Phase 2 przez szybki PoC (1-2h). Jesli niekompatybilny — fallback to jsPDF z custom fonts (bardziej pracochlandy, ale sprawdzony).
- **Ceny jednostkowe typow prac:** FEATURES.md zaklada ze uzytkownik wpisuje wlasne ceny. Kwestia otwarta: czy dostarczac domyslne ceny rynkowe? Mocnyfundament.pl i inne zrodla podaja orientacyjne stawki 2025 dla PL — mozna hardcodowac jako defaults, ale wymaga decyzji produktowej.
- **VAT konfiguracja:** 8% vs 23% — czy uzytkownik wybiera per-wycena czy per-pokoj? Logika domenowa (mieszkania do 150m2 = 8%, powyzej = 23%) jest skomplikowana. MVP powinno miec prosty toggle, nie automatyczna detekcje.
- **ESLint v10 kompatybilnosc pluginow:** STACK.md zaznacza MEDIUM confidence — ESLint v10 wydany 20.02.2026, pluginy moga miec opoznione aktualizacje. Weryfikowac `typescript-eslint` i `eslint-plugin-react-hooks` kompatybilnosc przy setup.

## Sources

### Primary (HIGH confidence)
- [Vite 7 Announcement](https://vite.dev/blog/announcing-vite7) — Node 20.19+, Rolldown, browser targets
- [Tailwind CSS v4.0 Blog](https://tailwindcss.com/blog/tailwindcss-v4) — zero-config, performance, glassmorphism
- [Supabase RLS docs](https://supabase.com/docs/guides/database/postgres/row-level-security) — security model
- [Supabase Auth with React](https://supabase.com/docs/guides/auth/quickstarts/react) — session management
- [Zustand Slices Pattern](https://zustand.docs.pmnd.rs/guides/slices-pattern) — architektura store
- [Motion AnimatePresence](https://motion.dev/docs/react-animate-presence) — wizard transitions
- [React Docs: Derived State](https://react.dev/learn/you-might-not-need-an-effect) — anti-pattern: stored calculations
- [GitHub Pages SPA routing discussion](https://github.com/orgs/community/discussions/64096) — 404 fallback
- [Vite Static Deploy](https://vite.dev/guide/static-deploy) — GitHub Pages deployment

### Secondary (MEDIUM confidence)
- [kalkulatorremontu.pl](https://www.kalkulatorremontu.pl/), [elmro.pl](https://elmro.pl/), [kibinka.pl](https://www.kibinka.pl/) — analiza polskiej konkurencji
- [Remodelum](https://www.remodelum.com/), [Block Renovation](https://www.blockrenovation.com/) — analiza miedzynarodowej konkurencji
- [Build UI - Multistep Wizard](https://buildui.com/courses/framer-motion-recipes/multistep-wizard) — wizard transition patterns
- [Josh W. Comeau - Dark Mode](https://www.joshwcomeau.com/react/dark-mode/) — FOUC prevention
- [Robin Wieruch - JS Rounding Errors](https://www.robinwieruch.de/javascript-rounding-errors/) — floating-point w finansach
- [Glassmorphism Performance Guide](https://playground.halfaccessible.com/blog/glassmorphism-design-trend-implementation-guide) — backdrop-filter wydajnosc

### Tertiary (LOW confidence / inferencje)
- Ceny rynkowe materialow/robocizny w Polsce 2025 — mocnyfundament.pl — mozna uzyc jako defaults, ale wymagaja weryfikacji lokalnej
- ESLint v10 plugin compatibility — zbyt swiezy release (20.02.2026) do pelnej weryfikacji

---
*Research completed: 2026-02-22*
*Ready for roadmap: yes*
