# Phase 2: Core Wizard + Kalkulator - Research

**Researched:** 2026-02-22
**Domain:** Multi-step wizard UI, Zustand state management, Framer Motion animations, @react-pdf/renderer PDF generation, financial arithmetic
**Confidence:** HIGH (core stack verified via official docs, GitHub releases, and WebFetch; React 19 compat issues traced to specific versions and fixes)

---

## Summary

Phase 2 buduje kompletny kalkulator remontowy: 4-krokowy wizard (pokoje -> wymiary -> prace -> podsumowanie), zarzadzanie stanem przez Zustand v5 z persystencja localStorage, animowane przejscia przez Motion (dawniej Framer Motion), plywajacy pasek kosztow z animowanym licznikiem i eksport PDF przez @react-pdf/renderer v4.3.2.

Krytyczne odkrycie: **@react-pdf/renderer v4.3.2 z @react-pdf/reconciler 2.0.0 jest oficjalnie kompatybilny z React 19** -- bloker z Phase 1 Research zostal rozwiazany przez wydanie z 29 grudnia 2025. Uzywaj v4.3.2 lub nowszego. Wczesniejsze wersje (4.1.x-4.1.4) posiadaly blad produkcyjny zwiazany z reconcilerem (`TypeError: Cannot read properties of null (reading 'props')`). Framer Motion zostal przemianowany na `motion` (pakiet npm: `motion`, import: `from "motion/react"`) -- framer-motion nadal dziala jako re-export ale nowa nazwa to standard.

Arytmetyka finansowa musi byc oparta na groszach (integer) -- nigdy na `float`. Standardowa biblioteka to `Intl.NumberFormat` dla formatowania PLN. Zustand v5.0.11 + Immer middleware jest optymalnym wzorcem dla zlozonych operacji na tablicach (dodawanie/usuwanie pokoi, wymiarow, prac). Zustand persist automatycznie zapisuje stan wizarda do localStorage z konfigurowalnym kluczem i strategia migracji wersji schematu.

**Rekomendacja wiodaca:** Zainstaluj `zustand` (v5) + `immer` + `motion` + `@react-pdf/renderer@^4.3.2` + `use-sound` jako rdzen Phase 2. Zustand z Immer i persist to kanoniczny stack dla zlozonego stanu aplikacji; Motion/AnimatePresence z `mode="wait"` dla przejsc wizarda; PDFDownloadLink dla jednoklinkowego eksportu PDF.

---

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `zustand` | `^5.0.11` | Globalny stan aplikacji (wizard, pokoje, kalkulacje) | Minimalistyczny API, brak boilerplate, natywny persist middleware, React 19 ready |
| `immer` | `^10.x` | Mutowalny zapis stanu zagniezdzonego (rooms array) | Eliminuje spread operators dla tablic/obiektow; immer middleware wbudowany w Zustand |
| `motion` | `^12.x` | Animacje (przejscia wizarda, hover, licznik) | Dawny Framer Motion; nowy pakiet npm `motion`, import `from "motion/react"` |
| `@react-pdf/renderer` | `^4.3.2` | Generowanie PDF po stronie przegladarki | React-first PDF z JSX komponentami; React 19 fix w v4.3.2+; PDFDownloadLink do downloadowania |
| `use-sound` | `^5.0.0` | Efekty dzwiekowe (dodanie pokoju, sukces) | +1kb gzip, async load Howler 9kb; peerDeps `react: >=16.8` -- React 19 OK |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| shadcn/ui `progress` | via `pnpm dlx shadcn@latest add progress` | Pasek postepu wizarda | Radix UI Progress primitive, `value={0-100}` |
| shadcn/ui `skeleton` | via `pnpm dlx shadcn@latest add skeleton` | Szkielety ladowania | Podczas async operacji (generowanie PDF) |
| shadcn/ui `card` | via `pnpm dlx shadcn@latest add card` | Karty pomieszczen | Interaktywne karty z ikonami Lucide |
| shadcn/ui `input` | via `pnpm dlx shadcn@latest add input` | Pola wymirow i cen | Numeryczne inputy z walidacja |
| shadcn/ui `switch` | via `pnpm dlx shadcn@latest add switch` | Toggle typow prac per pokoj | Wlacz/wylacz prace |
| shadcn/ui `badge` | via `pnpm dlx shadcn@latest add badge` | Etykiety typow prac | Status wizualny |
| shadcn/ui `dialog` | via `pnpm dlx shadcn@latest add dialog` | Modal edycji nazwy pokoju | Radix Dialog z focus trap |
| `Intl.NumberFormat` | wbudowany w przegladarke | Formatowanie PLN | Bez instalacji; `style: 'currency', currency: 'PLN', locale: 'pl-PL'` |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| `zustand` | React Context + useReducer | Context powoduje re-rendery calego drzewa; Zustand selektory sa efektywne; Context OK dla bardzo prostego stanu |
| `motion` | `react-spring` | react-spring physics-based; motion API bardziej deklaratywny i latwiejszy dla CSS-like transitions; motion ma AnimatePresence |
| `@react-pdf/renderer` | `jsPDF` + `html2canvas` | jsPDF popularne (4M downloads/tydzien vs 1.2M) ale nie React-native; wymaga imperacyjnego API; nie kontroluje typografii PDF |
| `immer` | reczne spread operators | Spread na glebakich obiektach (Room z walls[], works[]) szybko staje sie nieczytelny i podatny na bledy |
| `use-sound` | Web Audio API wrecznie | Web Audio API wymaga obslugi AudioContext, autoplay policy, iOS Safari quirks; use-sound to opakowuje |

**Installation:**
```bash
pnpm add zustand immer motion @react-pdf/renderer use-sound
pnpm dlx shadcn@latest add progress skeleton card input switch badge dialog
```

---

## Architecture Patterns

### Recommended Project Structure

```
src/
├── stores/
│   ├── wizard-store.ts       # Zustand: currentStep, rooms, globalWorkPrices
│   └── ui-store.ts           # Zustand: floatingSummaryOpen, vatRate
├── features/
│   ├── wizard/
│   │   ├── WizardPage.tsx    # Kontroler kroku (router krokow)
│   │   ├── WizardProgress.tsx # Pasek postepu
│   │   └── WizardNav.tsx      # Przyciski Wstecz/Dalej
│   ├── rooms/
│   │   ├── RoomsStep.tsx      # Krok 1: wybor pokoi
│   │   ├── RoomCard.tsx       # Karta pokoju z ikona
│   │   └── RoomTypeGrid.tsx   # Grid kart do wyboru
│   ├── dimensions/
│   │   ├── DimensionsStep.tsx # Krok 2: wymiary per pokoj
│   │   └── DimensionInput.tsx # Pojedynczy input z jednostka
│   ├── works/
│   │   ├── WorksStep.tsx      # Krok 3: typy prac per pokoj
│   │   └── WorkRow.tsx        # Wiersz pracy z toggle i cena
│   ├── summary/
│   │   ├── SummaryStep.tsx    # Krok 4: podsumowanie
│   │   ├── FloatingSummary.tsx # Plywajacy pasek kosztow
│   │   └── AnimatedCounter.tsx # Licznik z spring animation
│   └── pdf/
│       ├── PdfDocument.tsx     # @react-pdf/renderer dokument
│       ├── PdfStandard.tsx     # Format standardowy
│       ├── PdfTabular.tsx      # Format tabelaryczny
│       └── pdf-fonts.ts        # Font.register (Roboto TTF)
├── types/
│   └── wizard.ts              # Room, Dimension, WorkType, Estimate typy
├── lib/
│   ├── calc.ts                # Kalkulacje kosztow (integer groszowy)
│   └── format.ts              # Intl.NumberFormat PLN
└── components/ui/             # shadcn komponenty (juz istnieja)
```

### Pattern 1: Zustand Store z Immer i Persist (TypeScript)

**Co:** Centralny store dla calego stanu wizarda -- kroki, pokoje, wymiary, typy prac -- z automatycznym zapisem do localStorage i migracj schematu.
**Kiedy uzywac:** Zawsze dla stanu przechodzacego przez wiele krokow wizarda -- persist zapewnia ze odswiezenie strony nie resetuje pracy uzytkownika.

```typescript
// Source: https://github.com/pmndrs/zustand/blob/main/docs/guides/beginner-typescript.md
// Source: https://github.com/pmndrs/zustand/blob/main/docs/integrations/immer-middleware.md
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

export type RoomType = 'kitchen' | 'bathroom' | 'living' | 'bedroom' | 'hallway' | 'office' | 'other'

export interface Room {
  id: string
  type: RoomType
  name: string
  dimensions: {
    walls: number[]    // m2, wiele scian
    ceilings: number[] // m2
    floor: number      // m2
    corners: number    // mb narozniki
    grooves: number    // mb bruzdy
    acrylic: number    // mb akrylowanie
  }
  works: {
    [workId: string]: {
      enabled: boolean
      unitPrice: number // groszach (integers)
    }
  }
}

export interface WizardState {
  currentStep: number
  rooms: Room[]
  vatRate: 8 | 23
  // Actions
  setStep: (step: number) => void
  addRoom: (type: RoomType) => void
  removeRoom: (id: string) => void
  updateRoomName: (id: string, name: string) => void
  updateDimension: (roomId: string, key: keyof Room['dimensions'], value: number | number[]) => void
  toggleWork: (roomId: string, workId: string) => void
  setWorkPrice: (roomId: string, workId: string, priceInGrosze: number) => void
  setVatRate: (rate: 8 | 23) => void
  resetWizard: () => void
}

export const useWizardStore = create<WizardState>()(
  persist(
    immer((set) => ({
      currentStep: 0,
      rooms: [],
      vatRate: 23,
      setStep: (step) => set((state) => { state.currentStep = step }),
      addRoom: (type) => set((state) => {
        state.rooms.push({
          id: crypto.randomUUID(),
          type,
          name: type, // i18n translation applied in UI
          dimensions: { walls: [], ceilings: [], floor: 0, corners: 0, grooves: 0, acrylic: 0 },
          works: {},
        })
      }),
      removeRoom: (id) => set((state) => {
        state.rooms = state.rooms.filter(r => r.id !== id)
      }),
      updateRoomName: (id, name) => set((state) => {
        const room = state.rooms.find(r => r.id === id)
        if (room) room.name = name
      }),
      updateDimension: (roomId, key, value) => set((state) => {
        const room = state.rooms.find(r => r.id === roomId)
        if (room) (room.dimensions as Record<string, unknown>)[key] = value
      }),
      toggleWork: (roomId, workId) => set((state) => {
        const room = state.rooms.find(r => r.id === roomId)
        if (room) {
          if (!room.works[workId]) room.works[workId] = { enabled: false, unitPrice: 0 }
          room.works[workId].enabled = !room.works[workId].enabled
        }
      }),
      setWorkPrice: (roomId, workId, priceInGrosze) => set((state) => {
        const room = state.rooms.find(r => r.id === roomId)
        if (room) {
          if (!room.works[workId]) room.works[workId] = { enabled: true, unitPrice: 0 }
          room.works[workId].unitPrice = priceInGrosze
        }
      }),
      setVatRate: (rate) => set((state) => { state.vatRate = rate }),
      resetWizard: () => set((state) => {
        state.currentStep = 0
        state.rooms = []
      }),
    })),
    {
      name: 'renocost-wizard-v1',  // localStorage key
      storage: createJSONStorage(() => localStorage),
      version: 1,
      // Partialize: nie zapisuj currentStep -- zaczyna od nowa
      partialize: (state) => ({
        rooms: state.rooms,
        vatRate: state.vatRate,
      }),
    }
  )
)
```

### Pattern 2: AnimatePresence dla przejsc wizarda

**Co:** Animowane slajdowanie miedzy krokami wizarda przy uzyciu Motion `AnimatePresence` z `mode="wait"`. Klucz (key) zmienia sie z krokiem -- powoduje remount i animacje.
**Kiedy uzywac:** Zawsze dla wielokrokowych flow gdzie chcemy efekt "strony".

```typescript
// Source: https://motion.dev/docs/react-animation (WebSearch verified)
// Pakiet: motion (nie framer-motion); import z "motion/react"
import { AnimatePresence, motion } from 'motion/react'

interface WizardPageProps {
  currentStep: number
  direction: 'forward' | 'backward'
}

const variants = {
  enter: (direction: string) => ({
    x: direction === 'forward' ? 40 : -40,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: string) => ({
    x: direction === 'forward' ? -40 : 40,
    opacity: 0,
  }),
}

export function WizardPage({ currentStep, direction }: WizardPageProps) {
  return (
    <AnimatePresence mode="wait" custom={direction}>
      <motion.div
        key={currentStep}
        custom={direction}
        variants={variants}
        initial="enter"
        animate="center"
        exit="exit"
        transition={{ duration: 0.25, ease: 'easeInOut' }}
      >
        {currentStep === 0 && <RoomsStep />}
        {currentStep === 1 && <DimensionsStep />}
        {currentStep === 2 && <WorksStep />}
        {currentStep === 3 && <SummaryStep />}
      </motion.div>
    </AnimatePresence>
  )
}
```

### Pattern 3: Animowany licznik kosztow (Motion spring)

**Co:** Plywajacy pasek podsumowania z animowanym licznikiem PLN. Wartosc animuje sie "do" nowej sumy zamiast skakac.
**Kiedy uzywac:** Dla reaktywnego UI pokazujacego koszty w czasie rzeczywistym (CALC-06).

```typescript
// Source: https://buildui.com/recipes/animated-number (MEDIUM confidence -- community pattern)
// Source: https://motion.dev/docs/react-motion-value (WebSearch verified)
import { useSpring, useTransform, motion } from 'motion/react'
import { useEffect } from 'react'

interface AnimatedCounterProps {
  value: number // wartosc w groszach
  locale?: string
}

export function AnimatedCounter({ value, locale = 'pl-PL' }: AnimatedCounterProps) {
  const spring = useSpring(value, { mass: 0.8, stiffness: 75, damping: 15 })

  useEffect(() => {
    spring.set(value)
  }, [spring, value])

  const display = useTransform(spring, (v) =>
    new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: 'PLN',
      minimumFractionDigits: 2,
    }).format(v / 100) // konwersja z groszy do PLN
  )

  return <motion.span>{display}</motion.span>
}
```

### Pattern 4: Kalkulacje finansowe na groszach (integer)

**Co:** Wszystkie kwoty przechowywane jako integer (grosze). Formatowanie przez `Intl.NumberFormat`.
**Dlaczego:** `0.1 + 0.2 !== 0.3` w JavaScript float. Dla sum remontowych (potencjalnie 50000+ PLN) bledy zaokraglen sa niedopuszczalne.

```typescript
// Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat
// lib/calc.ts

/** Wszystkie ceny w groszach (1 PLN = 100 groszy) */
export function calcWorkCost(quantityM2: number, unitPriceGrosze: number): number {
  // round-half-up aby uniknac drift
  return Math.round(quantityM2 * unitPriceGrosze)
}

export function calcRoomTotal(room: Room): number {
  return Object.values(room.works).reduce((sum, work) => {
    if (!work.enabled) return sum
    const qty = getWorkQuantity(room, work) // z wymiarow pokoju
    return sum + calcWorkCost(qty, work.unitPrice)
  }, 0)
}

export function calcGrossFromNet(netGrosze: number, vatRate: 8 | 23): number {
  return Math.round(netGrosze * (1 + vatRate / 100))
}

/** Formatowanie do wyswietlania */
export function formatPLN(grosze: number, locale = 'pl-PL'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'PLN',
    minimumFractionDigits: 2,
  }).format(grosze / 100)
}
```

### Pattern 5: @react-pdf/renderer z polskim fontem

**Co:** Rejestracja fontu TTF z pelna obsluga polskich znakow. Uzyj Roboto lub Lato z Google Fonts CDN (URL do TTF).
**Dlaczego:** PDF standard fonts (Helvetica, Times) nie zawieraja polskich znakow. Wymagana jest rejestracja wlasnego fontu.
**Krytyczne:** Uzyj TTF (nie WOFF2). Plik fontu musi zawierac Latin Extended subset.

```typescript
// Source: https://react-pdf.org/fonts (WebFetch verified)
// Source: https://github.com/diegomura/react-pdf/issues/2112 (WebFetch verified)
// pdf-fonts.ts -- wywolaj JEDEN raz przed renderem dokumentu
import { Font } from '@react-pdf/renderer'

Font.register({
  family: 'Roboto',
  fonts: [
    {
      src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf',
      fontWeight: 300,
    },
    {
      src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf',
      fontWeight: 400,
    },
    {
      src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-medium-webfont.ttf',
      fontWeight: 500,
    },
    {
      src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf',
      fontWeight: 700,
    },
  ],
})
```

```typescript
// PdfDocument.tsx -- przyklad podstawowej struktury
// Source: https://react-pdf.org/advanced (WebFetch verified)
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer'
import './pdf-fonts'  // side-effect: rejestruje fonty

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Roboto',
    fontSize: 10,
    padding: 40,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 18,
    fontWeight: 700,
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottom: '1pt solid #e2e8f0',
    paddingVertical: 4,
  },
})

function EstimatePdf({ rooms, vatRate }: EstimateData) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Wycena remontu</Text>
        {rooms.map(room => (
          <View key={room.id}>
            <Text>{room.name}</Text>
            {/* ... wiersze prac */}
          </View>
        ))}
      </Page>
    </Document>
  )
}

// Komponent z przyciskiem download (renderuje PDF lazy)
export function PdfDownloadButton({ data }: { data: EstimateData }) {
  return (
    <PDFDownloadLink
      document={<EstimatePdf {...data} />}
      fileName={`wycena-${Date.now()}.pdf`}
    >
      {({ loading }) =>
        loading ? 'Generowanie PDF...' : 'Pobierz PDF'
      }
    </PDFDownloadLink>
  )
}
```

### Pattern 6: Middleware ordering w Zustand (krytyczne)

**Co:** Kolejnosc opakowan middleware ma znaczenie. Niepoprawna kolejnosc powoduje utrate typow TypeScript lub niepoprawne zachowanie.
**Zasada:** `devtools` na zewnatrz, `persist` posrodku, `immer` wewnatrz.

```typescript
// Source: WebSearch z oficjalnych docs Zustand
// POPRAWNIE:
create<State>()(
  devtools(
    persist(
      immer((set) => ({ ... })),
      { name: 'store-key' }
    )
  )
)

// NIEPOPRAWNIE (devtools straci typy gdy immer mutuje setState):
create<State>()(
  immer(
    devtools(...)  // ZLAB
  )
)
```

### Anti-Patterns to Avoid

- **Float do kwot pienieznych:** `1500.5 * 23 / 100` zwraca `345.115` (IEEE 754). Zawsze przechowuj w groszach (integer), konwertuj tylko do wyswietlania.
- **Stan wizarda w React state (useState):** Odswiezenie strony resetuje prace uzytkownika. Zawsze Zustand + persist.
- **`framer-motion` zamiast `motion`:** Stary pakiet dziala ale nowa nazwa to `motion`; import z `"motion/react"`. Uzywaj nowej nazwy w nowych plikach.
- **@react-pdf/renderer < 4.3.2 z React 19:** Powoduje `TypeError: Cannot read properties of null (reading 'props')` w produkcji. Pinuj do `^4.3.2`.
- **WOFF2 font w react-pdf:** Tylko TTF i WOFF (nie WOFF2). Google Fonts API domyslnie zwraca WOFF2 dla nowoczesnych przegladarek -- uzyj bezposredniego URL do pliku TTF.
- **Font.register() wewnatrz komponentu:** Rejestruj raz na poziomie modulu (side-effect import), nie w ciele komponentu. Wielokrotne wywolanie moze powodowac glitche.
- **AnimatePresence bez unikalnego `key`:** Bez `key={currentStep}` React nie wykrywa zmiany dziecka i exit animation nie odpala.
- **Obliczenia ilosci pracy w store:** Ilosci (m2 scian, mb naroznikow) obliczaj w selektorach/memoized functions, nie w store. Store trzyma surowe wymiary.

---

## Don't Hand-Roll

| Problem | Nie Buduj | Uzyj Zamiast | Dlaczego |
|---------|-----------|--------------|----------|
| Globalny stan z persystencja | Custom React Context + localStorage sync | `zustand` + `persist` middleware | Edge case'y: hydration, partial rehydration, schema migration, SSR -- Zustand obsluguje to wszystko |
| Animacje wejscia/wyjscia elementow | CSS transitions + conditional rendering | `motion` `AnimatePresence` | React usuwa element z DOM natychmiast; AnimatePresence czeka na zakonczenie exit animation |
| Animowany licznik pieniezny | setInterval + useState count | `useSpring` + `useTransform` z `motion` | Spring physics dla naturalnego ruchu; nie blokuje renderowania; |
| Mutowalny update zagniezdzonej tablicy | `[...rooms.slice(0, idx), newRoom, ...rooms.slice(idx+1)]` | `immer` middleware | Jeden poziom glabiej i spread staje sie nieczytelny; Immer zapewnia immutabilnosc przez proxy |
| Generowanie PDF z polskim tekstem | Canvas screenshot / jsPDF tekst | `@react-pdf/renderer` | jsPDF nie obslugtuje poprawnej typografii; react-pdf daje pelna kontrole layoutu przez JSX i FlexBox |
| Formatowanie walut | Wlasna funkcja `(num).toFixed(2) + ' zł'` | `Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'PLN' })` | Wbudowany w przegladarke; obslugtuje locale (spacja jako separator tysiecy w pl-PL, przecinek dziesizetny) |
| Efekty dzwiekowe | Web Audio API / AudioContext | `use-sound` | Web Audio wymaga obslugi autoplay policy, iOS Safari bugs, AudioContext resume po interakcji uzytkownika |

**Key insight:** Zustand + Immer + persist to trio, ktore eliminuje caly boilerplate stanu globalnego. Nie rozdzielaj ich -- razem stanowia kanoniczny wzorzec dla tej klasy problemu.

---

## Common Pitfalls

### Pitfall 1: @react-pdf/renderer < 4.3.2 z React 19 -- crash produkcyjny

**Co idzie zle:** PDF nie generuje sie w produkcji (Vercel/GitHub Pages). `TypeError: Cannot read properties of null (reading 'props')` lub biala strona przy probie uzycia PDFDownloadLink.
**Dlaczego:** @react-pdf/reconciler < 2.0.0 jest niekompatybilny z React 19 -- reconciler API zmienilos sie. Blad zostal naprawiony w wydaniu z 29 grudnia 2025 (`@react-pdf/reconciler@2.0.0`).
**Jak uniknac:** Zawsze instaluj `@react-pdf/renderer@^4.3.2`. Sprawdz `node_modules/@react-pdf/renderer/package.json` po instalacji.
**Warning signs:** PDF dziala lokalnie (React 18 dev build) ale crash w produkcji; blad reconciler w stack trace.

### Pitfall 2: Font WOFF2 zamiast TTF w react-pdf

**Co idzie zle:** Polskie znaki (a, e, o, z, c, s, l, n, z z ogonkami i kreskami) pojawiaja sie jako prostokaty lub sa pomijane.
**Dlaczego:** react-pdf obsluguje tylko TTF i WOFF (nie WOFF2). Google Fonts URL `fonts.googleapis.com` zwraca WOFF2 dla nowoczesnych przegladarek. Nawet `fontsource` paczki zawieraja WOFF2.
**Jak uniknac:** Uzyj bezposredniego URL do pliku `.ttf` z cdnjs.cloudflare.com lub przechowaj plik lokalnie w `public/fonts/`. Przetestuj przez sprawdzenie znakow "ą ę ó ź ć ś ł ń ż" w wygenerowanym PDF.
**Warning signs:** Prostokaty / puste miejsca zamiast polskich znakow w PDF.

### Pitfall 3: Middleware Zustand w zlej kolejnosci

**Co idzie zle:** TypeScript gubi typy akcji (autocomplete nie dziala). W runtime devtools moze nie wychwytywac poprawnie mutacji.
**Dlaczego:** `immer` mutuje `setState` -- jezeli `devtools` jest wewnatrz, traci referencje do oryginalnego `setState`.
**Jak uniknac:** Zawsze: `devtools(persist(immer(...)))`. Patrz Pattern 6 powyzej.
**Warning signs:** TypeScript error `Property 'setStep' does not exist on type StoreApi`.

### Pitfall 4: Float arithmetic dla sum

**Co idzie zle:** Suma 10 prac po 12.50 zl/m2 x 8.3 m2 daje bledny wynik o kilka groszy. Przy duzych wycenach bledy kumuluja sie.
**Dlaczego:** IEEE 754 binary float: `12.5 * 8.3 = 103.75000000000001`.
**Jak uniknac:** Ceny w groszach (integer). Input uzytkownika `"12.50"` -> `Math.round(12.50 * 100) = 1250` groszy. Kalkulacje na groszach. Wyswietlanie: `1250 / 100 = 12.5` -> Intl.NumberFormat.
**Warning signs:** Wyswietlane sumy roznia sie o 1-2 grosze miedzy elementami a totalem.

### Pitfall 5: AnimatePresence bez key na dziecku

**Co idzie zle:** Przejscia wizarda nie animuja sie -- kroki pojawiaja sie/znikaja natychmiast.
**Dlaczego:** AnimatePresence wykrywa zmiany dzieci przez `key`. Jezeli key jest stale `"step"`, React widzi ze element nie zostal usuniety -- exit animation nie odpala.
**Jak uniknac:** `<motion.div key={currentStep}>` -- zmiana key = nowy element = animacja.
**Warning signs:** Brak animacji przejsc mimo poprawnej konfiguracji variants.

### Pitfall 6: Zustand persist rehydracja i stale closures

**Co idzie zle:** Po odswiezeniu strony store rehydruje sie z localStorage ale akcje uzywaja starych wartosci stanu.
**Dlaczego:** Zustand persist domyslnie rehydruje synchronicznie. Jezeli komponent uzywa stanu przed zakonczeniem rehydracji (bardzo rzadki edge case z async storage), moze dostac domyslne wartosci.
**Jak uniknac:** Uzyj `createJSONStorage(() => localStorage)` (synchroniczny) -- nie ma problemu. Problem istnieje tylko z AsyncStorage (React Native).
**Warning signs:** Store zawiera domyslne wartosci mimo zapelnionych danych w localStorage.

### Pitfall 7: use-sound i autoplay policy przegladarki

**Co idzie zle:** Dzwieki nie odtwarzaja sie przy pierwszym kliknieciu, szczegolnie na mobile.
**Dlaczego:** Przegladarki wymagaja ze AudioContext zostal uruchomiony przez "user gesture". use-sound przez Howler.js obsluguje to, ale AudioContext musi zostac zainicjalizowany po interakcji.
**Jak uniknac:** Nie wywoluj dzwiekow na `useEffect` przy mount. Wywoluj tylko w reakcji na klikniecia (`onClick`, `onKeyDown`). use-sound lazy-loaduje Howler wiec pierwsze klikniecie moze byc opoznione o ~100ms.
**Warning signs:** Dzwieki dzialaja w Chrome desktop ale nie na iOS Safari.

---

## Code Examples

Verified patterns from official sources:

### Selektory Zustand (memoized, bez re-renderow)

```typescript
// Source: https://zustand.docs.pmnd.rs/guides/beginner-typescript (WebFetch verified)
// DOBRZE: selektor zwraca prymityw -- re-render tylko gdy wartosc sie zmieni
const currentStep = useWizardStore((state) => state.currentStep)
const rooms = useWizardStore((state) => state.rooms)

// ZLE: selektor zwraca nowy obiekt przy kazdym wywolaniu -- nieskonczone re-rendery
const { currentStep, rooms } = useWizardStore((state) => ({
  currentStep: state.currentStep,
  rooms: state.rooms,
}))
// Fix dla wielu wartosci: uzyj useShallow z zustand/react/shallow
import { useShallow } from 'zustand/react/shallow'
const { currentStep, rooms } = useWizardStore(
  useShallow((state) => ({ currentStep: state.currentStep, rooms: state.rooms }))
)
```

### shadcn/ui Progress dla paska wizarda

```typescript
// Source: https://ui.shadcn.com/docs/components/radix/progress (WebFetch verified)
import { Progress } from '@/components/ui/progress'

const STEPS = ['Pomieszczenia', 'Wymiary', 'Prace', 'Podsumowanie']

function WizardProgress({ currentStep }: { currentStep: number }) {
  const progress = ((currentStep + 1) / STEPS.length) * 100
  return (
    <div className="mb-8">
      <Progress value={progress} className="h-2" />
      <div className="mt-2 flex justify-between text-sm text-muted-foreground">
        {STEPS.map((step, i) => (
          <span key={step} className={i === currentStep ? 'text-foreground font-medium' : ''}>
            {step}
          </span>
        ))}
      </div>
    </div>
  )
}
```

### PDFDownloadLink (jednoklinkowy eksport)

```typescript
// Source: https://react-pdf.org/advanced (WebFetch verified)
import { PDFDownloadLink } from '@react-pdf/renderer'
import { Button } from '@/components/ui/button'

function ExportPdfButton({ estimate, language }: Props) {
  return (
    <PDFDownloadLink
      document={<EstimatePdf estimate={estimate} language={language} />}
      fileName={`wycena-${new Date().toISOString().slice(0,10)}.pdf`}
    >
      {({ loading, error }) => (
        <Button disabled={loading || !!error} variant="default">
          {loading ? 'Generowanie...' : error ? 'Blad PDF' : 'Pobierz PDF'}
        </Button>
      )}
    </PDFDownloadLink>
  )
}
```

### Plywajacy pasek kosztow (sticky bottom)

```typescript
// Wzorzec: fixed bottom bar z glassmorphism
// Source: Tailwind CSS docs (backdrop-blur), Motion docs (motion.div)
import { motion } from 'motion/react'

function FloatingSummary({ netGrosze, vatRate }: Props) {
  const gross = calcGrossFromNet(netGrosze, vatRate)

  return (
    <motion.div
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-border/50 bg-background/80 backdrop-blur-lg px-4 py-3"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex gap-6 text-sm">
          <span>Netto: <AnimatedCounter value={netGrosze} /></span>
          <span>VAT {vatRate}%: <AnimatedCounter value={gross - netGrosze} /></span>
          <span className="font-bold text-base">Brutto: <AnimatedCounter value={gross} /></span>
        </div>
        <ExportPdfButton />
      </div>
    </motion.div>
  )
}
```

### Obliczanie sumy powierzchni per pokoj (DIM-07)

```typescript
// lib/calc.ts -- czysta funkcja, latwa do testowania
export function calcRoomNetArea(room: Room): number {
  const wallsTotal = room.dimensions.walls.reduce((s, w) => s + w, 0)
  const ceilingsTotal = room.dimensions.ceilings.reduce((s, c) => s + c, 0)
  return wallsTotal + ceilingsTotal // m2 netto
}

export function getWorkQuantity(room: Room, workId: string): number {
  switch (workId) {
    case 'painting':
    case 'priming':
    case 'plastering':
      return calcRoomNetArea(room)
    case 'floor-protection':
      return room.dimensions.floor
    case 'corners':
      return room.dimensions.corners
    case 'grooves':
      return room.dimensions.grooves
    case 'acrylic':
      return room.dimensions.acrylic
    default:
      return 0
  }
}
```

---

## State of the Art

| Stare Podejscie | Aktualne Podejscie | Kiedy Zmienione | Wplyw |
|-----------------|-------------------|-----------------|-------|
| `import from 'framer-motion'` | `import from 'motion/react'` | Rebranding 2024-2025; pakiet npm: `motion` | framer-motion dziala jako re-export; nowe projekty uzywaja `motion` |
| `@react-pdf/renderer@4.1.x` z React 19 | `@react-pdf/renderer@^4.3.2` | Grudzien 2025 (reconciler 2.0.0) | Naprawia crash produkcyjny; wymagany upgrade |
| Zustand v4 | Zustand v5.0.11 | Koniec 2024; v5.0.10 styczen 2026 fix | Usuniety use-sync-external-store (natywne useSyncExternalStore); min React 18 |
| `zustand/middleware/immer` v4 | `zustand/middleware/immer` v5 (ten sam import) | v5 | Import sciezka taka sama; typy ulepszone |
| `motion.AnimateNumber` | `useSpring` + `useTransform` pattern | Dostepny w motion v11+ (2025) | AnimateNumber komponent dostepny ale useSpring daje wiecej kontroli nad spring params |

**Deprecated/outdated:**
- `framer-motion` pakiet: nie deprecated, ale nowy standard to `motion`. Oba dzialaja.
- `@react-pdf/renderer` < 4.1.0: brak React 19; < 4.3.2: crash produkcyjny z React 19.
- Zustand v4: nie wspiera React 19 w pelni (use-sync-external-store shim). Uzywaj v5.

---

## Open Questions

1. **Czy wlasna czcionka (lokalny TTF) czy CDN URL dla react-pdf?**
   - Co wiemy: CDN URL dziala (cdnjs.cloudflare.com); lokalne TTF w `public/fonts/` tez dziala; CDN moze byc nieosiagalny offline lub w CI
   - Co jest niejasne: Czy aplikacja ma dzialac offline? Czy CI/CD ma dostep do CDN?
   - Rekomendacja: Podczas PoC sprawdz czy CDN URL dziala. Jezeli nie -- skopiuj TTF do `public/fonts/Roboto-Regular.ttf` i uzyj absolutnego URL `/fonts/Roboto-Regular.ttf`. PoC wymagany na starcie fazy.

2. **Szczegoly polskich znakow w Roboto z cdnjs**
   - Co wiemy: Roboto z cdnjs.cloudflare.com jest potwierdzony jako dzialajacy dla podobnych znakow (Cyrylica, Latin Extended) w issue #2112
   - Co jest niejasne: Czy konkretna wersja Roboto z cdnjs zawiera pelny Latin Extended subset (ą ę ó ź ć ś ł ń ż)?
   - Rekomendacja: Wygeneruj testowy PDF z pelnym zestawem polskich znakow jako pierwsze zadanie w bloku PDF.

3. **use-sound i React 19 -- czy wymaga `--legacy-peer-deps`?**
   - Co wiemy: `use-sound@5.0.0` ma `peerDependencies: { "react": ">=16.8" }` i `devDependencies: { "react": "^19.0.0" }` -- oznacza ze jest testowane z React 19
   - Co jest niejasne: Czy npm/pnpm moze pokazac ostrzezenia o peer deps przy instalacji
   - Rekomendacja: Zainstaluj i sprawdz. Jezeli ostrzezenia -- `pnpm add use-sound --legacy-peer-deps`. Prawdopodobnie nie bedzie problemu.

4. **Konfiguracja VAT jako globalna vs per-pokoj**
   - Co wiemy: Wymaganie CALC-04 mowi `Uzytkownik moze wybrac stawke VAT: 8% lub 23%` bez precyzowania granularnosci
   - Co jest niejasne: Czy VAT jest jeden dla calej wyceny czy per pokoj/praca?
   - Rekomendacja: Implementuj jako globalne (jedno pole `vatRate: 8 | 23` na poziomie wyceny). Prostszy UX; profesjonalne wyceny uzywaaja jednej stawki VAT.

5. **Plik dzwiekow dla use-sound**
   - Co wiemy: use-sound wczytuje plik audio (mp3/ogg/wav) z URL lub `public/`
   - Co jest niejasne: Skad wzisc pliki dzwiekow? Royalty-free?
   - Rekomendacja: Uzyj Freesound.org (CC0) lub wbudowanych dzwiekow OS przez Web Audio API bezposrednio. Alternatywnie: https://mixkit.co/free-sound-effects/click/ -- darmowe, proste klikniecia.

---

## Sources

### Primary (HIGH confidence)

- https://github.com/pmndrs/zustand/blob/main/docs/guides/beginner-typescript.md -- TypeScript API Zustand v5 (WebFetch verified)
- https://github.com/pmndrs/zustand/blob/main/docs/integrations/immer-middleware.md -- Immer middleware (WebFetch verified)
- https://react-pdf.org/fonts -- Font.register API (WebFetch verified)
- https://react-pdf.org/advanced -- usePDF hook i PDFDownloadLink API (WebFetch verified)
- https://react-pdf.org/compatibility -- React 19 support oficjalny (WebFetch verified)
- https://react-pdf.org/styling -- StyleSheet API (WebFetch verified)
- https://github.com/diegomura/react-pdf/releases -- wersje i React 19 reconciler fix (WebFetch verified)
- https://github.com/diegomura/react-pdf/issues/3223 -- status React 19 compat issue -- RESOLVED w 4.3.2 (WebFetch verified)
- https://ui.shadcn.com/docs/components/radix/progress -- Progress API (WebFetch verified)
- https://ui.shadcn.com/docs/components/radix/skeleton -- Skeleton API (WebFetch verified)
- https://github.com/joshwcomeau/use-sound/blob/main/package.json -- peerDeps React 19 OK (WebFetch verified)
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat -- PLN formatting (authoritative)

### Secondary (MEDIUM confidence)

- WebSearch "Zustand v5 persist middleware TypeScript partialize" -- zgodny z docs, wiele zrodel
- WebSearch "framer-motion motion npm AnimatePresence mode wait" -- potwierdzone przez motion.dev docs
- WebSearch "react-pdf renderer Roboto font Polish characters" -- issue #2112 potwierdza dzialajacy URL CDN
- WebSearch "use-sound howler React 19" -- peerDeps potwierdzone przez package.json

### Tertiary (LOW confidence)

- buildui.com/recipes/animated-number -- wzorzec useSpring dla licznika, nieweryfkowany z oficjalnymi docs motion; zrodlo wiarygodne ale nie oficjalne
- cdnjs.cloudflare.com URL dla Roboto TTF -- wymaga weryfikacji PoC ze wszystkimi polskimi znakami
- Kolejnosc middleware devtools/persist/immer -- potwierdzona przez wiele zrodel community, zgodna z oficjalna dokumentacja; zaufaj ale weryfikuj

---

## Metadata

**Confidence breakdown:**
- Zustand v5 + TypeScript API: HIGH -- zweryfikowane przez oficjalne docs GitHub
- Immer middleware Zustand: HIGH -- oficjalne docs; wzorzec kanonicznie udokumentowany
- @react-pdf/renderer v4.3.2 + React 19: HIGH -- release notes + issue #3223 RESOLVED
- Font Polish characters (Roboto TTF CDN): MEDIUM -- issue #2112 potwierdza podejscie ale konkretny URL wymaga weryfikacji PoC
- Motion (AnimatePresence) wizard transitions: MEDIUM -- WebSearch z cross-reference do motion.dev; niedostepna pelna dokumentacja przez WebFetch (CSS-heavy strona)
- Finansowe kalkulacje (grosze): HIGH -- standard engineering; MDN Intl.NumberFormat oficjalny
- use-sound React 19: HIGH -- package.json weryfikuje peerDeps
- Szkielety / Progress shadcn: HIGH -- oficjalne docs zweryfikowane

**Research date:** 2026-02-22
**Valid until:** 2026-03-22 (30 dni) z wyjatkiem:
- @react-pdf/renderer: monitoruj wydania -- projekt aktywnie svilopowany, poprawki czeste
- `motion` pakiet (dawny framer-motion): sprawdz aktualny numer wersji przed instalacja (teraz ^12.x)
