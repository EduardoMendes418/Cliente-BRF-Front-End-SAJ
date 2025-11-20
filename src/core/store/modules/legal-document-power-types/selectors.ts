import { createSelector } from '@reduxjs/toolkit'
import { RootState } from 'src/core/store'

const state = (state: RootState) => state.legalDocPowerTypes

export const getListLegalDocPowerTypes = createSelector(
	[state],
	(state) => state.list ?? []
)

export const getItemLegalDocPowerTypes = createSelector(
	[state],
	(state) => state.item
)

export const getStatusLegalDocPowerTypes = createSelector(
	[state],
	(state) => state.status
)

export const getErrorMessageLegalDocPowerTypes = createSelector(
	[state],
	({ error }) => error?.detail
)

export const getLoadingLegalDocPowerTypes = createSelector(
	[state],
	(state) => state.status === 'fetching'
)

export const getListFiltersLegalDocPowerTypes = createSelector(
	[state],
	({ listFilters }) => listFilters
)
