import { paymentsInstance } from '.';
import { TGuaranteeMethod } from 'src/core/models/guarantee-method';
import { ParamsGet } from '../models';

const BASE_URL = 'GoodsGuaranteesMethod'

const guaranteeMethodAPI = {
	list({ id, page, pageSize }: ParamsGet) {
		return paymentsInstance.get(BASE_URL, {
			params: { page, pageSize, id },
		});
	},

	add(values: TGuaranteeMethod) {
		return paymentsInstance.post(BASE_URL, JSON.stringify({ status: true, ...values }));
	},

	edit(values: TGuaranteeMethod) {
		return paymentsInstance.put(BASE_URL, JSON.stringify(values));
	},

};

export default guaranteeMethodAPI;
