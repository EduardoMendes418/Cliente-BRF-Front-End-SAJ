import { paymentsInstance } from '.';
import { ParamsGet } from "src/core/models"
import {
	TBusinessCombinationParameters,
} from 'src/core/models/provision'

const BASE_URL = 'BusinessCombinationAccounting';

const api = {
	list(params: ParamsGet) {
		return paymentsInstance.get(`${BASE_URL}/get-all-executions`, { params });
	},
	account(params: TBusinessCombinationParameters) {
		return paymentsInstance.get(`${BASE_URL}/account`, { params });
	},
};

export default api;
