import { paymentsInstance } from '.';
import { TGuaranteeModality } from 'src/core/models/guarantee-modality';
import { ParamsGet } from '../models';

const BASE_URL = 'GoodsGuaranteesModality'

const guaranteeModalityAPI = {
	list(params: ParamsGet) {
		return paymentsInstance.get(BASE_URL, { params });
	},

	add(values: TGuaranteeModality) {
		return paymentsInstance.post(BASE_URL, JSON.stringify({ ...values, status: true }));
	},

	edit(values: TGuaranteeModality) {
		return paymentsInstance.put(BASE_URL, JSON.stringify(values));
	},

};

export default guaranteeModalityAPI;
