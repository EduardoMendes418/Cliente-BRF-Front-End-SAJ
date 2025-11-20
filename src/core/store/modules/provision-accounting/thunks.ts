import { createAsyncThunk } from '@reduxjs/toolkit';
import { actions } from '../..';
import api from 'src/core/api/provision-accounting';
import {getAxiosError, rejectNoValues} from "../../../utils/func";

export const getDefinitiveLow = createAsyncThunk(
	'provisionAccounting/definitiveLow',
	async (_, { rejectWithValue }) => {
		try {
			const response = await api.getDefinitiveLow()
			return response.data
		} catch (err: any) {
			return rejectWithValue({ error: err.response.data });
		}
	}
)

export const fetchProvisionAccounting = createAsyncThunk(
	'provisionAccounting/fetch',
	async ({ notPaginate, ...values }: any, { rejectWithValue, dispatch }) => {
		try {
			const response = await api.list({
				notPaginate,
				...values,
			});
			!notPaginate && dispatch(actions.pagination.setPageCount(response.data.pageCount)) 
			!notPaginate && dispatch(actions.pagination.setItemCount(response.data.itemCount))
			!notPaginate && dispatch(actions.pagination.setErrorsCount(response.data.errorsCount))
			return response.data
		} catch (err: any) {
			return rejectWithValue({ error: err.response.data });
		}
	}
);

export const getExportExcelFile = createAsyncThunk(
	"provisionAccounting/fetchExcel",
	async (filters: object, {rejectWithValue}) => {
		try {
			const filtersFormatted = rejectNoValues(filters);
			const response = await api.fetchExcel(filtersFormatted)
			return response.data
		} catch (err: unknown) {
			return rejectWithValue(getAxiosError(err)?.response?.data)
		}
	}
)

export const costCenterReclassification = createAsyncThunk(
	"provisionAccounting/costCenterReclassification",
	async (processId: number, { rejectWithValue }) => {
		try {
			const response = await api.costCenterReclassification(processId)
			return response.data
		} catch (err: any) {
			return rejectWithValue(err.response.data)
		}
	}
);