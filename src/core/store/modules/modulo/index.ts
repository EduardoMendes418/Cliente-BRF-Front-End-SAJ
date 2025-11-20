import { createSlice } from "@reduxjs/toolkit";
import { TState } from "src/core/models";
import { TModulo } from "src/core/models/modulo";
import { caseDefault } from "..";
import { fetchModuloList } from "./thunks";

export type State = {
	list: TModulo[];
} & TState;

const initialState: State = {
	list: [],
	status: "initial",
};

const slice = createSlice({
	name: "modulo",
	initialState,
	reducers: {},
	extraReducers: ({ addCase }) => {
		caseDefault(addCase, fetchModuloList, "list");
	},
});

export default slice;
