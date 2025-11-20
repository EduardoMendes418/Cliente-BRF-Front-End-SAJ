
import { createAsyncThunk } from '@reduxjs/toolkit';
import { TWatson, TParamsXlsx } from '../../../models/watson';
import { rejectNoValues } from 'src/core/utils/func';
import { actions } from 'src/core/store';
import FileSaver from 'file-saver';
import moment from 'moment';
import api from '../../../api/watson-export';

const convertToWatsonExport = (values: TWatson) => ({
	WatsonSearchFilterId: values.WatsonSearchFilterId ?? null,
	folderNumber: values.folderNumber ?? [],
	legalDepartamentArea: values.legalDepartamentArea ?? [],
	litigationRelationship: values.litigationRelationship ?? null,

	filterBaseGeral: {
		contingencyEnum: values.filterBaseGeralContingencyEnum ?? [],
		statusEnum: values.filterBaseGeralStatusEnum ?? [],
		sphere: values.filterBaseGeralSphere ?? [],
		creationDateStart: values.filterBaseGeralCreationDateStart ?? null,
		creationDateEnd: values.filterBaseGeralCreationDateEnd ?? null,
		provisionClass: values.filterBaseGeralProvisionClass ?? [],
	},
	filterBaseGeralDead: {
		contingencyEnum: values.filterBaseGeralDeadContingencyEnum ?? [],
		statusEnum: values.filterBaseGeralDeadStatusEnum ?? [],
		sphere: values.filterBaseGeralDeadSphere ?? [],
		creationDateStart: values.filterBaseGeralDeadTerminationDateStart ?? null,
		creationDateEnd: values.filterBaseGeralDeadTerminationDateEnd ?? null,
		provisionClass: values.filterBaseGeralDeadProvisionClass ?? []
	},
	filterGoodsGuarantes: {
		guaranteeModeId: values.filterGoodsGuarantesGuaranteeModeId ?? [],
		paymentType: values.filterGoodsGuarantesPaymentType ?? [],
		statusEnum: values.filterGoodsGuarantesStatusEnum ?? [],
		statusAssets: values.filterGoodsGuarantesBearishReasons ?? [],
	},
	filterConvertedDeposit: {
		bearishReasons: values.filterConvertedDepositBearishReasons ?? [],
		guaranteeModeId: values.filterConvertedDepositGuaranteeModeId ?? [],
		filterConvertedStatus: values.filterConvertedStatus ?? [],
		paymentType: values.filterConvertedDepositPaymentType ?? [],
		situationAccountability: values.filterConvertedDepositSituationAccountability ?? [],
		approvalDateStart: values.filterConvertedDepositApprovalDateStart ?? null,
		approvalDateEnd: values.filterConvertedDepositApprovalDateEnd ?? null,
	},
	filterPayment: {
		statusApprovalId: values.filterPaymentStatusApprovalId ?? [],
		paymentType: values.filterPaymentPaymentType ?? [],
		sapEntryDateStart: values.filterPaymentSapEntryDateStart ?? null,
		sapEntryDateEnd: values.filterPaymentSapEntryDateEnd ?? null,
	},
	economicIndices: {
		indexSelic: values.indexSelic ?? null,
		indexLegalInterest: values.indexLegalInterest ?? null
	}
})

export const fetchWatsonCsv = createAsyncThunk(
	'watsonExport/export',
	async ({baseRevision, simulation, ...values}: TWatson, { rejectWithValue }) => {
		try {
			const normalizedValues = rejectNoValues(convertToWatsonExport(values));
			const response = await api.export(normalizedValues, !!baseRevision, !!simulation);
			return response.data;
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);

export const fetchWatsonExportList = createAsyncThunk(
	'watsonExport/fetch',
	async (params: any, { rejectWithValue, dispatch }) => {
		try {
			const response = await api.list(params);
			dispatch(actions.pagination.setPageCount(response.data.pageCount))
			return response.data
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);

export const fetchWatsonXLSX = createAsyncThunk(
	'watsonExport/exportXLSX',
	async (values: TParamsXlsx, { rejectWithValue }) => {
		
		const arrayOfValues = values.nameFiles.map(function(fileType: string) {
			return 'nameFiles=' + fileType;
		}).join('&')
		 
		values.nameFiles = arrayOfValues;
		
		try {
			const response = await api.exportxlsx(values);
			FileSaver.saveAs(response, `watson-${moment().format()}.zip`);
			return response;
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);