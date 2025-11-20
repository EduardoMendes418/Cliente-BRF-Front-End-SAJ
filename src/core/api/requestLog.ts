import { paymentsInstance } from '.';

const BASE_URL = 'requestLog';

const api = {
	list(params: any) {
		return paymentsInstance.get(`${BASE_URL}/`, { params });
	},

	listMenus(){
		return paymentsInstance.get(`${BASE_URL}/get-menus`);
	},

	listLogData(){
		return paymentsInstance.get(`${BASE_URL}/get-logdatafrom-report`)
	},

	getReport(filter: any){
		return paymentsInstance.post(`${BASE_URL}/get-report`,  filter, {
			params: {
				page: 1,
				pageSize: 30
			}
		})
	}

};

export default api;