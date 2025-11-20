import { paymentsInstance } from '.';

const BASE_URL = 'ESocialReasonsForDismissal';

const eSocialReasonsForDismissalAPI = {
	list(params: any) {
		return paymentsInstance.get(`${BASE_URL}/grid-list`, { params });
	},

	listById(id: any) {
		const formattedId = Object.values(id).toString().replace(',', '')
		return paymentsInstance.get(`${BASE_URL}/get-by-id-with-includes?id=${formattedId}`);
	},

	add(values: any) {
		return paymentsInstance.post(`${BASE_URL}/create`, JSON.stringify(values));
	},

	edit(values: any) {
		return paymentsInstance.put(`${BASE_URL}/update`, JSON.stringify(values));
	},
}

export default eSocialReasonsForDismissalAPI;