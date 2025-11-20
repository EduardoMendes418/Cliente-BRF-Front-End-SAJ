import { TCivilMass, TCivilMassParams } from '../models/civil-mass';
import { paymentsInstance } from '.';

const BASE_URL = 'CivilMass';

const api = {
	list(params: TCivilMassParams) {
		return paymentsInstance.get(BASE_URL, { params });
	},

	add(values: TCivilMass) {
		return paymentsInstance.post(BASE_URL, JSON.stringify(values));
	},

	getById(id: number) {
		return paymentsInstance.get(BASE_URL, { params: { id } });
	},

	edit(values: TCivilMass & { id: number }) {
		return paymentsInstance.put(BASE_URL, JSON.stringify(values));
	},
};

export default api;
