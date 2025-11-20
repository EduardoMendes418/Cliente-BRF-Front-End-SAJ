import { createAsyncThunk } from '@reduxjs/toolkit';
import api from 'src/core/api/order-rating';

import { TOrderRatingDescription, TOrderRatingDescriptionFilter } from 'src/core/models/order-rating-description';

import { actions, RootState } from '../..';
import { rejectNoValues } from 'src/core/utils/func'

export const fetchOrderRatingDescriptions = createAsyncThunk(
	'orderRatingDescription/fetch',
	async (values: TOrderRatingDescriptionFilter, { rejectWithValue, dispatch }) => {
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

export const fetchByNameOrderRatingDescription = createAsyncThunk(
	'orderRatingDescription/fetch-by-name',
	async (values: TOrderRatingDescriptionFilter, { rejectWithValue, dispatch }) => {
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

export const getOrderRatingDescription = createAsyncThunk(
	'orderRatingDescription/get',
	async (id: number, { getState }) => {
		const { orderRatingDescription: { list } } = getState() as RootState

		const item = list.find((item) => item.id === id)
		if (item) return item

		const res = await api.get(id)
		return res.data
	}
);

export const addOrderRatingDescription = createAsyncThunk(
	'orderRatingDescription/add',
	async (values: TOrderRatingDescription, { rejectWithValue }) => {
		try {
			const res = await api.add(values);
			return res.data
		} catch (err: any) {
			return rejectWithValue({ error: err.res.data })
		}
	}
);

export const editOrderRatingDescription = createAsyncThunk(
	'orderRatingDescription/edit',
	async (values: TOrderRatingDescription, { rejectWithValue }) => {
		try {
			const res = await api.edit(values);
			return res.data
		} catch (err: any) {
			return rejectWithValue({ error: err.res.data })
		};
	}
);
