import { createSlice } from '@reduxjs/toolkit';

import { TState } from 'src/core/models';
import { TEqualization, TEqualizationFilters } from 'src/core/models/equalization';

import { fetchEqualizationList, fetchEqualizationById } from './thunks';
import { caseDefault, clears } from '..';

export type TError = { detail: string };

export type State = {
	list: TEqualization[];
	listFilters?: TEqualizationFilters;
	item: TEqualization;
	error: TError;
};

const initialState: TState & State = {
	status: 'initial',
	error: {} as TError,
	list: [] as TEqualization[],
	item: {} as TEqualization
};

const slice = createSlice({
	name: 'equalization',
	initialState,
	reducers: {
		...clears(initialState),
		setFilters(state, action) {
			state.listFilters = action.payload;
		},
	},
	extraReducers: ({ addCase }) => {
		caseDefault(addCase, fetchEqualizationList)
		caseDefault(addCase, fetchEqualizationById, 'item')
	}
});

export default slice;
