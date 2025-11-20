import { createSlice } from "@reduxjs/toolkit";

import { TState } from "src/core/models";
import {
	TJudicialBlocksAndTransfers,
	TJudicialBlocksAndTransfersAcconting,
	TJudicialBlocksAndTransfersFilters,
} from "src/core/models/judicial-blocks-and-transfers";
import { t } from "src/locale/i18n";

import {
	addJudicialBlocksAndTransfers,
	editJudicialBlocksAndTransfers,
	fetchJudicialBlocksAndTransfersById,
	fetchJudicialBlocksAndTransfersList,
	fetchJudicialBlocksAndTransfersSapResponse,
	updateJudicialBlocksAndTransfersStatusFlow,
} from "./thunks";
import { caseDefault, caseDefaultRegister, clears } from "..";

export type State = {
	list: TJudicialBlocksAndTransfers[];
	listFilters: { [page: string]: TJudicialBlocksAndTransfersFilters };
	item: TJudicialBlocksAndTransfers;
	redirectUrl?: string;
	acconting?: TJudicialBlocksAndTransfersAcconting[];
};

const initialState: TState & State = {
	status: "initial",
	error: "",
	listFilters: {} as { [page: string]: TJudicialBlocksAndTransfersFilters },
	list: [] as TJudicialBlocksAndTransfers[],
	item: {} as TJudicialBlocksAndTransfers,
	redirectUrl: "",
};

const slice = createSlice({
	name: "judicialBlocksAndTransfers",
	initialState,
	reducers: {
		...clears(initialState),
		setFilters(state, { payload }) {
			state.listFilters[payload.page] = payload.filters;
		},
	},
	extraReducers: ({ addCase }) => {
		caseDefault(addCase, fetchJudicialBlocksAndTransfersList);
		caseDefaultRegister(addCase, addJudicialBlocksAndTransfers, "added");
		caseDefaultRegister(addCase, editJudicialBlocksAndTransfers, "edited");
		caseDefaultRegister(
			addCase,
			updateJudicialBlocksAndTransfersStatusFlow,
			"edited"
		);
		caseDefault(addCase, fetchJudicialBlocksAndTransfersSapResponse, "acconting")

		addCase(fetchJudicialBlocksAndTransfersById.pending, (state) => {
			state.status = "fetching";
		});

		addCase(fetchJudicialBlocksAndTransfersById.fulfilled, (state, action) => {
			if (action.payload) {
				state.item = action.payload as TJudicialBlocksAndTransfers;
				state.status = "initial";
			} else {
				state.status = "failure";
				state.error = t(
					"judicialBlocksAndTransfers:form.noJudicalBlocksAndTransfersFound"
				);

				let redirectUrl = window.location.pathname;
				redirectUrl = redirectUrl.slice(0, redirectUrl.lastIndexOf("/"));

				state.redirectUrl = redirectUrl;
			}
		});

		addCase(fetchJudicialBlocksAndTransfersById.rejected, (state, action) => {
			state.status = "failure";
			state.error = action.payload as Error;
			state.redirectUrl = "";
		});
	},
});

export default slice;
