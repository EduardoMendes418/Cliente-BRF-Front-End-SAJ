import { createAsyncThunk } from '@reduxjs/toolkit';
import { actions } from '../..';
import api from 'src/core/api/process-record-registration-table';
import { TCreateProcessRecordRegistration, TGetTableAttributes, TSearchTableProcessRecordRegistration } from 'src/core/models/process-record-registration-table';

export const fetchProcessRecordRregistrationTableGrid = createAsyncThunk(
	'processRecordRegistrationTable/fetchGrid',
	async (params: TSearchTableProcessRecordRegistration, { dispatch }) => {
		const response = await api.listGrid(params);
		dispatch(actions.pagination.setPageCount(response.data.pageCount))
		return response.data
	}
);

export const fetchProcessRecordTableAttributes = createAsyncThunk(
	'processRecordRegistrationTable/fetchTableAttributes',
	async (params: TGetTableAttributes, { dispatch }) => {
		const response = await api.listByTableAttributes(params);
		dispatch(actions.pagination.setPageCount(response.data.pageCount))
		return response.data
	}
);

export const fetchProcessRecordTableAttributesList = createAsyncThunk(
	'processRecordRegistrationTable/fetchTableAttributesList',
	async (params: TGetTableAttributes, { dispatch }) => {
		const response = await api.listByTableAttributes(params);
		dispatch(actions.processRecordRegistrationTable.setTableAttributesList(response.data));
		return response.data
	}
);

export const fetchProcessRecordTableAttributesListWithLike = createAsyncThunk(
	'processRecordRegistrationTable/fetchTableAttributesListWithLike',
	async (params: TGetTableAttributes, { dispatch }) => {
		const response = await api.listByTableAttributesWithLike(params);
		dispatch(actions.processRecordRegistrationTable.setTableAttributesWithLike(response.data));
		return response.data
	}
);

export const fetchProcessRecordTableRegistrationTableId = createAsyncThunk(
	'processRecordRegistrationTable/fetch',
	async ({ notPaginate, ...values }: any, { rejectWithValue, dispatch }) => {
		try {
			const response = await api.listById(values);
			!notPaginate && dispatch(actions.pagination.setPageCount(response.data.pageCount))
			return response.data
		} catch (err: any) {
			return rejectWithValue({ error: err.response.data });
		}
	}
);

export const addProcessRecordRegistrationTable = createAsyncThunk(
	'processRecordRegistrationTable/add',
	async (values: TCreateProcessRecordRegistration, { rejectWithValue }) => {
		try {
			const response = await api.create(values);
			return response;
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);

export const editProcessRecordRegistrationTable = createAsyncThunk(
	'processRecordRegistrationTable/edit',
	async (values: TCreateProcessRecordRegistration, { rejectWithValue }) => {
		try {
			const response = await api.update(values);
			return response;
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);