import { createAsyncThunk } from '@reduxjs/toolkit';
import api from 'src/core/api/circularizationBaseGenerationHeader'
import { actions} from '../..';

export const fetchCircularizationBaseGenerationHeader = createAsyncThunk(
	'circularizationBaseGenerationHeader/fetch',
	async ({ notPaginate, ...values }: any, { rejectWithValue, dispatch }) => {
		try {
			const response = await api.list(values);
			!notPaginate && dispatch(actions.pagination.setPageCount(response.data.pageCount))
			return {
				...response.data,
				items: response.data.items.map((items: []) => items)
			}
		} catch (err: any) {
			return rejectWithValue({ error: err.response.data });
		}
	}
);

export const fetchCircularizationBaseGenerationHeaderOffices = createAsyncThunk(
	'circularizationBaseGenerationHeaderOffcies/fetch',
	async ({ ...values }: any, { rejectWithValue }) => {
		try {
			const response = await api.getOffices(values);
			return response.data
		} catch (err: any) {
			return rejectWithValue({ error: err.response.data });
		}
	}
);

export const setHeaderStatus = createAsyncThunk(
	'circularizationBaseGenerationHeader/setStatus',
	async (data: any, { rejectWithValue }) => {
		try {
			const response = await api.setStatus(data);
			return response.data;
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
)

export const addCircularizationBaseGenerationHeader = createAsyncThunk(
	'circularizationBaseGenerationHeader/add',
	async (values: any, { rejectWithValue }) => {
		try {
			const response = await api.add((values));
			return response.data;
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);

export const fetchCircularizationBaseGenerationHeaderById = createAsyncThunk(
	'circularizationBaseGenerationHeader/fetchById',
	async ({ notPaginate, ...values }: any, { rejectWithValue, dispatch }) => {
		try {
			const response = await api.getById(values);
			!notPaginate && dispatch(actions.pagination.setPageCount(response.data.pageCount))
			return {
				...response.data,
				items: response.data.items.map((items: []) => items)
			}
		} catch (err: any) {
			return rejectWithValue({ error: err.response.data });
		}
	}
);

export const uploadFilesBaseGenerationHeader = createAsyncThunk(
	'circularizationBaseGenerationHeader/uploadFiles',
	async ({ circularizationBaseGenerationHeaderId, filesList, isMainFile }: any, { rejectWithValue }) => {
		try {
			const response = await api.uploadFiles(circularizationBaseGenerationHeaderId, filesList, isMainFile)
			return response.data
		} catch (err: any) {
			return rejectWithValue(err?.response?.data)
		}
	}
);

export const deleteFilesBaseGenerationHeader = createAsyncThunk(
	'circularizationBaseGenerationHeader/deleteFile',
	async (id: number, { rejectWithValue }) => {
		try {
			const response = await api.deleteFile(id);
			return response.data;
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);