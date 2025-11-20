import { paymentsInstance } from ".";
import { TModuloFilter } from "../models/modulo";

const BASE_URL = "Modulo";

const api = {
	list(params: TModuloFilter) {
		return paymentsInstance.get(BASE_URL, {
			params
		});
	},
};

export default api;
