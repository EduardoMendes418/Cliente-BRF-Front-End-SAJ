import { createAsyncThunk } from '@reduxjs/toolkit';
import { omit, pathOr } from 'ramda';

import { STATUS_APPROVALS_FLOW } from 'src/core/utils/constants';
import { renameProps, renameFilterProps } from 'src/core/models/payment';
import { TPaymentInspectionRequestFilters, TPayment } from 'src/core/models/inspection';
import api from 'src/core/api/inspection';
import { renameKeys } from 'src/core/utils/func';
import { TUpdateStatus } from 'src/core/models';
import { actions, RootState } from '../..';

const defaultFilter = {
	id: null,
	folderNumber: "",
	dataSolicitacao: null,
	statusApprovalId: null,
	legalDepartmentArea: "",
	tipoPagamentoId: null,
	formaPagamentoId: null,
	dataPagamento: null,
	valorTotalGuia: null,
	advogadoInternoId: null,
	status: null,
	notPaginate: false,
	page: 0,
	pageSize: 0
} as TPaymentInspectionRequestFilters

export const fetchPaymentInspectionList = createAsyncThunk(
	'inspection/paymentInspectionList',
	async (params: TPaymentInspectionRequestFilters, { dispatch }) => {
		const filters = renameKeys(renameFilterProps, true)(params);
		const response = await api.list({ ...defaultFilter, ...filters });
		if (!filters.notPaginate)
			dispatch(actions.pagination.setPageCount(response.data.pageCount))
		return renameKeys(renameProps)(response.data)
	}
);

export const addPaymentInspectionList = createAsyncThunk(
	'inspection/paymentInspectionList',
	async (params: TPaymentInspectionRequestFilters, { dispatch }) => {
		const filters = renameKeys(renameFilterProps, true)(params);
		const response = await api.send({ ...defaultFilter, ...filters });
		if (!filters.notPaginate)
			dispatch(actions.pagination.setPageCount(response.data.pageCount))
		return renameKeys(renameProps)(response.data)
	}
);

export const getPaymentInspection = createAsyncThunk(
	'inspection/get',
	async (id: number, { getState }) => {
		const { paymentRequest: { list } } = getState() as RootState

		const item = list.find((item) => item.id === id)
		if (item) return item

		const response = await api.list({ ...defaultFilter, id, notPaginate: true, });
		return renameKeys(renameProps)(pathOr({}, ['data', 'items', 0], response))
	}
);

export const addPaymentInspectionRequest = createAsyncThunk(
	'inspection/add',
	async (values: TPayment, { rejectWithValue }) => {
		try {
			const response = await api.add({ ...values, statusFlowId: STATUS_APPROVALS_FLOW.REQUESTED });
			const pagamentoId = response.data.id;
			if (pagamentoId && values.filesIsGuide.length > 0 || pagamentoId && values.files.length > 0) {
				try {
					if(pagamentoId && values.files.length > 0){
						await api.uploadFiles(pagamentoId, values.files, false);
					}
					const responseFile = await api.uploadFiles(pagamentoId, values.filesIsGuide, true);
					return responseFile.data; 
				} catch (err: any) {
					return rejectWithValue(err.response.data);
				}
			}
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);

export const editPaymentInspectionRequest = createAsyncThunk(
	'inspection/add',
	async (values: TPayment, { rejectWithValue }) => {
		try {

			const normalizedValues = {
				...omit([
					'logs',
					'possibleApprovers',
					'approvalDateOfLegalControl',
					'approvalDateOfInternalLawyer',
					'approverOfLegalControl',
					'approverOfInternalLawyer',
					'observationOfLegalControl',
					'observationOfInternalLawyer',
					'files',
				], values),
				statusApprovalId: STATUS_APPROVALS_FLOW.NONE,
				statusFlowId: STATUS_APPROVALS_FLOW.REQUESTED,
			} as TPayment

			const calls = [
				api.edit(normalizedValues),
				api.updateStatus(Number(normalizedValues.id), STATUS_APPROVALS_FLOW.REQUESTED),
			]

			if (values.files) calls.push(api.uploadFiles(Number(values.id), values.files, false))
			if( values.filesIsGuide) calls.push(api.uploadFiles(Number(values.id), values.files, true))	
			const response = await Promise.all(calls)

			return response

		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);

export const deletePaymentInspectionRequestFile = createAsyncThunk(
	'inspection/deleteFile',
	async (id: number, { rejectWithValue }) => {
		try {
			const response = await api.deleteFile(id);
			return response.data;
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);

export const updateStatusPaymentInspectionRequest = createAsyncThunk(
	'inspection/updateStatus',
	async (
		{ id, statusFlowId, observation }: TUpdateStatus,
		{ rejectWithValue }
	) => {
		try {
			const response = await api.updateStatus(id, statusFlowId, observation);
			return response.data;
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);

export const getPaymentInspectionAccounting = createAsyncThunk(
	'inspection/getAccounting',
	async (id: number) => {
		const response = await api.getAccounting(id);

		return pathOr({}, ['data', 'items', response.data?.items?.length - 1], response);
	}
);