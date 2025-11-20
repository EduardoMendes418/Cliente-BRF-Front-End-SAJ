import { paymentsInstance } from '.';

const BASE_URL = 'ReportOptions'

const reportOptionsAPI = {
	getOriginCostCenters() {
		return paymentsInstance.get(`${BASE_URL}/GetOriginCostCenters`);
	},

	getBusinessAreas() {
		return paymentsInstance.get(`${BASE_URL}/GetBusinessAreas`);
	},

	getProvisionClasses() {
		return paymentsInstance.get(`${BASE_URL}/GetProvisionClasses`);
	},

	getGrouperCostCenters() {
		return paymentsInstance.get(`${BASE_URL}/GetGrouperCostCenters`);
	}
};

export default reportOptionsAPI;
