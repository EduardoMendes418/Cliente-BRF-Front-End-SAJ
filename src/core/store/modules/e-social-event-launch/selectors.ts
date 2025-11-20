import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'src/core/store';
import { State } from './index'

const state = (state: RootState) => state.eSocialEventLauch;

export const getListESocialEventLauch = createSelector(
	[state],
	({ list }: State) => list
);

export const getItemESocialEventLauch = createSelector(
	[state],
	({ item }: State) => item
);

export const getErrorMessage = createSelector(
	[state],
	({ error }: State) => error
);

export const getListFiltersESocialEventLauch = createSelector(
	[state],
	({ listFilters }: State) => listFilters
);

export const getStatus = createSelector(
	[state],
	({ status }: State) => status
);

export const getLoadingESocialEventLauch = createSelector(
	[state],
	(state) => state.status === 'fetching'
);

export const getSearchEventLauch = createSelector(
	[state],
	(state) => state.search
);

export const getHasItemEventLauch = createSelector(
	[state],
	({ item }) => !!item?.id
);

export const getAutocompleteESocialData = createSelector(
	[state],
	({ autocompleteESocialData }) => autocompleteESocialData
);
