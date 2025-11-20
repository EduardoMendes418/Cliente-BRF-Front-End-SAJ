import { TAddPaymentTypeMethod } from 'src/core/models/payment-type-method';
import { paymentsInstance } from '.';

type Params = {
	tipoPagamentoID?: number;
	page?: number;
	pageSize?: number;
	status?: boolean;
};

const BASE_URL = 'TiposFormasPagamento'

const paymentTypeMethodAPI = {
	list({ tipoPagamentoID, page, pageSize, status }: Params) {
		return paymentsInstance.get(`${BASE_URL}/${tipoPagamentoID ?? ''}`, {
			params: { page, pageSize, status },
		});
	},

	add(value: TAddPaymentTypeMethod) {
		return paymentsInstance.post(BASE_URL, JSON.stringify(value));
	},
};

export default paymentTypeMethodAPI;
