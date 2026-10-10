import { Badge } from '@/shared/ui/Badge'
import heroImage from '@/assets/hero.png'
import logoImage from '@/assets/logo-ie-descanse.png'

export function HeroSection() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-brand-50 via-white to-accent-100/50 py-16 sm:py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-8 items-center">
          {/* Contenido Texto */}
          <div className="max-w-2xl">
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl mb-6">
              Formación Integral con <br className="hidden sm:block" />
              <span className="text-brand-700 relative">
                <span className="relative z-10 underline decoration-brand-500/30 decoration-8 underline-offset-4">Vocación Agropecuaria</span>
              </span>{' '}
              y <br className="hidden sm:block" />
              Visión de Futuro
            </h1>

            <p className="mt-4 text-lg text-slate-600 mb-8 leading-relaxed">
              Bienvenidos al portal oficial de la <strong className="text-slate-800 font-semibold">IE Agrícola Fray Isidoro de Montclar</strong> en Descanse, Santa Rosa - Cauca. Gestionamos la excelencia académica y el desarrollo comunitario a través del saber pedagógico y la riqueza del campo.
            </p>
          </div>

          {/* Imagen / Visual */}
          <div className="relative mx-auto w-full max-w-lg lg:max-w-none mt-8 lg:mt-0">
            <div className="relative h-80 sm:h-96 w-full">
              {/* Contenedor con overflow hidden solo para el fondo */}
              <div className="absolute inset-0 rounded-3xl overflow-hidden shadow-2xl ring-1 ring-slate-900/10">
                {/* Contenedor simulando la imagen de la bandera con herramientas (hero) */}
                <div className="absolute inset-0 bg-gradient-to-b from-brand-700 to-slate-900">
                   <img src={heroImage} alt="Fondo Hero" className="w-full h-full object-cover opacity-80 mix-blend-overlay" />
                </div>
                
                {/* Franjas estilo bandera agropecuaria */}
                <div className="absolute inset-0 flex flex-col z-0 opacity-80">
                   <div className="flex-1 bg-brand-600"></div>
                   <div className="flex-1 bg-accent-400"></div>
                   <div className="flex-1 bg-slate-800"></div>
                </div>
              </div>

              {/* Insignia Modalidad Agropecuaria */}
              <div className="absolute top-4 right-4 z-20 bg-white rounded-full px-3 py-1.5 sm:px-4 shadow-lg flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-brand-600"></div>
                <span className="text-[10px] sm:text-xs font-bold text-slate-800 uppercase tracking-wider">Modalidad Agropecuaria</span>
              </div>

              {/* Tarjeta Flotante Izquierda */}
              <div className="absolute -bottom-6 -left-2 sm:-left-6 z-20 bg-white rounded-2xl p-3 sm:p-4 shadow-xl border border-slate-100 flex items-center gap-3 sm:gap-4 animate-[shimmer_5s_infinite_alternate] w-[90%] sm:w-auto">
                <img src={logoImage} alt="Logo" className="w-12 h-12 sm:w-16 sm:h-16 object-contain shrink-0" />
                <div>
                  <Badge color="accent">LEMA OFICIAL</Badge>
                  <p className="font-bold text-slate-900 text-sm mt-1 leading-tight">Unidad y Progreso</p>
                  <p className="text-xs text-slate-500 line-clamp-1 sm:line-clamp-none">Con la luz que nos brinda el saber</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
