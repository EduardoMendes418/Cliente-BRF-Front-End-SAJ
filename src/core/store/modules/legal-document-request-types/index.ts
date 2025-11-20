import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import {
	addLegalDocReqTypes,
	editLegalDocReqTypes,
	fetchLegalDocReqTypes,
	getLegalDocReqTypes,
} from './thunks'
import { TLegalDocRequestType, TLegalDocRequestTypeFilter } from 'src/core/models/legal-document-request-types'
import { TState } from 'src/core/models'
import { clears, caseDefaultRegister, caseDefault } from '..'

export type TError = { detail: string }

export type TLegalDocReqTypesState = {
	list: TLegalDocRequestType[]
	item?: TLegalDocRequestType
	listFilters: TLegalDocRequestTypeFilter
	error?: TError
}

const initialState: TState & TLegalDocReqTypesState = {
	status: 'initial',
	list: [],
	item: undefined,
	listFilters: {} as TLegalDocRequestTypeFilter,
}

const slice = createSlice({
	name: 'legalDocReqTypes',
	initialState,
	reducers: {
		...clears(initialState),

		setItem: (state, action: PayloadAction<TLegalDocRequestType>) => {
			state.item = action.payload
		},

		setFilters: (state, { payload }: PayloadAction<TLegalDocRequestTypeFilter>) => {
			state.listFilters = payload
		},
	},
	extraReducers: ({ addCase }) => {
		caseDefault(addCase, fetchLegalDocReqTypes)
		caseDefault(addCase, getLegalDocReqTypes, 'item')
		caseDefaultRegister(addCase, addLegalDocReqTypes, 'added')
		caseDefaultRegister(addCase, editLegalDocReqTypes, 'edited')
	},
})

export default slice
