import { paymentsInstance } from ".";

const BASE_URL = "BackgroundWorkerImport";

const api = {

	backgroundWorkerImport(params: any){
		return paymentsInstance.get(BASE_URL, {params})
	},
	getLog(params: any){
		return paymentsInstance.get(`${BASE_URL}/GetLog`, {params})
		
	},
	deleteBackgroundWorkerImport(id: number){
		return paymentsInstance.delete(`${BASE_URL}/${id}`)
	}

};

export default api;