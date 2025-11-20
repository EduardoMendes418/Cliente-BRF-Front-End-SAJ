import { createSlice } from "@reduxjs/toolkit"

import { getLegalDocTables } from 'src/core/store/modules/legal-document-tables/thunks'
import { TableOptionStructure } from "src/core/models/legal-document-tables"
import { TState } from "src/core/models"

import { clears, caseDefault } from ".."

export type TError = { detail: string }

export type TLegalDocTables = {
	list: TableOptionStructure[]
	error?: TError
}

const initialState: TState & TLegalDocTables = {
	status: 'initial',
	list: [],
}

const slice = createSlice({
	name: 'legalDocTables',
	initialState,
	reducers: {
		...clears(initialState),
	},
	extraReducers: ({ addCase }) => {
		caseDefault(addCase, getLegalDocTables)
	},
})

export default slice
