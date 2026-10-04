interface BienvenidaBannerProps {
  nombre: string;
}

export function BienvenidaBanner({ nombre }: BienvenidaBannerProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-brand-50 p-8 shadow-sm transition-shadow duration-300 hover:shadow-md">
      <div className="pointer-events-none absolute -right-10 -top-10 h-56 w-56 rounded-full bg-brand-100/80" />
      <div className="pointer-events-none absolute -right-4 bottom-[-3rem] h-32 w-32 rounded-full bg-brand-200/60" />

      <div className="relative max-w-xl">
        <h2 className="text-3xl font-bold text-slate-900">¡Hola, {nombre}!</h2>
        <p className="mt-3 text-slate-600">
          Bienvenido de nuevo a tu portal académico. Aquí podrás consultar tu{' '}
          <span className="font-semibold text-brand-700">rendimiento general</span>,{' '}
          revisar tus <span className="font-semibold text-brand-700">próximos eventos</span>{' '}
          y el <span className="font-semibold text-brand-700">horario de tus clases</span>.
        </p>
      </div>
    </div>
  )
}
