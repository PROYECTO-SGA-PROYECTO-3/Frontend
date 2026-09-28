import { z } from 'zod'

/**
 * Genera el esquema de validación Zod para el formulario de estudiante,
 * diferenciando los campos obligatorios en creación vs edición.
 */
export function crearEsquemaEstudiante(esEdicion: boolean) {
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
      documento: z.string().max(50, 'Máximo 50 caracteres').optional(),
      email: z.string().max(150, 'Máximo 150 caracteres').optional(),
      contrasena: z.string().optional(),
    })
    .superRefine((valores, ctx) => {
      if (esEdicion) return

      // Validaciones exclusivas de creación de nuevo estudiante
      if (!valores.documento || valores.documento.trim() === '') {
        ctx.addIssue({
          code: 'custom',
          path: ['documento'],
          message: 'El número de identificación es obligatorio',
        })
      } else if (valores.documento.trim().length < 3) {
        ctx.addIssue({
          code: 'custom',
          path: ['documento'],
          message: 'El documento debe tener al menos 3 caracteres',
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

export type EstudianteFormValores = z.infer<ReturnType<typeof crearEsquemaEstudiante>>
