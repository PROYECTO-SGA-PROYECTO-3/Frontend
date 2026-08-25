import { useAuth } from '@/hooks/useAuth'
import { NavbarDocente } from '@/components/layout/NavbarDocente'

export default function DocenteDashboard() {
  const { usuario } = useAuth()
  if (!usuario) return null

  return (
    <>
      <NavbarDocente usuario={usuario} cargo="Docente" seccionActual="Inicio" />
      <main className="flex-1 p-8">
        <div className="flex flex-col gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Portal Docente</h2>
            <p className="text-sm text-slate-500">
              Gestión de planillas, registro de notas y seguimiento académico.
            </p>
          </div>
          <div className="mt-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-slate-700">Contenido principal del portal docente.</p>
          </div>
        </div>
      </main>
    </>
  )
}

