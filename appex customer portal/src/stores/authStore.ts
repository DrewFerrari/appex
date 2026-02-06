import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AuthState, User, Branch } from '@/types'

interface AuthStore extends AuthState {
  login: (user: User, token: string) => void
  logout: () => void
  refreshToken: (token: string) => void
  updateUser: (user: Partial<User>) => void
  switchBranch: (branch: Branch) => void
  setPermissions: (permissions: string[]) => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      token: null,
      permissions: [],
      currentBranch: null,
      isAuthenticated: false,

      // Actions
      login: (user: User, token: string) =>
        set({
          user,
          token,
          isAuthenticated: true,
        }),

      logout: () =>
        set({
          user: null,
          token: null,
          permissions: [],
          currentBranch: null,
          isAuthenticated: false,
        }),

      refreshToken: (token: string) =>
        set({
          token,
        }),

      updateUser: (userData: Partial<User>) => {
        const currentUser = get().user
        if (currentUser) {
          set({
            user: { ...currentUser, ...userData },
          })
        }
      },

      switchBranch: (branch: Branch) =>
        set({
          currentBranch: branch,
        }),

      setPermissions: (permissions: string[]) =>
        set({
          permissions,
        }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        permissions: state.permissions,
        currentBranch: state.currentBranch,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)
