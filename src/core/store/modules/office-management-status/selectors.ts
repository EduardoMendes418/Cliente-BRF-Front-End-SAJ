import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "src/core/store";
import { TError } from "./index";

const state = (state: RootState) => state.officeManagementStatus;

export const getListOfficeManagementStatus = createSelector(
  [state],
  (state) => state.list ?? []
);

export const getStatusOfficeManagementStatus = createSelector(
  [state],
  (state) => state.status
);

export const getErrorMessageOfficeManagementStatus = createSelector(
  [state],
  ({ error }) => error as TError
);

export const getLoadingOfficeManagementStatus = createSelector(
  [state],
  (state) => state.status === "fetching"
);

export const getItemOfficeManagementStatus = createSelector(
  [state],
  (state) => state.item
);

export const getListFiltersOfficeManagementStatus = createSelector(
  [state],
  ({ listFilters }) => listFilters
);
