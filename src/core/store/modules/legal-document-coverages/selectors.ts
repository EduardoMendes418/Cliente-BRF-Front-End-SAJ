import { createSelector } from '@reduxjs/toolkit'
import { RootState } from 'src/core/store'

const state = (state: RootState) => state.legalDocCoverage

export const getListLegalDocCoverage = createSelector(
	[state],
	(state) => state.list ?? []
)

export const getItemLegalDocCoverage = createSelector(
	[state],
	(state) => state.item
)

export const getStatusLegalDocCoverage = createSelector(
	[state],
	(state) => state.status
)

export const getErrorMessageLegalDocCoverage = createSelector(
	[state],
	({ error }) => error?.detail
)

export const getLoadingLegalDocCoverage = createSelector(
	[state],
	(state) => state.status === 'fetching'
)

export const getListFiltersLegalDocCoverage = createSelector(
	[state],
	({ listFilters }) => listFilters
)
