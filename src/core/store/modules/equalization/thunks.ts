import { createAsyncThunk } from '@reduxjs/toolkit';
import { pathOr } from 'ramda';

import api from 'src/core/api/equalization';
import { TEqualizationParams } from 'src/core/models/equalization';
import { actions, RootState } from '../..';

export const fetchEqualizationList = createAsyncThunk(
	'equalization/fetch',
	async (values: TEqualizationParams, { rejectWithValue, dispatch }) => {
		try {
			const response = await api.list(values);
			dispatch(actions.pagination.setPageCount(response.data.pageCount))
			return response.data
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);

export const fetchEqualizationById = createAsyncThunk(
	'equalization/fetchById',
	async (id: number, { getState, rejectWithValue }) => {
		try {
			const { equalization: { list } } = getState() as RootState;

			const item = list.find((item) => item.id === id);
			if (item) return item;

			const response = await api.getById(id);
			return pathOr({}, ['data', 'items', 0], response);
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);
