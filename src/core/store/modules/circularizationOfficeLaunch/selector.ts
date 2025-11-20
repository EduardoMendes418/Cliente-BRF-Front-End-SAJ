import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'src/core/store';
import { State } from './index'

const state = (state: RootState) => state.CircularizationOfficeLaunch;

export const getListCircularizationOfficeLaunch = createSelector(
	[state],
	({ list }: State) => list
);

export const getListFiltersCircularizationOfficeLaunch = createSelector(
	[state],
	({ listFilters }: State) => listFilters
);

export const getLoadingCircularizationOfficeLaunch = createSelector(
	[state],
	(state) => state.status === 'fetching'
);