import { Home, Target, Network, Mail, Compass, Leaf, MonitorSmartphone, HeartHandshake } from 'lucide-react'

export const navItems = [
  { name: 'Inicio', href: '#inicio', icon: Home, active: true },
  { name: 'Misión y Visión', href: '#institucional', icon: Target },
  { name: 'Pilares Pedagógicos', href: '#pilares', icon: Network },
  { name: 'Información y Contacto', href: '#contacto', icon: Mail },
]

export const institucionalData = {
  mision: {
    title: 'Nuestra Misión',
    desc: 'Brindar una educación integral de alta calidad, fundamentada en valores éticos, innovación tecnológica y excelencia académica. Formamos ciudadanos críticos y proactivos, capaces de liderar y transformarse y a su entorno social para construir una sociedad más justa y equitativa.',
    icon: Target,
  },
  vision: {
    title: 'Nuestra Visión',
    desc: 'Ser reconocidos para el año 2026 como una institución educativa líder a nivel nacional, referente en metodologías de enseñanza innovadoras y formación humanista. Proyectamos estudiantes globalmente competitivos, preparados para los desafíos del mañana.',
    icon: Compass,
  }
}

export const pilaresData = [
  {
    icon: Leaf,
    iconColor: 'text-brand-600',
    iconBg: 'bg-brand-50',
    title: 'Educación Agropecuaria Sostenible',
    desc: 'Proyectos pedagógicos productivos (PPP), agroecología, conservación de semillas nativas y preservación de fuentes hídricas del Macizo Colombiano.',
    footer: 'PRÁCTICAS EN FINCA ESCOLAR',
    footerColor: 'text-brand-600'
  },
  {
    icon: MonitorSmartphone,
    iconColor: 'text-brand-600',
    iconBg: 'bg-brand-50',
    title: 'Innovación y Gestión Digital',
    desc: 'Planillas sistematizadas, generación de boletines oficiales sin papel, reportes en tiempo real y conectividad adaptada a contextos rurales.',
    footer: 'TECNOLOGÍA AL SERVICIO DEL AULA',
    footerColor: 'text-brand-600'
  },
  {
    icon: HeartHandshake,
    iconColor: 'text-accent-600',
    iconBg: 'bg-accent-50',
    title: 'Convivencia y Habilidades Socioemocionales',
    desc: 'Cátedra para la paz, resolución comunitaria de conflictos, desarrollo de liderazgo juvenil y fortalecimiento de la identidad cultural montclariana.',
    footer: 'FORMACIÓN EN VALORES',
    footerColor: 'text-accent-600'
  },
  {
    icon: Network,
    iconColor: 'text-slate-600',
    iconBg: 'bg-slate-100',
    title: 'Comunidad y Red Rural',
    desc: 'Articulación permanente entre la sede principal de Descanse y las escuelas rurales mixtas asociadas a lo largo y ancho del territorio.',
    footer: 'INTEGRACIÓN TERRITORIAL',
    footerColor: 'text-slate-600'
  }
]

export const footerData = {
  institucional: [
    { label: 'DANE:', value: '419701000995' },
    { label: 'NIT:', value: '817002673-1' },
    { label: 'Ubicación:', value: 'Corregimiento de Descanse' },
    { label: 'Municipio:', value: 'Santa Rosa, Cauca - Colombia' },
    { label: 'Resolución:', value: 'Reconocimiento Oficial S.E.D.' },
    { label: 'Correo:', value: 'institucionagricola@edu.co' },
  ],
  secciones: [
    { name: 'Nuestra Institución y Misión', href: '#' },
    { name: 'Red de Sedes Rurales', href: '#' },
    { name: 'Plan de Estudios Agropecuario', href: '#' },
    { name: 'Boletines y Comunicados', href: '#' },
    { name: 'Atención al Ciudadano y PQRS', href: '#' },
  ]
}
