import { TFormulaCorrectionRule } from '../models/formula-correction-rule';
import { paymentsInstance } from '.';


const BASE_URL = 'FormulaCorrectionRule';

 type ParamsGet = {
	id?: number | string;
	page?: number;
	pageSize?: number;
	notPaginate?: boolean;
	isActive?: boolean;
};

const api = {
	listIsActiveDefault(params: ParamsGet) {
		return paymentsInstance.get(BASE_URL, { params:{...params, isActive: params.isActive ?? true } });
	},
	listAll(params: ParamsGet) {
		return paymentsInstance.get(BASE_URL, { params:{...params } });
	},

	add(values: TFormulaCorrectionRule) {
		return paymentsInstance.post(BASE_URL, JSON.stringify(values));
	},

	edit(value: TFormulaCorrectionRule) {
		return paymentsInstance.put(BASE_URL, JSON.stringify(value));
	},

	getById(id: number) {
		return paymentsInstance.get(BASE_URL, { params: { id } });
	},

	delete(id: number) {
		return paymentsInstance.delete(`${BASE_URL}/${id}`);
	}
};

export default api;
