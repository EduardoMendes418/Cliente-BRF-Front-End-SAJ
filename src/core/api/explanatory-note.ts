import { paymentsInstance } from '.'
import { TExplanatoryNote, TExplanatoryNoteFilter } from '../models/explanatory-note'

const BASE_URL = 'ExplanatoryNote'

const api = {
	add(values: TExplanatoryNote) {
		return paymentsInstance.post(BASE_URL, { ...values, status: true })
	},
	list(params: TExplanatoryNoteFilter) {
		return paymentsInstance.get(BASE_URL, { params })
	},
	get(id: number) {
		return paymentsInstance.get(`${BASE_URL}/${id}`)
	},
	edit(values: TExplanatoryNote) {
		return paymentsInstance.put(BASE_URL, values)
	}
}

export default api

