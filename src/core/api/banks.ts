import { paymentsInstance } from '.';

const BASE_URL = 'Banks';

const api = {
	getBanks() {
		return paymentsInstance.get(BASE_URL);
	},
};

export default api;
