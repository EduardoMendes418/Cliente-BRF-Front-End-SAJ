import { paymentsInstance } from ".";

const BASE_URL = 'CircularizationBaseGeneration'

const circularizationBaseGenerationAPI = {
	
	list(params?: any) {
		return paymentsInstance.get(BASE_URL, {params})
	},

	getExtract(params: any){
		return paymentsInstance.get(`${BASE_URL}/Get-Extract?`, {params})
	}

}

export default circularizationBaseGenerationAPI;