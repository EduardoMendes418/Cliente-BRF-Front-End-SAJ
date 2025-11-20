import { paymentsInstance } from '.';

const BASE_URL = 'Users/current'

const api = {
	get() {
		return paymentsInstance.get(BASE_URL);
	}
};

export default api;
