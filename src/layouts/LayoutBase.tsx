import { useCallback, useEffect, useState } from 'react'
import { Menu } from 'lucide-react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from './components/Sidebar'
import { Footer } from './components/Footer'
import { useAnioLectivo } from '@/features/configuracion'

export function Layout() {
  const cargarAnios = useAnioLectivo().cargarAnios
  const [sidebarAbierto, setSidebarAbierto] = useState(false)
  const cerrarSidebar = useCallback(() => setSidebarAbierto(false), [])
  const alternarSidebar = useCallback(() => setSidebarAbierto((v) => !v), [])

  useEffect(() => {
    cargarAnios()
  }, [cargarAnios])

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <Sidebar abierto={sidebarAbierto} onCerrar={cerrarSidebar} />
      <div className="relative flex flex-1 flex-col overflow-y-auto">
        <button
          type="button"
          aria-label="Abrir menú"
          onClick={alternarSidebar}
          className="absolute left-4 top-4 z-20 cursor-pointer rounded-lg bg-white p-2 text-slate-500 shadow-sm ring-1 ring-slate-200 hover:bg-slate-50 lg:hidden"
        >
          <Menu size={20} />
        </button>
        <div className="flex flex-1 flex-col">
          <Outlet />
        </div>
        <Footer />
      </div>
    </div>
  )
}
