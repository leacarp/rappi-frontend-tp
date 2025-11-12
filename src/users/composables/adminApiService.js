import api from '../../common/composables/apiService.js'

const BASE_URL = '/users'

export const adminApi = {

    async createVendor(vendorData){
        console.log('Data:', vendorData);
        try{
            const response = await api.post(`${BASE_URL}/vendors/`, vendorData)
            return response.data
        } catch(error){
            const errorMessage = error.response?.data?.message || error.message || 'Error al crear vendor'
            console.error('Error al crear vendor', errorMessage)
            throw new Error(errorMessage)
        }
    }

}