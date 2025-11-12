import * as yup from 'yup'

export const createDriverSchema = yup.object({
  email: yup
    .string()
    .required('Email requerido')
    .email('Formato de email inválido'),
  password: yup
    .string()
    .required('Contraseña requerida')
    .min(6, 'Mínimo 6 caracteres'),
  name: yup.string().required('Nombre del representante requerido'),
  phone: yup.string().required('Teléfono requerido').length(10, 'El teléfono debe tener exactamente 10 dígitos'),
  vehicle: yup.string().required('Vehículo requerido')
})