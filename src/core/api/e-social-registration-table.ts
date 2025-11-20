import { paymentsInstance } from '.';

const BASE_URL = 'ESocialRegistrationTable';

const eSocialRegistrationTableAPI = {
	list(params: any,  page: number, pageSize: number, notPaginate: boolean) {
		return paymentsInstance.post(`${BASE_URL}/grid-list`, {...params, tableIdToRemove: [142] }, {params: {notPaginate: notPaginate, page, pageSize }});
	},
	listCBO (description: string, code: string, tableId: number) {
		return paymentsInstance.post(`${BASE_URL}/grid-list`, { tableId: tableId, description, code }, {params: {pageSize: 1000}});
	},

	listById(id: any) {
		const formattedId = Object.values(id).toString().replace(/,/g, '')
		return paymentsInstance.get(`${BASE_URL}/get-by-id-with-includes?id=${formattedId}`);
	},

	add(values: any) {
		return paymentsInstance.post(`${BASE_URL}/create`, JSON.stringify(values));
	},

	edit(values: any) {
		return paymentsInstance.put(`${BASE_URL}/update`, JSON.stringify(values));
	},

	getStates() {
		return paymentsInstance.get(`${BASE_URL}/states`);
	},

	getCitiesByState(startsWithCode: string) {
		return paymentsInstance.get(`${BASE_URL}/cities?startsWithCode=${startsWithCode}`);
	},
}

export default eSocialRegistrationTableAPI;