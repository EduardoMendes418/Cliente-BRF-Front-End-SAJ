import { paymentsInstance } from "."
import { TLegalDocReqStatus, TLegalDocReqStatusFilter } from "../models/legal-document-request-status"

const BASE_URL = "LegalDocumentRequestStatus"

const api = {
	get(id: number) {
		return paymentsInstance.get(BASE_URL, { params: { id } })
	},

	list(params: TLegalDocReqStatusFilter) {
		return paymentsInstance.get(BASE_URL, { params })
	},

	add(legalDoc: TLegalDocReqStatus) {
		return paymentsInstance.post(BASE_URL, legalDoc)
	},

	edit(legalDoc: TLegalDocReqStatus) {
		return paymentsInstance.put(BASE_URL, legalDoc)
	},

	delete(id: number) {
		return paymentsInstance.delete(`${BASE_URL}/${id}`)
	},
}

export default api
