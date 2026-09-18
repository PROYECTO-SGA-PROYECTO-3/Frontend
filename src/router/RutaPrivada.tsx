import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/features/auth'

/** Protege rutas que requieren sesión activa. Redirige a /login si no hay token. */
export function RutaPrivada() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />
}
