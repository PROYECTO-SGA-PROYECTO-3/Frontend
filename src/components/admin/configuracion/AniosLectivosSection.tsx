import { CalendarCheck, AlertCircle } from 'lucide-react'
import { Skeleton } from '@/shared/ui/Skeleton'
import { DialogoConfirmacion } from '@/shared/ui/DialogoConfirmacion'
import { useGestionAniosLectivos } from '@/hooks/admin/configuracion/useGestionAniosLectivos'
import { CrearAnioLectivoForm } from './CrearAnioLectivoForm'
import { AnioLectivoFila } from './AnioLectivoFila'
import { PeriodosAnioModal } from './PeriodosAnioModal'

export function AniosLectivosSection() {
  const {
    anios,
    anioActivoActual,
    isLoading,
    errorCarga,
    anioNuevo,
    setAnioNuevo,
    activarAlCrear,
    setActivarAlCrear,
    errorCrear,
    creando,
    manejarSubmitCrear,
    anioAActivar,
    errorActivar,
    activando,
    solicitarActivacion,
    confirmarActivacion,
    cancelarActivacion,
    anioParaPeriodos,
    abrirPeriodos,
    cerrarPeriodos,
  } = useGestionAniosLectivos()

  return (
    <section className="flex flex-col gap-6 pt-6 border-t border-slate-200">
      <div>
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
            <CalendarCheck size={20} />
          </div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            Años Lectivos del Plantel
          </h2>
        </div>
        <p className="mt-1.5 text-sm text-slate-500">
          Solo puede haber un año académico activo a la vez, el cual determina los periodos y
          operaciones corrientes. Los demás años permanecen en modo consulta histórica.
        </p>
      </div>

      {/* Formulario de creación */}
      <CrearAnioLectivoForm
        anioNuevo={anioNuevo}
        activarAlCrear={activarAlCrear}
        creando={creando}
        errorCrear={errorCrear}
        onAnioNuevoChange={setAnioNuevo}
        onActivarAlCrearChange={setActivarAlCrear}
        onSubmit={manejarSubmitCrear}
      />

      {/* Listado de años */}
      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
        {isLoading ? (
          <div className="p-6 space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-8 w-40 rounded-lg" />
              </div>
            ))}
          </div>
        ) : errorCarga ? (
          <div className="p-6 text-center text-sm text-red-600">
            <AlertCircle size={24} className="mx-auto mb-2 text-red-500" />
            <p>Error al cargar los años lectivos: {errorCarga}</p>
          </div>
        ) : anios.length === 0 ? (
          <div className="p-10 text-center text-sm text-slate-400">
            No hay años lectivos registrados en el sistema.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {[...anios]
              .sort((a, b) => b.anio - a.anio)
              .map((anio) => (
                <AnioLectivoFila
                  key={anio.id}
                  anio={anio}
                  onGestionarPeriodos={abrirPeriodos}
                  onActivarAnio={solicitarActivacion}
                />
              ))}
          </div>
        )}
      </div>

      {/* Diálogo de Confirmación para activar año */}
      <DialogoConfirmacion
        abierto={Boolean(anioAActivar)}
        titulo="Activar año lectivo"
        mensaje={
          anioAActivar
            ? `¿Confirmas que deseas activar el año ${anioAActivar.anio}? El año actualmente activo (${anioActivoActual?.anio ?? 'ninguno'}) pasará a histórico y todas las operaciones institucionales operarán bajo ${anioAActivar.anio}.`
            : ''
        }
        error={errorActivar ?? undefined}
        procesando={activando}
        textoConfirmar="Activar Año"
        onConfirmar={confirmarActivacion}
        onCancelar={cancelarActivacion}
      />

      {/* Modal de Periodos del Año */}
      {anioParaPeriodos && (
        <PeriodosAnioModal
          anio={anioParaPeriodos}
          esActivo={Boolean(anioActivoActual && anioParaPeriodos.id === anioActivoActual.id)}
          onCerrar={cerrarPeriodos}
        />
      )}
    </section>
  )
}
