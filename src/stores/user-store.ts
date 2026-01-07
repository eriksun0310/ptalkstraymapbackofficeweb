import { create } from 'zustand'
import type { User } from '@/types'
import { mockUsers } from '@/data/mock'

interface UserState {
  users: User[]
  getUserById: (id: string) => User | undefined
}

export const useUserStore = create<UserState>((set, get) => ({
  users: mockUsers,
  getUserById: (id) => get().users.find((u) => u.id === id),
}))
