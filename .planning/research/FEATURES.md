# Feature Research

**Domain:** Kalkulator kosztow remontu (renovation cost calculator)
**Researched:** 2026-02-22
**Confidence:** MEDIUM -- oparte na analizie 12+ istniejacych produktow (polskich i miedzynarodowych), ale bez bezposrednich testow uzytkownikow

## Krajobraz konkurencyjny

### Rynek polski

| Produkt | Typ | Kluczowe cechy | Slabosci |
|---------|-----|----------------|----------|
| kalkulatorremontu.pl | AI-powered, platny (199 PLN/rok) | AI konfiguracja, lista zakupow, eksport Excel/PDF, import cen wlasnych | Platny, skomplikowany dla prostych wycen |
| dobrewykonczenia.pl | Prosty kalkulator | 3 standardy (basic/standard/premium), wynik natychmiastowy | Tylko powierzchnia + standard, brak pokojow, brak PDF |
| kibinka.pl | Kalkulator z kategoriami prac | 6 kategorii prac, 3 standardy cenowe, wizualizacja wykresowa | Brak zapisu, brak PDF, brak pokojow |
| elmro.pl | Kalkulator z PDF | Podział materialy/robocizna, PDF, timeline projektu, regionalne ceny | Brak kont uzytkownikow, brak zapisu |
| kreatordomu.pl | Platforma z baza produktow | 3M+ produktow, moodboardy, kontakt z fachowcami, obliczanie ilosci materialow | Bardziej platforma niz kalkulator |
| SCCOT | Platforma biznesowa | CRM, szablony wycen, eksport PDF/Excel/Word, wielojezycznosc | Enterprise-level, nie dla zwyklych uzytkownikow |
| KODO | Gated kalkulator | Konsultacje studyjne, 10% znizki na podwyzszenie standardu | Wymaga maila, brak transparentnosci |

### Rynek miedzynarodowy

| Produkt | Typ | Kluczowe cechy | Slabosci |
|---------|-----|----------------|----------|
| Remodelum | All-in-one platforma | ZIP-code pricing, AI, budget tracker, PDF export, darmowy | US-centric, nie dla polskiego rynku |
| Block Renovation | AI + wizualizacja | Upload zdjecia, AI design, real-time koszt, mobile-friendly | Tylko US, wymaga zdjec |
| SimplyWise | Mobile app | AI, 6-sekundowa wycena, PDF, udostepnianie klientom | Tylko mobile native |
| Houzz Pro | Enterprise SaaS | Takeoff z planow, szablony, integracja z ksiegowoscia | $249/mies, za ciezki |
| Contractor+ | Dla wykonawcow | Kalkulator + zarzadzanie projektami | Ciezki, nie dla homeownerow |

## Wnioski z analizy konkurencji

1. **Polskie kalkulatory sa prymitywne** -- wiekszosc to proste formularze "wpisz m2, wybierz standard, dostaniesz kwote". Brak wizard flow, brak zapisu, brak kont.
2. **Luka na rynku**: Nie istnieje polski kalkulator, ktory laczy (a) wizard UX, (b) pokoje, (c) typy prac, (d) PDF, (e) chmure w jednym darmowym narzedziu.
3. **AI to trend**, ale nie table stakes -- kalkulatorremontu.pl jest jedynym polskim narzedziem z AI, a kosztuje 199 PLN/rok.
4. **Miedzynarodowe narzedzia sa za ciezkie** -- Houzz Pro, Bolster itp. to pelne platformy za $100-1000/mies.

---

## Feature Landscape

### Table Stakes (Uzytkownik tego oczekuje)

Brak tych funkcji = produkt nie jest traktowany powaznie. Uzytkownik zamknie karte.

| Feature | Dlaczego oczekiwane | Zlozonosc | Uwagi |
|---------|---------------------|-----------|-------|
| **Definiowanie pokojow z wymiarami** | Kazdy remont sklada sie z pokojow. Uzytkownik mysli kategoriami: kuchnia, lazienka, salon | MEDIUM | Wymiary: dlugosc, szerokosc, wysokosc. Obliczanie m2 scian, sufitu, podlogi |
| **Wybor typow prac per pokoj** | Rdzeniowa funkcjonalnosc kalkulatora -- co robimy w kazdym pokoju | MEDIUM | 7 predefiniowanych + custom. Rozne jednostki: m2, mb, szt |
| **Cena jednostkowa x ilosc = koszt** | Podstawowa logika kalkulacji, ktora oferuje kazdy konkurent | LOW | Auto-obliczanie ilosci z wymiarow pokoju |
| **Podsumowanie kosztow netto/brutto** | Polski wykonawca MUSI podac kwote netto + VAT | LOW | VAT 8% (mieszkania do 150m2) i 23% (powyzej/komercyjne) |
| **Eksport PDF** | Standard w branzy -- wycene wysyla sie mailem klientowi | MEDIUM | Profesjonalny layout z tabelami, logo, danymi firmy |
| **Responsywnosc mobile** | Fachowcy korzystaja z telefonu na budowie, homeownerzy z kanapY | MEDIUM | Mobile-first, ale musi dzialac tez na desktopie |
| **Dodawanie wielu pokojow** | Remont to zawsze wiele pomieszczen -- 1 pokoj = bezsensowny kalkulator | LOW | Lista pokojow z mozliwoscia dodawania/usuwania |
| **Podsumowanie per pokoj i calosciowe** | Uzytkownik chce wiedziec ile kosztuje kazdy pokoj i ile lacznie | LOW | Floating summary bar, tabela zbiorcza |
| **Predefiniowane typy pomieszczen** | Uzytkownik nie chce wpisywac "kuchnia" recznie, chce kliknac ikone | LOW | Kuchnia, lazienka, salon, sypialnia, korytarz, biuro, inne |
| **Jasny, krokowy UX (wizard)** | Dlugi formularz przytlacza (potwierdzaja to badania UX i praktyki konkurencji miedzynarodowej) | MEDIUM | Krok 1: pokoje, Krok 2: wymiary, Krok 3: prace, Krok 4: podsumowanie |

### Differentiators (Przewaga konkurencyjna)

Tych funkcji konkurenci polscy NIE maja lub maja slabo. Tu wygrywamy.

| Feature | Wartosc | Zlozonosc | Uwagi |
|---------|---------|-----------|-------|
| **Cloud save (zapis wycen w chmurze)** | Zadne polskie darmowe narzedzie nie oferuje zapisu -- uzytkownik traci wycene po zamknieciu karty | MEDIUM | Supabase z RLS. Tryb goscia + logowanie |
| **Tryb goscia bez rejestracji** | Wiekszosc narzedzi albo wymaga logowania (KODO), albo nie zapisuje wcale. Tryb goscia = zero tarcia, logowanie opcjonalne do zapisu | LOW | localStorage jako fallback, Supabase po zalogowaniu |
| **Historia wycen (lista zapisanych)** | Wykonawca robi wiele wycen dla roznych klientow -- potrzebuje je przegladac, edytowac, kopiowac | MEDIUM | Lista z wyszukiwaniem, statusem, data |
| **Animowany floating summary** | Polskie kalkulatory sa statyczne. Animowany licznik kosztow na zywo robi efekt "wow" | MEDIUM | Framer Motion, sticky bar na dole |
| **Custom work types** | Zadne proste narzedzie nie pozwala dodac wlasnego typu pracy z wlasna cena | LOW | Formularz: nazwa, jednostka, cena. Zapisywane per wycena |
| **Tryb ciemny** | Malo ktore polskie narzedzie to oferuje. Nowoczesny look | LOW | Tailwind dark mode, toggle w nawigacji |
| **i18n PL/EN** | Rozszerzenie rynku na zagranicznych wykonawcow w Polsce, eksporten | LOW | react-i18next lub equivalent |
| **Glassmorphism / Clean SaaS design** | Polskie kalkulatory wygladaja jak z 2010 roku. Nowoczesny design = zaufanie | MEDIUM | Subtelne cienie, blur, zaokraglone rogi, duzo bieli |
| **Mikro-interakcje dzwiekowe** | Zaden konkurent tego nie ma. Subtelne dzwieki przy dodawaniu pokoju, kliknieciu = premium feel | LOW | Opcjonalne, wyciszane. Kilka plikow audio |

### Anti-Features (Czego NIE budowac)

Funkcje, ktore wydaja sie dobre, ale tworza problemy lub sa poza zakresem.

| Anti-Feature | Dlaczego kuszaca | Dlaczego problematyczna | Co zamiast tego |
|--------------|------------------|-------------------------|-----------------|
| **Baza cen materialow / integracja ze sklepami** | kalkulatorremontu.pl i kreatordomu.pl to oferuja | Ogromna zlozonosc: scrapowanie cen, aktualizacje, 3M+ produktow. Calkowicie inny produkt | Uzytkownik sam wpisuje ceny jednostkowe -- wie ile bierze za m2 malowania |
| **AI do analizy opisu remontu** | Modne, kalkulatorremontu.pl to ma | Wymaga LLM API (koszty), halucynacje cenowe, falszywka precyzji. Nasz uzytkownk (wykonawca) ZNA ceny | Predefiniowane typy prac z edytowalnymi cenami |
| **Upload zdjec / wizualizacja AI** | Block Renovation to oferuje | Ogromna zlozonosc, niszowa wartosc dla wykonawcy. Wykonawca nie potrzebuje wizualizacji -- potrzebuje kwoty | Proste ikony pokojow i typow prac |
| **Zarzadzanie projektami / CRM** | SCCOT, Houzz Pro to maja | To osobny produkt. Dodanie PM/CRM = feature creep, utrata focusu | Link do eksportu PDF, klient otwiera w mailu |
| **Real-time collaboration** | Miedzynarodowe narzedzia to oferuja | Dla kalkulatora jednoosobowego to overkill. Dodaje WebSocket complexity | Eksport PDF + wyslanie mailem |
| **Harmonogram prac / timeline** | elmro.pl to sugeruje | Wymaga wiedzy domenowej (kolejnosc prac, czasy schnięcia itp.). Inny produkt | Focus na kosztach, nie na planowaniu czasu |
| **Integracja z ksiegowoscia** | Houzz Pro + QuickBooks | Niszowa potrzeba, ogromna zlozonosc, rozne systemy | Eksport PDF z kwotami netto/brutto/VAT wystarczy |
| **Platnosci online** | Niektore platformy to maja | Kalkulator nie jest systemem platnosci. Regulacje, PCI compliance | PDF wyceny z danymi do przelewu |
| **Mapa/lokalizacja z cenami regionalnymi** | elmro.pl i miedzynarodowe narzedzia | Wymaga bazy cen regionalnych, stale aktualizacje. Wykonawca zna swoje ceny lokalne | Uzytkownik ustawia wlasne ceny jednostkowe |
| **OAuth (Google/GitHub login)** | Wygoda | Dodatkowa konfiguracja, privacy concerns. Email+haslo wystarczy na v1 | Supabase email/password + opcjonalnie pozniej |

## Feature Dependencies

```
[Definiowanie pokojow]
    +-- wymaga --> [Wymiary pokojow]
    +-- wymaga --> [Predefiniowane typy pomieszczen]

[Wybor typow prac]
    +-- wymaga --> [Definiowanie pokojow]
    +-- wymaga --> [Ceny jednostkowe]

[Kalkulacja kosztow]
    +-- wymaga --> [Wybor typow prac]
    +-- wymaga --> [Wymiary pokojow] (auto-obliczanie ilosci)
    +-- wymaga --> [Stawki VAT]

[Podsumowanie kosztow]
    +-- wymaga --> [Kalkulacja kosztow]

[Floating summary bar]
    +-- wymaga --> [Kalkulacja kosztow] (dane do wyswietlenia)
    +-- wzbogaca --> [Wizard UX] (widoczny miedzy krokami)

[Eksport PDF]
    +-- wymaga --> [Podsumowanie kosztow]
    +-- wymaga --> [Dane pokojow + prac]

[Cloud save]
    +-- wymaga --> [Autentykacja Supabase]
    +-- wymaga --> [Model danych wyceny]

[Historia wycen]
    +-- wymaga --> [Cloud save]
    +-- wymaga --> [Autentykacja Supabase]

[Tryb goscia]
    +-- nie wymaga --> [Autentykacja] (localStorage fallback)
    +-- wzbogaca --> [Cloud save] (po zalogowaniu migracja danych)

[Custom work types]
    +-- wymaga --> [Wybor typow prac] (rozszerza liste)

[Tryb ciemny]
    +-- niezalezny (mozna dodac w dowolnym momencie)

[i18n PL/EN]
    +-- niezalezny, ale lepiej wbudowac od poczatku
    +-- wplyw na --> [Eksport PDF] (tlumaczenia w PDF)

[Wizard UX]
    +-- wymaga --> [Definiowanie pokojow]
    +-- wymaga --> [Wybor typow prac]
    +-- wymaga --> [Podsumowanie kosztow]
```

### Notatki o zaleznosciach

- **Wizard UX wymaga calego core flow**: Nie da sie zbudowac wizarda bez gotowej logiki pokojow, prac i kalkulacji. Wizard to warstwa prezentacji na gotowym silniku.
- **Cloud save wymaga autentykacji**: Najpierw Supabase auth, potem zapis. Ale tryb goscia moze dzialac bez auth (localStorage).
- **i18n lepiej od poczatku**: Dodawanie tlumaczen retrospektywnie jest bolesne. Wrapower od razu z kluczami i18n.
- **PDF wymaga gotowego modelu danych**: Nie da sie generowac PDF bez finalnej struktury danych wyceny.

## MVP Definition

### Launch With (v1)

Minimum do walidacji konceptu -- czy wykonawcy faktycznie beda uzywac.

- [x] **Wizard krokowy** (pokoje -> wymiary -> prace -> podsumowanie) -- rdzen UX, roznicuje od prostych formularzy
- [x] **Definiowanie pokojow z predefiniowanymi typami** -- ikony, karty, szybki wybor
- [x] **Wymiary + auto-obliczanie m2 scian/sufitu/podlogi** -- eliminuje reczne liczenie
- [x] **7 predefiniowanych typow prac** -- malowanie, gruntowanie, szpachlowanie, ochrona posadzki, narozniki, bruzdy, akrylowanie
- [x] **Kalkulacja: ilosc x cena, sumy per pokoj, netto/VAT/brutto** -- core logika
- [x] **Floating summary bar z animacja** -- wow effect, kluczowy differentiator
- [x] **Eksport PDF** -- bez tego wykonawca nie moze wyslac wyceny klientowi
- [x] **Responsywnosc mobile-first** -- fachowcy na budowie
- [x] **Tryb goscia** -- zero tarcia na starcie
- [x] **i18n PL/EN** -- od poczatku, zeby nie przerabiac pozniej

### Add After Validation (v1.x)

Funkcje do dodania gdy core dziala i sa pierwsi uzytkownicy.

- [ ] **Autentykacja Supabase (email/haslo)** -- trigger: uzytkownicy pytaja "jak zapisac"
- [ ] **Cloud save / historia wycen** -- trigger: uzytkownicy wracaja i chca edytowac stare wyceny
- [ ] **Custom work types** -- trigger: uzytkownicy potrzebuja wiecej niz 7 typow
- [ ] **Tryb ciemny** -- trigger: feedback o pracy w ciemnych warunkach / preferencja
- [ ] **Mikro-interakcje dzwiekowe** -- trigger: UI jest gotowe i stabilne
- [ ] **Reset hasla** -- trigger: sa zalogowani uzytkownicy

### Future Consideration (v2+)

Odlozone do momentu product-market fit.

- [ ] **Kopiowanie wyceny jako szablon** -- gdy uzytkownicy maja powtarzalne projekty
- [ ] **Eksport do Excel** -- gdy uzytkownicy chca edytowac dane w arkuszu
- [ ] **Udostepnianie wyceny linkiem** -- gdy uzytkownicy chca slac link zamiast PDF
- [ ] **Branding w PDF (logo firmy, dane kontaktowe)** -- gdy wykonawcy chca profesjonalny wyglad
- [ ] **Predefiniowane cenniki regionalne** -- gdyby byla baza danych cen (ambitne)
- [ ] **PWA z offline** -- gdy mobile usage jest wysoki

## Feature Prioritization Matrix

| Feature | Wartosc dla uzytkownika | Koszt implementacji | Priorytet |
|---------|------------------------|---------------------|-----------|
| Wizard krokowy | HIGH | MEDIUM | P1 |
| Definiowanie pokojow + typy | HIGH | LOW | P1 |
| Wymiary + auto-obliczanie | HIGH | MEDIUM | P1 |
| 7 typow prac | HIGH | LOW | P1 |
| Kalkulacja netto/VAT/brutto | HIGH | LOW | P1 |
| Floating summary bar | HIGH | MEDIUM | P1 |
| Eksport PDF | HIGH | MEDIUM | P1 |
| Mobile-first responsive | HIGH | MEDIUM | P1 |
| Tryb goscia | MEDIUM | LOW | P1 |
| i18n PL/EN | MEDIUM | MEDIUM | P1 |
| Predefiniowane typy pomieszczen (ikony) | MEDIUM | LOW | P1 |
| Glassmorphism design | MEDIUM | MEDIUM | P1 |
| Autentykacja Supabase | MEDIUM | MEDIUM | P2 |
| Cloud save | MEDIUM | MEDIUM | P2 |
| Historia wycen | MEDIUM | MEDIUM | P2 |
| Custom work types | MEDIUM | LOW | P2 |
| Tryb ciemny | LOW | LOW | P2 |
| Mikro-interakcje dzwiekowe | LOW | LOW | P2 |
| Reset hasla | LOW | LOW | P2 |
| Kopiowanie wycen | LOW | LOW | P3 |
| Eksport Excel | LOW | MEDIUM | P3 |
| Udostepnianie linkiem | LOW | MEDIUM | P3 |
| Branding w PDF | LOW | MEDIUM | P3 |
| PWA offline | LOW | HIGH | P3 |

**Klucz priorytetow:**
- P1: Musi byc na launch -- bez tego produkt nie ma sensu
- P2: Powinno byc -- dodac gdy core jest stabilny
- P3: Fajnie miec -- rozwazyc w przyszlosci

## Competitor Feature Analysis

| Feature | dobrewykonczenia.pl | kibinka.pl | elmro.pl | kalkulatorremontu.pl | Remodelum (US) | **RenoCost (nasz plan)** |
|---------|---------------------|------------|----------|----------------------|----------------|--------------------------|
| Wizard krokowy | Nie | Nie | Nie | Tak (AI) | Tak | **Tak** |
| Definiowanie pokojow | Nie | Nie | Tak (typy) | Tak | Tak | **Tak (ikony + karty)** |
| Wymiary pokojow | Nie (tylko m2) | Tak (m2) | Tak | Tak | Tak (ZIP code) | **Tak (auto-obliczanie)** |
| Typy prac | Nie | 6 kategorii | 6 kategorii | AI-driven | Kategorii | **7 + custom** |
| VAT PL | Nie | Nie | Nie | Tak | N/A (US tax) | **Tak (8%/23%)** |
| Eksport PDF | Nie | Nie | Tak | Tak (Excel/PDF) | Tak | **Tak** |
| Cloud save | Nie | Nie | Nie | Tak (platne) | Tak (darmowe) | **Tak (darmowe)** |
| Tryb goscia | Tak | Tak | Tak | Nie | Nie | **Tak** |
| Custom work types | Nie | Nie | Nie | Nie | Nie | **Tak** |
| Mobile responsive | Slabo | Slabo | Srednia | Tak | Tak | **Mobile-first** |
| Dark mode | Nie | Nie | Nie | Nie | Nie | **Tak** |
| i18n | Nie | Nie | Nie | Nie | EN only | **PL/EN** |
| Animacje/UX | Brak | Brak | Minimalne | Srednie | Dobre | **Glassmorphism + Framer Motion** |
| Cena | Darmowy | Darmowy | Darmowy | 199 PLN/rok | Darmowy | **Darmowy** |

## Kluczowy wniosek

RenoCost wypelnia wyrazna luke na polskim rynku: **darmowy, nowoczesny kalkulator z wizard UX, zapisem w chmurze i eksportem PDF**. Zadne istniejace polskie narzedzie nie laczy tych cech. Najblizszy konkurent (kalkulatorremontu.pl) jest platny i AI-heavy -- my celujemy w prostote i szybkosc z profesjonalnym designem.

## Sources

### Polscy konkurenci (analizowani bezposrednio)
- [kalkulatorremontu.pl](https://www.kalkulatorremontu.pl/) -- AI kalkulator remontu, platny 199 PLN/rok
- [dobrewykonczenia.pl](https://dobrewykonczenia.pl/kalkulator-wykonczenia-mieszkania) -- prosty kalkulator m2 x standard
- [kibinka.pl](https://www.kibinka.pl/praktyczne-kalkulatory-online/kalkulator-kosztow-remontu-mieszkania/) -- 6 kategorii prac, 3 standardy
- [elmro.pl](https://elmro.pl/kalkulatory-online/kalkulator-kosztow-remontu-mieszkania/) -- PDF, podzial materialy/robocizna
- [kreatordomu.pl](https://kreatordomu.pl/kalkulator) -- baza 3M produktow, moodboardy
- [SCCOT](https://sccot.pl/) -- platforma biznesowa, CRM + kosztorysy
- [KODO](https://www.kodo.pl/en/calculator/) -- gated kalkulator z konsultacjami
- [mocnyfundament.pl](https://mocnyfundament.pl/kalkulator-kosztow-remontu-mieszkania/) -- ceny rynkowe 2025

### Miedzynarodowi konkurenci
- [Remodelum](https://www.remodelum.com/renovation-cost-estimator) -- all-in-one z ZIP code pricing
- [Block Renovation](https://www.blockrenovation.com/tools/calculate-renovation-cost-estimations) -- AI + wizualizacja
- [SimplyWise](https://play.google.com/store/apps/details?id=com.simplywise.costestimator) -- mobile AI estimator
- [Contractor+](https://contractorplus.app/resources/cost-calculator/renovation-cost-calculator) -- kalkulator dla wykonawcow

### Przeglady rynku
- [Goodfirms - Top Remodeling Software](https://www.goodfirms.co/remodeling-estimating-software/)
- [Homesage.ai - 4 Best AI Tools](https://homesage.ai/4-best-renovation-cost-estimating-tools-in-2026/)
- [ArchiVinci - 15 Best Renovation Apps](https://www.archivinci.com/blogs/15-best-home-renovation-apps-to-transform-your-space-in-2025)

---
*Feature research for: Kalkulator kosztow remontu (RenoCost)*
*Researched: 2026-02-22*
