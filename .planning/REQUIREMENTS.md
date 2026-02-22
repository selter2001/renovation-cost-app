# Requirements: RenoCost -- Kalkulator Kosztow Remontu

**Defined:** 2026-02-22
**Core Value:** Uzytkownik moze szybko i intuicyjnie wyliczyc koszt remontu pokoj po pokoju, bez przytlaczania -- dzieki krokowym formularzom, interaktywnym kartom i animowanemu podsumowaniu na zywo.

## v1 Requirements

### Wizard UX

- [ ] **WIZ-01**: Uzytkownik przechodzi przez krokowy wizard (pokoje -> wymiary -> prace -> podsumowanie)
- [ ] **WIZ-02**: Uzytkownik widzi pasek postepu informujacy o aktualnym kroku wizarda
- [ ] **WIZ-03**: Uzytkownik moze cofnac sie do poprzedniego kroku bez utraty danych
- [ ] **WIZ-04**: Przejscia miedzy krokami sa animowane (Framer Motion slide transitions)

### Pomieszczenia

- [ ] **ROOM-01**: Uzytkownik moze dodac pomieszczenie wybierajac z predefiniowanych typow z ikonami (kuchnia, lazienka, salon, sypialnia, korytarz, biuro, inne)
- [ ] **ROOM-02**: Uzytkownik moze dodac wiele pomieszczen do jednej wyceny
- [ ] **ROOM-03**: Uzytkownik moze usunac pomieszczenie z wyceny
- [ ] **ROOM-04**: Uzytkownik moze edytowac nazwe pomieszczenia (nadpisac predefiniowana)
- [ ] **ROOM-05**: Karty pomieszczen sa interaktywne (ikona + opis, animowany hover)

### Wymiary i Powierzchnie

- [ ] **DIM-01**: Uzytkownik moze podac powierzchnie scian (wiele scian per pokoj, kazda z osobna wartoscia m2)
- [ ] **DIM-02**: Uzytkownik moze podac powierzchnie sufitow (wiele sufitow per pokoj, m2)
- [ ] **DIM-03**: Uzytkownik moze podac powierzchnie ochrony posadzki (m2)
- [ ] **DIM-04**: Uzytkownik moze podac dlugosc naroznikow (mb -- metry biezace)
- [ ] **DIM-05**: Uzytkownik moze podac dlugosc bruzd do zarzucenia (mb)
- [ ] **DIM-06**: Uzytkownik moze podac dlugosc akrylowania (mb)
- [ ] **DIM-07**: Aplikacja automatycznie oblicza sume powierzchni netto (sciany + sufity) per pokoj

### Typy Prac

- [ ] **WORK-01**: Uzytkownik widzi 7 predefiniowanych typow prac: malowanie, gruntowanie, szpachlowanie, ochrona posadzki, narozniki, bruzdy, akrylowanie
- [ ] **WORK-02**: Uzytkownik moze wlaczyc/wylaczyc kazdy typ pracy per pokoj
- [ ] **WORK-03**: Uzytkownik moze ustawic cene jednostkowa (zl/m2, zl/mb) dla kazdego typu pracy
- [ ] **WORK-04**: Uzytkownik moze dodac wlasny typ pracy z nazwa, jednostka (m2, mb, szt) i cena
- [ ] **WORK-05**: Ilosc dla kazdego typu pracy jest automatycznie obliczana z wymiarow pokoju

### Kalkulacja Kosztow

- [ ] **CALC-01**: Koszt per typ pracy = ilosc x cena jednostkowa
- [ ] **CALC-02**: Suma per pokoj = suma kosztow wszystkich aktywnych typow prac
- [ ] **CALC-03**: Suma netto = suma wszystkich pokoi
- [ ] **CALC-04**: Uzytkownik moze wybrac stawke VAT: 8% lub 23%
- [ ] **CALC-05**: Suma brutto = netto x (1 + VAT%)
- [ ] **CALC-06**: Plywajacy pasek podsumowania pokazuje sume w czasie rzeczywistym z animacja licznika

### Eksport PDF

- [ ] **PDF-01**: Uzytkownik moze wyeksportowac wycene do PDF
- [ ] **PDF-02**: PDF zawiera dane wszystkich pokoi, typow prac, ilosci, cen, sum per pokoj
- [ ] **PDF-03**: PDF zawiera sume netto, VAT, brutto
- [ ] **PDF-04**: PDF obsluguje polskie znaki (custom font)
- [ ] **PDF-05**: Uzytkownik moze wybrac format PDF: standardowy lub tabelaryczny

### Autentykacja i Dane

- [ ] **AUTH-01**: Uzytkownik moze korzystac z kalkulatora bez logowania (tryb goscia)
- [ ] **AUTH-02**: Uzytkownik moze zalozyc konto (email + haslo) przez Supabase
- [ ] **AUTH-03**: Uzytkownik moze sie zalogowac i wylogowac
- [ ] **AUTH-04**: Sesja uzytkownika persystuje po odswiezeniu strony
- [ ] **AUTH-05**: Uzytkownik moze zresetowac haslo przez email

### Zapis Wycen (Cloud)

- [ ] **SAVE-01**: Zalogowany uzytkownik moze zapisac wycene w chmurze (Supabase)
- [ ] **SAVE-02**: Zalogowany uzytkownik moze wczytac zapisana wycene
- [ ] **SAVE-03**: Zalogowany uzytkownik moze edytowac i nadpisac zapisana wycene
- [ ] **SAVE-04**: Zalogowany uzytkownik moze usunac zapisana wycene
- [ ] **SAVE-05**: Zalogowany uzytkownik widzi liste swoich wycen z nazwa i data
- [ ] **SAVE-06**: Dane uzytkownika chronione przez RLS (Row Level Security)

### Wielojezycznosc

- [ ] **I18N-01**: Caly interfejs jest przetlumaczony na PL i EN
- [ ] **I18N-02**: Uzytkownik moze przelaczyc jezyk w nawigacji
- [ ] **I18N-03**: Eksport PDF respektuje wybrany jezyk
- [ ] **I18N-04**: Jezyk jest zapamietywany miedzy sesjami

### Design i UI

- [ ] **UI-01**: Estetyka Glassmorphism / Clean SaaS (subtelne cienie, zaokraglone rogi 16px+, blur)
- [ ] **UI-02**: Paleta kolorow: profesjonalny granat/grafit z akcentem zywego blekitu lub szmaragdu
- [ ] **UI-03**: Typografia: Inter lub Montserrat (fonty bezszeryfowe)
- [ ] **UI-04**: Tryb jasny i ciemny z przelacznikiem w nawigacji
- [ ] **UI-05**: Animacje Framer Motion: przejscia stron, wejscia elementow, hover efekty
- [ ] **UI-06**: Skeleton Loaders podczas ladowania danych
- [ ] **UI-07**: Profesjonalne, subtelne efekty dzwiekowe (dodawanie pokoju, klikniecia, sukces)
- [ ] **UI-08**: Mobile-first responsive design -- na telefonie jak natywna aplikacja
- [ ] **UI-09**: Nawigacja z logo, przelacznikiem jezyka, motywu i menu uzytkownika

### Hosting i Deploy

- [ ] **DEPLOY-01**: Aplikacja hostowana na GitHub Pages jako statyczna SPA
- [ ] **DEPLOY-02**: Konfiguracja Vite z poprawnym base path i 404.html fallback
- [ ] **DEPLOY-03**: HashRouter do obslugi client-side routing na GitHub Pages

## v2 Requirements

### Przyszle rozszerzenia

- **FUTURE-01**: Kopiowanie wyceny jako szablon
- **FUTURE-02**: Eksport do Excel
- **FUTURE-03**: Udostepnianie wyceny linkiem
- **FUTURE-04**: Branding w PDF (logo firmy, dane kontaktowe)
- **FUTURE-05**: OAuth login (Google/GitHub)
- **FUTURE-06**: PWA z trybem offline

## Out of Scope

| Feature | Reason |
|---------|--------|
| Baza cen materialow / integracja ze sklepami | Ogromna zlozonosc, inny produkt. Uzytkownik zna swoje ceny |
| AI do analizy/generowania wycen | Koszty LLM, halucynacje cenowe, wykonawca zna ceny |
| Upload zdjec / wizualizacja AI | Niszowa wartosc, ogromna zlozonosc |
| Zarzadzanie projektami / CRM | Osobny produkt, feature creep |
| Real-time collaboration | Overkill dla jednoosobowych wycen |
| Harmonogram prac / timeline | Inna domena (planowanie czasu, nie kosztow) |
| Integracja z ksiegowoscia | Niszowa potrzeba, ogromna zlozonosc |
| Platnosci online | Kalkulator != system platnosci |
| Mapa z cenami regionalnymi | Wymaga bazy danych cen, ciagle aktualizacje |
| Natywna aplikacja mobilna | Web-first, responsive wystarczy |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| WIZ-01 | Phase 2 | Pending |
| WIZ-02 | Phase 2 | Pending |
| WIZ-03 | Phase 2 | Pending |
| WIZ-04 | Phase 2 | Pending |
| ROOM-01 | Phase 2 | Pending |
| ROOM-02 | Phase 2 | Pending |
| ROOM-03 | Phase 2 | Pending |
| ROOM-04 | Phase 2 | Pending |
| ROOM-05 | Phase 2 | Pending |
| DIM-01 | Phase 2 | Pending |
| DIM-02 | Phase 2 | Pending |
| DIM-03 | Phase 2 | Pending |
| DIM-04 | Phase 2 | Pending |
| DIM-05 | Phase 2 | Pending |
| DIM-06 | Phase 2 | Pending |
| DIM-07 | Phase 2 | Pending |
| WORK-01 | Phase 2 | Pending |
| WORK-02 | Phase 2 | Pending |
| WORK-03 | Phase 2 | Pending |
| WORK-04 | Phase 2 | Pending |
| WORK-05 | Phase 2 | Pending |
| CALC-01 | Phase 2 | Pending |
| CALC-02 | Phase 2 | Pending |
| CALC-03 | Phase 2 | Pending |
| CALC-04 | Phase 2 | Pending |
| CALC-05 | Phase 2 | Pending |
| CALC-06 | Phase 2 | Pending |
| PDF-01 | Phase 2 | Pending |
| PDF-02 | Phase 2 | Pending |
| PDF-03 | Phase 2 | Pending |
| PDF-04 | Phase 2 | Pending |
| PDF-05 | Phase 2 | Pending |
| AUTH-01 | Phase 3 | Pending |
| AUTH-02 | Phase 3 | Pending |
| AUTH-03 | Phase 3 | Pending |
| AUTH-04 | Phase 3 | Pending |
| AUTH-05 | Phase 3 | Pending |
| SAVE-01 | Phase 3 | Pending |
| SAVE-02 | Phase 3 | Pending |
| SAVE-03 | Phase 3 | Pending |
| SAVE-04 | Phase 3 | Pending |
| SAVE-05 | Phase 3 | Pending |
| SAVE-06 | Phase 3 | Pending |
| I18N-01 | Phase 1 | Pending |
| I18N-02 | Phase 1 | Pending |
| I18N-03 | Phase 2 | Pending |
| I18N-04 | Phase 1 | Pending |
| UI-01 | Phase 1 | Pending |
| UI-02 | Phase 1 | Pending |
| UI-03 | Phase 1 | Pending |
| UI-04 | Phase 1 | Pending |
| UI-05 | Phase 2 | Pending |
| UI-06 | Phase 2 | Pending |
| UI-07 | Phase 2 | Pending |
| UI-08 | Phase 1 | Pending |
| UI-09 | Phase 1 | Pending |
| DEPLOY-01 | Phase 1 | Pending |
| DEPLOY-02 | Phase 1 | Pending |
| DEPLOY-03 | Phase 1 | Pending |

**Coverage:**
- v1 requirements: 55 total
- Mapped to phases: 55
- Unmapped: 0

---
*Requirements defined: 2026-02-22*
*Last updated: 2026-02-22 after roadmap creation*
