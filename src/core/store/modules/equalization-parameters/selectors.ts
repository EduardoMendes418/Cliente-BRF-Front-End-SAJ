import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'src/core/store';
import { State } from './index'

const state = (state: RootState) => state.equalizationParameters;

export const getListEqualizationParameters = createSelector(
	[state],
	({ list }: State) => list
);

export const getItemEqualizationParameters = createSelector(
	[state],
	({ item }) => item
);

export const getStatusEqualizationParameters = createSelector(
	[state],
	({ status }) => status
);

export const getSavingEqualizationParameters = createSelector(
	[state],
	({ status }) => status === 'saving'
);

export const getLoadingEqualizationParameters = createSelector(
	[state],
	({ status }) => status === 'fetching'
);

export const getListFiltersEqualizationParameters = createSelector(
	[state],
	({ listFilters }: State) => listFilters
);

export const getErrorMessageEqualizationParameters = createSelector(
	[state],
	({ error }: State): string => error?.detail
);
