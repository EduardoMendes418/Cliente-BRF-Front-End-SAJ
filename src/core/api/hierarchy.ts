import { paymentsInstance } from '.';
import { THierarchy, THierarchyFilter } from '../models/hierarchy';

export type Params = {
	page?: number;
	pageSize?: number;
	juridicalArea?: string;
	notPaginate?: boolean;
	hierarchy?: string;
};

const BASE_URL = 'Hierarquia'

const hierarchyAPI = {

	getHierarchy(params: THierarchyFilter) {
		return paymentsInstance.get(BASE_URL, { params });
	},

	getHierarchyById(id: string) {
		return paymentsInstance.get(`${BASE_URL}/${id}`);
	},

	getSapHierarchy(id: string) {
		return paymentsInstance.get(`/HierarquiaSap?users=${id}`);
	},

	postHierarchy(value: THierarchy) {
		return paymentsInstance.post(BASE_URL, JSON.stringify(value));
	},

	editHierarchy(value: THierarchy) {
		return paymentsInstance.put(BASE_URL, JSON.stringify(value));
	},

	deleteHierarchy(id: string) {
		return paymentsInstance.delete(`${BASE_URL}/${id}`);
	},
	getHierarchyList() {
		return paymentsInstance.get(`${BASE_URL}/get-distinct`)
	}
};

export default hierarchyAPI;
