import { TEqualizationParams } from '../models/equalization';
import { paymentsInstance } from '.';

const BASE_URL = 'Equalization';

const api = {
	list(params: TEqualizationParams) {
		return paymentsInstance.get(BASE_URL, { params });
	},

	getById(id: number) {
		return paymentsInstance.get(BASE_URL, { params: { id } });
	},

	exportReport() {
		return paymentsInstance.post(`${BASE_URL}/export-equalization`);
	}
};

export default api;
