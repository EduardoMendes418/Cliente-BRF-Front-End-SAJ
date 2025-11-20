import { paymentsInstance } from "."

const BASE_URL = "LegalDocumentDraftTypeBlocks"

const api = {

	setBlockActive(id: number, isActive: boolean) {
		return paymentsInstance.patch(`${BASE_URL}/set-active`, undefined, {
			params: { id, active: isActive }
		})
	},

}

export default api
