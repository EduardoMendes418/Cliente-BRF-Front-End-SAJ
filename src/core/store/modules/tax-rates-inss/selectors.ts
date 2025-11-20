import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'src/core/store';
import { State } from './index'

const state = (state: RootState) => state.taxRatesINSS;

export const getListTaxRatesINSS = createSelector(
	[state],
	({ list }: State) => list
);

export const getItemTaxRatesINSS = createSelector(
	[state],
	({ item }: State) => item
);

export const getHasItemTaxRatesINSS = createSelector(
	[state],
	({ item }: State) => !!item.id
);

export const getStatusTaxRatesINSS = createSelector(
	[state],
	({ status }: State) => status
);

export const getLoadingTaxRatesINSS = createSelector(
	[state],
	({ status }: State) => status === 'fetching'
);

export const getErrorMessageTaxRatesINSS = createSelector(
	[state],
	({ error }: State): string => {
		if (!error) return '';

		if (typeof error === 'object' && error !== null) return error.detail;

		return error as string;
	}
);

export const getListFiltersTaxRatesINSS = createSelector(
	[state],
	({ listFilters }: State) => listFilters
);
