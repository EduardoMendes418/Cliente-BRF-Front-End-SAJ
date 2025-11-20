import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'src/core/store';
import { State } from './index'

const state = (state: RootState) => state.helpFiles;

export const getListHelpFiles = createSelector(
	[state],
	({ list }: State) => list
);

export const getListFiltersHelpFiles = createSelector(
	[state],
	({ listFilters }: State) => listFilters
);

export const getItemHelpFiles = createSelector(
	[state],
	({ item }) => item
);

export const getLoadingHelpFiles = createSelector(
	[state],
	(state) => state.status === 'fetching'
);

export const getStatusHelpFiles = createSelector(
	[state],
	({ status }) => status
);