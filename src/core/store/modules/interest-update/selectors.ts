import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'src/core/store';
import { TError } from './index'

const state = (state: RootState) => state.interestUpdate;

export const getListInterestUpdate = createSelector(
	[state],
	(state) => state.list ?? []
);

export const getItemInterestUpdate = createSelector(
	[state],
	(state) => state.item
);

export const getStatusInterestUpdate = createSelector(
	[state],
	(state) => state.status
);

export const getErrorMessageInterestUpdate = createSelector(
	[state],
	({ error }) => error as TError
);

export const getLoadingInterestUpdate = createSelector(
	[state],
	(state) => state.status === 'fetching'
);

export const getListFiltersInterestUpdate = createSelector(
	[state],
	({ listFilters }) => listFilters
);