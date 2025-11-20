import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../..";

const state = (state: RootState) => state.integrations;

export const getIntegrationsResult = createSelector(
	[state],
	(state) => state.integrationsResult
);

export const getLoadingStatus = createSelector(
	[state],
	(state) => state.status === "fetching"
);
