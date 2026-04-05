import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      refreshToken: null,

      setAuth: (user, token, refreshToken) =>
        set({ user, token, refreshToken }),

      setUser: (user) => set({ user }),

      updateUser: (partial) =>
        set((state) => ({ user: { ...state.user, ...partial } })),

      logout: () => {
        set({ user: null, token: null, refreshToken: null })
        localStorage.removeItem('gigshield-auth')
      },

      isAuthenticated: () => !!get().token,
    }),
    {
      name: 'gigshield-auth',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        refreshToken: state.refreshToken,
      }),
    }
  )
)