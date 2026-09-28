import type { ReactNode } from 'react'
import { useAuthorization } from '../hooks/useAuthorization'
import type { Rol } from '../types'

interface CanProps {
  roles: Rol[]
  children: ReactNode
  fallback?: ReactNode
}

/**
 * Componente declarativo de autorización en UI (defensa en profundidad).
 * Renderiza sus hijos únicamente si el usuario autenticado posee al menos uno de los roles requeridos.
 */
export function Can({ roles, children, fallback = null }: CanProps) {
  const { hasAnyRole } = useAuthorization()

  if (!hasAnyRole(roles)) {
    return <>{fallback}</>
  }

  return <>{children}</>
}
