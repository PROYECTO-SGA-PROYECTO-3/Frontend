import { InfoCard } from './InfoCard'
import { institucionalData } from '../data/portal.data'

export function MisionVisionSection() {
  return (
    <section className="bg-slate-50 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Nuestra Identidad Institucional
          </h2>
          <p className="mt-4 text-lg leading-8 text-slate-600">
            Guiados por principios de excelencia y valores, forjamos el futuro de nuestros estudiantes.
          </p>
        </div>
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-10 lg:max-w-none lg:grid-cols-2 lg:gap-16">
          
          <InfoCard
            title={institucionalData.mision.title}
            desc={institucionalData.mision.desc}
            Icon={institucionalData.mision.icon}
          />

          <InfoCard
            title={institucionalData.vision.title}
            desc={institucionalData.vision.desc}
            Icon={institucionalData.vision.icon}
          />

        </div>
      </div>
    </section>
  )
}
