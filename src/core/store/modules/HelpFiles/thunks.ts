import { createAsyncThunk } from '@reduxjs/toolkit';
import api from 'src/core/api/help-files'
import { actions} from '../..';

export const fetchHelpFiles = createAsyncThunk(
	'helpFiles/fetch',
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

export const editHelpFiles = createAsyncThunk(
	'helpFiles/edit',
	async (values: any, { rejectWithValue }) => {
		try {
			const response = await api.edit(values);
			return response;
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);

export const addHelpFiles = createAsyncThunk(
	'helpFiles/add',
	async (values: any, { rejectWithValue }) => {
		try {
			const response = await api.add(values);
			return response
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);

export const fetchHelpFilesById = createAsyncThunk(
	'helpFiles/fetchById',
	async (id: number, { rejectWithValue }) => {

		try {
			const response = await api.getById(id);
			return response;
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);