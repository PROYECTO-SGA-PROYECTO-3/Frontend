import { z } from 'zod'

/**
 * Genera el esquema de validación Zod para el formulario de docente,
 * diferenciando los campos requeridos en creación vs edición.
 */
export function crearEsquemaDocente(esEdicion: boolean) {
  return z
    .object({
      primerNombre: z
        .string()
        .min(1, 'El primer nombre es obligatorio')
        .max(50, 'Máximo 50 caracteres'),
      segundoNombre: z
        .string()
        .max(50, 'Máximo 50 caracteres')
        .optional(),
      primerApellido: z
        .string()
        .min(1, 'El primer apellido es obligatorio')
        .max(50, 'Máximo 50 caracteres'),
      segundoApellido: z
        .string()
        .max(50, 'Máximo 50 caracteres')
        .optional(),
      documento: z.string().max(50).optional(),
      email: z.string().max(150).optional(),
      contrasena: z.string().optional(),
    })
    .superRefine((valores, ctx) => {
      if (esEdicion) return

      if (!valores.documento || valores.documento.trim() === '') {
        ctx.addIssue({
          code: 'custom',
          path: ['documento'],
          message: 'El número de identificación es obligatorio',
        })
      }

      if (!valores.email || valores.email.trim() === '') {
        ctx.addIssue({
          code: 'custom',
          path: ['email'],
          message: 'El correo institucional es obligatorio',
        })
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valores.email.trim())) {
        ctx.addIssue({
          code: 'custom',
          path: ['email'],
          message: 'Formato de correo electrónico no válido',
        })
      }

      if (!valores.contrasena || valores.contrasena.length < 8) {
        ctx.addIssue({
          code: 'custom',
          path: ['contrasena'],
          message: 'La contraseña inicial debe tener al menos 8 caracteres',
        })
      }

    })
}

export type DocenteFormValores = z.infer<ReturnType<typeof crearEsquemaDocente>>
