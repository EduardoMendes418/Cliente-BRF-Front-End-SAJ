import { paymentsInstance } from "."
import { TLegalDocumentSwapFilter } from "../models/legal-document-swap"

const BASE_URL = "LegalDocumentSmartSwap"

const api = {
	get(params: TLegalDocumentSwapFilter) {
		return paymentsInstance.post(`${BASE_URL}/get-smart-swap`, params)
	},
	update(serviceUserId: number, filter: TLegalDocumentSwapFilter) {
		return paymentsInstance.put(`${BASE_URL}/update-smart-swap`, filter, {
			params: {
				serviceUserId
			}
		})
	}
}

export default api