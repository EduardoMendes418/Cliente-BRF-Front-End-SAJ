import { createSlice } from "@reduxjs/toolkit";

import {
  TOfficeManagementResponsible,
  TOfficeManagementResponsibleFilter,
} from "src/core/models/office-management-responsible";
import { TState } from "src/core/models";
import {
  addOfficeManagementResponsible,
  deleteOfficeManagementResponsible,
  editOfficeManagementResponsible,
  fetchOfficeManagementResponsible,
  getOfficeManagementResponsible,
} from "./thunks";

import { clears, caseDefault, caseDefaultRegister } from "..";

export type TError = {
  id?: number;
  error: { detail: string };
};

export type TOfficeManagementResponsibleState = {
  list: TOfficeManagementResponsible[];
  item?: TOfficeManagementResponsible;
  listFilters: TOfficeManagementResponsibleFilter;
};

const initialState: TState & TOfficeManagementResponsibleState = {
  status: "initial",
  list: [],
  error: {} as TError,
  item: undefined,
  listFilters: {} as TOfficeManagementResponsibleFilter,
};

const slice = createSlice({
  name: "officeManagementResponsible",
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
    caseDefault(addCase, fetchOfficeManagementResponsible);
    caseDefault(addCase, getOfficeManagementResponsible, "item");
    caseDefaultRegister(addCase, addOfficeManagementResponsible, "added");
    caseDefaultRegister(addCase, editOfficeManagementResponsible, "edited");
    caseDefaultRegister(addCase, deleteOfficeManagementResponsible, "deleted");
  },
});

export default slice;
