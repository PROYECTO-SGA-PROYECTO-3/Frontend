import { useState } from "react";
import { CalendarCheck, Plus } from "lucide-react";
import { Button } from "@/shared/ui/Button";
import { DialogoConfirmacion } from "@/shared/ui/DialogoConfirmacion";
import { ToastNotificacion } from "@/shared/ui/ToastNotificacion";
import { useAniosLectivosQuery } from "../../hooks/useAniosLectivosQuery";
import { useAniosLectivosMutations } from "../../hooks/useAniosLectivosMutations";
import { AniosLectivosLista } from "./AniosLectivosLista";
import { CrearAnioLectivoModal } from "./CrearAnioLectivoModal";
import { PeriodosAnioModal } from "@/features/periodos";
import type { AnioLectivo } from "../../types";

export function AniosLectivosSection() {
	const [modalCrearAbierto, setModalCrearAbierto] = useState(false);
	const [anioAActivar, setAnioAActivar] = useState<AnioLectivo | null>(null);
	const [anioParaPeriodos, setAnioParaPeriodos] =
		useState<AnioLectivo | null>(null);
	const [toastMensaje, setToastMensaje] = useState<string | null>(null);

	const { anios, anioActivoActual, isLoading, errorCarga } =
		useAniosLectivosQuery();

	const handleExitoCrear = (creado: AnioLectivo) => {
		setModalCrearAbierto(false);
		setToastMensaje(`Año lectivo ${creado.anio} creado exitosamente.`);
	};

	const handleExitoActivar = (id: number) => {
		const anioActivado = anios.find((a) => a.id === id);
		setAnioAActivar(null);
		setToastMensaje(
			anioActivado
				? `Año lectivo ${anioActivado.anio} activado como año corriente.`
				: "Año lectivo activado como año corriente.",
		);
	};

	const {
		crearAnio,
		creando,
		errorCrear,
		limpiarErrorCrear,
		activarAnio,
		activando,
		errorActivar,
		limpiarErrorActivar,
	} = useAniosLectivosMutations({
		onExitoCrear: handleExitoCrear,
		onExitoActivar: handleExitoActivar,
	});

	const handleAbrirModalCrear = () => {
		limpiarErrorCrear();
		setModalCrearAbierto(true);
	};

	const handleCerrarModalCrear = () => {
		if (!creando) {
			limpiarErrorCrear();
			setModalCrearAbierto(false);
		}
	};

	const handleSolicitarActivacion = (anio: AnioLectivo) => {
		limpiarErrorActivar();
		setAnioAActivar(anio);
	};

	const handleConfirmarActivacion = () => {
		if (anioAActivar) {
			activarAnio(anioAActivar.id);
		}
	};

	const handleCancelarActivacion = () => {
		if (!activando) {
			limpiarErrorActivar();
			setAnioAActivar(null);
		}
	};

	const handleAbrirPeriodos = (anio: AnioLectivo) => {
		setAnioParaPeriodos(anio);
	};

	const handleCerrarPeriodos = () => {
		setAnioParaPeriodos(null);
	};

	const handleCerrarToast = () => {
		setToastMensaje(null);
	};

	return (
		<section className="flex flex-col gap-6 pt-6 border-t border-slate-200">
			{/* Encabezado con acción directa */}
			<div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
				<div>
					<div className="flex items-center gap-2.5">
						<div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50 text-brand-700 shadow-inner">
							<CalendarCheck size={20} />
						</div>
						<h2 className="text-xl font-bold tracking-tight text-slate-900">
							Años Lectivos del Plantel
						</h2>
					</div>
					<p className="mt-1.5 max-w-2xl text-sm text-slate-500">
						Solo puede haber un año académico activo a la vez, el cual determina los
						periodos y operaciones corrientes. Los demás años permanecen en modo
						consulta histórica.
					</p>
				</div>

				<div className="shrink-0">
					<Button
						type="button"
						variant="primary"
						onClick={handleAbrirModalCrear}
						className="w-full sm:w-auto"
					>
						<Plus size={16} />
						Nuevo Año Lectivo
					</Button>
				</div>
			</div>

			{/* Listado protegido de años lectivos */}
			<div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition hover:shadow-md">
				<AniosLectivosLista
					isLoading={isLoading}
					errorCarga={errorCarga}
					anios={anios}
					onGestionarPeriodos={handleAbrirPeriodos}
					onActivarAnio={handleSolicitarActivacion}
				/>
			</div>

			{/* Modal para crear año lectivo */}
			<CrearAnioLectivoModal
				abierto={modalCrearAbierto}
				creando={creando}
				errorCrear={errorCrear}
				onSubmit={crearAnio}
				onCerrar={handleCerrarModalCrear}
			/>

			{/* Diálogo de confirmación para activar año */}
			<DialogoConfirmacion
				abierto={Boolean(anioAActivar)}
				titulo="Activar año lectivo"
				mensaje={
					anioAActivar
						? `¿Confirmas que deseas activar el año ${anioAActivar.anio}? El año actualmente activo (${anioActivoActual?.anio ?? "ninguno"}) pasará a histórico y todas las operaciones institucionales operarán bajo ${anioAActivar.anio}.`
						: ""
				}
				error={errorActivar ?? undefined}
				procesando={activando}
				textoConfirmar="Activar Año"
				varianteConfirmar="primary"
				onConfirmar={handleConfirmarActivacion}
				onCancelar={handleCancelarActivacion}
			/>

			{/* Modal de Periodos del Año */}
			{anioParaPeriodos && (
				<PeriodosAnioModal
					anio={anioParaPeriodos}
					esActivo={Boolean(
						anioActivoActual && anioParaPeriodos.id === anioActivoActual.id,
					)}
					onCerrar={handleCerrarPeriodos}
				/>
			)}

			{/* Notificación flotante de confirmación */}
			{toastMensaje && (
				<ToastNotificacion
					mensaje={toastMensaje}
					tipo="exito"
					onCerrar={handleCerrarToast}
				/>
			)}
		</section>
	);
}
