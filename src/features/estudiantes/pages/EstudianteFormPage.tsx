import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Pencil, Plus } from "lucide-react";
import { Navbar } from "@/layouts";
import { ErrorState, Skeleton } from "@/shared/ui";
import {
	useEstudianteDetalle,
	useEstudianteMutations,
	type EstudianteFormValores,
} from "../hooks";
import { EstudianteForm } from "../components";

export function EstudianteFormPage() {
	const navigate = useNavigate();
	const { id } = useParams<{ id: string }>();
	const estudianteId = id ? Number(id) : null;
	const esEdicion = Boolean(estudianteId && !Number.isNaN(estudianteId));

	const [errorEnvio, setErrorEnvio] = useState<string | null>(null);

	// 1. Consulta React Query si es modo edición
	const {
		estudiante,
		isLoading: cargandoEstudiante,
		error: errorCarga,
		refetch,
	} = useEstudianteDetalle(estudianteId);

	// 2. Mutaciones con invalidación de caché reactiva
	const {
		crearEstudiante,
		estaCreando,
		actualizarEstudiante,
		estaActualizando,
	} = useEstudianteMutations();

	// 3. Envío del formulario
	const handleSubmit = async (valores: EstudianteFormValores) => {
		setErrorEnvio(null);
		try {
			if (esEdicion && estudianteId) {
				await actualizarEstudiante({
					id: estudianteId,
					datos: {
						primerNombre: valores.primerNombre.trim(),
						segundoNombre: valores.segundoNombre?.trim() || undefined,
						primerApellido: valores.primerApellido.trim(),
						segundoApellido: valores.segundoApellido?.trim() || undefined,
					},
				});
			} else {
				await crearEstudiante({
					primerNombre: valores.primerNombre.trim(),
					segundoNombre: valores.segundoNombre?.trim() || undefined,
					primerApellido: valores.primerApellido.trim(),
					segundoApellido: valores.segundoApellido?.trim() || undefined,
					documento: valores.documento?.trim() ?? "",
					email: valores.email?.trim() ?? "",
					contrasena: valores.contrasena ?? "",
				});
			}
			navigate("/admin/estudiantes");
		} catch (err: unknown) {
			setErrorEnvio(
				err instanceof Error
					? err.message
					: "Ocurrió un error al procesar el registro del estudiante.",
			);
		}
	};

	const estaGuardando = estaCreando || estaActualizando;

	return (
		<div className="flex flex-1 flex-col bg-slate-50/50">
			<Navbar
				titulo="Estudiantes"
				subtitulo={
					esEdicion
						? "Administración › Editar estudiante"
						: "Administración › Nuevo estudiante"
				}
				sistemaEnLinea
			/>

			<main className="mx-auto w-full max-w-4xl flex-1 space-y-6 p-6 md:p-8 xl:p-10">
				{/* Enlace de retorno al listado */}
				<div>
					<Link
						to="/admin/estudiantes"
						className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition"
					>
						<ArrowLeft size={16} />
						Volver al listado de estudiantes
					</Link>
				</div>

				{/* Encabezado semántico del formulario */}
				<section className="flex items-center gap-3">
					<div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 border border-brand-100">
						{esEdicion ? <Pencil size={24} /> : <Plus size={24} />}
					</div>
					<div>
						<h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
							{esEdicion
								? "Editar Información del Estudiante"
								: "Registrar Nuevo Estudiante"}
						</h1>
						<p className="text-sm font-medium text-slate-500">
							{esEdicion
								? "Actualiza los nombres y apellidos del alumno. La identificación es fija."
								: "Completa los datos de identidad y credenciales para registrar al estudiante en el sistema."}
						</p>
					</div>
				</section>

				{/* Estado de error de carga en edición */}
				{errorCarga ? (
					<ErrorState
						titulo="No se pudo cargar la información del estudiante"
						mensaje={errorCarga}
						onRetry={() => refetch()}
						variant="card"
					/>
				) : cargandoEstudiante ? (
					<div className="space-y-6 rounded-2xl border border-slate-200 bg-white p-8">
						<Skeleton className="h-6 w-48" />
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
							<Skeleton className="h-10 w-full rounded-lg" />
							<Skeleton className="h-10 w-full rounded-lg" />
							<Skeleton className="h-10 w-full rounded-lg" />
							<Skeleton className="h-10 w-full rounded-lg" />
						</div>
					</div>
				) : (
					<EstudianteForm
						estudianteInicial={estudiante}
						esEdicion={esEdicion}
						estaGuardando={estaGuardando}
						errorEnvio={errorEnvio}
						onSubmit={handleSubmit}
						onCancelar={() => navigate("/admin/estudiantes")}
					/>
				)}
			</main>
		</div>
	);
}
