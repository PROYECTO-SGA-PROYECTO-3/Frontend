import { lazy } from 'react'
import type { RouteObject } from 'react-router-dom'
import { DocenteLayout } from '@/layouts'

const DocenteDashboard = lazy(() =>
  import('@/dashboards/docente').then((m) => ({ default: m.DocenteDashboard })),
)

const AlertasSeguimientoDocentePage = lazy(() =>
  import('@/features/seguimiento').then((m) => ({ default: m.AlertasSeguimientoDocentePage })),
)

export const docenteRoutes: RouteObject = {
  element: <DocenteLayout />,
  children: [
    { path: '/docente', element: <DocenteDashboard /> },
    { path: '/docente/alertas-seguimiento', element: <AlertasSeguimientoDocentePage /> },
  ],
}
