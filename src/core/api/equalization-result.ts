import { TEqualizationResultParams } from '../models/equalization-result';
import { paymentsInstance } from '.';

const BASE_URL = 'EqualizationResult';

const api = {
	list(params: TEqualizationResultParams) {
		return paymentsInstance.get(BASE_URL, { params });
	},
};

export default api;
