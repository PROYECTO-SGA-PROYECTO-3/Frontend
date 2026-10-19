import { useState } from 'react'
import { Building2 } from 'lucide-react'
import { extraerMensajeError } from '@/shared/lib'
import { useInstitucion } from '../../hooks/useInstitucion'
import { InstitucionCard } from './InstitucionCard'
import { EditarInstitucionModal } from './EditarInstitucionModal'
import { InstitucionMediaUploader } from './InstitucionMediaUploader'
import { InstitucionSkeleton } from './InstitucionSkeleton'
import { ErrorState } from '@/shared/ui/ErrorState'
import { ToastNotificacion } from '@/shared/ui/ToastNotificacion'

export function InstitucionSection() {
  const [modalEditarAbierto, setModalEditarAbierto] = useState(false)
  const [toastMensaje, setToastMensaje] = useState<string | null>(null)

  const {
    data: institucion,
    isLoading,
    error,
    refetch,
  } = useInstitucion()

  const handleAbrirModal = () => {
    setModalEditarAbierto(true)
  }

  const handleCerrarModal = () => {
    setModalEditarAbierto(false)
  }

  const handleGuardadoExitoso = () => {
    setModalEditarAbierto(false)
    setToastMensaje('Información institucional actualizada exitosamente.')
  }

  const handleCerrarToast = () => {
    setToastMensaje(null)
  }

  if (isLoading) {
    return <InstitucionSkeleton />
  }

  if (error) {
    return (
      <ErrorState
        titulo="Error al consultar configuración institucional"
        mensaje={extraerMensajeError(error)}
        onRetry={() => refetch()}
        variant="card"
      />
    )
  }

  return (
    <section className="flex flex-col gap-6">
      <div>
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
            <Building2 size={20} />
          </div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            Configuración Institucional
          </h2>
        </div>
        <p className="mt-1.5 text-sm text-slate-500">
          Administra la identidad legal, firmas autorizadas y emblemas del plantel educativo.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3 items-start">
        <div className="lg:col-span-2">
          <InstitucionCard
            institucion={institucion ?? null}
            onEditar={handleAbrirModal}
          />
        </div>
        <div className="lg:col-span-1">
          <InstitucionMediaUploader institucion={institucion ?? null} />
        </div>
      </div>

      {/* Modal de edición */}
      <EditarInstitucionModal
        abierto={modalEditarAbierto}
        institucion={institucion ?? null}
        onCerrar={handleCerrarModal}
        onGuardadoExitoso={handleGuardadoExitoso}
      />

      {/* Feedback flotante */}
      <ToastNotificacion
        mensaje={toastMensaje}
        onCerrar={handleCerrarToast}
        tipo="exito"
      />
    </section>
  )
}
