import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'src/core/store';
import { State } from './index'

const state = (state: RootState) => state.circularizationBaseGeneration;

export const getListCircularizationBaseGeneration = createSelector(
	[state],
	({ list }: State) => list
);

export const getListFiltersCircularizationBaseGeneration = createSelector(
	[state],
	({ listFilters }: State) => listFilters
);

export const getLoadingCircularizationBaseGeneration = createSelector(
	[state],
	(state) => state.status === 'fetching'
);