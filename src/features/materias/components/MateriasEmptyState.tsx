import { BookOpen, SearchX, Plus, RotateCcw } from 'lucide-react'
import { Button } from '@/shared/ui/Button'

interface MateriasEmptyStateProps {
  esBusqueda: boolean
  terminoBusqueda?: string
  onCrear: () => void
  onLimpiarBusqueda?: () => void
}

export function MateriasEmptyState({
  esBusqueda,
  terminoBusqueda,
  onCrear,
  onLimpiarBusqueda,
}: MateriasEmptyStateProps) {
  if (esBusqueda) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center shadow-xs">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
          <SearchX size={28} />
        </div>
        <h3 className="mt-4 text-base font-semibold text-slate-900">
          Sin coincidencias encontradas
        </h3>
        <p className="mt-1 max-w-sm text-sm text-slate-500">
          No existe ninguna asignatura registrada que coincida con el término{' '}
          <strong className="text-slate-700 font-medium">"{terminoBusqueda}"</strong>.
        </p>
        {onLimpiarBusqueda && (
          <div className="mt-5 w-auto">
            <Button variant="secondary" onClick={onLimpiarBusqueda}>
              <RotateCcw size={16} />
              Limpiar búsqueda
            </Button>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center shadow-xs">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">
        <BookOpen size={32} />
      </div>
      <h3 className="mt-4 text-lg font-bold text-slate-900">
        Catálogo de asignaturas vacío
      </h3>
      <p className="mt-1 max-w-md text-sm text-slate-500">
        Aún no se han registrado asignaturas curriculares en el sistema institucional. Comienza registrando la primera para habilitar la asignación de carga académica docente.
      </p>
      <div className="mt-6 w-auto">
        <Button variant="primary" onClick={onCrear}>
          <Plus size={18} />
          Registrar Primera Asignatura
        </Button>
      </div>
    </div>
  )
}
