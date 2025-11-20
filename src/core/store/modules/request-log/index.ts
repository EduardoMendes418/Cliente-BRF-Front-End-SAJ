import { createSlice } from '@reduxjs/toolkit';
import { fetchRequestLog } from './thunk';

import { clears, caseDefault } from '..';


export type TError = { detail: string };

export type State = {
	list: any[];
	item: any;
	listFilters: any;
	error: TError;
};


export const initialState: any = {
	status: 'initial',
	list: [] as any[],
	item: {} as any,
	listFilters: {} as any,
	error: {} as TError
};

const slice = createSlice({
	name: 'requestLog',
	initialState,
	reducers: {
		...clears(initialState),
		setItem: (state, { payload }) => {
			state.item = payload ?? {} as any
		},

		setFilters(state, { payload }) {
			state.listFilters = payload ?? {} as any
		},
	},
	extraReducers: ({ addCase }) => {
		caseDefault(addCase, fetchRequestLog)
	},
});

export default slice;
