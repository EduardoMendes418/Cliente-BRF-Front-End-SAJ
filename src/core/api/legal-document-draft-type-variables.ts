import { paymentsInstance } from "."

const BASE_URL = "LegalDocumentDraftTypeVariables"

const api = {

	setVariableActive(id: number, isActive: boolean) {
		return paymentsInstance.patch(`${BASE_URL}/set-active`, undefined, {
			params: { id, active: isActive }
		})
	},

}

export default api
