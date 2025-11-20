import { createSlice } from "@reduxjs/toolkit";

import {
  TOfficeManagementPayment,
  TOfficeManagementPaymentFilter,
} from "src/core/models/office-management-payment";
import { TState } from "src/core/models";
import {
  addOfficeManagementPayment,
  fetchOfficeManagementPayment,
  getOfficeManagementPayment,
} from "./thunks";

import { clears, caseDefault, caseDefaultRegister } from "..";

export type TError = {
  id?: number;
  error: { detail: string };
};

export type TOfficeManagementPaymentState = {
  list: TOfficeManagementPayment[];
  item?: TOfficeManagementPayment;
  listFilters: TOfficeManagementPaymentFilter;
};

const initialState: TState & TOfficeManagementPaymentState = {
  status: "initial",
  list: [],
  error: {} as TError,
  item: undefined,
  listFilters: {} as TOfficeManagementPaymentFilter,
};

const slice = createSlice({
  name: "officeManagementPayment",
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
    caseDefault(addCase, fetchOfficeManagementPayment);
    caseDefault(addCase, getOfficeManagementPayment, "item");
    caseDefaultRegister(addCase, addOfficeManagementPayment, "added");
  },
});

export default slice;
