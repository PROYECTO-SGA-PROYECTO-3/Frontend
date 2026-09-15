import { GraduationCap } from "lucide-react";

interface HeroStatCardProps {
	totalEstudiantes: number;
	matriculasActivas: number;
}

export function HeroStatCard({
	totalEstudiantes,
	matriculasActivas,
}: HeroStatCardProps) {
	return (
		<div className="flex flex-col gap-6 text-slate-900 h-full">
			<article className="group relative w-full h-full min-h-80 overflow-hidden rounded-3xl border border-slate-200 bg-white p-8 shadow-[0_20px_50px_-30px_rgba(15,23,42,0.15)] transition-all duration-500 hover:shadow-[0_20px_50px_-30px_rgba(22,163,74,0.25)]">
				<div className="absolute inset-y-0 left-0 w-1.5 bg-linear-to-b from-brand-500 via-brand-600 to-accent-500" />

				{/* Fondos Decorativos */}
				<div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-brand-100/50 blur-3xl transition-transform duration-700 group-hover:scale-110" />
				<div className="absolute -bottom-20 right-10 h-48 w-48 rounded-full bg-accent-100/60 blur-3xl transition-transform duration-700 group-hover:scale-110" />

				<div className="relative flex h-full items-start justify-between gap-6 pl-2">
					<div className="relative z-10 flex h-full flex-col min-w-0">
						<div>
							<p className="text-sm font-bold uppercase tracking-widest text-slate-400">
								Estudiantes Totales
							</p>
							<p className="mt-2 text-6xl font-black tracking-tighter text-slate-900 drop-shadow-sm">
								{totalEstudiantes}
							</p>
						</div>

						<div className="mt-auto pt-8">
							<div className="inline-flex flex-col rounded-2xl border border-slate-100 bg-slate-50/80 px-5 py-4 backdrop-blur-sm">
								<p className="text-xs font-bold uppercase tracking-wider text-slate-500">
									Matrículas Activas
								</p>
								<div className="mt-1.5 flex items-baseline gap-2">
									<p className="text-3xl font-black text-brand-700">
										{matriculasActivas}
									</p>
									<span className="text-xs font-medium text-brand-600/70">este año</span>
								</div>
							</div>
						</div>
					</div>

					<div className="pointer-events-none absolute right-4 top-4 z-0 flex h-32 w-32 -translate-y-1/4 translate-x-1/4 -rotate-12 items-center justify-center rounded-full bg-brand-50 text-brand-600 shadow-inner ring-1 ring-brand-100 transition-transform duration-700 group-hover:-rotate-6 group-hover:scale-110">
						<GraduationCap size={100} strokeWidth={1.5} className="opacity-80" />
					</div>
				</div>
			</article>
		</div>
	);
}
