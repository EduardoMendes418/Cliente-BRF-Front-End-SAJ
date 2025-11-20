import { paymentsInstance } from '.';
import { TRejectionAndReturnReason, TRejectionAndReturnReasonParams } from '../models/rejection-and-return-reason';

const BASE_URL = 'RejectionAndReturnReason';

const api = {
	list(params: TRejectionAndReturnReasonParams) {
		return paymentsInstance.get(BASE_URL, { params });
	},

	add(values: TRejectionAndReturnReason) {
		return paymentsInstance.post(BASE_URL, JSON.stringify(values));
	},

	getById(id: number) {
		return paymentsInstance.get(BASE_URL, { params: { id } });
	},

	edit(values: TRejectionAndReturnReason & { id: number }) {
		return paymentsInstance.put(BASE_URL, JSON.stringify(values));
	}
};

export default api;
