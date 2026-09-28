import { useCallback } from 'react'
import { useAuthStore } from '../store'
import type { Rol, Usuario } from '../types'

export interface AuthorizationState {
  usuario: Usuario | null
  rol: Rol | undefined
  isAuthenticated: boolean
  hasRole: (rol: Rol) => boolean
  hasAnyRole: (roles: Rol[]) => boolean
}

/**
 * Hook de autorización para comprobación declarativa de roles en la UI.
 * Permite evaluar permisos y controlar visibilidad de elementos según la sesión activa.
 */
export function useAuthorization(): AuthorizationState {
  const usuario = useAuthStore((state) => state.usuario)
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const rol = usuario?.rol

  const hasRole = useCallback(
    (targetRol: Rol): boolean => {
      if (!isAuthenticated || !rol) return false
      return rol === targetRol
    },
    [isAuthenticated, rol],
  )

  const hasAnyRole = useCallback(
    (roles: Rol[]): boolean => {
      if (!isAuthenticated || !rol) return false
      return roles.includes(rol)
    },
    [isAuthenticated, rol],
  )

  return {
    usuario,
    rol,
    isAuthenticated,
    hasRole,
    hasAnyRole,
  }
}
