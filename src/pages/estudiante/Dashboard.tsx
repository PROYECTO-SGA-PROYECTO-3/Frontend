import { useAuth } from '@/hooks/useAuth'
import { NavbarEstudiante } from '@/components/layout/NavbarEstudiante'

export default function EstudianteDashboard() {
  const { usuario } = useAuth()
  if (!usuario) return null

  return (
    <>
      <NavbarEstudiante usuario={usuario} seccionActual="Inicio" />
      <main className="flex-1 p-8">
        <div className="flex flex-col gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Portal Académico</h2>
            <p className="text-sm text-slate-500">
              Consulta de calificaciones, asignaturas y boletines.
            </p>
          </div>
          <div className="mt-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-slate-700">Contenido principal del portal de estudiante.</p>
          </div>
        </div>
      </main>
    </>
  )
}

