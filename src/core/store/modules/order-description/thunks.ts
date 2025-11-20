import { createAsyncThunk } from '@reduxjs/toolkit';
import api from 'src/core/api/order-description';

import { TOrderDescription, TOrderDescriptionFilter } from 'src/core/models/order-description';

import { rejectNoValues } from 'src/core/utils/func'
import { actions, RootState } from '../..';

export const fetchOrderDescriptions = createAsyncThunk(
	'orderDescription/fetch',
	async (values: TOrderDescriptionFilter, { rejectWithValue, dispatch }) => {
		try {
			const normalizedValues = rejectNoValues(values)
			const response = await api.getAll(normalizedValues);

			if (!values.notPaginate) {
				dispatch(actions.pagination.setPageCount(response.data.pageCount))
				return response.data;
			}

			return {items: response.data}
		} catch (err: any) {
			return rejectWithValue({ error: err.response.data })
		}
	}
)

export const fetchByNameOrderDescription = createAsyncThunk(
	'orderDescription/fetch-by-name',
	async (values: TOrderDescriptionFilter, { rejectWithValue, dispatch }) => {
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

export const getOrderDescription = createAsyncThunk(
	'orderDescription/get',
	async (id: number, { getState }) => {
		const { orderDescription: { list } } = getState() as RootState

		const item = list.find((item) => item.id === id)
		if (item) return item

		const res = await api.get(id)
		return res.data
	}
);

export const addOrderDescription = createAsyncThunk(
	'orderDescription/add',
	async (values: TOrderDescription, { rejectWithValue }) => {
		try {
			const res = await api.add(values);
			return res.data
		} catch (err: any) {
			return rejectWithValue({ error: err.response.data })
		}
	}
);

export const editOrderDescription = createAsyncThunk(
	'orderRatingDescription/edit',
	async (values: TOrderDescription, { rejectWithValue }) => {
		try {
			const res = await api.edit(values);
			return res.data
		} catch (err: any) {
			return rejectWithValue({ error: err.response.data })
		};
	}
); 