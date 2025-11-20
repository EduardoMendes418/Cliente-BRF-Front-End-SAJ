import { TOrderDescription, TOrderDescriptionFilter } from 'src/core/models/order-description';

import { paymentsInstance } from '.'

const BASE_URL = 'OrderDescription'

const api = {
	getAll(params: TOrderDescriptionFilter) {
		return paymentsInstance.get(`${BASE_URL}/get-all`, { params })
	},
	getByName(params: TOrderDescriptionFilter) {
		return paymentsInstance.get(`${BASE_URL}/get-by-name-like`, { params })
	},
	add(params: TOrderDescription) {
		return paymentsInstance.post(`${BASE_URL}/create`, { ...params, isActive: true })
	},
	list(params: TOrderDescriptionFilter) {
		return paymentsInstance.get(BASE_URL, { params })
	},
	get(id: number) {
		return paymentsInstance.get(`${BASE_URL}/${id}`)
	},
	edit(params: TOrderDescription) {
		return paymentsInstance.put(`${BASE_URL}/update`, { ...params })
	}
}

export default api