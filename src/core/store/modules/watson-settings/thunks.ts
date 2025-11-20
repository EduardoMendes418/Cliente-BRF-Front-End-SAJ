import { createAsyncThunk } from '@reduxjs/toolkit';
import { pathOr } from 'ramda'

import api from '../../../api/watson-settings';
import { TWatsonParameters } from '../../../models/watson';
import { RootState } from '../..';

export const fetchWatsonSettings = createAsyncThunk(
	'watsonSettings/fetch',
	async (_, { rejectWithValue, dispatch }) => {
		try {
			const response = await api.list();
			return response.data
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);
export const getWatsonSettings = createAsyncThunk(
	'watsonSettings/get',
	async (id: number | string, { getState }) => {
		const { watsonSettings: { list } } = getState() as RootState

		const item = list.find((item) => item.id === Number(id))
		if (item) return item

		const response = await api.list(Number(id));
		return pathOr({}, ['data', 'items', 0], response)
	}
);

export const addWatsonSettings = createAsyncThunk(
	'watsonSettings/add',
	async (values: TWatsonParameters, { rejectWithValue }) => {
		try {
			const response = await api.add(values);
			return response.data;
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);