import { Skeleton } from "@/components/ui/Skeleton";

export function DashboardSkeleton() {
	return (
		<div className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)_minmax(0,1fr)] xl:gap-6 xl:items-start">
			{/* Tarjeta Principal skeleton */}
			<div className="flex flex-col gap-6">
				<div className="relative w-full overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
					<div className="absolute inset-y-0 left-0 w-1.5 bg-slate-200" />
					<div className="relative flex items-start justify-between gap-6 pl-2">
						<div className="relative z-10 min-w-0 flex-1">
							<Skeleton className="h-3 w-32" />
							<Skeleton className="mt-3 h-12 w-24" />
							<div className="mt-5 border-t border-slate-100 pt-4">
								<Skeleton className="h-3 w-28" />
								<Skeleton className="mt-2 h-8 w-20" />
							</div>
						</div>
						<Skeleton className="h-28 w-28 shrink-0 rounded-3xl" />
					</div>
				</div>
			</div>

			{/* Métricas Secundarias skeleton */}
			<div className="flex flex-col gap-5">
				{[1, 2, 3].map((i) => (
					<div
						key={i}
						className="relative overflow-hidden rounded-xl border-l-4 border-slate-200 bg-white px-5 py-4 shadow-sm"
					>
						<div className="relative z-10 flex flex-col justify-start pr-12">
							<Skeleton className="h-3 w-36" />
							<Skeleton className="mt-2.5 h-7 w-16" />
						</div>
						<Skeleton className="absolute right-4 top-1/2 h-14 w-14 -translate-y-1/2 rounded-2xl" />
					</div>
				))}
			</div>

			{/* Eventos skeleton */}
			<div className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
				<div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-6 py-4">
					<Skeleton className="h-4 w-40" />
					<Skeleton className="h-5 w-5 rounded" />
				</div>
				<div className="flex-1 space-y-5 p-6">
					{[1, 2, 3].map((i) => (
						<div key={i} className="flex items-start gap-4">
							<Skeleton className="h-14 w-12 shrink-0 rounded-xl" />
							<div className="flex-1 space-y-2 border-b border-slate-50 pb-4">
								<Skeleton className="h-4 w-5/6" />
								<Skeleton className="h-3 w-2/3" />
								<Skeleton className="mt-2 h-5 w-24 rounded-md" />
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
