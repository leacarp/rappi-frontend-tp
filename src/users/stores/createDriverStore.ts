import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useCreateDriverStore = defineStore('createDriver', () => {
  const form = ref({
    email: '',
    password: '',
    name: '',
    phone: '',
    vehicle: ''
  })

  const errors = ref({})
  const loading = ref(false)

  const resetForm = () => {
    form.value = {
      email: '',
      password: '',
      name: '',
      phone: '',
      vehicle: ''
    }
    errors.value = {}
  }

  const setErrors = (newErrors) => {
    errors.value = newErrors
  }

  const setLoading = (value) => {
    loading.value = value
  }

  return {
    form,
    errors,
    loading,
    resetForm,
    setErrors,
    setLoading,
  }
})