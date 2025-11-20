import { createSelector } from '@reduxjs/toolkit'
import { FieldOptionStructure, TableOptionStructure } from 'src/core/models/legal-document-tables'
import { RootState } from 'src/core/store'

const state = (state: RootState) => state.legalDocTables

export const getListLegalDocTables = createSelector(
	[state],
	(state) => state.list || []
)

export const getListLegalDocTablesAsOptions = createSelector(
	[getListLegalDocTables],
	(list) => list.map(({ description, id, name, variables = [] }) => ({
		label: description || name,
		value: id,
		variables: variables.map(({ description, field, id }) => ({
			label: description || field,
			value: id,
		}))
	}))
)

type FieldDictionary = FieldOptionStructure & {
	table: TableOptionStructure
}

export const getListLegalDocTablesFieldDictionary = createSelector(
	[getListLegalDocTables],
	(list) => list.reduce((acc, table) => {
		table.variables.forEach((field) => {
			acc[field.id] = { ...field, table }
		})

		return acc
	}, {} as Record<number, FieldDictionary>)
)

export const getErrorMessageLegalDocTables = createSelector(
	[state],
	({ error }) => error?.detail
)