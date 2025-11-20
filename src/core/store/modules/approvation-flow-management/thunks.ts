import { createAsyncThunk } from '@reduxjs/toolkit';
import api from 'src/core/api/approvation-flow-management'
import { actions} from '../..';

export const fetchApprovationFlowManagement = createAsyncThunk(
	'approvationFlowManagement/fetch',
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

export const reprocessApprovationFlow = createAsyncThunk(
	'approvationFlowManagement/reprocess',
	async (data: any, { rejectWithValue }) => {
		try {
			const response = await api.reprocessApprovationFlow(data);
			return response.data;
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
)

export const cancelPayment = createAsyncThunk(
	'approvationFlowManagement/cancel',
	async (values: any, { rejectWithValue }) => {
		try {
			const response = await api.cancelPayment(values);
			return response.data;
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);