import { Building2, PlusCircle } from 'lucide-react'
import { Button } from '@/shared/ui/Button'

interface InstitucionEmptyCardProps {
  onRegistrar: () => void
}

export function InstitucionEmptyCard({ onRegistrar }: InstitucionEmptyCardProps) {
  return (
    <article className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-white p-8 sm:p-12 text-center shadow-xs">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-700 shadow-inner">
        <Building2 size={28} />
      </div>

      <h3 className="mt-4 text-base sm:text-lg font-bold text-slate-900">
        Información Institucional Pendiente
      </h3>

      <p className="mt-1.5 max-w-md text-xs sm:text-sm text-slate-500 leading-relaxed">
        Aún no se han registrado los parámetros legales del colegio. Configura el nombre oficial, NIT, código DANE y rector para habilitar la expedición de certificados y boletines.
      </p>

      <div className="mt-6">
        <Button
          type="button"
          onClick={onRegistrar}
          className="shadow-sm"
        >
          <PlusCircle size={16} />
          Configurar Información Institucional
        </Button>
      </div>
    </article>
  )
}
