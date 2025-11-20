import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'src/core/store';
import { State } from './index'

const state = (state: RootState) => state.dataImport;

export const getDataImportFeedbackErrors = createSelector(
	[state], ({ lineErrorsFeedback }: State) => lineErrorsFeedback
);

export const getDataImportStatus = createSelector(
	[state], ({ status }: State) => status
);

export const getDataImportErrorMessage = createSelector(
	[state], ({ error }: State) => error
);

export const getDataImportFilters = createSelector(
	[state],
	({ listFilters }: State) => listFilters
);

export const getDataImportList = createSelector(
	[state],
	(state) => state.list ?? []
);

export const getDataImportRequests = createSelector(
	[state],
	(state) => state.requests ?? []
);