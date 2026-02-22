# RenoCost — Kalkulator Kosztów Remontu

## What This Is

Nowoczesny, elegancki kalkulator kosztów remontu mieszkań w stylu produktu startupowego. Użytkownik przechodzi przez kreator krok po kroku (wizard), wybiera pomieszczenia z interaktywnymi kartami, definiuje wymiary i rodzaje prac, a aplikacja w czasie rzeczywistym kalkuluje koszty z pływającym podsumowaniem. Dostępna w PL i EN, hostowana na GitHub Pages z backendem Supabase do zapisu wycen w chmurze.

## Core Value

Użytkownik może szybko i intuicyjnie wyliczyć koszt remontu pokój po pokoju, bez przytłaczania — dzięki krokowym formularzom, interaktywnym kartom i animowanemu podsumowaniu na żywo.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Step-by-step wizard do tworzenia wyceny (zamiast jednego długiego formularza)
- [ ] Predefiniowane typy pomieszczeń z ikonami (kuchnia, łazienka, salon, sypialnia, korytarz, biuro, inne)
- [ ] Interaktywne karty wyboru zamiast zwykłych pól (ikona + opis)
- [ ] Pływający pasek podsumowania kosztów aktualizowany w czasie rzeczywistym z animacją licznika
- [ ] 7 predefiniowanych typów prac (malowanie, gruntowanie, szpachlowanie, ochrona posadzki, narożniki, bruzdy, akrylowanie)
- [ ] Możliwość dodawania własnych typów prac (custom work types)
- [ ] Kalkulacja: ilość × cena jednostkowa, sumy per pokój, suma netto, VAT 8%/23%, brutto
- [ ] Eksport wyceny do PDF (format standardowy i tabelaryczny)
- [ ] Wielojęzyczność PL/EN z przełącznikiem w nawigacji
- [ ] Tryb jasny i ciemny z przełącznikiem
- [ ] Logowanie/rejestracja przez Supabase (email + hasło)
- [ ] Tryb gościa — kalkulator bez logowania, logowanie do zapisu wycen
- [ ] Zapis/wczytywanie/usuwanie wycen w chmurze (Supabase, RLS)
- [ ] Reset hasła przez email
- [ ] Profesjonalne, subtelne efekty dźwiękowe (mikro-interakcje)
- [ ] Animacje Framer Motion — przejścia między krokami, hover, wejścia elementów
- [ ] Skeleton Loaders podczas ładowania danych
- [ ] Glassmorphism / Clean SaaS estetyka (subtelne cienie, zaokrąglone rogi 16px+, dużo światła)
- [ ] Paleta: profesjonalny granat/grafit z akcentem żywego błękitu lub szmaragdu
- [ ] Typografia: Inter lub Montserrat
- [ ] Mobile-first responsive design — na telefonie jak natywna aplikacja
- [ ] Hosting na GitHub Pages (statyczna SPA)
- [ ] Konfiguracja gh-pages w Vite

### Out of Scope

- Natywna aplikacja mobilna — web-first, responsive wystarczy
- Real-time collaboration — jednoosobowe wyceny
- Płatności online — kalkulator, nie system płatności
- Backend własny (serwer) — Supabase jako BaaS wystarczy
- OAuth (Google/GitHub login) — email/password wystarczy na v1
- Powiadomienia push/email — niepotrzebne dla kalkulatora

## Context

- **Baza:** Istniejąca aplikacja selter2001/renovation-cost-app (React 18 + Vite + TypeScript + Tailwind + Supabase)
- **Podejście:** Piszemy od zera z nowym designem, przenosimy logikę kalkulacji i integrację Supabase
- **Obecny stack:** React, Vite, TypeScript, Tailwind CSS, shadcn/ui, Framer Motion, Supabase, jsPDF, React Router, React Query, React Hook Form, Zod
- **Supabase:** Projekt `nirhjivalmvuvxxbkjwk` — tabele `profiles` i `quotes` z RLS
- **Domena:** Rynek polski — remonty mieszkań, ceny w PLN, stawki VAT 8%/23%
- **Logika kalkulacji:** 7 typów prac (m², mb), custom work types, ściany/sufity/narożniki/bruzdy/akryl/ochrona posadzki
- **PDF:** Generowany po stronie klienta (jsPDF z fontem NotoSans)

## Constraints

- **Hosting**: GitHub Pages — statyczne pliki, brak SSR, potrzebny hash router lub 404.html redirect
- **Backend**: Supabase Free Tier — 500 MB bazy, 50k MAU, wystarczające
- **Framework**: React + Vite (nie Next.js — GitHub Pages nie obsługuje SSR)
- **Budżet**: Zero kosztów infrastruktury (GitHub Pages free + Supabase free tier)
- **Istniejące dane**: Zachować kompatybilność ze schematem Supabase (tabele profiles, quotes)

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Od zera zamiast przeróbki | Nowy design wymaga innej struktury komponentów, wizard flow vs monolityczny formularz | — Pending |
| Vite + React (nie Next.js) | GitHub Pages = statyczny hosting, SSR niepotrzebny | — Pending |
| Zachowanie Supabase | Działa, Free Tier wystarczy, RLS już skonfigurowany | — Pending |
| Glassmorphism / Clean SaaS | Profesjonalny wygląd startupowy, zgodny z briefem | — Pending |
| Mobile-first | Rzemieślnicy często korzystają z telefonu na budowie | — Pending |
| Step-by-step wizard | Nie przytłaczać użytkownika — mniejsze kroki = lepsze UX | — Pending |

---
*Last updated: 2026-02-22 after initialization*
