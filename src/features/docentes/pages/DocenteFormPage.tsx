import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, IdCard, Pencil, Plus, Save, User } from "lucide-react";
import { Navbar } from "@/layouts";
import { Button, Input, Skeleton } from "@/shared/ui";
import {
	crearEsquemaDocente,
	useDocenteDetalle,
	useDocenteMutations,
	type DocenteFormValores,
} from "../hooks";
import { DocenteFirmaUploader } from "../components/DocenteFirmaUploader";

export default function DocenteFormPage() {
	const navigate = useNavigate();
	const { id } = useParams<{ id: string }>();
	const docenteId = id ? Number(id) : null;
	const esEdicion = Boolean(docenteId && !Number.isNaN(docenteId));

	const [errorEnvio, setErrorEnvio] = useState<string | null>(null);

	// 1. Consulta React Query si es modo edición
	const {
		docente,
		isLoading: cargandoDocente,
		error: errorCarga,
	} = useDocenteDetalle(docenteId);

	// 2. Mutaciones
	const { crearDocente, estaCreando, actualizarDocente, estaActualizando } =
		useDocenteMutations();

	// 3. Formulario con validación Zod y sincronización reactiva mediante values
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<DocenteFormValores>({
		resolver: zodResolver(crearEsquemaDocente(esEdicion)),
		values: docente
			? {
					primerNombre: docente.primerNombre,
					segundoNombre: docente.segundoNombre ?? "",
					primerApellido: docente.primerApellido,
					segundoApellido: docente.segundoApellido ?? "",
					documento: docente.documento,
					email: docente.email,
					contrasena: "",
				}
			: undefined,
		defaultValues: {
			primerNombre: "",
			segundoNombre: "",
			primerApellido: "",
			segundoApellido: "",
			documento: "",
			email: "",
			contrasena: "",
		},
	});

	// Envío del formulario
	const onSubmit = async (valores: DocenteFormValores) => {
		setErrorEnvio(null);
		try {
			if (esEdicion && docenteId) {
				await actualizarDocente({
					id: docenteId,
					datos: {
						primerNombre: valores.primerNombre,
						segundoNombre: valores.segundoNombre || undefined,
						primerApellido: valores.primerApellido,
						segundoApellido: valores.segundoApellido || undefined,
					},
				});
			} else {
				await crearDocente({
					primerNombre: valores.primerNombre,
					segundoNombre: valores.segundoNombre || undefined,
					primerApellido: valores.primerApellido,
					segundoApellido: valores.segundoApellido || undefined,
					documento: valores.documento ?? "",
					email: valores.email ?? "",
					contrasena: valores.contrasena ?? "",
				});
			}
			navigate("/admin/docentes");
		} catch (err: unknown) {
			setErrorEnvio(
				err instanceof Error ? err.message : "Error al procesar el formulario.",
			);
		}
	};

	const estaGuardando = estaCreando || estaActualizando;

	return (
		<div className="flex min-h-screen flex-col bg-slate-50/50">
			<Navbar
				titulo="Docentes"
				subtitulo={
					esEdicion
						? "Administración › Editar docente"
						: "Administración › Nuevo docente"
				}
				sistemaEnLinea
			/>

			<main className="mx-auto w-full max-w-4xl flex-1 space-y-6 p-6 md:p-8 xl:p-10">
				{/* Enlace de retorno */}
				<div>
					<Link
						to="/admin/docentes"
						className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition"
					>
						<ArrowLeft size={16} />
						Volver al listado de docentes
					</Link>
				</div>

				{/* Encabezado del formulario */}
				<section className="flex items-center gap-3">
					<div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 border border-brand-100">
						{esEdicion ? <Pencil size={24} /> : <Plus size={24} />}
					</div>
					<div>
						<h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
							{esEdicion ? "Editar Información Docente" : "Registrar Nuevo Docente"}
						</h1>
						<p className="text-sm font-medium text-slate-500">
							{esEdicion
								? "Actualiza los nombres y apellidos del profesor. La identificación y correo son fijos."
								: "Completa los datos de identidad y credenciales para dar de alta al docente."}
						</p>
					</div>
				</section>

				{errorCarga ? (
					<div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-sm text-red-700">
						{errorCarga}
					</div>
				) : cargandoDocente ? (
					<div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-8">
						<Skeleton className="h-6 w-48" />
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
							<Skeleton className="h-10 w-full" />
							<Skeleton className="h-10 w-full" />
							<Skeleton className="h-10 w-full" />
							<Skeleton className="h-10 w-full" />
						</div>
					</div>
				) : (
					<div className="space-y-6">
						{/* Formulario de Datos Personales */}
						<form
							onSubmit={handleSubmit(onSubmit)}
							noValidate
							className="rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs"
						>
							<div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
								<div className="flex h-8 w-8 items-center justify-center rounded-xl bg-accent-100 text-accent-700">
									<User size={18} />
								</div>
								<h2 className="text-base font-bold text-slate-900">
									Datos Personales y de Identidad
								</h2>
							</div>

							<div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
								<Input
									label="Primer Nombre *"
									placeholder="Ej. Carlos"
									error={errors.primerNombre?.message}
									{...register("primerNombre")}
								/>

								<Input
									label="Segundo Nombre (Opcional)"
									placeholder="Ej. Alberto"
									error={errors.segundoNombre?.message}
									{...register("segundoNombre")}
								/>

								<Input
									label="Primer Apellido *"
									placeholder="Ej. Mendoza"
									error={errors.primerApellido?.message}
									{...register("primerApellido")}
								/>

								<Input
									label="Segundo Apellido (Opcional)"
									placeholder="Ej. Gómez"
									error={errors.segundoApellido?.message}
									{...register("segundoApellido")}
								/>

								{esEdicion ? (
									<>
										<Input
											label="Número de Identificación (CC)"
											value={docente?.documento ?? ""}
											disabled
											icon={<IdCard size={18} />}
										/>
										<Input
											label="Correo Institucional"
											value={docente?.email ?? ""}
											disabled
										/>
									</>
								) : (
									<>
										<Input
											label="Número de Identificación (CC) *"
											placeholder="Ej. 1098765432"
											error={errors.documento?.message}
											icon={<IdCard size={18} />}
											{...register("documento")}
										/>

										<Input
											label="Correo Institucional *"
											placeholder="docente@montclar.edu.co"
											type="email"
											error={errors.email?.message}
											{...register("email")}
										/>

										<div className="sm:col-span-2">
											<Input
												label="Contraseña Inicial *"
												type="password"
												placeholder="Mínimo 8 caracteres"
												error={errors.contrasena?.message}
												{...register("contrasena")}
											/>
											<p className="mt-1 text-xs text-slate-400">
												El docente podrá cambiar su contraseña al iniciar sesión en su
												panel.
											</p>
										</div>
									</>
								)}
							</div>

							{errorEnvio && (
								<div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700">
									{errorEnvio}
								</div>
							)}

							{/* Botones de acción */}
							<div className="mt-8 flex items-center justify-end gap-3 border-t border-slate-100 pt-5">
								<Button
									type="button"
									variant="secondary"
									onClick={() => navigate("/admin/docentes")}
									disabled={estaGuardando}
								>
									Cancelar
								</Button>
								<Button type="submit" isLoading={estaGuardando}>
									<Save size={18} />
									{esEdicion ? "Guardar Cambios" : "Registrar Docente"}
								</Button>
							</div>
						</form>

						{/* Módulo de Firma Digital (disponible en modo edición) */}
						{esEdicion && docenteId && (
							<DocenteFirmaUploader
								docenteId={docenteId}
								firmaActualUrl={docente?.firmaUrl ?? null}
							/>
						)}
					</div>
				)}
			</main>

			{/* Pie institucional */}
			<footer className="mt-auto border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-500">
				&copy; {new Date().getFullYear()} Institución Educativa Agrícola Fray
				Isidoro de Montclar &bull; Sistema de Gestión Académica (SGA)
			</footer>
		</div>
	);
}
