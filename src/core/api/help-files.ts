import { paymentsInstance } from '.'

const BASE_URL = 'HelpFiles'

const api = {
	list(params?: any) {
		return paymentsInstance.get(BASE_URL, {params})
	},
	add(values: any) {
		return paymentsInstance.post(BASE_URL, JSON.stringify(values));
	},
	edit(params: any) {
		return paymentsInstance.put(BASE_URL, { ...params })
	},
	getById(id: any){
		return paymentsInstance.get(`${BASE_URL}/${id}`)
	},
	delete(id: number) {
		return paymentsInstance.delete(`${BASE_URL}/${id}`);
	}
};
	
export default api;
