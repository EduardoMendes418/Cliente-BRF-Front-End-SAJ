import { paymentsInstance, paymentsInstanceDev, paymentsInstancePrd, paymentsInstanceQas } from ".";
import {
	TGoodsGuaranteesReportParams,
	TJudicialBlocksAndTransfersReportParams,
	TPaymentReportParams,
	TPensionReportParams,
	TStatisticalOrderReportParams,
	TNoticeInspectionPaymentReportParams,
	TCreditReceiptReportParams,
	TLegalDocReportParams,
	TReportDictionaryFilter,
	TReportDictionary,
	TSendReportByEmail,
} from "../models/reports";
import { TDIRF } from "src/core/models/payment";
import { TOfficeManagementPaymentReport } from "../models/office-management-payment";
import { getIdToken } from "../utils/func";
import { ParamsGet } from "src/core/models";
import {
	ProvisionRequestReportFilter
} from 'src/core/models/provision'
import {
	TDataImportMultipleFilesForm,
} from "src/core/models/data-import";

const BASE_URL = "Report";

const reportAPI = {

	list(params: ParamsGet) {
		return paymentsInstance.get(
			`${BASE_URL}/grid-list`,
			{ params }
		);
	},
	exportPaymentExcelFile(params: TPaymentReportParams, filterId: number) {
		return paymentsInstance.post(
			`${BASE_URL}/ExportPaymentExcelFile`,
			JSON.stringify(params),
			{ params: { filterId } }
		);
	},

	exportPensionExcelFile(params: TPensionReportParams, filterId: number) {
		return paymentsInstance.post(
			`${BASE_URL}/ExportPensionExcelFile`,
			JSON.stringify(params),
			{ params: { filterId } }
		);
	},

	exportJudicialBlocksAndTransfersExcelFile(
		params: TJudicialBlocksAndTransfersReportParams, filterId: number
	) {
		return paymentsInstance.post(
			`${BASE_URL}/ExportJudicialBlocksAndTransfersExcelFile`,
			JSON.stringify(params),
			{ params: { filterId } }
		);
	},

	exportGoodsAndGuaranteesExcelFile(params: TGoodsGuaranteesReportParams, filterId: number) {
		return paymentsInstance.post(
			`${BASE_URL}/ExportGoodsGuaranteesExcelFile`,
			JSON.stringify(params),
			{ params: { filterId } }
		);
	},

	exportAccountabilityExcelFile(params: TGoodsGuaranteesReportParams, filterId: number) {
		return paymentsInstance.post(
			`${BASE_URL}/ExportGoodsGuaranteesAccountabilityExcelFile`,
			JSON.stringify(params),
			{ params: { filterId } }
		);
	},

	exportStatisticRequestExcelFile(params: TStatisticalOrderReportParams, filterId: number) {
		return paymentsInstance.post(
			`${BASE_URL}/ExportStatisticRequestExcelFile`,
			JSON.stringify(params),
			{ params: { filterId } }
		);
	},

	exportRequestReportExcelFile(params: TDataImportMultipleFilesForm) {
		return paymentsInstance.post(
			`${BASE_URL}/ExportRequestReportExcelFile`,
			params,
			{ params: { filterId: null } }
		);
	},

	exportRequestCircularizationExcelFile(params: any) {
		return paymentsInstance.post(
			`${BASE_URL}/ExportCircularizationExcelFile`,
			params,
			{ params: { filterId: null } }
		);
	},

	exportRequestESocialionExcelFile(params: any) {
		return paymentsInstance.post(
			`${BASE_URL}/ExportESocialExcelFile`,
			params,
			{ params: { filterId: null } }
		);
	},

	generateProvisionReportRequest(params: Partial<ProvisionRequestReportFilter>, filterId: number | null) {
		return paymentsInstance.post(
			`${BASE_URL}/provision-request-report`,
			JSON.stringify(params),
			{ params: { filterId } }
		);
	},

	exportNoticeInspectionPaymentExcelFile(
		params: TNoticeInspectionPaymentReportParams, filterId: number
	) {
		return paymentsInstance.post(
			`${BASE_URL}/NoticeInspectionPaymentExcelFile`,
			JSON.stringify(params),
			{ params: { filterId } }
		);
	},

	exportEqualizationExcelFile(id: number, filterId: number|null) {
		return paymentsInstance.post(`${BASE_URL}/ExportEqualizationExcelFile`, {equalizationId:id});
	},

	exportExportDirfDecFile(values: TDIRF) {
		return paymentsInstance.post(`${BASE_URL}/ExportDirfDecFile`, values);
	},

	exportOfficeManagementPaymentFile(values: TOfficeManagementPaymentReport) {
		const options = {
			method: "POST",
			headers: {
				accept: "*/*",
				Authorization: `Bearer ${getIdToken()}`,
				"Content-Type": "application/json-patch+json",
			},
			body: JSON.stringify(values),
		};
		return fetch(
			`${import.meta.env.REACT_APP_BASE_URL_PAYMENTS}${BASE_URL}/ExportOfficeManagementPaymentExcelFile`,
			options
		).then((response) => response.blob());
	},

	exportCreditReceiptExcelFile(params: TCreditReceiptReportParams, filterId: number) {
		return paymentsInstance.post(
			`${BASE_URL}/ExportCreditReceiptExcelFile`,
			JSON.stringify(params),
			{ params: { filterId } }
		);
	},

	exportLegalDocumentsExcelFile(params: TLegalDocReportParams, filterId: number) {
		return paymentsInstance.post(
			`${BASE_URL}/ExportLegalDocumentRequestsExcelFile`,
			JSON.stringify(params),
			{ params: { filterId } }
		);
	},

	getReportConfigurationDev(values: TReportDictionaryFilter) {
		return paymentsInstanceDev.get(`${BASE_URL}/GetReportConfiguration`, {
			params: {
				id: values.reportComponent
			}
		})
	},

	getReportConfigurationQas(values: TReportDictionaryFilter) {
		return paymentsInstanceQas.get(`${BASE_URL}/GetReportConfiguration`, {
			params: {
				id: values.reportComponent
			}
		})
	},

	getReportConfigurationPrd(values: TReportDictionaryFilter) {
		return paymentsInstancePrd.get(`${BASE_URL}/GetReportConfiguration`, {
			params: {
				id: values.reportComponent
			}
		})
	},

	postReportConfigurationDev(id: number, values: TReportDictionary[]) {
		return paymentsInstanceDev.post(`${BASE_URL}/PostReportConfiguration`, values, {
			params: {
				id
			}
		})
	},

	postReportConfigurationQas(id: number, values: TReportDictionary[]) {
		return paymentsInstanceQas.post(`${BASE_URL}/PostReportConfiguration`, values, {
			params: {
				id
			}
		})
	},

	postReportConfigurationPrd(id: number, values: TReportDictionary[]) {
		return paymentsInstancePrd.post(`${BASE_URL}/PostReportConfiguration`, values, {
			params: {
				id
			}
		})
	},

	sendReportByEmail(params: TSendReportByEmail){
		return paymentsInstance.post(`${BASE_URL}/send-report-by-email`, {
			
				executionId: params.executionId,
				emailsTo: params.emailsTo,
				emailsCC: params.emailsCC,
				subject: params.subject,
				body: params.body
			
		})
	},

	cancelReportExecution(executionId: string){
		return paymentsInstance.put(`${BASE_URL}/CancelReportExecution?executionId=${executionId}`)
	}
};

export default reportAPI;
