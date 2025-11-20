import { createSlice } from '@reduxjs/toolkit';

import { TOrderProbability, TOrderProbabilityFilter } from 'src/core/models/order-probability';
import { TState } from 'src/core/models';

import {
	fetchOrderProbabilities,
	fetchByNameOrderProbability,
	getOrderProbability,
	addOrderProbability,
	editOrderProbability
} from './thunks';
import { clears, caseDefault, caseDefaultRegister } from '..';

export type TError = {
	id?: number;
	error: { detail: string };
};

export type TOrderProbabilityState = {
	list: TOrderProbability[];
	item?: TOrderProbability,
	listFilters: TOrderProbabilityFilter
};

const initialState: TState & TOrderProbabilityState = {
	status: 'initial',
	list: [],
	error: {} as TError,
	item: undefined,
	listFilters: {} as TOrderProbabilityFilter
};

const slice = createSlice({
	name: 'orderProbability',
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
		caseDefault(addCase, fetchOrderProbabilities)
		caseDefault(addCase, fetchByNameOrderProbability)
		caseDefault(addCase, getOrderProbability, 'item')
		caseDefaultRegister(addCase, addOrderProbability, 'added')
		caseDefaultRegister(addCase, editOrderProbability, 'edited')
	},

});

export default slice;