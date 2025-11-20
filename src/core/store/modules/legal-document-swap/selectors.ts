import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../..";

const state = (state: RootState) => state.legalDocSwap;

export const getListLegalDocSmartSwap = createSelector(
	[state],
	(state) => state.list ?? []
);

export const getIsFetchingLegalDocSmartSwap = createSelector(
	[state],
	({ status }) => status === "fetching"
);

export const getErrorMessageLegalDocSmartSwap = createSelector(
	[state],
	({ error }) => error.detail
);


export const getStatusLegalDocSmartSwap = createSelector([state], ({ status }) => status);