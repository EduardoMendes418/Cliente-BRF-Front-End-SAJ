import { TCorrectionRule, TCorrectionRuleParams } from '../models/correction-rule';
import { paymentsInstance } from '.';

const BASE_URL = 'CorrectionRule';

const api = {
	list(params: TCorrectionRuleParams) {
		return paymentsInstance.get(BASE_URL, { params });
	},

	add(values: TCorrectionRule[]) {
		return paymentsInstance.post(BASE_URL, JSON.stringify(values));
	},

	edit(values: TCorrectionRule) {
		return paymentsInstance.put(BASE_URL, JSON.stringify(values));
	},

	delete(id: number) {
		return paymentsInstance.delete(`${BASE_URL}/${id}`);
	}
};

export default api;
