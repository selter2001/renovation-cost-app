import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import type { Room, RoomType, CustomWork, WizardState } from '@/types/wizard'

interface WizardActions {
  // Nawigacja
  setStep: (step: number) => void
  nextStep: () => void
  prevStep: () => void

  // Pokoje CRUD
  addRoom: (type: RoomType, name: string) => void
  removeRoom: (id: string) => void
  updateRoomName: (id: string, name: string) => void

  // Wymiary
  updateDimension: (roomId: string, field: string, value: number | number[]) => void

  // Prace predefiniowane
  toggleWork: (roomId: string, workId: string) => void
  setWorkPrice: (roomId: string, workId: string, priceInGrosze: number) => void

  // Custom works
  addCustomWork: (roomId: string, work: Omit<CustomWork, 'id'>) => void
  removeCustomWork: (roomId: string, workId: string) => void
  updateCustomWork: (roomId: string, workId: string, updates: Partial<CustomWork>) => void

  // VAT
  setVatRate: (rate: 8 | 23) => void

  // Reset
  resetWizard: () => void
}

type WizardStore = WizardState & WizardActions

const initialState: WizardState = {
  currentStep: 0,
  rooms: [],
  vatRate: 23,
}

export const useWizardStore = create<WizardStore>()(
  persist(
    immer((set) => ({
      ...initialState,

      // Nawigacja
      setStep: (step) =>
        set((state) => {
          state.currentStep = step
        }),

      nextStep: () =>
        set((state) => {
          state.currentStep = Math.min(state.currentStep + 1, 3)
        }),

      prevStep: () =>
        set((state) => {
          state.currentStep = Math.max(state.currentStep - 1, 0)
        }),

      // Pokoje CRUD
      addRoom: (type, name) =>
        set((state) => {
          const newRoom: Room = {
            id: crypto.randomUUID(),
            type,
            name,
            dimensions: {
              walls: [],
              ceilings: [],
              floor: 0,
              corners: 0,
              grooves: 0,
              acrylic: 0,
            },
            works: {},
            customWorks: [],
          }
          state.rooms.push(newRoom)
        }),

      removeRoom: (id) =>
        set((state) => {
          state.rooms = state.rooms.filter((r) => r.id !== id)
        }),

      updateRoomName: (id, name) =>
        set((state) => {
          const room = state.rooms.find((r) => r.id === id)
          if (room) {
            room.name = name
          }
        }),

      // Wymiary
      updateDimension: (roomId, field, value) =>
        set((state) => {
          const room = state.rooms.find((r) => r.id === roomId)
          if (room) {
            const dimensions = room.dimensions as Record<string, number | number[]>
            dimensions[field] = value
          }
        }),

      // Prace predefiniowane
      toggleWork: (roomId, workId) =>
        set((state) => {
          const room = state.rooms.find((r) => r.id === roomId)
          if (room) {
            if (room.works[workId]) {
              room.works[workId].enabled = !room.works[workId].enabled
            } else {
              room.works[workId] = { enabled: true, unitPrice: 0 }
            }
          }
        }),

      setWorkPrice: (roomId, workId, priceInGrosze) =>
        set((state) => {
          const room = state.rooms.find((r) => r.id === roomId)
          if (room) {
            if (!room.works[workId]) {
              room.works[workId] = { enabled: false, unitPrice: priceInGrosze }
            } else {
              room.works[workId].unitPrice = priceInGrosze
            }
          }
        }),

      // Custom works
      addCustomWork: (roomId, work) =>
        set((state) => {
          const room = state.rooms.find((r) => r.id === roomId)
          if (room) {
            room.customWorks.push({
              ...work,
              id: crypto.randomUUID(),
            })
          }
        }),

      removeCustomWork: (roomId, workId) =>
        set((state) => {
          const room = state.rooms.find((r) => r.id === roomId)
          if (room) {
            room.customWorks = room.customWorks.filter((w) => w.id !== workId)
          }
        }),

      updateCustomWork: (roomId, workId, updates) =>
        set((state) => {
          const room = state.rooms.find((r) => r.id === roomId)
          if (room) {
            const work = room.customWorks.find((w) => w.id === workId)
            if (work) {
              Object.assign(work, updates)
            }
          }
        }),

      // VAT
      setVatRate: (rate) =>
        set((state) => {
          state.vatRate = rate
        }),

      // Reset
      resetWizard: () =>
        set((state) => {
          state.currentStep = initialState.currentStep
          state.rooms = initialState.rooms
          state.vatRate = initialState.vatRate
        }),
    })),
    {
      name: 'renocost-wizard-v1',
      storage: createJSONStorage(() => localStorage),
      version: 1,
      partialize: (state) => ({
        rooms: state.rooms,
        vatRate: state.vatRate,
      }),
    },
  ),
)
