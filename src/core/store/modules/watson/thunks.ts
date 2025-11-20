import { createAsyncThunk } from '@reduxjs/toolkit';

import api from '../../../api/watson';
import { TWatson, TWatsonFilter } from '../../../models/watson';
import { rejectNoValues } from 'src/core/utils/func';
import { ParamsGet } from "src/core/models";
import { actions } from 'src/core/store';

const convertToFilter = (values: TWatson) => ({
	id: values.id ?? 0,
	nameFilter: values.nameFilter ?? "",
	userId: values.userId ?? 0,
	statusFilter: values.statusFilter ?? true,
	areaDejur: values.areaDejur ?? null,
	createdDate: values.createdDate,

	filter: {
		folderNumber: [values.folderNumber ?? ""] ?? [],
		legalDepartamentArea: values.legalDepartamentArea ?? [],
		litigationRelationship: values.litigationRelationship ?? null,

		filterBaseGeral: {
			contingencyEnum: values.filterBaseGeralContingencyEnum ?? [],
			statusEnum: values.filterBaseGeralStatusEnum ?? [],
			sphere: values.filterBaseGeralSphere ?? [],
			creationDateStart: values.filterBaseGeralCreationDateStart ?? null,
			creationDateEnd: values.filterBaseGeralCreationDateEnd ?? null,
			provisionClass: values.filterBaseGeralProvisionClass ?? []
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
			paymentType: values.filterConvertedDepositPaymentType ?? [],
			statusFlowId: values.filterConvertedDepositSituationAccountability ?? [],
			situationAccountability: values.filterConvertedStatus ?? [],
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
	}
});

const convertToFilterEdit = (values: TWatson) => ({
	id: values.id ?? 0,
	nameFilter: values.nameFilter ?? "",
	userId: values.userId ?? 0,
	statusFilter: values.statusFilter ?? true,
	areaDejur: values.areaDejur ?? null,
	createdDate: values.createdDate,
	filter: {
		folderNumber: values.folderNumber  ?? '',
		legalDepartamentArea: values.legalDepartamentArea ?? [],
		litigationRelationship: values.litigationRelationship ?? null,

		filterBaseGeral: {
			contingencyEnum: values.filterBaseGeralContingencyEnum ?? [],
			statusEnum: values.filterBaseGeralStatusEnum ?? [],
			sphere: values.filterBaseGeralSphere ?? [],
			creationDateStart: values.filterBaseGeralCreationDateStart ?? null,
			creationDateEnd: values.filterBaseGeralCreationDateEnd ?? null,
			provisionClass: values.filterBaseGeralProvisionClass ?? []
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
			paymentType: values.filterConvertedDepositPaymentType ?? [],
			statusFlowId: values.filterConvertedDepositSituationAccountability ?? [],
			situationAccountability: values.filterConvertedStatus ?? [],
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
	}
});

const convertToWatson = (values: any): TWatson => ({
	nameFilter: values.nameFilter,
	id: values.id,
	userId: values.userId,
	statusFilter: values.statusFilter,
	areaDejur: values.areaDejur,

	folderNumber: values.filter.folderNumber,
	legalDepartamentArea: values.filter.legalDepartamentArea,
	litigationRelationship: values.filter.litigationRelationship,

	filterBaseGeralContingencyEnum: values.filter.filterBaseGeral.contingencyEnum,
	filterBaseGeralStatusEnum: values.filter.filterBaseGeral.statusEnum,
	filterBaseGeralSphere: values.filter.filterBaseGeral.sphere,
	filterBaseGeralCreationDateStart: values.filter.filterBaseGeral.creationDateStart,
	filterBaseGeralCreationDateEnd: values.filter.filterBaseGeral.creationDateEnd,
	filterBaseGeralProvisionClass: values.filter.filterBaseGeral.provisionClass,

	filterBaseGeralDeadContingencyEnum: values.filter.filterBaseGeralDead.contingencyEnum,
	filterBaseGeralDeadStatusEnum: values.filter.filterBaseGeralDead.statusEnum,
	filterBaseGeralDeadSphere: values.filter.filterBaseGeralDead.sphere,
	filterBaseGeralDeadTerminationDateStart: values.filter.filterBaseGeralDead.creationDateStart,
	filterBaseGeralDeadTerminationDateEnd: values.filter.filterBaseGeralDead.creationDateEnd,
	filterBaseGeralDeadProvisionClass: values.filter.filterBaseGeralDead.provisionClass,

	filterGoodsGuarantesGuaranteeModeId: values.filter.filterGoodsGuarantes.guaranteeModeId,
	filterGoodsGuarantesPaymentType: values.filter.filterGoodsGuarantes.paymentType,
	filterGoodsGuarantesStatusEnum: values.filter.filterGoodsGuarantes.statusEnum,
	filterGoodsGuarantesBearishReasons: values.filter.filterGoodsGuarantes.statusAssets,

	filterConvertedDepositBearishReasons: values.filter.filterConvertedDeposit.bearishReasons,
	filterConvertedDepositGuaranteeModeId: values.filter.filterConvertedDeposit.guaranteeModeId,
	filterConvertedDepositPaymentType: values.filter.filterConvertedDeposit.paymentType,
	filterConvertedDepositSituationAccountability: values.filter.filterConvertedDeposit.statusFlowId,
	filterConvertedStatus: values.filter.filterConvertedDeposit.situationAccountability,

	filterConvertedDepositApprovalDateStart: values.filter.filterConvertedDeposit.approvalDateStart,
	filterConvertedDepositApprovalDateEnd: values.filter.filterConvertedDeposit.approvalDateEnd,

	filterPaymentStatusApprovalId: values.filter.filterPayment.statusApprovalId,
	filterPaymentPaymentType: values.filter.filterPayment.paymentType,
	filterPaymentSapEntryDateStart: values.filter.filterPayment.sapEntryDateStart,
	filterPaymentSapEntryDateEnd: values.filter.filterPayment.sapEntryDateEnd,

	indexSelic: values.filter.economicIndices.indexSelic,
	indexLegalInterest: values.filter.economicIndices.indexLegalInterest
})

export const fetchWatsonList = createAsyncThunk(
	'watson/fetch',
	async (params: ParamsGet & TWatsonFilter, { rejectWithValue, dispatch }) => {
		try {
			const response = await api.list(params);
			!params.notPaginate &&dispatch(actions.pagination.setPageCount(response.data.pageCount))
			return response.data
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);

export const getWatsonItem = createAsyncThunk(
	'watson/get',
	async (params: TWatsonFilter, { rejectWithValue, dispatch }) => {
		try {
			const response = await api.list(params);
			return convertToWatson(response.data.items[0]) as TWatson
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);

export const addWatson = createAsyncThunk(
	'watson/add',
	async (values: TWatson, { rejectWithValue }) => {
		try {
			const normalizedValues = rejectNoValues(values) as TWatson
			const response = await api.add(convertToFilter(normalizedValues));
			return response.data;
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);

export const editWatson = createAsyncThunk(
	'watson/edit',
	async (values: TWatson, { rejectWithValue }) => {
		try {
			const normalizedValues = rejectNoValues(values) as TWatson
			const response = await api.edit(convertToFilterEdit(normalizedValues));
			return response.data;
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);

export const editRawWatson = createAsyncThunk(
	'watson/editRaw',
	async (values: TWatson, { rejectWithValue }) => {
		try {
			const normalizedValues = rejectNoValues(values) as TWatson
			const response = await api.edit(normalizedValues);
			return response.data;
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);

export const deleteWatson = createAsyncThunk(
	'watson/delete',
	async (id: number, { rejectWithValue }) => {
		try {
			const response = await api.delete(id);
			return response.data;
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);