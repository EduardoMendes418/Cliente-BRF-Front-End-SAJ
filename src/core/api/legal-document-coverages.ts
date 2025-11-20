import { paymentsInstance } from "."
import { TLegalDoc, TLegalDocFilter } from "../models/legal-document-coverages"

const BASE_URL = "LegalDocumentCoverages"

const api = {
	get(id: number) {
		return paymentsInstance.get(BASE_URL, { params: { id } })
	},

	list(params: TLegalDocFilter) {
		return paymentsInstance.get(BASE_URL, { params })
	},

	add(legalDoc: TLegalDoc) {
		return paymentsInstance.post(BASE_URL, legalDoc)
	},

	edit(legalDoc: TLegalDoc) {
		return paymentsInstance.put(BASE_URL, legalDoc)
	},

	delete(id: number) {
		return paymentsInstance.delete(`${BASE_URL}/${id}`)
	},
}

export default api
