import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../..";

const state = (state: RootState) => state.accountability;

export const listAccountingSapResponse = createSelector([state], (state) => {
	return state.sapResponse;
});

export const listAccountingSapResponseByJudicialBlocksAndTransferId = createSelector([state], (state) => {
	return state.unlocks;
});
