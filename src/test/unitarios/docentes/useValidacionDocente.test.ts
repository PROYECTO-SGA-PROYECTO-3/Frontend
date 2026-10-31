import { describe, expect, it } from 'vitest'
import { crearEsquemaDocente } from '@/features/docentes/hooks/useValidacionDocente'

type ResultadoValidacion = ReturnType<ReturnType<typeof crearEsquemaDocente>['safeParse']>

/** Reduce el resultado de Zod a un mapa campo → mensaje, legible en las aserciones */
const erroresDe = (resultado: ResultadoValidacion): Record<string, string> =>
  Object.fromEntries(
    (resultado.success ? [] : resultado.error.issues).map((incidencia) => [
      String(incidencia.path[0]),
      incidencia.message,
    ]),
  )

describe('Reglas de Admisión del Formulario de Docentes', () => {
  const datosPersonales = { primerNombre: 'Carlos', primerApellido: 'Gomez' }

  it('exige identificación, correo válido y contraseña segura al vincular un docente nuevo', () => {
    const esquemaCreacion = crearEsquemaDocente(false)

    expect(erroresDe(esquemaCreacion.safeParse(datosPersonales))).toEqual({
      documento: 'El número de identificación es obligatorio',
      email: 'El correo institucional es obligatorio',
      contrasena: 'La contraseña inicial debe tener al menos 8 caracteres',
    })

    const credencialesDefectuosas = esquemaCreacion.safeParse({
      ...datosPersonales,
      documento: '1098123456',
      email: 'carlos.gomez.sin.arroba',
      contrasena: 'corta',
    })
    expect(erroresDe(credencialesDefectuosas)).toEqual({
      email: 'Formato de correo electrónico no válido',
      contrasena: 'La contraseña inicial debe tener al menos 8 caracteres',
    })
  })

  it('permite corregir los datos personales sin reingresar documento, correo ni contraseña', () => {
    const esquemaEdicion = crearEsquemaDocente(true)

    expect(esquemaEdicion.safeParse(datosPersonales).success).toBe(true)

    // Aun en edición, el nombre y el apellido siguen siendo obligatorios
    expect(erroresDe(esquemaEdicion.safeParse({ primerNombre: '', primerApellido: '' }))).toEqual({
      primerNombre: 'El primer nombre es obligatorio',
      primerApellido: 'El primer apellido es obligatorio',
    })
  })
})
