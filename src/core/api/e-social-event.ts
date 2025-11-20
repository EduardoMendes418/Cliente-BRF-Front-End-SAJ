import { paymentsInstance } from '.';
import { TSearchEvent, TEventGridList } from '../models/e-social-tables';

const BASE_URL = 'ESocialEvent';

const eSocialEventAPI = {
	list(params: TSearchEvent) {
		return paymentsInstance.get(`${BASE_URL}/grid-list`, { params });
	},

	listById(id: TSearchEvent) {
		const formattedId = Object.values(id).toString().replace(',', '')
		return paymentsInstance.get(`${BASE_URL}/get-by-id-with-includes?id=${formattedId}`);
	},

	add(values: TEventGridList) {
		return paymentsInstance.post(`${BASE_URL}/create`, JSON.stringify(values));
	},

	edit(values: TEventGridList) {
		return paymentsInstance.put(`${BASE_URL}/update`, JSON.stringify(values));
	},
}

export default eSocialEventAPI;