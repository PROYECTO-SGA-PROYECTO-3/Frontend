import type { RespuestaLoginApi } from '@/features/auth/api/authApi'

export const docente = {
  credenciales: {
    documento: '1000000001',
    contrasena: 'clave-docente-test',
  },
  respuesta: {
    token: 'token-falso-docente',
    documento: '1000000001',
    email: 'docente@example.test',
    primerNombre: 'Carlos',
    segundoNombre: 'Alberto',
    primerApellido: 'Gomez',
    segundoApellido: 'Restrepo',
    rol: 'DOCENTE',
  } satisfies RespuestaLoginApi,
}

export const admin = {
  credenciales: {
    documento: '1000000002',
    contrasena: 'clave-admin-test',
  },
  respuesta: {
    token: 'token-falso-admin',
    documento: '1000000002',
    email: 'admin@example.test',
    primerNombre: 'Ana',
    segundoNombre: null,
    primerApellido: 'Martinez',
    segundoApellido: null,
    rol: 'ADMIN',
  } satisfies RespuestaLoginApi,
}
