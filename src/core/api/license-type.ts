import { paymentsInstance } from '.'
import { TLicenseType, TLicenseFilter } from '../models/license-type'

const BASE_URL = 'LicenseType'

const api = {
	add(description: string) {
		return paymentsInstance.post(BASE_URL, { description, status: true })
	},
	list(params: TLicenseFilter) {
		return paymentsInstance.get(BASE_URL, { params })
	},
	get(id: number) {
		return paymentsInstance.get(`${BASE_URL}/${id}`)
	},
	edit(licenseType: TLicenseType) {
		return paymentsInstance.put(BASE_URL, licenseType)
	}
}

export default api

