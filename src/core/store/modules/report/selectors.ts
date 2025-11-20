import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "src/core/store";
import { State } from "./index";

const state = (state: RootState) => state.report;

export const getReportConfiguration = createSelector(
	[state],
	({ configuration }: State) => configuration
);
export const getListReports = createSelector(
	[state],
	({ list }: State) => list
);
export const getStatusReports = createSelector(
	[state],
	({ status }) => status
);

export const getLoadingReports = createSelector(
	[state],
	({ status }) => status === 'fetching'
);
export const getErrorReports = createSelector([state], ({ error }) => error);
