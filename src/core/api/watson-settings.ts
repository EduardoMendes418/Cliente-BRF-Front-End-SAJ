import { paymentsInstance } from '.';
import { TWatsonParameters } from 'src/core/models/watson'

const BASE_URL = 'WatsonLoadSettings';

const api = {
	list(id?:number) {
		return paymentsInstance.get(`${BASE_URL}`);
	},
	add(values: TWatsonParameters) {
		return paymentsInstance.post(`${BASE_URL}/post-patch-settings`, values);
	}
};

export default api;