
import { TOrderProbability, TOrderProbabilityFilter } from 'src/core/models/order-probability';

import { paymentsInstance } from '.'

const BASE_URL = 'OrderProbability'

const api = {
	getAll(params: TOrderProbabilityFilter) {
		return paymentsInstance.get(`${BASE_URL}/get-all`, { params })
	},
	getByName(params: TOrderProbabilityFilter) {
		return paymentsInstance.get(`${BASE_URL}/get-by-name-like`, { params })
	},
	add(probability: TOrderProbability) {
		return paymentsInstance.post(`${BASE_URL}/create`, probability)
	},
	list(params: TOrderProbabilityFilter) {
		return paymentsInstance.get(BASE_URL, { params })
	},
	get(id: number) {
		return paymentsInstance.get(`${BASE_URL}/${id}`)
	},
	edit(params: TOrderProbability) {
		return paymentsInstance.put(`${BASE_URL}/update`, { ...params })
	}
}

export default api