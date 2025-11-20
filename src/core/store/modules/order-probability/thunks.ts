import { createAsyncThunk } from '@reduxjs/toolkit'

import api from 'src/core/api/order-probability'
import { TOrderProbability, TOrderProbabilityFilter } from 'src/core/models/order-probability';
import { actions, RootState } from '../..';
import { rejectNoValues } from 'src/core/utils/func'

export const fetchOrderProbabilities = createAsyncThunk(
	'orderProbability/fetch',
	async (values: TOrderProbabilityFilter, { rejectWithValue, dispatch }) => {
		try {
			const normalizedValues = rejectNoValues(values)
			const response = await api.getAll(normalizedValues);

			if (!values.notPaginate)
				dispatch(actions.pagination.setPageCount(response.data.pageCount))

			return response.data
		} catch (err: any) {
			return rejectWithValue({ error: err.response.data })
		}
	}
);

export const fetchByNameOrderProbability = createAsyncThunk(
	'orderProbability/fetch-by-name',
	async (values: TOrderProbabilityFilter, { rejectWithValue, dispatch }) => {
		try {
			const normalizedValues = rejectNoValues(values)
			const response = await api.getByName(normalizedValues);
			if (!values.notPaginate)
				dispatch(actions.pagination.setPageCount(response.data.pageCount))
			return response.data
		} catch (err: any) {
			return rejectWithValue({ error: err.response.data })
		}
	}
)

export const getOrderProbability = createAsyncThunk(
	'orderProbability/get',
	async (id: number, { getState }) => {
		const { orderProbability: { list } } = getState() as RootState
		const item = list.find((item) => item.id === id)
		if (item) return item

		const res = await api.get(id)
		return res.data
	}
);

export const addOrderProbability = createAsyncThunk(
	'orderProbability/add',
	async (values: TOrderProbability, { rejectWithValue }) => {
		try {
			const res = await api.add(values);
			return res.data
		} catch (err: any) {
			return rejectWithValue(err.response.data)
		}
	}
);

export const editOrderProbability = createAsyncThunk(
	'orderProbability/edit',
	async (values: TOrderProbability, { rejectWithValue }) => {
		try {
			const res = await api.edit(values);
			return res.data
		} catch (err: any) {
			return rejectWithValue(err.response.data)
		};
	}
)
