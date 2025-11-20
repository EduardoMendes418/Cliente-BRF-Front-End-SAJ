import { createSlice } from '@reduxjs/toolkit/dist';
import { TState } from 'src/core/models';
import { clears, caseDefaultRegister, caseDefault } from '..'

import { TOrderConfrontingType, TOrderConfrontingFilter } from 'src/core/models/confronting-parameters';

import {
	fetchOrderConfrontings,
	getOrderConfronting,
	addOrderConfronting,
	editOrderConfronting,
	deleteOrderConfronting,
} from './thunks';

export type TError = {
	id?: number;
	error: { detail: string };
};

export type TOrderConfrontingState = {
	list: TOrderConfrontingType[];
	item?: TOrderConfrontingType;
	listFilters: TOrderConfrontingFilter;
};

const initialState: TState & TOrderConfrontingState = {
	status: 'initial',
	list: [] as TOrderConfrontingType[],
	error: {} as TError,
	listFilters: {} as TOrderConfrontingFilter,
};

const slice = createSlice({
	name: 'orderConfrontingParameters',
	initialState,
	reducers: {
		...clears(initialState),
		setFilters: (state, action) => {
			state.listFilters = action.payload
		},

		setItem: (state, action) => {
			state.item = action.payload;
		},
	},
	extraReducers: ({ addCase }) => {
		caseDefault(addCase, fetchOrderConfrontings)
		caseDefault(addCase, getOrderConfronting, 'item')
		caseDefaultRegister(addCase, addOrderConfronting, 'added')
		caseDefaultRegister(addCase, editOrderConfronting, 'edited')
		caseDefaultRegister(addCase, deleteOrderConfronting, 'deleted')
	},
});

export default slice;