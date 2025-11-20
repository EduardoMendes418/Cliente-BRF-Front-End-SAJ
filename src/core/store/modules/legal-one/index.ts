import { createSlice } from "@reduxjs/toolkit";
import { TState } from "src/core/models";
import { TCompany, TIndividual } from "src/core/models/legal-one";
import { caseDefault, clears } from "..";
import { fetchCompanyByCnpj, fetchIndividualsByCpf } from "./thunks";

export type State = {
	individuals: TIndividual[]
	companies: TCompany[]
}

const initialState: TState & State = {
	status: "initial",
	error: "",
	companies: [],
	individuals: []
} 

const slice = createSlice({
	name: "legalOne",
	initialState,
	reducers: clears(initialState),
	extraReducers({ addCase }) {
		caseDefault(addCase, fetchIndividualsByCpf, "individuals")
		caseDefault(addCase, fetchCompanyByCnpj, "companies")
	},
})

export default slice