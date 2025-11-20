import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'src/core/store';
import { State } from '.'

const state = (state: RootState) => state.smartSwapExecution;

export const getSmartSwapExecution = createSelector(
	[state],
	(state) => state.list ?? []
);

export const getStatusSmartSwapExecution = createSelector(
	[state],
	({ status }) => status
);

export const getLoadingSmartSwapExecution = createSelector(
	[state],
	({ status }) => status === 'fetching'
);

export const getErrorMessageSmartSwapExecution = createSelector(
	[state],
	({ error }: State): string => error?.detail
);

export const getListFiltersSmartSwapExecution = createSelector(
	[state],
	({ listFilters }: State) => listFilters
);

export const getListStatusSmartSwapExecution = createSelector(
	[state],
	({ execution }: State) => execution
);

export const getListProcessSmartSwapExecution = createSelector(
	[state],
	({ process }: State) => process
);
