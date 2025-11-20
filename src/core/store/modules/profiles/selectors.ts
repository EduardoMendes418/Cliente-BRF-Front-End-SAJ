import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'src/core/store';
import { State } from './index'

const state = (state: RootState) => state.profiles;

export const getListProfiles = createSelector(
	[state],
	({ list }: State) => list
);

export const getItemProfiles = createSelector(
	[state],
	({ item }: State) => item
);

export const getStatusProfiles = createSelector(
	[state],
	({ status }) => status
);

export const getLoadingProfiles = createSelector(
	[state],
	({ status }) => status === 'fetching'
);

export const getErrorMessageProfiles = createSelector(
	[state],
	({ error }: State): string => error?.detail
);

export const getListFiltersProfiles = createSelector(
	[state],
	({ listFilters }: State) => listFilters
);

export const getListProfilesAsOptions = createSelector([getListProfiles], (list) =>
	list
		.filter(({ status }) => status)
		.map(({ description, id }) => ({ label: description, value: Number(id) }))
);
