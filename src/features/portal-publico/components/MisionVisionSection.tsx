import { InfoCard } from './InfoCard'
import { institucionalData } from '../data/portal.data'
import { motion, type Variants } from 'framer-motion'

export function MisionVisionSection() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.3 }
    }
  }

  const itemVariants: Variants = {
    hidden: { opacity: 0, x: -30, transition: { duration: 0.3, ease: "easeIn" } },
    show: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } }
  }

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
        <motion.div 
          className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-10 lg:max-w-none lg:grid-cols-2 lg:gap-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, amount: 0.2 }}
        >
          
          <motion.div variants={itemVariants}>
            <InfoCard
              title={institucionalData.mision.title}
              desc={institucionalData.mision.desc}
              Icon={institucionalData.mision.icon}
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <InfoCard
              title={institucionalData.vision.title}
              desc={institucionalData.vision.desc}
              Icon={institucionalData.vision.icon}
            />
          </motion.div>

        </motion.div>
      </div>
    </section>
  )
}
