import { paymentsInstance } from ".";
import { LockSystem } from "../models/lock-system";

const BASE_URL = "LockSystem";

const api = {
	getById(id: number) {
		return paymentsInstance.get(`${BASE_URL}/${id}`);
	},
	list() {
		return paymentsInstance.get(BASE_URL);
	},
	create(lockSystem: LockSystem) {
		return paymentsInstance.post(BASE_URL, lockSystem)
	},
	update(lockSystem: LockSystem) {
		return paymentsInstance.put(`${BASE_URL}/${lockSystem.id}`, lockSystem)
	},
	validate() {
		return paymentsInstance.get(`${BASE_URL}/validate`)
	}
};

export default api;
