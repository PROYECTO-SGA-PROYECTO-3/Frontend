import { Suspense, lazy } from 'react'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import { ProtectedRoute } from './ProtectedRoute'
import { adminRoutes } from './admin.routes'
import { docenteRoutes } from './docente.routes'
import { estudianteRoutes } from './estudiante.routes'
import { Spinner } from '@/shared/ui/Spinner'

const LoginPage = lazy(() =>
  import('@/features/auth').then((m) => ({ default: m.LoginPage })),
)
const NoAutorizado = lazy(() => import('@/pages/NoAutorizado'))
const NoEncontrado = lazy(() => import('@/pages/NoEncontrado'))

function SuspenseWrapper({ children }: { children: React.ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen w-screen items-center justify-center bg-slate-50">
          <Spinner />
        </div>
      }
    >
      {children}
    </Suspense>
  )
}

export const router = createBrowserRouter([
  {
    errorElement: (
      <SuspenseWrapper>
        <NoEncontrado />
      </SuspenseWrapper>
    ),
    children: [
      // Rutas públicas
      { path: '/', element: <Navigate to="/login" replace /> },
      {
        path: '/login',
        element: (
          <SuspenseWrapper>
            <LoginPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: '/no-autorizado',
        element: (
          <SuspenseWrapper>
            <NoAutorizado />
          </SuspenseWrapper>
        ),
      },

      // Rutas protegidas por Rol
      {
        element: <ProtectedRoute roles={['ADMIN']} />,
        children: [
          {
            element: <SuspenseWrapper>{adminRoutes.element}</SuspenseWrapper>,
            children: adminRoutes.children?.map((route) => ({
              ...route,
              element: <SuspenseWrapper>{route.element}</SuspenseWrapper>,
            })),
          },
        ],
      },
      {
        element: <ProtectedRoute roles={['DOCENTE']} />,
        children: [
          {
            element: <SuspenseWrapper>{docenteRoutes.element}</SuspenseWrapper>,
            children: docenteRoutes.children?.map((route) => ({
              ...route,
              element: <SuspenseWrapper>{route.element}</SuspenseWrapper>,
            })),
          },
        ],
      },
      {
        element: <ProtectedRoute roles={['ESTUDIANTE']} />,
        children: [
          {
            element: <SuspenseWrapper>{estudianteRoutes.element}</SuspenseWrapper>,
            children: estudianteRoutes.children?.map((route) => ({
              ...route,
              element: <SuspenseWrapper>{route.element}</SuspenseWrapper>,
            })),
          },
        ],
      },
      {
        path: '*',
        element: (
          <SuspenseWrapper>
            <NoEncontrado />
          </SuspenseWrapper>
        ),
      },
    ],
  },
])

export function AppRouter() {
  return <RouterProvider router={router} />
}
