import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Usuario, MotivoCierre } from './types'
import { queryClient } from '@/shared/lib/query-client'

interface AuthState {
  token: string | null
  usuario: Usuario | null
  isAuthenticated: boolean
  motivoCierre: MotivoCierre
  setSesion: (token: string, usuario: Usuario) => void
  cerrarSesion: (motivo?: Exclude<MotivoCierre, null>) => void
  limpiarMotivo: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      usuario: null,
      isAuthenticated: false,
      motivoCierre: null,
      setSesion: (token, usuario) =>
        set({ token, usuario, isAuthenticated: true, motivoCierre: null }),
      cerrarSesion: (motivo = 'voluntario') => {
        queryClient.clear()
        set({ token: null, usuario: null, isAuthenticated: false, motivoCierre: motivo })
      },
      limpiarMotivo: () => set({ motivoCierre: null }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ token: state.token, usuario: state.usuario }),
    },
  ),
)
