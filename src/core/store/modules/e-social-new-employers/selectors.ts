import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'src/core/store';
import { State } from './index'

const state = (state: RootState) => state.eSocialClosure;

export const getListESocialClosureEmployer = createSelector(
	[state],
	({ list }: State) => list
);

export const getItemESocialClosureEmployer = createSelector(
	[state],
	({ item }: State) => item
);

export const getListFiltersESocialClosureEmployer = createSelector(
	[state],
	({ listFilters }: State) => listFilters
);

export const getLoadingESocialClosureEmployer = createSelector(
	[state],
	(state) => state.status === 'fetching'
);