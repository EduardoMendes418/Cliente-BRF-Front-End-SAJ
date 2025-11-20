import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'src/core/store';
import { State } from './index'

const state = (state: RootState) => state.CircularizationLegalLaunch;

export const getListCircularizationLegalLaunch = createSelector(
	[state],
	({ list }: State) => list
);

export const getListFiltersCircularizationLegalLaunch = createSelector(
	[state],
	({ listFilters }: State) => listFilters
);

export const getLoadingCircularizationLegalLaunch = createSelector(
	[state],
	(state) => state.status === 'fetching'
);