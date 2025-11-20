import { paymentsInstance } from '.';
import { TIncomeTaxRatesFilters } from 'src/core/models/income-tax-rates';
import { ParamsGet } from '../models';

const BASE_URL = 'IncomeTaxRates'

const api = {
	list(params: ParamsGet & TIncomeTaxRatesFilters) {
		return paymentsInstance.get(BASE_URL, { params });
	},

	add(values: TIncomeTaxRatesFilters) {
		return paymentsInstance.post(BASE_URL, JSON.stringify(values));
	},

	edit(values: TIncomeTaxRatesFilters) {
		return paymentsInstance.put(BASE_URL, JSON.stringify(values));
	},
};

export default api;
