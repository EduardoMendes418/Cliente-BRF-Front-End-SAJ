import { contactInstance } from ".";
import { Contact, TGetByFilterParams } from "../models/contact";

const BASE_URL = "Contact";

const ContactAPI = {

	list(params: TGetByFilterParams) {
		return contactInstance.post(`${BASE_URL}/GetByFilter`, params);
	},
	getEnums() {
		return contactInstance.get(`${BASE_URL}/GetEnums?page=1&pageSize=100`);
	},
	exportExcel(params: TGetByFilterParams) {
		return contactInstance.post(`${BASE_URL}/get-export-excel`, params);
	},
	getContactById(id: number) {
		return contactInstance.get(`${BASE_URL}?id=${id}`);
	},
	createContact(params: Contact) {
		return contactInstance.post(`${BASE_URL}`, params);
	},
	editContact(params: Contact) {
		return contactInstance.put(`${BASE_URL}`, params);
	},
	deleteContact(id: number) {
		return contactInstance.delete(`${BASE_URL}/?id=${id}`);
	}
}

export default ContactAPI;