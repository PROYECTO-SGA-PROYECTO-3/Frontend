import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import { RutaPrivada } from './RutaPrivada'
import { RutaPorRol } from './RutaPorRol'
import { Layout } from '@/components/layout/Layout'
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
              {
                element: <Layout />,
                children: [
                  { path: '/admin', element: <AdminDashboard /> },
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


