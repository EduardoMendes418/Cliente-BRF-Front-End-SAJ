import { LockSystem } from "src/core/models/lock-system";
import { createSlice } from "@reduxjs/toolkit";
import { caseDefault, caseDefaultRegister, clears } from "..";
import { addLockSystem, checkLockSystem, editLockSystem, fetchByIdLockSystem, fetchLockSystem } from "./thunks";
import { TState } from "src/core/models";

export type State = {
	list: LockSystem[];
	item?: LockSystem
	lock?: LockSystem[]
};

const initialState: State & TState = {
	list: [],
	status: "initial",
};

const slice = createSlice({
	name: "lockSystem",
	initialState,
	reducers: {
		...clears(initialState),
		clearItem(state) {
			state.item = undefined
		}
	},
	extraReducers({ addCase }) {
		caseDefault(addCase, fetchLockSystem, "list");
		caseDefault(addCase, fetchByIdLockSystem, "item")
		caseDefaultRegister(addCase, editLockSystem, "edited")
		caseDefaultRegister(addCase, addLockSystem, "added")
		caseDefault(addCase, checkLockSystem, "lock")
	},
});

export default slice;
