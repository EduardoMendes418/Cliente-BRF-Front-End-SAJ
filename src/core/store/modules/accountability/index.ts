import { createSlice } from "@reduxjs/toolkit";
import { TState } from "src/core/models";
import { TAcconting } from "src/core/models/accountability";
import { caseDefault, clears } from "..";
import { getAccountingSapResponse, getAccountingSapResponseByJudicialBlocksAndTransferId } from "./thunks";

export type State = {
	sapResponse: TAcconting[];
	unlocks: TAcconting[];
} & TState;

const initialState: State = {
	status: "initial",
	sapResponse: [],
	unlocks: [],
};

const slice = createSlice({
	name: "accountability",
	initialState,
	reducers: {
		...clears(initialState),
	},
	extraReducers: ({ addCase }) => {
		caseDefault(addCase, getAccountingSapResponse, "sapResponse");
		caseDefault(addCase, getAccountingSapResponseByJudicialBlocksAndTransferId, "unlocks");
	},
});

export default slice;
