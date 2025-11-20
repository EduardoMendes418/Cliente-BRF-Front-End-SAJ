import { paymentsInstance } from '.';
import { TClosures } from 'src/core/models/closures'
import { ParamsGet } from "src/core/models"

const BASE_URL = 'Fechamentos';

const api = {
	list(params: ParamsGet & {status?: number}) {
		return paymentsInstance.get(BASE_URL, { params });
	},
	add(values: TClosures) {
		return paymentsInstance.post(BASE_URL, JSON.stringify(values));
	},
	edit(values: TClosures) {
		return paymentsInstance.put(BASE_URL, JSON.stringify(values));
	},
};

export default api;
