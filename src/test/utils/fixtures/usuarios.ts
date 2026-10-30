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

export const estudiante = {
  credenciales: {
    documento: '1000000003',
    contrasena: 'clave-estudiante-test',
  },
  respuesta: {
    token: 'token-falso-estudiante',
    documento: '1000000003',
    email: 'estudiante@example.test',
    primerNombre: 'Laura',
    segundoNombre: 'Sofia',
    primerApellido: 'Ramirez',
    segundoApellido: 'Perez',
    rol: 'ESTUDIANTE',
  } satisfies RespuestaLoginApi,
}
