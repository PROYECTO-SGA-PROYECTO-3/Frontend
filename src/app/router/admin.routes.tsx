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
const AdminCursos = lazy(() =>
  import('@/features/cursos').then((m) => ({ default: m.CursosPage })),
)
const AdminDocentes = lazy(() =>
  import('@/features/docentes').then((m) => ({ default: m.DocentesPage })),
)
const AdminDocenteFormulario = lazy(() =>
  import('@/features/docentes').then((m) => ({ default: m.DocenteFormPage })),
)
const AdminEstudiantes = lazy(() =>
  import('@/features/estudiantes').then((m) => ({ default: m.EstudiantesPage })),
)
const AdminEstudianteFormulario = lazy(() =>
  import('@/features/estudiantes').then((m) => ({ default: m.EstudianteFormPage })),
)
const AdminCalendario = lazy(() =>
  import('@/features/eventos').then((m) => ({ default: m.CalendarioPage })),
)

export const adminRoutes: RouteObject = {
  element: <AdminLayout />,
  children: [
    { path: '/admin', element: <AdminDashboard /> },
    { path: '/admin/cursos', element: <AdminCursos /> },
    { path: '/admin/materias', element: <AdminMaterias /> },
    { path: '/admin/docentes', element: <AdminDocentes /> },
    { path: '/admin/docentes/nuevo', element: <AdminDocenteFormulario /> },
    { path: '/admin/docentes/:id/editar', element: <AdminDocenteFormulario /> },
    { path: '/admin/estudiantes', element: <AdminEstudiantes /> },
    { path: '/admin/estudiantes/nuevo', element: <AdminEstudianteFormulario /> },
    { path: '/admin/estudiantes/:id/editar', element: <AdminEstudianteFormulario /> },
    { path: '/admin/calendario', element: <AdminCalendario /> },
    { path: '/admin/configuracion', element: <AdminConfiguracion /> },
  ],
}
