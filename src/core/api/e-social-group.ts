import { paymentsInstance } from '.';
import { TSearchTable, TTableGridList } from '../models/e-social-tables';

const BASE_URL = 'ESocialGroup';

const eSocialGroupAPI = {
	list(params: TSearchTable) {
		return paymentsInstance.get(`${BASE_URL}/grid-list`, { params });
	},

	listById(id: TSearchTable) {
		const formattedId = Object.values(id).toString().replace(',', '')
		return paymentsInstance.get(`${BASE_URL}/get-by-id-with-includes?id=${formattedId}`);
	},

	add(values: TTableGridList) {
		return paymentsInstance.post(`${BASE_URL}/create`, JSON.stringify(values));
	},

	edit(values: TTableGridList) {
		return paymentsInstance.put(`${BASE_URL}/update`, JSON.stringify(values));
	},
}

export default eSocialGroupAPI;