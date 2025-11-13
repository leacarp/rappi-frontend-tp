import * as yup from 'yup'

export const createVendorSchema = yup.object({
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
  restaurantName: yup.string().required('Nombre del restaurante requerido'),
  description: yup.string().required('La descripción es requerida'),
  schedule: yup.string().required('Los horarios son requeridos'),
  category: yup.string().required('Categoría requerida'),
})