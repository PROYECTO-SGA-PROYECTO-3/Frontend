import { GraduationCap, RotateCcw, UserPlus } from 'lucide-react'
import { Button } from '@/shared/ui'

interface EstudiantesEmptyStateProps {
  hayFiltros: boolean
  onLimpiarFiltros: () => void
  onCrear: () => void
}

export function EstudiantesEmptyState({
  hayFiltros,
  onLimpiarFiltros,
  onCrear,
}: EstudiantesEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center shadow-xs">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
        <GraduationCap size={28} />
      </div>

      <h3 className="mt-4 text-base font-semibold text-slate-900">
        {hayFiltros ? 'Sin resultados para la búsqueda' : 'No hay estudiantes registrados'}
      </h3>

      <p className="mt-1.5 max-w-sm text-sm text-slate-500">
        {hayFiltros
          ? 'Intenta ajustar el término de búsqueda o restablecer los filtros de grado y estado.'
          : 'Aún no se ha registrado ningún estudiante en el sistema institucional. Comienza matriculando o creando el primer registro.'}
      </p>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        {hayFiltros ? (
          <Button variant="secondary" onClick={onLimpiarFiltros}>
            <RotateCcw size={16} />
            Restablecer filtros
          </Button>
        ) : (
          <Button onClick={onCrear}>
            <UserPlus size={16} />
            Registrar primer estudiante
          </Button>
        )}
      </div>
    </div>
  )
}
