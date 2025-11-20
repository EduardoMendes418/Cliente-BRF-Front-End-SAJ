import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'src/core/store';
import { TError } from './index'

const state = (state: RootState) => state.businessCombinationAccounting;

export const getListBusinessCombinationAccounting = createSelector(
	[state],
	(state) => state.list ?? []
);

export const getStatusBusinessCombinationAccounting = createSelector(
	[state],
	(state) => state.status
);

export const getErrorMessageBusinessCombinationAccounting = createSelector(
	[state],
	({ error }) => error as TError
);

export const getLoadingBusinessCombinationAccounting = createSelector(
	[state],
	(state) => state.status === 'fetching'
);
