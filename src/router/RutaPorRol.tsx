import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/store/auth.store'
import type { Rol } from '@/types/auth.types'

interface RutaPorRolProps {
  rolesPermitidos: Rol[]
}

/** Protege rutas por rol. Si el rol no está en la lista, redirige a /no-autorizado. */
export function RutaPorRol({ rolesPermitidos }: RutaPorRolProps) {
  const rol = useAuthStore((state) => state.usuario?.rol)
  if (!rol) return <Navigate to="/login" replace />
  return rolesPermitidos.includes(rol)
    ? <Outlet />
    : <Navigate to="/no-autorizado" replace />
}
