import { lazy } from 'react'
import type { RouteObject } from 'react-router-dom'
import { DocenteLayout } from '@/layouts'

const DocenteDashboard = lazy(() =>
  import('@/dashboards/docente').then((m) => ({ default: m.DocenteDashboard })),
)

const AlertasSeguimientoDocentePage = lazy(() =>
  import('@/features/seguimiento').then((m) => ({ default: m.AlertasSeguimientoDocentePage })),
)

const PlanillaDocentePage = lazy(() =>
  import('@/features/calificaciones').then((m) => ({ default: m.PlanillaDocentePage })),
)

const DocenteCalendario = lazy(() =>
  import('@/features/eventos').then((m) => ({ default: m.CalendarioPage })),
)

export const docenteRoutes: RouteObject = {
  element: <DocenteLayout />,
  children: [
    { path: '/docente', element: <DocenteDashboard /> },
    { path: '/docente/alertas-seguimiento', element: <AlertasSeguimientoDocentePage /> },
    { path: '/docente/planilla', element: <PlanillaDocentePage /> },
    { path: '/docente/calendario', element: <DocenteCalendario /> },
  ],
}
