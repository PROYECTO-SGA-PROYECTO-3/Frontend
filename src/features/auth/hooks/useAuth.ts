import { useAuthStore } from '../store'

/** Hook para acceder a la sesión activa en cualquier componente */
export function useAuth() {
  const token = useAuthStore((state) => state.token)
  const usuario = useAuthStore((state) => state.usuario)
  const isAuthStore = useAuthStore((state) => state.isAuthenticated)
  const isAuthenticated = isAuthStore || Boolean(token && usuario)
  const motivoCierre = useAuthStore((state) => state.motivoCierre)
  const setSesion = useAuthStore((state) => state.setSesion)
  const cerrarSesion = useAuthStore((state) => state.cerrarSesion)
  const limpiarMotivo = useAuthStore((state) => state.limpiarMotivo)

  return { token, usuario, isAuthenticated, motivoCierre, setSesion, cerrarSesion, limpiarMotivo }
}
