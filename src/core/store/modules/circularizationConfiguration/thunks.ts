import { createAsyncThunk } from '@reduxjs/toolkit';
import api from 'src/core/api/circularizationConfiguration'
import { actions} from '../..';

export const fetchCircularizationConfiguration = createAsyncThunk(
	'circularizationConfiguration/fetch',
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

export const editCircularizationConfiguration = createAsyncThunk(
	'circularizationConfiguration/edit',
	async (values: any, { rejectWithValue }) => {
		try {
			const response = await api.edit(values);
			return response;
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);

export const addCircularizationConfiguration = createAsyncThunk(
	'circularizationConfiguration/add',
	async (values: any, { rejectWithValue }) => {
		try {
			const response = await api.add(values);
			return response
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);