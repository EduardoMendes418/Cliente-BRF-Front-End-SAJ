import { createAsyncThunk } from '@reduxjs/toolkit';

import api from 'src/core/api/requestLog';
import { actions } from '../..';

import { handleJSONError, rejectNoValues } from 'src/core/utils/func';

export const fetchRequestLog = createAsyncThunk(
	'requestLog/fetch',
	async (values: any, { rejectWithValue, dispatch }) => {
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

export const fetchLogDataFromReport = createAsyncThunk(
	'requestLog/fetch',
	async (_, { rejectWithValue }) => {
		try {
		
			const response = await api.listLogData();

			return response.data
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);

export const getReport = createAsyncThunk(
	"requestLog/get-report",
	async (params: any, { rejectWithValue }) => {
		try {
			
			const filter = rejectNoValues(params);

			const response = await api.getReport(filter as any)
			return response.data
		} catch (error) {
			return rejectWithValue(handleJSONError(error));
		}
	}
);