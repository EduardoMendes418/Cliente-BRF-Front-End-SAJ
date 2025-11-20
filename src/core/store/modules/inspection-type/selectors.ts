import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../..";

const state = (state: RootState) => state.inspectionType;

export const getListInspectionType = createSelector(
    [state],
    (state) => state.list
);

export const getItemInspectionType = createSelector(
    [state],
    (state) => state.item
);

export const getLoadingInspectionType = createSelector(
    [state],
    (state) => state.status === "fetching"
);

export const getStatusInspectionType = createSelector(
    [state],
    (state) => state.status
);
