import { createAsyncThunk } from '@reduxjs/toolkit';

import api from 'src/core/api/release-type';
import { TReleaseType, TReleaseTypeFilter } from 'src/core/models/release-type';

import { actions, RootState } from '../..';
import { rejectNoValues } from 'src/core/utils/func';

export const fetchReleaseType = createAsyncThunk(
	'releaseType/fetch',
	async ({ id, page, pageSize, notPaginate, description }: TReleaseTypeFilter, { rejectWithValue, dispatch }) => {
		try {
			const normalizedValues = rejectNoValues({
				id,
				page,
				pageSize,
				description
			}) as TReleaseTypeFilter;
			const response = await api.list(normalizedValues);
			!notPaginate && dispatch(actions.pagination.setPageCount(response.data.pageCount))
			return response.data
		} catch (err: any) {
			return rejectWithValue({ error: err.response.data });
		}
	}
)

export const getReleaseType = createAsyncThunk(
	'releaseType/get',
	async (id: number, { getState }) => {
		const { releaseType: { list } } = getState() as RootState

		const item = list.find((item) => item.id === id)
		if (item) return item

		const response = await api.get(id);
		return response.data
	}
);

export const addReleaseType = createAsyncThunk(
	'releaseType/add',
	async (values: TReleaseType, { rejectWithValue }) => {
		try {
			const response = await api.add(values);
			return response.data;
		} catch (err: any) {
			return rejectWithValue({ error: err.response.data });
		}
	}
);

export const editReleaseType = createAsyncThunk(
	'releaseType/edit',
	async (values: TReleaseType, { rejectWithValue }) => {
		try {
			const response = await api.edit(values);
			return response.data;
		} catch (err: any) {
			return rejectWithValue({ error: err.response.data });
		}
	}
);