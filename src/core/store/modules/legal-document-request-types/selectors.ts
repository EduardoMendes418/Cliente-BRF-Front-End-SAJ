import { createSelector } from '@reduxjs/toolkit'
import { RootState } from 'src/core/store'

const state = (state: RootState) => state.legalDocReqTypes

export const getListLegalDocReqTypes = createSelector(
	[state],
	(state) => state.list ?? []
)

export const getItemLegalDocReqTypes = createSelector(
	[state],
	(state) => state.item
)

export const getStatusLegalDocReqTypes = createSelector(
	[state],
	(state) => state.status
)

export const getErrorMessageLegalDocReqTypes = createSelector(
	[state],
	({ error }) => error?.detail
)

export const getLoadingLegalDocReqTypes = createSelector(
	[state],
	(state) => state.status === 'fetching'
)

export const getListFiltersLegalDocReqTypes = createSelector(
	[state],
	({ listFilters }) => listFilters
)
