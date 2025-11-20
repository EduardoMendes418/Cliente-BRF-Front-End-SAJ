import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'src/core/store';
import { State } from './index'

const state = (state: RootState) => state.CircularizationConfiguration;

export const getListCircularizationConfiguration = createSelector(
	[state],
	({ list }: State) => list
);

export const getListFiltersCircularizationConfiguration = createSelector(
	[state],
	({ listFilters }: State) => listFilters
);

export const getLoadingCircularizationConfiguration = createSelector(
	[state],
	(state) => state.status === 'fetching'
);