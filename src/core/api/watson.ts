import { paymentsInstance } from '.';
import { ParamsGet } from "src/core/models";

const BASE_URL = 'WatsonSearchFilter';

const api = {
	list(params: ParamsGet) {
		return paymentsInstance.get(BASE_URL, { params });
	},
	add(values: any) {
		return paymentsInstance.post(`${BASE_URL}`, values);
	},
	edit(values: any) {
		return paymentsInstance.put(BASE_URL, values);
	},
	delete(id: number) {
		return paymentsInstance.delete(`${BASE_URL}/${id}`);
	}
};

export default api;