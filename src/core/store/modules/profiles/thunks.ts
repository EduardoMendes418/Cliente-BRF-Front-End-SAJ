import { createAsyncThunk } from '@reduxjs/toolkit';
import { pathOr } from 'ramda'

import {
	TProfiles,
	TProfilesFilters,
} from 'src/core/models/profiles';
import api from 'src/core/api/profiles';
import { actions, RootState } from '../..';
import { ParamsGet } from 'src/core/models';
import { getAxiosError, rejectNoValues } from 'src/core/utils/func';

type Params = ParamsGet & TProfilesFilters & {
	notPaginate?: boolean;
};

export const fetchProfiles = createAsyncThunk(
	'profiles/fetch',
	async ({ notPaginate, ...values }: Params, { rejectWithValue, dispatch }) => {
		try {
			const normalizedValues = rejectNoValues(values)
			const response = await api.list(normalizedValues);
			!notPaginate && dispatch(actions.pagination.setPageCount(response.data.pageCount))
			return response.data
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);

export const getProfiles = createAsyncThunk(
	'profiles/get',
	async (id: number | string, { getState }) => {
		const { profiles: { list } } = getState() as RootState
		const item = list.find((item) => item.id === Number(id))
		if (item) return item

		const response = await api.list({ id });
		return pathOr({}, ['data', 'items', 0], response)
	}
);

export const addProfiles = createAsyncThunk(
	'profiles/add',
	async (values: TProfiles, { rejectWithValue }) => {
		try {
			const response = await api.add(values);
			return response.data;
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);

export const editProfiles = createAsyncThunk(
	'profiles/edit',
	async ({ id, ...values }: TProfiles, { rejectWithValue }) => {
		try {
			const response = await api.edit({ ...values, id: Number(id) })
			return response.data
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);

export const getProfileReport = createAsyncThunk('profiles/getReport', async (filters: TProfilesFilters, {rejectWithValue}) => {
	try {
		const normalizeFilter = rejectNoValues(filters);
		const response = await api.report(normalizeFilter);
		return response.data;
	} catch (err: any) {
		const axiosError = getAxiosError(err);
		return rejectWithValue(axiosError?.response?.data);
	}
})
