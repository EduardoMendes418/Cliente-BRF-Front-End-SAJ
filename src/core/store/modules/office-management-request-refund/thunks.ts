import { createAsyncThunk } from '@reduxjs/toolkit';
import {
	TOfficeManagementRequestRefundParams
} from "src/core/models/office-management-request-refund";
import { actions, RootState } from 'src/core/store';
import api from 'src/core/api/office-management-request-refund';
import {TRefunds} from "../../../models/office-management-payment";


export const fetchOfficeManagementRequestRefund = createAsyncThunk(
	'officeManagementRequestRefund/fetch',
	async (params: TOfficeManagementRequestRefundParams, { rejectWithValue, dispatch }) => {
		try {
			const response = await api.list(params);
			dispatch(actions.pagination.setPageCount(response.data.pageCount))
			return response.data
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);
export const getOfficeManagementRequestRefund = createAsyncThunk(
	'officeManagementRequestRefund/get',
	async (id: number, { getState }) => {
		const { paymentRequest: { list } } = getState() as RootState

		const item = list.find((item) => item.id === id)
		if (item) return item

		const response = await api.list({ refundSolicitationId: id });
		const element = response.data.items[0]
		
		element.refunds = element.refunds?.map((x: TRefunds) => ({
			...x,
			areaDejur: (x.areaDejur as {name: string})?.name,
			requester: (x.requester as {name: string})?.name
		}))
		
		return element
	}
);

export const addfficeManagementRequestRefund  = createAsyncThunk(
	'officeManagementRequestRefund/add',
	async (values: any, { rejectWithValue }) => {
		try {
			try {
				const response = await api.add(values);
				return response
			} catch (err: any) {
				return rejectWithValue(err.response.data);
			}
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);