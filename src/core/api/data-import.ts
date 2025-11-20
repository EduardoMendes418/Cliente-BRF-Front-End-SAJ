import { paymentsInstance } from ".";
import {
	TDataImport,
	TDataImportMultipleFilesFilter,
	TDataImportRequestFilter,
	TGetContacts,
	TRequestCTGFolderFilter,
} from "../models/data-import";
import { customUploadFilesConfig, upload, createFormImport, createFormImportRequest } from "./utils";
import { ParamsGet } from "../models";
import {
	TDataImportGoodsAndGuaranteesFilters,
	TDataImportProcessSheetFilters,
	TYPE_DOCUMENTS,
	TDataImportDocuments,
} from "src/core/models/data-import";
import { TReportFilters } from "../models/office-management-data-import";
import { getIdToken } from "../utils/func";

const BASE_URL = "data-import";

const api = {
	importContacts(files: FileList) {
		return upload(paymentsInstance, `${BASE_URL}/contacts`, files, "formFile");
	},
	listGoodsGuarantees(
		params: ParamsGet & TDataImportGoodsAndGuaranteesFilters
	) {
		return paymentsInstance.get(`${BASE_URL}/goodsguarantees`, { params });
	},
	listGoodsGuaranteesFile(
		params: ParamsGet & TDataImportGoodsAndGuaranteesFilters
	) {
		return paymentsInstance.get(`${BASE_URL}/goodsguarantees/file`, { params, responseType: "arraybuffer" });
	},
	importGoodsGuarantees(files: TDataImport, guaranteeModeId: number | null) {
		return paymentsInstance.post(
			`${BASE_URL}/goodsguarantees?guaranteeModeId=${guaranteeModeId}`,
			createFormImport(files),
			{ ...customUploadFilesConfig }
		);
	},
	importPayment(payload: TDataImport) {
		return paymentsInstance.post(
			`${BASE_URL}/payments`,
			createFormImport(payload),
			{ ...customUploadFilesConfig }
		);
	},
	
	generatePaymentSheetsCsv(params: any) {
		return paymentsInstance.get(`${BASE_URL}/payment-get-modelCsv`, {params, responseType: "arraybuffer"});
	},

	importDocuments(payload: TDataImport, type: TYPE_DOCUMENTS | null) {
		return paymentsInstance.post(
			`${BASE_URL}/documents`,
			createFormImport(payload),
			{ params: { type: type ?? undefined }, ...customUploadFilesConfig }
		);
	},
	listDocumentsFile(params: TDataImportDocuments) {
		return paymentsInstance.post(`${BASE_URL}/get-documents`, params, {responseType: "arraybuffer"});
	},
	importCreditReceipt(payload: TDataImport) {
		return paymentsInstance.post(
			`${BASE_URL}/credit-receipt`,
			createFormImport(payload),
			{ ...customUploadFilesConfig }
		);
	},

	getRequests(filter: TDataImportRequestFilter) {
		return paymentsInstance.post(`${BASE_URL}/generate-request`, filter)
	},

	genereteRequisitionCsv(filter: TDataImportRequestFilter) {
		return paymentsInstance.post(`${BASE_URL}/request-get-report`, filter, {
			params: {
				exportType: 0
			}, responseType: "arraybuffer"
		})
	},
	importRequisitions(payload: TDataImport) {
		return paymentsInstance.post(
			`${BASE_URL}/request`,
			createFormImportRequest(payload),
			{ ...customUploadFilesConfig }
		);
	},
	listProcessSheets(params: ParamsGet & TDataImportProcessSheetFilters) {
		return paymentsInstance.get(`${BASE_URL}/get-process`, { params });
	},
	generateProcessSheetsCsv(params: ParamsGet & TDataImportProcessSheetFilters) {
		return paymentsInstance.get(`${BASE_URL}/get-process-csv`, { params });
	},
	importProcessSheet(files: FileList) {
		return upload(
			paymentsInstance,
			`${BASE_URL}/add-process`,
			files,
			"formFile"
		);
	},
	generateProcessPartiesSheetsCsv(params: ParamsGet & TDataImportProcessSheetFilters) {
		return paymentsInstance.get(`${BASE_URL}/get-csv-process-parties`, { params });
	},
	importProcessPartiesSheet(files: FileList) {
		return upload(
			paymentsInstance,
			`${BASE_URL}/process-parties`,
			files,
			"formFile"
		);
	},
	generateProcessSheetDataLoadContacts(params: any) {
		return paymentsInstance.get(`${BASE_URL}/generate-contact-csv`, params);
	},
	generateProcessProgressSheetsCsv() {
		return paymentsInstance.get(`${BASE_URL}/process-progress-get-modeloCsv`);
	},
	importProcessProgressSheet(files: FileList) {
		return upload(
			paymentsInstance,
			`${BASE_URL}/process-progress-sheet`,
			files,
			"formFile"
		);
	},
	generateProvisionRequest(params: TRequestCTGFolderFilter) {
		return paymentsInstance.post(
			`${BASE_URL}/provision/get-spreadsheet`,
			params, {responseType: "arraybuffer"}
		);
	},

	generateRequestFilter(params: any)  {
		return paymentsInstance.get(`${BASE_URL}/get-credit-receipt`,{params});
	},

	generateProvisionRequestXlsx(
		params: TDataImportMultipleFilesFilter,
		exportType: string
	) {
		const options = {
			method: "POST",
			headers: {
				accept: "*/*",
				Authorization: `Bearer ${getIdToken()}`,
				"Content-Type": "application/json-patch+json",
			},
			body: JSON.stringify(params),
		};
		return fetch(
			`${import.meta.env.REACT_APP_BASE_URL_PAYMENTS}${BASE_URL}/request-get-report?exportType=${exportType}`,
			options
		).then((response) => response.blob());
	},
	generateProvisionRequestCount(
		params: TDataImportMultipleFilesFilter,
		exportType: string
	) {
		return paymentsInstance.post(
			`${BASE_URL}/request-get-count?exportType=${exportType}`,
			params
		);
	},

	generateProvisionRequestXlsx2(
		params: any,
		exportType: string
	) {
		return paymentsInstance.get(`${BASE_URL}/credit-receipt-file`,{params: {...params,exportType}, responseType: "arraybuffer"});
	},

	importProvisionRequest(files: FileList, skipAccounting: boolean) {
		return upload(
			paymentsInstance,
			`${BASE_URL}/provision/post-spreadsheet-provision-update?skipAccounting=${skipAccounting}`,
			files,
			"file"
		);
	},

	generateOfficeManager(filters: TReportFilters) {
		return paymentsInstance.get(`${BASE_URL}/get-offices-csv`, {
			params: filters,
			responseType: "arraybuffer"
		});
	},
	importOfficeManager(files: FileList) {
		return upload(
			paymentsInstance,
			`${BASE_URL}/import-offices-csv`,
			files,
			"file"
		);
	},
	getContactsCsv(params: TGetContacts){
		return paymentsInstance.get(`${BASE_URL}/get-contacts-csv`, {params})
	},
	getContacts(params: TGetContacts){
		return paymentsInstance.get(`${BASE_URL}/get-contacts`, {params})
	},
	importProgress(payload: TDataImport) {
		return paymentsInstance.post(
			`${BASE_URL}/progress`,
			createFormImport(payload),
			{ ...customUploadFilesConfig }
		);
	},
	generateProgress() {
		return paymentsInstance.get(`${BASE_URL}/progress`,{ responseType: "arraybuffer"});
	},
	importAccountability(payload: TDataImport) {
		return paymentsInstance.post(
			`${BASE_URL}/accountability`,
			createFormImport(payload),
			{ ...customUploadFilesConfig }
		);
	},
	accountabilityList(params: any, page?: any, pageSize?: any) {
		const correctedFolderNumberParam = {...params, folderNumbers: [params.folderNumbers]}
		if(params.hasOwnProperty('folderNumbers') === false){delete correctedFolderNumberParam.folderNumbers}

		return paymentsInstance.post(`${BASE_URL}/accountability-list?page=${page}&pageSize=${pageSize}`, correctedFolderNumberParam);
	},
	accountabilityFile(params: any) {
		const correctedFolderNumberParam = {...params, folderNumbers: [params.folderNumbers]}
		if(params.hasOwnProperty('folderNumbers') === false){delete correctedFolderNumberParam.folderNumbers}
		return paymentsInstance.post(`${BASE_URL}/accountability-file`, correctedFolderNumberParam, {responseType: "arraybuffer"});
	},
	importJudicialBlocksAndTransfers(payload: TDataImport) {
		return paymentsInstance.post(
			`${BASE_URL}/judicial-blocks-and-transfers`,
			createFormImport(payload),
			{ ...customUploadFilesConfig }
		);
	},
	judicialBlocksAndTransfersList(params: any, page?: any, pageSize?: any) {
		const correctedFolderNumberParam = {...params, folderNumbers: [params.folderNumbers]}
		if(params.hasOwnProperty('folderNumbers') === false){delete correctedFolderNumberParam.folderNumbers}
		return paymentsInstance.post(`${BASE_URL}/judicial-blocks-and-transfers-list?page=${page}&pageSize=${pageSize}`, correctedFolderNumberParam);
	},
	judicialBlocksAndTransfersFile(params: any) {
		const correctedFolderNumberParam = {...params, folderNumbers: [params.folderNumbers]}
		if(params.hasOwnProperty('folderNumbers') === false){delete correctedFolderNumberParam.folderNumbers}
		return paymentsInstance.post(`${BASE_URL}/judicial-blocks-and-transfers-file`, correctedFolderNumberParam, {responseType: "arraybuffer"});
	},

};

export default api;
