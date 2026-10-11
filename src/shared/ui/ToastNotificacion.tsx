import { useEffect } from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

export type TipoToast = "exito" | "error" | "info";

export interface ToastNotificacionProps {
	mensaje: string | null;
	onCerrar: () => void;
	tipo?: TipoToast;
	duracionMs?: number;
}

const CONFIG_TIPO: Record<
	TipoToast,
	{
		contenedor: string;
		icono: typeof CheckCircle2;
		iconoContenedor: string;
		textoColor: string;
		btnColor: string;
	}
> = {
	exito: {
		contenedor:
			"bg-emerald-50/95 border-2 border-emerald-500/40 shadow-xl shadow-emerald-950/10",
		icono: CheckCircle2,
		iconoContenedor: "bg-emerald-600 text-white shadow-xs",
		textoColor: "text-emerald-950",
		btnColor: "text-emerald-700/60 hover:bg-emerald-100 hover:text-emerald-900",
	},
	error: {
		contenedor:
			"bg-red-50/95 border-2 border-red-500/40 shadow-xl shadow-red-950/10",
		icono: AlertCircle,
		iconoContenedor: "bg-red-600 text-white shadow-xs",
		textoColor: "text-red-950",
		btnColor: "text-red-700/60 hover:bg-red-100 hover:text-red-900",
	},
	info: {
		contenedor:
			"bg-sky-50/95 border-2 border-sky-500/40 shadow-xl shadow-sky-950/10",
		icono: Info,
		iconoContenedor: "bg-sky-600 text-white shadow-xs",
		textoColor: "text-sky-950",
		btnColor: "text-sky-700/60 hover:bg-sky-100 hover:text-sky-900",
	},
};

export function ToastNotificacion({
	mensaje,
	onCerrar,
	tipo = "exito",
	duracionMs = 4000,
}: ToastNotificacionProps) {
	useEffect(() => {
		if (!mensaje || duracionMs <= 0) return;

		const timer = setTimeout(() => {
			onCerrar();
		}, duracionMs);

		return () => clearTimeout(timer);
	}, [mensaje, duracionMs, onCerrar]);

	if (!mensaje) return null;

	const config = CONFIG_TIPO[tipo];
	const Icono = config.icono;

	return (
		<div
			role="status"
			aria-live="polite"
			className={`fixed bottom-6 right-6 z-50 flex max-w-md items-center justify-between gap-3.5 rounded-2xl ${config.contenedor} p-4 text-sm backdrop-blur-md animate-in fade-in slide-in-from-bottom-3 duration-300`}
		>
			<div className="flex items-center gap-3 min-w-0">
				<div
					className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${config.iconoContenedor}`}
				>
					<Icono size={19} aria-hidden="true" />
				</div>
				<span className={`font-semibold ${config.textoColor} leading-snug`}>
					{mensaje}
				</span>
			</div>

			<button
				type="button"
				onClick={onCerrar}
				aria-label="Cerrar notificación"
				className={`cursor-pointer shrink-0 rounded-lg p-1.5 transition ${config.btnColor}`}
			>
				<X size={16} aria-hidden="true" />
			</button>
		</div>
	);
}
