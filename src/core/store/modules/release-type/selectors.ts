import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'src/core/store';
import { TError } from './index'
import { TOptions } from 'src/components/form/AutocompleteField'

const state = (state: RootState) => state.releaseType;

export const getListReleaseType = createSelector(
	[state],
	(state) => state.list ?? []
);

export const getItemReleaseType = createSelector(
	[state],
	(state) => state.item
);

export const getStatusReleaseType = createSelector(
	[state],
	(state) => state.status
);

export const getErrorMessageReleaseType = createSelector(
	[state],
	({ error }) => error as TError
);

export const getLoadingReleaseType = createSelector(
	[state],
	(state) => state.status === 'fetching'
);

export const getListFiltersReleaseType = createSelector(
	[state],
	({ listFilters }) => listFilters
);

export const getListReleaseTypeAsOptions = createSelector(
	[getListReleaseType],
	(list) => list
		.filter((item => item.status))
		.map(({ description, id }) => ({ label: description, value: id })) as TOptions[]
);