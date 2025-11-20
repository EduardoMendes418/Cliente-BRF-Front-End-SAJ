import { createAsyncThunk } from '@reduxjs/toolkit';
import api from 'src/core/api/e-social-new-employer';
import { actions } from '../..';
import { TESocialNewEmployerGridList } from 'src/core/models/e-social-new-employer';

export const fetchESocialClosureEmployer = createAsyncThunk(
	'eSocialClosure/fetchESocialClosureEmployer',
	async ({ notPaginate, ...values }: any, { rejectWithValue, dispatch }) => {
		try {
			const { data } = await api.list(values);
			!notPaginate && dispatch(actions.pagination.setPageCount(data.pageCount))
			return {
				...data,
				items: data.items.map((items: []) => items)
			}
		} catch (err: any) {
			return rejectWithValue({ error: err.response.data });
		}
	}
);

export const fetchESocialClosureEmployerListById = createAsyncThunk(
	'eSocialClosure/listById',
	async ({ id }: { id: number }, { rejectWithValue }) => {
		try {
			const { data } = await api.listById(id);
			return data
		} catch (err: any) {
			return rejectWithValue({ error: err.response.data });
		}
	}
);

export const fetchESocialClosureEmployerCreate = createAsyncThunk(
	'eSocialClosure/add',
	async (values: TESocialNewEmployerGridList/* TESocialPayload */, { rejectWithValue }) => {
		try {
			const response = await api.add(values);
			return response;
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);

export const fetchESocialClosureEmployerUpdate = createAsyncThunk(
	'eSocialClosure/update',
	async (values: TESocialNewEmployerGridList, { rejectWithValue }) => {
		try {
			const response = await api.edit(values);
			return response;
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);

export const fetchESocialClosureEmployerDelete = createAsyncThunk(
	'eSocialClosure/delete',
	async ({ id }: { id: number }, { rejectWithValue }) => {
		try {
			const { data } = await api.delete(id);
			return data;
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);