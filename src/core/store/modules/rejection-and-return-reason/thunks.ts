import { createAsyncThunk } from '@reduxjs/toolkit';
import { pathOr } from 'ramda';

import api from 'src/core/api/rejection-and-return-reason';
import { TRejectionAndReturnReason, TRejectionAndReturnReasonParams } from 'src/core/models/rejection-and-return-reason';

import { actions, RootState } from '../..';

export const fetchRejectionAndReturnReasonList = createAsyncThunk(
	'rejectionAndReturnReason/fetch',
	async (values: TRejectionAndReturnReasonParams, { rejectWithValue, dispatch }) => {
		try {
			const response = await api.list(values);

			if (!values.notPaginate)
				dispatch(actions.pagination.setPageCount(response.data.pageCount))

			return response.data
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);

export const fetchRejectionAndReturnReasonById = createAsyncThunk(
	'rejectionAndReturnReason/fetchById',
	async (id: number, { rejectWithValue, getState }) => {
		try {
			const { rejectionAndReturnReason: { list } } = getState() as RootState;

			const item = list.find((item) => item.id === id);
			if (item) return item;
			
			const response = await api.getById(id);
			return pathOr({}, ['data', 'items', 0], response);
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);

export const addRejectionAndReturnReason = createAsyncThunk(
	'rejectionAndReturnReason/add',
	async (values: TRejectionAndReturnReason, { rejectWithValue }) => {
		try {
			const response = await api.add(values);
			return response.data;
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);

export const editRejectionAndReturnReason = createAsyncThunk(
	'rejectionAndReturnReason/edit',
	async (values: TRejectionAndReturnReason & { id: number }, { rejectWithValue }) => {
		try {
			const response = await api.edit(values);
			return response.data;
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);
