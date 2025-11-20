import { paymentsInstance } from '.';
import { TEconomicIndices, TEconomicIndicesFilters } from 'src/core/models/economic-indices';
import { ParamsGet } from '../models';

const BASE_URL = 'EconomicIndices'

const api = {
	list(params: ParamsGet & TEconomicIndicesFilters) {
		return paymentsInstance.get(BASE_URL, { params });
	},

	add(values: TEconomicIndices) {
		return paymentsInstance.post(BASE_URL, JSON.stringify(values));
	},

	edit(values: TEconomicIndices & { id: number }) {
		return paymentsInstance.put(BASE_URL, JSON.stringify(values));
	},
};

export default api;
