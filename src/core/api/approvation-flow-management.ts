import { paymentsInstance } from ".";

const BASE_URL = 'ApprovationFlowManagement'

const approvationFlowManagementAPI = {
	list(params?: any) {
		return paymentsInstance.get(BASE_URL, {params})
	},
	
	reprocessApprovationFlow(id: number){
		return paymentsInstance.put(`${BASE_URL}?id=${id}`)
	},

	cancelPayment(values: any){
		return paymentsInstance.put(`${BASE_URL}/cancel-payment`, values)
	}
}

export default approvationFlowManagementAPI;