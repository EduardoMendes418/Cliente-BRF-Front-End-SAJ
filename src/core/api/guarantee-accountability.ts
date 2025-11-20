import { TGuaranteeAccountability, TUpdateStatus, TGuaranteeAccountabilityFilters, TGuaranteeAccountabilityReverse } from 'src/core/models/guarantee-accountability';
import { upload } from './utils';
import { ParamsGet } from '../models';
import { rejectNoValues } from '../utils/func';
import { paymentsInstance } from '.';

const BASE_URL = 'Accountability'

const guaranteeModalityAPI = {
	list(params: ParamsGet & TGuaranteeAccountabilityFilters) {
		return paymentsInstance.get(BASE_URL, { params });
	},
	listGrid(params: ParamsGet & TGuaranteeAccountabilityFilters) {
		return paymentsInstance.get(`${BASE_URL}/grid-request`, { params });
	},
	listReversal(params: {idLinkForAccounting?: string, id?: number}) {
		return paymentsInstance.get(`${BASE_URL}/get-for-reversal`, { params: {...params, notPaginate: true} });
	},
	addReversal (values: TGuaranteeAccountabilityReverse) {
		return paymentsInstance.post(`${BASE_URL}/generate-reversal-records`, {...values});
	},

	add(values: TGuaranteeAccountability) {
		return paymentsInstance.post(BASE_URL, JSON.stringify(values));
	},

	addMultiples(values: any) {
		return paymentsInstance.post(`${BASE_URL}/evaluate-various-accounts`, JSON.stringify(values));
	},
	addCreditMultiples(values: any) {
		return paymentsInstance.post(`CreditReceipt/evaluate-various-accounts`, JSON.stringify(values));
	},

	edit(values: TGuaranteeAccountability) {
		return paymentsInstance.put(BASE_URL, JSON.stringify(values));
	},

	getAccontabilityByFolder ({folderNumber, statusFlowId}: {folderNumber:string, statusFlowId?:number}) {
		return paymentsInstance.get(`${BASE_URL}/get-by-folder-number-and-status-flow-id`, { params: {folderNumber, statusFlowId} });
	},

	uploadFiles(accountabilityId: number, filesList: FileList | any) {
		const url = `${BASE_URL}/uploadFiles?accountabilityId=${accountabilityId}`;
		return upload(paymentsInstance, url, filesList);
	},

	deleteFile(id: number) {
		return paymentsInstance.delete(`${BASE_URL}/deleteFile?fileId=${id}`);
	},

	updateStatus({ attachments, ...rest }: TUpdateStatus) {
		const params = rejectNoValues(rest);
		return paymentsInstance.patch(`${BASE_URL}/set-status`, undefined, { params });
	},

	listDeposit(params: ParamsGet & { folderNumber: string }) {
		return paymentsInstance.get(`${BASE_URL}/get-for-deposit`, { params });
	},
	getAccounting(accountabilityId: number) {
		return paymentsInstance.get(`${BASE_URL}/get-sap-response?type=s&accountabilityId=${accountabilityId}`);
	},
	getFiles(accountabilityId: number) {
		return paymentsInstance.get(`${BASE_URL}/get-files?accountabilityId=${accountabilityId}`, {responseType: "arraybuffer"});
	}
};

export default guaranteeModalityAPI;
