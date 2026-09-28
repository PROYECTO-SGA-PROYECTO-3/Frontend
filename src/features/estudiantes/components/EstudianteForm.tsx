import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { IdCard, Lock, Mail, Save, User } from "lucide-react";
import { Button, Input } from "@/shared/ui";
import {
	crearEsquemaEstudiante,
	type EstudianteFormValores,
} from "../hooks/useValidacionEstudiante";
import type { Estudiante } from "../types";

interface EstudianteFormProps {
	estudianteInicial?: Estudiante | null;
	esEdicion: boolean;
	estaGuardando: boolean;
	errorEnvio?: string | null;
	onSubmit: (valores: EstudianteFormValores) => Promise<void>;
	onCancelar: () => void;
}

/** Configuración estructurada para los campos de datos personales */
const CAMPOS_PERSONALES = [
	{
		name: "primerNombre",
		label: "Primer Nombre *",
		placeholder: "Ej. Laura",
	},
	{
		name: "segundoNombre",
		label: "Segundo Nombre",
		placeholder: "Ej. Sofía (opcional)",
	},
	{
		name: "primerApellido",
		label: "Primer Apellido *",
		placeholder: "Ej. Méndez",
	},
	{
		name: "segundoApellido",
		label: "Segundo Apellido",
		placeholder: "Ej. Pérez (opcional)",
	},
] as const;

export function EstudianteForm({
	estudianteInicial,
	esEdicion,
	estaGuardando,
	errorEnvio,
	onSubmit,
	onCancelar,
}: EstudianteFormProps) {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<EstudianteFormValores>({
		resolver: zodResolver(crearEsquemaEstudiante(esEdicion)),
		values: estudianteInicial
			? {
					primerNombre: estudianteInicial.primerNombre,
					segundoNombre: estudianteInicial.segundoNombre ?? "",
					primerApellido: estudianteInicial.primerApellido,
					segundoApellido: estudianteInicial.segundoApellido ?? "",
					documento: estudianteInicial.documento,
					email: "",
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

	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			noValidate
			className="space-y-6 rounded-2xl border border-slate-200/80 bg-white p-6 md:p-8 shadow-xs"
		>
			{/* Alerta de error en el envío */}
			{errorEnvio && (
				<div
					role="alert"
					className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700 animate-in fade-in duration-200"
				>
					{errorEnvio}
				</div>
			)}

			{/* Bloque 1: Identidad y Acceso al Sistema */}
			<fieldset className="space-y-4">
				<legend className="flex items-center gap-2 border-b border-slate-100 pb-2.5 text-sm font-semibold text-slate-900">
					<IdCard size={18} className="text-brand-600" />
					<span>Identidad y Acceso al Sistema</span>
				</legend>

				{esEdicion ? (
					<div className="rounded-xl bg-slate-50 p-4 border border-slate-200/70">
						<Input
							label="Número de Identificación"
							value={estudianteInicial?.documento ?? ""}
							disabled
							icon={<IdCard size={18} />}
						/>
						<p className="mt-2 text-xs text-slate-400">
							El número de identificación representa la clave institucional del
							estudiante y no puede modificarse desde este formulario.
						</p>
					</div>
				) : (
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
						<Input
							label="Número de Identificación *"
							placeholder="Ej. 1088324567"
							icon={<IdCard size={18} />}
							error={errors.documento?.message}
							{...register("documento")}
						/>
						<Input
							label="Correo Institucional *"
							type="email"
							placeholder="estudiante@instituto.edu.co"
							icon={<Mail size={18} />}
							error={errors.email?.message}
							{...register("email")}
						/>
						<div className="sm:col-span-2">
							<Input
								label="Contraseña Inicial *"
								type="password"
								placeholder="Mínimo 8 caracteres"
								icon={<Lock size={18} />}
								error={errors.contrasena?.message}
								{...register("contrasena")}
							/>
							<p className="mt-1 text-xs text-slate-400">
								El estudiante utilizará esta contraseña temporal para su primer inicio
								de sesión.
							</p>
						</div>
					</div>
				)}
			</fieldset>

			{/* Bloque 2: Información Personal (campos mapeados sin duplicación) */}
			<fieldset className="space-y-4 pt-4">
				<legend className="flex items-center gap-2 border-b border-slate-100 pb-2.5 text-sm font-semibold text-slate-900">
					<User size={18} className="text-brand-600" />
					<span>Información Personal</span>
				</legend>

				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
					{CAMPOS_PERSONALES.map(({ name, label, placeholder }) => (
						<Input
							key={name}
							label={label}
							placeholder={placeholder}
							error={errors[name]?.message}
							{...register(name)}
						/>
					))}
				</div>
			</fieldset>

			{/* Botones de acción del formulario */}
			<div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-6">
				<Button
					type="button"
					variant="secondary"
					disabled={estaGuardando}
					onClick={onCancelar}
					className="w-auto px-5"
				>
					Cancelar
				</Button>
				<Button
					type="submit"
					isLoading={estaGuardando}
					disabled={estaGuardando}
					className="w-auto px-6"
				>
					<Save size={18} />
					<span>{esEdicion ? "Guardar cambios" : "Registrar estudiante"}</span>
				</Button>
			</div>
		</form>
	);
}
