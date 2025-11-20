import { createSlice } from '@reduxjs/toolkit';
import {
	fetchIncomeTaxRates,
	getIncomeTaxRates,
	addIncomeTaxRates,
	editIncomeTaxRates,
	searchIncomeTaxRates,
} from './thunks';
import {
	TIncomeTaxRates,
	TIncomeTaxRatesFilters
} from 'src/core/models/income-tax-rates';
import { TState } from 'src/core/models';
import { clears, caseDefaultRegister, caseDefault } from '..';

export type TError = {
	detail: string;
};

export type State = TState & {
	list: TIncomeTaxRates[];
	item: TIncomeTaxRates;
	listFilters: TIncomeTaxRatesFilters;
	error: TError
};

const initialState: State = {
	status: 'initial',
	list: [] as TIncomeTaxRates[],
	item: {} as TIncomeTaxRates,
	listFilters: {} as TIncomeTaxRatesFilters,
	error: {} as TError
};

const slice = createSlice({
	name: 'incomeTaxRates',
	initialState,
	reducers: {
		...clears(initialState),
		setItem: (state, { payload }) => {
			state.item = payload ?? {} as TIncomeTaxRates
		},

		setFilters(state, { payload }) {
			state.listFilters = payload ?? {} as TIncomeTaxRatesFilters
		},
	},
	extraReducers: ({ addCase }) => {
		caseDefault(addCase, fetchIncomeTaxRates)
		caseDefault(addCase, getIncomeTaxRates, 'item')
		caseDefault(addCase, searchIncomeTaxRates, 'item')
		caseDefaultRegister(addCase, addIncomeTaxRates, 'added')
		caseDefaultRegister(addCase, editIncomeTaxRates, 'edited')
	},
});

export default slice;
