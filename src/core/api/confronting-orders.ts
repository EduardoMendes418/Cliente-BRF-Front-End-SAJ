import { paymentsInstance } from ".";
import { TConfrontingOrdersFilters } from "../models/confronting-orders";
import { ParamsGet } from "../models";

const BASE_URL = "ConfrontingOrders";

const api = {
	list(params: TConfrontingOrdersFilters & ParamsGet) {
		return paymentsInstance.get(BASE_URL, { params });
	},
	listLogs(
		params: { folderNumber: string } & Omit<ParamsGet, "id" | "notPaginate">
	) {
		return paymentsInstance.get(`${BASE_URL}/get-logs`, { params });
	},
	setStatus(ids: string[] | number[], params: unknown) {
		return paymentsInstance.put(`${BASE_URL}/set-status`, ids, { params });
	},
	getPendings(folderNumber: string) {
		return paymentsInstance.get(
			`${BASE_URL}/get-pending?folderNumber=${folderNumber}`
		);
	},
	getConfrontersBase() {
		return paymentsInstance.get(BASE_URL);
	},
	getReport(params: Partial<TConfrontingOrdersFilters>) {
		return paymentsInstance.get(`${BASE_URL}/get-excel-report`, { params, responseType: "arraybuffer" });
	},
};

export default api;
