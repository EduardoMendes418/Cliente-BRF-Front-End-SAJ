import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "src/core/store";

const state = (state: RootState) => state.costCenter;

export const getIsFetchingCostCenter = createSelector(
  [state],
  ({ status }) => status === "fetching"
);

export const getFilterCostCenter = createSelector(
  [state],
  ({ filter }) => filter
);

export const getMultipleListCostCenter = createSelector(
  [state],
  ({ multipleList }) => multipleList
);

export const getListCostCenter = createSelector([state], ({ list }) => {
  return list && list.length ? list : [];
});
