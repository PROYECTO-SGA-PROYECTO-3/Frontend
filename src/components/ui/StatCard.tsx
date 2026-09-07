import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
	etiqueta: string;
	valor: number | string;
	icono: LucideIcon;
	pista?: string;
	color?: "blue" | "brand" | "accent";
}

const ESTILOS_COLOR = {
	blue: {
		borde: "border-blue-500",
		fondoIcono: "bg-blue-50",
		textoIcono: "text-blue-600",
		gradiente: "from-blue-50/50 to-transparent",
	},
	brand: {
		borde: "border-brand-600",
		fondoIcono: "bg-brand-50",
		textoIcono: "text-brand-700",
		gradiente: "from-brand-50/50 to-transparent",
	},
	accent: {
		borde: "border-accent-500",
		fondoIcono: "bg-accent-100",
		textoIcono: "text-accent-600",
		gradiente: "from-accent-100/30 to-transparent",
	},
} as const;

export function StatCard({
	etiqueta,
	valor,
	icono: Icono,
	pista,
	color = "blue",
}: StatCardProps) {
	const estilos = ESTILOS_COLOR[color];

	return (
		<div
			className={cn(
				"group relative overflow-hidden rounded-xl border-l-4 bg-white px-5 py-4 shadow-sm",
				"transition-all duration-300 hover:-translate-y-1 hover:shadow-md",
				estilos.borde,
			)}
		>
			<div
				className={cn(
					"absolute inset-0 bg-linear-to-br opacity-50 transition-opacity duration-300 group-hover:opacity-100",
					estilos.gradiente,
				)}
			/>

			<div className="relative z-10 flex flex-col justify-start pr-12">
				<p className="whitespace-nowrap text-xs font-semibold uppercase tracking-wider text-slate-400">
					{etiqueta}
				</p>
				<p className="mt-1.5 text-2xl font-bold leading-none tracking-tight text-slate-900">
					{valor}
				</p>
				{pista && (
					<p className="mt-2 max-w-56 text-xs text-slate-400">{pista}</p>
				)}
			</div>
			
			<div
				className={cn(
					"absolute right-4 top-1/2 z-0 flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-2xl",
					"transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6",
					estilos.fondoIcono,
					estilos.textoIcono,
				)}
			>
				<Icono size={28} strokeWidth={2} />
			</div>
		</div>
	);
}
