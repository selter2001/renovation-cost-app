export type RoomType = 'kitchen' | 'bathroom' | 'living' | 'bedroom' | 'hallway' | 'office' | 'other'

// Predefiniowane typy pokoi z ikonami (Lucide icon names)
export const ROOM_TYPES: { type: RoomType; icon: string; labelKey: string }[] = [
  { type: 'kitchen', icon: 'CookingPot', labelKey: 'rooms.types.kitchen' },
  { type: 'bathroom', icon: 'Bath', labelKey: 'rooms.types.bathroom' },
  { type: 'living', icon: 'Sofa', labelKey: 'rooms.types.living' },
  { type: 'bedroom', icon: 'Bed', labelKey: 'rooms.types.bedroom' },
  { type: 'hallway', icon: 'DoorOpen', labelKey: 'rooms.types.hallway' },
  { type: 'office', icon: 'Monitor', labelKey: 'rooms.types.office' },
  { type: 'other', icon: 'LayoutGrid', labelKey: 'rooms.types.other' },
]

export type WorkUnit = 'm2' | 'mb' | 'szt'

export interface WorkType {
  id: string
  labelKey: string       // klucz i18n
  unit: WorkUnit
  dimensionKey: string   // klucz w Room.dimensions do automatycznego obliczania ilosci
}

// 7 predefiniowanych typow prac
export const PREDEFINED_WORKS: WorkType[] = [
  { id: 'painting', labelKey: 'works.types.painting', unit: 'm2', dimensionKey: 'netArea' },
  { id: 'priming', labelKey: 'works.types.priming', unit: 'm2', dimensionKey: 'netArea' },
  { id: 'plastering', labelKey: 'works.types.plastering', unit: 'm2', dimensionKey: 'netArea' },
  { id: 'floor-protection', labelKey: 'works.types.floorProtection', unit: 'm2', dimensionKey: 'floor' },
  { id: 'corners', labelKey: 'works.types.corners', unit: 'mb', dimensionKey: 'corners' },
  { id: 'grooves', labelKey: 'works.types.grooves', unit: 'mb', dimensionKey: 'grooves' },
  { id: 'acrylic', labelKey: 'works.types.acrylic', unit: 'mb', dimensionKey: 'acrylic' },
]

export interface CustomWork {
  id: string
  name: string           // nazwa wpisana przez uzytkownika (nie klucz i18n)
  unit: WorkUnit
  quantity: number       // ilosc wpisana recznie (custom works nie obliczaja z wymiarow)
  unitPrice: number      // w groszach (integer)
}

export interface RoomWork {
  enabled: boolean
  unitPrice: number      // w groszach (integer)
}

export interface Room {
  id: string
  type: RoomType
  name: string           // domyslnie przetlumaczona nazwa typu, edytowalna
  dimensions: {
    walls: number[]      // m2, wiele scian
    ceilings: number[]   // m2, wiele sufitow
    floor: number        // m2
    corners: number      // mb
    grooves: number      // mb
    acrylic: number      // mb
  }
  works: Record<string, RoomWork>  // klucz = workId z PREDEFINED_WORKS
  customWorks: CustomWork[]
}

export interface WizardState {
  currentStep: number
  rooms: Room[]
  vatRate: 8 | 23
}
