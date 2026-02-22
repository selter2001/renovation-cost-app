# Pitfalls Research

**Domain:** Kalkulator kosztow remontu - React SPA (wizard + real-time calculations)
**Researched:** 2026-02-22
**Confidence:** HIGH (wiele zrodel potwierdza kazdy pitfall)

---

## Critical Pitfalls

### Pitfall 1: Floating-point arithmetic w kalkulatorze kosztow

**What goes wrong:**
JavaScript uzywa IEEE 754 (64-bit float). Klasyczny przyklad: `0.1 + 0.2 === 0.30000000000000004`. W kalkulatorze kosztow remontu, gdzie sumuje sie dziesiatki pozycji z roznymi cenami za m2, bledy kumuluja sie i uzytkownik widzi kwoty typu "12 450,0000000001 PLN" zamiast "12 450,00 PLN". Problem dotyczy 17-56% operacji matematycznych w JS.

**Why it happens:**
Deweloperzy traktuja JS `number` jak typ walutowy. Nie mysla o precyzji, bo przy malych operacjach blad jest niewidoczny. Staje sie widoczny dopiero przy kumulacji wielu operacji (a kalkulator remontu to wlasnie kumulacja).

**How to avoid:**
- Wszystkie obliczenia wykonuj na groszach (integerach): `1250` zamiast `12.50`.
- Konwertuj na kwoty wyswietlane TYLKO w warstwie prezentacji za pomoca `Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'PLN' })`.
- Alternatywnie uzyj `decimal.js` lub `dinero.js` do arytmetyki walutowej.
- **Zasada: nigdy nie wyswietlaj surowego wyniku `number` jako kwoty.**

**Warning signs:**
- Testy pokazuja kwoty z wiecej niz 2 miejscami po przecinku.
- Suma pozycji != suma wyswietlana w podsumowaniu (roznica o ulamek grosza).
- Uzytkownik widzi "12 450,0100000001 PLN".

**Phase to address:**
Faza foundation/core - ustal konwencje arytmetyki walutowej ZANIM zaczniesz budowac logike obliczen. Zmiana pozniej wymaga przepisania calej warstwy kalkulacji.

---

### Pitfall 2: GitHub Pages nie obsluguje client-side routingu

**What goes wrong:**
Po deploymencie na GitHub Pages, odswiezenie strony na jakiejkolwiek sciezce poza `/` zwraca 404. Np. uzytkownik jest na `/calculator/step-3`, odswierza - dostaje strone 404 GitHuba. Linki bezposrednie tez nie dzialaja.

**Why it happens:**
GitHub Pages to serwer plikow statycznych. Nie ma wsparcia dla SPA fallback (jak `_redirects` w Netlify). Szuka pliku HTML pasujacego do sciezki URL - nie znajduje go, zwraca 404.

**How to avoid:**
- **Opcja A (zalecana):** Kopiuj `index.html` jako `404.html` w skrypcie build: `"build": "vite build && cp dist/index.html dist/404.html"`. GitHub Pages serwuje `404.html` dla nieznanych sciezek - a to jest twoje SPA.
- **Opcja B:** Uzyj `HashRouter` zamiast `BrowserRouter` (`/#/step-1` zamiast `/step-1`). Prostsze, ale brzydsze URL-e.
- Ustaw `base` w `vite.config.ts` na nazwe repozytorium: `base: '/nazwa-repo/'`.
- Ustaw `basename` w React Router na to samo: `<BrowserRouter basename="/nazwa-repo/">`.
- **Brave browser wyswietla ostrzezenie** przy odpowiedziach 404, link preview tez nie dziala.

**Warning signs:**
- Aplikacja dziala lokalnie, ale po deploy odswiezenie daje 404.
- Linki kopiowane i wklejane w nowe okno nie dzialaja.
- Assety (CSS, JS) nie laduja sie po deploy (bledna sciezka base).

**Phase to address:**
Faza infrastruktury/setup - skonfiguruj ZANIM zaczniesz budowac routing. Dodaj `404.html` do procesu build od poczatku. Testuj deploy po kazdej fazie.

---

### Pitfall 3: Utrata danych formularza w wizard multi-step

**What goes wrong:**
Uzytkownik wypelnia 5 krokow formularza (pomieszczenia, materialy, wymiary), przypadkowo zamyka tab, naciska "Back" w przegladarce, lub aplikacja sie przeladowuje - traci WSZYSTKIE dane. W kalkulatorze remontu to szczegolnie bolesne, bo konfiguracja jest zlozna i czasochlonna.

**Why it happens:**
Stan formularza przechowywany wylacznie w React state (pamieci). Brak persystencji. Deweloperzy traktuja wizard jak krotki formularz, ale w kalkulatorze remontu uzytkownik moze spedzic 10-15 minut na konfiguracji.

**How to avoid:**
- Zapisuj stan formularza do `localStorage` lub `sessionStorage` po kazdej zmianie (debounced, co 500ms).
- Uzyj Zustand z middleware `persist` - to natywne wsparcie dla localStorage.
- Przy ladowaniu formularza, sprawdz czy istnieje zapisany stan i zaproponuj jego przywrocenie.
- Dodaj `beforeunload` event listener z ostrzezeniem o niezapisanych danych.
- Gdy uzytkownik jest zalogowany - synchronizuj draft do Supabase co kilka minut.

**Warning signs:**
- Brak logiki `beforeunload` w kodzie.
- Zustand store bez middleware `persist`.
- Stan formularza resetuje sie po F5.

**Phase to address:**
Faza formularza wizard - implementuj persystencje ROWNOCZESNIE z budowa formularza, nie jako "nice-to-have" na koncu.

---

### Pitfall 4: Supabase RLS wylaczone lub zle skonfigurowane

**What goes wrong:**
Kazda nowa tabela w Supabase ma domyslnie wylaczone Row Level Security. Klucz `anon` jest widoczny w kodzie frontendowym (to normalne). Ale jesli RLS jest wylaczone, KAZDY kto zna URL projektu i klucz anon moze czytac i zapisywac WSZYSTKIE dane w tabeli. Jeden request API = wyciek danych wszystkich uzytkownikow.

**Why it happens:**
Deweloperzy zakladaja, ze klucz API jest "tajny" i nie myslą o warstwie autoryzacji na poziomie bazy. Supabase nie wlacza RLS domyslnie - trzeba to zrobic recznie dla kazdej tabeli.

**How to avoid:**
- **Wlacz RLS na KAZDEJ tabeli** natychmiast po jej utworzeniu. Bez wyjatkow.
- Dodaj polityki (policies) przed napisaniem kodu frontendowego, ktory uzywa danej tabeli.
- Klucz `service_role` NIGDY w kodzie frontendowym - nawet w zmiennych srodowiskowych Vite (bo `VITE_*` sa widoczne w bundlu).
- Testuj polityki RLS: zaloguj sie jako user A, sprobuj odczytac dane user B.
- Stosuj zasade "deny by default" - RLS wlaczone bez polityk = zero dostepu (lepsze niz odwrotnie).

**Warning signs:**
- Tabele w Supabase Dashboard pokazuja "RLS disabled".
- Klucz `service_role` w pliku `.env` z prefiksem `VITE_`.
- Brak testow autoryzacji (czy user A widzi dane user B).

**Phase to address:**
Faza auth/Supabase - skonfiguruj RLS ZANIM zaczniesz zapisywac dane uzytkownikow. Kazda migracja bazy powinna zawierac `ALTER TABLE ... ENABLE ROW LEVEL SECURITY` i odpowiednie polityki.

---

### Pitfall 5: Brak per-step walidacji w wizard

**What goes wrong:**
Caly formularz walidowany dopiero na ostatnim kroku. Uzytkownik przechodzi 5 krokow, klika "Oblicz" i dostaje 12 bledow walidacji z kroku 2. Musi sie cofnac, poprawic, przejsc znowu do kroku 5. W przypadku walidacji server-side na ostatnim kroku - bledy z wczesniejszych krokow nie sa widoczne.

**Why it happens:**
Programisci buduja pojedynczy `<form>` i dodaja walidacje na submit. Nie mysla o walidacji miedzy krokami. React Hook Form domyslnie waliduje na submit.

**How to avoid:**
- Utworz oddzielny schemat Zod dla kazdego kroku: `stepOneSchema`, `stepTwoSchema`, itd.
- Uzyj `trigger()` z React Hook Form do walidacji pol biezacego kroku ZANIM pozwolisz przejsc dalej.
- Zablokuj przycisk "Dalej" dopoki biezacy krok nie jest valid.
- Na kroku podsumowania pokaz dane ze wszystkich krokow z mozliwoscia edycji (kliknij -> wroc do danego kroku).
- Wizualny wskaznik w stepper: krok z bledem = czerwona ikona.

**Warning signs:**
- Jeden schemat walidacji dla calego formularza.
- Przycisk "Dalej" zawsze aktywny.
- Brak walidacji przy nawigacji miedzy krokami.

**Phase to address:**
Faza formularza wizard - zaprojektuj schemat walidacji per-step OD POCZATKU. Retrofitting per-step validation do monolitycznego schematu jest bolesny.

---

## Technical Debt Patterns

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Hardcoded strings zamiast i18n keys | Szybsze pisanie komponentow | Przepisywanie KAZDEGO tekstu przy dodawaniu i18n | Nigdy - uzywaj kluczy i18n od dnia 1, nawet jezeli na poczatku jest tylko PL |
| Inline styles dla glassmorphism | Szybki prototyp wygladu | Duplikacja, niespojnosc, niemozliwe theming | Tylko w spike/PoC, nigdy w kodzie produkcyjnym |
| `any` w TypeScript dla form data | Mniej typowania | Brak type-safety w logice kalkulacji - bledy runtime | Nigdy - Zod schemas generuja typy automatycznie |
| Obliczenia w komponentach | Prostszy kod | Niemozliwe do testowania, duplikacja logiki | Nigdy - wydziel calculation engine |
| Skip RLS "bo to MVP" | Szybszy development | Wyciek danych, wymaga przeprojektowania | Nigdy |
| `localStorage` zamiast Supabase dla danych | Brak potrzeby backendu | Dane nie sa synchronizowane, brak backup, limit 5MB | Akceptowalne dla niezalogowanych uzytkownikow jako draft |

## Integration Gotchas

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| Supabase Auth | Async call wewnatrz `onAuthStateChange` callback powoduje deadlock | Usun async z callbacka; uzyj osobnej funkcji poza callbackiem do async operacji |
| Supabase Auth | Uzytkownik widzi flash "niezalogowany" przy page refresh | Dodaj loading state (`isLoading: true`) dopoki `onAuthStateChange` nie zwroci stanu; nie renderuj chronionych widokow dopoki auth state nie jest resolved |
| jsPDF + polskie znaki | Domyslne fonty PDF nie obsluguja UTF-8 (polskie znaki: a, e, z, z, s, c, n, o, l) | Dodaj custom font (np. Roboto, Inter) jako base64 embed do jsPDF; przetestuj WSZYSTKIE polskie znaki w PDF |
| jsPDF + html2canvas | Tekst w PDF jest rasteryzowany (obraz) - nie mozna go zaznaczac, jest rozmyty przy zoomie | Uzyj jsPDF API bezposrednio (`doc.text()`, `doc.rect()`) zamiast html2canvas; lub rozważ `@react-pdf/renderer` |
| Framer Motion + AnimatePresence | Memory leak gdy komponent opuszcza i wraca do DOM w trakcie animacji wyjscia | Upewnij sie, ze `AnimatePresence` jest ZAWSZE renderowane gdy oczekujesz animacji wyjscia; nie unmountuj rodzica |
| react-i18next | `t()` zwraca klucz zamiast tlumaczenia (init nie zakonczony) | Uruchom `i18next.init()` w entry point PRZED renderem React; uzyj `Suspense` z `react-i18next` |
| GitHub Pages + Vite | Assety laduja z blednej sciezki (np. `/assets/` zamiast `/nazwa-repo/assets/`) | Ustaw `base: '/nazwa-repo/'` w `vite.config.ts`; zweryfikuj sciezki w zbudowanym HTML |

## Performance Traps

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| Backdrop-filter blur na wielu elementach | Janky scrolling, spadek FPS na mobilach, zacinanie animacji | Ogranicz glassmorphism do 2-3 elementow na viewport; zmniejsz blur do 6-8px na mobile; nie animuj elementow z backdrop-filter | Na budzetowych telefonach (low-end Android) przy 4+ elementach z blur |
| Re-render calego formularza przy kazdym keystroke | Input lag, widoczne opoznienie przy pisaniu, wysokie CPU | Uzyj React Hook Form (uncontrolled components); nie uzywaj `watch()` globalnie - subskrybuj tylko potrzebne pola; memoizuj komponenty krokow | Przy 30+ polach formularza lub na wolniejszych urzadzeniach |
| Framer Motion layout prop na wielu elementach | Ciagłe przeliczanie layoutu, spadek FPS | Uzyj `layout` prop oszczednie; preferuj `useMotionValue` dla wartosci zmieniajacych sie czesto (np. scroll position); uzyj `LazyMotion` do redukcji bundla | Przy animowaniu 10+ elementow jednoczesnie |
| Przeliczanie kosztow na kazdy keystroke | UI zamraza sie przy szybkim wpisywaniu wymiarow | Debounce obliczen (300ms); uzyj `useMemo` z zaleznoscia od stabilnych wartosci; wydziel calculation engine poza render cycle | Przy zlozonych formulach z 20+ zmiennymi |
| jsPDF generowanie PDF duzego raportu | Przegladarka zamraza sie na kilka sekund; uzytkownik mysli ze app sie zawiesiła | Pokaz progress indicator; rozważ Web Worker dla generowania PDF; optymalizuj rozmiar osadzonych fontow | Przy raportach z 5+ stronami lub duzymi tabelami |

## Security Mistakes

| Mistake | Risk | Prevention |
|---------|------|------------|
| Klucz `service_role` Supabase w kodzie frontendowym | Pelny dostep do bazy danych z pominieciem RLS - kazdy moze czytac/zapisywac/usuwac wszystko | Uzyj WYLACZNIE klucza `anon` w frontend; `service_role` tylko w server-side functions (Supabase Edge Functions) |
| Cennik/stawki przechowywane TYLKO na frontendzie | Uzytkownik modyfikuje ceny w DevTools i generuje falszywy kosztorys | Traktuj frontend jako niezaufany; waliduj obliczenia server-side jezeli kosztorys ma moc prawna; dla portfolio app - akceptowalne ryzyko |
| Brak walidacji inputow numerycznych | Uzytkownik wpisuje ujemne wartosci, ekstremalnie duze liczby, lub tekst - kalkulacja daje absurdalne wyniki | Zdefiniuj min/max w Zod schema (np. `z.number().min(0).max(10000)` dla m2); waliduj na poziomie komponentu i schematu |
| Brak rate limiting na Supabase | Bot moze spamowac rejestracje lub zapisy kalkulacji | Wlacz Supabase rate limiting w dashboard; dla auth - ustaw limit prob logowania |

## UX Pitfalls

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| Floating summary zasłania content na mobile | Uzytkownik nie widzi pol formularza pod sticky panelem; frustracja | Na mobile: floating summary jako collapsible bottom sheet (domyslnie zwiniety, pokazujacy tylko total); na desktop: sidebar |
| Brak wskaznika progresu w wizard | Uzytkownik nie wie ile krokow zostalo; porzuca formularz bo mysli ze jest "nieskonczony" | Stepper z numerami krokow + nazwa kazdego kroku; aktualny krok wyroznioy; mozliwosc klikniecia na poprzedni krok |
| Glassmorphism z niskim kontrastem tekstu | Tekst nieczytelny na jasnym tle; fail WCAG; uzytkownik musi mruzyc oczy | Testuj kontrast tekstu na KAZDYM mozliwym tle; uzyj ciemniejszego tekstu lub dodaj subtelny solid background pod tekstem; cel: WCAG AA (4.5:1) |
| Animacje bez `prefers-reduced-motion` | Uzytkownicy z epilepsja lub motion sensitivity doswiadczaja dyskomfortu | Dodaj `@media (prefers-reduced-motion: reduce)` - wylacz animacje Framer Motion; uzyj `useReducedMotion()` hook z Framer Motion |
| Dark mode flash (FOUC) | Przy ladowaniu strony blysneie jasnym motywem zanim zaladuje sie dark mode | Zapisuj preferencje w localStorage; ustaw klase `dark` na `<html>` w inline `<script>` w `index.html` ZANIM React sie zaladuje |
| i18n - zmiana jezyka nie zmienia formatu liczb | Przelaczenie na EN ale kwoty nadal w formacie "12 450,00 zl" zamiast "PLN 12,450.00" | Sprzegnij formatowanie liczb z aktualnym locale; uzyj `Intl.NumberFormat` z dynamicznym locale z i18next |

## "Looks Done But Isn't" Checklist

- [ ] **Kalkulator:** Czesto brakuje poprawnego zaokraglania do groszy -- zweryfikuj ze KAZDA wyswietlana kwota ma dokladnie 2 miejsca po przecinku
- [ ] **Wizard form:** Czesto brak mozliwosci powrotu do wczesniejszego kroku z zachowaniem danych -- zweryfikuj ze nawigacja wstecz ZACHOWUJE wypelnione dane
- [ ] **PDF export:** Czesto brak polskich znakow (a, e, z, o, l, s, c, n) -- zweryfikuj generujac PDF z tekstem "Laczny koszt kuchni: salka lazienka"
- [ ] **i18n:** Czesto przetlumaczony UI ale nie przetlumaczone walidacje/bledy -- zweryfikuj ze komunikaty bledow sa w aktualnym jezyku
- [ ] **Dark mode:** Czesto poprawny toggle ale glassmorphism wyglada zle w dark mode (zbyt jasne rgba, niewidoczne borders) -- zweryfikuj KAZDY komponent glass w obu motywach
- [ ] **Mobile responsive:** Czesto OK w Chrome DevTools ale zle na realnym telefonie (touch targets za male, floating summary zasłania input) -- testuj na REALNYM urzadzeniu
- [ ] **GitHub Pages deploy:** Czesto dziala na `/` ale refresh na `/step/3` daje 404 -- zweryfikuj odswiezajac kazda podstrone po deploy
- [ ] **Supabase auth:** Czesto login dziala ale page refresh wylogowuje (brak obslugi session restore) -- zweryfikuj ze `onAuthStateChange` poprawnie przywraca sesje
- [ ] **Accessibility:** Czesto brak fokus management w wizard (tab order nie podaza za krokami) -- zweryfikuj ze po kliknieciu "Dalej" focus przenosi sie na pierwszy element nowego kroku

## Recovery Strategies

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| Floating-point arithmetic w calym kodzie | MEDIUM | Wydziel calculation engine; zmien na integer arithmetic (grosze); zaktualizuj testy; ~2-4h pracy |
| Brak 404.html na GitHub Pages | LOW | Dodaj `cp dist/index.html dist/404.html` do build script; redeploy; ~15min |
| Utrata danych formularza | MEDIUM | Dodaj Zustand persist middleware; zaimplementuj localStorage sync; ~2-3h |
| RLS wylaczone na tabelach | HIGH jesli dane juz wyciekly, LOW jesli wykryte wczesnie | Wlacz RLS; napisz polityki; przetestuj; jesli dane wyciekly - powiadom uzytkownikow; ~1-4h |
| Monolityczny schemat walidacji | HIGH | Rozdziel na per-step schemas; przepisz nawigacje wizard; ~4-8h |
| Hardcoded strings (brak i18n) | HIGH | Stworzenie plikow tlumaczen; zamiana kazdego stringa na `t('key')`; ~1h na kazde 20 stringow |
| jsPDF bez custom fontow (polskie znaki) | LOW-MEDIUM | Embed font Roboto/Inter; zamien wywolania `doc.setFont()`; ~1-2h |
| Dark mode flash | LOW | Dodaj inline script w index.html; ~30min |
| Backdrop-filter lag na mobile | MEDIUM | Refactor CSS: pre-blurred images lub redukcja elementow z blur; ~2-4h |

## Pitfall-to-Phase Mapping

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| Floating-point arithmetic | Phase: Foundation/Core | Unit test: suma 100 losowych kwot PLN == oczekiwany wynik z dokladnoscia do grosza |
| GitHub Pages 404 | Phase: Infrastructure/Setup | Test: odswierz `/calculator/step-3` na deployed site - nie dostaniesz 404 |
| Utrata danych formularza | Phase: Wizard Form | Test: wypelnij 3 kroki, odswierz strone, dane sa przywrocone |
| Supabase RLS | Phase: Auth/Database | Test: zaloguj sie jako user A, probuj SELECT na danych user B - pusty wynik |
| Per-step walidacja | Phase: Wizard Form | Test: kliknij "Dalej" z pustymi polami - dostaniesz blad ZANIM przejdziesz dalej |
| Hardcoded strings | Phase: i18n Setup | Test: przelacz na EN - KAZDY tekst w UI jest po angielsku |
| jsPDF polskie znaki | Phase: PDF Export | Test: wygeneruj PDF z tekstem "Laczny koszt lazienki" - znaki wyswietlaja sie poprawnie |
| Dark mode flash | Phase: Theming | Test: ustaw dark mode, odswierz strone - brak blyskniecia jasnym motywem |
| Glassmorphism mobile perf | Phase: UI/Styling | Test: otworzenie na budzetowym Android - brak lag przy scrollowaniu |
| Floating summary na mobile | Phase: UI/Responsive | Test: na telefonie 375px szerokosci - floating summary nie zaslania inputow formularza |
| Framer Motion memory leaks | Phase: Animations | Test: nawiguj 20x miedzy krokami wizard - pamiec nie rosnie ciągle |
| i18n number formatting | Phase: i18n | Test: przelacz PL->EN, kwota zmienia format z "12 450,00 zl" na "PLN 12,450.00" |

## Sources

- [JavaScript Floating Point Precision - Patrick Karsh / Medium](https://patrickkarsh.medium.com/why-math-is-hard-in-javascript-floating-point-precision-in-javascript-41706aa7a89d) -- MEDIUM confidence
- [JavaScript Rounding Errors in Financial Applications - Robin Wieruch](https://www.robinwieruch.de/javascript-rounding-errors/) -- MEDIUM confidence
- [GitHub Pages SPA routing - community discussion #64096](https://github.com/orgs/community/discussions/64096) -- HIGH confidence (oficjalne forum)
- [Vite Static Deploy docs](https://vite.dev/guide/static-deploy) -- HIGH confidence (oficjalna dokumentacja)
- [Supabase RLS docs](https://supabase.com/docs/guides/database/postgres/row-level-security) -- HIGH confidence (oficjalna dokumentacja)
- [Supabase API Security docs](https://supabase.com/docs/guides/api/securing-your-api) -- HIGH confidence
- [React Hook Form multi-step discussion #4028](https://github.com/orgs/react-hook-form/discussions/4028) -- HIGH confidence
- [Common i18n Mistakes in React - InfiniteJS](https://infinitejs.com/posts/common-mistakes-i18n-react) -- MEDIUM confidence
- [jsPDF GitHub repo - font limitations](https://github.com/parallax/jsPDF) -- HIGH confidence
- [Glassmorphism Performance Guide 2025](https://playground.halfaccessible.com/blog/glassmorphism-design-trend-implementation-guide) -- MEDIUM confidence
- [Framer Motion AnimatePresence memory leak - Issue #625](https://github.com/framer/motion/issues/625) -- HIGH confidence (oficjalne issues)
- [Supabase Auth session deadlock - Discussion #37076](https://github.com/orgs/supabase/discussions/37076) -- HIGH confidence
- [Dark Mode Flash (FOUC) - Josh W. Comeau](https://www.joshwcomeau.com/react/dark-mode/) -- MEDIUM confidence
- [Intl.NumberFormat - MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat) -- HIGH confidence

---
*Pitfalls research for: Kalkulator kosztow remontu (React SPA)*
*Researched: 2026-02-22*
