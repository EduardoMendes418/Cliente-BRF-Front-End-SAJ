import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'src/core/store';
import { State, TError } from './index'

const state = (state: RootState) => state.reportDictionary;

export const getListReportDictionary = createSelector(
	[state],
	({ list }: State) => list ?? []
);

export const getListFiltersReportDictionary = createSelector(
	[state],
	({ listFilters }: State) => listFilters
);

export const getStatusReportDictionary = createSelector(
	[state],
	({ status }: State) => status
);

export const getErrorReportDictionary = createSelector(
	[state],
	({ error }) => error as TError
);

export const getLoadingReportDictionary = createSelector(
	[getStatusReportDictionary],
	(status): boolean => status === 'fetching'
);

