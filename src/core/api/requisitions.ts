import { paymentsInstance } from '.';
import { TRequisitionForm, TRequisitionService, TRequisitionsFilters, TUpdateStatus } from '../models/requisitions';
import { upload } from './utils';

export type TSeekRequest = {
	page?: number;
	pageSize?: number;
	id?: number | '';
	folderNumber?: string;
	requestDate?: string;
	status?: number;
};

const BASE_URL = 'Request'

const requisitionsAPI = {
	list(params: TRequisitionsFilters) {
		return paymentsInstance.get(BASE_URL, { params });
	},

	addBatch(values: TRequisitionForm) {
		return paymentsInstance.post(BASE_URL+'/batch', JSON.stringify(values));
	},

	add(values: TRequisitionForm) {
		return paymentsInstance.post(BASE_URL, JSON.stringify(values));
	},

	edit(values: TRequisitionForm | TRequisitionService) {
		return paymentsInstance.put(BASE_URL, JSON.stringify(values));
	},

	getById(id: number) {
		return paymentsInstance.get(BASE_URL, { params: { id } });
	},

	getDeadlineDate({ dateTime, requestParameterId }: { dateTime: string, requestParameterId: number; }) {
		return paymentsInstance.get(`${BASE_URL}/GetDeadlineDate`, { params: { dateTime, requestParameterId } });
	},

	uploadFiles(requesitionId: number, filesList: FileList, type: any) {
		const url = `${BASE_URL}/uploadFiles?requestId=${requesitionId}&type=${type}`;
		return upload(paymentsInstance, url, filesList);
	},

	updateStatus(params: TUpdateStatus) {
		return paymentsInstance.patch(`${BASE_URL}/set-status`, undefined, { params });
	},

	sendEmail(requestId: number) {
		return paymentsInstance.post(`${BASE_URL}/sendEmail?requestId=${requestId}`)
	},
	
	deleteFile(fileId: number) {
		return paymentsInstance.delete(`${BASE_URL}/deleteFile?fileId=${fileId}`);
	},

	getResponsibleEmails({ processId, requestParameterId }: { processId: number, requestParameterId: number; }) {
		return paymentsInstance.get(`${BASE_URL}/Get-Responsible-Emails`, { params: { processId, requestParameterId } });
	},
};

export default requisitionsAPI;
