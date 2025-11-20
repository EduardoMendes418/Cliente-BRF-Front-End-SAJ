import { TTaxRatesINSS, TTaxRatesINSSFilters } from '../models/tax-rates-inss';
import { ParamsGet } from '../models';
import { paymentsInstance } from '.';

const BASE_URL = 'TaxRatesINSS';

const api = {
	list(params: ParamsGet & TTaxRatesINSSFilters) {
		return paymentsInstance.get(BASE_URL, { params });
	},

	add(values: TTaxRatesINSS) {
		return paymentsInstance.post(BASE_URL, JSON.stringify(values));
	},

	edit(values: TTaxRatesINSS) {
		return paymentsInstance.put(BASE_URL, JSON.stringify(values));
	},
};

export default api;
