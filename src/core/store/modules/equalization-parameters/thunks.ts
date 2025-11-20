import { createAsyncThunk } from '@reduxjs/toolkit';
import { pathOr } from 'ramda';

import api from 'src/core/api/equalization-parameters';
import { renameFilterProps, TEqualizationParameters, TEqualizationParametersParams } from 'src/core/models/equalization-parameters';
import { renameKeys } from 'src/core/utils/func';
import { actions, RootState } from '../..';

export const fetchEqualizationParametersList = createAsyncThunk(
	'equalizationParameters/fetch',
	async (values: TEqualizationParametersParams, { rejectWithValue, dispatch }) => {
		try {
			const filters = renameKeys(renameFilterProps)(values);
			const response = await api.list(filters);

			if (!values.notPaginate)
				dispatch(actions.pagination.setPageCount(response.data.pageCount))

			return response.data
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);

export const fetchEqualizationParametersById = createAsyncThunk(
	'equalizationParameters/fetchById',
	async (id: number, { getState, rejectWithValue }) => {
		try {
			const { equalizationParameters: { list } } = getState() as RootState;

			const item = list.find((item) => item.id === id);
			if (item) return item;

			const response = await api.getById(id);
			return pathOr({}, ['data', 'items', 0], response);
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);

export const addEqualizationParameters = createAsyncThunk(
	'equalizationParameters/add',
	async (values: TEqualizationParameters, { rejectWithValue }) => {
		try {
			const response = await api.add(values);
			return response.data;
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);

export const editEqualizationParameters = createAsyncThunk(
	'equalizationParameters/edit',
	async (values: TEqualizationParameters & { id: number }, { rejectWithValue }) => {
		try {
			const response = await api.edit(values)
			return response.data
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);

export const runEqualization = createAsyncThunk(
	'equalizationParameters/runEqualization',
	async (requestParametersIds: number[], { rejectWithValue, dispatch }) => {
		try {
			const response = await api.runEqualization(requestParametersIds);
			return response.data
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);
