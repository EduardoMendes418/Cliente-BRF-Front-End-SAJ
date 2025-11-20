import { createSlice } from '@reduxjs/toolkit';

import { TOrderStatus, TOrderStatusFilter } from 'src/core/models/order-status';
import { TState } from 'src/core/models';

import {
	fetchOrderStatuses,
	fetchByNameOrderStatus,
	getOrderStatus,
	addOrderStatus,
	editOrderStatus
} from './thunks';
import { clears, caseDefault, caseDefaultRegister } from '..';

export type TError = {
	id?: number;
	error: { detail: string };
};

export type TOrderStatusState = {
	list: TOrderStatus[];
	item?: TOrderStatus;
	listFilters: TOrderStatusFilter
};

const initialState: TState & TOrderStatusState = {
	status: 'initial',
	list: [],
	error: {} as TError,
	item: undefined,
	listFilters: {} as TOrderStatusFilter
};

const slice = createSlice({
	name: 'orderStatus',
	initialState,
	reducers: {
		...clears(initialState),
		setItem: (state, action) => {
			state.item = action.payload;
		},
		setFilters: (state, { payload }) => {
			state.listFilters = payload
		}
	},
	extraReducers: ({ addCase }) => {
		caseDefault(addCase, fetchOrderStatuses)
		caseDefault(addCase, fetchByNameOrderStatus)
		caseDefault(addCase, getOrderStatus, 'item')
		caseDefaultRegister(addCase, addOrderStatus, 'added')
		caseDefaultRegister(addCase, editOrderStatus, 'edited')
	},
});

export default slice;
