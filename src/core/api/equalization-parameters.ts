import { TEqualizationParameters, TEqualizationParametersParams } from '../models/equalization-parameters';
import { paymentsInstance } from '.';

const BASE_URL = 'EqualizationParameters';

const api = {
	list(params: TEqualizationParametersParams) {
		return paymentsInstance.get(BASE_URL, { params });
	},

	add(values: TEqualizationParameters) {
		return paymentsInstance.post(BASE_URL, JSON.stringify(values));
	},

	getById(id: number) {
		return paymentsInstance.get(BASE_URL, { params: { id } });
	},

	edit(values: TEqualizationParameters & { id: number }) {
		return paymentsInstance.put(BASE_URL, JSON.stringify(values));
	},

	runEqualization(equalizationParametersIds: number[]) {
		return paymentsInstance.put(`${BASE_URL}/RunEqualization`, equalizationParametersIds);
	},
};

export default api;
