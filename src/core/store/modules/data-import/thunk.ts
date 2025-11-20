import { createAsyncThunk } from "@reduxjs/toolkit";

import api from "src/core/api/data-import";
import { ParamsGet } from "src/core/models";
import {
	MULTIPLE_FILES_TYPE,
	SINGLE_FILE_TYPE,
	TYPE_DOCUMENTS,
	TDataImportGoodsAndGuaranteesFilters,
	TDataImportProcessSheetFilters,
	TDataImportDocuments,
	renamePropsDocuments,
	TDataImportGoodsAndGuarantees,
	TDataImport,
	renameGoodsAndGuaranteesProps,
	TRequestCTGFolderFilterForm,
	TRequestCTGFolderFilter,
	TDataImportMultipleFilesForm,
	TGetContacts,
	TDataImportRequestFilter,
} from "src/core/models/data-import";
import {
	rejectNoValues,
	convertRadioOptionToBoolOrNull,
	renameKeys,
	handleJSONError,
	getAxiosError,
} from "src/core/utils/func";
import { actions } from "src/core/store";
import { TReportFilters } from "src/core/models/office-management-data-import";
import { convertArrayBufferToObject } from "src/core/utils/func";

export const fetchGoodsGuarantees = createAsyncThunk(
	"dataImport/GoodsGuaranteesfetch",
	async (
		values: ParamsGet & TDataImportGoodsAndGuaranteesFilters,
		{ rejectWithValue, dispatch }
	) => {
		try {
			const normalizedValues = rejectNoValues(values) as ParamsGet &
				TDataImportGoodsAndGuaranteesFilters;
			delete normalizedValues.guaranteeModeId
			 if(normalizedValues.hasOwnProperty("ids") === true) {
				const normalizedValuesWithIds = {
					...normalizedValues,
					ids: normalizedValues.ids.split(";")
				}
			const response = await api.listGoodsGuarantees(normalizedValuesWithIds);
			return {
				items: (response.data.items ?? []).map(
					(item: TDataImportGoodsAndGuarantees) =>
						renameKeys(renameGoodsAndGuaranteesProps)(item)
				),
			};

			} 
			const response = await api.listGoodsGuarantees(normalizedValues);
			dispatch(actions.pagination.setPageCount(response.data.pageCount));
			dispatch(actions.pagination.setItemCount(response.data.itemCount));
			return {
				items: (response.data.items ?? []).map(
					(item: TDataImportGoodsAndGuarantees) =>
						renameKeys(renameGoodsAndGuaranteesProps)(item)
				),
			};
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);

export const fetchGoodsGuaranteesCsv = createAsyncThunk(
	"dataImport/fetchGoodsGuaranteesCsv",
	async (
		values: ParamsGet & TDataImportGoodsAndGuaranteesFilters,
		{ rejectWithValue }
	) => {
		try {
			const normalizedValues = rejectNoValues(values) as ParamsGet &
				TDataImportGoodsAndGuaranteesFilters;

				if(normalizedValues.hasOwnProperty("ids") === true) {
					const normalizedValuesWithIds = {
						...normalizedValues,
						ids: normalizedValues.ids.split(";")
					}
				const response = await api.listGoodsGuaranteesFile(normalizedValuesWithIds);
				return response.data;
	
				}  
				
			const response = await api.listGoodsGuaranteesFile(normalizedValues);
			return response.data;
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);

export const importGoodsGuarantees = createAsyncThunk(
	"dataImport/goodsGuarantees",
	async (
		{ files, guaranteeModeId }: { files: TDataImport; guaranteeModeId: number },
		{ rejectWithValue, getState }
	) => {
		try {
			await api.importGoodsGuarantees(files, guaranteeModeId);
		} catch (err: any) {
			return rejectWithValue(handleJSONError(err));
		}
	}
);

const SINGLE_FILE_API = {
	[SINGLE_FILE_TYPE.PROCESS_PROGRESS_SHEET]: api.importProcessProgressSheet,
	[SINGLE_FILE_TYPE.PROCESS_SHEET]: api.importProcessSheet,
	[SINGLE_FILE_TYPE.PROCESS_SHEET_INVOLVED]: api.importProcessPartiesSheet,
	[SINGLE_FILE_TYPE.REQUEST_CTG_FOLDER]: api.importProvisionRequest,
	[SINGLE_FILE_TYPE.OFFICE_MANAGER]: api.importOfficeManager,
};

export const importSingleFile = createAsyncThunk(
	"dataImport/importSingleFile",
	async (
		{ type, file }: { file: FileList; type: SINGLE_FILE_TYPE },
		{ rejectWithValue }
	) => {
		try {
			const response = await (SINGLE_FILE_API as any)[type](file);
			return response.data;
		} catch (err: any) {
			return rejectWithValue(handleJSONError(err));
		}
	}
);

export const importSingleFileRequestCtg = createAsyncThunk(
	"dataImport/importSingleFile",
	async (
		{ skipAccounting, file }: { file: FileList; skipAccounting: boolean },
		{ rejectWithValue }
	) => {
		try {
			const response = await api.importProvisionRequest(file, skipAccounting);
			return response.data;
		} catch (err: any) {
			return rejectWithValue(handleJSONError(err));
		}
	}
);

export const importContacts = createAsyncThunk(
	"dataImport/importContacts",
	async (
		{ file }: { file: FileList},
		{ rejectWithValue }
	) => {
		try {
			const response = await api.importContacts(file)
			return response.data;
		} catch (err: any) {
			return rejectWithValue(handleJSONError(err));
		}
	}
);

const MULTIPLE_FILES_API = {
	[MULTIPLE_FILES_TYPE.PAYMENT]: api.importPayment,
	[MULTIPLE_FILES_TYPE.CREDIT_RECEIPT]: api.importCreditReceipt,
	[MULTIPLE_FILES_TYPE.REQUISITIONS]: api.importRequisitions,
	[MULTIPLE_FILES_TYPE.PROCESS_PROGRESS_SHEET]: api.importProgress,
	[MULTIPLE_FILES_TYPE.ACCOUNTABILITY]: api.importAccountability,
	[MULTIPLE_FILES_TYPE.JUDICIAL_BLOCKS_AND_TRANSFERS]: api.importJudicialBlocksAndTransfers

};

export const importMultipleFiles = createAsyncThunk(
	"dataImport/importMultipleFiles",
	async (
		{ type, ...values }: TDataImport & { type: MULTIPLE_FILES_TYPE },
		{ rejectWithValue }
	) => {
		try {
			const response = await (MULTIPLE_FILES_API as any)[type](values);
			return response.data;
		} catch (err: any) {
			return rejectWithValue(handleJSONError(err));
		}
	}
);

export const importDocuments = createAsyncThunk(
	"dataImport/importDocuments",
	async (
		{ type, ...values }: TDataImport & { type: TYPE_DOCUMENTS | null },
		{ rejectWithValue }
	) => {
		try {
			const response = await api.importDocuments(values, type);
			return response.data;
		} catch (err: any) {
			return rejectWithValue(handleJSONError(err));
		}
	}
);

export const fetchDocuments = createAsyncThunk(
	"dataImport/fetchDocuments",
	async (values: TDataImportDocuments, { rejectWithValue }) => {
		try {
			const normalizadRatioValues = convertRadioOptionToBoolOrNull(values, [
				"paymentReceipt",
				"pensionReceipt",
			]) as TDataImportDocuments;
			const normalizedValues = rejectNoValues(
				normalizadRatioValues
			) as TDataImportDocuments;
			const response = await api.listDocumentsFile(
				renameKeys(renamePropsDocuments, true)(normalizedValues)
			);
			return response.data;
		} catch (err: any) {
			return rejectWithValue({
				error: { message: err.response.data.detail },
			});
		}
	}
);

export const fetchProcessSheet = createAsyncThunk(
	"data-import-process-sheet/fetch",
	async (params: TDataImportProcessSheetFilters, { dispatch }) => {
		const filter = rejectNoValues(params);
		const response = await api.listProcessSheets(
			filter as ParamsGet & TDataImportProcessSheetFilters
		);
		dispatch(actions.pagination.setPageCount(response.data.pageCount));
		dispatch(actions.pagination.setItemCount(response.data.itemCount));

		return response.data;
	}
);

export const generateProcessSheetCsv = createAsyncThunk(
	"data-import-process-sheet/csv",
	async (params: TDataImportProcessSheetFilters, { rejectWithValue }) => {
		try {
			const filter = rejectNoValues(params);
			const response = await api.generateProcessSheetsCsv(
				filter as ParamsGet & TDataImportProcessSheetFilters
			);
			return response.data;
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);

export const generateProcessSheetDataLoadContacts = createAsyncThunk(
	"/data-import/generate-contact-csv",
	async (params: any, { rejectWithValue }) => {
		const filter = rejectNoValues(params);
		const response = await api.generateProcessSheetDataLoadContacts(filter);
		return response.data;
	}
);

export const generateProcessProgressSheetCsv = createAsyncThunk(
	"data-import/generateProcessProgressSheetCsv",
	async () => {
		const response = await api.generateProcessProgressSheetsCsv();
		return response.data;
	}
);

export const generateProcessPartiesSheetCsv = createAsyncThunk(
	"data-import/generateProcessPartiesSheetCsv",
	async (params: TDataImportProcessSheetFilters, { rejectWithValue }) => {
		try {
			const filter = rejectNoValues(params);
			const response = await api.generateProcessPartiesSheetsCsv(filter as ParamsGet & TDataImportProcessSheetFilters);
			return response.data;
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);

export const generatePaymentSheetsCsv = createAsyncThunk(
	"data-import/generateProcessProgressSheetCsv",
	async (filters: any, {rejectWithValue}) => {
		try {
			const filtersFormatted = rejectNoValues(filters) as any;

			if(filtersFormatted.hasOwnProperty("ids") === true) {
				const normalizedValuesWithIds = {
					...filtersFormatted,
					ids: filtersFormatted.ids.split(";")
				}
			const response = await api.generatePaymentSheetsCsv(normalizedValuesWithIds);
			return response.data;

			} 
			
			const response = await api.generatePaymentSheetsCsv(filtersFormatted)

			return response.data
		} catch (err: any) {
			return rejectWithValue(getAxiosError(err)?.response?.data)
		}
	}
)

export const generateRequestCTGFolderCsv = createAsyncThunk(
	"data-import-request-ctg-folder/csv",
	async (params: TRequestCTGFolderFilterForm, { rejectWithValue }) => {
		try {
			const filter = rejectNoValues(params);
			const response = await api.generateProvisionRequest(
				filter as TRequestCTGFolderFilter
			);
			return response.data;
		} catch (err: any) {
			return rejectWithValue(handleJSONError(err));
		}
	}
);

export const fetchRequest = createAsyncThunk(
	"data-import/request",
	async (filter: TDataImportRequestFilter, { rejectWithValue, dispatch }) => {
		try {
			const response = await api.getRequests(rejectNoValues(filter) as TDataImportRequestFilter)

			const count = Number(response.headers["x-total-count"]);

			dispatch(actions.pagination.setItemCount(count))
			dispatch(actions.pagination.setPageCount(Math.ceil(count / (filter?.pageSize ?? 20))))
			return response.data
		} catch (error) {
			return rejectWithValue(getAxiosError(error)?.response?.data)
		}
	}
)

export const generateRequestFilter = createAsyncThunk(
	"data-import/get-credit-receipt",

	async (params: any, { rejectWithValue ,dispatch}) => {
		try {
			const filter = rejectNoValues(params);
			const response = await api.generateRequestFilter(filter);
			dispatch(actions.pagination.setPageCount(response.data.pageCount));
			dispatch(actions.pagination.setItemCount(response.data.itemCount));
			return response.data;


		} catch (err: any) {
			const error = convertArrayBufferToObject(err.response);
			return rejectWithValue(error);
		}
	}
);

export const generateRequestXlsx = createAsyncThunk(
	"data-import/request-get-report",

	async (params: TDataImportMultipleFilesForm, { rejectWithValue }) => {
		try {
			const filter = rejectNoValues(params);
			const data = await api.generateProvisionRequestXlsx(filter, "1");
			const itemCount = await api.generateProvisionRequestCount(filter, "1"); 

			return {data, itemCount};
		} catch (err: any) {
			const error = convertArrayBufferToObject(err.response);
			return rejectWithValue(error);
		}
	}
);

export const generateRequestCsv = createAsyncThunk(
	"data-import/request-get-report",

	async (params: TDataImportMultipleFilesForm, { rejectWithValue }) => {
		try {
			const filter = rejectNoValues(params);
			const data = await api.generateProvisionRequestXlsx(filter, "1");
			const itemCount = await api.generateProvisionRequestCount(filter, "1"); 

			if(data.type === "application/problem+json") throw new Error("problem+json");
			
			return {data, itemCount: itemCount.data};
		} catch (err: any) {
			return rejectWithValue(err.response);
		}
	}
);

export const generateRequestCsv2 = createAsyncThunk(
	"/credit-receipt-get-report",

	async (params: any, { rejectWithValue }) => {
		try {
			const filter = rejectNoValues(params);
			const response = await api.generateProvisionRequestXlsx2(filter, "0");

			return response.data;
		} catch (err: any) {
			const error = convertArrayBufferToObject(err.response);
			return rejectWithValue(error);
		}
	}
);


export const generateOfficeManager = createAsyncThunk(
	"data-import-office-manager/csv",
	async (filters: TReportFilters, { rejectWithValue }) => {
		try {
			const response = await api.generateOfficeManager(filters);
			return response.data;
		} catch (e: any) {
			return rejectWithValue(e.response.data);
		}
	}
);

export const getContactsCsv = createAsyncThunk(
	"/get-contacts-csv",

	async (params: TGetContacts, { rejectWithValue }) => {
		try {
			const filter = rejectNoValues(params);
			const response = await api.getContactsCsv(filter);
			return response.data;
		} catch (err: any) {
			const error = convertArrayBufferToObject(err.response);
			return rejectWithValue(error);
		}
	}
);

export const getContacts = createAsyncThunk(
	"/get-contacts",

	async (params: TGetContacts, { rejectWithValue }) => {
		try {
			const filter = rejectNoValues(params);
			const response = await api.getContacts(filter);
			return response.data;
		} catch (err: any) {
			const error = convertArrayBufferToObject(err.response);
			return rejectWithValue(error);
		}
	}
);

export const generateRequisition = createAsyncThunk(
	"data-import/generateRequisition",
	async (params: TDataImportRequestFilter, { rejectWithValue }) => {
		try {
			const filter = rejectNoValues(params);

			if (Object.entries(filter).length === 0) {
				filter.id = 0;
			}

			filter.notPaginate = true;

			const response = await api.genereteRequisitionCsv(filter as TDataImportRequestFilter)
			return response.data
		} catch (error) {
			return rejectWithValue(handleJSONError(error));
		}
	}
);

export const generateProgressSheets = createAsyncThunk(
	"data-import/generateProcessProgressSheetCsv",
	async () => {
		const response = await api.generateProgress();
		return response.data;
	}
);

export const generateAccountabilityList = createAsyncThunk(
	"data-import/accountability-list",
	async (params: any, { rejectWithValue }) => {
		try {
			const filter = rejectNoValues(params);
			const response = await api.accountabilityList(filter, params.page, params.pageSize);
			return response.data;
		} catch (err: any) {
			return rejectWithValue(handleJSONError(err));
		}
	}
);

export const generateAccountabilityFile = createAsyncThunk(
	"data-import/generateAccountabilityFile",
	async (params: any, { rejectWithValue }) => {
		try {
			const filter = rejectNoValues(params);

			const response = await api.accountabilityFile(filter)
			return response.data
		} catch (error) {
			return rejectWithValue(handleJSONError(error));
		}
	}
);

export const generateJudicialBlocksAndTransfersList = createAsyncThunk(
	"data-import/judicialblocksandtransfers-list",
	async (params: any, { rejectWithValue }) => {
		try {
			const filter = rejectNoValues(params);
			const response = await api.judicialBlocksAndTransfersList(filter, params.page, params.pageSize);
			return response.data;
		} catch (err: any) {
			return rejectWithValue(handleJSONError(err));
		}
	}
);

export const generateJudicialBlocksAndTransfersFile = createAsyncThunk(
	"data-import/generateJudicialBlocksAndTransfersCsv",
	async (params: any, { rejectWithValue }) => {
		try {
			const filter = rejectNoValues(params);
			const response = await api.judicialBlocksAndTransfersFile(filter)
			return response.data
		} catch (error) {
			return rejectWithValue(handleJSONError(error));
		}
	}
);