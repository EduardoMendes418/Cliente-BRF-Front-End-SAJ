import {TLitigationParticipantPosition} from "../../../models/litigation-participant-positions";
import {createSlice} from "@reduxjs/toolkit";
import {caseDefault} from "../index";
import {fetchLitigationParticipantPositions} from "./thunks";

export type State = {
	list: TLitigationParticipantPosition[]
}

const initialState: State = {
	list: []
}

const slice = createSlice({
	name: "litigationParticipantPositions",
	initialState,
	reducers: {
		clean(state) {
			state.list = []
		}
	},
	extraReducers: ({addCase}) => {
		caseDefault(addCase, fetchLitigationParticipantPositions)
	}
});

export default slice;