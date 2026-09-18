import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore, type Rol } from '@/features/auth'

interface ProtectedRouteProps {
  roles?: Rol[]
}

/**
 * Valida autenticación y autorización por rol.
 * - Si no está autenticado -> redirige a /login.
 * - Si se especifican roles y el usuario no tiene uno de ellos -> redirige a /no-autorizado.
 * - Si cumple con todo -> renderiza el Outlet.
 */
export function ProtectedRoute({ roles }: ProtectedRouteProps) {
  const token = useAuthStore((state) => state.token)
  const usuario = useAuthStore((state) => state.usuario)

  if (!token || !usuario) {
    return <Navigate to="/login" replace />
  }

  if (roles && !roles.includes(usuario.rol)) {
    return <Navigate to="/no-autorizado" replace />
  }

  return <Outlet />
}
