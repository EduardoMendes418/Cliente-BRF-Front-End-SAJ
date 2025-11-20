import { createAsyncThunk } from '@reduxjs/toolkit';
import { pathOr } from 'ramda'

import {
	TIncomeTaxRates,
	TIncomeTaxRatesFilters,
} from 'src/core/models/income-tax-rates';
import api from 'src/core/api/income-tax-rates';
import { actions, RootState } from '../..';
import { ParamsGet } from 'src/core/models';

export const fetchIncomeTaxRates = createAsyncThunk(
	'incomeTaxRates/fetch',
	async (values: ParamsGet & TIncomeTaxRatesFilters, { rejectWithValue, dispatch }) => {
		try {
			const response = await api.list(values);
			dispatch(actions.pagination.setPageCount(response.data.pageCount))
			return response.data
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);

export const searchIncomeTaxRates = createAsyncThunk(
	'incomeTaxRates/search',
	async (searchPeriodDate: string, { rejectWithValue, dispatch }) => {
		try {
			const response = await api.list({ searchPeriodDate });
			return pathOr({}, ['data', 'items', 0], response)
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);

export const getIncomeTaxRates = createAsyncThunk(
	'incomeTaxRates/get',
	async (id: number, { getState }) => {
		const { incomeTaxRates: { list } } = getState() as RootState

		const item = list.find((item) => item.id === id)
		if (item) return item

		const response = await api.list({ id });
		return pathOr({}, ['data', 'items', 0], response)
	}
);

export const addIncomeTaxRates = createAsyncThunk(
	'incomeTaxRates/add',
	async (values: TIncomeTaxRates, { rejectWithValue }) => {
		try {
			const response = await api.add(values);
			return response.data;
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);

export const editIncomeTaxRates = createAsyncThunk(
	'incomeTaxRates/edit',
	async (values: TIncomeTaxRates, { rejectWithValue }) => {
		try {
			const response = await api.edit(values)
			return response.data
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);
