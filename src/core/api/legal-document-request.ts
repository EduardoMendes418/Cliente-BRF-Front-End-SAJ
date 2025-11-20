import { paymentsInstance } from "."
import { TLegalDoc, TLegalDocFilter, TLegalDocStatusUpdate } from "../models/legal-document-request"
import { upload } from "./utils"

const BASE_URL = "LegalDocumentRequests"



const api = {
	get(params: Partial<TLegalDocFilter>) {
		return paymentsInstance.get(BASE_URL, { params })
	},

	list(params: Partial<TLegalDocFilter>) {
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

	uploadFiles(id: number, filesList: FileList) {
		const url = `${BASE_URL}/uploadFiles?id=${id}`;
		return upload(paymentsInstance, url, filesList);
	},

	setStatus(values: TLegalDocStatusUpdate) {
		return paymentsInstance.patch(`${BASE_URL}/set-status`, undefined, {
			params: values
		})
	}
}

export default api
