import { createSlice } from "@reduxjs/toolkit";

import {
  TOfficeManagementControl,
  TOfficeManagementControlFilter,
} from "src/core/models/office-management-control";
import { TState } from "src/core/models";
import {
  addOfficeManagementControl,
  deleteOfficeManagementControl,
  editOfficeManagementControl,
  fetchOfficeManagementControl,
  getOfficeManagementControl,
} from "./thunks";

import { clears, caseDefault, caseDefaultRegister } from "..";

export type TError = {
  id?: number;
  error: { detail: string };
};

export type TOfficeManagementControlState = {
  list: TOfficeManagementControl[];
  item?: TOfficeManagementControl;
  listFilters: TOfficeManagementControlFilter;
};

const initialState: TState & TOfficeManagementControlState = {
  status: "initial",
  list: [],
  error: {} as TError,
  item: undefined,
  listFilters: {} as TOfficeManagementControlFilter,
};

const slice = createSlice({
  name: "officeManagementControl",
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
    caseDefault(addCase, fetchOfficeManagementControl);
    caseDefault(addCase, getOfficeManagementControl, "item");
    caseDefaultRegister(addCase, addOfficeManagementControl, "added");
    caseDefaultRegister(addCase, editOfficeManagementControl, "edited");
    caseDefaultRegister(addCase, deleteOfficeManagementControl, "deleted");
  },
});

export default slice;
