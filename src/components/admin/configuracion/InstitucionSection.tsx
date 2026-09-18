import { useQuery } from '@tanstack/react-query'
import { Building2, AlertCircle } from 'lucide-react'
import { obtenerInstitucion } from '@/api/institucion.api'
import { extraerMensajeError } from '@/api/axios'
import { InstitucionForm } from './InstitucionForm'
import { InstitucionMediaUploader } from './InstitucionMediaUploader'
import { Skeleton } from '@/shared/ui/Skeleton'

export function InstitucionSection() {
  const {
    data: institucion,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['institucion'],
    queryFn: async () => {
      try {
        return await obtenerInstitucion()
      } catch (err: unknown) {
        // Un 404 es esperado si aún no se ha creado una configuración institucional
        const mensaje = extraerMensajeError(err)
        if (mensaje.includes('No se encontró') || (err as { response?: { status?: number } })?.response?.status === 404) {
          return null
        }
        throw err
      }
    },
    staleTime: 1000 * 60 * 10, // 10 minutos
  })

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-7 w-64 rounded-lg" />
          <Skeleton className="mt-2 h-4 w-96 rounded-md" />
        </div>
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="space-y-4">
              <Skeleton className="h-10 w-full rounded-lg" />
              <div className="grid grid-cols-2 gap-4">
                <Skeleton className="h-10 w-full rounded-lg" />
                <Skeleton className="h-10 w-full rounded-lg" />
              </div>
              <Skeleton className="h-10 w-full rounded-lg" />
              <div className="grid grid-cols-2 gap-4">
                <Skeleton className="h-10 w-full rounded-lg" />
                <Skeleton className="h-10 w-full rounded-lg" />
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <Skeleton className="h-6 w-32 mb-4" />
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="h-14 w-14 rounded-xl" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50/60 p-6 text-red-700 shadow-sm">
        <AlertCircle className="h-6 w-6 shrink-0 text-red-500" />
        <div>
          <h3 className="font-semibold text-red-900">Error al consultar configuración institucional</h3>
          <p className="mt-1 text-sm">{extraerMensajeError(error)}</p>
        </div>
      </div>
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
          <InstitucionForm institucion={institucion ?? null} />
        </div>
        <div className="lg:col-span-1">
          <InstitucionMediaUploader institucion={institucion ?? null} />
        </div>
      </div>
    </section>
  )
}
