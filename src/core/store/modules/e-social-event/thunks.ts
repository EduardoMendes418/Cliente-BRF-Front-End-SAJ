import { createAsyncThunk } from '@reduxjs/toolkit';
import api from 'src/core/api/e-social-event'
import { actions} from '../..';

export const fetchESocialEvent = createAsyncThunk(
	'esocialevent/fetch',
	async ({ notPaginate, ...values }: any, { rejectWithValue, dispatch }) => {
		try {
			const response = await api.list({...values, notPaginate});
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

export const fetchESocialEventById = createAsyncThunk(
	'esocialevent/fetch',
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

export const editESocialEvent = createAsyncThunk(
	'esocialevent/edit',
	async (values: any, { rejectWithValue }) => {
		try {
			const response = await api.edit(values);
			return response;
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);

export const addESocialEvent = createAsyncThunk(
	'esocialevent/add',
	async (values: any, { rejectWithValue }) => {
		try {
			const response = await api.add(values);
			return response
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);