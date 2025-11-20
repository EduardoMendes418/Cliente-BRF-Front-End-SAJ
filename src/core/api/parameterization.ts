import axios from 'axios';
import { ordersInstance } from ".";

type Params = {
	nome: string;
	valor: string;
};

const BASE_URL = 'Parameter'

const parameterizationAPI = {
	getParams() {
		return ordersInstance.get(BASE_URL);
	},

	getParam(names: string[]) {
		const requests = names.map((name) => ordersInstance.get(`${BASE_URL}/${name}`));
		return axios.all(requests);
	},

	putParam(param: Params) {
		return ordersInstance.put(BASE_URL, JSON.stringify(param));
	},

	postParam(params: Params) {
		return ordersInstance.post(BASE_URL, JSON.stringify(params));
	},
};

export default parameterizationAPI;
