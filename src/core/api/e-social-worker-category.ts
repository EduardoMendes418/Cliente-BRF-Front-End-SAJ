import { paymentsInstance } from '.';
import { TESocialWorkerCategoryGridList } from '../models/e-social-worker-category';

const BASE_URL = 'ESocialWorkerCategory';

const eSocialWorkerCategoryAPI = {
	list(params: TESocialWorkerCategoryGridList) {
		return paymentsInstance.get(`${BASE_URL}/grid-list`, { params });
	},

	listById(id: string) {
		const formattedId = Object.values(id).toString().replace(',', '')
		return paymentsInstance.get(`${BASE_URL}/get-by-id-with-includes?id=${formattedId}`);
	},

	add(values: TESocialWorkerCategoryGridList) {
		return paymentsInstance.post(`${BASE_URL}/create`, JSON.stringify(values));
	},

	edit(values: TESocialWorkerCategoryGridList) {
		return paymentsInstance.put(`${BASE_URL}/update`, JSON.stringify(values));
	},
}

export default eSocialWorkerCategoryAPI;