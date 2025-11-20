import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "src/core/store";
import { TError } from "./index";

const state = (state: RootState) => state.officeManagementRequestRefund;

export const getListOfficeManagementRequestRefund = createSelector(
  [state],
  (state) => state.list ?? []
);

export const getItemOfficeManagementRequestRefund = createSelector(
	[state],
	(state) => state.item ?? {}
  );
  
export const getStatusOfficeManagementRequestRefund = createSelector(
  [state],
  (state) => state.status
);

export const getErrorMessageOfficeManagementRequestRefund = createSelector(
  [state],
  ({ error }) => error as TError
);

export const getLoadingOfficeManagementRequestRefund = createSelector(
  [state],
  (state) => state.status === "fetching"
);

export const getListFiltersOfficeManagementRequestRefund = createSelector(
	[state],
	({ listFilters }) => listFilters
);
export const getListPreRequestRefund = createSelector(
	[state],
	({ preRequestRefund }) => preRequestRefund
);

export const getListPreRequestRefundItem = createSelector(
	[state],
	({ preRequestRefundItem }) => preRequestRefundItem
);

export const getPreRequestRefundIndex = createSelector(
	[state],
	({ index }) => index
);