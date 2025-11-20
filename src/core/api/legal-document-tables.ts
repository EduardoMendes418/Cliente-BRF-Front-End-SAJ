import { paymentsInstance } from "."

const BASE_URL = "LegalDocumentTables"

const api = {
	list() {
		return paymentsInstance.get(BASE_URL)
	},
}

export default api
