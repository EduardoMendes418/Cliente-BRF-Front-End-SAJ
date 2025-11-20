import {paymentsInstance} from "./index";

const BASE_URL = "LitigationJustice"

const api = {
	list() {
		return paymentsInstance.get(BASE_URL)
	}
}

export default api;