import { createSlice } from "@reduxjs/toolkit"
import { TState } from "src/core/models"
import { TLegalDoc } from "src/core/models/legal-document-request"
import { caseDefault, clears } from ".."
import { fetchLegalDocumentSwap } from "./thunks"

export type TError = {
	detail: string;
};

export type State = {
	list: TLegalDoc[]
	error: TError
} & TState

const initialState: State = {
	status: 'initial',
	error: {} as TError,
	list: []
}

const slice = createSlice({
	name: "legalDocumentSwap",
	initialState,
	reducers: {
		...clears(initialState),
		

    clearList(state) {
      state.list = [];
    },
	},
	extraReducers: (builder) => {
		caseDefault(builder.addCase, fetchLegalDocumentSwap, "list")
	}
})

export default slice