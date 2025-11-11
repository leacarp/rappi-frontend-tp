import api from '../../common/composables/apiService.js'

const BASE_URL = '/users'

export const adminApi = {

    async createVendor(vendorData){
        try{
            const response = await api.post(`${BASE_URL}/vendors/`, vendorData)
            return response.data
        } catch(error){
            const errorMessage = error.response?.data?.message || error.message || 'Error al crear vendor'
            throw new Error(errorMessage)
        }
    },

    async createDriver(driverData){
        console.log('Driver data: ', driverData);
        try{
            const response = await api.post(`${BASE_URL}/drivers/`, driverData)
            return response.data
        } catch(error){
            const errorMessage = error.response?.data?.message || error.message || 'Error al crear driver'
            console.error('Error al crear vendor', errorMessage)
            throw new Error(errorMessage)
        }
    }

}