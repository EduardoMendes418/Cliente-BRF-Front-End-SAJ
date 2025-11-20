import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'src/core/store';
import { State } from './index'

const state = (state: RootState) => state.eSocialReasonsForDismissal;

export const getListESocialReasonsForDismissal = createSelector(
	[state],
	({ list }: State) => list
);

export const getListFiltersESocialReasonsForDismissal = createSelector(
	[state],
	({ listFilters }: State) => listFilters
);

export const getLoadingESocialReasonsForDismissal = createSelector(
	[state],
	(state) => state.status === 'fetching'
);