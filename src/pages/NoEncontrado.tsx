import { useNavigate, Link } from 'react-router-dom'
import { Search, ArrowLeft, Home, ArrowRight, LogIn } from 'lucide-react'
import { useAuthStore, RUTAS_POR_ROL } from '@/features/auth'
import { Button } from '@/shared/ui'
import { ITEMS_NAV_PRINCIPAL } from '@/layouts'

export default function NoEncontrado() {
  const navigate = useNavigate()
  const usuario = useAuthStore((state) => state.usuario)

  const homePath = usuario ? RUTAS_POR_ROL[usuario.rol] : '/login'
  const sugerencias = usuario ? ITEMS_NAV_PRINCIPAL[usuario.rol] || [] : []

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      <main className="w-full max-w-md">
        {/* Visual anchor — search icon with brand tone */}
        <div className="flex flex-col items-center text-center">
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-50 ring-1 ring-brand-200/80">
            <Search className="h-7 w-7 text-brand-700" />
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Página no encontrada
          </h1>
          <p className="mt-2 max-w-xs text-sm leading-relaxed text-slate-500">
            La dirección que buscas no existe o fue movida.
          </p>
        </div>

        {/* Quick navigation — role-based shortcuts */}
        {usuario && sugerencias.length > 0 && (
          <nav
            aria-label="Secciones disponibles"
            className="mt-8 rounded-xl border border-slate-200/80 bg-white p-1.5"
          >
            {sugerencias.slice(0, 4).map((item) => {
              const Icon = item.icono
              return (
                <Link
                  key={item.ruta}
                  to={item.ruta}
                  className="flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-brand-50 hover:text-brand-800 focus-visible:outline-2 focus-visible:outline-brand-600"
                >
                  <span className="flex items-center gap-2.5">
                    <Icon size={16} className="text-slate-400" />
                    {item.etiqueta}
                  </span>
                  <ArrowRight size={14} className="text-slate-300" />
                </Link>
              )
            })}
          </nav>
        )}

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
      </main>
    </div>
  )
}
