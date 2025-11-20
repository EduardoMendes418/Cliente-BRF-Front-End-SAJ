import { createAsyncThunk } from '@reduxjs/toolkit';
import { TAddPaymentTypeMethod } from 'src/core/models/payment-type-method';
import api from 'src/core/api/payment-type-method';
import { actions } from '../..';

type Params = {
	tipoPagamentoID?: number;
	page?: number;
	pageSize?: number;
	notPaginate?: boolean;
	status?: boolean;
};

export const fetchPaymentTypeMethod = createAsyncThunk(
	'paymentTypeMethod/fetch',
	async ({ tipoPagamentoID, page, pageSize, notPaginate, status }: Params, { rejectWithValue, dispatch }) => {
		try {
			const response = await api.list({
				tipoPagamentoID,
				page,
				pageSize,
				status
			});
			!notPaginate && dispatch(actions.pagination.setPageCount(
				response.data.items ? response.data.pageCount : 0
			))
			return response.data;
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);

export const addPaymentTypeMethod = createAsyncThunk(
	'paymentTypeMethod/add',
	async (value: TAddPaymentTypeMethod, { rejectWithValue }) => {
		try {
			const response = await api.add(value);
			return response.data;
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);

export const editPaymentTypeMethod = createAsyncThunk(
	'paymentTypeMethod/edit',
	async (
		params: { id: string; values: TAddPaymentTypeMethod },
		{ rejectWithValue }
	) => {
		const { values } = params;
		try {
			const response = await api.add(values);
			return response.data;
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);
