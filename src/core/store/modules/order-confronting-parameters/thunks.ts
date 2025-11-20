import { createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../..';

import { TOrderConfrontingType, TOrderConfrontingFilter, renameProps } from 'src/core/models/confronting-parameters';
import api from 'src/core/api/confronting-parameters';

import { renameKeys } from 'src/core/utils/func';

export const fetchOrderConfrontings = createAsyncThunk(
	'orderConfrontingParameters/fetch',
	async (params: TOrderConfrontingFilter, { rejectWithValue }) => {
		try {
			const response = await api.getAll(params)
			return response.data
		} catch (err: any) {
			return rejectWithValue({ error: err.response.data })
		}
	}
)

export const getOrderConfronting = createAsyncThunk(
	'orderConfrontingParameters/get',
	async (id: number, { getState }) => {
		const { orderConfrontingParameters: { list } } = getState() as RootState
		const item = list.find((item) => item.id === id)
		if (item) return item

		const res = await api.get(id)
		return res.data
	}
);

export const addOrderConfronting = createAsyncThunk(
	'orderConfrontingParameters/add',
	async (values: TOrderConfrontingType, { rejectWithValue }) => {
		try {
			const normalizedValues = renameKeys(renameProps, true)(values)
			const response = await api.add(normalizedValues);
			return response.data;
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);

export const editOrderConfronting = createAsyncThunk(
	'orderConfrontingParameters/edit',
	async (values: TOrderConfrontingType, { rejectWithValue }) => {
		const normalizedValues = renameKeys(renameProps, true)(values)
		try {
			const response = await api.edit(normalizedValues);
			return response.data;
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);

export const deleteOrderConfronting = createAsyncThunk(
	'orderConfrontingParameters/delete',
	async (id: number, { rejectWithValue }) => {
		try {
			const response = await api.delete(id.toString());
			return response.data;
		} catch (err: any) {
			return rejectWithValue({ id, error: err.response.data });
		}
	},
);