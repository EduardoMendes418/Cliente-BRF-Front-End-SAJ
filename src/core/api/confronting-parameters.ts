import { TOrderConfrontingFilter, TOrderConfrontingType } from 'src/core/models/confronting-parameters';

import { paymentsInstance } from '.'

const BASE_URL = 'ConfrontingParameter'

const api = {
	getAll(params: TOrderConfrontingFilter) {
		return paymentsInstance.get(BASE_URL, { params })
	},
	edit(params: TOrderConfrontingType) {
		return paymentsInstance.put(BASE_URL, { ...params })
	},
	add(params: TOrderConfrontingType) {
		return paymentsInstance.post(BASE_URL, { ...params })
	},
	delete(id: string) {
		return paymentsInstance.delete(BASE_URL, { params: { id } })
	},
	get(id: number) {
		return paymentsInstance.get(`${BASE_URL}/${id}`)
	},
}

export default api