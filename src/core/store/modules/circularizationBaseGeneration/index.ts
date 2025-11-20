import { createSlice } from '@reduxjs/toolkit';
import { fetchCircularizationBaseGeneration } from './thunks';

import { TState } from 'src/core/models';
import { clears, caseDefault } from '..';

export type TError = {
	detail: string;
};

export type State = {
	list: any[];
	item: any;
	error: TError;
	listFilters: any
};

const initialState: TState & State = {
	status: 'initial',
	list: [] as any[],
	item: {} as any,
	error: {} as TError,
	listFilters: {} as any,
};

const slice = createSlice({
	name: 'circularizationBaseGeneration',
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
		caseDefault(addCase, fetchCircularizationBaseGeneration)
	},
});

export default slice;