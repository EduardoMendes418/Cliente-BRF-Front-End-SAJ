import { createAsyncThunk } from "@reduxjs/toolkit";
import { pathOr } from "ramda";

import {
	TGenerateReportParams,
	TReportComponent,
	TReportConfigurationUpdate,
	TReportDictionary,
	TReportDictionaryFilter,
	TSendReportByEmail,
} from "src/core/models/reports";

import { TReportConfiguration } from "src/core/models/report-configuration";
import reportAPI from "src/core/api/report";
import reportConfigurationAPI from "src/core/api/report-configuration";
import { convertArrayBufferToObject, getAxiosError } from "src/core/utils/func";
import {
	ProvisionRequestReportFilter
} from 'src/core/models/provision'

import { normalizeFilters } from "./normalize";
import { TDIRF } from "src/core/models/payment";
import { TOfficeManagementPaymentReport } from "src/core/models/office-management-payment";
import { Environments } from "src/screen/settings/general/report-orders/hooks/useEnvironment";
import { actions, RootState } from '../..';
import { ParamsGet } from "src/core/models";
import {
	TDataImportMultipleFilesForm,
} from "src/core/models/data-import";

const EXPORT_EXCEL_API = {
	[TReportComponent.PAYMENTS]: reportAPI.exportPaymentExcelFile,
	[TReportComponent.PENSIONS]: reportAPI.exportPensionExcelFile,
	[TReportComponent.JUDICIAL_BLOCKS_AND_TRANSFERS]:
		reportAPI.exportJudicialBlocksAndTransfersExcelFile,
	[TReportComponent.GOODS_GUARANTEES]:
		reportAPI.exportGoodsAndGuaranteesExcelFile,
	[TReportComponent.ACCOUNTABILITYR]:
		reportAPI.exportAccountabilityExcelFile,
	[TReportComponent.STATISTICAL_ORDER]:
		reportAPI.exportStatisticRequestExcelFile,
	[TReportComponent.NOTICE_INSPECTION_PAYMENT]:
		reportAPI.exportNoticeInspectionPaymentExcelFile,
	[TReportComponent.CREDIT_RECEIPT]: reportAPI.exportCreditReceiptExcelFile,
	[TReportComponent.LEGAL_DOCUMENT]: reportAPI.exportLegalDocumentsExcelFile,
};

export const fetchReport = createAsyncThunk(
	'report/fetch',
	async (params: ParamsGet , { dispatch, rejectWithValue }) => {
		try{
			const response = await reportAPI.list(params);
			dispatch(actions.pagination.setPageCount(response.data.pageCount))
			return response.data
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);
export const fetchReportExcelFile = createAsyncThunk(
	"report/fetchReportExcelFile",
	async (
		{ isNew, reportType, reportParams, customFields, filterId }: TGenerateReportParams,
		{ rejectWithValue, getState }
	) => {
		const {
			reportConfiguration: { item },
		} = getState() as RootState;

		try {
			if (!isNew) {
				const response = await reportConfigurationAPI.list({ id: item.id });
				const updatedReportConfiguration = pathOr(
					{},
					["data", 0],
					response
				) as TReportConfiguration;

				if (updatedReportConfiguration) {
					const reportFilterFields =
						updatedReportConfiguration.reportFilterFields
							.filter(
								({ fieldName, filterType }) =>
									!(
										filterType === 1 &&
										customFields.find(
											({ fieldName: name }) => fieldName === name
										)
									)
							)
							.map(({ filterType, fieldName, value }) => ({
								filterType,
								fieldName,
								value,
							}))
							.concat(customFields);

					const reportConfiguration: TReportConfiguration = {
						...item,
						reportFilterFields,
					};
					await reportConfigurationAPI.edit(reportConfiguration);
				}
			}

			const normalizedParams = normalizeFilters(
				reportType,
				reportParams,
				customFields,

			);
			const response = await (EXPORT_EXCEL_API as any)[reportType]({...normalizedParams}, filterId);

			return { report: response.data };
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);

export const fetchEqualizationReportExcelFile = createAsyncThunk(
	"report/fetchEqualizationReportExcelFile",
	async ({id, filterId}:{id: number, filterId:number| null}, { rejectWithValue }) => {
		try {
			const response = await reportAPI.exportEqualizationExcelFile(id, filterId);
			return response.data;
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);

export const generateProvisionReportRequest = createAsyncThunk(
	'report/generateProvisionReportRequest',
	async (params: ProvisionRequestReportFilter, { rejectWithValue, dispatch }) => {
		try {
			const response = await reportAPI.generateProvisionReportRequest(params, params?.filterId ?? null)
			return response.data
		} catch (err: any) {
			const error = convertArrayBufferToObject(err.response.data)
			return rejectWithValue(error);
		}
	}
)

export const exportRequestReportExcelFile = createAsyncThunk(
	'report/exportRequestReportExcelFile',
	async (params: TDataImportMultipleFilesForm, { rejectWithValue, dispatch }) => {
		try {
			const response = await reportAPI.exportRequestReportExcelFile(params)
			return response.data
		} catch (err: any) {
			const error = convertArrayBufferToObject(err.response.data)
			return rejectWithValue(error);
		}
	}
)

export const exportRequestReportCircularizationExcelFile = createAsyncThunk(
	'report/exportRequestReportCircularizationExcelFile',
	async (params: any, { rejectWithValue, dispatch }) => {
		try {
			const response = await reportAPI.exportRequestCircularizationExcelFile(params)
			return response.data
		} catch (err: any) {
			const error = convertArrayBufferToObject(err.response.data)
			return rejectWithValue(error);
		}
	}
)

export const exportRequestReportESocialExcelFile = createAsyncThunk(
	'report/exportRequestReportESocialExcelFile',
	async (params: any, { rejectWithValue, dispatch }) => {
		try {
			const response = await reportAPI.exportRequestESocialionExcelFile(params)
			return response.data
		} catch (err: any) {
			const error = convertArrayBufferToObject(err.response.data)
			return rejectWithValue(error);
		}
	}
)

export const fetchExportDirfDecFile = createAsyncThunk(
	"report/fetchExportDirfDecFile",
	async (values: TDIRF, { rejectWithValue }) => {
		try {
			const response = await reportAPI.exportExportDirfDecFile(values);
			const newBlob = new Blob([response.data]);
			return newBlob;
		} catch (err: any) {
			const error = convertArrayBufferToObject(err.response.data);
			return rejectWithValue(error);
		}
	}
);

export const fetchExportOfficeManagementFile = createAsyncThunk(
	"report/fetchExportDirfDecFile",
	async (values: TOfficeManagementPaymentReport, { rejectWithValue }) => {
		try {
			const finalValues = {};
			Object.entries(values).map(
				([key, value]) => ((finalValues as any)[key] = value === null ? "" : value)
			);
			const response = await reportAPI.exportOfficeManagementPaymentFile(
				finalValues
			);
			return response;
		} catch (err: any) {
			const error = convertArrayBufferToObject(err.response.data);
			return rejectWithValue(error);
		}
	}
);

export const fetchReportConfiguration = createAsyncThunk(
	"report/fetchReportConfiguration",
	async (values: TReportDictionaryFilter, { rejectWithValue }) => {
		try {
			switch (values.environment) {
				case Environments.DEV:
					const resultDev = await reportAPI.getReportConfigurationDev(values);
					return resultDev.data as TReportDictionary[];
				case Environments.QAS:
					const resultQas = await reportAPI.getReportConfigurationQas(values);
					return resultQas.data as TReportDictionary[];
				case Environments.PRD:
					const resultPrd = await reportAPI.getReportConfigurationPrd(values);
					return resultPrd.data as TReportDictionary[];
				default:
					break;
			}
		} catch (error: any) {
			const err = getAxiosError(error);

			rejectWithValue(err?.response?.data);
		}
	}
);

export const updateReportConfiguration = createAsyncThunk(
	"report/updateReportConfiguration",
	async (value: TReportConfigurationUpdate, { rejectWithValue }) => {
		try {
			await reportAPI.postReportConfigurationDev(
				value.reportComponent,
				value.configurations
			);
		} catch (error: any) {
			const err = getAxiosError(error);
			rejectWithValue(err?.response?.data);
		}

		if (value.updateQas) {
			try {
				await reportAPI.postReportConfigurationQas(
					value.reportComponent,
					value.configurations
				);
			} catch (error: any) {
				const err = getAxiosError(error);
				rejectWithValue(err?.response?.data);
			}
		}

		if (value.updatePrd) {
			try {
				await reportAPI.postReportConfigurationPrd(
					value.reportComponent,
					value.configurations
				);
			} catch (error: any) {
				const err = getAxiosError(error);
				rejectWithValue(err?.response?.data);
			}
		}
	}
);


export const sendReportByEmail = createAsyncThunk(
	"report/sendReportByEmail",
	async (values: TSendReportByEmail, { rejectWithValue }) => {
		try {
			const response = await reportAPI.sendReportByEmail(values);
			
			return response;
		} catch (err: any) {
			const error = convertArrayBufferToObject(err.response.data);
			return rejectWithValue(error);
		}
	}
);

export const cancelReportExecution = createAsyncThunk(
	"report/cancelReportExecution",
	async ({executionId}:{executionId: string}, { rejectWithValue }) => {
		try {
			const response = await reportAPI.cancelReportExecution(executionId);
			return response.data;
		} catch (err: any) {
			return rejectWithValue({ error: err.response.data });
		}
	}
);