import { createSlice } from '@reduxjs/toolkit';

import { TState } from 'src/core/models';
import { TFinanceChartOfAccountsCategories } from 'src/core/models/finance-chart-of-accounts-categories';

import { fetchFinanceChartOfAccountsCategoriesList } from './thunks';
import { caseDefault, clears } from '..';

export type TError = { detail: string };

export type State = {
	list: TFinanceChartOfAccountsCategories[];
	error: TError;
};

const initialState: TState & State = {
	status: 'initial',
	error: {} as TError,
	list: [] as TFinanceChartOfAccountsCategories[],
};

const slice = createSlice({
	name: 'financeChartOfAccountsCategories',
	initialState,
	reducers: {
		...clears(initialState)
	},
	extraReducers: ({ addCase }) => {
		caseDefault(addCase, fetchFinanceChartOfAccountsCategoriesList)
	}
});

export default slice;
