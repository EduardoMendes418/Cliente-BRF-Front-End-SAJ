import { createAsyncThunk } from '@reduxjs/toolkit';

import api from 'src/core/api/guarantee-type';
import { TGuaranteeType, TGuaranteeFilter } from 'src/core/models/guarantee-type';

import { actions, RootState } from '../..';

export const fetchGuaranteeType = createAsyncThunk(
	'guaranteeType/fetch',
	async ({ id, page, pageSize, notPaginate, description }: TGuaranteeFilter, { rejectWithValue, dispatch }) => {
		try {
			const response = await api.list({
				id,
				page,
				pageSize,
				description
			});
			!notPaginate && dispatch(actions.pagination.setPageCount(response.data.pageCount))
			return response.data
		} catch (err: any) {
			return rejectWithValue({ error: err.response.data });
		}
	}
)

export const getGuaranteeType = createAsyncThunk(
	'guaranteeType/get',
	async (id: number, { getState }) => {
		const { guaranteeType: { list } } = getState() as RootState

		const item = list.find((item) => item.id === id)
		if (item) return item

		const response = await api.get(id);
		return response.data
	}
);

export const addGuaranteeType = createAsyncThunk(
	'guaranteeType/add',
	async (item: TGuaranteeType, { rejectWithValue }) => {
		try {
			const response = await api.add(item);
			return response.data;
		} catch (err: any) {
			return rejectWithValue({ error: err.response.data });
		}
	}
);

export const editGuaranteeType = createAsyncThunk(
	'guaranteeType/edit',
	async (values: TGuaranteeType, { rejectWithValue }) => {
		try {
			const response = await api.edit(values);
			return response.data;
		} catch (err: any) {
			return rejectWithValue({ error: err.response.data });
		}
	}
);