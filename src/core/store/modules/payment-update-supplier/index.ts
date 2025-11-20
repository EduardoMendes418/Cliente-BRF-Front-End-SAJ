import { createSlice } from "@reduxjs/toolkit";
import { caseDefaultRegister } from "..";
import { updateSupplier } from "./thunks";

export type State = {}

const slice = createSlice({
	name: 'paymentUpdateSupplier',
	initialState: {},
	reducers: {},
	extraReducers: ({ addCase }) => {
		caseDefaultRegister(addCase, updateSupplier, 'edited')
	},
});


export default slice;