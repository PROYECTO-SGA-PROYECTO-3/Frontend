import { Users, BookOpen } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/shared/lib/utils";

export type TabCursoId = "estudiantes" | "carga";

export interface TabCursoItem {
	id: TabCursoId;
	etiqueta: string;
	icono: LucideIcon;
}

export const TABS_CURSO: TabCursoItem[] = [
	{ id: "estudiantes", etiqueta: "Estudiantes", icono: Users },
	{ id: "carga", etiqueta: "Carga Académica", icono: BookOpen },
];

export interface CursoTabsProps {
	tabActiva: TabCursoId;
	onSeleccionarTab: (tab: TabCursoId) => void;
}

export function CursoTabs({ tabActiva, onSeleccionarTab }: CursoTabsProps) {
	return (
		<div className="border-b border-slate-200">
			<nav
				role="tablist"
				aria-label="Secciones del detalle del curso"
				className="flex space-x-2 sm:space-x-4"
			>
				{TABS_CURSO.map((tab) => {
					const Icono = tab.icono;
					const esActiva = tabActiva === tab.id;

					return (
						<button
							key={tab.id}
							role="tab"
							id={`tab-${tab.id}`}
							aria-selected={esActiva}
							aria-controls={`panel-${tab.id}`}
							type="button"
							onClick={() => onSeleccionarTab(tab.id)}
							className={cn(
								"cursor-pointer group inline-flex items-center gap-2 border-b-2 py-3 px-3 sm:px-4 text-sm font-medium transition-colors",
								esActiva
									? "border-brand-600 text-brand-700"
									: "border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700",
							)}
						>
							<Icono
								size={18}
								className={cn(
									"shrink-0 transition-colors",
									esActiva
										? "text-brand-600"
										: "text-slate-400 group-hover:text-slate-600",
								)}
								aria-hidden="true"
							/>
							<span>{tab.etiqueta}</span>
						</button>
					);
				})}
			</nav>
		</div>
	);
}
