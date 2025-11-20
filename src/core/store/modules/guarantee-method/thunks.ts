import { createAsyncThunk } from '@reduxjs/toolkit';
import { pathOr } from 'ramda'

import { TGuaranteeMethod } from 'src/core/models/guarantee-method';
import api from 'src/core/api/guarantee-method';
import { actions, RootState } from '../..';
import { ParamsGet } from 'src/core/models';

export const fetchGuaranteeMethod = createAsyncThunk(
	'guaranteeMethod/fetch',
	async ({ id, page, pageSize, notPaginate }: ParamsGet, { rejectWithValue, dispatch }) => {
		try {
			const response = await api.list({
				id,
				page,
				pageSize,
			});
			!notPaginate && dispatch(actions.pagination.setPageCount(response.data.pageCount))
			return response.data
		} catch (err: any) {
			return rejectWithValue({ error: err.response.data });
		}
	}
);

export const getGuaranteeMethod = createAsyncThunk(
	'guaranteeMethod/get',
	async (id: number, { getState }) => {
		const { guaranteeMethod: { list } } = getState() as RootState

		const item = list.find((item) => item.id === id)
		if (item) return item

		const response = await api.list({ id });
		return pathOr({}, ['data', 'items', 0], response)
	}
);

export const addGuaranteeMethod = createAsyncThunk(
	'guaranteeMethod/add',
	async (values: TGuaranteeMethod, { rejectWithValue }) => {
		try {
			const response = await api.add(values);
			return response.data;
		} catch (err: any) {
			return rejectWithValue({ error: err.response.data });
		}
	}
);

export const editGuaranteeMethod = createAsyncThunk(
	'guaranteeMethod/edit',
	async (values: TGuaranteeMethod, { rejectWithValue }) => {
		try {
			const response = await api.edit(values);
			return response.data;
		} catch (err: any) {
			return rejectWithValue({ error: err.response.data });
		}
	}
);
