import { paymentsInstance } from '.';
import { TNonWorkingDays, TNonWorkingDaysFilters } from 'src/core/models/non-working-days';
import { ParamsGet } from '../models';

const BASE_URL = 'NonWorkingDays'

const api = {
	list(params: ParamsGet & TNonWorkingDaysFilters) {
		return paymentsInstance.get(BASE_URL, { params });
	},

	add(values: TNonWorkingDays) {
		return paymentsInstance.post(BASE_URL, JSON.stringify(values));
	},

	edit(values: TNonWorkingDays & { id: number }) {
		return paymentsInstance.put(BASE_URL, JSON.stringify(values));
	},

	delete(id: number) {
		return paymentsInstance.delete(`${BASE_URL}/${id}`);
	}
};

export default api;
