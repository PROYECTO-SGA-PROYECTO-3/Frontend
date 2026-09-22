import type { ReactNode } from 'react'

interface NavbarProps {
  titulo: string
  subtitulo?: string
  sistemaEnLinea?: boolean
  children?: ReactNode
}

export function Navbar({ titulo, subtitulo, children }: NavbarProps) {
  return (
    <header className="flex h-21 items-center justify-between gap-4 border-b border-slate-200 bg-white px-4 pl-16 py-4 sm:pr-8 lg:px-8">
      <div className="min-w-0">
        <h1 className="truncate text-xl font-bold text-slate-900">{titulo}</h1>
        {subtitulo && <p className="truncate text-sm text-slate-500">{subtitulo}</p>}
      </div>

      {children && <div className="flex shrink-0 items-center gap-4">{children}</div>}
    </header>
  )
}
