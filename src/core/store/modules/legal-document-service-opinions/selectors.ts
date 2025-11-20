import { createSelector } from '@reduxjs/toolkit'
import { RootState } from 'src/core/store'

const state = (state: RootState) => state.legalDocServiceOpinions

export const getListLegalDocServiceOpinions = createSelector(
	[state],
	(state) => state.list ?? []
)

export const getItemLegalDocServiceOpinions = createSelector(
	[state],
	(state) => state.item
)

export const getStatusLegalDocServiceOpinions = createSelector(
	[state],
	(state) => state.status
)

export const getErrorMessageLegalDocServiceOpinions = createSelector(
	[state],
	({ error }) => error?.detail
)

export const getLoadingLegalDocServiceOpinions = createSelector(
	[state],
	(state) => state.status === 'fetching'
)

export const getListFiltersLegalDocServiceOpinions = createSelector(
	[state],
	({ listFilters }) => listFilters
)
