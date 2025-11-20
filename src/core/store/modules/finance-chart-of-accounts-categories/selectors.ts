import { createSelector } from '@reduxjs/toolkit';

import { TState } from 'src/core/models';
import { RootState } from 'src/core/store';
import { State } from './index'

const state = (state: RootState) => state.financeChartOfAccountsCategories;

export const getListFinanceChartOfAccountsCategories = createSelector(
	[state],
	({ list }: State) => list
);

export const getListFinanceChartOfAccountsCategoriesAsOptions = createSelector([getListFinanceChartOfAccountsCategories], (list) =>
	list.map(({ name, id }) => ({ label: name, value: id }))
);

export const getFetchingFinanceChartOfAccountsCategories = createSelector(
	[state],
	({ status }: TState) => status === 'fetching'
);
