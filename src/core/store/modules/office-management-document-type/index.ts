import { createSlice } from "@reduxjs/toolkit";

import {
  TOfficeManagementDocumentType,
  TOfficeManagementDocumentTypeFilter,
} from "src/core/models/office-management-document-type";
import { TState } from "src/core/models";
import {
  addOfficeManagementDocumentType,
  deleteOfficeManagementDocumentType,
  editOfficeManagementDocumentType,
  fetchOfficeManagementDocumentType,
  getOfficeManagementDocumentType,
} from "./thunks";

import { clears, caseDefault, caseDefaultRegister } from "..";

export type TError = {
  id?: number;
  error: { detail: string };
};

export type TOfficeManagementDocumentTypeState = {
  list: TOfficeManagementDocumentType[];
  item?: TOfficeManagementDocumentType;
  listFilters: TOfficeManagementDocumentTypeFilter;
};

const initialState: TState & TOfficeManagementDocumentTypeState = {
  status: "initial",
  list: [],
  error: {} as TError,
  item: undefined,
  listFilters: {} as TOfficeManagementDocumentTypeFilter,
};

const slice = createSlice({
  name: "officeManagementDocumentType",
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
    caseDefault(addCase, fetchOfficeManagementDocumentType);
    caseDefault(addCase, getOfficeManagementDocumentType, "item");
    caseDefaultRegister(addCase, addOfficeManagementDocumentType, "added");
    caseDefaultRegister(addCase, editOfficeManagementDocumentType, "edited");
    caseDefaultRegister(addCase, deleteOfficeManagementDocumentType, "deleted");
  },
});

export default slice;
