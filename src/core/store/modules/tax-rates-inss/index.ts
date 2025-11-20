import { createSlice } from '@reduxjs/toolkit';
import {
	fetchTaxRatesINSS,
	getTaxRatesINSS,
	addTaxRatesINSS,
	editTaxRatesINSS,
	searchTaxRatesINSS
} from './thunks';
import {
	TTaxRatesINSS,
	TTaxRatesINSSFilters
} from 'src/core/models/tax-rates-inss';
import { TState } from 'src/core/models';
import { clears, caseDefaultRegister, caseDefault } from '..';

export type TError = {
	detail: string;
};

export type State = TState & {
	list: TTaxRatesINSS[];
	item: TTaxRatesINSS;
	listFilters: TTaxRatesINSSFilters;
	error: TError
};

const initialState: State = {
	status: 'initial',
	list: [] as TTaxRatesINSS[],
	item: {} as TTaxRatesINSS,
	listFilters: {} as TTaxRatesINSSFilters,
	error: {} as TError
};

const slice = createSlice({
	name: 'taxRatesINSS',
	initialState,
	reducers: {
		...clears(initialState),
		setItem: (state, { payload }) => {
			state.item = payload ?? {} as TTaxRatesINSS
		},

		setFilters(state, { payload }) {
			state.listFilters = payload ?? {} as TTaxRatesINSSFilters
		},
	},
	extraReducers: ({ addCase }) => {
		caseDefault(addCase, fetchTaxRatesINSS)
		caseDefault(addCase, getTaxRatesINSS, 'item')
		caseDefault(addCase, searchTaxRatesINSS, 'item')
		caseDefaultRegister(addCase, addTaxRatesINSS, 'added')
		caseDefaultRegister(addCase, editTaxRatesINSS, 'edited')
	},
});

export default slice;
