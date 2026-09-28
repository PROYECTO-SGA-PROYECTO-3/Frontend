import { useNavigate } from 'react-router-dom'
import { ShieldOff, ArrowLeft, Home, LogOut, LogIn } from 'lucide-react'
import { useAuthStore, RUTAS_POR_ROL } from '@/features/auth'
import { Button } from '@/shared/ui'

export default function NoAutorizado() {
  const navigate = useNavigate()
  const usuario = useAuthStore((state) => state.usuario)
  const cerrarSesion = useAuthStore((state) => state.cerrarSesion)

  const homePath = usuario ? RUTAS_POR_ROL[usuario.rol] : '/login'

  const handleCambiarCuenta = () => {
    cerrarSesion('voluntario')
    navigate('/login', { replace: true })
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      <main className="w-full max-w-md">
        {/* Visual anchor — shield icon with warm amber tone */}
        <div className="flex flex-col items-center text-center">
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 ring-1 ring-amber-200/80">
            <ShieldOff className="h-7 w-7 text-amber-600" />
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Acceso restringido
          </h1>
          <p className="mt-2 max-w-xs text-sm leading-relaxed text-slate-500">
            No tienes permisos para ver esta sección.
            {usuario
              ? ' Contacta a coordinación si necesitas acceso.'
              : ' Inicia sesión para continuar.'}
          </p>
        </div>

        {/* Actions */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button
            type="button"
            variant="primary"
            onClick={() => navigate(homePath)}
            className="w-full sm:w-auto"
          >
            {usuario ? (
              <>
                <Home size={16} />
                Ir a mi panel
              </>
            ) : (
              <>
                <LogIn size={16} />
                Iniciar sesión
              </>
            )}
          </Button>

          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto"
          >
            <ArrowLeft size={16} />
            Volver
          </Button>
        </div>

        {/* Optional: switch account hint */}
        {usuario && (
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={handleCambiarCuenta}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-sm px-1 py-0.5 text-xs font-medium text-slate-400 transition-colors hover:text-brand-700 focus-visible:outline-2 focus-visible:outline-brand-600"
            >
              <LogOut size={13} />
              Cambiar de cuenta
            </button>
          </div>
        )}
      </main>
    </div>
  )
}
