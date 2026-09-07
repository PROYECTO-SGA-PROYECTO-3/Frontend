import { Calendar, ChevronRight, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { formatearFechaCorta } from "@/lib/utils";
import type { EventoInstitucional } from "@/types/eventos.types";

interface ProximosEventosProps {
	eventos: EventoInstitucional[];
}

export function ProximosEventos({ eventos }: ProximosEventosProps) {
	return (
		<div className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:shadow-md">
			<div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-6 py-4">
				<div className="flex items-center gap-2">
					<Calendar size={18} className="text-brand-600" />
					<h3 className="text-sm font-semibold uppercase tracking-wider text-slate-700">
						Próximos Eventos
					</h3>
				</div>
			</div>

			<div className="flex-1 p-6">
				<ul className="space-y-5">
					{eventos.length === 0 && (
						<p className="text-center text-sm italic text-slate-400 py-4">
							No hay eventos programados en este momento.
						</p>
					)}
					{eventos.map((evento) => {
						const { dia, mes } = formatearFechaCorta(evento.fecha);
						return (
							<li key={evento.id} className="group flex items-start gap-4">
								<div className="flex w-12 shrink-0 flex-col items-center justify-center rounded-xl bg-brand-50 py-2 text-brand-700 shadow-sm transition-colors duration-300 group-hover:bg-brand-600 group-hover:text-white">
									<span className="text-xl font-black leading-none">{dia}</span>
									<span className="mt-1 text-[10px] font-bold uppercase tracking-widest">
										{mes}
									</span>
								</div>
								<div className="min-w-0 flex-1 border-b border-slate-100 pb-4 group-last:border-0 group-last:pb-0">
									<p className="truncate text-sm font-bold text-slate-900 transition-colors group-hover:text-brand-700">
										{evento.titulo}
									</p>
									<p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-slate-500">
										{evento.descripcion}
									</p>
									{evento.lugar && (
										<span className="mt-2 inline-flex items-center rounded-md bg-slate-100 px-2.5 py-0.5 text-[10px] font-medium text-slate-600">
											<MapPin size={12} className="mr-1 shrink-0" /> {evento.lugar}
										</span>
									)}
								</div>
							</li>
						);
					})}
				</ul>
			</div>

			<div className="bg-slate-50 p-4 border-t border-slate-100">
				<Link
					to="/calendario"
					className="group flex w-full items-center justify-center gap-1.5 text-xs font-bold tracking-wide text-brand-700 uppercase transition-colors hover:text-brand-800"
				>
					<span>Ver calendario completo</span>
					<ChevronRight
						size={14}
						className="transition-transform group-hover:translate-x-1"
					/>
				</Link>
			</div>
		</div>
	);
}
