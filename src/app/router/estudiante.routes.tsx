import { lazy } from 'react'
import type { RouteObject } from 'react-router-dom'
import { EstudianteLayout } from '@/layouts'

const EstudianteDashboard = lazy(() =>
  import('@/dashboards/estudiante').then((m) => ({ default: m.EstudianteDashboard })),
)
const EstudianteCalificaciones = lazy(() =>
  import('@/features/calificaciones').then((m) => ({
    default: m.CalificacionesEstudiantePage,
  })),
)
const EstudianteCalendario = lazy(() =>
  import('@/features/eventos').then((m) => ({ default: m.CalendarioPage })),
)

export const estudianteRoutes: RouteObject = {
  element: <EstudianteLayout />,
  children: [
    { path: '/estudiante', element: <EstudianteDashboard /> },
    { path: '/estudiante/calificaciones', element: <EstudianteCalificaciones /> },
    { path: '/estudiante/calendario', element: <EstudianteCalendario /> },
  ],
}
