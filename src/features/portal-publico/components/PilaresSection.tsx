import { PilarCard } from './PilarCard'
import { pilaresData } from '../data/portal.data'

export function PilaresSection() {
  return (
    <div className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-brand-600 font-bold text-xs tracking-widest uppercase mb-3">Nuestra Razón de Ser</p>
          <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl mb-4">Pilares del Modelo Pedagógico</h2>
          <p className="text-lg text-slate-600 leading-relaxed">
            Articulamos el conocimiento técnico campesino con las destrezas científicas para empoderar a la juventud de Descanse Cauca.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pilaresData.map((pilar, index) => (
            <PilarCard
              key={index}
              title={pilar.title}
              desc={pilar.desc}
              Icon={pilar.icon}
              iconColor={pilar.iconColor}
              iconBg={pilar.iconBg}
              footer={pilar.footer}
              footerColor={pilar.footerColor}
            />
          ))}
        </div>

      </div>
    </div>
  )
}
