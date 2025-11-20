import { createSlice } from "@reduxjs/toolkit";

import {
  TOfficeManagementInvoice,
  TOfficeManagementInvoiceFilter,
} from "src/core/models/office-management-invoice";
import { TState } from "src/core/models";
import {
  addOfficeManagementInvoice,
  deleteOfficeManagementInvoice,
  editOfficeManagementInvoice,
  fetchOfficeManagementInvoice,
  getOfficeManagementInvoice,
} from "./thunks";

import { clears, caseDefault, caseDefaultRegister } from "..";

export type TError = {
  id?: number;
  error: { detail: string };
};

export type TOfficeManagementInvoiceState = {
  list: TOfficeManagementInvoice[];
  item?: TOfficeManagementInvoice;
  listFilters: TOfficeManagementInvoiceFilter;
};

const initialState: TState & TOfficeManagementInvoiceState = {
  status: "initial",
  list: [],
  error: {} as TError,
  item: undefined,
  listFilters: {} as TOfficeManagementInvoiceFilter,
};

const slice = createSlice({
  name: "officeManagementInvoice",
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
    caseDefault(addCase, fetchOfficeManagementInvoice);
    caseDefault(addCase, getOfficeManagementInvoice, "item");
    caseDefaultRegister(addCase, addOfficeManagementInvoice, "added");
    caseDefaultRegister(addCase, editOfficeManagementInvoice, "edited");
    caseDefaultRegister(addCase, deleteOfficeManagementInvoice, "deleted");
  },
});

export default slice;
