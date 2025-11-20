import { paymentsInstance } from '.'
import { TAccountType, TAccountTypeFilter } from '../models/account-type';

const BASE_URL = 'AccountType'

const api = {
	add(values: TAccountType) {
		return paymentsInstance.post(BASE_URL, { ...values, status: true })
	},
	list(params: TAccountTypeFilter) {
		return paymentsInstance.get(BASE_URL, { params })
	},
	get(id: number) {
		return paymentsInstance.get(`${BASE_URL}/${id}`)
	},
	edit(values: TAccountType) {
		return paymentsInstance.put(BASE_URL, values)
	}
}

export default api