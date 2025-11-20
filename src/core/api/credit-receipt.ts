import { TCreditReceipt, TCreditReceiptParams, TUpdateStatus } from '../models/credit-receipt';
import { upload } from './utils';
import { paymentsInstance } from '.';
import { rejectNoValues } from '../utils/func';
import { TGuaranteeAccountabilityReverse } from 'src/core/models/guarantee-accountability';

const BASE_URL = 'CreditReceipt';

const api = {
	list(params: TCreditReceiptParams) {
		return paymentsInstance.post(`${BASE_URL}/get-credit-receipts`, params);
	},
	addReversal (values: TGuaranteeAccountabilityReverse) {
		return paymentsInstance.post(`${BASE_URL}/generate-reversal-records`, {...values});
	},

	listReversal(params: {idLinkForAccounting?: string, id?: number}) {
		return paymentsInstance.get(`${BASE_URL}/get-for-reversal`, {params});
	},

	getById(id: number) {
		return paymentsInstance.get(BASE_URL, { params: { id } });
	},

	add(value: TCreditReceipt) {
		return paymentsInstance.post(BASE_URL, value)
	},

	edit(value: TCreditReceipt & { id: number }) {
		return paymentsInstance.put(BASE_URL, JSON.stringify(value))
	},

	uploadFiles(creditReceiptId: number, main: boolean, filesList: FileList | any) {
		const url = `${BASE_URL}/uploadFiles?creditReceiptId=${creditReceiptId}&isMainFile=${main}`;
		return upload(paymentsInstance, url, filesList);
	},

	deleteFile(id: number) {
		return paymentsInstance.delete(`${BASE_URL}/deleteFile?fileId=${id}`);
	},

	updateStatusFlow(value: TUpdateStatus) {
		const params = rejectNoValues(value);
		return paymentsInstance.patch(`${BASE_URL}/set-status`, undefined, { params });
	},
	getSap(creditReceiptId: number) {
		return paymentsInstance.get(`${BASE_URL}/get-sap-response`, { params: { creditReceiptId } });
	},

};

export default api;