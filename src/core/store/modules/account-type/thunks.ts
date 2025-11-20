import { createAsyncThunk } from '@reduxjs/toolkit';

import api from 'src/core/api/account-type';
import { TAccountType, TAccountTypeFilter } from 'src/core/models/account-type';

import { actions, RootState } from '../..';
import { rejectNoValues } from 'src/core/utils/func';

export const fetchAccountType = createAsyncThunk(
	'accountType/fetch',
	async ({ id, page, pageSize, notPaginate, description }: TAccountTypeFilter, { rejectWithValue, dispatch }) => {
		try {
			const normalizedValues = rejectNoValues({
				id,
				page,
				pageSize,
				notPaginate,
				description
			}) as TAccountTypeFilter;
			const response = await api.list(normalizedValues);
			!notPaginate && dispatch(actions.pagination.setPageCount(response.data.pageCount))
			return response.data
		} catch (err: any) {
			return rejectWithValue({ error: err.response.data });
		}
	}
)

export const getAccountType = createAsyncThunk(
	'accountType/get',
	async (id: number, { getState }) => {
		const { accountType: { list } } = getState() as RootState

		const item = list.find((item) => item.id === id)
		if (item) return item

		const response = await api.get(id);
		return response.data
	}
);

export const addAccountType = createAsyncThunk(
	'accountType/add',
	async (values: TAccountType, { rejectWithValue }) => {
		try {
			const response = await api.add(values);
			return response.data;
		} catch (err: any) {
			return rejectWithValue({ error: err.response.data });
		}
	}
);

export const editAccountType = createAsyncThunk(
	'accountType/edit',
	async (values: TAccountType, { rejectWithValue }) => {
		try {
			const response = await api.edit(values);
			return response.data;
		} catch (err: any) {
			return rejectWithValue({ error: err.response.data });
		}
	}
);