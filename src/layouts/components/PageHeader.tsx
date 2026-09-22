import type { ReactNode } from 'react'
import { ChevronRight } from 'lucide-react'

export interface PageHeaderProps {
  raiz?: string
  seccionActual: string
  children?: ReactNode
}

export function PageHeader({
  raiz = 'Portal Académico',
  seccionActual,
  children,
}: PageHeaderProps) {
  return (
    <header className="flex h-21 items-center justify-between gap-4 border-b border-slate-200 bg-white px-4 pl-16 py-5 sm:pr-8 lg:px-8">
      <nav aria-label="Miga de pan" className="flex min-w-0 flex-1 items-center gap-2 text-sm">
        <span className="hidden truncate text-slate-400 sm:inline">{raiz}</span>
        <ChevronRight size={14} className="hidden shrink-0 text-slate-300 sm:block" aria-hidden="true" />
        <span className="truncate font-semibold text-brand-700" aria-current="page">
          {seccionActual}
        </span>
      </nav>

      {children && <div className="flex shrink-0 items-center gap-4">{children}</div>}
    </header>
  )
}
