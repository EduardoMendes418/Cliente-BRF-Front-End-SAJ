
import { TOrderExpectation, TOrderExpectationFilter } from 'src/core/models/order-expectation';

import { paymentsInstance } from '.'

const BASE_URL = 'OrderExpectation'

const api = {
	getAll(params: TOrderExpectationFilter) {
		return paymentsInstance.get(`${BASE_URL}/get-all`, { params })
	},
	getByName(params: TOrderExpectationFilter) {
		return paymentsInstance.get(`${BASE_URL}/get-by-name-like`, { params })
	},
	add(params: TOrderExpectation) {
		return paymentsInstance.post(`${BASE_URL}/create`, { ...params, isActive: true })
	},
	list(params: TOrderExpectation) {
		return paymentsInstance.get(BASE_URL, { params })
	},
	get(id: number) {
		return paymentsInstance.get(`${BASE_URL}/${id}`)
	},
	edit(params: TOrderExpectation) {
		return paymentsInstance.put(`${BASE_URL}/update`, { ...params })
	}
}

export default api