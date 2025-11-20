import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'src/core/store';
import { State } from './index'

const state = (state: RootState) => state.incomeTaxRates;

export const getListIncomeTaxRates = createSelector(
	[state],
	({ list }: State) => list
);

export const getItemIncomeTaxRates = createSelector(
	[state],
	({ item }: State) => item
);

export const getHasItemIncomeTaxRates = createSelector(
	[state],
	({ item }: State) => !!item.id
);

export const getStatusIncomeTaxRates = createSelector(
	[state],
	({ status }: State) => status
);

export const getLoadingIncomeTaxRates = createSelector(
	[state],
	({ status }: State) => status === 'fetching'
);

export const getErrorMessageIncomeTaxRates = createSelector(
	[state],
	({ error }: State): string => typeof error === 'string' ? error : error?.detail ?? ''
);

export const getListFiltersIncomeTaxRates = createSelector(
	[state],
	({ listFilters }: State) => listFilters
);
