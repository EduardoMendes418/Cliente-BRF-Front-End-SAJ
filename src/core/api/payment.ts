import { paymentsInstance } from '.';
import { SupplierUpdateRequestData, TGeneratedGuide, TPayment, TPaymentGenerateReversalRecords, TPaymentRequestFilters } from 'src/core/models/payment';
import { upload, ifZeroToNull } from './utils';
import { STATUS_APPROVALS_FLOW } from '../utils/constants';
import { TUpdateBankAndJudicial } from '../models';

const BASE_URL = 'Pagamento'

const api = {
	list(params: TPaymentRequestFilters) {
		return paymentsInstance.get(BASE_URL, { params });
	},
	listGrid({page, pageSize, ...params}: TPaymentRequestFilters) {
		return paymentsInstance.post(`${BASE_URL}/grid-list`, { ...params }, {params:{page, pageSize}});
	},
	uploadFiles(pagamentoId: number, filesList: FileList, isBankUpdate: boolean = false, isEsocialFile: boolean = false, isGuideFile: boolean = false, isEsocialCalcFile: boolean = false) {
		const url = `${BASE_URL}/uploadFiles?pagamentoId=${pagamentoId}&isBankUpdate=${isBankUpdate}&isEsocialFile=${isEsocialFile}&isGuideFile=${isGuideFile}&isEsocialCalcFile=${isEsocialCalcFile}`;
		return upload(paymentsInstance, url, filesList);
	}
	,
	uploadFilesbase64(pagamentoId: number, files: any, isBankUpdate: boolean = false, isEsocialFile: boolean = false) {
		return paymentsInstance.post(
			`${BASE_URL}/upload-base64-file`,
			{
				files,
				pagamentoId,
				isBankUpdate,
				isEsocialFile
			}
		);
	},

	add(value: TPayment) {
		return paymentsInstance.post(
			BASE_URL,
			{ ...ifZeroToNull(["bancoId", "cidadeId", "estadoId"], value) }
		);
	},

	edit(value: TPayment) {
		return paymentsInstance.put(
			BASE_URL,
			ifZeroToNull(["bancoId", "cidadeId", "estadoId"], { ...value, process: null })
		);
	},

	updateStatus(id: number, statusFlowId: STATUS_APPROVALS_FLOW, observation = '', rejectionAndReturnReasonsId?: number) {
		return paymentsInstance.patch(`${BASE_URL}/set-status`, undefined, { params: { id, statusFlowId, observation, rejectionAndReturnReasonsId } });
	},

	deleteFile(id: number) {
		return paymentsInstance.delete(`${BASE_URL}/deleteFile?fileId=${id}`);
	},

	getAccounting(paymentId: number) {
		return paymentsInstance.get(`PaymentAccounting/get-sap-response?type=s&paymentId=${paymentId}`);
	},

	updateSupplier(values: SupplierUpdateRequestData) {
		return paymentsInstance.patch(`${BASE_URL}/update-supplier`, values)
	},

	updateBankAndJudicial(values: TUpdateBankAndJudicial) {
		return paymentsInstance.patch(`${BASE_URL}/update-bank-and-account`, {
			id: values.id,
			bankId: values.bankId === 0 ? null : values.bankId,
			judicialAccount: values.judicialAccount
		})
	},

	getRatValues(processId: number, paymentDate: string | Date) {
		return paymentsInstance.get(`${BASE_URL}/GetRatValues`, {
			params: {
				processId,
				paymentDate
			}
		})
	},

	getBanks(cpfCnpj: string) {
		return paymentsInstance.get(`${BASE_URL}/banks`, {
			params: {
				cpfCnpj
			}
		})
	},

	getPaymentToEsocialLink(folderNumber: string) {
		return paymentsInstance.get(`${BASE_URL}/get-payments-to-esocial-link`, {
			params: {
				folderNumber
			}
		})
	},

	doSefip(id: number) {
		return paymentsInstance.get(`Sefip/${id}`)
	},

	doGps({ status, numeroSolicitacao, aprovador }: { status: number, numeroSolicitacao: number, aprovador: number, }) {
		return paymentsInstance.post(`FluxoAprovacao/generate-gps`, {
			status,
			numeroSolicitacao,
			aprovador,
			observacao: "",
			rejectionAndReturnReasonsId: 0,
			tipoSolicitacao: "PAGAMENTO"
		})
	},

	sendGenerateReversalRecords(values: TPaymentGenerateReversalRecords) {
		return paymentsInstance.post(`${BASE_URL}/generate-reversal-records`, {...values});
	},

	generatedGuide(values: TGeneratedGuide){
		return paymentsInstance.put(`${BASE_URL}/set-generated-guide`, values)
	},

	costCenterReclassification(paymentId: number) {
		return paymentsInstance.get(`${BASE_URL}/cost-center-reclassification`, {
			params: {
				paymentId
			}
		})
	}
};

export default api;
