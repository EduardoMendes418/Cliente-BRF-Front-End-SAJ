import { createSlice } from "@reduxjs/toolkit";

import {
  TOfficeManagementStatus,
  TOfficeManagementStatusFilters,
} from "src/core/models/office-management-status";
import { TState } from "src/core/models";

import {
  addOfficeManagementStatus,
  deleteOfficeManagementStatus,
  editOfficeManagementStatus,
  fetchOfficeManagementStatus,
  getOfficeManagementStatus,
} from "./thunks";

import { clears, caseDefault, caseDefaultRegister } from "..";

export type TError = {
  id?: number;
  error: { detail: string };
};

export type TOfficeManagementStatusState = {
  list: TOfficeManagementStatus[];
  item?: TOfficeManagementStatus;
  listFilters: TOfficeManagementStatusFilters;
};

const initialState: TState & TOfficeManagementStatusState = {
  status: "initial",
  list: [],
  error: {} as TError,
  item: undefined,
  listFilters: {} as TOfficeManagementStatusFilters,
};

const slice = createSlice({
  name: "officeManagementStatus",
  initialState,
  reducers: {
    ...clears(initialState),
    setItem: (state, action) => {
      state.item = action.payload;
    },
    setFilters: (state, { payload }) => {
      state.listFilters = payload;
    },
    setStatusInitial: (state) => {
      state.status = "initial";
    },
  },
  extraReducers: ({ addCase }) => {
    caseDefault(addCase, fetchOfficeManagementStatus);
    caseDefault(addCase, getOfficeManagementStatus, "item");
    caseDefaultRegister(addCase, addOfficeManagementStatus, "added");
    caseDefaultRegister(addCase, editOfficeManagementStatus, "edited");
    caseDefaultRegister(addCase, deleteOfficeManagementStatus, "deleted");
  },
});

export default slice;
