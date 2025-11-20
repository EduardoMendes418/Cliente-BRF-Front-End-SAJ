import { createAsyncThunk } from '@reduxjs/toolkit';
import { pathOr } from 'ramda'

import {
	TEconomicIndices,
	TEconomicIndicesFilters,
} from 'src/core/models/economic-indices';
import api from 'src/core/api/economic-indices';
import { actions, RootState } from '../..';
import { ParamsGet } from 'src/core/models';
import { rejectNoValues } from 'src/core/utils/func';

export const fetchEconomicIndices = createAsyncThunk(
	'economicIndices/fetch',
	async (values: ParamsGet & TEconomicIndicesFilters, { rejectWithValue, dispatch }) => {
		try {
			const normalizedValues = rejectNoValues(values)
			const response = await api.list(normalizedValues);

			if (!values.notPaginate)
				dispatch(actions.pagination.setPageCount(response.data.pageCount))

			return response.data
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);

export const getEconomicIndices = createAsyncThunk(
	'economicIndices/get',
	async (id: number | string, { getState }) => {
		const { economicIndices: { list } } = getState() as RootState

		const item = list.find((item) => item.id === Number(id))
		if (item) return item

		const response = await api.list({ id });
		return pathOr({}, ['data', 'items', 0], response)
	}
);

export const addEconomicIndices = createAsyncThunk(
	'economicIndices/add',
	async ({ ...values }: TEconomicIndices, { rejectWithValue }) => {
		try {
			const normalizedValues = { ...values }
			const response = await api.add(normalizedValues);
			return response.data;
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);

export const editEconomicIndices = createAsyncThunk(
	'economicIndices/edit',
	async ({ id, ...values }: TEconomicIndices, { rejectWithValue }) => {
		try {
			const normalizedValues = { ...values }
			const response = await api.edit({ ...normalizedValues, id: Number(id) })
			return response.data
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);
