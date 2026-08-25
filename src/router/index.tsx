import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import { RutaPrivada } from './RutaPrivada'
import { RutaPorRol } from './RutaPorRol'
import Login from '@/pages/auth/Login'
import NoAutorizado from '@/pages/NoAutorizado'
import NoEncontrado from '@/pages/NoEncontrado'
import AdminDashboard from '@/pages/admin/Dashboard'
import DocenteDashboard from '@/pages/docente/Dashboard'
import EstudianteDashboard from '@/pages/estudiante/Dashboard'

export const router = createBrowserRouter([
  {
    errorElement: <NoEncontrado />,
    children: [
      // Rutas públicas
      { path: '/', element: <Navigate to="/login" replace /> },
      { path: '/login', element: <Login /> },
      { path: '/no-autorizado', element: <NoAutorizado /> },

      // Rutas protegidas (requieren sesión)
      {
        element: <RutaPrivada />,
        children: [
          // Solo ADMIN
          {
            element: <RutaPorRol rolesPermitidos={['ADMIN']} />,
            children: [
              { path: '/admin', element: <AdminDashboard /> },
              // TODO: agregar rutas de admin (docentes, estudiantes, cursos, etc.)
            ],
          },

          // Solo DOCENTE
          {
            element: <RutaPorRol rolesPermitidos={['DOCENTE']} />,
            children: [
              { path: '/docente', element: <DocenteDashboard /> },
              // TODO: agregar rutas de docente (planilla, alertas, etc.)
            ],
          },

          // Solo ESTUDIANTE
          {
            element: <RutaPorRol rolesPermitidos={['ESTUDIANTE']} />,
            children: [
              { path: '/estudiante', element: <EstudianteDashboard /> },
              // TODO: agregar rutas de estudiante (calificaciones, etc.)
            ],
          },
        ],
      },
    ],
  },
])

export function AppRouter() {
  return <RouterProvider router={router} />
}

