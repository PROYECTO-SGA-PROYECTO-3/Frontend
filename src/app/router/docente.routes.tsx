import { lazy } from 'react'
import type { RouteObject } from 'react-router-dom'
import { DocenteLayout } from '@/layouts'

const DocenteDashboard = lazy(() =>
  import('@/dashboards/docente').then((m) => ({ default: m.DocenteDashboard })),
)

export const docenteRoutes: RouteObject = {
  element: <DocenteLayout />,
  children: [
    { path: '/docente', element: <DocenteDashboard /> },
  ],
}
