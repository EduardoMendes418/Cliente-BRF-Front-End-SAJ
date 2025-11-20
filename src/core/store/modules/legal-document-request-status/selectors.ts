import { createSelector } from '@reduxjs/toolkit'
import { RootState } from 'src/core/store'

const state = (state: RootState) => state.legalDocReqStatus

export const getListLegalDocReqStatus = createSelector(
	[state],
	(state) => state.list ?? []
)

export const getItemLegalDocReqStatus = createSelector(
	[state],
	(state) => state.item
)

export const getStatusLegalDocReqStatus = createSelector(
	[state],
	(state) => state.status
)

export const getErrorMessageLegalDocReqStatus = createSelector(
	[state],
	({ error }) => error?.detail
)

export const getLoadingLegalDocReqStatus = createSelector(
	[state],
	(state) => state.status === 'fetching'
)

export const getListFiltersLegalDocReqStatus = createSelector(
	[state],
	({ listFilters }) => listFilters
)
