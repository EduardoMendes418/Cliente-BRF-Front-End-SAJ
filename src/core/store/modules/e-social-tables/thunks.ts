import { createAsyncThunk } from '@reduxjs/toolkit';
import api from 'src/core/api/e-social-tables'
import { actions} from '../..';

export const fetchESocialTables = createAsyncThunk(
	'esocialtables/fetch',
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

export const fetchESocialTableById = createAsyncThunk(
	'esocialtables/fetch',
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

export const editESocialTables = createAsyncThunk(
	'esocialtables/edit',
	async (values: any, { rejectWithValue }) => {
		try {
			const response = await api.edit(values);
			return response;
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);

export const addESocialTables = createAsyncThunk(
	'esocialtables/add',
	async (values: any, { rejectWithValue }) => {
		try {
			const response = await api.add(values);
			return response
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);