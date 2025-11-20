import { createAsyncThunk } from '@reduxjs/toolkit';
import { pathOr } from 'ramda'

import {
	TRequestParameters,
	TRequestParametersFilters,
} from 'src/core/models/request-parameters';
import api from 'src/core/api/request-parameters';
import { actions, RootState } from '../..';
import { ParamsGet } from 'src/core/models';
import { rejectNoValues } from 'src/core/utils/func';

export const fetchRequestParameters = createAsyncThunk(
	'requestParameters/fetch',
	async (values: ParamsGet & TRequestParametersFilters, { rejectWithValue, dispatch }) => {
		try {
			const normalizedValues = rejectNoValues(values)
			const response = await api.list(normalizedValues);

			if (!values.notPaginate)
				dispatch(actions.pagination.setPageCount(response.data.pageCount))
				
			return response.data
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);

export const getRequestParameters = createAsyncThunk(
	'requestParameters/get',
	async (id: number | string, { getState }) => {
		const { requestParameters: { list } } = getState() as RootState

		const item = list.find((item) => item.id === Number(id))
		if (item) return item

		const response = await api.list({ id });
		return pathOr({}, ['data', 'items', 0], response)
	}
);

export const addRequestParameters = createAsyncThunk(
	'requestParameters/add',
	async ({ countDeadline, ...values }: TRequestParameters, { rejectWithValue }) => {
		try {
			const normalizedValues = { ...values, countDeadline: countDeadline ? countDeadline : 0 }
			const response = await api.add(normalizedValues);
			return response.data;
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);

export const editRequestParameters = createAsyncThunk(
	'requestParameters/edit',
	async ({ id, countDeadline, ...values }: TRequestParameters, { rejectWithValue }) => {
		try {
			const normalizedValues = { ...values, countDeadline: countDeadline ? countDeadline : 0 }
			const response = await api.edit({ ...normalizedValues, id: Number(id) })
			return response.data
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);
