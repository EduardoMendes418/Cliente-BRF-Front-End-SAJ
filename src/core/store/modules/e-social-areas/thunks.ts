import { createAsyncThunk } from '@reduxjs/toolkit';
import api from 'src/core/api/e-social-areas';
import { TESocialPayload } from './types';
import { actions } from '../..';

export const fetchESocialAreasGridList = createAsyncThunk(
	'esocialevent/fetchESocialAreasGridList',
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

export const fetchESocialAreasListById = createAsyncThunk(
	'esocialAreas/listById',
	async ({ id }: { id: string }, { rejectWithValue }) => {
		try {
			const { data } = await api.listById(id);
			return data
		} catch (err: any) {
			return rejectWithValue({ error: err.response.data });
		}
	}
);

export const fetchESocialAreasCreate = createAsyncThunk(
	'esocialAreas/add',
	async (values: TESocialPayload, { rejectWithValue }) => {
		try {
			const { data } = await api.add(values);
			return data;
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);

export const fetchESocialAreasUpdate = createAsyncThunk(
	'esocialAreas/update',
	async (values: TESocialPayload, { rejectWithValue }) => {
		try {
			const { data } = await api.edit(values);
			return data;
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);

export const fetchESocialAreasDelete = createAsyncThunk(
	'esocialAreas/delete',
	async ({ id }: { id: number }, { rejectWithValue }) => {
		try {
			const { data } = await api.delete(id);
			return data;
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);
