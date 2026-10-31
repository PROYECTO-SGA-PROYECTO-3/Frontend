import { describe, expect, it } from 'vitest'
import { AxiosError, type AxiosResponse } from 'axios'
import { extraerMensajeError } from '@/shared/lib/api-errors'

/**
 * Construye un error de red equivalente al que produce Axios cuando el backend
 * responde con un código de fallo, para evaluar la traducción del cuerpo recibido.
 */
function crearErrorDelBackend(
  cuerpo: unknown,
  mensajeTecnico = 'Request failed with status code 400',
): AxiosError {
  return new AxiosError(mensajeTecnico, 'ERR_BAD_REQUEST', undefined, undefined, {
    data: cuerpo,
  } as AxiosResponse)
}

describe('Traducción de Errores del Servidor a Mensajes para el Usuario', () => {
  it('muestra la explicación institucional que envía el servidor', () => {
    const reglaDeNegocio = crearErrorDelBackend({
      mensaje: 'El documento 1098123456 ya está registrado en la institución',
    })
    expect(extraerMensajeError(reglaDeNegocio)).toBe(
      'El documento 1098123456 ya está registrado en la institución',
    )

    const erroresDeFormulario = crearErrorDelBackend({
      campos: {
        email: 'El correo ya está en uso',
        contrasena: 'La contraseña debe tener al menos 8 caracteres',
      },
    })
    expect(extraerMensajeError(erroresDeFormulario)).toBe(
      'El correo ya está en uso. La contraseña debe tener al menos 8 caracteres',
    )
  })

  it('descarta los títulos técnicos de HTTP y conserva solo los motivos comprensibles', () => {
    const motivoReal = crearErrorDelBackend({
      error: 'La asignatura tiene carga académica asignada y no puede eliminarse',
    })
    expect(extraerMensajeError(motivoReal)).toBe(
      'La asignatura tiene carga académica asignada y no puede eliminarse',
    )

    const tituloGenerico = crearErrorDelBackend({ error: 'Bad Request' })
    expect(extraerMensajeError(tituloGenerico)).toBe('Request failed with status code 400')
  })
})
