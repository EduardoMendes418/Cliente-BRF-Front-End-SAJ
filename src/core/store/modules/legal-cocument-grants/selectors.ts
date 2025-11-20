import { createSelector } from '@reduxjs/toolkit'
import { RootState } from 'src/core/store'

const state = (state: RootState) => state.legalDocGrants

export const getListLegalDocGrants = createSelector(
	[state],
	(state) => state.list ?? []
)

export const getItemLegalDocGrants = createSelector(
	[state],
	(state) => state.item
)

export const getStatusLegalDocGrants = createSelector(
	[state],
	(state) => state.status
)

export const getErrorMessageLegalDocGrants = createSelector(
	[state],
	({ error }) => error?.detail
)

export const getLoadingLegalDocGrants = createSelector(
	[state],
	(state) => state.status === 'fetching'
)

export const getListFiltersLegalDocGrants = createSelector(
	[state],
	({ listFilters }) => listFilters
)
