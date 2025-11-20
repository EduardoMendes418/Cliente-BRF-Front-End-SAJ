import { createSlice } from '@reduxjs/toolkit';
import { fetchCircularizationBaseGenerationHeader, addCircularizationBaseGenerationHeader, fetchCircularizationBaseGenerationHeaderById, setHeaderStatus, fetchCircularizationBaseGenerationHeaderOffices } from './thunks';

import { TState } from 'src/core/models';
import { clears, caseDefaultRegister, caseDefault } from '..';

export type TError = {
	detail: string;
};

export type State = {
	list: any[];
	listOffices: any[]
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
	listOffices: [] as any[]
};

const slice = createSlice({
	name: 'circularizationBaseGenerationHeader',
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
		caseDefault(addCase, fetchCircularizationBaseGenerationHeader)
		caseDefault(addCase, fetchCircularizationBaseGenerationHeaderById, 'item')
		caseDefault(addCase, fetchCircularizationBaseGenerationHeaderOffices, 'listOffices' )
		caseDefault(addCase, setHeaderStatus)
		caseDefaultRegister(addCase, addCircularizationBaseGenerationHeader, 'added')
	},
});

export default slice;