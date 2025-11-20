import { paymentsInstance } from '.'

const BASE_URL = 'ProvisionAccounting'

const api = {
	getDefinitiveLow () {
		return paymentsInstance.get(`${BASE_URL}/definitive-low`)
	},
	accountContabilizationErrorByOrderId (orderId: number) {
		return paymentsInstance.post(`${BASE_URL}/account-contabilization-error-by-order-id`, {}, {params: {orderId}})
	},
	list(filters: any) {
		return paymentsInstance.post(`${BASE_URL}/get-definitive-low-executions`, 
			{...filters}, 
			{params: {
				notPaginate: filters?.notPaginate ?? false, 
				page: filters?.page ?? 1, 
				pageSize: filters?.pageSize ?? 30, 
			}
		})
	}, 
	fetchExcel(filters: object) {
		return paymentsInstance.post(`${BASE_URL}/get-definitive-low-executions-excel`, {...filters}, {
			responseType: "arraybuffer"
		})
	},

	costCenterReclassification(processId: number) {
		return paymentsInstance.get(`${BASE_URL}/cost-center-reclassification`, {
			params: {
				processId
			}
		})
	}
}

export default api;