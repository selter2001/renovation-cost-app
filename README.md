# RenoCost - Kalkulator Kosztow Remontu

[**Otwórz aplikację**](https://selter2001.github.io/renovation-cost-app/)

Kalkulator kosztów remontu mieszkania. Dodaj pomieszczenia, podaj wymiary, wybierz prace remontowe i otrzymaj szczegółową wycenę z możliwością eksportu do PDF.

## Zrzuty ekranu

### Strona główna

| Tryb jasny | Tryb ciemny |
|:---:|:---:|
| ![Strona główna - jasny](docs/screenshots/02-home-light.png) | ![Strona główna - ciemny](docs/screenshots/01-home-dark.png) |

### Krok 1 — Pomieszczenia

| Tryb jasny | Tryb ciemny |
|:---:|:---:|
| ![Pomieszczenia - jasny](docs/screenshots/03-rooms-light.png) | ![Pomieszczenia - ciemny](docs/screenshots/04-rooms-dark.png) |

### Krok 2 — Wymiary

| Tryb jasny | Tryb ciemny |
|:---:|:---:|
| ![Wymiary - jasny](docs/screenshots/06-dimensions-light.png) | ![Wymiary - ciemny](docs/screenshots/05-dimensions-dark.png) |

### Krok 3 — Prace remontowe

| Tryb jasny | Tryb ciemny |
|:---:|:---:|
| ![Prace - jasny](docs/screenshots/08-works-light.png) | ![Prace - ciemny](docs/screenshots/10-works-detail-dark.png) |

| Własne prace (jasny) | Własne prace (ciemny) |
|:---:|:---:|
| ![Własne prace - jasny](docs/screenshots/08-works-light.png) | ![Własne prace - ciemny](docs/screenshots/09-works-custom-dark.png) |

### Krok 4 — Podsumowanie i eksport PDF

| Tryb jasny | Tryb ciemny |
|:---:|:---:|
| ![Podsumowanie - jasny](docs/screenshots/13-summary-light.png) | ![Podsumowanie - ciemny](docs/screenshots/11-summary-dark.png) |
| ![PDF - jasny](docs/screenshots/14-pdf-light.png) | ![PDF - ciemny](docs/screenshots/12-pdf-dark.png) |

## Funkcje

- Kreator krok po kroku: pomieszczenia, wymiary, prace, podsumowanie
- 7 typów pomieszczeń (kuchnia, łazienka, salon, sypialnia, korytarz, biuro, inne)
- Predefiniowane prace remontowe z automatycznym obliczaniem ilości
- Własne prace remontowe
- Obliczanie netto, VAT i brutto
- Eksport do PDF (format standardowy i tabelaryczny)
- Tryb jasny / ciemny
- Polski i angielski interfejs

## Technologie

- React 19 + TypeScript
- Vite
- Tailwind CSS v4
- Zustand (zarządzanie stanem)
- @react-pdf/renderer (generowanie PDF)
- i18next (internacjonalizacja)
- GitHub Pages (hosting)

## Uruchomienie lokalne

```bash
pnpm install
pnpm dev
```

## Autor

Wojciech Olszak

## Licencja

[MIT](LICENSE)

---

# RenoCost - Renovation Cost Calculator

[**Open the app**](https://selter2001.github.io/renovation-cost-app/)

A renovation cost calculator for apartments. Add rooms, enter dimensions, select renovation works, and get a detailed estimate with PDF export.

## Screenshots

### Home page

| Light mode | Dark mode |
|:---:|:---:|
| ![Home - light](docs/screenshots/02-home-light.png) | ![Home - dark](docs/screenshots/01-home-dark.png) |

### Step 1 — Rooms

| Light mode | Dark mode |
|:---:|:---:|
| ![Rooms - light](docs/screenshots/03-rooms-light.png) | ![Rooms - dark](docs/screenshots/04-rooms-dark.png) |

### Step 2 — Dimensions

| Light mode | Dark mode |
|:---:|:---:|
| ![Dimensions - light](docs/screenshots/06-dimensions-light.png) | ![Dimensions - dark](docs/screenshots/05-dimensions-dark.png) |

### Step 3 — Renovation works

| Light mode | Dark mode |
|:---:|:---:|
| ![Works - light](docs/screenshots/08-works-light.png) | ![Works - dark](docs/screenshots/10-works-detail-dark.png) |

| Custom works (light) | Custom works (dark) |
|:---:|:---:|
| ![Custom works - light](docs/screenshots/08-works-light.png) | ![Custom works - dark](docs/screenshots/09-works-custom-dark.png) |

### Step 4 — Summary & PDF export

| Light mode | Dark mode |
|:---:|:---:|
| ![Summary - light](docs/screenshots/13-summary-light.png) | ![Summary - dark](docs/screenshots/11-summary-dark.png) |
| ![PDF - light](docs/screenshots/14-pdf-light.png) | ![PDF - dark](docs/screenshots/12-pdf-dark.png) |

## Features

- Step-by-step wizard: rooms, dimensions, works, summary
- 7 room types (kitchen, bathroom, living room, bedroom, hallway, office, other)
- Predefined renovation works with automatic quantity calculation
- Custom renovation works
- Net, VAT, and gross total calculation
- PDF export (standard and tabular format)
- Light / dark mode
- Polish and English interface

## Tech Stack

- React 19 + TypeScript
- Vite
- Tailwind CSS v4
- Zustand (state management)
- @react-pdf/renderer (PDF generation)
- i18next (internationalization)
- GitHub Pages (hosting)

## Running locally

```bash
pnpm install
pnpm dev
```

## Author

Wojciech Olszak

## License

[MIT](LICENSE)
