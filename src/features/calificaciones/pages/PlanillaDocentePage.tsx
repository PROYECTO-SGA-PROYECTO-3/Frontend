import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, ClipboardList } from 'lucide-react'
import { PageHeader } from '@/layouts'
import { ErrorState } from '@/shared/ui/ErrorState'
import { Skeleton } from '@/shared/ui/Skeleton'
import { extraerMensajeError } from '@/shared/lib/axios'
import {
  descargarPlantilla,
  extraerErroresImportacion,
  extraerMensajeErrorDescargaPlantilla,
  previsualizarImportacion,
} from '../api/notasApi'
import { useCatalogoPlanilla } from '../hooks/useCatalogoPlanilla'
import { useNotasPlanilla } from '../hooks/useNotasPlanilla'
import { usePlanillaMutations } from '../hooks/usePlanillaMutations'
import { SelectorPlanilla } from '../components/SelectorPlanilla'
import { SubirPlanilla } from '../components/SubirPlanilla'
import { ConfirmacionImportacion } from '../components/ConfirmacionImportacion'
import { ResultadoImportacion } from '../components/ResultadoImportacion'
import { TablaNotasPlanilla } from '../components/TablaNotasPlanilla'
import type { ErrorFilaImportacion, ResultadoImportacionNotas, ResultadoPreviewImportacion } from '../types'

export function PlanillaDocentePage() {
  const { cargas, periodos, isLoading: cargandoCatalogo, isError: errorCatalogo, error: errCatalogo, refetch: reintentarCatalogo } = useCatalogoPlanilla()

  const [cargaAcademicaId, setCargaAcademicaId] = useState<number | ''>('')
  const [periodoId, setPeriodoId] = useState<number | ''>('')

  const {
    data: notas = [],
    isLoading: cargandoNotas,
    isError: errorNotas,
    error: errNotas,
    refetch: reintentarNotas,
  } = useNotasPlanilla(cargaAcademicaId, periodoId)

  const { importar, estaImportando } = usePlanillaMutations()

  const [descargando, setDescargando] = useState(false)
  const [errorDescarga, setErrorDescarga] = useState<string | null>(null)

  const [archivo, setArchivo] = useState<File | null>(null)
  const [previsualizando, setPrevisualizando] = useState(false)
  const [previsualizacion, setPrevisualizacion] = useState<ResultadoPreviewImportacion | null>(null)
  const [resultado, setResultado] = useState<ResultadoImportacionNotas | null>(null)
  const [erroresImportacion, setErroresImportacion] = useState<ErrorFilaImportacion[] | null>(null)
  const [errorImportacion, setErrorImportacion] = useState<string | null>(null)

  const limpiarResultadoImportacion = () => {
    setPrevisualizacion(null)
    setResultado(null)
    setErroresImportacion(null)
    setErrorImportacion(null)
  }

  const manejarCambiarCarga = (id: number | '') => {
    setCargaAcademicaId(id)
    setErrorDescarga(null)
    limpiarResultadoImportacion()
  }

  const manejarCambiarPeriodo = (id: number | '') => {
    setPeriodoId(id)
    setErrorDescarga(null)
    limpiarResultadoImportacion()
  }

  const manejarDescargarPlantilla = async () => {
    if (cargaAcademicaId === '' || periodoId === '') return

    setDescargando(true)
    setErrorDescarga(null)
    try {
      const { archivo: blob, nombreArchivo } = await descargarPlantilla(cargaAcademicaId, periodoId)
      const url = URL.createObjectURL(blob)
      const enlace = document.createElement('a')
      enlace.href = url
      enlace.download = nombreArchivo
      document.body.appendChild(enlace)
      enlace.click()
      document.body.removeChild(enlace)
      URL.revokeObjectURL(url)
    } catch (error) {
      setErrorDescarga(await extraerMensajeErrorDescargaPlantilla(error))
    } finally {
      setDescargando(false)
    }
  }

  const manejarPrevisualizar = async () => {
    if (cargaAcademicaId === '' || periodoId === '' || !archivo) return

    setPrevisualizando(true)
    limpiarResultadoImportacion()
    try {
      const datos = await previsualizarImportacion(cargaAcademicaId, periodoId, archivo)
      setPrevisualizacion(datos)
    } catch (error) {
      const errores = extraerErroresImportacion(error)
      if (errores && errores.length > 0) {
        setErroresImportacion(errores)
      } else {
        setErrorImportacion(extraerMensajeError(error))
      }
    } finally {
      setPrevisualizando(false)
    }
  }

  const manejarConfirmarImportacion = async () => {
    if (cargaAcademicaId === '' || periodoId === '' || !archivo) return

    try {
      const res = await importar({
        cargaAcademicaId,
        periodoId,
        archivo,
      })
      setResultado(res)
      setArchivo(null)
      setPrevisualizacion(null)
    } catch (error) {
      const errores = extraerErroresImportacion(error)
      if (errores && errores.length > 0) {
        setErroresImportacion(errores)
      } else {
        setErrorImportacion(extraerMensajeError(error))
      }
      setPrevisualizacion(null)
    }
  }

  return (
    <>
      <PageHeader raiz="Portal Docente" seccionActual="Planilla de Calificaciones" />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
        <Link
          to="/docente"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-brand-700 transition-colors"
        >
          <ArrowLeft size={16} />
          Volver al panel
        </Link>

        <section className="mt-4 flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600 shadow-xs">
              <ClipboardList size={22} />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">Planilla de Calificaciones</h1>
              <p className="mt-0.5 text-sm text-slate-500">
                Descarga la plantilla, registra las notas en Excel y sube el archivo para actualizar el curso.
              </p>
            </div>
          </div>
        </section>

        <div className="mt-6 flex flex-col gap-6">
          {errorCatalogo ? (
            <ErrorState
              titulo="Error al cargar asignaturas y periodos"
              mensaje={extraerMensajeError(errCatalogo)}
              onRetry={() => reintentarCatalogo()}
            />
          ) : cargandoCatalogo ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
              <Skeleton className="h-6 w-48" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Skeleton className="h-10 w-full rounded-xl" />
                <Skeleton className="h-10 w-full rounded-xl" />
              </div>
            </div>
          ) : cargas.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
                <ClipboardList size={24} />
              </div>
              <h3 className="mt-4 text-base font-bold text-slate-900">Sin asignaturas asignadas</h3>
              <p className="mt-1 text-sm text-slate-500">
                No tienes asignaturas a cargo en el año lectivo activo.
              </p>
            </div>
          ) : (
            <>
              <SelectorPlanilla
                cargas={cargas}
                periodos={periodos}
                cargaAcademicaId={cargaAcademicaId}
                periodoId={periodoId}
                onCambiarCarga={manejarCambiarCarga}
                onCambiarPeriodo={manejarCambiarPeriodo}
                onDescargarPlantilla={manejarDescargarPlantilla}
                descargando={descargando}
              />

              {errorDescarga && (
                <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                  {errorDescarga}
                </div>
              )}

              <SubirPlanilla
                archivo={archivo}
                onCambiarArchivo={(nuevoArchivo) => {
                  setArchivo(nuevoArchivo)
                  limpiarResultadoImportacion()
                }}
                onPrevisualizar={manejarPrevisualizar}
                puedeSubir={cargaAcademicaId !== '' && periodoId !== '' && archivo !== null && !previsualizando}
                previsualizando={previsualizando}
              />

              {previsualizacion && (
                <ConfirmacionImportacion
                  previsualizacion={previsualizacion}
                  confirmando={estaImportando}
                  onConfirmar={manejarConfirmarImportacion}
                  onCancelar={() => setPrevisualizacion(null)}
                />
              )}

              <ResultadoImportacion
                resultado={resultado}
                errores={erroresImportacion}
                mensajeError={errorImportacion}
              />

              {errorNotas ? (
                <ErrorState
                  titulo="Error al cargar las calificaciones del curso"
                  mensaje={extraerMensajeError(errNotas)}
                  onRetry={() => reintentarNotas()}
                />
              ) : (
                <TablaNotasPlanilla
                  notas={notas}
                  isLoading={cargandoNotas}
                />
              )}
            </>
          )}
        </div>
      </main>
    </>
  )
}

export default PlanillaDocentePage
