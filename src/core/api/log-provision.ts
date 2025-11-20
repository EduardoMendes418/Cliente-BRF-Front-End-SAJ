import { paymentsInstance } from '.';
import { TLogProvisionBasicParameters, TLogProvisionParameters } from 'src/core/models/log-provision'

const BASE_URL = 'LogProvision'

const api = {
	list(params: TLogProvisionParameters) {
		return paymentsInstance.get(BASE_URL, { params });
	},
	listSumOfValues(params: TLogProvisionBasicParameters) {
		return paymentsInstance.get(`${BASE_URL}/SumOfValues`, { params });
	},
};

export default api;
