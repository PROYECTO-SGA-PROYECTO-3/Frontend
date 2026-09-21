import { lazy } from 'react'
import type { RouteObject } from 'react-router-dom'
import { AdminLayout } from '@/layouts'

const AdminDashboard = lazy(() =>
  import('@/dashboards/admin').then((m) => ({ default: m.AdminDashboard })),
)
const AdminConfiguracion = lazy(() =>
  import('@/features/configuracion').then((m) => ({ default: m.ConfiguracionPage })),
)
const AdminMaterias = lazy(() =>
  import('@/features/materias').then((m) => ({ default: m.MateriasPage })),
)

export const adminRoutes: RouteObject = {
  element: <AdminLayout />,
  children: [
    { path: '/admin', element: <AdminDashboard /> },
    { path: '/admin/configuracion', element: <AdminConfiguracion /> },
    { path: '/admin/materias', element: <AdminMaterias /> },
  ],
}
