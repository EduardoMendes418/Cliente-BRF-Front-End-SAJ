import { createSlice } from '@reduxjs/toolkit';
import {
	fetchOrderDescriptions,
	fetchByNameOrderDescription,
	getOrderDescription,
	addOrderDescription,
	editOrderDescription
} from './thunks';
import { TOrderDescription, TOrderDescriptionFilter } from 'src/core/models/order-description';
import { TState } from 'src/core/models';
import { clears, caseDefaultRegister, caseDefault } from '..'

export type TError = {
	id?: number;
	error: { detail: string };
};

export type TOrderRatingsState = {
	list: TOrderDescription[];
	item?: TOrderDescription;
	listFilters: TOrderDescriptionFilter;
};

const initialState: TState & TOrderRatingsState = {
	status: 'initial',
	list: [],
	item: undefined,
	error: {} as TError,
	listFilters: {} as TOrderDescriptionFilter
};

const slice = createSlice({
	name: 'orderDescription',
	initialState,
	reducers: {
		...clears(initialState),

		setItem: (state, action) => {
			state.item = action.payload;
		},

		setFilters: (state, { payload }) => {
			state.listFilters = payload
		},
	},
	extraReducers: ({ addCase }) => {
		caseDefault(addCase, fetchOrderDescriptions)
		caseDefault(addCase, fetchByNameOrderDescription)
		caseDefault(addCase, getOrderDescription, 'item')
		caseDefaultRegister(addCase, addOrderDescription, 'added')
		caseDefaultRegister(addCase, editOrderDescription, 'edited')
	},
});

export default slice;