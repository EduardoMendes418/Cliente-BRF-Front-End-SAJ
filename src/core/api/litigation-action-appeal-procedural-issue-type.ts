import { paymentsInstance } from '.';

const BASE_URL = 'LitigationActionAppealProceduralIssueType'

const api = {
	list() {
		return paymentsInstance.get(BASE_URL);
	},
};

export default api;
