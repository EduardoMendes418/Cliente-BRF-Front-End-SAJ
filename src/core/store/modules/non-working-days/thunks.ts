import { createAsyncThunk } from '@reduxjs/toolkit';
import { pathOr } from 'ramda'

import {
	TNonWorkingDays,
	TNonWorkingDaysFilters,
} from 'src/core/models/non-working-days';
import api from 'src/core/api/non-working-days';
import { RootState } from '../..';
import { ParamsGet } from 'src/core/models';
import { rejectNoValues } from 'src/core/utils/func';

export const fetchNonWorkingDays = createAsyncThunk(
	'nonWorkingDays/fetch',
	async (values: ParamsGet & TNonWorkingDaysFilters, { rejectWithValue }) => {
		try {
			const normalizedValues = rejectNoValues(values)
			const response = await api.list(normalizedValues);
			return response.data
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);

export const fetchMonthNonWorkingDays = createAsyncThunk(
	'nonWorkingDays/fetchMonth',
	async (currentYearMonth: [number, number], { rejectWithValue }) => {
		try {
			const year = currentYearMonth[0]
			const month = currentYearMonth[1]
			const response = await api.list({ year, month, page: 100 });
			return response.data
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);

export const getNonWorkingDays = createAsyncThunk(
	'nonWorkingDays/get',
	async (id: number | string, { getState }) => {
		const { nonWorkingDays: { list } } = getState() as RootState

		const item = list.find((item) => item.id === Number(id))
		if (item) return item

		const response = await api.list({ id });
		return pathOr({}, ['data', 'items', 0], response)
	}
);

export const addNonWorkingDays = createAsyncThunk(
	'nonWorkingDays/add',
	async (values: TNonWorkingDays, { rejectWithValue }) => {
		try {
			const response = await api.add(values);
			return response.data;
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);

export const editNonWorkingDays = createAsyncThunk(
	'nonWorkingDays/edit',
	async (values: TNonWorkingDays & { id: number }, { rejectWithValue }) => {
		try {
			const response = await api.edit(values)
			return response.data
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);

export const deleteNonWorkingDays = createAsyncThunk(
	'nonWorkingDays/delete',
	async (id: number, { rejectWithValue }) => {
		try {
			const response = await api.delete(id)
			return response.data
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);
