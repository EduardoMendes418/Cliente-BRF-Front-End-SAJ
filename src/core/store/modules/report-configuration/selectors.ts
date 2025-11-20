import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'src/core/store';
import { State, TError } from './index'

const state = (state: RootState) => state.reportConfiguration;

export const getListReportConfiguration = createSelector(
	[state],
	({ list }: State) => list
);

export const getListFiltersReportConfiguration = createSelector(
	[state],
	({ listFilters }: State) => listFilters
);

export const getItemReportConfiguration = createSelector(
	[state],
	({ item }: State) => item
);

export const getHasItemReportConfiguration = createSelector(
	[getItemReportConfiguration],
	({ id }) => !!id
);

export const getStatusReportConfiguration = createSelector(
	[state],
	({ status }: State) => status
);

export const getErrorReportConfiguration = createSelector(
	[state],
	({ error }) => error as TError
);

export const getLoadingReportConfiguration = createSelector(
	[getStatusReportConfiguration],
	(status): boolean => status === 'fetching'
);

export const getSavingReportConfiguration = createSelector(
	[getStatusReportConfiguration],
	(status): boolean => status === 'saving'
);

export const getAddedReportConfiguration = createSelector(
	[state],
	({ reportConfigurationAdded }) => reportConfigurationAdded
);
