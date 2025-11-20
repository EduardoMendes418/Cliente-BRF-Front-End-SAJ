import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'src/core/store';
import { State } from './index'

const state = (state: RootState) => state.ApprovationFlowManagement;

export const getListApprovationFlowManagement = createSelector(
	[state],
	({ list }: State) => list
);

export const getListFiltersApprovationFlowManagement = createSelector(
	[state],
	({ listFilters }: State) => listFilters
);

export const getLoadingApprovationFlowManagement = createSelector(
	[state],
	(state) => state.status === 'fetching'
);