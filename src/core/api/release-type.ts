import { paymentsInstance } from '.'
import { TReleaseType, TReleaseTypeFilter } from '../models/release-type';

const BASE_URL = 'ReleaseType'

const api = {
	add(values: TReleaseType) {
		return paymentsInstance.post(BASE_URL, { ...values, status: true })
	},
	list(params: TReleaseTypeFilter) {
		return paymentsInstance.get(BASE_URL, { params })
	},
	get(id: number) {
		return paymentsInstance.get(`${BASE_URL}/${id}`)
	},
	edit(values: TReleaseType) {
		return paymentsInstance.put(BASE_URL, values)
	}
}

export default api