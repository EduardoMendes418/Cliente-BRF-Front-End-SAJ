import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../..";

const state = (state: RootState) => state.inspectionMethod;

export const getListInspectionMethod = createSelector(
    [state],
    (state) => state.list ?? []
);

export const getItemInspectionMethod = createSelector(
    [state],
    (state) => state.item
);

export const getLoadingInspectionMethod = createSelector(
    [state],
    (state) => state.status === "fetching"
);

export const getStatusInspectionMethod = createSelector(
    [state],
    (state) => state.status
);
