import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'src/core/store';
import { TError } from './index'
import { TOptions } from 'src/components/form/AutocompleteField'

const state = (state: RootState) => state.explanatoryNote;

export const getListExplanatoryNote = createSelector(
	[state],
	(state) => state.list ?? []
);

export const getItemExplanatoryNote = createSelector(
	[state],
	(state) => state.item
);

export const getStatusExplanatoryNote = createSelector(
	[state],
	(state) => state.status
);

export const getErrorMessageExplanatoryNote = createSelector(
	[state],
	({ error }) => error as TError
);

export const getLoadingExplanatoryNote = createSelector(
	[state],
	(state) => state.status === 'fetching'
);

export const getListFiltersExplanatoryNote = createSelector(
	[state],
	({ listFilters }) => listFilters
);

export const getListExplanatoryNoteAsOptions = createSelector(
	[getListExplanatoryNote],
	(list) => list
		.filter((item => item.status))
		.map(({ description, id }) => ({ label: description, value: id })) as TOptions[]
);