import { TPeriodDateFilter, TRequestPension } from 'src/core/models/pensions';
import { paymentsInstance } from '.';
import { TUpdateStatus } from '../models';
import { upload } from './utils';
import { TPaymentRequestFilters } from 'src/core/models/payment';


export type TSeekRequest = {
	page?: number;
	pageSize?: number;
	id?: number | '';
	areaId?: number | '';
	folderNumber?: string;
	requestDate?: string;
	statusApprovalId?:	number | ''; 
	statusFlowIds?:	number[] | ''; 
	statusApprovalIds?:	number[] | ''; 
};

const BASE_URL = 'PensionRequest'

const pensionRequestAPI = {
	listRequest(params: TSeekRequest) {
		return paymentsInstance.get(BASE_URL, { params });
	},

	uploadFiles(pensionId: number, filesList: FileList) {
		const url = `${BASE_URL}/uploadFiles?pensionRequestId=${pensionId}`;
		return upload(paymentsInstance, url, filesList);
	},

	addRequest(value: TRequestPension) {
		return paymentsInstance.post(BASE_URL, JSON.stringify(value));
	},

	deleteFile(id: number) {
		return paymentsInstance.delete(`${BASE_URL}/deleteFile?pensionRequestId=${id}`);
	},

	getCategories() {
		return paymentsInstance.get('/PensionCategory');
	},

	getClosureReason() {
		return paymentsInstance.get('/PensionClosureReason');
	},

	getActiveMonths(params: TPeriodDateFilter) {
		return paymentsInstance.get(`${BASE_URL}/get-active-month-pensions`, { params })
	},

	generateSinglePayment(id: number) {
		return paymentsInstance.post(`${BASE_URL}/${id}/generate-payment`)
	},

	generatePayments(dates: TPeriodDateFilter) {
		return paymentsInstance.post(`${BASE_URL}/generate-payments`, dates)
	},

	getPaymentByPensionId(params: TPaymentRequestFilters) {
		return paymentsInstance.get(`${BASE_URL}/${params?.id}/pagamentos`, { params })
	},
	setStatus(data: TUpdateStatus) {
		return paymentsInstance.patch(`${BASE_URL}/set-status`, {},{params: data})
	},

	editRequest(data: TRequestPension) {
		return paymentsInstance.put(`${BASE_URL}/${data.id}`, data)
	}
};

export default pensionRequestAPI;
