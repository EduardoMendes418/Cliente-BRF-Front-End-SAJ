import { paymentsInstance } from ".";
import { getIdToken } from "../utils/func";

const BASE_URL = 'CircularizationConfiguration'

const circularizationConfigurationAPI = {
	list(params?: any) {
		return paymentsInstance.get(BASE_URL, {params})
	},
	add(
		params: any,
	) {
		const options = {
			method: "POST",
			headers: {
				accept: "*/*",
				Authorization: `Bearer ${getIdToken()}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify(params),
		};
		return fetch(
			`${import.meta.env.REACT_APP_BASE_URL_PAYMENTS}${BASE_URL}`,
			options
		).then((response) => response.blob());
	},
	edit(
		params: any,
	) {
		const options = {
			method: "PUT",
			headers: {
				accept: "*/*",
				Authorization: `Bearer ${getIdToken()}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify(params),
		};
		return fetch(
			`${import.meta.env.REACT_APP_BASE_URL_PAYMENTS}${BASE_URL}`,
			options
		).then((response) => response.blob());
	}
}

export default circularizationConfigurationAPI;