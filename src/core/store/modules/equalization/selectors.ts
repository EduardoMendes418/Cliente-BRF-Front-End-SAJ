import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'src/core/store';
import { State } from './index'

const state = (state: RootState) => state.equalization;

export const getListEqualization = createSelector(
	[state],
	({ list }: State) => list
);

export const getItemEqualization = createSelector(
	[state],
	({ item }) => item
);

export const getHasItemEqualization = createSelector(
	[state],
	({ item }) => !!item.id
);

export const getStatusEqualization = createSelector(
	[state],
	({ status }) => status
);

export const getLoadingEqualization = createSelector(
	[state],
	({ status }) => status === 'fetching'
);

export const getListFiltersEqualization = createSelector(
	[state],
	({ listFilters }: State) => listFilters
);

export const getErrorMessageEqualization = createSelector(
	[state],
	({ error }: State): string => error?.detail
);
