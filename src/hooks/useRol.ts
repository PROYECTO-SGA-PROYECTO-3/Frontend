import { useAuthStore } from '@/store/auth.store'
import type { Rol } from '@/types/auth.types'

/** Devuelve el rol del usuario autenticado */
export function useRol(): Rol | undefined {
  return useAuthStore((state) => state.usuario?.rol)
}
