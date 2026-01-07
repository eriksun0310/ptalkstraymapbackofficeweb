import { create } from 'zustand'
import type { ShelterDetail } from '@/types'
import { mockShelters } from '@/data/mock'

interface ShelterState {
  shelters: ShelterDetail[]
  addShelter: (shelter: ShelterDetail) => void
  updateShelter: (id: string, shelter: Partial<ShelterDetail>) => void
  deleteShelter: (id: string) => void
  getShelterById: (id: string) => ShelterDetail | undefined
}

export const useShelterStore = create<ShelterState>((set, get) => ({
  shelters: mockShelters,
  addShelter: (shelter) =>
    set((state) => ({
      shelters: [...state.shelters, shelter],
    })),
  updateShelter: (id, updatedShelter) =>
    set((state) => ({
      shelters: state.shelters.map((s) =>
        s.id === id ? { ...s, ...updatedShelter } : s
      ),
    })),
  deleteShelter: (id) =>
    set((state) => ({
      shelters: state.shelters.filter((s) => s.id !== id),
    })),
  getShelterById: (id) => get().shelters.find((s) => s.id === id),
}))
