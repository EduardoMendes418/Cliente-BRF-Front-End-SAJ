import { paymentsInstance } from '.';
import { TESocialNewEmployerGridList } from '../models/e-social-new-employer';

const BASE_URL = 'ESocialClosureEmployer';

const eSocialClosureEmployerAPI = {
	list(params: TESocialNewEmployerGridList) {
		return paymentsInstance.get(`${BASE_URL}`, { params });
	},

	listById(id: number) {
		return paymentsInstance.get(`${BASE_URL}/${id}`);
	},

	add(values: TESocialNewEmployerGridList) {
		return paymentsInstance.post(`${BASE_URL}`, JSON.stringify(values));
	},

	edit(values: TESocialNewEmployerGridList) {
		return paymentsInstance.put(`${BASE_URL}`, JSON.stringify(values));
	},

	delete(id: number) {
		return paymentsInstance.delete(`${BASE_URL}/?id=${id}`);
	}
}

export default eSocialClosureEmployerAPI;