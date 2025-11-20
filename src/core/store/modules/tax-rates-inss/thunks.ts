import { createAsyncThunk } from '@reduxjs/toolkit';
import { pathOr } from 'ramda'

import {
	TTaxRatesINSS,
	TTaxRatesINSSFilters,
} from 'src/core/models/tax-rates-inss';
import api from 'src/core/api/tax-rates-inss';
import { ParamsGet } from 'src/core/models';
import { actions, RootState } from '../..';

export const fetchTaxRatesINSS = createAsyncThunk(
	'taxRatesINSS/fetch',
	async (values: ParamsGet & TTaxRatesINSSFilters, { rejectWithValue, dispatch }) => {
		try {
			const response = await api.list(values);
			dispatch(actions.pagination.setPageCount(response.data.pageCount))
			return response.data
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);

export const searchTaxRatesINSS = createAsyncThunk(
	'taxRatesINSS/search',
	async (searchPeriodDate: string, { rejectWithValue, dispatch }) => {
		try {
			const response = await api.list({ searchPeriodDate });
			return pathOr({}, ['data', 'items', 0], response)
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);

export const getTaxRatesINSS = createAsyncThunk(
	'taxRatesINSS/get',
	async (id: number, { getState }) => {
		const { taxRatesINSS: { list } } = getState() as RootState

		const item = list.find((item) => item.id === id)
		if (item) return item

		const response = await api.list({ id });
		return pathOr({}, ['data', 'items', 0], response)
	}
);

export const addTaxRatesINSS = createAsyncThunk(
	'taxRatesINSS/add',
	async (values: TTaxRatesINSS, { rejectWithValue }) => {
		try {
			const response = await api.add(values);
			return response.data;
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);

export const editTaxRatesINSS = createAsyncThunk(
	'taxRatesINSS/edit',
	async (values: TTaxRatesINSS, { rejectWithValue }) => {
		try {
			const response = await api.edit(values)
			return response.data
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);
