import { create } from 'zustand'
import type { User, Session } from '@supabase/supabase-js'

interface AuthState {
  user: User | null
  session: Session | null
  isLoading: boolean
}

interface AuthActions {
  setAuth: (user: User | null, session: Session | null) => void
  setLoading: (loading: boolean) => void
}

type AuthStore = AuthState & AuthActions

export const useAuthStore = create<AuthStore>()((set) => ({
  user: null,
  session: null,
  isLoading: true,

  setAuth: (user, session) =>
    set({ user, session, isLoading: false }),

  setLoading: (loading) =>
    set({ isLoading: loading }),
}))
