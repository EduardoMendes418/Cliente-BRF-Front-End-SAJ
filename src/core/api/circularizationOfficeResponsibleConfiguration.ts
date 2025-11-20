import { paymentsInstance } from ".";

const BASE_URL = 'CircularizationOffice'

const circularizationOfficeResponsibleConfigurationAPI = {
	list(params?: any) {
		return paymentsInstance.get(BASE_URL, {params})
	},
	add(values: any) {
		return paymentsInstance.post(BASE_URL, JSON.stringify(values));
	},
	getOffices(params?: any) {
		return paymentsInstance.get(`${BASE_URL}/offices?parenteAreaId=38`)
	}
}

export default circularizationOfficeResponsibleConfigurationAPI;