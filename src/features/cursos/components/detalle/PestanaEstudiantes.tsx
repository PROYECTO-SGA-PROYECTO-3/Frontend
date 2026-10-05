import { useState, useMemo } from 'react'
import { Users } from 'lucide-react'
import { ErrorState, Skeleton, SearchInput, Badge } from '@/shared/ui'
import { useEstudiantesCurso } from '../../hooks'
import { EstudiantesMatriculadosTable } from './EstudiantesMatriculadosTable'
import { EstudiantesCursoEmptyState } from './EstudiantesCursoEmptyState'

export interface PestanaEstudiantesProps {
  cursoId: number
  nombreCurso?: string
}

export function PestanaEstudiantes({ cursoId }: PestanaEstudiantesProps) {
  const { estudiantes, totalEstudiantes, isLoading, isError, error, refetch } =
    useEstudiantesCurso(cursoId)

  const [busqueda, setBusqueda] = useState('')

  // Filtrado en memoria por nombre completo o documento
  const estudiantesFiltrados = useMemo(() => {
    const query = busqueda.trim().toLowerCase()
    if (!query) return estudiantes

    return estudiantes.filter(
      (e) =>
        e.nombreCompletoEstudiante.toLowerCase().includes(query) ||
        e.documentoEstudiante.toLowerCase().includes(query),
    )
  }, [estudiantes, busqueda])

  const hayFiltroActivo = busqueda.trim().length > 0

  return (
    <div className="space-y-5">
      {/* 1. Estado de Carga con Skeleton en formato Tabla */}
      {isLoading && (
        <div className="space-y-4" aria-busy="true" aria-label="Cargando nómina de estudiantes">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Skeleton className="h-10 w-full sm:w-72 rounded-xl" />
            <Skeleton className="h-6 w-28 rounded-full" />
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <div className="border-b border-slate-100 bg-slate-50/75 p-3.5 flex gap-4">
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-24 ml-auto" />
            </div>
            <div className="divide-y divide-slate-100 p-2 space-y-2">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="flex items-center gap-4 py-3 px-2">
                  <Skeleton className="h-4 w-8" />
                  <Skeleton className="h-9 w-9 rounded-full shrink-0" />
                  <div className="space-y-1.5 flex-1">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                  <Skeleton className="h-5 w-24 rounded-md" />
                  <Skeleton className="h-5 w-16 rounded-full ml-auto" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. Estado de Error de Red */}
      {!isLoading && isError && (
        <ErrorState
          titulo="Error al consultar estudiantes del curso"
          mensaje={error}
          onRetry={() => refetch()}
          textoBoton="Reintentar consulta"
        />
      )}

      {/* 3. Estado Vacío General (El curso no tiene matriculados) */}
      {!isLoading && !isError && totalEstudiantes === 0 && (
        <EstudiantesCursoEmptyState />
      )}

      {/* 4. Listado con Barra de Búsqueda y Tabla Institucional */}
      {!isLoading && !isError && totalEstudiantes > 0 && (
        <div className="space-y-4">
          {/* Barra de herramientas superior */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="w-full sm:w-80">
              <SearchInput
                value={busqueda}
                onChange={setBusqueda}
                onClear={() => setBusqueda('')}
                placeholder="Buscar por nombre o documento..."
              />
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto text-xs text-slate-500">
              <Users size={15} className="text-slate-400" aria-hidden="true" />
              <span>
                {hayFiltroActivo ? (
                  <>
                    Mostrando <strong className="text-slate-700">{estudiantesFiltrados.length}</strong> de {totalEstudiantes} estudiantes
                  </>
                ) : (
                  <>
                    Total matriculados: <Badge color="brand">{totalEstudiantes}</Badge>
                  </>
                )}
              </span>
            </div>
          </div>

          {/* Sin coincidencias en la búsqueda */}
          {hayFiltroActivo && estudiantesFiltrados.length === 0 ? (
            <EstudiantesCursoEmptyState
              esPorBusqueda
              terminoBusqueda={busqueda}
              onLimpiarBusqueda={() => setBusqueda('')}
            />
          ) : (
            /* Tabla accesible de estudiantes matriculados */
            <EstudiantesMatriculadosTable estudiantes={estudiantesFiltrados} />
          )}
        </div>
      )}
    </div>
  )
}
