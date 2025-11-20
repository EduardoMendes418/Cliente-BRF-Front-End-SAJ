import { createAsyncThunk } from '@reduxjs/toolkit';

import api from 'src/core/api/interest-update';
import { TInterestUpdate, TAddInterestUpdate, TInterestUpdateFilter } from 'src/core/models/interest-update';

import { actions, RootState } from '../..';

export const fetchInterestUpdate = createAsyncThunk(
	'interestUpdate/fetch',
	async (filter: TInterestUpdateFilter, { rejectWithValue, dispatch }) => {
		try {
			const response = await api.get(filter);
			dispatch(actions.pagination.setPageCount(response.data.pageCount))
			return response.data
		} catch (err: any) {
			return rejectWithValue({ error: err.response.data });
		}
	}
)

export const fetchItemInterestUpdate = createAsyncThunk(
	'interestUpdate/getItem',
	async (id: number, { getState, rejectWithValue }) => {
		const { interestUpdate: { list } } = getState() as RootState

		const item = list.find((item) => item.id === id)
		if (item) return item

		try {
			const response = await api.get({ id });
			return response.data?.items?.[0]
		} catch (err: any) {
			return rejectWithValue({ error: err.response.data });
		}
	}
);

export const addInterestUpdate = createAsyncThunk(
	'interestUpdate/add',
	async (interestUpdate: TAddInterestUpdate, { rejectWithValue }) => {
		try {
			const response = await api.add(interestUpdate);
			return response.data;
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);

export const editInterestUpdate = createAsyncThunk(
	'interestUpdate/edit',
	async (values: TInterestUpdate, { rejectWithValue }) => {
		try {
			const response = await api.edit(values);
			return response.data;
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);

export const deleteInterestUpdate = createAsyncThunk(
	'interestUpdate/delete',
	async (values: TInterestUpdate, { rejectWithValue }) => {
		try {
			const response = await api.delete(values);
			return response.data;
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);