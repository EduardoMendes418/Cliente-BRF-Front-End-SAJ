import { paymentsInstance } from '.';
import { upload } from './utils';
import { STATUS_APPROVALS_FLOW } from '../utils/constants';
import { TPaymentInspectionRequestFilters, TPayment } from 'src/core/models/inspection';

const BASE_URL = 'PaymentInspection'

const api = {
	list(params: TPaymentInspectionRequestFilters) {
		return paymentsInstance.post(`${BASE_URL}/get-payment-inspection`, { ...params });
	},

	send(params: TPaymentInspectionRequestFilters) {
		return paymentsInstance.post(`${BASE_URL}`, { ...params });
	},
	
	uploadFiles(pagamentoId: number, filesList: FileList, isGuideFile: boolean) {
		const url = `${BASE_URL}/upload-files?paymentInspectionId=${pagamentoId}&isGuide=${isGuideFile}`;
		return upload(paymentsInstance, url, filesList);
	},

	add(value: TPayment) {
		const { dataPagamento } = value;
		return paymentsInstance.post(
			BASE_URL,
			{
				...value,
				dataPagamento: new Date(dataPagamento || ''),
			}
		);
	},

	edit(value: TPayment) {
		return paymentsInstance.put(
			BASE_URL,
			value
		);
	},

	updateStatus(id: number, statusFlowId: STATUS_APPROVALS_FLOW, observation = '') {
		return paymentsInstance.patch(`${BASE_URL}/set-status`, undefined, { params: { id, statusFlowId, observation } });
	},

	deleteFile(id: number) {
		return paymentsInstance.delete(`${BASE_URL}/deleteFile?fileId=${id}`);
	},

	getAccounting(paymentId: number) {
		return paymentsInstance.get(`PaymentInspectionAccounting/get-sap-response?type=s&paymentInspectionId=${paymentId}`);
	}
};

export default api;
