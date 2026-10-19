import { Skeleton } from '@/shared/ui/Skeleton'

export function PeriodosSkeleton() {
  return (
    <div className="mt-4 overflow-hidden rounded-xl border border-slate-200/80 p-6 space-y-3">
      {[1, 2, 3].map((i) => (
        <Skeleton key={i} className="h-10 w-full rounded-lg" />
      ))}
    </div>
  )
}
