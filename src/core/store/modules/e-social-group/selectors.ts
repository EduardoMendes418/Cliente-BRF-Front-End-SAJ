import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'src/core/store';
import { State } from './index'

const state = (state: RootState) => state.eSocialGroup;

export const getListESocialGroup = createSelector(
	[state],
	({ list }: State) => list
);

export const getListFiltersESocialGroup = createSelector(
	[state],
	({ listFilters }: State) => listFilters
);

export const getLoadingESocialGroup = createSelector(
	[state],
	(state) => state.status === 'fetching'
);