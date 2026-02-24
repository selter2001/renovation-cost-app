import type { Room, CustomWork } from '@/types/wizard'
import { PREDEFINED_WORKS } from '@/types/wizard'

/**
 * Oblicz powierzchnie netto pokoju (suma scian + sufitow).
 */
export function calcRoomNetArea(room: Room): number {
  const wallsArea = room.dimensions.walls.reduce((sum, w) => sum + w, 0)
  const ceilingsArea = room.dimensions.ceilings.reduce((sum, c) => sum + c, 0)
  return wallsArea + ceilingsArea
}

/**
 * Pobierz ilosc dla danej pracy na podstawie wymiarow pokoju.
 * Mapuje dimensionKey z WorkType na odpowiednie wymiary.
 */
export function getWorkQuantity(room: Room, workId: string): number {
  const workType = PREDEFINED_WORKS.find((w) => w.id === workId)
  if (!workType) return 0

  const key = workType.dimensionKey
  switch (key) {
    case 'netArea':
      return calcRoomNetArea(room)
    case 'floor':
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

/**
 * Oblicz koszt pracy: ilosc * cena jednostkowa (w groszach).
 * Zaokragla do pelnych groszy.
 */
export function calcWorkCost(quantity: number, unitPriceGrosze: number): number {
  return Math.round(quantity * unitPriceGrosze)
}

/**
 * Oblicz koszt custom work.
 */
export function calcCustomWorkCost(work: CustomWork): number {
  return Math.round(work.quantity * work.unitPrice)
}

/**
 * Oblicz calkowity koszt pokoju (suma aktywnych prac + custom works).
 */
export function calcRoomTotal(room: Room): number {
  let total = 0

  // Predefiniowane prace
  for (const [workId, roomWork] of Object.entries(room.works)) {
    if (roomWork.enabled) {
      const quantity = getWorkQuantity(room, workId)
      total += calcWorkCost(quantity, roomWork.unitPrice)
    }
  }

  // Custom works
  for (const customWork of room.customWorks) {
    total += calcCustomWorkCost(customWork)
  }

  return total
}

/**
 * Oblicz sume netto wszystkich pokoi.
 */
export function calcNetTotal(rooms: Room[]): number {
  return rooms.reduce((sum, room) => sum + calcRoomTotal(room), 0)
}

/**
 * Oblicz kwote VAT.
 */
export function calcVat(netGrosze: number, vatRate: 8 | 23): number {
  return Math.round(netGrosze * vatRate / 100)
}

/**
 * Oblicz kwote brutto z netto + VAT.
 */
export function calcGrossFromNet(netGrosze: number, vatRate: 8 | 23): number {
  return netGrosze + calcVat(netGrosze, vatRate)
}
