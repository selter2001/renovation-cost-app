# Roadmap: RenoCost

## Overview

Budujemy kalkulator kosztow remontu jako SPA od zera z wizard UX, glassmorphism designem i cloud persistence. Trzy fazy: fundament (scaffold + design system + i18n + deploy), core wizard z kompletnym kalkulatorem i eksportem PDF, oraz autentykacja z zapisem wycen w chmurze. Kazda faza produkuje dzialajacy inkrement -- po Phase 2 mamy pelny kalkulator (tryb goscia), po Phase 3 pelny produkt z kontami.

## Phases

- [x] **Phase 1: Foundation + Design System** - Scaffold, routing, theme, i18n, shared UI, deploy pipeline ✓ 2026-02-22
- [ ] **Phase 2: Core Wizard + Kalkulator** - Kompletny kalkulator: wizard, pokoje, wymiary, prace, kalkulacja, floating summary, PDF
- [ ] **Phase 3: Auth + Cloud Save** - Logowanie, tryb goscia, zapis/wczytywanie wycen w chmurze z RLS

## Phase Details

### Phase 1: Foundation + Design System
**Goal**: Uzytkownik widzi profesjonalna, pusta aplikacje z nawigacja, przelacznikiem jezyka i motywu, gotowa na budowe featurow -- deployowana na GitHub Pages
**Depends on**: Nothing (first phase)
**Requirements**: DEPLOY-01, DEPLOY-02, DEPLOY-03, UI-01, UI-02, UI-03, UI-04, UI-08, UI-09, I18N-01, I18N-02, I18N-04
**Success Criteria** (what must be TRUE):
  1. Aplikacja jest dostepna pod URL-em GitHub Pages i poprawnie sie laduje (SPA routing dziala po odswiezeniu)
  2. Uzytkownik moze przelaczac miedzy trybem jasnym i ciemnym bez migniecia (FOUC) -- wybor jest zapamietywany
  3. Uzytkownik moze przelaczac jezyk PL/EN w nawigacji -- caly widoczny interfejs zmienia jezyk, wybor persystuje miedzy sesjami
  4. Interfejs wyglada profesjonalnie na telefonie i desktopie -- glassmorphism, zaokraglone rogi, paleta granat/grafit z akcentem, Inter/Montserrat
  5. Nawigacja zawiera logo, przelacznik jezyka, przelacznik motywu i placeholder na menu uzytkownika
**Plans**: 2 plans

Plans:
- [x] 01-01-PLAN.md — Scaffold projektu: Vite + React 19 + TS + Tailwind v4 + shadcn + routing + theme + i18n + fonty (DONE 2026-02-22)
- [x] 01-02-PLAN.md — UI: nawigacja z glassmorphism, przelaczniki, hero strona glowna, deploy workflow (DONE 2026-02-22)

### Phase 2: Core Wizard + Kalkulator
**Goal**: Uzytkownik moze przejsc caly wizard krok po kroku, dodac pokoje, zdefiniowac wymiary i prace, zobaczyc live podsumowanie kosztow i wyeksportowac wycene do PDF -- kompletny kalkulator dzialajacy bez logowania
**Depends on**: Phase 1
**Requirements**: WIZ-01, WIZ-02, WIZ-03, WIZ-04, ROOM-01, ROOM-02, ROOM-03, ROOM-04, ROOM-05, DIM-01, DIM-02, DIM-03, DIM-04, DIM-05, DIM-06, DIM-07, WORK-01, WORK-02, WORK-03, WORK-04, WORK-05, CALC-01, CALC-02, CALC-03, CALC-04, CALC-05, CALC-06, PDF-01, PDF-02, PDF-03, PDF-04, PDF-05, UI-05, UI-06, UI-07, I18N-03
**Success Criteria** (what must be TRUE):
  1. Uzytkownik przechodzi przez wizard (pokoje -> wymiary -> prace -> podsumowanie) z paskiem postepu, moze cofnac sie bez utraty danych, przejscia sa animowane
  2. Uzytkownik wybiera pokoje z interaktywnych kart z ikonami, moze dodac wiele pokoi, usunac pokoj i edytowac jego nazwe
  3. Uzytkownik podaje wymiary (sciany m2, sufity m2, posadzka m2, narozniki mb, bruzdy mb, akryl mb) per pokoj -- aplikacja automatycznie oblicza sumy powierzchni
  4. Uzytkownik widzi 7 predefiniowanych typow prac, moze wlaczac/wylaczac je per pokoj, ustawiac ceny jednostkowe, dodawac wlasne typy prac -- ilosci obliczane automatycznie z wymiarow
  5. Plywajacy pasek podsumowania pokazuje sume netto/VAT/brutto w czasie rzeczywistym z animacja licznika -- uzytkownik moze wybrac stawke VAT 8% lub 23%
  6. Uzytkownik moze wyeksportowac wycene do PDF (standardowy lub tabelaryczny) z polskimi znakami, danymi pokoi, typami prac, cenami i sumami -- PDF respektuje wybrany jezyk
**Plans**: TBD

Plans:
- [x] 02-01-PLAN.md — Data foundation: typy, Zustand store z persist, calc engine na groszach, i18n keys, shadcn components (DONE 2026-02-24)
- [ ] 02-02: TBD
- [ ] 02-03: TBD

### Phase 3: Auth + Cloud Save
**Goal**: Uzytkownik moze zalozyc konto, zalogowac sie i zapisywac/wczytywac wyceny w chmurze -- kalkulator dziala rowniez bez logowania (tryb goscia)
**Depends on**: Phase 2
**Requirements**: AUTH-01, AUTH-02, AUTH-03, AUTH-04, AUTH-05, SAVE-01, SAVE-02, SAVE-03, SAVE-04, SAVE-05, SAVE-06
**Success Criteria** (what must be TRUE):
  1. Uzytkownik moze korzystac z kalkulatora bez logowania (tryb goscia) -- kalkulator dziala identycznie jak w Phase 2
  2. Uzytkownik moze zalozyc konto (email + haslo), zalogowac sie, wylogowac sie -- sesja persystuje po odswiezeniu strony
  3. Uzytkownik moze zresetowac zapomniane haslo przez email
  4. Zalogowany uzytkownik moze zapisac wycene, zobaczyc liste swoich wycen (nazwa + data), wczytac, edytowac/nadpisac i usunac wycene
  5. Dane uzytkownikow sa chronione przez RLS -- uzytkownik widzi tylko swoje wyceny, nie ma dostepu do cudzych
**Plans**: TBD

Plans:
- [ ] 03-01: TBD
- [ ] 03-02: TBD

## Progress

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation + Design System | 2/2 | ✓ Complete | 2026-02-22 |
| 2. Core Wizard + Kalkulator | 1/3 | In progress | - |
| 3. Auth + Cloud Save | 0/2 | Not started | - |
