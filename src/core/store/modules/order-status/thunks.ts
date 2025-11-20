import { createAsyncThunk } from '@reduxjs/toolkit'

import api from 'src/core/api/order-status'
import { TOrderStatus, TOrderStatusFilter } from 'src/core/models/order-status';
import { actions, RootState } from '../..';
import { rejectNoValues } from 'src/core/utils/func'

export const fetchOrderStatuses = createAsyncThunk(
	'orderStatus/fetch',
	async (values: TOrderStatusFilter, { rejectWithValue, dispatch }) => {
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

export const fetchByNameOrderStatus = createAsyncThunk(
	'orderStatus/fetch-by-name',
	async (values: TOrderStatusFilter, { rejectWithValue, dispatch }) => {
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

export const getOrderStatus = createAsyncThunk(
	'orderStatus/get',
	async (id: number, { getState }) => {
		const { orderStatus: { list } } = getState() as RootState
		const item = list.find((item) => item.id === id)
		if (item) return item

		const res = await api.get(id)
		return res.data
	}
);

export const addOrderStatus = createAsyncThunk(
	'orderStatus/add',
	async (values: TOrderStatus, { rejectWithValue }) => {
		try {
			const res = await api.add(values);
			return res.data
		} catch (err: any) {
			return rejectWithValue(err.response.data)
		}
	}
);

export const editOrderStatus = createAsyncThunk(
	'orderStatus/edit',
	async (values: TOrderStatus, { rejectWithValue }) => {
		try {
			const res = await api.edit(values);
			return res.data
		} catch (err: any) {
			return rejectWithValue(err.response.data)
		};
	}
)

