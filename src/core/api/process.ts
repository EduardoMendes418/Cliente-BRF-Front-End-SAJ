import axios from 'axios';
import { TOrder, TStatisticalOrder } from 'src/core/models/process';
import { TProvisionProcess } from 'src/core/models/provision-order';
import { paymentsInstance, ordersInstance } from '.';
import { upload } from './utils';

export type TParamsProcessFolders = {
	page?: number;
	pageSize?: number;
	id?: number | '';
	folderNumber?: string;
};

export type TParamProcessStatisticalOrderCalculate = {
	page?: number;
	pageSize?: number;
	id?: number | '';
	folderNumber?: string | '';
	RequesterDate?: string | '';
	LocationId?: number | null;
	ContraryPartyId?: number | null;
};

const BASE_URL = 'Process'

const processAPI = {
	getFolder(folder: string) {
		return ordersInstance.get(`${BASE_URL}/${folder}`);
	},
	getFolderSheetComponentFolderNumber(folderNumber: string) {
		return paymentsInstance.get(`${BASE_URL}/get-process-sheet-data-component-by-folder-number`, { params: { folderNumber } });
	},
	getProvisionsProcessByFolderNumber(folderNumber: string) {
		return paymentsInstance.get(`${BASE_URL}/get-process-by-folder-number`, { params: { folderNumber } });
	},

	getProvisionsProcessJudicialDepositStatus(folderNumber: string) {
		return paymentsInstance.get<boolean>(`${BASE_URL}/check-if-process-has-judicial-deposit-pending-approval`, { params: { folderNumber } });
	},

	getProvisionsProcessPaymentPendingStatus(folderNumber: string) {
		return paymentsInstance.get<boolean>(`${BASE_URL}/check-if-process-has-payment-pending-approval`, { params: { folderNumber } });
	},

	getProcessHasBlockAndTransferPending(folderNumber: string) {
		return paymentsInstance.get<boolean>(`${BASE_URL}/check-if-process-has-block-and-transfer-pending`, { params: { folderNumber } });
	},
	
	getProcessFolders(params: TParamsProcessFolders) {
		return ordersInstance.get(BASE_URL, { params });
	},

	getProcessStatisticalOrderCalculate(params: TParamProcessStatisticalOrderCalculate) {
		return ordersInstance.get(`${BASE_URL}/get-process-statistical-order-calculate`, { params });
	},

	getStatisticalOrderCalculate(params: { folderNumber: string }) {
		return ordersInstance.get(`${BASE_URL}/get-statistical-order-calculate`, { params });
	},

	updateProcess(folderNumber: string, orders: TOrder[]) {
		return ordersInstance.put(BASE_URL, JSON.stringify({ orders, folderNumber }));
	},

	saveObjects(objectInformation: TOrder[]) {
		return ordersInstance.post(`/ObjectInformation`, JSON.stringify(objectInformation));
	},

	updateObjects(objectInformation: TOrder[]) {
		return ordersInstance.put(`/ObjectInformation`, JSON.stringify(objectInformation));
	},

	updateProvisionsProcess(process: TProvisionProcess) {
		return paymentsInstance.put(BASE_URL, process);
	},

	uploadFiles(folderNumber: string, filesList: FileList) {
		const url = `${BASE_URL}/uploadFiles?folderNumber=${folderNumber}`;
		return upload(ordersInstance, url, filesList);
	},

	updateFolder({ folderNumber, orders, attachedDocuments }: TStatisticalOrder) {
		const calls = []

		if (orders?.length) calls.push(this.updateProcess(folderNumber, orders))
		if (attachedDocuments.length) calls.push(this.uploadFiles(folderNumber, attachedDocuments as any))

		return axios.all(calls);
	},

	saveObjectsInformation(objectInformation: TOrder[]) {
		return axios.all([this.saveObjects(objectInformation)]);
	},

	updateObjectsInformation(objectInformation: TOrder[]) {
		return axios.all([this.updateObjects(objectInformation)]);
	},

	deleteFile(id: number) {
		return ordersInstance.delete(`${BASE_URL}/deleteFile?fileId=${id}`);
	},

	getIndividual(individualID: number) {
		return paymentsInstance.get(`Individuals?id=${individualID}&page=1`);
	},

	getContingencies() {
		return paymentsInstance.get(`${BASE_URL}/get-contingencies`);
	},

	getSpheres() {
		return paymentsInstance.get(`${BASE_URL}/get-sphere`);
	},

	getStatuses() {
		return paymentsInstance.get(`${BASE_URL}/get-statuses`);
	},

	getResults() {
		return paymentsInstance.get(`${BASE_URL}/get-results`);
	},

	getClosing() {
		return paymentsInstance.get(`${BASE_URL}/get-closing`);
	},

	getSpeciesCategory() {
		return paymentsInstance.get(`${BASE_URL}/get-speciesCategory`);
	},

	getProcessByIdentifierNumber(identifierNumber: string) {
		return paymentsInstance.get(`${BASE_URL}/get-process-by-identifier-number`, {
			params: {
				identifierNumber
			}
		})
	}
};

export default processAPI;
