import { cn } from '@/shared/lib/utils'

export interface FooterProps {
  /** Clases CSS adicionales para personalización del contenedor */
  className?: string
  /** Muestra la ubicación de la sede institucional */
  showLocation?: boolean
  /** Muestra la barra inferior con gradiente de marca */
  showAccentBar?: boolean
}

/**
 * Componente unificado del pie de página institucional del SGA.
 * Cumple con la semántica HTML5, accesibilidad WCAG y la paleta de tokens oficial.
 */
export function Footer({
  className,
  showLocation = false,
  showAccentBar = false,
}: FooterProps) {
  const anioActual = new Date().getFullYear()

  return (
    <footer
      role="contentinfo"
      className={cn(
        'relative border-t border-slate-200 bg-white py-3.5 px-4 sm:px-6 lg:px-8 text-xs text-slate-500',
        className
      )}
    >
      <div className="mx-auto flex w-full max-w-[1600px] flex-col items-center justify-between gap-2 sm:flex-row">
        <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-center sm:justify-start sm:text-left">
          <span>&copy; {anioActual} Institución Educativa Agrícola Fray Isidoro de Montclar.</span>
          {showLocation && (
            <>
              <span className="hidden sm:inline text-slate-300" aria-hidden="true">&bull;</span>
              <span className="text-slate-400">Descanse - Cauca, Colombia</span>
            </>
          )}
        </div>

        <div className="flex items-center gap-1.5 text-slate-400">
          <span>Sistema de Gestión Académica</span>
          <span className="inline-block h-1 w-1 rounded-full bg-slate-300" aria-hidden="true" />
          <span className="font-semibold text-brand-700">SGA</span>
        </div>
      </div>

      {showAccentBar && (
        <span
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-1 bg-linear-to-r from-brand-600 via-accent-400 to-blue-400"
        />
      )}
    </footer>
  )
}
