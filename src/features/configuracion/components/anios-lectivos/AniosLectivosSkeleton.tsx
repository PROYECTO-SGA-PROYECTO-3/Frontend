import { Skeleton } from "@/shared/ui/Skeleton";

export function AniosLectivosSkeleton() {
	return (
		<div className="p-6 space-y-4">
			{[1, 2, 3].map((i) => (
				<div
					key={i}
					className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0"
				>
					<Skeleton className="h-5 w-24" />
					<div className="flex gap-2">
						<Skeleton className="h-8 w-24 rounded-lg" />
						<Skeleton className="h-8 w-32 rounded-lg" />
					</div>
				</div>
			))}
		</div>
	);
}
