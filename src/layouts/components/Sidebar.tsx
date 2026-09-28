import { NavLink } from 'react-router-dom'
import {
  BarChart3,
  BookMarked,
  BookOpen,
  CalendarDays,
  ClipboardList,
  FileText,
  GraduationCap,
  HelpCircle,
  Home,
  LayoutDashboard,
  LogOut,
  Settings,
  Users,
  type LucideIcon,
} from 'lucide-react'
import { useAuth, useAuthorization, type Rol } from '@/features/auth'
import { cn, nombreCompleto } from '@/shared/lib/utils'
import { Avatar } from '@/shared/ui/Avatar'
import logoIe from '@/assets/logo-ie-descanse.png'

interface ItemNav {
  etiqueta: string
  ruta: string
  icono: LucideIcon
  roles: Rol[]
}

/**
 * Catálogo maestro declarativo de navegación principal por roles autorizados (Regla 5).
 */
const ITEMS_NAV_PRINCIPAL: ItemNav[] = [
  // Dashboards / Vistas iniciales por rol
  { etiqueta: 'Dashboard', ruta: '/admin', icono: LayoutDashboard, roles: ['ADMIN'] },
  { etiqueta: 'Inicio', ruta: '/docente', icono: LayoutDashboard, roles: ['DOCENTE'] },
  { etiqueta: 'Inicio', ruta: '/estudiante', icono: Home, roles: ['ESTUDIANTE'] },

  // Calendario institucional compartido
  {
    etiqueta: 'Calendario',
    ruta: '/calendario',
    icono: CalendarDays,
    roles: ['ADMIN', 'DOCENTE', 'ESTUDIANTE'],
  },

  // Gestión administrativa (Admin)
  { etiqueta: 'Docentes', ruta: '/admin/docentes', icono: Users, roles: ['ADMIN'] },
  { etiqueta: 'Estudiantes', ruta: '/admin/estudiantes', icono: GraduationCap, roles: ['ADMIN'] },
  { etiqueta: 'Cursos', ruta: '/admin/cursos', icono: BookOpen, roles: ['ADMIN'] },
  { etiqueta: 'Materias', ruta: '/admin/materias', icono: BookMarked, roles: ['ADMIN'] },
  { etiqueta: 'Reportes', ruta: '/admin/reportes', icono: BarChart3, roles: ['ADMIN'] },

  // Módulos docentes
  {
    etiqueta: 'Planilla de Calificaciones',
    ruta: '/docente/planilla',
    icono: ClipboardList,
    roles: ['DOCENTE'],
  },

  // Módulos estudiantes
  {
    etiqueta: 'Calificaciones',
    ruta: '/estudiante/calificaciones',
    icono: FileText,
    roles: ['ESTUDIANTE'],
  },
]

/**
 * Catálogo declarativo de navegación secundaria (pie de barra) por roles autorizados.
 */
const ITEMS_NAV_SECUNDARIO: ItemNav[] = [
  // Configuración por rol
  { etiqueta: 'Configuración', ruta: '/admin/configuracion', icono: Settings, roles: ['ADMIN'] },
  { etiqueta: 'Configuración', ruta: '/docente/configuracion', icono: Settings, roles: ['DOCENTE'] },

  // Soporte por rol
  { etiqueta: 'Soporte', ruta: '/admin/soporte', icono: HelpCircle, roles: ['ADMIN'] },
  { etiqueta: 'Soporte', ruta: '/docente/soporte', icono: HelpCircle, roles: ['DOCENTE'] },
  { etiqueta: 'Soporte', ruta: '/estudiante/soporte', icono: HelpCircle, roles: ['ESTUDIANTE'] },
]

interface SidebarProps {
  abierto: boolean
  onCerrar: () => void
}

export function Sidebar({ abierto, onCerrar }: SidebarProps) {
  const { usuario, cerrarSesion } = useAuth()
  const { hasAnyRole } = useAuthorization()

  const items = ITEMS_NAV_PRINCIPAL.filter((item) => hasAnyRole(item.roles))
  const itemsSecundarios = ITEMS_NAV_SECUNDARIO.filter((item) => hasAnyRole(item.roles))

  return (
    <>
      {abierto && (
        <div
          className="fixed inset-0 z-30 bg-black/50 transition-opacity lg:hidden"
          onClick={onCerrar}
        />
      )}

      <aside
        aria-label="Barra lateral de navegación"
        className={cn(
          'flex h-full w-64 shrink-0 flex-col border-r border-slate-200 bg-white',
          'fixed inset-y-0 left-0 z-40 transition-transform duration-300 ease-in-out',
          'lg:relative lg:translate-x-0',
          abierto ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex h-21 items-center gap-3 border-b border-slate-200 px-5 py-5">
          <img src={logoIe} alt="Escudo institucional" className="h-11 w-11 object-contain" />
          <div className="leading-tight">
            <p className="text-sm font-bold text-slate-900">IE FRAY ISIDORO</p>
            <p className="text-xs font-bold tracking-wide text-brand-700 uppercase">de Montclar</p>
          </div>
        </div>

        <nav aria-label="Navegación principal" className="flex flex-1 flex-col gap-1 px-3 py-4">
          {items.map(({ etiqueta, ruta, icono: Icono }) => (
            <NavLink
              key={ruta}
              to={ruta}
              end
              onClick={onCerrar}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition',
                  isActive ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-slate-50',
                )
              }
            >
              <Icono size={18} />
              {etiqueta}
            </NavLink>
          ))}

          {itemsSecundarios.length > 0 && (
            <div className="mt-auto space-y-1 border-t border-slate-100 pt-3">
              {itemsSecundarios.map(({ etiqueta, ruta, icono: Icono }) => (
                <NavLink
                  key={ruta}
                  to={ruta}
                  onClick={onCerrar}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition',
                      isActive ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-slate-50',
                    )
                  }
                >
                  <Icono size={18} />
                  {etiqueta}
                </NavLink>
              ))}
            </div>
          )}
        </nav>

        <div className="flex items-center gap-3 border-t border-slate-200 px-4 py-4">
          <Avatar nombre={usuario ? nombreCompleto(usuario) : ''} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-slate-900">
              {usuario && nombreCompleto(usuario)}
            </p>
            <p className="truncate text-xs text-slate-500">{usuario?.email}</p>
          </div>
          <button
            type="button"
            aria-label="Cerrar sesión"
            onClick={cerrarSesion}
            className="shrink-0 cursor-pointer rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <LogOut size={16} />
          </button>
        </div>
      </aside>
    </>
  )
}
