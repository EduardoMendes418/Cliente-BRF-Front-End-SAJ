import { createSelector } from '@reduxjs/toolkit'

import { Block } from 'src/core/models/legal-document-draft-types'
import { RootState } from 'src/core/store'

const state = (state: RootState) => state.legalDocDraftTypes

export const getListLegalDocDraftTypes = createSelector(
	[state],
	(state) => state.list ?? []
)

export const getItemLegalDocDraftTypes = createSelector(
	[state],
	(state) => state.item
)

export const getStatusLegalDocDraftTypes = createSelector(
	[state],
	(state) => state.status
)

export const getErrorMessageLegalDocDraftTypes = createSelector(
	[state],
	({ error }) => error?.detail
)

export const getLoadingLegalDocDraftTypes = createSelector(
	[state],
	(state) => state.status === 'fetching'
)

export const getListFiltersLegalDocDraftTypes = createSelector(
	[state],
	({ listFilters }) => listFilters
)

export const getListLegalDocDraftTypeAsOptions = createSelector(
	[getListLegalDocDraftTypes],
	(list) => list.map(item => ({ label: item.name, value: item.id! }))
)

export const getBlocks = createSelector(
	[state],
	({ blocks }) => blocks
)

export const getBlocksAsOptions = createSelector(
	[getBlocks],
	(blocks) => blocks.map(block => ({ label: block.name, value: block.transientId }))
)

export const getBlocksAsDictionary = createSelector(
	[getBlocks],
	(blocks) => blocks.reduce((acc, block) => {
		if (block.id) acc.byId[block.id] = block
		if (block.transientId) acc.byTransientId[block.transientId] = block
		return acc
	}, { byId: {}, byTransientId: {} } as {
		byId: Record<number, Block>,
		byTransientId: Record<string, Block>
	})
)

export const getIsBlockOnEdition = createSelector(
	[state],
	({ blockOnEdition }) => Boolean(blockOnEdition)
)

export const getVariables = createSelector(
	[state],
	({ variables }) => variables
)

export const getIsVariableOnEdition = createSelector(
	[state],
	({ variableOnEdition }) => Boolean(variableOnEdition)
)
