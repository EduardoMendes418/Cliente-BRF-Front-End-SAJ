import { paymentsInstance } from '.';
import { ParamsGet } from '../models';

const BASE_URL = 'LitigationPhases'

const api = {
	list(params: ParamsGet) {
		return paymentsInstance.get(BASE_URL, { params });
	},
};

export default api;
