import { cn } from "@/shared/lib/utils";

export function Skeleton({
	className,
	...props
}: React.HTMLAttributes<HTMLDivElement>) {
	return (
		<div
			className={cn(
				"animate-[shimmer_2s_infinite] bg-linear-to-r from-slate-200 via-slate-100 to-slate-200 bg-size-[400%_100%] rounded-md",
				className,
			)}
			{...props}
		/>
	);
}
