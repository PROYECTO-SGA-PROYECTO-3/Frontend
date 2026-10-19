import type { MouseEvent, KeyboardEvent } from "react";
import { CalendarPlus, X } from "lucide-react";
import { CrearAnioLectivoForm } from "./CrearAnioLectivoForm";

interface CrearAnioLectivoModalProps {
	abierto: boolean;
	creando: boolean;
	errorCrear: string | null;
	onSubmit: (params: { anio: number; activar: boolean }) => void;
	onCerrar: () => void;
}

export function CrearAnioLectivoModal({
	abierto,
	creando,
	errorCrear,
	onSubmit,
	onCerrar,
}: CrearAnioLectivoModalProps) {
	if (!abierto) return null;

	const handleKeyDownDialogo = (e: KeyboardEvent<HTMLDivElement>) => {
		if (e.key === "Escape" && !creando) {
			e.stopPropagation();
			onCerrar();
		}
	};

	const handleBackdropClick = (e: MouseEvent<HTMLDivElement>) => {
		if (e.target === e.currentTarget && !creando) {
			onCerrar();
		}
	};

	return (
		<div
			tabIndex={-1}
			role="dialog"
			aria-modal="true"
			aria-labelledby="modal-crear-anio-titulo"
			onKeyDown={handleKeyDownDialogo}
			onClick={handleBackdropClick}
			className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200 outline-none"
		>
			<div className="flex flex-col w-full max-w-md max-h-[90vh] overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-2xl transition-all">
				{/* Cabecera del modal */}
				<header className="flex items-start justify-between p-6 border-b border-slate-100 bg-slate-50/50">
					<div className="flex items-center gap-3">
						<div className="flex items-center justify-center w-10 h-10 rounded-xl bg-brand-50 text-brand-700 shadow-inner">
							<CalendarPlus size={20} />
						</div>
						<div>
							<h3
								id="modal-crear-anio-titulo"
								className="text-lg font-bold text-slate-900"
							>
								Nuevo Año Lectivo
							</h3>
							<p className="mt-0.5 text-xs text-slate-500">
								Registra un nuevo ciclo escolar en el sistema institucional.
							</p>
						</div>
					</div>
					<button
						type="button"
						onClick={onCerrar}
						disabled={creando}
						aria-label="Cerrar ventana"
						className="p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 rounded-lg disabled:opacity-50 cursor-pointer"
					>
						<X size={18} />
					</button>
				</header>

				{/* Formulario contenido con reinicio al montar */}
				<CrearAnioLectivoForm
					creando={creando}
					errorCrear={errorCrear}
					onSubmit={onSubmit}
					onCancelar={onCerrar}
				/>
			</div>
		</div>
	);
}
