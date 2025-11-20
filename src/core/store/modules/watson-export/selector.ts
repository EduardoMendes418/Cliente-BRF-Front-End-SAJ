import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'src/core/store';
import { State, TError } from './index'

const state = (state: RootState) => state.watsonExport;

export const getListExportWatson = createSelector(
	[state],
	({ list }: State) => list
);

export const getStatusExportWatson = createSelector(
	[state],
	({ status }) => status
);

export const getErrorMessageExportWatson = createSelector(
	[state],
	({ error }) => error as TError
);
export const getListFilters = createSelector(
	[state],
	({ listFilters }) => listFilters
);