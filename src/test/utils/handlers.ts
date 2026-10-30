import { http, HttpResponse } from 'msw'
import { admin, docente, estudiante } from './fixtures/usuarios'

type LoginBody = { documento?: string; contrasena?: string }

const usuarios = [docente, admin, estudiante]

export const handlers = [
  // Mock para el widget de clima en la cabecera de Login (Open-Meteo)
  http.get('https://api.open-meteo.com/*', () =>
    HttpResponse.json({
      current: {
        temperature_2m: 24,
        apparent_temperature: 24,
        relative_humidity_2m: 65,
        is_day: 1,
        weather_code: 0,
        wind_speed_10m: 10,
      },
    }),
  ),

  // Endpoint real de login del SGA
  http.post<never, LoginBody>('*/auth/login', async ({ request }) => {
    const { documento, contrasena } = await request.json()

    const usuario = usuarios.find(
      (u) => u.credenciales.documento === documento && u.credenciales.contrasena === contrasena,
    )

    return usuario
      ? HttpResponse.json(usuario.respuesta)
      : HttpResponse.json(
          { mensaje: 'Número de documento o contraseña incorrectos' },
          { status: 401 },
        )
  }),
]
