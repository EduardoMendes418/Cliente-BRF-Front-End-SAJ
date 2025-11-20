import { createSlice } from '@reduxjs/toolkit';

import { TOrderExpectation, TOrderExpectationFilter } from 'src/core/models/order-expectation';
import { TState } from 'src/core/models';

import {
	fetchOrderExpectations,
	fetchByNameOrderExpectation,
	getOrderExpectation,
	addOrderExpectation,
	editOrderExpectation
} from './thunks';
import { clears, caseDefault, caseDefaultRegister } from '..';

export type TError = {
	id?: number;
	error: { detail: string };
};

export type TOrderExpectationState = {
	list: TOrderExpectation[];
	item?: TOrderExpectation;
	listFilters: TOrderExpectationFilter
};

const initialState: TState & TOrderExpectationState = {
	status: 'initial',
	list: [],
	error: {} as TError,
	item: undefined,
	listFilters: {} as TOrderExpectationFilter
};

const slice = createSlice({
	name: 'orderExpectation',
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
		caseDefault(addCase, fetchOrderExpectations)
		caseDefault(addCase, fetchByNameOrderExpectation)
		caseDefault(addCase, getOrderExpectation, 'item')
		caseDefaultRegister(addCase, addOrderExpectation, 'added')
		caseDefaultRegister(addCase, editOrderExpectation, 'edited')
	},
});

export default slice;
