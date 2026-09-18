import { Skeleton } from '@/shared/ui/Skeleton'

export function ConfiguracionSkeleton() {
  return (
    <div className="flex flex-col gap-10">
      {/* Sección Institución Skeleton */}
      <section className="flex flex-col gap-6">
        <div>
          <Skeleton className="h-7 w-64 rounded-lg" />
          <Skeleton className="mt-2 h-4 w-96 rounded-md" />
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Formulario Skeleton */}
          <div className="lg:col-span-2 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
            <div className="space-y-5">
              <div>
                <Skeleton className="h-4 w-36 mb-2" />
                <Skeleton className="h-10 w-full rounded-lg" />
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <Skeleton className="h-4 w-20 mb-2" />
                  <Skeleton className="h-10 w-full rounded-lg" />
                </div>
                <div>
                  <Skeleton className="h-4 w-28 mb-2" />
                  <Skeleton className="h-10 w-full rounded-lg" />
                </div>
              </div>

              <div>
                <Skeleton className="h-4 w-44 mb-2" />
                <Skeleton className="h-10 w-full rounded-lg" />
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-10 w-full rounded-lg" />
                </div>
                <div>
                  <Skeleton className="h-4 w-36 mb-2" />
                  <Skeleton className="h-10 w-full rounded-lg" />
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Skeleton className="h-10 w-36 rounded-lg" />
              </div>
            </div>
          </div>

          {/* Panel de Imágenes Skeleton */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm h-fit">
            <Skeleton className="h-5 w-40 pb-2 border-b border-slate-100" />
            <div className="mt-6 space-y-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="h-16 w-16 shrink-0 rounded-xl" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-3.5 w-24" />
                    <Skeleton className="h-8 w-28 rounded-lg" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Sección Años Lectivos Skeleton */}
      <section className="flex flex-col gap-6 pt-6 border-t border-slate-200">
        <div>
          <Skeleton className="h-7 w-48 rounded-lg" />
          <Skeleton className="mt-2 h-4 w-80 rounded-md" />
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row">
            <Skeleton className="h-10 flex-1 rounded-lg" />
            <Skeleton className="h-10 w-44 rounded-lg" />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white shadow-sm overflow-hidden divide-y divide-slate-100">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between p-4 px-6">
              <div className="flex items-center gap-3">
                <Skeleton className="h-5 w-12" />
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
              <div className="flex items-center gap-4">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-4 w-16" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
