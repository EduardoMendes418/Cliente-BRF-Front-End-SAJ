import { createAsyncThunk } from '@reduxjs/toolkit';

import api from 'src/core/api/license-type';
import { TLicenseType, TLicenseFilter } from 'src/core/models/license-type';

import { actions, RootState } from '../..';

export const fetchLicenseType = createAsyncThunk(
	'licenseType/fetch',
	async ({ id, page, pageSize, notPaginate, description }: TLicenseFilter, { rejectWithValue, dispatch }) => {
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

export const getLicenseType = createAsyncThunk(
	'licenseType/get',
	async (id: number, { getState }) => {
		const { licenseType: { list } } = getState() as RootState

		const item = list.find((item) => item.id === id)
		if (item) return item

		const response = await api.get(id);
		return response.data
	}
);

export const addLicenseType = createAsyncThunk(
	'licenseType/add',
	async (description: string, { rejectWithValue }) => {
		try {
			const response = await api.add(description);
			return response.data;
		} catch (err: any) {
			return rejectWithValue({ error: err.response.data });
		}
	}
);

export const editLicenseType = createAsyncThunk(
	'licenseType/edit',
	async (values: TLicenseType, { rejectWithValue }) => {
		try {
			const response = await api.edit(values);
			return response.data;
		} catch (err: any) {
			return rejectWithValue({ error: err.response.data });
		}
	}
);