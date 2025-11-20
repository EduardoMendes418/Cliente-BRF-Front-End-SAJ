import { paymentsInstance } from '.'
import { TGuaranteeType, TGuaranteeFilter } from '../models/guarantee-type'

const BASE_URL = 'GuaranteeType'

const api = {
	add(item: TGuaranteeType) {
		return paymentsInstance.post(BASE_URL, { 
			description: item.description, 
			paymentTypeId: item.paymentTypeId,
			status: true 
		})
	},
	list(params: TGuaranteeFilter) {
		return paymentsInstance.get(BASE_URL, { params })
	},
	get(id: number) {
		return paymentsInstance.get(`${BASE_URL}/${id}`)
	},
	edit(guaranteeType: TGuaranteeType) {
		return paymentsInstance.put(BASE_URL, guaranteeType)
	}
}

export default api

