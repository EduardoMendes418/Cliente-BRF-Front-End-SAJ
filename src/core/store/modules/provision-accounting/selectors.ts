import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'src/core/store';

const state = (state: RootState) => state.provisionAccounting;

export const getList = createSelector(
	[state],
	(state) => state.list ?? []
);

export const getStatus = createSelector(
	[state],
	(state) => state.status
);

export const getLoading = createSelector(
	[state],
	(state) => state.status === 'fetching'
);

export const getListFilters = createSelector(
	[state],
	({ listFilters }) => listFilters
);