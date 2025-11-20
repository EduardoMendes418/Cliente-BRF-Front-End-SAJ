import { createAsyncThunk } from '@reduxjs/toolkit'

import api from 'src/core/api/order-expectation'
import { TOrderExpectation, TOrderExpectationFilter } from 'src/core/models/order-expectation'
import { actions, RootState } from '../..'
import { rejectNoValues } from 'src/core/utils/func'

export const fetchOrderExpectations = createAsyncThunk(
	'orderExpectation/fetch',
	async (values: TOrderExpectationFilter, { rejectWithValue, dispatch }) => {
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
)

export const fetchByNameOrderExpectation = createAsyncThunk(
	'orderExpectation/fetch-by-name',
	async (values: TOrderExpectationFilter, { rejectWithValue, dispatch }) => {
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

export const getOrderExpectation = createAsyncThunk(
	'orderExpectation/get',
	async (id: number, { getState }) => {
		const { orderExpectation: { list } } = getState() as RootState
		const item = list.find((item) => item.id === id)
		if (item) return item

		const res = await api.get(id)
		return res.data
	}
);

export const addOrderExpectation = createAsyncThunk(
	'orderExpectation/add',
	async (values: TOrderExpectation, { rejectWithValue }) => {
		try {
			const res = await api.add(values);
			return res.data
		} catch (err: any) {
			return rejectWithValue(err.response.data)
		}
	}
);

export const editOrderExpectation = createAsyncThunk(
	'orderExpectation/edit',
	async (values: TOrderExpectation, { rejectWithValue }) => {
		try {
			const res = await api.edit(values);
			return res.data
		} catch (err: any) {
			return rejectWithValue(err.response.data)
		};
	}
)
