import { useState } from "react";
import { PageHeader } from "@/layouts";
import { DialogoConfirmacion, ErrorState } from "@/shared/ui";
import { CheckCircle2 } from "lucide-react";
import {
	useCatalogoMaterias,
	useMateriaMutations,
	useFiltroMaterias,
	useValidacionMateria,
} from "../hooks";
import { MateriasStats } from "../components/MateriasStats";
import { MateriasToolbar } from "../components/MateriasToolbar";
import { MateriasTable } from "../components/MateriasTable";
import { MateriaModal } from "../components/MateriaModal";
import { MateriasSkeleton } from "../components/MateriasSkeleton";
import { MateriasEmptyState } from "../components/MateriasEmptyState";
import type { Asignatura } from "../types";

export default function MateriasPage() {
	// 1. Estado del servidor y consulta de catálogo
	const { asignaturas, isLoading, isError, error, refetch } =
		useCatalogoMaterias();

	// 2. Operaciones de mutación con el backend
	const {
		crearMateria,
		estaCreando,
		actualizarMateria,
		estaActualizando,
		eliminarMateria,
		estaEliminando,
	} = useMateriaMutations();

	// 3. Filtrado y ordenamiento en cliente
	const {
		busqueda,
		setBusqueda,
		orden,
		setOrden,
		materiasFiltradas,
		totalMaterias,
		totalFiltradas,
		hayFiltroActivo,
	} = useFiltroMaterias(asignaturas);

	// 4. Validaciones de negocio en cliente
	const { existeNombreDuplicado } = useValidacionMateria(asignaturas);

	// Estados de modales y diálogos
	const [modalAbierto, setModalAbierto] = useState(false);
	const [materiaEnEdicion, setMateriaEnEdicion] = useState<Asignatura | null>(
		null,
	);
	const [materiaAEliminar, setMateriaAEliminar] = useState<Asignatura | null>(
		null,
	);
	const [errorServidorModal, setErrorServidorModal] = useState<string | null>(
		null,
	);
	const [errorEliminacion, setErrorEliminacion] = useState<string | null>(null);

	// Notificación de éxito temporal
	const [mensajeExito, setMensajeExito] = useState<string | null>(null);

	const mostrarExitoTemporal = (mensaje: string) => {
		setMensajeExito(mensaje);
		setTimeout(() => {
			setMensajeExito(null);
		}, 4000);
	};

	// Manejadores de creación / edición
	const handleAbrirCrear = () => {
		setMateriaEnEdicion(null);
		setErrorServidorModal(null);
		setModalAbierto(true);
	};

	const handleAbrirEditar = (materia: Asignatura) => {
		setMateriaEnEdicion(materia);
		setErrorServidorModal(null);
		setModalAbierto(true);
	};

	const handleCerrarModal = () => {
		setModalAbierto(false);
		setMateriaEnEdicion(null);
		setErrorServidorModal(null);
	};

	const handleGuardarMateria = async (nombre: string) => {
		setErrorServidorModal(null);
		try {
			if (materiaEnEdicion) {
				await actualizarMateria({ id: materiaEnEdicion.id, datos: { nombre } });
				handleCerrarModal();
				mostrarExitoTemporal(`Asignatura "${nombre}" actualizada correctamente.`);
			} else {
				await crearMateria({ nombre });
				handleCerrarModal();
				mostrarExitoTemporal(
					`Asignatura "${nombre}" registrada con éxito en el catálogo.`,
				);
			}
		} catch (err: unknown) {
			const errorMsg =
				err instanceof Error
					? err.message
					: "No fue posible guardar la asignatura.";
			setErrorServidorModal(errorMsg);
		}
	};

	// Manejadores de eliminación
	const handleConfirmarEliminar = async () => {
		if (!materiaAEliminar) return;
		setErrorEliminacion(null);
		try {
			await eliminarMateria(materiaAEliminar.id);
			const nombreEliminado = materiaAEliminar.nombre;
			setMateriaAEliminar(null);
			mostrarExitoTemporal(
				`Asignatura "${nombreEliminado}" eliminada del catálogo.`,
			);
		} catch (err: unknown) {
			const errorMsg =
				err instanceof Error
					? err.message
					: "No se pudo eliminar la asignatura. Asegúrate de que no tenga cargas académicas asignadas.";
			setErrorEliminacion(errorMsg);
		}
	};

	return (
		<div className="flex flex-1 flex-col bg-slate-50/50">
			<PageHeader
				raiz="Portal Administrativo"
				seccionActual="Materias"
			/>

			<main className="mx-auto w-full max-w-7xl flex-1 space-y-8 p-6 md:p-8 xl:p-10">
				{/* Notificación de éxito flotante (sin Layout Shift) */}
				{mensajeExito && (
					<div
						role="status"
						className="fixed bottom-6 right-6 z-50 flex max-w-md items-center justify-between gap-3 rounded-xl border border-brand-200 bg-white/95 p-4 text-sm text-slate-800 shadow-xl backdrop-blur-xs animate-in fade-in slide-in-from-bottom-3 duration-300"
					>
						<div className="flex items-center gap-2.5">
							<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
								<CheckCircle2 size={18} />
							</div>
							<span className="font-medium text-slate-900">{mensajeExito}</span>
						</div>
						<button
							type="button"
							onClick={() => setMensajeExito(null)}
							aria-label="Cerrar notificación"
							className="cursor-pointer rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 text-lg leading-none"
						>
							&times;
						</button>
					</div>
				)}

				{/* Encabezado y resumen del dominio */}
				<section className="flex flex-col gap-1">
					<h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
						Catálogo Maestro de Asignaturas
					</h1>
					<p className="text-sm font-medium text-slate-500">
						Administra las materias oficiales que componen el plan de estudios del
						colegio. Cada materia podrá ser posteriormente asignada a los docentes y
						grados en la carga académica.
					</p>
				</section>

				{/* Estadísticas del catálogo */}
				<MateriasStats
					totalMaterias={totalMaterias}
					totalFiltradas={totalFiltradas}
					hayFiltroActivo={hayFiltroActivo}
				/>

				{/* Barra de herramientas: Búsqueda, Orden y Botón de creación */}
				<MateriasToolbar
					busqueda={busqueda}
					orden={orden}
					onCambioBusqueda={setBusqueda}
					onCambioOrden={setOrden}
					onCrear={handleAbrirCrear}
				/>

				{/* Contenido principal: Lista, Skeletons, Error o Estado Vacío */}
				<section aria-label="Listado de asignaturas">
					{isLoading ? (
						<MateriasSkeleton cantidad={6} />
					) : isError ? (
						<ErrorState
							titulo="Error al cargar el catálogo de materias"
							mensaje={error}
							onRetry={() => refetch()}
						/>
					) : asignaturas.length === 0 ? (
						<MateriasEmptyState esBusqueda={false} onCrear={handleAbrirCrear} />
					) : materiasFiltradas.length === 0 ? (
						<MateriasEmptyState
							esBusqueda={true}
							terminoBusqueda={busqueda}
							onCrear={handleAbrirCrear}
							onLimpiarBusqueda={() => setBusqueda("")}
						/>
					) : (
						<MateriasTable
							materias={materiasFiltradas}
							onEditar={handleAbrirEditar}
							onEliminar={setMateriaAEliminar}
						/>
					)}
				</section>
			</main>

			{/* Modal accesible de Creación y Edición */}
			{modalAbierto && (
				<MateriaModal
					key={materiaEnEdicion ? `editar-${materiaEnEdicion.id}` : "nueva"}
					abierto={modalAbierto}
					materiaAEditar={materiaEnEdicion}
					guardando={estaCreando || estaActualizando}
					errorServidor={errorServidorModal}
					existeDuplicado={existeNombreDuplicado}
					onGuardar={handleGuardarMateria}
					onCerrar={handleCerrarModal}
				/>
			)}

			{/* Diálogo de confirmación para eliminación con advertencia de carga académica */}
			<DialogoConfirmacion
				abierto={Boolean(materiaAEliminar)}
				titulo="Eliminar Asignatura"
				mensaje={
					materiaAEliminar
						? `¿Confirmas la eliminación de "${materiaAEliminar.nombre}" del catálogo oficial? Si esta materia ya fue asignada a algún docente o grado en el año lectivo, la operación será rechazada por seguridad académica.`
						: ""
				}
				error={errorEliminacion ?? undefined}
				procesando={estaEliminando}
				textoConfirmar="Eliminar del catálogo"
				onConfirmar={handleConfirmarEliminar}
				onCancelar={() => {
					setMateriaAEliminar(null);
					setErrorEliminacion(null);
				}}
			/>
		</div>
	);
}

