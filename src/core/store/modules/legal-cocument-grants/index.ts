import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TState } from "src/core/models";
import { TLegalDocGrants, TLegalDocGrantsFilter } from "src/core/models/legal-document-grants";
import { caseDefault, caseDefaultRegister, clears } from "..";
import { addLegalDocGrants, editLegalDocGrants, fetchLegalDocGrants, getLegalDocGrants } from "./thunks";

export type TError = { detail: string }

export type TLegalDocGrantsState = {
	list: TLegalDocGrants[];
	item?: TLegalDocGrants;
	listFilters: TLegalDocGrantsFilter;
	error?: TError
}

const initialState: TState & TLegalDocGrantsState = {
	status: "initial",
	list: [],
	item: undefined,
	listFilters: {} as TLegalDocGrants
}

const slice = createSlice({
	name: "legalDocGrants",
	initialState,
	reducers: {
		...clears(initialState),
		
		setItem: (state, action: PayloadAction<TLegalDocGrants>) => {
			state.item = action.payload;
		},

		setFilters: (state, { payload }: PayloadAction<TLegalDocGrantsFilter>) => {
			state.listFilters = payload
		},
	},
	extraReducers: ({ addCase }) => {
		caseDefault(addCase, fetchLegalDocGrants)
		caseDefault(addCase, getLegalDocGrants, 'item')
		caseDefaultRegister(addCase, addLegalDocGrants, 'added')
		caseDefaultRegister(addCase, editLegalDocGrants, 'edited')
	},
})

export default slice;