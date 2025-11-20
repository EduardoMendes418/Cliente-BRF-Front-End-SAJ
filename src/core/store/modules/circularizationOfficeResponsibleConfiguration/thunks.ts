import { createAsyncThunk } from '@reduxjs/toolkit';
import api from 'src/core/api/circularizationOfficeResponsibleConfiguration'
import { actions} from '../..';
import { handleJSONError } from 'src/core/utils/func';

export const fetchCircularizationOfficeResponsibleConfiguration = createAsyncThunk(
	'circularizationOfficeResponsibleConfiguration/fetch',
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

export const addCircularizationOfficeResponsibleConfiguration = createAsyncThunk(
	'circularizationOfficeResponsibleConfiguration/add',
	async (values: any, { rejectWithValue }) => {
		try {
			const response = await api.add(values);

			return response.data
		} catch (err: any) {
			return rejectWithValue(handleJSONError(err));
		}
	}
);

export const fetchCircularizationOffices = createAsyncThunk(
	'circularizationOfficesConfiguration/fetch',
	async ( _, { rejectWithValue }) => {
		try {
			const response = await api.getOffices();
			return response
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);
