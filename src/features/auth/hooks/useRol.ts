import { useAuthStore } from '../store'
import type { Rol } from '../types'

/** Devuelve el rol del usuario autenticado */
export function useRol(): Rol | undefined {
  return useAuthStore((state) => state.usuario?.rol)
}
