import { PilarCard } from './PilarCard'
import { pilaresData } from '../data/portal.data'
import { motion, type Variants } from 'framer-motion'

export function PilaresSection() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  }

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30, transition: { duration: 0.3, ease: "easeIn" } },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  }

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

        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, amount: 0.2 }}
        >
          {pilaresData.map((pilar, index) => (
            <motion.div key={index} variants={itemVariants} className="h-full">
              <PilarCard
                title={pilar.title}
                desc={pilar.desc}
                Icon={pilar.icon}
                iconColor={pilar.iconColor}
                iconBg={pilar.iconBg}
                footer={pilar.footer}
                footerColor={pilar.footerColor}
              />
            </motion.div>
          ))}
        </motion.div>

      </div>
    </div>
  )
}
