import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'src/core/store';
import { State } from './index'

const state = (state: RootState) => state.eSocialTables;

export const getListESocialTables = createSelector(
	[state],
	({ list }: State) => list
);

export const getListFiltersESocialTables = createSelector(
	[state],
	({ listFilters }: State) => listFilters
);

export const getLoadingESocialTables = createSelector(
	[state],
	(state) => state.status === 'fetching'
);