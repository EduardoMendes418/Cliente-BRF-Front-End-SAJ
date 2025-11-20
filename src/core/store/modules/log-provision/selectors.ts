import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'src/core/store';

import { getProcessIsFetching } from '../process/selectors';

const state = (state: RootState) => state.logProvison;

export const getSumOfValues = createSelector(
	[state],
	(state) => state.sumOfValues !== null ? state.sumOfValues : 0 
);

export const getStatusLogProvision = createSelector(
	[state],
	({ status }) => status
);

export const getLoadingLogProvision = createSelector(
	[state],
	({ status }) => status === 'fetching'
);

export const getFiltersLogProvision = createSelector(
	[state],
	(state) => state.listFilters
);

export const getRowsLogProvision = createSelector(
	[state],
	(state) => state.list
);

export const getIsFetchingLogProvision = createSelector(
	[getLoadingLogProvision, getProcessIsFetching],
	(isLogProvisionLoading, isProcessLoding) => isLogProvisionLoading || isProcessLoding
);
