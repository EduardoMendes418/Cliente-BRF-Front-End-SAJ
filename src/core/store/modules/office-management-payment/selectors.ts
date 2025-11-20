import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "src/core/store";
import { TError } from "./index";

const state = (state: RootState) => state.officeManagementPayment;

export const getListOfficeManagementPayment = createSelector(
  [state],
  (state) => state.list ?? []
);

export const getStatusOfficeManagementPayment = createSelector(
  [state],
  (state) => state.status
);

export const getErrorMessageOfficeManagementPayment = createSelector(
  [state],
  ({ error }) => error as TError
);

export const getLoadingOfficeManagementPayment = createSelector(
  [state],
  (state) => state.status === "fetching"
);

export const getLoadingSavingOfficeManagementPayment = createSelector(
  [state],
  (state) => state.status === "saving"
);

export const getItemOfficeManagementPayment = createSelector(
  [state],
  ({ item }) => item
);

export const getListFiltersOfficeManagementPayment = createSelector(
  [state],
  ({ listFilters }) => listFilters
);
