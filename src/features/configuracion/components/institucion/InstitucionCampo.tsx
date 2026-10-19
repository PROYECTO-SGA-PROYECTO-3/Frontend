import type { ElementType } from "react";
import { cn } from "@/shared/lib";

interface InstitucionCampoProps {
	icono: ElementType;
	etiqueta: string;
	valor?: string | null;
	fallback?: string;
	colSpanCompleto?: boolean;
}

export function InstitucionCampo({
	icono: Icono,
	etiqueta,
	valor,
	fallback = "No registrado",
	colSpanCompleto = false,
}: InstitucionCampoProps) {
	return (
		<div
			className={cn(
				"border-t border-slate-100 pt-3.5 min-w-0",
				colSpanCompleto && "sm:col-span-2",
			)}
		>
			<dt className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400">
				<Icono size={13} className="text-slate-400 shrink-0" aria-hidden="true" />
				<span className="truncate">{etiqueta}</span>
			</dt>
			<dd className="mt-1 text-sm font-semibold text-slate-800 wrap-break-word leading-relaxed">
				{valor || fallback}
			</dd>
		</div>
	);
}
