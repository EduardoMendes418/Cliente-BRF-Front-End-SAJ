import {TOptions} from "../../../models";
import {createSlice} from "@reduxjs/toolkit";
import {caseDefault} from "../index";
import {fetchLitigationJustice} from "./thunks";

export type State = {
	list: TOptions[]
}

const initialState: State = {
	list: []
}

const slice = createSlice({
	name: "litigationJustice",
	initialState,
	reducers: {},
	extraReducers: ({addCase}) => {
		caseDefault(addCase, fetchLitigationJustice)
	}
})

export default slice;