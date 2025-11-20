import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../..";
import { State } from ".";

const state = (state: RootState) => state.reportItemsCount;

export const getReportTotalItemsCount = createSelector([state], ({totalItems}: State) => totalItems);