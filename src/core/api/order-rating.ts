import { TOrderRatingDescription, TOrderRatingDescriptionFilter } from "../models/order-rating-description";
import { paymentsInstance } from ".";

const BASE_URL = 'OrderRatingDescription'

const api = {
	getAll(params: TOrderRatingDescriptionFilter) {
		return paymentsInstance.get(`${BASE_URL}/get-all`, { params })
	},
	getByName(params: TOrderRatingDescriptionFilter) {
		return paymentsInstance.get(`${BASE_URL}/get-by-name-like`, { params })
	},
	add(params: TOrderRatingDescription) {
		return paymentsInstance.post(`${BASE_URL}/create`, { ...params, isActive: true })
	},
	list(params: TOrderRatingDescriptionFilter) {
		return paymentsInstance.get(BASE_URL, { params })
	},
	get(id: number) {
		return paymentsInstance.get(`${BASE_URL}/${id}`)
	},
	edit(params: TOrderRatingDescription) {
		return paymentsInstance.put(`${BASE_URL}/update`, { ...params })
	}
}

export default api;