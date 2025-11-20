import { createAsyncThunk } from '@reduxjs/toolkit';
import api from 'src/core/api/e-social-registration-table'
import { actions} from '../..';

export const fetchESocialRegistrationTable = createAsyncThunk(
	'esocialregistrationtable/fetch',
	async ({ notPaginate, page, pageSize, ...values }: any, { rejectWithValue, dispatch }) => {
		try {
			const response = await api.list(values, page, pageSize, notPaginate);
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

export const fetchESocialRegistrationTableById = createAsyncThunk(
	'esocialregistrationtable/fetch',
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

export const editESocialRegistrationTable = createAsyncThunk(
	'esocialregistrationtable/edit',
	async (values: any, { rejectWithValue }) => {
		try {
			const response = await api.edit(values);
			return response;
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);

export const addESocialRegistrationTable = createAsyncThunk(
	'esocialregistrationtable/add',
	async (values: any, { rejectWithValue }) => {
		try {
			const response = await api.add(values);
			return response
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);

export const fetchStatesESocialTable = createAsyncThunk(
	'esocialregistrationtable/fetchStates',
	async (_, { rejectWithValue }) => {
		try {
			const response = await api.getStates();
			return response.data;
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);

export const fetchCitiesByStateESocialTable = createAsyncThunk(
	'esocialregistrationtable/fetchCitiesByState',
	async (startsWithCode: string, { rejectWithValue }) => {
		try {
			const response = await api.getCitiesByState(startsWithCode);
			
			return response.data?.map((resp: any) => {
				return {
					...resp,
					stateId: Number(startsWithCode)
				}
			});
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);

