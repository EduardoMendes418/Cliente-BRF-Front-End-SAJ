import { TOrderStatus, TOrderStatusFilter } from 'src/core/models/order-status';

import { paymentsInstance } from '.'

const BASE_URL = 'OrderStatus'

const api = {
	getAll(params: TOrderStatusFilter) {
		return paymentsInstance.get(`${BASE_URL}/get-all`, { params })
	},
	getByName(params: TOrderStatusFilter) {
		return paymentsInstance.get(`${BASE_URL}/get-by-name-like`, { params })
	},
	add(params: TOrderStatus) {
		return paymentsInstance.post(`${BASE_URL}/create`, params)
	},
	list(params: TOrderStatusFilter) {
		return paymentsInstance.get(BASE_URL, { params })
	},
	get(id: number) {
		return paymentsInstance.get(`${BASE_URL}/${id}`)
	},
	edit(params: TOrderStatus) {
		return paymentsInstance.put(`${BASE_URL}/update`, { ...params })
	}
}

export default api