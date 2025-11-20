import { createSlice } from "@reduxjs/toolkit";
import { TState } from "src/core/models";
import { TIntegrationResult } from "src/core/models/integrations";
import { caseDefault } from "..";
import { integrateCnpj, integrateCpf } from "./thunks";

export type TIntegrationState = {
	integrationsResult: TIntegrationResult[];
} & TState;

const initialState: TIntegrationState = {
	integrationsResult: [],
	status: "initial",
};

const slice = createSlice({
	name: "integrations",
	initialState,
	reducers: {
		cleanList: (state) => {
			state.integrationsResult = [];
		},
	},
	extraReducers: ({ addCase }) => {
		caseDefault(addCase, integrateCnpj, "integrationsResult");
		caseDefault(addCase, integrateCpf, "integrationsResult");
	},
});

export default slice;
