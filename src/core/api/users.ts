import { paymentsInstance } from '.';
import { TUserRequest, TUserFilters, TGetUsersParams } from 'src/core/models/users';
import { ParamsGet } from '../models';

const BASE_URL = 'Users'

const api = {
	list(params: ParamsGet & TUserFilters) {
		return paymentsInstance.get(BASE_URL, { params });
	},

	listGrid(params: ParamsGet & TUserFilters) {
		return paymentsInstance.get(`${BASE_URL}/grid-list`, { params });
	},
	getActives() {
		return paymentsInstance.get(`${BASE_URL}/GetByUsersActive`);
	},
	
	getAll() {
		return paymentsInstance.get(`${BASE_URL}/GetAll`);
	},

	getWithName(params: TGetUsersParams) {
		return paymentsInstance.get(`${BASE_URL}/get-with-name-like-and-cpf-like-without-includes`, {params});
	},

	add(values: TUserRequest) {
		return paymentsInstance.post(BASE_URL, values);
	},

	edit(values: TUserRequest & { id: number }) {
		return paymentsInstance.put(BASE_URL, values);
	},
	generateExcel(params: TUserFilters) {
		return paymentsInstance.get(`${BASE_URL}/export-excel`, { params, responseType: 'arraybuffer' });
	}
};

export default api;
