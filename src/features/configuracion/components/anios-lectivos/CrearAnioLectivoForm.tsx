import { useState, type ChangeEvent } from "react";
import { Plus, AlertCircle } from "lucide-react";
import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Input";

export interface CrearAnioLectivoFormProps {
	creando: boolean;
	errorCrear: string | null;
	onSubmit: (params: { anio: number; activar: boolean }) => void;
	onCancelar?: () => void;
}

export function CrearAnioLectivoForm({
	creando,
	errorCrear,
	onSubmit,
	onCancelar,
}: CrearAnioLectivoFormProps) {
	const [anioNuevo, setAnioNuevo] = useState("");
	const [activarAlCrear, setActivarAlCrear] = useState(false);
	const [errorValidacion, setErrorValidacion] = useState<string | null>(null);

	const handleAnioChange = (e: ChangeEvent<HTMLInputElement>) => {
		setAnioNuevo(e.target.value);
		if (errorValidacion) {
			setErrorValidacion(null);
		}
	};

	const handleActivarChange = (e: ChangeEvent<HTMLInputElement>) => {
		setActivarAlCrear(e.target.checked);
	};

	const handleSubmitFormulario = (e: React.SubmitEvent<HTMLFormElement>) => {
		e.preventDefault();
		const valor = Number(anioNuevo.trim());
		if (!valor || valor < 2000 || valor > 2100) {
			setErrorValidacion("Ingresa un año válido comprendido entre 2000 y 2100.");
			return;
		}
		setErrorValidacion(null);
		onSubmit({ anio: valor, activar: activarAlCrear });
	};

	const errorVisible = errorValidacion ?? errorCrear;

	return (
		<form onSubmit={handleSubmitFormulario} className="flex flex-col flex-1 overflow-hidden">
			<div className="p-6 space-y-4">
				{errorVisible && (
					<div className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50/70 p-3.5 text-xs text-red-700">
						<AlertCircle size={16} className="text-red-500 shrink-0 mt-0.5" />
						<span>{errorVisible}</span>
					</div>
				)}

				<div className="space-y-1.5">
					<label
						htmlFor="anio-lectivo-input"
						className="block text-xs font-semibold uppercase tracking-wider text-slate-500"
					>
						Año Calendario
					</label>
					<Input
						id="anio-lectivo-input"
						type="number"
						placeholder="Ej. 2027"
						value={anioNuevo}
						onChange={handleAnioChange}
						autoFocus
						required
						min={2000}
						max={2100}
					/>
					<p className="text-xs text-slate-400">
						Ingresa un año de cuatro dígitos comprendido entre 2000 y 2100.
					</p>
				</div>

				<div className="pt-2 border-t border-slate-100">
					<label className="flex items-start gap-2.5 p-3 rounded-xl border border-slate-200/80 bg-slate-50/60 cursor-pointer hover:bg-slate-50 transition select-none">
						<input
							type="checkbox"
							checked={activarAlCrear}
							onChange={handleActivarChange}
							disabled={creando}
							className="mt-0.5 h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-600 cursor-pointer"
						/>
						<div className="text-xs">
							<span className="font-semibold text-slate-800 block">
								Activar inmediatamente como año vigente
							</span>
							<span className="text-slate-500 text-xs block mt-0.5">
								El año actual pasará a histórico y este nuevo año regirá
								periodos y calificaciones.
							</span>
						</div>
					</label>
				</div>
			</div>

			{/* Pie con acciones */}
			<footer className="flex items-center justify-end gap-3 p-4 border-t border-slate-100 bg-slate-50/50">
				{onCancelar && (
					<Button
						type="button"
						variant="secondary"
						onClick={onCancelar}
						disabled={creando}
						className="w-auto"
					>
						Cancelar
					</Button>
				)}
				<Button type="submit" variant="primary" isLoading={creando} className="w-auto">
					<Plus size={16} />
					Crear Año Lectivo
				</Button>
			</footer>
		</form>
	);
}
