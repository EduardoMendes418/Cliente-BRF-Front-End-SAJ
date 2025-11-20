import { createAsyncThunk } from '@reduxjs/toolkit';
import api from 'src/core/api/circularizationBaseGeneration'
import { actions} from '../..';

export const fetchCircularizationBaseGeneration = createAsyncThunk(
	'circularizationBaseGeneration/fetch',
	async ({ notPaginate, ...values }: any, { rejectWithValue, dispatch }) => {

		try {
			const response = await api.list(values);
			!notPaginate && dispatch(actions.pagination.setPageCount(response.data.pageCount))
			return {
				...response.data,
				items: response.data.items.map((items: []) => items)
			}
		} catch (err: any) {
			return rejectWithValue({ error: err.response.data });
		}
	}
);

export const fetchCircularizationBaseGenerationExtract = createAsyncThunk(
	'circularizationBaseGeneration/getExtract',
	async ({  ...values }: any, { rejectWithValue, dispatch }) => {

		try {
			const response = await api.getExtract(values);
			return response
				
		} catch (err: any) {
			return rejectWithValue({ error: err.response.data });
		}
	}
);