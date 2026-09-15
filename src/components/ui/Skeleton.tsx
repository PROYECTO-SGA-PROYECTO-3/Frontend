import { cn } from "@/lib/utils";

export function Skeleton({
	className,
	...props
}: React.HTMLAttributes<HTMLDivElement>) {
	return (
		<div
			className={cn(
				"animate-[shimmer_2s_infinite] bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-[length:400%_100%] rounded-md",
				className,
			)}
			{...props}
		/>
	);
}
