import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import { RutaPrivada } from './RutaPrivada'
import { RutaPorRol } from './RutaPorRol'
import { Layout } from '@/layouts'
import { LoginPage } from '@/features/auth'
import NoAutorizado from '@/pages/NoAutorizado'
import NoEncontrado from '@/pages/NoEncontrado'
import { AdminDashboard } from '@/dashboards/admin'
import { ConfiguracionPage as AdminConfiguracion } from '@/features/configuracion'
import { DocenteDashboard } from '@/dashboards/docente'
import { EstudianteDashboard } from '@/dashboards/estudiante'
import { CalificacionesEstudiantePage as EstudianteCalificaciones } from '@/features/calificaciones'

export const router = createBrowserRouter([
  {
    errorElement: <NoEncontrado />,
    children: [
      // Rutas públicas
      { path: '/', element: <Navigate to="/login" replace /> },
      { path: '/login', element: <LoginPage /> },
      { path: '/no-autorizado', element: <NoAutorizado /> },

      // Rutas protegidas (requieren sesión)
      {
        element: <RutaPrivada />,
        children: [
          // Solo ADMIN
          {
            element: <RutaPorRol rolesPermitidos={['ADMIN']} />,
            children: [
              {
                element: <Layout />,
                children: [
                  { path: '/admin', element: <AdminDashboard /> },
                  { path: '/admin/configuracion', element: <AdminConfiguracion /> },
                ],
              },
            ],
          },

          // Solo DOCENTE
          {
            element: <RutaPorRol rolesPermitidos={['DOCENTE']} />,
            children: [
              {
                element: <Layout />,
                children: [
                  { path: '/docente', element: <DocenteDashboard /> },
                ],
              },
            ],
          },

          // Solo ESTUDIANTE
          {
            element: <RutaPorRol rolesPermitidos={['ESTUDIANTE']} />,
            children: [
              {
                element: <Layout />,
                children: [
                  { path: '/estudiante', element: <EstudianteDashboard /> },
                  { path: '/estudiante/calificaciones', element: <EstudianteCalificaciones /> },
                ],
              },
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


