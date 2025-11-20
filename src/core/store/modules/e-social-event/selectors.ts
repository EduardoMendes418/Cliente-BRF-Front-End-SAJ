import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'src/core/store';
import { State } from './index'

const state = (state: RootState) => state.eSocialEvent;

export const getListESocialEvent = createSelector(
	[state],
	({ list }: State) => list
);

export const getListFiltersESocialEvent = createSelector(
	[state],
	({ listFilters }: State) => listFilters
);

export const getLoadingESocialEvent = createSelector(
	[state],
	(state) => state.status === 'fetching'
);