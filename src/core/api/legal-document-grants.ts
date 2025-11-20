import { paymentsInstance } from "."
import { TLegalDocGrants, TLegalDocGrantsFilter } from "../models/legal-document-grants"

const BASE_URL = "LegalDocumentGrants"

const api = {
	get(id: number) {
		return paymentsInstance.get(BASE_URL, { params: { id } })
	},

	list(params: TLegalDocGrantsFilter) {
		return paymentsInstance.get(BASE_URL, { params })
	},

	add(legalDoc: TLegalDocGrants) {
		return paymentsInstance.post(BASE_URL, legalDoc)
	},

	edit(legalDoc: TLegalDocGrants) {
		return paymentsInstance.put(BASE_URL, legalDoc)
	},

	delete(id: number) {
		return paymentsInstance.delete(`${BASE_URL}/${id}`)
	},
}

export default api
