import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuthStore, type Rol } from '@/features/auth'

interface ProtectedRouteProps {
  roles?: Rol[]
}

export function ProtectedRoute({ roles }: ProtectedRouteProps) {
  const token = useAuthStore((state) => state.token)
  const usuario = useAuthStore((state) => state.usuario)
  const motivoCierre = useAuthStore((state) => state.motivoCierre)
  const location = useLocation()

  if (!token || !usuario) {
    // Si el usuario cerró sesión voluntariamente, lo enviamos al login limpio
    if (motivoCierre === 'voluntario') {
      return <Navigate to="/login" replace />
    }

    const rutaActual = location.pathname + location.search
    const queryRedirect = rutaActual && rutaActual !== '/' ? `?redirect=${encodeURIComponent(rutaActual)}` : ''
    return <Navigate to={`/login${queryRedirect}`} replace />
  }

  if (roles && !roles.includes(usuario.rol)) {
    return <Navigate to="/no-autorizado" replace />
  }

  return <Outlet />
}
