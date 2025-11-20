import { TLegalDocDraftType, TLegalDocDraftTypeFilter } from "../models/legal-document-draft-types"
import { paymentsInstance } from "."
import { upload } from './utils'

const BASE_URL = "LegalDocumentDraftTypes"

const api = {
	get(id: number) {
		return paymentsInstance.get(BASE_URL, { params: { id } })
	},

	list(params: TLegalDocDraftTypeFilter) {
		return paymentsInstance.get(BASE_URL, { params })
	},

	add(legalDoc: TLegalDocDraftType) {
		return paymentsInstance.post(BASE_URL, legalDoc)
	},

	edit(legalDoc: TLegalDocDraftType) {
		return paymentsInstance.put(BASE_URL, legalDoc)
	},

	delete(id: number) {
		return paymentsInstance.delete(`${BASE_URL}/${id}`)
	},

	uploadFiles(draftTypeId: number, fileList: FileList) {
		const url = `${BASE_URL}/uploadFiles?draftTypeId=${draftTypeId}`;
		return upload(paymentsInstance, url, fileList);
	},

	deleteFile(id: number) {
		return paymentsInstance.delete(`${BASE_URL}/deleteFile?fileId=${id}`);
	},
}

export default api
