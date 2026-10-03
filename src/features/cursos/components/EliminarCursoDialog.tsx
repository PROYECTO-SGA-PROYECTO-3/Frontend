import { DialogoConfirmacion } from '@/shared/ui'
import type { Grado } from '@/shared/types/academico.types'

interface EliminarCursoDialogProps {
  abierto: boolean
  curso: Grado | null
  procesando: boolean
  error?: string | null
  onConfirmar: () => void
  onCancelar: () => void
}

export function EliminarCursoDialog({
  abierto,
  curso,
  procesando,
  error,
  onConfirmar,
  onCancelar,
}: EliminarCursoDialogProps) {
  if (!curso) return null

  return (
    <DialogoConfirmacion
      abierto={abierto}
      titulo={`¿Eliminar ${curso.nombre}?`}
      mensaje="Esta acción eliminará el grado del catálogo institucional. Ten en cuenta que el sistema rechazará la eliminación si el curso cuenta con estudiantes matriculados o cargas académicas registradas."
      error={error ?? undefined}
      procesando={procesando}
      textoConfirmar="Eliminar Grado"
      onConfirmar={onConfirmar}
      onCancelar={onCancelar}
    />
  )
}
