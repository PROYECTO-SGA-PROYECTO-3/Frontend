import logo from '@/assets/logo-ie-descanse.png'
import { Badge } from '@/shared/ui/Badge'
import { footerData } from '../data/portal.data'

export function FooterSection() {
  return (
    <footer className="bg-slate-100 pt-16 pb-8 border-t border-slate-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Logo y Descripción */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <img src={logo} alt="Logo Institución" className="h-12 w-12 object-contain" />
              <span className="font-bold text-brand-800 text-lg leading-tight">I.E. Fray Isidoro<br/>de Montclar</span>
            </div>
            <p className="text-sm text-slate-600 mb-6 leading-relaxed">
              Educación rural y técnica agropecuaria para el desarrollo sostenible y la excelencia comunitaria en el sur del Cauca.
            </p>
            <Badge color="accent">
              Modalidad Técnica Agrícola
            </Badge>
          </div>

          {/* Datos Institucionales */}
          <div>
            <h4 className="font-bold text-slate-900 mb-6 tracking-wide text-sm">DATOS INSTITUCIONALES</h4>
            <ul className="space-y-3 text-sm text-slate-600">
              {footerData.institucional.map((item, index) => (
                <li key={index}>
                  <strong className="text-slate-800">{item.label}</strong> {item.value}
                </li>
              ))}
            </ul>
          </div>

          {/* Secciones Principales */}
          <div>
            <h4 className="font-bold text-slate-900 mb-6 tracking-wide text-sm">SECCIONES PRINCIPALES</h4>
            <ul className="space-y-3 text-sm text-slate-600">
              {footerData.secciones.map((seccion, index) => (
                <li key={index}>
                  <a href={seccion.href} className="hover:text-brand-600 transition-colors">
                    {seccion.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Canales y Enlaces */}
          <div>
            <h4 className="font-bold text-slate-900 mb-6 tracking-wide text-sm">CANALES Y ENLACES</h4>
            <p className="text-sm text-slate-600 mb-4">
              Acceso exclusivo a la plataforma de gestión académica y seguimiento docente.
            </p>
            <a href="/login" className="text-brand-700 font-semibold text-sm hover:underline">Ir a Plataforma SGA &rarr;</a>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-500 text-center md:text-left">
            &copy; {new Date().getFullYear()} Institución Educativa Agrícola Fray Isidoro de Montclar. Todos los derechos reservados.
          </p>
          <div className="flex gap-4 text-xs text-slate-500">
            <a href="#" className="hover:text-slate-800">Tratamiento de Datos</a>
            <a href="#" className="hover:text-slate-800">Transparencia y Acceso a la Información</a>
          </div>
        </div>

      </div>
    </footer>
  )
}
