import { paymentsInstance } from '.';
import { TRequestParameters, TRequestParametersFilters } from 'src/core/models/request-parameters';
import { ParamsGet } from '../models';

const BASE_URL = 'RequestParameters'

const api = {
	list(params: ParamsGet & TRequestParametersFilters) {
		return paymentsInstance.get(BASE_URL, { params });
	},

	add(values: TRequestParameters) {
		return paymentsInstance.post(BASE_URL, JSON.stringify(values));
	},

	edit(values: TRequestParameters & { id: number }) {
		return paymentsInstance.put(BASE_URL, JSON.stringify(values));
	},
};

export default api;
