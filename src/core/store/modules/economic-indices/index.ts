import { createSlice } from '@reduxjs/toolkit';
import {
	fetchEconomicIndices,
	getEconomicIndices,
	addEconomicIndices,
	editEconomicIndices,
} from './thunks';
import { TEconomicIndices, TEconomicIndicesFilters } from 'src/core/models/economic-indices';
import { TState } from 'src/core/models';
import { clears, caseDefaultRegister, caseDefault } from '..';

export type TError = { detail: string };

export type State = {
	list: TEconomicIndices[];
	item: TEconomicIndices;
	listFilters: TEconomicIndicesFilters;
	error: TError;
};


export const initialState: TState & State = {
	status: 'initial',
	list: [] as TEconomicIndices[],
	item: {} as TEconomicIndices,
	listFilters: {} as TEconomicIndicesFilters,
	error: {} as TError
};

const slice = createSlice({
	name: 'economicIndices',
	initialState,
	reducers: {
		...clears(initialState),
		setItem: (state, { payload }) => {
			state.item = payload ?? {} as TEconomicIndices
		},

		setFilters(state, { payload }) {
			state.listFilters = payload ?? {} as TEconomicIndicesFilters
		},
	},
	extraReducers: ({ addCase }) => {
		caseDefault(addCase, fetchEconomicIndices)
		caseDefault(addCase, getEconomicIndices, 'item')
		caseDefaultRegister(addCase, addEconomicIndices, 'added')
		caseDefaultRegister(addCase, editEconomicIndices, 'edited')
	},
});

export default slice;
