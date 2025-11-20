import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'src/core/store';
import { TError } from './index'
import { TOptions } from 'src/components/form/AutocompleteField'

const state = (state: RootState) => state.accountType;

export const getListAccountType = createSelector(
	[state],
	(state) => state.list ?? []
);

export const getItemAccountType = createSelector(
	[state],
	(state) => state.item
);

export const getStatusAccountType = createSelector(
	[state],
	(state) => state.status
);

export const getErrorMessageAccountType = createSelector(
	[state],
	({ error }) => error as TError
);

export const getLoadingAccountType = createSelector(
	[state],
	(state) => state.status === 'fetching'
);

export const getListFiltersAccountType = createSelector(
	[state],
	({ listFilters }) => listFilters
);

export const getListAccountTypeAsOptions = createSelector(
	[getListAccountType],
	(list) => list
		.filter((item => item.status))
		.map(({ description, id }) => ({ label: description, value: id })) as TOptions[]
);