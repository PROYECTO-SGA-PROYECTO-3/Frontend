import {
	Building2,
	Pencil,
	Hash,
	FileText,
	Award,
	MapPin,
	UserCheck,
} from "lucide-react";
import { Button } from "@/shared/ui/Button";
import type { Institucion } from "../../types";
import { InstitucionEmptyCard } from "./InstitucionEmptyCard";
import { InstitucionCampo } from "./InstitucionCampo";

interface InstitucionCardProps {
	institucion: Institucion | null;
	onEditar: () => void;
}

export function InstitucionCard({
	institucion,
	onEditar,
}: InstitucionCardProps) {
	const tieneDatos = Boolean(
		institucion && (institucion.nombre || institucion.nit),
	);

	if (!tieneDatos) {
		return <InstitucionEmptyCard onRegistrar={onEditar} />;
	}

	return (
		<article className="flex flex-col gap-6 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition hover:shadow-md overflow-hidden">
			{/* Encabezado de la Ficha */}
			<header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between border-b border-slate-100 pb-5">
				<div className="flex items-start gap-3.5 min-w-0">
					<div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700 shadow-inner">
						<Building2 size={22} />
					</div>
					<div className="min-w-0">
						<h3 className="text-base font-bold text-slate-900 truncate">
							Información Oficial y Legal
						</h3>
						<p className="mt-0.5 text-xs text-slate-500">
							Datos oficiales y acreditaciones para certificados, constancias y
							boletines académicos.
						</p>
					</div>
				</div>

				<div className="shrink-0">
					<Button
						type="button"
						variant="secondary"
						onClick={onEditar}
						className="w-full sm:w-auto"
					>
						<Pencil size={15} />
						Editar Información
					</Button>
				</div>
			</header>

			{/* Contenido: Lista de Especificación Sobria */}
			<div className="flex flex-col gap-6">
				{/* Razón social destacada */}
				<div className="rounded-xl border border-slate-200/60 bg-linear-to-r from-slate-50/80 to-white p-4 sm:p-5 min-w-0">
					<span className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
						Razón Social Institucional
					</span>
					<p className="mt-1 text-lg font-bold text-slate-900 sm:text-xl wrap-break-word leading-snug">
						{institucion?.nombre}
					</p>
				</div>

				{/* Lista de especificación estructurada y reutilizable */}
				<dl className="grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
					<InstitucionCampo icono={Hash} etiqueta="NIT" valor={institucion?.nit} />
					<InstitucionCampo
						icono={FileText}
						etiqueta="Código DANE"
						valor={institucion?.codigoDane}
					/>
					<InstitucionCampo
						icono={UserCheck}
						etiqueta="Rector(a) Institucional"
						valor={institucion?.nombreRector}
					/>
					<InstitucionCampo
						icono={Award}
						etiqueta="Resolución de Aprobación"
						valor={institucion?.resolucion}
						fallback="No registrada"
					/>
					<InstitucionCampo
						icono={MapPin}
						etiqueta="Dirección y Ubicación"
						valor={institucion?.direccion}
						fallback="No registrada"
						colSpanCompleto
					/>
				</dl>
			</div>
		</article>
	);
}
