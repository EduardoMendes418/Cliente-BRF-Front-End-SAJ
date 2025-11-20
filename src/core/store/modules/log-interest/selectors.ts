import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'src/core/store';

const state = (state: RootState) => state.logInterest;

export const getListLogInterest = createSelector(
	[state],
	(state) => state.list ?? []
);

export const getLoadingLogInterest = createSelector(
	[state],
	(state) => state.status === 'fetching',
);

export const getStatusLogInterest = createSelector(
	[state],
	(state) => state.status,
);

export const getErrorLogInterest = createSelector(
	[state],
	(state) => state.error,
);
