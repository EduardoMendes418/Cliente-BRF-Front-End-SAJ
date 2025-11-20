import { paymentsInstance } from '.';
import * as T from 'src/core/store/modules/e-social-areas/types';

const BASE_URL = 'ESocialAreas';

const eSocialAreasAPI = {
	list(params: T.TESocialAreasFilter) {
		return paymentsInstance.get(`${BASE_URL}/grid-list`, { params });
	},

	listById(id: string) {
		const formattedId = Object.values(id).toString().replace(',', '')
		return paymentsInstance.get(`${BASE_URL}/get-by-id-with-includes?id=${formattedId}`);
	},

	add(values: T.TESocialPayload) {
		return paymentsInstance.post(`${BASE_URL}/create`, JSON.stringify(values));
	},

	edit(values: T.TESocialPayload) {
		return paymentsInstance.put(`${BASE_URL}/update`, JSON.stringify(values));
	},

	delete(id: number) {
		return paymentsInstance.delete(`${BASE_URL}/delete?id=${id}`);
	},
}

export default eSocialAreasAPI;