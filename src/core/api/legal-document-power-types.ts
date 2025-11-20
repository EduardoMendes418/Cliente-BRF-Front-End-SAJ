import { paymentsInstance } from "."
import { TLegalDocPowerType, TLegalDocPowerTypeFilter } from "../models/legal-document-power-types"

const BASE_URL = "LegalDocumentPowerTypes"

const api = {
	get(id: number) {
		return paymentsInstance.get(BASE_URL, { params: { id } })
	},

	list(params: TLegalDocPowerTypeFilter) {
		return paymentsInstance.get(BASE_URL, { params })
	},

	add(legalDoc: TLegalDocPowerType) {
		return paymentsInstance.post(BASE_URL, legalDoc)
	},

	edit(legalDoc: TLegalDocPowerType) {
		return paymentsInstance.put(BASE_URL, legalDoc)
	},

	delete(id: number) {
		return paymentsInstance.delete(`${BASE_URL}/${id}`)
	},
}

export default api
