import { paymentsInstance } from '.';
import { TComarcaFilters } from '../models/litigation-jurisdictions';

const BASE_URL = 'LitigationJurisdictions'

const api = {
	list(params: TComarcaFilters) {
		return paymentsInstance.get(BASE_URL, { params });
	},
};

export default api;
