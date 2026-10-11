import { useState } from "react";
import { CheckCircle2, School } from "lucide-react";
import { PageHeader } from "@/layouts";
import { ErrorState } from "@/shared/ui";
import type { Grado, SolicitudGrado } from "@/shared/types/academico.types";
import { useCursos, useCursoMutations, useFiltroCursos } from "../hooks";
import {
	CursosToolbar,
	CursosTable,
	CursosEmptyState,
	CursosSkeleton,
	CursoModal,
	EliminarCursoDialog,
} from "../components";

export function CursosPage() {
	// 1. Consulta del catálogo mediante React Query
	const { cursos, isLoading, isError, error, refetch } = useCursos();

	// 2. Mutaciones con el servidor
	const {
		crearCurso,
		estaCreando,
		actualizarCurso,
		estaActualizando,
		eliminarCurso,
		estaEliminando,
	} = useCursoMutations();

	// 3. Filtrado y ordenamiento en cliente
	const {
		busqueda,
		setBusqueda,
		estadoDirector,
		setEstadoDirector,
		orden,
		setOrden,
		cursosFiltrados,
		totalCursos,
		totalFiltrados,
		hayFiltroActivo,
		limpiarFiltros,
	} = useFiltroCursos(cursos);

	// 4. Estados de modales y diálogos
	const [modalAbierto, setModalAbierto] = useState(false);
	const [cursoEnEdicion, setCursoEnEdicion] = useState<Grado | null>(null);
	const [cursoAEliminar, setCursoAEliminar] = useState<Grado | null>(null);
	const [errorServidorModal, setErrorServidorModal] = useState<string | null>(
		null,
	);
	const [errorEliminacion, setErrorEliminacion] = useState<string | null>(null);
	const [mensajeExito, setMensajeExito] = useState<string | null>(null);

	const mostrarExitoTemporal = (mensaje: string) => {
		setMensajeExito(mensaje);
		setTimeout(() => {
			setMensajeExito(null);
		}, 4000);
	};

	// Validación local de nombres duplicados
	const existeDuplicado = (nombre: string, ignorarId?: number) => {
		const nombreNormalizado = nombre.trim().toLowerCase();
		return cursos.some(
			(c) =>
				c.nombre.trim().toLowerCase() === nombreNormalizado && c.id !== ignorarId,
		);
	};

	// Manejadores de creación y edición
	const handleAbrirCrear = () => {
		setCursoEnEdicion(null);
		setErrorServidorModal(null);
		setModalAbierto(true);
	};

	const handleAbrirEditar = (curso: Grado) => {
		setCursoEnEdicion(curso);
		setErrorServidorModal(null);
		setModalAbierto(true);
	};

	const handleCerrarModal = () => {
		setModalAbierto(false);
		setCursoEnEdicion(null);
		setErrorServidorModal(null);
	};

	const handleGuardarCurso = async (datos: SolicitudGrado) => {
		setErrorServidorModal(null);
		try {
			if (cursoEnEdicion) {
				await actualizarCurso({ id: cursoEnEdicion.id, datos });
				mostrarExitoTemporal(
					`El grado "${datos.nombre}" ha sido actualizado exitosamente.`,
				);
			} else {
				await crearCurso(datos);
				mostrarExitoTemporal(
					`El grado "${datos.nombre}" ha sido registrado exitosamente.`,
				);
			}
			handleCerrarModal();
		} catch (err: unknown) {
			setErrorServidorModal(
				err instanceof Error
					? err.message
					: "Error al guardar los datos del curso.",
			);
		}
	};

	// Manejadores de eliminación
	const handleAbrirEliminar = (curso: Grado) => {
		setCursoAEliminar(curso);
		setErrorEliminacion(null);
	};

	const handleCerrarEliminar = () => {
		setCursoAEliminar(null);
		setErrorEliminacion(null);
	};

	const handleConfirmarEliminar = async () => {
		if (!cursoAEliminar) return;
		setErrorEliminacion(null);
		try {
			await eliminarCurso(cursoAEliminar.id);
			mostrarExitoTemporal(
				`El grado "${cursoAEliminar.nombre}" ha sido eliminado del catálogo.`,
			);
			handleCerrarEliminar();
		} catch (err: unknown) {
			setErrorEliminacion(
				err instanceof Error
					? err.message
					: "No se pudo eliminar el grado. Verifica que no tenga dependencias activas.",
			);
		}
	};

	return (
		<div className="min-h-screen bg-slate-50/60 pb-16">
			{/* Cabecera institucional de la página */}
			<PageHeader raiz="Portal Académico" seccionActual="Catálogo de Cursos" />

			<main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 space-y-6">
				{/* Banner de bienvenida / Jerarquía de contexto */}
				<div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
					<div>
						<h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2.5">
							<School className="text-brand-700" size={26} aria-hidden="true" />
							<span>Catálogo de Cursos y Grados</span>
						</h1>
						<p className="mt-1 text-sm text-slate-500">
							Parametriza los grados escolares oficiales que se dictan en la
							institución educativa.
						</p>
					</div>
				</div>

				{/* Notificación de éxito flotante / temporal */}
				{mensajeExito && (
					<div
						role="status"
						aria-live="polite"
						className="flex items-center gap-3 rounded-2xl border border-brand-200 bg-brand-50 p-4 text-sm font-medium text-brand-900 shadow-sm animate-in fade-in slide-in-from-top-2 duration-200"
					>
						<CheckCircle2
							size={20}
							className="text-brand-600 shrink-0"
							aria-hidden="true"
						/>
						<span>{mensajeExito}</span>
					</div>
				)}

				{/* Estado de carga */}
				{isLoading && <CursosSkeleton />}

				{/* Estado de error de red */}
				{isError && (
					<ErrorState
						mensaje={error ?? "Ocurrió un error al cargar el catálogo de cursos."}
						onRetry={() => refetch()}
					/>
				)}

				{/* Contenido principal cuando no hay carga ni error */}
				{!isLoading && !isError && (
					<div className="space-y-5">
						{/* Barra de herramientas (Buscador, Filtros, Botón Crear) */}
						<CursosToolbar
							busqueda={busqueda}
							onBusquedaChange={setBusqueda}
							estadoDirector={estadoDirector}
							onEstadoDirectorChange={setEstadoDirector}
							orden={orden}
							onOrdenChange={setOrden}
							totalCursos={totalCursos}
							totalFiltrados={totalFiltrados}
							onNuevoCurso={handleAbrirCrear}
						/>

						{/* Caso 1: Catálogo vacío en base de datos */}
						{totalCursos === 0 && (
							<CursosEmptyState esBusqueda={false} onNuevoCurso={handleAbrirCrear} />
						)}

						{/* Caso 2: Búsqueda sin coincidencias */}
						{totalCursos > 0 && totalFiltrados === 0 && (
							<CursosEmptyState
								esBusqueda={hayFiltroActivo}
								onLimpiarFiltros={limpiarFiltros}
							/>
						)}

						{/* Caso 3: Tabla con registros */}
						{totalFiltrados > 0 && (
							<CursosTable
								cursos={cursosFiltrados}
								onEditar={handleAbrirEditar}
								onEliminar={handleAbrirEliminar}
							/>
						)}
					</div>
				)}
			</main>

			{/* Modal de Creación / Edición */}
			<CursoModal
				abierto={modalAbierto}
				cursoAEditar={cursoEnEdicion}
				guardando={estaCreando || estaActualizando}
				errorServidor={errorServidorModal}
				existeDuplicado={existeDuplicado}
				onGuardar={handleGuardarCurso}
				onCerrar={handleCerrarModal}
			/>

			{/* Diálogo de Confirmación para Eliminar */}
			<EliminarCursoDialog
				abierto={Boolean(cursoAEliminar)}
				curso={cursoAEliminar}
				procesando={estaEliminando}
				error={errorEliminacion}
				onConfirmar={handleConfirmarEliminar}
				onCancelar={handleCerrarEliminar}
			/>
		</div>
	);
}
