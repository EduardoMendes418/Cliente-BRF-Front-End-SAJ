import { paymentsInstance } from "."
import { TLegalDocServiceOpinion, TLegalDocServiceOpinionFilter } from "../models/legal-document-service-opinions"

const BASE_URL = "LegalDocumentServiceOpinions"

const api = {
	get(id: number) {
		return paymentsInstance.get(BASE_URL, { params: { id } })
	},

	list(params: TLegalDocServiceOpinionFilter) {
		return paymentsInstance.get(BASE_URL, { params })
	},

	add(legalDoc: TLegalDocServiceOpinion) {
		return paymentsInstance.post(BASE_URL, legalDoc)
	},

	edit(legalDoc: TLegalDocServiceOpinion) {
		return paymentsInstance.put(BASE_URL, legalDoc)
	},

	delete(id: number) {
		return paymentsInstance.delete(`${BASE_URL}/${id}`)
	},
}

export default api
