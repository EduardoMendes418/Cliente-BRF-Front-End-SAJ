import { paymentsInstance } from '.';

const api = {
	getStates() {
		return paymentsInstance.get(`/State`);
	},

	getCitiesByState(stateId: number) {
		return paymentsInstance.get(`/City?StateId=${stateId}`);
	},
};

export default api;
