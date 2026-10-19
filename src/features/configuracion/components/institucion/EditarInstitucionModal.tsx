import type { MouseEvent, KeyboardEvent } from "react";
import { Building2, X, Save, AlertCircle } from "lucide-react";
import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Input";
import type { Institucion } from "../../types";
import { useInstitucionForm } from "../../hooks/useInstitucionForm";

interface EditarInstitucionModalProps {
	abierto: boolean;
	institucion: Institucion | null;
	onCerrar: () => void;
	onGuardadoExitoso: () => void;
}

export function EditarInstitucionModal(props: EditarInstitucionModalProps) {
	if (!props.abierto) return null;

	return (
		<EditarInstitucionDialog
			key={props.institucion?.id ?? "institucion-modal"}
			{...props}
		/>
	);
}

function EditarInstitucionDialog({
	institucion,
	onCerrar,
	onGuardadoExitoso,
}: EditarInstitucionModalProps) {
	const { register, errors, isPending, isError, errorMessage, onSubmit } =
		useInstitucionForm(institucion, onGuardadoExitoso);

	// Cierre accesible mediante evento de teclado sintético de React (sin useEffect global)
	const handleKeyDownDialogo = (e: KeyboardEvent<HTMLDivElement>) => {
		if (e.key === "Escape" && !isPending) {
			e.stopPropagation();
			onCerrar();
		}
	};

	const handleBackdropClick = (e: MouseEvent<HTMLDivElement>) => {
		if (e.target === e.currentTarget && !isPending) {
			onCerrar();
		}
	};

	return (
		<div
			role="dialog"
			aria-modal="true"
			aria-labelledby="modal-institucion-titulo"
			tabIndex={-1}
			onKeyDown={handleKeyDownDialogo}
			onClick={handleBackdropClick}
			className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs animate-in fade-in duration-200 outline-none"
		>
			<div className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
				{/* Cabecera del Modal */}
				<div className="flex items-start justify-between border-b border-slate-100 p-6">
					<div className="flex items-center gap-3">
						<div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
							<Building2 size={20} />
						</div>
						<div>
							<h2
								id="modal-institucion-titulo"
								className="text-base font-bold text-slate-900"
							>
								Editar Información Oficial y Legal
							</h2>
							<p className="text-xs text-slate-500">
								Estos datos se imprimirán en certificados, constancias, membretes y
								boletines.
							</p>
						</div>
					</div>

					<button
						type="button"
						onClick={onCerrar}
						disabled={isPending}
						aria-label="Cerrar modal"
						className="cursor-pointer rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 disabled:opacity-50"
					>
						<X size={18} />
					</button>
				</div>

				{/* Formulario */}
				<form onSubmit={onSubmit} className="flex flex-col gap-5 p-6">
					<div className="space-y-4">
						<Input
							label="Nombre de la Institución *"
							placeholder="Ej. Institución Educativa Agrícola Fray Isidoro"
							error={errors.nombre?.message}
							{...register("nombre")}
						/>

						<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
							<Input
								label="NIT *"
								placeholder="Ej. 800.123.456-7"
								error={errors.nit?.message}
								{...register("nit")}
							/>
							<Input
								label="Código DANE"
								placeholder="Ej. 123456789012"
								error={errors.codigoDane?.message}
								{...register("codigoDane")}
							/>
						</div>

						<Input
							label="Resolución de Aprobación"
							placeholder="Ej. Resolución No. 1234 del 15 de Noviembre de 2010"
							error={errors.resolucion?.message}
							{...register("resolucion")}
						/>

						<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
							<Input
								label="Dirección"
								placeholder="Ej. Vereda Montclar, Km 4"
								error={errors.direccion?.message}
								{...register("direccion")}
							/>
							<Input
								label="Nombre del Rector(a)"
								placeholder="Ej. Lic. Carlos Mario Pérez"
								error={errors.nombreRector?.message}
								{...register("nombreRector")}
							/>
						</div>
					</div>

					{/* Error del servidor */}
					{isError && (
						<div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50/70 p-3 text-sm text-red-700">
							<AlertCircle size={18} className="shrink-0 text-red-500" />
							<span>{errorMessage}</span>
						</div>
					)}

					{/* Acciones del pie del modal */}
					<div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
						<Button
							type="button"
							variant="secondary"
							onClick={onCerrar}
							disabled={isPending}
						>
							Cancelar
						</Button>
						<Button type="submit" isLoading={isPending} disabled={isPending}>
							<Save size={16} />
							Guardar Cambios
						</Button>
					</div>
				</form>
			</div>
		</div>
	);
}
