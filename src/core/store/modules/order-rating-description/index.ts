import { createSlice } from '@reduxjs/toolkit';
import {
	fetchOrderRatingDescriptions,
	fetchByNameOrderRatingDescription,
	getOrderRatingDescription,
	addOrderRatingDescription,
	editOrderRatingDescription
} from './thunks';
import { TOrderRatingDescription, TOrderRatingDescriptionFilter } from 'src/core/models/order-rating-description';
import { TState } from 'src/core/models';
import { clears, caseDefaultRegister, caseDefault } from '..'

export type TError = {
	id?: number;
	error: { detail: string };
};

export type TOrderRatingsState = {
	list: TOrderRatingDescription[];
	item?: TOrderRatingDescription;
	listFilters: TOrderRatingDescriptionFilter;
};

const initialState: TState & TOrderRatingsState = {
	status: 'initial',
	list: [],
	item: undefined,
	error: {} as TError,
	listFilters: {} as TOrderRatingDescriptionFilter
};

const slice = createSlice({
	name: 'orderRatingDescription',
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
		caseDefault(addCase, fetchOrderRatingDescriptions)
		caseDefault(addCase, fetchByNameOrderRatingDescription)
		caseDefault(addCase, getOrderRatingDescription, 'item')
		caseDefaultRegister(addCase, addOrderRatingDescription, 'added')
		caseDefaultRegister(addCase, editOrderRatingDescription, 'edited')
	},
});

export default slice;