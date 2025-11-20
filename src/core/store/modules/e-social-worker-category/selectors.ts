import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'src/core/store';
import { State } from './index'

const state = (state: RootState) => state.eSocialWorkerCategory;

export const getListESocialWorkerCategory = createSelector(
	[state],
	({ list }: State) => list
);

export const getListFiltersESocialWorkerCategory = createSelector(
	[state],
	({ listFilters }: State) => listFilters
);

export const getLoadingESocialWorkerCategory = createSelector(
	[state],
	(state) => state.status === 'fetching'
);